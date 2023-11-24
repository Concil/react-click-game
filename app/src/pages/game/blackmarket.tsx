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


export function PageBlackMarket() {
    const rpc = useOutletContext<RPC>();
    const [items, setItems] = useState<Blackmarket[]>([]);


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
        const token = localStorage.getItem('token');
        if ( !token ) return;

        const data = await rpc.market.all();
        if ( !data ) return;
        console.log('inventory: ', data);
        setItems(data);
    }, 1500);

    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem('token');
            if ( !token ) return;

            const data = await rpc.market.all();
            if ( !data ) return;
            console.log('inventory: ', data);
            setItems(data);
        }

        getData();


        syncData.start();
        return syncData.stop;
    }, [])


    return <Container>
        <Title order={3}>Blackmarket</Title>
        <Table striped withBorder withColumnBorders highlightOnHover>
            <thead>
            <tr>
                <th>Name</th>
                <th>Preis</th>
                <th>Seltenheit</th>
                <th>Zustand</th>
                <th>Aktionen</th>
            </tr>
            </thead>
            <tbody>
            { items && items.map( ( item, index ) => {
                return <tr>
                    <td>
                        <Group>
                            <Image width={50} src={getItemImagePath(item.item.name, item.condition)} />
                            {item.item.title}
                        </Group>
                    </td>
                    <td>
                        {getItemPrice(item.item.price, item.condition, item.item.offer).toFixed(2)} €
                        {item.item.offer !== 0 && <Text>- {item.item.offer}%</Text>}
                    </td>
                    <td><Badge color={item.item.rarity === 2 ? 'red' : 'blue'}>{RarityLabels[item.item.rarity]}</Badge></td>
                    <td>{getConditionText(item.condition, item.item.type)}</td>
                    <td>
                        <Button
                            variant="subtle"
                            onClick={() => buyItem(item, index)}
                        >KAUF</Button>
                    </td>
                </tr>
            })}
            </tbody>
        </Table>
    </Container>
}