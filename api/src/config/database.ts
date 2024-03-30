import {Database} from "@deepkit/orm";
import {MySQLDatabaseAdapter} from "@deepkit/mysql";
import {Config} from "./general";

export class APP_Database extends Database {
    constructor(public config: Config) {
        super(new MySQLDatabaseAdapter({
            host: config.DATABASE_HOST,
            user: config.DATABASE_USER,
            password: config.DATABASE_PASS,
            database: config.DATABASE_NAME,
            port: config.DATABASE_PORT
        }), config.databases);
    }
}
