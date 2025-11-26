import cors from "cors";
import express, { Application } from "express";

export function createApp(): Application {
    const app: Application = express();

    app.use(cors());
    app.use(express.json());

    return app;
}

/*
Creates the Express app instance with common middlewares.
Routes are mounted in main.ts.
*/
