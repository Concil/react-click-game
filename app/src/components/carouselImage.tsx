import {Button, createStyles, Paper, rem, Title, useMantineTheme, Text, Group, Image, Avatar} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {Carousel} from "@mantine/carousel";

const useStyles = createStyles((theme) => ({
    card: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 900,
        color: theme.white,
        lineHeight: 1.2,
        fontSize: rem(32),
        marginTop: theme.spacing.xs,
    },

    category: {
        color: theme.white,
        opacity: 0.7,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
}));

interface CardProps {
    image: string;
    title: string;
    category: string;
}

function Card({ image, title, category }: CardProps) {
    const { classes } = useStyles();

    return (
        <Paper
            shadow="md"
            p="xl"
            radius="md"
            className={classes.card}
        >
            <Group noWrap>
                <Avatar src={image} />
                <div>
                    <Text className={classes.category} size="xs">{category}</Text>
                    <Title order={3} className={classes.title}>{title}</Title>
                </div>
            </Group>
            <Button variant="subtle">VIEW</Button>
        </Paper>
    );
}

const data = [
    {
        image:'https://cdn.icon-icons.com/icons2/2621/PNG/512/tech_ram_icon_156951.png',
        title: '1GB RAM Module',
        category: 'hardware',
    },
    {
        image:'https://cdn.icon-icons.com/icons2/2621/PNG/512/tech_ram_icon_156951.png',
        title: '1 GHz CPU',
        category: 'hardware',
    },
    {
        image:'https://cdn.icon-icons.com/icons2/2621/PNG/512/tech_ram_icon_156951.png',
        title: '3GB RAM Module',
        category: 'hardware',
    },
    {
        image:'https://cdn.icon-icons.com/icons2/2621/PNG/512/tech_ram_icon_156951.png',
        title: '1.2 GHz CPU',
        category: 'hardware',
    },
    {
        image:'https://cdn.icon-icons.com/icons2/2621/PNG/512/tech_ram_icon_156951.png',
        title: '4GB RAM Module',
        category: 'hardware',
    },
];

export function CarouselImage() {
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const slides = data.map((item) => (
        <Carousel.Slide key={item.title}>
            <Card {...item} />
        </Carousel.Slide>
    ));

    return (
        <Carousel
            slideSize="30%"
            breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: rem(2) }]}
            slideGap="xl"
            loop
            align="start"
            slidesToScroll={mobile ? 1 : 2}
        >
            {slides}
        </Carousel>
    );
}