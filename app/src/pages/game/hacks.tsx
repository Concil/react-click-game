import {Badge, Button, Group, Image, Stack, Table, Title} from "@mantine/core";
import {useOutletContext} from "react-router-dom";
import {RPC} from "../../interfaces/rpc";
import {useEffect, useState} from "react";
import {Blackmarket} from "../../interfaces/database/blackmarket";
import {useInterval} from "@mantine/hooks";
import {Hack} from "../../interfaces/database/hack";
import {type} from "os";
import {getItemImagePath} from "../../utils/item";
import {RarityLabels} from "../../interfaces/database/item";
import {getConditionText} from "../../utils/number";
import {formatDateTime} from "../../utils/date";


export function GameHacks() {
    const rpc = useOutletContext<RPC>();
    const [items, setItems] = useState<Hack[]>([]);


    const syncData = useInterval(async () => {
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
        return syncData.stop;
    }, [])

    return <Stack>
        <Title>Hacks</Title>
        <Table striped highlightOnHover>
            <thead>
            <tr>
                <th>date</th>
                <th>price</th>
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