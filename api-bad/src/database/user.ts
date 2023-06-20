import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";


@entity.name('users')
export class User {
    id: UUID & PrimaryKey = uuid();

    username!: string;
    email!: string;
    password!: string;

    health: number = 1000;
    money: number = 0;
    exp: number = 0;
    lastLogin?: Date;
    session?: UserSession & Reference;

    created: Date = new Date();
}

@entity.name('user_sessions')
export class UserSession {
    id: UUID & PrimaryKey = uuid();

    user!: User & Reference;
    expire!: Date;
    created: Date = new Date();
}