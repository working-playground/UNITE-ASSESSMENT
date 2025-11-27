import { createApp } from "./app";
import { getConfig } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { connectMongo } from "./persistence/mongo/connection";
import { testMySqlConnection } from "./persistence/mysql/connection";
import { initMySqlSchema } from "./persistence/mysql/init";
import { initializeMySqlSchema } from "./persistence/mysql/schemaInitializer";
import { callTaskRouter } from "./routes/callTask.route";
import { leadRouter } from "./routes/lead.route";
import { reportRouter } from "./routes/report.route";
import { csvImportRouter } from "./routes/upload.route";
import { userRouter } from "./routes/user.route";

async function bootstrap(): Promise<void> {
    try {
        await testMySqlConnection();
        await initializeMySqlSchema();
        await connectMongo();

        const app = createApp();
        const config = getConfig();
        await initMySqlSchema();

        app.get("/ping", function (req, res) {
            res.json({ message: "pong" });
        });

        app.use("/user", userRouter);
        app.use("/lead", leadRouter);
        app.use("/call-task", callTaskRouter);
        app.use("/import", csvImportRouter);
        app.use("/report", reportRouter);

        app.use(errorHandler);

        app.listen(config.port, function () {
            console.log("Server is running on port " + config.port + " in " + config.nodeEnv + " mode");
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

bootstrap();
