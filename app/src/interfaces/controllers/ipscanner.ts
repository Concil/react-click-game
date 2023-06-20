import {IPScan} from "../ipscan";


export interface IPScannerController {
    create(token: string, ip: string): Promise<IPScan | string>;
    get(token: string): Promise<IPScan[] | undefined>;
    delete(token: string, id: string): Promise<boolean>;
    stop(token: string, id: string): Promise<boolean>;
    hack(token: string, id: string): Promise<number>;
}