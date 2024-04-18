import {User} from "./user";
import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {Bank} from "./bank";


@entity.name("BankHackers")
export class BankHackers {
    id: UUID & PrimaryKey = uuid();

    percent: number = 0; // max 100

    constructor(
        public hacker: User & Reference,
        public bank: Bank & Reference
    ) {}
}