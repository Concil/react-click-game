import {Button, Container, Group, Image, Stack, Table, Title} from "@mantine/core";
import {useOutletContext} from "react-router-dom";
import {RPC} from "../../interfaces/rpc";
import {useEffect, useState} from "react";
import {Bank} from "../../interfaces/database/bank";
import {getItemImagePath} from "../../utils/item";
import {useInterval} from "@mantine/hooks";

export function PageBank() {
    const rpc = useOutletContext<RPC>();
    const [items, setItems] = useState<Bank[]>([]);

    const syncData = useInterval(async () => {
        const token = localStorage.getItem('token');
        if ( !token ) return;

        const data = await rpc.bank.get();
        if ( !data ) return;
        const newData = [...data];
        setItems(newData);

    }, 1500);

    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem('token');
            if ( !token ) return;

            const data = await rpc.bank.get();
            if ( !data ) return;
            setItems(data);
        }

        getData();


        syncData.start();
        return syncData.stop;
    }, [])

    return <Stack>
        <Title order={3}>Bank Accounts</Title>
        <Table striped highlightOnHover>
            <thead>
            <tr>
                <th>Name</th>
                <th>IBAN</th>
                <th>Land</th>
                <th>Aktionen</th>
            </tr>
            </thead>
            <tbody>
            { items && items.map( ( item, index ) => {
                return <tr key={"bank"+index}>
                    <td>{item.name}</td>
                    <td>{item.iban}</td>
                    <td>{item.countryCode}</td>
                    <td>
                        <Button
                            variant="subtle"
                        >HACK</Button>
                    </td>
                </tr>
            })}
            </tbody>
        </Table>
    </Stack>
}