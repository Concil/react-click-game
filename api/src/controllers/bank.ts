import {rpc} from "@deepkit/rpc";
import {eventDispatcher} from "@deepkit/event";
import {onServerMainBootstrapDone} from "@deepkit/framework";
import {Bank} from "../database/bank";
import {generateCountryCode, generateRandomIBAN, generateRandomNumber, randomNumber} from "../utils/number";
import {addHours} from "date-fns";
import {generateBankName} from "../utils/string";
import {APP_Database} from "../config/database";
import {User} from "../database/user";
import {BankHackers} from "../database/BankHackers";


@rpc.controller("bank")
export class BankController {
    timer: any = undefined;
    deleteTimer: any = undefined;

    constructor(protected database: APP_Database) {}

    @eventDispatcher.listen(onServerMainBootstrapDone)
    onServerStarted() {
        this.timer = setInterval(this.add.bind(this), 5 * 60000); // 5 * 60000
        this.deleteTimer = setInterval(this.checks.bind(this), 1000);
    }

    async checks() {
        const banks = await this.database.query(Bank).joinWith("hackers").find();
        if ( banks.length === 0 ) return;

        for ( const bank of banks ) {
            if ( bank.deleteAt < new Date()) await this.database.remove(bank);

            const bankHackers = await this.database.query(BankHackers)
                .joinWith("hacker")
                .joinWith("bank")
                .filter({bank: bank})
                .find();

            for (const bankHacker of bankHackers ) {

                //Todo: check user gear to increase percent amount
                bankHacker.percent += 1;


                if ( bankHacker.percent >= 100 ) {
                    bankHacker.hacker.money += bankHacker.bank.money;

                    await this.database.persist(bankHacker.hacker);
                    await this.database.remove(bank);
                    await this.database.remove(bankHacker);
                }

                await this.database.persist(bankHacker);
            }

        }

    }

    async add() {
        console.log('[BANK] create new bank account');

        const nBank = new Bank();
        nBank.name = generateBankName();
        nBank.countryCode = generateCountryCode();
        nBank.bankCode = generateRandomNumber(8);
        nBank.iban = generateRandomIBAN(nBank.countryCode, nBank.bankCode);
        nBank.money = randomNumber(1500, 5000);
        nBank.deleteAt = addHours(new Date(), 10);

        await this.database.persist(nBank);
    }

    @rpc.action()
    async get(): Promise<any[]> {
        return await this.database.query(Bank)
            .useJoinWith("hackers").select("id").end()
            .find();
    }

    @rpc.action()
    async getUser(userId: string): Promise<any[]> {
        return await this.database.query(BankHackers)
            .joinWith("bank")
            .useJoinWith("hacker").filter({id: userId}).end()
            .find();
    }

    @rpc.action()
    async hack(id: string, userId: string): Promise<boolean> {
        const bank = await this.database.query(Bank)
            .joinWith("hackers")
            .filter({id: id})
            .findOneOrUndefined();
        if ( !bank ) return false;

        const user = await this.database.query(User)
            .filter({id: userId})
            .findOneOrUndefined();
        if ( !user ) return false;

        const hackers = await this.database.query(BankHackers)
            .filter({bank: bank, hacker: user})
            .findOneOrUndefined();
        if ( hackers ) return;

        const nHacker = new BankHackers(user, bank);
        await this.database.persist(nHacker);
        return true;
    }

}