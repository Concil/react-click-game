import {User} from "./user";
import {Bank} from "./bank";


export interface BankHackers {
    id: string;
    percent: number;
    hacker: User;
    bank: Bank;
}