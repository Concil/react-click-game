import React, {useEffect, useState} from 'react';
import {
    IconChevronRight,
    IconChevronLeft,
    IconSettings,
    IconMessageCircle,
    IconPhoto,
    IconSearch, IconArrowsLeftRight, IconTrash
} from '@tabler/icons-react';
import { UnstyledButton, Group, Avatar, Text, Box, useMantineTheme, rem, Menu } from '@mantine/core';
import {useOutletContext} from "react-router-dom";
import {User} from "../interfaces/database/user";
import {RPC} from "../interfaces/rpc";

export function UserWidget(props: {rpc: RPC}) {
    const {rpc} = props;
    const [user, setUser] = useState<User>();


    useEffect(() => {
        const getData = async () => {
            console.log('client?:', rpc);
            if ( !rpc ) return;
            const token = localStorage.getItem('token');
            if ( !token ) return;

            const data = await rpc.user.getData(token);
            setUser(data);
        }

        getData();
    }, []);


    const theme = useMantineTheme();

    return (
        <Box>
            { user &&
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <UnstyledButton
                            sx={{
                                display: 'block',
                                width: '100%',
                                padding: theme.spacing.xs,
                                borderRadius: theme.radius.sm,
                                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                                '&:hover': {
                                    backgroundColor:
                                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                                },
                            }}
                        >
                            <Group>
                                <Avatar
                                    src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                                    radius="xl"
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Text size="sm" weight={500}>
                                        {user.username}
                                    </Text>
                                    <Text color="dimmed" size="xs">
                                        {user.email}
                                    </Text>
                                </Box>

                                {theme.dir === 'ltr' ? (
                                    <IconChevronRight size={rem(18)} />
                                ) : (
                                    <IconChevronLeft size={rem(18)} />
                                )}
                            </Group>
                        </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Application</Menu.Label>
                        <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
                        <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
                        <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
                        <Menu.Item
                            icon={<IconSearch size={14} />}
                            rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
                        >
                            Search
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Label>Danger zone</Menu.Label>
                        <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
                        <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            }
        </Box>
    );
}