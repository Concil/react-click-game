import {Badge, Button, Grid, Group, Image, Table, Text, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import {InventoryItem} from "../../interfaces/database/inventory";
import {useOutletContext} from "react-router-dom";
import {RPC} from "../../interfaces/rpc";
import {getItemImagePath, getItemPrice} from "../../utils/item";
import {ItemTypes, RarityLabels} from "../../interfaces/database/item";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import {getConditionText} from "../../utils/number";


export function PageInventory() {
    const rpc = useOutletContext<RPC>();
    const [inventory, setInventory] = useState<InventoryItem[]>();

    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem('token');
            if ( !token ) return;

            const data = await rpc.inventory.all(token);
            if ( !data ) return;

            const rlData = [...data];

            setInventory(rlData);
        }

        getData();
    }, [])

    const resyncData = async () => {
        const token = localStorage.getItem('token');
        if ( !token ) return;

        const data = await rpc.inventory.all(token);
        if ( !data ) return;

        const rlData = [...data];
        setInventory(rlData);
    }

    return <Grid grow>
        <Grid.Col span={6}>
            <Title>Your Inventory</Title>
            <Table striped withBorder withColumnBorders highlightOnHover>
                <thead>
                <tr>
                    <th>name</th>
                    <th>price</th>
                    <th>rarity</th>
                    <th>condition</th>
                    <th>actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    inventory && inventory.map( ( item, index ) => {
                        return <tr key={"item" + index}>
                            <td>
                                <Group>
                                    <Image width={50} src={getItemImagePath(item.item.name, item.condition)} />
                                    {item.item.title}
                                </Group>
                            </td>
                            <td>{getItemPrice(item.item.price, item.condition, item.item.offer).toFixed(2)} €</td>
                            <td><Badge color={item.item.rarity === 2 ? 'red' : 'blue'}>{RarityLabels[item.item.rarity]}</Badge></td>
                            <td>{getConditionText(item.condition, item.item.type)}</td>
                            <td>
                                <Group>
                                    {
                                        item.item.type === ItemTypes.BOX &&
                                        <Button variant="subtle" onClick={async () => {
                                            const token = localStorage.getItem('token');
                                            if ( !token ) return;


                                            const randomItem = await rpc.user.randomItem(token, item.id);
                                            if ( typeof(randomItem) === "string") {
                                                notifications.show({
                                                    title: 'Error',
                                                    color: 'red',
                                                    message: randomItem,
                                                });
                                            } else {
                                                modals.openConfirmModal({
                                                    title: randomItem.item.title,
                                                    centered: true,
                                                    children: (
                                                        <Text size="sm">
                                                            {randomItem.item.description}
                                                        </Text>
                                                    ),
                                                    labels: { confirm: 'Okay', cancel: 'Cancel' }
                                                });
                                                resyncData();
                                            }
                                        }}>OPEN</Button>
                                    }
                                    <Button variant="subtle">sell</Button>
                                    <Button variant="subtle">use</Button>
                                </Group>
                            </td>
                        </tr>
                    })
                }
                </tbody>
            </Table>
        </Grid.Col>
        <Grid.Col span={6}>
            <Title>Your Gear</Title>
        </Grid.Col>
    </Grid>
}