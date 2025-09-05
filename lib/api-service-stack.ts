// lib/api-service-stack.ts
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_elasticloadbalancingv2 as elbv2,
    aws_iam as iam,
    aws_logs as logs,
    aws_secretsmanager as secrets,
} from "aws-cdk-lib";

type Props = cdk.StackProps & {
    imageTag: string; // e.g. "latest" or a git SHA
    desiredCount?: number; // default 1
    cpu?: number; // default 256
    memoryMiB?: number; // default 512
};

export class ApiServiceStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        // ---- Imports from other stacks (exports) ----
        const vpcId = cdk.Fn.importValue("VersoStat-VpcId");
        const vpcAzs = cdk.Fn.importValue("VersoStat-AvailabilityZones")
            .split(",")
            .map((s) => s.trim());
        const privateSubnetIds = cdk.Fn.importValue(
            "VersoStat-PrivateSubnetIds"
        )
            .split(",")
            .map((s) => s.trim());
        const privateSubnetRouteTableIds = cdk.Fn.importValue(
            "VersoStat-PrivateSubnetRouteTableIds"
        )
            .split(",")
            .map((s) => s.trim());

        const clusterName = cdk.Fn.importValue("VersoStat-ClusterName");
        const clusterArn = cdk.Fn.importValue("VersoStat-ClusterArn");
        const listenerArn = cdk.Fn.importValue("VersoStat-HttpListenerArn");
        const taskSgId = cdk.Fn.importValue("VersoStat-TaskSecurityGroupId");
        const repoUri = cdk.Fn.importValue("VersoStat-EcrRepositoryUri");

        const dbHost = cdk.Fn.importValue("VersoStat-DbHost");
        const dbPort = Number(cdk.Fn.importValue("VersoStat-DbPort"));
        const dbSecretArn = cdk.Fn.importValue("VersoStat-DbSecretArn");
        const dbSgId = cdk.Fn.importValue("VersoStat-DbSecurityGroupId");

        // ---- VPC / Cluster from attributes ----
        const vpc = ec2.Vpc.fromVpcAttributes(this, "ImportedVpc", {
            vpcId,
            availabilityZones: vpcAzs,
            privateSubnetIds,
            privateSubnetRouteTableIds,
        });

        const cluster = ecs.Cluster.fromClusterAttributes(
            this,
            "ImportedCluster",
            {
                clusterArn,
                clusterName,
                vpc,
            }
        );

        // ---- SGs from IDs ----
        const taskSg = ec2.SecurityGroup.fromSecurityGroupId(
            this,
            "TaskSg",
            taskSgId
        );
        const dbSg = ec2.SecurityGroup.fromSecurityGroupId(
            this,
            "DbSg",
            dbSgId
        );

        // ---- Imported ALB Listener (IApplicationListener is fine here) ----
        const listenerRefSg = new ec2.SecurityGroup(this, "ListenerRefSg", {
            vpc,
            description: "Placeholder SG for imported ALB listener reference",
            allowAllOutbound: true,
        });

        const listener =
            elbv2.ApplicationListener.fromApplicationListenerAttributes(
                this,
                "ImportedListener",
                { listenerArn, securityGroup: listenerRefSg }
            );

        // ---- Logs ----
        const logGroup = new logs.LogGroup(this, "ApiSvcLogs", {
            retention: logs.RetentionDays.ONE_MONTH,
        });

        // ---- Task Definition / Container ----
        const taskDef = new ecs.FargateTaskDefinition(this, "TaskDef", {
            cpu: props.cpu ?? 256,
            memoryLimitMiB: props.memoryMiB ?? 512,
        });

        taskDef.addToTaskRolePolicy(
            new iam.PolicyStatement({
                actions: [
                    "ssmmessages:CreateControlChannel",
                    "ssmmessages:CreateDataChannel",
                    "ssmmessages:OpenControlChannel",
                    "ssmmessages:OpenDataChannel",
                ],
                resources: ["*"],
            })
        );

        taskDef
            .obtainExecutionRole()
            .addManagedPolicy(
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    "service-role/AmazonECSTaskExecutionRolePolicy"
                )
            );

        const image = ecs.ContainerImage.fromRegistry(
            `${repoUri}:${props.imageTag}`
        );

        const container = taskDef.addContainer("web", {
            image,
            logging: ecs.LogDriver.awsLogs({ logGroup, streamPrefix: "api" }),
            environment: {
                NODE_ENV: "production",
                DB_HOST: dbHost,
                DB_PORT: String(dbPort),
                DB_NAME: "versostat_db",
                PORT: "4000",
            },
            secrets: {
                DB_USER: ecs.Secret.fromSecretsManager(
                    secrets.Secret.fromSecretCompleteArn(
                        this,
                        "DbUser",
                        dbSecretArn
                    ),
                    "username"
                ),
                DB_PASSWORD: ecs.Secret.fromSecretsManager(
                    secrets.Secret.fromSecretCompleteArn(
                        this,
                        "DbPass",
                        dbSecretArn
                    ),
                    "password"
                ),
            },
            portMappings: [{ containerPort: 4000 }], // hostPort implicit == containerPort in awsvpc
        });

        // ---- Fargate Service ----
        const service = new ecs.FargateService(this, "ApiService", {
            cluster,
            taskDefinition: taskDef,
            desiredCount: props.desiredCount ?? 1,
            assignPublicIp: false,
            securityGroups: [taskSg],
            vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
            circuitBreaker: { rollback: true },
            enableExecuteCommand: true,
        });

        const scaling = service.autoScaleTaskCount({
            minCapacity: 1,
            maxCapacity: 4,
        });

        scaling.scaleOnCpuUtilization("CpuScaling", {
            targetUtilizationPercent: 60, // Aim to keep avg CPU ~60%
            scaleOutCooldown: cdk.Duration.seconds(60),
            scaleInCooldown: cdk.Duration.seconds(120),
        });

        // Prefer SPOT with on-demand fallback
        const cfnSvc = service.node.defaultChild as ecs.CfnService;
        cfnSvc.launchType = undefined;
        cfnSvc.capacityProviderStrategy = [
            { capacityProvider: "FARGATE_SPOT", weight: 1 },
            { capacityProvider: "FARGATE", weight: 1 },
        ];
        cfnSvc.deploymentConfiguration = {
            minimumHealthyPercent: 100,
            maximumPercent: 200,
        };

        // Ensure subnets are a CFN list (not a single string)
        const privateSubnetIdsToken = cdk.Fn.importValue(
            "VersoStat-PrivateSubnetIds"
        );
        const subnetList = cdk.Fn.split(",", privateSubnetIdsToken);
        cfnSvc.addPropertyOverride(
            "NetworkConfiguration.AwsvpcConfiguration.Subnets",
            subnetList
        );
        cfnSvc.addPropertyOverride(
            "NetworkConfiguration.AwsvpcConfiguration.SecurityGroups",
            [taskSg.securityGroupId]
        );
        cfnSvc.addPropertyOverride(
            "NetworkConfiguration.AwsvpcConfiguration.AssignPublicIp",
            "DISABLED"
        );

        // ---- Target Group on port 4000 + Listener Rule ----
        const tg = new elbv2.ApplicationTargetGroup(this, "ApiTg", {
            vpc,
            targetType: elbv2.TargetType.IP, // Fargate -> IP targets
            port: 4000, // MUST match container port
            protocol: elbv2.ApplicationProtocol.HTTP,
            healthCheck: {
                path: "/health",
                healthyHttpCodes: "200-399",
                port: "traffic-port",
            },
        });

        // Attach the ECS service to the TG explicitly
        service.attachToApplicationTargetGroup(tg);

        // Forward HTTP listener traffic to the TG
        new elbv2.ApplicationListenerRule(this, "ApiRule", {
            listener,
            priority: 10,
            conditions: [elbv2.ListenerCondition.pathPatterns(["/*"])],
            action: elbv2.ListenerAction.forward([tg]),
        });

        // ---- Allow ECS tasks to reach Postgres ----
        dbSg.addIngressRule(
            taskSg,
            ec2.Port.tcp(5432),
            "ECS tasks to RDS 5432"
        );

        new cdk.CfnOutput(this, "ServiceName", { value: service.serviceName });
    }
}
