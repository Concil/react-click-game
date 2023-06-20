import {Button, Card, Grid, Stack, Table, Text, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import {subDays, subHours} from "date-fns";
import {getShort, randNum, randomIP} from "../../utils/number";
import {formatDateTime} from "../../utils/date";
import {getRandomUserAgent} from "../../utils/string";
import {BlackMarketWidget} from "../../components/widgets/blackmarket";
import {useOutletContext} from "react-router-dom";
import {RPC} from "../../interfaces/rpc";
import {User} from "../../interfaces/user";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import {Hack} from "../../interfaces/hack";

//


export function Dashboard() {
    const rpc = useOutletContext<RPC>();

    const [user, setUser] = useState<User>();
    const [lastHacks, setLastHacks] = useState<Hack[]>([]);

    useEffect(() => {
        const getData = async () => {
            setUser(await rpc.user.getData(localStorage.getItem('token') as string));

            const dbLastHacks = await rpc.user.getHacks(localStorage.getItem('token') as string, 10);
            if ( typeof(dbLastHacks) === "string") return;
            setLastHacks(dbLastHacks);
        }
        getData();
    }, []);

    return <Stack>
        <Title align={"center"} lh={0.5} mt={10}>Willkommen zurück, {user?.username}</Title>
        <Title align={"center"} lh={0.7} order={2}>a good Day for hacking</Title>
        <Grid grow mt={50}>
            <Grid.Col span={2}>
                <Card radius={"md"} ta={"center"} shadow="lg" p={"lg"}>
                    <Card.Section py={20}>
                        <Title align={"center"} order={4}>{getShort(Number(6332915252999))}</Title>
                        <Title align={"center"} order={6}>hacks</Title>
                    </Card.Section>
                </Card>
            </Grid.Col>
            <Grid.Col span={2}>
                <Card radius={"md"} ta={"center"} shadow="lg" p={"lg"}>
                    <Card.Section py={20}>
                        { lastHacks[0] &&
                            <Title align={"center"} order={4}>{formatDateTime(lastHacks[0]?.created)}</Title>
                        }
                        <Title align={"center"} order={6}>last hack</Title>
                    </Card.Section>
                </Card>
            </Grid.Col>
            <Grid.Col span={2}>
            </Grid.Col>
            <Grid.Col span={2}>
            </Grid.Col>
        </Grid>

        <BlackMarketWidget />

        <Title mt={50} order={2}>latest hacks</Title>
        <Table striped withBorder withColumnBorders highlightOnHover>
            <thead>
            <tr>
                <th>User</th>
                <th>Date</th>
                <th>Agent</th>
                <th>IP</th>
                <th>Earning</th>
            </tr>
            </thead>
            <tbody>
            {
                lastHacks.map( (hack, index) => {
                    return <tr key={"hack"+index}>
                        <td>unknown</td>
                        <td>{formatDateTime(hack.created)}</td>
                        <td>{getRandomUserAgent()}</td>
                        <td>{randomIP()}</td>
                        <td>{hack.money.toFixed(2)} €</td>
                    </tr>
                })
            }
            </tbody>
        </Table>

    </Stack>
}