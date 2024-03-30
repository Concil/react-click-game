import {RPCSecurity} from "../middlewares/token";
import {APP_Database} from "../config/database";


export class HackRPCSecurity extends RPCSecurity {
    constructor(public database: APP_Database) {
        super(database);
    }
}