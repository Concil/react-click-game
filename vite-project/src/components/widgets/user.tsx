import React from 'react';
import {
    IconArrowsLeftRight,
    IconChevronRight,
    IconMessageCircle,
    IconPhoto,
    IconSearch,
    IconSettings,
    IconTrash
} from '@tabler/icons-react';
import {Avatar, Box, Group, Menu, Text, UnstyledButton} from '@mantine/core';
import {useGame} from '../../providers/game';

export function UserWidget() {
    const {user} = useGame();

    return (
        <Box>
            { user &&
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <UnstyledButton>
                            <Group>
                                <Avatar
                                    src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                                    radius="xl"
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Text size="sm" weight={500}>
                                        {user.username}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {user.email}
                                    </Text>
                                </Box>
                                <IconChevronRight />
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