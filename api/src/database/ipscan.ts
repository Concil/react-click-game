import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {User} from "./user";


@entity.name("ipscans")
export class IPScan {
    id: UUID & PrimaryKey = uuid();

    user!: User & Reference;
    ip: string = "";
    found: number = 0;

    created: Date = new Date();
    endAt: Date = new Date();
}