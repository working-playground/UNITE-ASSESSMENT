import * as dotenv from "dotenv";

dotenv.config();

export interface AppConfig {
    port: number;
    nodeEnv: string;
    mysqlHost: string;
    mysqlPort: number;
    mysqlUser: string;
    mysqlPassword: string;
    mysqlDatabase: string;
    mongoUri: string;
}

export function getConfig(): AppConfig {
    const portString: string = process.env.PORT || "3000";
    const mysqlPortString: string = process.env.MYSQL_PORT || "3306";

    const port: number = parseInt(portString, 10);
    const mysqlPort: number = parseInt(mysqlPortString, 10);

    const nodeEnv: string = process.env.NODE_ENV || "development";
    const mysqlHost: string = process.env.MYSQL_HOST || "localhost";
    const mysqlUser: string = process.env.MYSQL_USER || "root";
    const mysqlPassword: string = process.env.MYSQL_PASSWORD || "";
    const mysqlDatabase: string = process.env.MYSQL_DATABASE || "unite";
    const mongoUri: string = process.env.MONGO_URI || "mongodb://localhost:27017/unite";

    return {
        port,
        nodeEnv,
        mysqlHost,
        mysqlPort,
        mysqlUser,
        mysqlPassword,
        mysqlDatabase,
        mongoUri
    };
}