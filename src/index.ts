import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { json } from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createServer from "./apollo-server";

(async () => {
    const PORT = Number(process.env.PORT ?? 4000);
    const HOST = process.env.HOST ?? "0.0.0.0"; // important for ECS/ALB

    const app = express();

    // Health endpoint for ALB
    app.get("/health", (_req: Request, res: Response) =>
        res.status(200).send("ok")
    );

    // Apollo on /graphql
    const apollo = createServer();
    await apollo.start();
    app.use(
        "/graphql",
        cors<cors.CorsRequest>(),
        json(),
        expressMiddleware(apollo)
    );

    app.listen(PORT, HOST, () => {
        console.log(
            `HTTP listening on http://${HOST}:${PORT}  (GraphQL at /graphql)`
        );
    });
})();
