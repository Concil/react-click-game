import {Box, Button, Grid, Group, Image, Stack, Table, Text, Title} from "@mantine/core";
import {useEffect, useState} from "react";
import {InventoryItem} from "../../interfaces/database/inventory";
import {getItemImagePath} from "../../utils/item";
import {notifications} from "@mantine/notifications";
import {modals} from "@mantine/modals";
import {useGame} from "../../providers/game";


export function PageCraft() {
    const {rpc, token} = useGame();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [selectedItem, setSelectedInventory] = useState<InventoryItem[]>([]);


    const addItem = async (item: InventoryItem)=> {
        const items = [...selectedItem];
        items.push(item);
        setSelectedInventory(items);
    }

    const removeItem = async (index: number)=> {
        const sItems = [...selectedItem];
        sItems.splice(index, 1);
        setSelectedInventory(sItems);
    }


    const getData = async () => {
        if ( !rpc ) return;
        if ( !token ) return;

        const data = await rpc.inventory.all(token);
        if ( !data ) return;
        setInventory(data);
    }

    useEffect(() => {
        getData();
    }, [rpc]);

    const craft = async () => {
        if ( selectedItem.length === 0 ) return;
        if ( !rpc ) return;

        const result = await rpc.inventory.craft(token, selectedItem.map((sItem) => sItem.item.id));

        if ( typeof(result) === "string") {
            return notifications.show({
                title: 'Crafting Error',
                color: 'red',
                message: result,
                autoClose: 4500,
            });
        } else {
            modals.openConfirmModal({
                title: 'NEW ITEM: ' + result.item.title,
                centered: true,
                children: (
                    <Text size="sm">
                        {result.item.description}
                    </Text>
                ),
                labels: { confirm: 'Delete account', cancel: "No don't delete it" },
                confirmProps: { color: 'red' },
                onCancel: () => console.log('Cancel'),
                onConfirm: () => console.log('Confirmed'),
            });
        }
    }

    return <Stack>
        <Title>Crafting</Title>

        <Grid grow>
            <Grid.Col span={6}>
                <Title order={3}>Your inventory</Title>
                <Table striped withColumnBorders highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>name</Table.Th>
                            <Table.Th>price</Table.Th>
                            <Table.Th>condition</Table.Th>
                            <Table.Th>action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                    {
                        inventory && inventory.map( ( item, index) => {
                            let isSelected = selectedItem.find((sItem) => sItem.id === item.id);

                            return <Table.Tr key={"inventory_item_" + index} style={{
                                backgroundColor: (isSelected ? '#860000' : '')
                            }}
                            >
                                <Table.Td>
                                    <Group>
                                        <Image w={50} src={getItemImagePath(item.item.name, item.condition)} />
                                        {item.item.title}
                                    </Group>
                                </Table.Td>
                                <Table.Td>{(item.item.price * item.condition).toFixed(2)} €</Table.Td>
                                <Table.Td>{item.condition}</Table.Td>
                                <Table.Td>
                                    <Button
                                        variant="subtle"
                                        disabled={!!isSelected}
                                        onClick={() => addItem(item)}
                                    >Add</Button>
                                </Table.Td>
                            </Table.Tr>
                        })
                    }
                    </Table.Tbody>
                </Table>
            </Grid.Col>
            <Grid.Col span={6}>
                <Stack>
                    <Box>
                        <Text>select your items from inventory to craft</Text>
                        {
                            selectedItem && selectedItem.map( ( item, index ) => {
                                return <Box key={"select_item_" + index}>
                                    <Group position={"apart"}>
                                        <Group>
                                            <Image w={50} src={getItemImagePath(item.item.name, item.condition)} />
                                            {item.item.title}
                                        </Group>
                                        <Button onClick={() => removeItem(index)}>remove</Button>
                                    </Group>
                                </Box>
                            })
                        }
                    </Box>
                    <Button
                        disabled={selectedItem.length === 0}
                        onClick={() => craft()}
                    >crafting</Button>
                </Stack>
            </Grid.Col>
        </Grid>
    </Stack>
}