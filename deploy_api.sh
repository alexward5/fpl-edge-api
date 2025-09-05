#!/usr/bin/env bash
set -euo pipefail

REGION="us-east-1"
STACK="VersoStat-ApiServiceStack-prod"
IMAGE_TAG="latest"

echo "Region:        $REGION"
echo "Image tag:     $IMAGE_TAG"
echo "Service stack: $STACK"

# 1) Get ECR repo URI from CFN export
REPO_URI=$(aws cloudformation list-exports --region "$REGION" \
  --query "Exports[?Name=='VersoStat-EcrRepositoryUri'].Value" --output text)
echo "ECR repo URI:  $REPO_URI"

# 2) Build for linux/amd64 (so Fargate can run it)
if ! docker buildx ls >/dev/null 2>&1; then
  docker buildx create --use >/dev/null
fi
docker buildx build --platform linux/amd64 -t "$REPO_URI:$IMAGE_TAG" .

# 3) Login + push
aws ecr get-login-password --region "$REGION" \
| docker login --username AWS --password-stdin "$(echo "$REPO_URI" | awk -F/ '{print $1}')"

docker push "$REPO_URI:$IMAGE_TAG"

# 4) Deploy the Service stack with IMAGE_TAG=latest
export IMAGE_TAG
cdk deploy "$STACK" --require-approval never

# 5) Force a new deployment so ECS tasks pull the new image
CLUSTER=$(aws cloudformation list-exports --region "$REGION" \
  --query "Exports[?Name=='VersoStat-ClusterName'].Value" --output text)
SERVICE=$(aws cloudformation list-stack-resources --stack-name "$STACK" --region "$REGION" \
  --query "StackResourceSummaries[?ResourceType=='AWS::ECS::Service'].PhysicalResourceId" --output text)

aws ecs update-service --cluster "$CLUSTER" --service "$SERVICE" \
  --region "$REGION" --force-new-deployment

echo "Deployed image: $REPO_URI:$IMAGE_TAG"
