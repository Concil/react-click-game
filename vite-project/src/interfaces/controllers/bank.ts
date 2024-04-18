import {Bank} from "../database/bank";
import {BankHackers} from "../database/bankHacker";


export interface BankController {
    get(): Promise<Bank[]>;
    getUser(): Promise<BankHackers[]>;
    hack(id: string, userId: string): Promise<boolean>;
}