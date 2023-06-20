import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {User} from "./user";
import {Item} from "./item";

@entity.name("blackmarket")
export class Blackmarket {
    id: UUID & PrimaryKey = uuid();

    user?: User & Reference; //wenn undefined dann ist nutzer root;
    item!: Item & Reference;
    amount: number = 1;
    price: number = 0;

    created: Date = new Date();
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