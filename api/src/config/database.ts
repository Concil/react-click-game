import {Database} from "@deepkit/orm";
import {MySQLDatabaseAdapter} from "@deepkit/mysql";
import {User, UserSession} from "../database/user";
import {UserSkill} from "../database/skill";
import {Job, JobGroup, UserJob} from "../database/job";
import {Jackpot, UserJackpot} from "../database/jackpot";
import {InventoryItem} from "../database/inventory";
import {Blackmarket, UserBlackmarket} from "../database/blackmarket";
import {Item} from "../database/item";
import {Redeem} from "../database/redeem";
import {Craft} from "../database/craft";
import {Bank} from "../database/bank";
import {IPScan} from "../database/ipscan";
import {Hack} from "../database/hack";


export const database = new Database(new MySQLDatabaseAdapter({
    host: 'localhost',
    user: "root",
    password: "",
    database: "hacker",
    port: 3306
}), [
    Hack,
    User,
    UserSession,
    UserSkill,
    UserJob,
    UserJackpot,
    InventoryItem,
    UserBlackmarket,
    Craft,
    Blackmarket,
    Item,
    Jackpot,
    Job,
    JobGroup,
    Redeem,
    Bank,
    IPScan,
]);