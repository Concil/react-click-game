import {User} from "./user";


export interface Bank {
    id: string;
    name: string;
    countryCode: string;
    bankCode: string;
    iban: string;
    money: number;
    hackers: User[];
    created: Date;
    deleteAt: Date;
}