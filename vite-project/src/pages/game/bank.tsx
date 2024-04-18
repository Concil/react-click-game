import {Button, Stack, Table, Title} from "@mantine/core";
import {useInterval} from "@mantine/hooks";
import {useEffect, useState} from "react";
import {Bank} from "../../interfaces/database/bank";
import {useGame} from "../../providers/game";
import {BankHackers} from "../../interfaces/database/bankHacker";


export function PageBank() {
    const { rpc, user } = useGame();
    const [ items, setItems] = useState<Bank[]>([]);
    const [ current, setCurrent] = useState<BankHackers[]>([]);

    const getData = async () => {
        if ( !rpc ) return;
        if ( !user ) return;

        const token = localStorage.getItem('token');
        if ( !token ) return;

        const data = await rpc.bank.get();
        if ( !data ) return;

        const dataUser = await rpc.bank.getUser(user.id);

        setItems([...data]);
        setCurrent([...dataUser]);
    }

    const syncData = useInterval(async () => {
        getData();
    }, 1500);


    useEffect(() => {
        getData();
        syncData.start();
        return syncData.stop;
    }, [rpc, user]);


    const onHack = async (bank: Bank) => {
        if ( !user || !rpc ) return;

        const exists = bank.hackers.find((usr ) => usr.id === user.id);
        if ( exists ) {
            return;
        }

        await rpc.bank.hack(bank.id, user.id);
        getData();
    }


    const isUserHacking = ( bank: Bank ): boolean => {
        if ( !user ) return false;
        const exists = bank.hackers.find((usr ) => usr.id === user.id);
        return !!exists;
    }

    const getHackingPercent = ( bank: Bank ): string => {
        if ( !user ) return "";

        const targetBank = current.find((curr ) => curr.bank.id === bank.id);
        if ( !targetBank ) return "";

        return targetBank.percent + " %";
    }

    const sortByHacking = ( a: Bank, b: Bank ): number => {
        const targetBankA = current.find((curr ) => curr.bank.id === a.id);
        const targetBankB = current.find((curr ) => curr.bank.id === b.id);

        if ( !targetBankA && targetBankB ) return 1;
        if ( targetBankA && !targetBankB ) return -1;
        return 0;
    }

    return <Stack>
        <Title order={3}>Bank Accounts</Title>
        <Table striped highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>IBAN</Table.Th>
                    <Table.Th>Land</Table.Th>
                    <Table.Th>Mögliche Beute</Table.Th>
                    <Table.Th>Aktionen</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
            { items && items.sort(sortByHacking).map( ( item, index ) => {
                return <Table.Tr key={"bank"+index}>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.iban}</Table.Td>
                    <Table.Td>{item.countryCode}</Table.Td>
                    <Table.Td>{item.money.toLocaleString(navigator.language || 'de-DE')}</Table.Td>
                    <Table.Td>
                        <Button
                            variant="subtle"
                            onClick={() => onHack(item)}
                        >
                            { isUserHacking(item) ? getHackingPercent(item) : 'HACK' }
                        </Button>
                    </Table.Td>
                </Table.Tr>
            })}
            </Table.Tbody>
        </Table>
    </Stack>
}