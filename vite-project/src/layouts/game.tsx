import {
    ActionIcon,
    AppShell,
    Badge,
    Burger,
    Button,
    CopyButton,
    Group,
    Image,
    Input,
    ScrollArea,
    Tooltip,
    UnstyledButton,
    useMantineColorScheme
} from "@mantine/core";
import {Outlet, useNavigate} from "react-router-dom";
import {Fragment, useEffect} from "react";
import {
    IconCurrencyEuro, IconCurrencyXrp,
    IconHeadset,
    IconLink,
    IconLogout,
    IconMessageChatbot,
    IconMoonStars,
    IconSun
} from "@tabler/icons-react";
import {useDisclosure, useIdle, useInterval} from "@mantine/hooks";
import Logo from '../pngegg.png';
import {RpcWebSocketClient} from "@deepkit/rpc";
import {GENERAL} from "../config/general";
import {RPC} from "../interfaces/rpc";
import {useGame} from "../providers/game";
import {MainLinks} from "../components/navigation.tsx";
import {UserWidget} from "../components/widgets/user.tsx";


export function LayoutGame() {
    const { rpc, setRPC, user, setUser } = useGame();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const [opened, { toggle }] = useDisclosure();

    const nav = useNavigate();
    const idle = useIdle(5000);

    const checkData = useInterval(async () => {
        if ( !rpc ) return;

        const token = localStorage.getItem('token');
        if ( !token ) return;

        const data = await rpc.user.getData(token);
        if ( !data ) return;

        const newData = {...data};
        setUser(newData);
    }, 1500);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if ( !token ) return nav("/login");
        if ( token.length <= 10 ) return nav("/login");

        try {
            const client = new RpcWebSocketClient('ws://localhost:8080');
            client.token.set(token);
            const rpc: RPC = GENERAL.buildRPC(client);
            setRPC(rpc);

            const getData = async () => {
                const token = localStorage.getItem('token');
                if ( !token ) return;
                //console.log(await rpc.user.hello());
                const tempUser = await rpc.user.getData(token);
                if ( !tempUser ) return;

                setUser(tempUser);
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
        header={{height: 60}}
        navbar={{width: 300, breakpoint: 'sm', collapsed: { mobile: !opened}}}

    >
        <AppShell.Header>
            <Group px={20} justify={"space-between"}>
                <Group>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Image src={Logo} w={60} />
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

                { user &&
                    <Group>
                        <Button
                            variant="default"
                            leftSection={<IconCurrencyEuro size="1rem" />}
                        >
                            {user.money!.toLocaleString()}
                        </Button>
                        <Tooltip label="Scrap" color="gray" position="bottom">
                            <Button
                                variant="default"
                                leftSection={<IconCurrencyXrp size="1rem" />}
                            >
                                {user.scrap!.toLocaleString()}
                            </Button>
                        </Tooltip>
                    </Group>
                }
                <Group>
                    <UserWidget />
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
        </AppShell.Header>

        <AppShell.Navbar display={"flex"}>
            <ScrollArea>
                <MainLinks />
            </ScrollArea>
            <Button mt={"lg"} leftSection={<IconHeadset />} w={'100%'} variant="light">
                Support
            </Button>
        </AppShell.Navbar>

        <AppShell.Main>
            <Outlet />
        </AppShell.Main>
    </AppShell>
}