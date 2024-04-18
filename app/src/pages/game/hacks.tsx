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
            <thead>
            <tr>
                <th>datum</th>
                <th>gestohlen</th>
            </tr>
            </thead>
            <tbody>
            { items && items.map( ( item, index ) => {
                return <tr key={"hack" + index}>
                    <td>{formatDateTime(item.created)}</td>
                    <td>{item.money.toFixed(2)} €</td>
                </tr>
            })}
            </tbody>
        </Table>
    </Stack>

}