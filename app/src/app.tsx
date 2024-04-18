import {ColorScheme, ColorSchemeProvider, MantineProvider} from "@mantine/core";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useState} from "react";
import {Notifications} from "@mantine/notifications";
import {ModalsProvider} from "@mantine/modals";
import {mainMenu, MENU} from "./core/menu";
import {GameProvider} from "./providers/game";


function getRoutes(menu: MENU[], master?: MENU) {
    return menu.map((menu, index) => {
        const mast = (master ? master.url : '');

        return <Route key={mast + menu.url} path={mast + menu.url} element={menu.element}>
            {menu.sub && getRoutes(menu.sub, menu)}
        </Route>
    })
}


export function Application() {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
    const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (
        <GameProvider>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{ colorScheme }}
                >
                    <ModalsProvider>
                        <Notifications />
                        <BrowserRouter>
                            <Routes>
                                {getRoutes(mainMenu)}
                            </Routes>
                        </BrowserRouter>
                    </ModalsProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </GameProvider>
    )
}