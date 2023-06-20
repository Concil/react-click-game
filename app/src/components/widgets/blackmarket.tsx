import {Badge, Box, Button, createStyles, Group, Image, Stack, Text, Title} from "@mantine/core";


const useStyles = createStyles((theme) => ({
    item: {
        padding: theme.spacing.xs,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        '&:hover': {
            cursor: 'pointer'
        }
    },
}));
export function BlackMarketWidget() {
    const { classes } = useStyles();

    const items = [
        {name: 'ram1g', condition: 0.5, price: 500},
        {name: 'cpu1g', condition: 0.5, price: 500},
    ]

    return <Stack>
        <Title mt={50} order={2}>New Items Blackmarket</Title>
        <Stack>
            { items.map((item, index) => {
                return <Box className={classes.item}>
                    <Group position={"apart"}>
                        <Group>
                            <Image src={"/images/items/ram100-1.png"} width={100} />
                            <Stack>
                                <Title lh={0.2}>{item.name}</Title>
                                <Text>{item.price} €</Text>
                            </Stack>
                            <Badge>Fabrikneu</Badge>
                            <Badge>EPIC</Badge>
                        </Group>
                        <Button>buy</Button>
                    </Group>
                </Box>
            })}

        </Stack>
    </Stack>
}