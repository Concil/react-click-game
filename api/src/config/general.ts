import {Hack} from "../database/hack";
import {User, UserSession} from "../database/user";
import {UserSkill} from "../database/skill";
import {Job, JobGroup, UserJob} from "../database/job";
import {Jackpot, UserJackpot} from "../database/jackpot";
import {InventoryItem} from "../database/inventory";
import {Blackmarket, UserBlackmarket} from "../database/blackmarket";
import {Craft} from "../database/craft";
import {Item} from "../database/item";
import {Redeem} from "../database/redeem";
import {Bank} from "../database/bank";
import {IPScan} from "../database/ipscan";


export class Config {
    secret: string = "4b9a7a24613df27b649c3939ab3e4d8d6f0480a4a1e24b5a960f0c71902a1f26";

    databases: any[] = [
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
    ]
}