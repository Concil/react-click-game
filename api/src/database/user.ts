import {BackReference, entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {InventoryItem} from "./inventory";


@entity.name('users')
export class User {
    id: UUID & PrimaryKey = uuid();

    username!: string;
    email!: string;
    password!: string;

    health: number = 1000;
    scrap: number = 0; // um gewisse items mit schrott kaufen zu können / vielleicht sogar fürs crafting!
    money: number = 0;
    exp: number = 0;
    lastLogin?: Date;

    cpu?: InventoryItem & Reference;
    gpu?: InventoryItem & Reference;
    ram1?: InventoryItem & Reference;
    ram2?: InventoryItem & Reference;
    ram3?: InventoryItem & Reference;
    ram4?: InventoryItem & Reference;

    confirmed: boolean = false;
    registerCode: string = "";
    created: Date = new Date();
}

@entity.name('user_sessions')
export class UserSession {
    id: UUID & PrimaryKey = uuid();

    user!: User & Reference;
    expire!: Date;
    created: Date = new Date();
}