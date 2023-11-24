import {Database} from "@deepkit/orm";
import {rpc} from "@deepkit/rpc";
import {User, UserSession} from "../database/user";
import {compare, hashSync} from "bcrypt";
import {addHours} from "date-fns";
import {http, HttpBody, HttpQuery} from "@deepkit/http";
import {Email, MinLength, unpopulatedSymbol} from "@deepkit/type";
import {RequestError} from "../models/error";
import {generateRandomCode, randomNumber} from "../utils/number";
import {InventoryItem} from "../database/inventory";
import {Item, ItemTypes} from "../database/item";
import {Hack} from "../database/hack";
import {UserSkill} from "../database/skill";
import { Config } from "../config/general";

interface Auth {
    username: string & MinLength<4>;
    password: string & MinLength<6>;
}
interface Register extends Auth {
    email: string & MinLength<4> & Email;
}

@http.controller("user")
@rpc.controller("user")
export class UserController {

    constructor(
        protected database: Database,
        protected config: Config
    ) {}

    @http.GET("click/:username")
    async click(username: string) {
        const user = await this.database.query(User).filter({
            username: username
        }).findOneOrUndefined();
        if ( !user ) return console.log('user not found');

        const skill = await this.database.query(UserSkill).filter({
            user: user
        }).findOneOrUndefined();
        if ( !skill ) return console.log('skill not found');

        const nHack = new Hack();
        nHack.user = user;
        nHack.money = randomNumber(100, 500); // jenach user gear, bekommt man mehr gibts ein multiplier

        user.money+= nHack.money;
        user.exp+= 25;
        skill.socialEngineering += randomNumber(10, 20);
        skill.phishing += randomNumber(10, 20);

        await this.database.persist(user);
        await this.database.persist(nHack);
        return
    }

    @rpc.action()
    hello() {
        return "hello from server";
    }

    @rpc.action()
    async getData(id: string): Promise<User | undefined> {
        if ( !id ) return undefined;

        const session = await this.database.query(UserSession).filter({
            id: id
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) return undefined;

        session.user.password = "";
        return session.user;
    }

    @http.POST("/login")
    async login(body: HttpBody<Auth>): Promise<UserSession | RequestError> {
        const {username, password} = body;

        const user = await this.database.query(User).filter({
            username: username.toLowerCase()
        }).findOneOrUndefined();
        if ( !user ) return new RequestError("username not found", [
            {
                path: 'username',
                message: 'username not found'
            }
        ]);

        if ( !await compare(password, user.password) ) return new RequestError("password does not match", [
            {
                path: 'password',
                message: 'password does not match'
            }
        ]);

        const otherSessions = await this.database.query(UserSession).filter({user: user}).joinWith("user").find();

        if ( otherSessions.length != 0 ) {
            await this.database.remove(...otherSessions);
        }

        const session = new UserSession();
        session.user = user;
        session.expire = addHours(new Date(), 5);

        await this.database.persist(session);
        session.user.password = "";
        return session;
    }

    @rpc.action()
    async logout(token: string): Promise<boolean> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).findOneOrUndefined();
        if ( !session ) return;

        await this.database.remove(session);

        return true;
    }

    @http.POST("/register")
    async register(body: HttpBody<Register>): Promise<User | RequestError> {
        const {username, password, email} = body;

        const user = await this.database.query(User).filter({
            username: username.toLowerCase()
        }).findOneOrUndefined();

        if ( user ) return new RequestError("user already exists", [
            {path: 'username', message: 'already exists'}
        ]);

        const mail = await this.database.query(User).filter({
            email: email.toLowerCase()
        }).findOneOrUndefined();

        if ( mail ) return new RequestError("email already exists", [
            {path: 'email', message: 'already exists'}
        ]);

        const nUser = new User();
        nUser.username = username.toLowerCase();
        nUser.email = email.toLowerCase();
        nUser.registerCode = generateRandomCode();
        nUser.password = hashSync(password, 15);

        await this.database.persist(nUser);

        const nSkill = new UserSkill();
        nSkill.user = nUser;
        await this.database.persist(nSkill);

        return nUser;
    }

    @rpc.action()
    async check(token: string): Promise<boolean> {
        return false;
    }

    @rpc.action()
    async randomItem(userId: string, itemId: string): Promise<InventoryItem | string> {
        const session = await this.database.query(UserSession).filter({
            id: userId
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) return "invalid session";
        if ( !session.user ) return "invalid user";

        const invItem = await this.database.query(InventoryItem).filter({
            user: session.user,
            id: itemId
        }).joinWith("item").findOneOrUndefined();
        if ( !invItem ) return "item in inventory not found";
        if ( invItem.item.type !== ItemTypes.BOX ) return "this item cant be open";

        const items = await this.database.query(Item).filter({
            rarity: invItem.item.rarity
        }).find();
        if ( items.length === 0 ) return "no items with rarity found";

        const randomItem = items[randomNumber(0, items.length)];
        if ( !randomItem ) return "no random item generated";

        const inventoryItem = new InventoryItem();
        inventoryItem.user = session.user;
        inventoryItem.item = randomItem;
        inventoryItem.condition = Math.random();

        await this.database.persist(inventoryItem);
        await this.database.remove(invItem);
        return inventoryItem;
    }

    @rpc.action()
    async getHacks(token: string, max: number = 0): Promise<Hack[] | string> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) return "invalid session";
        if ( !session.user ) return "invalid user";

        let queryBuild = await this.database.query(Hack).filter({
            user: session.user
        });
        if ( max !== 0 ) queryBuild = queryBuild.limit(max);
        return queryBuild.sort({created: 'DESC'}).find();
    }
}