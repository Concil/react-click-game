import {useParams} from "react-router-dom";
import {Container, Title} from "@mantine/core";
import {useEffect} from "react";
import {API, RequestMethod} from "../core/api";


export function PageClick() {
    const { id } = useParams();

    useEffect(() => {

        const makeClick = async () => {
            await API.request<boolean>(RequestMethod.GET, "user/click/" + id);
        }

        makeClick();

    }, []);

    return <Container>
        <Title>You have been hacked!</Title>
    </Container>
}