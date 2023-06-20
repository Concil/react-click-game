import {User} from "./user";

export interface IPScan {
    id: string;

    user: User;
    ip: string;
    found: number;

    created: Date;
    endAt: Date;
}