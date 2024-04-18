import {InventoryItem} from "./inventory";

export interface UserSession {
    id: string;

    user: User;
    expire: Date;
    created: Date;
}

export interface User {
    id: string;

    username?: string;
    email?: string;
    password?: string;

    health?: number;
    scrap?: number;
    money?: number;
    exp?: number;
    lastLogin?: Date;
    session?: UserSession;

    cpu?: InventoryItem;
    gpu?: InventoryItem;
    ram1?: InventoryItem;
    ram2?: InventoryItem;
    ram3?: InventoryItem;
    ram4?: InventoryItem;

    created?: Date;
}