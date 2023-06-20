import {ActionIcon, Badge, Button, Group, Loader, Modal, Stack, Table, TextInput, Title} from "@mantine/core";
import {calculateRemainingTime, formatDateTime} from "../../utils/date";
import {IconClockStop, IconHash} from "@tabler/icons-react";
import React, {useEffect, useRef, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {RPC} from "../../interfaces/rpc";
import {IPScan} from "../../interfaces/ipscan";
import {useInterval} from "@mantine/hooks";
import {randomIP} from "../../utils/number";
import {notifications} from "@mantine/notifications";


export function IPScanner() {
    const rpc = useOutletContext<RPC>();
    const ipRef = useRef<HTMLInputElement>(null);
    const [scans, setScans] = useState<IPScan[] | undefined>();
    const [modalView, setModalView] = useState(false);

    const syncData = useInterval(async () => {
        console.log('try sync data');
        const token = localStorage.getItem('token');
        if ( !token ) return;

        const data = await rpc.ipscan.get(token);
        if ( !data ) return;

        const dataSync = [...data];
        setScans(dataSync);
        console.log('synced data');

    }, 1500);

    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem('token');
            if ( !token ) return;
            setScans(await rpc.ipscan.get(token));
        }

        getData();

        syncData.start();
        return syncData.stop;
    })

    const endReached = (date: Date) => {
        return date < new Date();
    }

    const validateIP = (IP: string): boolean => {
        return /^((\d){1,3}\.){3}(\d){1,3}$/.test(IP)
    }

    const create = async (ip: string) => {
        const token = localStorage.getItem('token');
        if ( !token ) return;

        if ( !validateIP(ip) ) return console.log('invalid ip address');
        //Todo: show error


        const job = await rpc.ipscan.create(token, ip);

        if ( ipRef.current ) ipRef.current.value = "";
        setModalView(false);


        if ( typeof(job) === "string") {
            notifications.show({
                title: 'Error',
                color: 'red',
                message: job,
            });
        }

    }

    const stopScan = async (id: string) => {
        const token = localStorage.getItem('token');
        if ( !token ) return;

        await rpc.ipscan.stop(token, id);
    }

    const hackScan = async (id: string) => {
        const token = localStorage.getItem('token');
        if ( !token ) return;

        const money = await rpc.ipscan.hack(token, id);
        if ( money !== 0 ) {
            notifications.show({
                title: 'Scan Hacked',
                message: "you received " + money + "€ from the scan",
            });
        }
    }

    return <Stack>
        <Group position={"apart"}>
            <Title>Network Scanner</Title>
            <Button onClick={() => create(randomIP())}>new job</Button>
        </Group>

        <Modal
            title={"founded items"}
            opened={modalView}
            onClose={() => setModalView(false)}
        >
            <Stack>
                <Group>
                    <TextInput
                        ref={ipRef}
                        placeholder="0.0.0.0"
                        label="IP"
                        withAsterisk
                    />
                    <Button onClick={() => {
                        if ( !ipRef.current ) return;
                        ipRef.current.value = randomIP();
                    }}>random IP</Button>
                </Group>


                <Group position={"apart"}>
                    <Button variant={"outline"} onClick={() => setModalView(false)}>Cancel</Button>
                    <Button onClick={() => {
                        if ( !ipRef.current ) return;
                        create(ipRef.current.value);
                    }}>run</Button>
                </Group>
            </Stack>
        </Modal>
        <Table striped highlightOnHover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>IP</th>
                    <th>Found</th>
                    <th>End</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            { scans && scans.map((scan, index) => {
                return <tr key={index}>
                    <th>{scan.id}</th>
                    <th>{formatDateTime(scan.created)}</th>
                    <th>{scan.ip}</th>
                    <th>
                        <Group>
                            {!endReached(scan.endAt) &&
                                <Loader size={"sm"} />
                            }
                            {scan.found}
                        </Group>
                    </th>
                    <th>
                        {!endReached(scan.endAt) && <Badge color={"yellow"}>
                            {calculateRemainingTime(scan.endAt)}
                        </Badge>}
                        {endReached(scan.endAt) &&
                            <>
                                {!scan.found && <Badge color={"red"}>FAILED</Badge>}
                                {scan.found && <Badge color={"green"}>DONE</Badge>}
                            </>
                        }
                    </th>
                    <th>
                        { !endReached(scan.endAt) &&
                            <ActionIcon onClick={() => stopScan(scan.id)}>
                                <IconClockStop />
                            </ActionIcon>
                        }
                        { endReached(scan.endAt) &&
                            <ActionIcon onClick={() => hackScan(scan.id)}>
                                <IconHash />
                            </ActionIcon>
                        }
                    </th>
                </tr>
            })}

            </tbody>
        </Table>
    </Stack>
}