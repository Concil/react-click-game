import {Bank} from "../bank";


export interface BankController {
    get(): Promise<Bank[]>;
}