import {ActionIcon, Badge, Button, Group, Loader, Stack, Table, Title} from "@mantine/core";
import {calculateRemainingTime, formatDateTime} from "../../utils/date";
import {IconClockStop, IconHash} from "@tabler/icons-react";
import React, {useEffect, useRef, useState} from "react";
import {IPScan} from "../../interfaces/database/ipscan";
import {useInterval} from "@mantine/hooks";
import {randomIP} from "../../utils/number";
import {notifications} from "@mantine/notifications";
import {useGame} from "../../providers/game";


export function IPScanner() {
    const { rpc, user, setUser } = useGame();
    const ipRef = useRef<HTMLInputElement>(null);
    const [scans, setScans] = useState<IPScan[] | undefined>();

    const syncData = useInterval(async () => {
        getData();
    }, 1200);

    const getData = async () => {
        if ( !rpc ) return;

        const token = localStorage.getItem('token');
        if ( !token ) return;

        const scans = await rpc.ipscan.get(token);
        setScans([...scans]);
    }

    useEffect(() => {
        getData();
        syncData.start();
        return syncData.stop;
    }, [rpc])

    const endReached = (date: Date) => {
        return date < new Date();
    }

    const validateIP = (IP: string): boolean => {
        return /^((\d){1,3}\.){3}(\d){1,3}$/.test(IP)
    }

    const create = async (ip: string) => {
        if ( !rpc ) return;
        const token = localStorage.getItem('token');
        if ( !token ) return;

        if ( !validateIP(ip) ) return console.log('invalid ip address');

        const job = await rpc.ipscan.create(token, ip);

        if ( ipRef.current ) ipRef.current.value = "";

        if ( typeof(job) === "string") {
            notifications.show({
                title: 'Fehler',
                color: 'red',
                message: job,
            });
        }

        getData();

    }

    const stopScan = async (id: string) => {
        if ( !rpc ) return;
        const token = localStorage.getItem('token');
        if ( !token ) return;

        await rpc.ipscan.stop(token, id);
    }

    const hackScan = async (id: string) => {
        if ( !rpc ) return;
        const token = localStorage.getItem('token');
        if ( !token ) return;

        const money = await rpc.ipscan.hack(token, id);
        if ( money !== 0 ) {
            notifications.show({
                title: 'Scan Hacked',
                message: "Du hast " + money + "€ gestohlen",
            });
        }
        if ( user ) {
            user.money += money;
            setUser({...user});
        }

        getData();
    }

    const getStatusBadge = (scan: IPScan) => {
        if ( !endReached(scan.endAt) )
            return <Badge color={"yellow"}>
                {calculateRemainingTime(scan.endAt)}
            </Badge>;

        if ( scan.found === 0 ) return <Badge color={"red"}>Fehler</Badge>;

        return <Badge color={"green"}>Fertig</Badge>;
    }

    return <Stack>
        <Group justify={"space-between"}>
            <Title>Network Scanner</Title>
            <Button onClick={() => create(randomIP())}>Neuer Auftrag</Button>
        </Group>
        <Table striped highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Td key={"table_head_id"}>ID</Table.Td>
                    <Table.Td key={"table_head_date"}>Datum</Table.Td>
                    <Table.Td key={"table_head_ip"}>IP</Table.Td>
                    <Table.Td key={"table_head_ports"}>Ports</Table.Td>
                    <Table.Td key={"table_head_status"}>Status</Table.Td>
                    <Table.Td key={"table_head_actions"}>Aktionen</Table.Td>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                { scans && scans.map((scan, index) => {
                    return <Table.Tr>
                        <Table.Th key={"table_body_id_" + index}>{scan.id}</Table.Th>
                        <Table.Th key={"table_body_date_" + index}>{formatDateTime(scan.created)}</Table.Th>
                        <Table.Th key={"table_body_ip_" + index}>{scan.ip}</Table.Th>
                        <Table.Th key={"table_body_ports_" + index}>
                            <Group>
                                {!endReached(scan.endAt) &&
                                    <Loader size={"sm"} />
                                }
                                {scan.found}
                            </Group>
                        </Table.Th>
                        <Table.Th key={"table_body_status_" + index}>
                            {getStatusBadge(scan)}
                        </Table.Th>
                        <Table.Th key={"table_body_actions_" + index}>
                            { !endReached(scan.endAt) &&
                                <ActionIcon key={"action_" + index + "_stop"} onClick={() => stopScan(scan.id)}>
                                    <IconClockStop />
                                </ActionIcon>
                            }
                            { endReached(scan.endAt) &&
                                <ActionIcon key={"action_" + index + "_end"} onClick={() => hackScan(scan.id)}>
                                    <IconHash />
                                </ActionIcon>
                            }
                        </Table.Th>
                    </Table.Tr>
                })}
            </Table.Tbody>
        </Table>
    </Stack>
}