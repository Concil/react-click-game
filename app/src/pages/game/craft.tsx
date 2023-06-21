import {
    Box,
    Button,
    Container,
    createStyles,
    Grid,
    Group,
    Image,
    ScrollArea,
    Stack,
    Table,
    Text,
    Title
} from "@mantine/core";
import {useOutletContext} from "react-router-dom";
import {RPC} from "../../interfaces/rpc";
import {useEffect, useState} from "react";
import {InventoryItem} from "../../interfaces/database/inventory";
import {getItemImagePath} from "../../utils/item";
import {notifications} from "@mantine/notifications";
import {modals} from "@mantine/modals";


const useStyles = createStyles((theme) => ({
    slot: {
        margin: 5,
        width: 100,
        height: 100,
        padding: theme.spacing.xs,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black
    },
    item: {
        position: "relative",
        margin: "auto",
        width: 80,
        height: 80,
        padding: theme.spacing.xs,
        '&:hover': {
            cursor: 'pointer'
        }
    },
    dropZone: {
        padding: theme.spacing.md,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        border: '2px dashed',
        borderRadius: 10
    }
}));

export function PageCraft() {
    const { classes } = useStyles();

    const rpc = useOutletContext<RPC>();
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


    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem('token');
            if ( !token ) return;

            const data = await rpc.inventory.all(token);
            if ( !data ) return;
            console.log('inventory: ', data);
            setInventory(data);
        }

        getData();
    }, []);

    const craft = async () => {
        if ( selectedItem.length === 0 ) return;

        const token = localStorage.getItem('token');
        if ( !token ) return;

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
                <Table striped withBorder withColumnBorders highlightOnHover>
                    <thead>
                    <tr>
                        <th>name</th>
                        <th>price</th>
                        <th>condition</th>
                        <th>action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        inventory && inventory.map( ( item ) => {
                            let isSelected = selectedItem.find((sItem) => sItem.id === item.id);

                            return <tr style={{
                                backgroundColor: (isSelected ? '#860000' : '')
                            }}
                            >
                                <td>
                                    <Group>
                                        <Image width={50} src={getItemImagePath(item.item.name, item.condition)} />
                                        {item.item.title}
                                    </Group>
                                </td>
                                <td>{(item.item.price * item.condition).toFixed(2)} €</td>
                                <td>{item.condition}</td>
                                <td>
                                    <Button
                                        variant="subtle"
                                        disabled={!!isSelected}
                                        onClick={() => addItem(item)}
                                    >Add</Button>
                                </td>
                            </tr>
                        })
                    }
                    </tbody>
                </Table>
            </Grid.Col>
            <Grid.Col span={6}>
                <Stack>
                    <Box className={classes.dropZone}>
                        <Text>select your items from inventory to craft</Text>
                        {
                            selectedItem && selectedItem.map( ( item, index ) => {
                                return <Box>
                                    <Group position={"apart"}>
                                        <Group>
                                            <Image width={50} src={getItemImagePath(item.item.name, item.condition)} />
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