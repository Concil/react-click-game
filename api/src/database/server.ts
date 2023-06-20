import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {User} from "./user";
import {InventoryItem} from "./inventory";
import {randomIP} from "../utils/number";

export enum ServerStates {
    OFFLINE,
    BOOT,
    ONLINE
}

@entity.name("servers")
export class Server {
    id: UUID & PrimaryKey = uuid();
    user: User & Reference;

    state: ServerStates = ServerStates.OFFLINE;
    started?: Date; // calculates the uptime

    name: string = "unknown"; // user can name the server
    ip: string = randomIP(); // user needs an ip Address
    //op: OperationSystem & Reference;

    //hardware
    board: InventoryItem & Reference;
    cpu: InventoryItem & Reference;
    ram1: InventoryItem & Reference;
    gpu?: InventoryItem & Reference;
    ram2?: InventoryItem & Reference;
    ram3?: InventoryItem & Reference;
    ram4?: InventoryItem & Reference;
    hdd1?: InventoryItem & Reference;
    hdd2?: InventoryItem & Reference;
    hdd3?: InventoryItem & Reference;
    ssd1?: InventoryItem & Reference;
    ssd2?: InventoryItem & Reference;
    ssd3?: InventoryItem & Reference;
    ssd4?: InventoryItem & Reference;

    created: Date = new Date();
}