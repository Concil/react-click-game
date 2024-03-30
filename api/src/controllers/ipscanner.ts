import {rpc} from "@deepkit/rpc";
import {eventDispatcher} from "@deepkit/event";
import {onServerMainBootstrapDone} from "@deepkit/framework";
import {UserSession} from "../database/user";
import {IPScan} from "../database/ipscan";
import {addHours} from "date-fns";
import {randomNumber} from "../utils/number";
import {APP_Database} from "../config/database";


@rpc.controller("ipscanner")
export class IPScannerController {
    checksTimer: any = undefined;

    constructor(protected database: APP_Database) {}

    @eventDispatcher.listen(onServerMainBootstrapDone)
    onServerStarted() {
        this.checksTimer = setInterval(this.checks.bind(this), 1000);
    }

    async checks() {
        const ipSpcans = await this.database.query(IPScan).joinWith("user").find();
        if ( ipSpcans.length === 0 ) return;

        for ( const scan of ipSpcans ) {
            if (scan.endAt < new Date()) continue;

            //Todo: check which gear the user have and minimize the randomly
            let offline = false;

            const randomOffline = randomNumber(0, 5);
            if ( scan.found === 0 ) {
                if ( randomOffline >= 4 && randomOffline <= 5) {
                    offline = true;
                }
            }

            if ( offline ) {
                scan.endAt = new Date();
                await this.database.persist(scan);
                continue;
            }

            if ( scan.found <= 999 ) {
                const randomlyFound = randomNumber(0, 20);
                if ( randomlyFound >= 12 && randomlyFound <= 13) {
                    scan.found++;

                    await this.database.persist(scan);
                }
            }
        }
    }

    @rpc.action()
    async create(token: string, ip: string): Promise<IPScan | string> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) return "unknown session";

        const ipScans = await this.database.query(IPScan).filter({
            user: session.user,
        }).find();
        const currentScans = ipScans.filter((scan) => scan.endAt > new Date());
        if ( currentScans.length >= 5 ) return "maximum reached";

        const nIPScan = new IPScan();
        nIPScan.user = session.user;
        nIPScan.ip = ip;
        nIPScan.endAt = addHours(new Date(), 1);

        await this.database.persist(nIPScan);

        return nIPScan;
    }

    @rpc.action()
    async get(token: string): Promise<IPScan[] | undefined> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) return undefined;


        return await this.database.query(IPScan).filter({
            user: session.user
        }).joinWith("user").sort({created: 'DESC'}).find();
    }

    @rpc.action()
    async delete(token: string, id: string): Promise<boolean> {
        return false;
    }

    @rpc.action()
    async hack(token: string, id: string): Promise<number> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) return 0;

        const ipScan = await this.database.query(IPScan).filter({
            id: id
        }).findOneOrUndefined();
        if ( !ipScan ) return 0;

        let multiplier = 0.5;
        const random = randomNumber(0, 200);
        if ( random >= 30 && random >= 40 ) multiplier = 1.5;

        const money = (ipScan.found * multiplier);
        session.user.money+= money;

        await this.database.remove(ipScan);
        await this.database.persist(session.user);
        return money;
    }

    @rpc.action()
    async stop(token: string, id: string): Promise<boolean> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) return false;

        const ipScan = await this.database.query(IPScan).filter({
            id: id
        }).joinWith("user").findOneOrUndefined();

        if ( !ipScan ) return false;

        ipScan.endAt = new Date();

        await this.database.persist(ipScan);
        return true;
    }
}