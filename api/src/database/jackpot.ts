import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";


@entity.name('jackpots')
export class Jackpot {
    id: UUID & PrimaryKey = uuid();

    money: number = 0;
    start: Date = new Date();
    end: Date;
}

@entity.name('user_jackpots')
export class UserJackpot {
    id: UUID & PrimaryKey = uuid();

    jackpot: Jackpot & Reference;
    created: Date = new Date();
}