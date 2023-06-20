import {BackReference, entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";


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