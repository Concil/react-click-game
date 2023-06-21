import {
    ActionIcon,
    AppShell,
    Badge,
    Button,
    CopyButton,
    Group,
    Header,
    Image,
    Input,
    Navbar,
    ScrollArea,
    Text,
    ThemeIcon,
    Tooltip,
    UnstyledButton,
    useMantineColorScheme
} from "@mantine/core";
import {Outlet, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {MainLinks} from "./gameLinks";
import {
    IconCurrencyEuro,
    IconHeadset,
    IconLink,
    IconLogout,
    IconMessageChatbot,
    IconMoonStars,
    IconSun
} from "@tabler/icons-react";
import {useIdle, useInterval} from "@mantine/hooks";
import Logo from '../pngegg.png';
import {RpcWebSocketClient} from "@deepkit/rpc";
import {UserWidget} from "./userWidget";
import {User} from "../interfaces/database/user";
import {GENERAL} from "../config/general";
import {RPC} from "../interfaces/rpc";


export function LayoutGame() {
    const [webSocket, setWebSocket] = useState<WebSocket>();

    const [client, setClient] = useState<any>();
    const [user, setUser] = useState<User>();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const nav = useNavigate();
    const idle = useIdle(2000);

    /*//Todo: checking fights with websocket
    const testHackInterval = useInterval(() => {
        notifications.show({
            title: 'HACKED',
            color: 'red',
            message: 'You successfully hacked 642.512.567.321',
            withCloseButton: true,
            autoClose: 4500,
        });
    }, 20000);
    useEffect(() => {
        testHackInterval.start();
        return testHackInterval.stop;
    }, []);

    const testWelcomeInterval = useInterval(() => {
        notifications.show({
            title: 'Welcome',
            color: 'red',
            message: '[username] new user joined hack.click',
            withCloseButton: true,
            autoClose: 4500,
        });
    }, 30000);
    useEffect(() => {
        testWelcomeInterval.start();
        return testWelcomeInterval.stop;
    }, []);*/

    const checkData = useInterval(async () => {
        if ( client ) {
            const token = localStorage.getItem('token');
            if ( !token ) return;
            const rpc = client as RPC;

            const data = await rpc.user.getData(token);
            if ( !data ) return;
            const newData = {...data};
            setUser(newData);
            console.log('checker user data');
        }
    }, 1500);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if ( !token ) return nav("/login");
        if ( token.length <= 10 ) return nav("/login");



        try {
            const client = new RpcWebSocketClient('ws://localhost:8080');
            client.token.set(token);

            const rpc: RPC = GENERAL.buildRPC(client);

            setClient(rpc);

            const getData = async () => {
                const token = localStorage.getItem('token');
                if ( !token ) return;
                console.log(await rpc.user.hello());
                setUser(await rpc.user.getData(token));
            }
            getData();


            checkData.start();
            return () => {
                client.disconnect();
                checkData.stop()
            };
        } catch ( error ) {
            nav("/login");
        }
    }, []);

    return <AppShell
        padding="md"
        header={
            <Header
                height={80}
                p="xs"
            >
                <Group sx={{ height: '100%' }} px={20} position="apart">
                    <Group>
                        <Image src={Logo} width={60} />
                        <Badge color={idle ? 'blue' : 'teal'}>{idle ? 'PAUSED' : 'HACKING'}</Badge>
                        { user && <CopyButton value={"https://hack.click/u/" + user.username} timeout={2000}>
                                {({ copied, copy }) => (
                                    <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position={"right"}>
                                        <UnstyledButton color={copied ? 'teal' : 'gray'} onClick={copy}>
                                            <Input
                                                icon={copied ? <IconLink size="1rem" /> : <IconLink size="1rem" />}
                                                variant="filled"
                                                value={"https://hack.click/u/" + user.username}
                                                disabled
                                            />
                                        </UnstyledButton>
                                    </Tooltip>
                                )}
                            </CopyButton>
                        }
                    </Group>
                    <Group>
                        { user &&
                            <Input
                                icon={<IconCurrencyEuro size="1rem" />}
                                variant="filled"
                                value={user.money.toLocaleString()}
                                disabled
                            />
                        }

                    </Group>
                    <Group>
                        {client && <UserWidget rpc={client} />}
                        <ActionIcon variant="default" onClick={() => nav("/")} size={30}>
                            <IconMessageChatbot size="1rem" />
                        </ActionIcon>
                        <ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>
                            {colorScheme === 'dark' ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
                        </ActionIcon>
                        <ActionIcon variant="default" size={30} onClick={() => {
                            localStorage.clear();
                            nav("/")
                        }}>
                            <IconLogout size="1rem" />
                        </ActionIcon>
                    </Group>
                </Group>
            </Header>
        }
        navbar={
            <Navbar
                width={{ base: 300 }}
                p="xs"
            >
                <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                    <MainLinks />
                </Navbar.Section>
                <Navbar.Section>
                    <div>
                        <Button w={'100%'} variant="light">
                            <Group>
                                <ThemeIcon variant="light"><IconHeadset /></ThemeIcon>
                                <Text size="sm">Support</Text>
                            </Group>
                        </Button>
                    </div>
                </Navbar.Section>
            </Navbar>
        }
        styles={(theme) => ({
            main: {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                height: "100%",
            },
            body: {
                height: "100%",
            },
        })}
    >
        {
            client && <Outlet context={client} />
        }
    </AppShell>
}