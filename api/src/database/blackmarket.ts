import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {User} from "./user";
import {Item} from "./item";

@entity.name("blackmarket")
export class Blackmarket {
    id: UUID & PrimaryKey = uuid();

    user?: User & Reference;
    item!: Item & Reference;
    condition: number = 0.9;
    amount: number = 1;
    price: number = 0;

    created: Date = new Date();
    activeAt: Date = new Date();
    deleteAt?: Date; //if assigned, delete item at given date
}

/** als Verlauf gedacht */
@entity.name("user_blackmarket")
export class UserBlackmarket {
    id: UUID & PrimaryKey = uuid();

    boughtUser?: User & Reference;
    item!: Item & Reference;
    amount: number = 1;
    price: number = 0;

    user!: User & Reference;
    created: Date = new Date();
}