import {MantineProvider} from "@mantine/core";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Notifications} from "@mantine/notifications";
import {ModalsProvider} from "@mantine/modals";
import {mainMenu, MENU} from "./core/menu";
import {GameProvider} from "./providers/game";

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function getRoutes(menu: MENU[], master?: MENU) {
    return menu.map((menu) => {
        const mast = (master ? master.url : '');

        return <Route key={mast + menu.url} path={mast + menu.url} element={menu.element}>
            {menu.sub && getRoutes(menu.sub, menu)}
        </Route>
    })
}


export function Application() {
    return (
        <GameProvider>
            <MantineProvider defaultColorScheme="dark">
                <ModalsProvider>
                    <Notifications />
                    <BrowserRouter>
                        <Routes>
                            {getRoutes(mainMenu)}
                        </Routes>
                    </BrowserRouter>
                </ModalsProvider>
            </MantineProvider>
        </GameProvider>
    )
}