import {User} from "./user";
import {Item} from "./item";

export interface Blackmarket {
    id: string;

    user?: User;
    item: Item;
    condition: number;
    amount: number;
    price: number;

    created: Date;
    activeAt: Date;
    deleteAt?: Date;
}