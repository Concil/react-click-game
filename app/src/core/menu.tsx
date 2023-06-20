import * as React from "react";
import {Login} from "../pages/login";
import {Home} from "../pages/home";
import {Register} from "../pages/register";
import {RegisterSuccess} from "../pages/registerSuccess";
import {Confirm} from "../pages/auth/confirm";
import {LayoutGame} from "../layouts/game";
import {FightClick} from "../pages/game/fights/click";
import {GameHacks} from "../pages/game/hacks";
import {IPScanner} from "../pages/game/IPScanner";
import {PageCraft} from "../pages/game/craft";
import {PageInventory} from "../pages/game/inventory";
import {PageBlackMarket} from "../pages/game/blackmarket";
import {Error404} from "../pages/game/error";
import {Dashboard} from "../pages/game/dashboard";
import {PageBank} from "../pages/game/bank";
import {PageClick} from "../pages/click";
import {Marketplace} from "../pages/game/marketplace";


export class MENU {
    constructor(
        public name: string,
        public url: string,
        public element: React.ReactNode,
        public sub: MENU[] = new Array<MENU>()
    ) {}
}

export const mainMenu: MENU[] = [
    new MENU('home', '/', <Home />),
    new MENU('login', '/login', <Login />),
    new MENU('click', '/u/:id', <PageClick />),
    new MENU('register', '/register', <Register />, [
        new MENU('registerSuccess', '/success', <RegisterSuccess />)
    ]),
    new MENU("confirm", "/auth/confirm/:email/:id", <Confirm />),
    new MENU("gameLayout", "/game", <LayoutGame />, [
        new MENU("dashboard", '/', <Dashboard />),
        new MENU("fight", '/fight/:id', <FightClick />),
        new MENU("hacks", '/hacks', <GameHacks />),
        new MENU("ipscanner", '/ip/scanner', <IPScanner />),
        new MENU("craft", '/craft', <PageCraft />),
        new MENU("inventory", '/inventory', <PageInventory />),
        new MENU("blackmarket", '/blackmarket', <PageBlackMarket />),
        new MENU("marketplace", '/market', <Marketplace />),
        new MENU("bank", '/bank', <PageBank />),
        new MENU("404", '/*', <Error404 />),
    ]),
    new MENU("404", "/*", <Error404 />)
];

/* TODO: find a nice method to get an item with name
export function MENU_FIND(name: string, menu: MENU[]): MENU {

}

export function MOVE(name: string): React.ReactNode {
    const nav = useNavigate();
}
*/