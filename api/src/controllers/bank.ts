import {rpc} from "@deepkit/rpc";
import {eventDispatcher} from "@deepkit/event";
import {onServerMainBootstrapDone} from "@deepkit/framework";
import {Bank} from "../database/bank";
import {generateCountryCode, generateRandomIBAN, generateRandomNumber} from "../utils/number";
import {addHours} from "date-fns";
import {generateBankName} from "../utils/string";
import {APP_Database} from "../config/database";


@rpc.controller("bank")
export class BankController {
    timer: any = undefined;
    deleteTimer: any = undefined;

    constructor(protected database: APP_Database) {}

    @eventDispatcher.listen(onServerMainBootstrapDone)
    onServerStarted() {
        this.timer = setInterval(this.add.bind(this), 5 * 60000);
        this.deleteTimer = setInterval(this.checks.bind(this), 1000);
    }

    async checks() {
        const banks = await this.database.query(Bank).find();
        if ( banks.length === 0 ) return;

        for ( const bank of banks ) {
            if ( bank.deleteAt < new Date()) await this.database.remove(bank);
        }

    }

    async add() {
        console.log('[BANK] create');

        const nBank = new Bank();
        nBank.name = generateBankName();
        nBank.countryCode = generateCountryCode();
        nBank.bankCode = generateRandomNumber(8);
        nBank.iban = generateRandomIBAN(nBank.countryCode, nBank.bankCode);
        nBank.deleteAt = addHours(new Date(), 10);

        await this.database.persist(nBank);
    }

    @rpc.action()
    async get(): Promise<Bank[]> {
        return await this.database.query(Bank).find();
    }

}