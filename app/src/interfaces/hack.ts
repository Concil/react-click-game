import {User} from "./user";

export interface Hack {
    id: string;

    user: User;
    fromUser?: User;
    money: number;
    created: Date;
}