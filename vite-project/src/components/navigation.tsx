import {
    IconAccessPoint,
    IconBriefcase,
    IconBrightnessDown,
    IconDashboard,
    IconDeviceLaptop,
    IconHomeStats,
    IconShoppingBag,
    IconStars,
} from '@tabler/icons-react';
import {Box, NavLink} from '@mantine/core';
import {useLocation, useNavigate} from "react-router-dom";

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

function MainLink({ icon, label, type, link }: MainLinkProps) {
    const navigate = useNavigate();
    const path = useLocation();

    const onItemClick = () => {
        console.log('clicked on', label, type, link);
        if ( !!type ) return;
        if ( !link ) return;

        navigate(link);
    }

    return (
        <NavLink
            variant="filled"
            active={link === path.pathname}
            key={label}
            label={label}
            disabled={!!type}
            leftSection={icon}
            onClick={onItemClick}
        />
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
    return (
        <Box w={"100%"} key={"mainLinksComponent"}>{links}</Box>
    );
}