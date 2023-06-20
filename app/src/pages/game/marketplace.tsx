import {Button, Card, Grid, Group, Image, Stack, Title} from "@mantine/core";
import {useOutletContext} from "react-router-dom";
import {RPC} from "../../interfaces/rpc";
import {useEffect, useState} from "react";
import {Item, ItemTypes} from "../../interfaces/item";
import {useInterval} from "@mantine/hooks";
import {getItemImagePath, getItemPrice} from "../../utils/item";
import {notifications} from "@mantine/notifications";


export function Marketplace() {
    const rpc = useOutletContext<RPC>();
    const [cases, setCases] = useState<Item[]>([]);


    const syncData = useInterval(async () => {
        const token = localStorage.getItem('token');
        if ( !token ) return;

        const data = await rpc.item.getItemsOfType(ItemTypes.BOX);
        if ( !data ) return;
        const rlData = [...data];
        setCases(rlData);
    }, 1500);

    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem('token');
            if ( !token ) return;

            const data = await rpc.item.getItemsOfType(ItemTypes.BOX);
            if ( !data ) return;
            console.log('inventory: ', data);
            setCases(data);
        }

        getData();

        syncData.start();
        return syncData.stop;
    }, [])

    const buyItem = async (itemId: string) => {
        const token = localStorage.getItem('token');
        if ( !token ) return;

        const buy = await rpc.item.buy(token, itemId);
        if ( typeof(buy) === "string") {
            notifications.show({
                title: 'Error',
                message: buy,
                color: 'red',
                autoClose: 4500
            });
        } else {
            notifications.show({
                title: buy.item.title + ' bought',
                message: 'successfully bought for ' + getItemPrice(buy.item.price, buy.condition, buy.item.offer),
                autoClose: 4500
            });
        }
    }

    return <Stack>
        <Title>Marktplatz</Title>
        <Grid grow>
            {cases.map((item, index) => {
                return <Grid.Col span={3}>
                    <Card radius={"md"} ta={"center"} shadow="lg" p={"lg"}>
                        <Card.Section py={20}>
                            <Group noWrap position={"apart"}>
                                <Group>
                                    <Image src={getItemImagePath(item.name, 1)} width={50} />
                                    <Stack>
                                        <Title align={"center"} order={4}>{item.title}</Title>
                                        <Title align={"center"} order={6}>{item.price.toFixed(2)} €</Title>
                                    </Stack>
                                </Group>
                                <Button onClick={() => buyItem(item.id)}>Kaufen</Button>
                            </Group>
                        </Card.Section>
                    </Card>
                </Grid.Col>
            })}
        </Grid>
    </Stack>
}