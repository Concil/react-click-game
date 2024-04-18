import {Bank} from "../database/bank";


export interface BankController {
    get(): Promise<Bank[]>;
    hack(id: string, userId: string): Promise<boolean>;
}