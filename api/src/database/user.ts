import {entity, PrimaryKey, uuid, UUID} from "@deepkit/type";


@entity.name('users')
export class User {
    id: UUID & PrimaryKey = uuid();

    username: string;
    email: string;

    health: number = 1000;
    money: number = 0;
    exp: number = 0;
    lastLogin: Date;

    created: Date = new Date();
}

@entity.name('user_tokens')
export class UserToken {
    id: UUID & PrimaryKey = uuid();

    expire: Date;
    created: Date = new Date();
}