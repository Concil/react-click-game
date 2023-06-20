import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {User} from "./user";


@entity.name("hacks")
export class Hack {
    id: UUID & PrimaryKey = uuid();

    user: User & Reference;
    fromUser?: User & Reference;
    money: number = 0;
    created: Date = new Date();
}