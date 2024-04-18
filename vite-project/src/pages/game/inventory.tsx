import {ActionIcon, Badge, Button, Card, Grid, Group, Image, Modal, Table, Text, Title, Tooltip} from "@mantine/core";
import {Fragment, useEffect, useState} from "react";
import {InventoryItem} from "../../interfaces/database/inventory";
import {getItemImagePath, getItemPrice} from "../../utils/item";
import {ItemTypes, RarityLabels} from "../../interfaces/database/item";
import {getConditionText} from "../../utils/number";
import {useGame} from "../../providers/game.tsx";
import {notifications} from "@mantine/notifications";
import {modals} from "@mantine/modals";
import {IconDeselect, IconMoneybag, IconPlus, IconSelect, IconTrash} from "@tabler/icons-react";


export function PageInventory() {
    const { rpc } = useGame();
    const [inventory, setInventory] = useState<InventoryItem[]>();
    const [sell, setSell ] = useState<InventoryItem | null>(null);

    const getData = async () => {
        if ( !rpc ) return;

        const token = localStorage.getItem('token');
        if ( !token ) return;

        const data = await rpc.inventory.all(token);
        if ( !data ) return;

        const rlData = [...data];

        setInventory(rlData);
    }

    useEffect(() => {
        getData();
    }, [rpc]);

    const useItem = async (item: InventoryItem) => {
        if ( !rpc ) return;
        const token = localStorage.getItem('token');
        if ( !token ) return;

        if ( item.item.type === ItemTypes.BOX) {
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
                    labels: { confirm: 'Okay' }
                });
                getData();
            }
        }
    }

    return (
        <Fragment>
            {sell &&
                <Modal opened={true} onClose={() => setSell(null)} centered withCloseButton={false}>
                    Willst du wirklich Gegenstand {sell.item.title} für {""}
                    {getItemPrice(sell.item.price, sell.condition, sell.item.offer).toFixed(2)} €
                    Verkaufen?

                    <Group justify={"space-between"}>
                        <Button variant={"filled"} color={"blue"} onClick={() => setSell(null)}>Abbrechen</Button>
                        <Button variant="subtle" color="red">Verkaufen</Button>
                    </Group>
                </Modal>
            }
            <Grid grow>
                <Grid.Col span={6}>
                    <Title>Your Inventory</Title>
                    <Table striped withColumnBorders highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>name</Table.Th>
                                <Table.Th>preis</Table.Th>
                                <Table.Th>Seltenheit</Table.Th>
                                <Table.Th>Zustand</Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {
                                inventory && inventory.map( ( item, index ) => {
                                    return <Table.Tr key={"item_" + index}>
                                        <Table.Td>
                                            <Group justify={"space-between"}>
                                                <Image w={80} src={getItemImagePath(item.item.name, item.condition)} />
                                                {item.item.title}
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>{getItemPrice(item.item.price, item.condition, item.item.offer).toFixed(2)} €</Table.Td>
                                        <Table.Td><Badge color={item.item.rarity === 2 ? 'red' : 'blue'}>{RarityLabels[item.item.rarity]}</Badge></Table.Td>
                                        <Table.Td>{getConditionText(item.condition, item.item.type)} ({item.condition})</Table.Td>
                                        <Table.Td>
                                            <ActionIcon.Group>
                                                <Tooltip label="Verkaufen">
                                                    <ActionIcon variant="light" color="red" aria-label="sell" onClick={() => setSell(item)}>
                                                        <IconMoneybag style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Benutzen">
                                                    <ActionIcon variant="light" color="blue" aria-label="use">
                                                        <IconSelect style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </ActionIcon.Group>
                                        </Table.Td>
                                    </Table.Tr>
                                })
                            }
                        </Table.Tbody>
                    </Table>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Title>Your Gear</Title>
                    <Card>
                        <Card.Section withBorder inheritPadding py="xs">
                            <Title order={3}>test</Title>
                        </Card.Section>
                        <Card.Section>
                            <Table striped withColumnBorders highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>name</Table.Th>
                                        <Table.Th>Seltenheit</Table.Th>
                                        <Table.Th>Zustand</Table.Th>
                                        <Table.Th></Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td>name</Table.Td>
                                        <Table.Td>selt</Table.Td>
                                        <Table.Td>zust</Table.Td>
                                        <Table.Td>
                                            <ActionIcon variant="light" color="red" aria-label="remove">
                                                <IconDeselect style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Card.Section>
                    </Card>
                </Grid.Col>
            </Grid>
        </Fragment>
    )
}