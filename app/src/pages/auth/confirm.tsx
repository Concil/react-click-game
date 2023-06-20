import {Button, Container, Loader, Stack, Text} from "@mantine/core";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {API, APIError, RequestMethod} from "../../core/api";


export function Confirm() {
    const { email, id } = useParams();
    const nav = useNavigate();

    const [result, setResult] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const checkToken = async () => {
        const request = await API.request<boolean>(RequestMethod.POST, "auth/confirm", {
            email: email,
            id: id
        }, true);

        if ( request instanceof APIError ) {
            setResult(false);
        } else {
            setResult(request);
        }

        setLoading(false);
    }

    useEffect(() => {
        checkToken();
    }, []);

    return <Container>
        { loading &&
            <Loader />
        }

        { !loading && result &&
            <Stack>
                <Text>Aktiviert, Danke, willkommen, leg los!</Text>
                <Button onClick={() => nav("/login")}>LOS</Button>
            </Stack>
        }

        { !loading && !result &&
            <Stack>
                <Text>Aktivierung nicht möglich</Text>
            </Stack>
        }
    </Container>
}