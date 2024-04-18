import {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {RPC} from "../../interfaces/rpc";
import {Badge, Button, Container, Group, Image, Table, Text, Title} from "@mantine/core";
import {Blackmarket} from "../../interfaces/database/blackmarket";
import {notifications} from "@mantine/notifications";
import {getItemImagePath, getItemPrice} from "../../utils/item";
import {useInterval} from "@mantine/hooks";
import {RarityLabels} from "../../interfaces/database/item";
import {getConditionText} from "../../utils/number";
import {useGame} from "../../providers/game.tsx";


export function PageBlackMarket() {
    const { rpc } = useGame();
    const [ items, setItems ] = useState<Blackmarket[]>([]);


    const buyItem = async (item: Blackmarket, index: number) => {
        const token = localStorage.getItem('token');
        if ( !token ) return;


        console.log('try to buy item:', item.item.title);
        if ( await rpc.market.buy(token, item.id) ) {
            notifications.show({
                title: 'Successfully Bought',
                message: 'Your new item: ' + item.item.name,
            });


            const nItems = [...items];
            nItems.splice(index, 1);
            setItems(nItems);
        } else {
            notifications.show({
                title: 'Error',
                color: 'red',
                message: 'Gegenstand ' + item.item.name + ' ist nicht länger verfügbar',
            });
        }
    }


    const syncData = useInterval(async () => {
        if ( !rpc ) return;
        const token = localStorage.getItem('token');
        if ( !token ) return;

        const data = await rpc.market.all();
        if ( !data ) return;
        setItems(data);
    }, 1500);

    useEffect(() => {
        const getData = async () => {
            if ( !rpc ) return;
            const token = localStorage.getItem('token');
            if ( !token ) return;

            const data = await rpc.market.all();
            if ( !data ) return;
            console.log('items: ', data);
            setItems(data);
        }

        getData();


        syncData.start();
        return syncData.stop;
    }, [rpc]);


    return <Container>
        <Title order={3}>Blackmarket</Title>
        <Table striped withColumnBorders highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Preis</Table.Th>
                    <Table.Th>Seltenheit</Table.Th>
                    <Table.Th>Zustand</Table.Th>
                    <Table.Th>Aktionen</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
            { items && items.map( ( item, index ) => {
                return <Table.Tr>
                    <Table.Td>
                        <Group>
                            <Image w={50} src={getItemImagePath(item.item.name, item.condition)} />
                            {item.item.title}
                        </Group>
                    </Table.Td>
                    <Table.Td>
                        {getItemPrice(item.item.price, item.condition, item.item.offer).toFixed(2)} €
                        {item.item.offer !== 0 && <Text>- {item.item.offer}%</Text>}
                    </Table.Td>
                    <Table.Td><Badge color={item.item.rarity === 2 ? 'red' : 'blue'}>{RarityLabels[item.item.rarity]}</Badge></Table.Td>
                    <Table.Td>{getConditionText(item.condition, item.item.type)}</Table.Td>
                    <Table.Td>
                        <Button
                            variant="subtle"
                            onClick={() => buyItem(item, index)}
                        >KAUF</Button>
                    </Table.Td>
                </Table.Tr>
            })}
            </Table.Tbody>
        </Table>
    </Container>
}