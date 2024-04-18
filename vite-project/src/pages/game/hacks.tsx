import {Stack, Table, Title} from "@mantine/core";
import {useOutletContext} from "react-router-dom";
import {RPC} from "../../interfaces/rpc";
import {useEffect, useState} from "react";
import {useInterval} from "@mantine/hooks";
import {Hack} from "../../interfaces/database/hack";
import {formatDateTime} from "../../utils/date";
import {useGame} from "../../providers/game";


export function GameHacks() {
    const {rpc, user} = useGame();
    const [items, setItems] = useState<Hack[]>([]);


    const syncData = useInterval(async () => {
        if ( !rpc ) return;
        const token = localStorage.getItem('token');
        if ( !token ) return;


        const data = await rpc.user.getHacks(token);
        if ( !data ) return;
        if ( typeof(data) === "string")
            // Todo notify?
            return;

        const newData = [...data];
        setItems(newData);
    }, 1500);

    useEffect(() => {
        const getData = async () => {
            if ( !rpc ) return;

            const token = localStorage.getItem('token');
            if ( !token ) return;

            const data = await rpc.user.getHacks(token);
            if ( !data ) return;
            if ( typeof(data) === "string")
                // Todo notify?
                return;

            const newData = [...data];
            console.log('inventory: ', data);
            setItems(newData);
        }

        getData();


        syncData.start();
        return () => syncData.stop();
    }, [rpc])

    return <Stack>
        <Title>Hacks</Title>
        <Table striped highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Td>Datum</Table.Td>
                    <Table.Td>Gestohlen</Table.Td>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                { items && items.map( ( item, index ) => {
                    return  <Table.Tr>
                        <Table.Td>{formatDateTime(item.created)}</Table.Td>
                        <Table.Td>{item.money.toFixed(2)} €</Table.Td>
                    </Table.Tr>
                })}
            </Table.Tbody>
        </Table>
    </Stack>

}