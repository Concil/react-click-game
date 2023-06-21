import {Bank} from "../database/bank";


export interface BankController {
    get(): Promise<Bank[]>;
}