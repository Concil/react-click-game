import React from 'react';
import {
    Icon24Hours,
    IconAccessPoint,
    IconBriefcase,
    IconBrightnessDown,
    IconDashboard,
    IconDeviceLaptop,
    IconHomeStats,
    IconShoppingBag,
    IconStars,
} from '@tabler/icons-react';
import {createStyles, Group, Text, ThemeIcon, UnstyledButton} from '@mantine/core';
import {useNavigate} from "react-router-dom";

enum MainLinkTypes {
    LINK,
    HEADING
}
interface MainLinkProps {
    icon?: React.ReactNode;
    label: string;
    link?: string;
    type?: MainLinkTypes
}


const useStyles = createStyles((theme) => ({
    category: {
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        '&:hover': {
            cursor: 'default'
        }
    },
    link: {
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
            backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },

    }
}));

function MainLink({ icon, label, type, link }: MainLinkProps) {
    const { classes } = useStyles();
    const nav = useNavigate();
    return (
        <UnstyledButton key={label} className={(type ? classes.category : classes.link)} onClick={() => !type && link && nav(link)}>
            { type === undefined &&
                <Group>
                    <ThemeIcon variant="light" color={"green"}>{icon}</ThemeIcon>
                    <Text size="sm">{label}</Text>
                </Group>
            }
            { type === MainLinkTypes.HEADING &&
                <Group>
                    <Text size="sm">{label}</Text>
                </Group>
            }
        </UnstyledButton>
    );
}

const data = [
    { icon: <IconDashboard size="1rem" />, label: 'Dashboard', link: '/game'},
    { label: 'Games', type: MainLinkTypes.HEADING },
    { icon: <IconAccessPoint size="1rem" />, label: 'Hacks', link: '/game/hacks'},
    { icon: <IconAccessPoint size="1rem" />, label: 'IP-Scanner', link: '/game/ip/scanner'},
    { icon: <IconAccessPoint size="1rem" />, label: 'WiFi Scan', link: '/game/wifi'},
    { icon: <IconAccessPoint size="1rem" />, label: 'Bank Hacking', link: '/game/bank'},
    { label: 'Inventar', type: MainLinkTypes.HEADING },
    { icon: <IconAccessPoint size="1rem" />, label: 'Ausrüstung', link: '/game/inventory'},
    { icon: <IconDeviceLaptop size="1rem" />, label: 'Werkstatt', link: '/game/craft'},
    { label: 'Shop', type: MainLinkTypes.HEADING },
    { icon: <IconShoppingBag size="1rem" />, label: 'Schwarzmarkt', link: '/game/blackmarket'},
    { icon: <IconShoppingBag size="1rem" />, label: 'Marktplatz', link: '/game/market'},
    { label: 'Jobs', type: MainLinkTypes.HEADING },
    { icon: <IconBriefcase size="1rem" />, label: 'Arbeit', link: '/game/jobs'},
    { icon: <IconBrightnessDown size="1rem" />, label: 'Gewinnspiel', link: '/game/contest'},
    { label: 'Statistik', type: MainLinkTypes.HEADING },
    { icon: <IconStars size="1rem" />, label: 'Highscore', link: '/game/highscore'},
    { icon: <IconHomeStats size="1rem" />, label: 'Statistiks', link: '/game/stats'},
];

export function MainLinks() {
    const links = data.map((link) => <MainLink {...link} key={link.label} />);
    return <div key={"mainLinksComponent"}>{links}</div>;
}