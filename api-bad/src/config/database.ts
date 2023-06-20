import {Database} from "@deepkit/orm";
import {UserSkill} from "../database/skill";
import {Job, UserJob} from "../database/job";
import {Jackpot, UserJackpot} from "../database/jackpot";
import {InventoryItem} from "../database/inventory";
import {Blackmarket, UserBlackmarket} from "../database/blackmarket";
import {Item} from "../database/item";
import {Redeem} from "../database/redeem";
import {MySQLDatabaseAdapter} from "@deepkit/mysql";
import {User, UserSession} from "../database/user";

export const database = new Database(new MySQLDatabaseAdapter({
    host: 'localhost',
    user: "root",
    password: "",
    database: "hacker",
    port: 3306
}), [
    User,
    UserSession,
    UserSkill,
    UserJob,
    UserJackpot,
    InventoryItem,
    UserBlackmarket,

    Blackmarket,
    Item,
    Jackpot,
    Job,
    Redeem,
]);