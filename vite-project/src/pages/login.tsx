import {Button, Container, Input, Stack} from "@mantine/core";
import {IconAt} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";
import {API, APIError, APIErrors, RequestMethod} from "../core/api";
import {UserSession} from "../interfaces/database/user";
import {useNavigate} from "react-router-dom";
import {useGame} from "../providers/game.tsx";


export function Login() {
    const { setToken, setUser } = useGame();

    const [errors, setError] = useState<APIErrors[]>([]);

    const nav = useNavigate();

    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    const onLogin = async () => {
        if ( username.current == null ) return;
        if ( password.current == null ) return;

        const request = await API.request<UserSession>(RequestMethod.POST, "user/login", {
            username: username.current.value,
            password: password.current.value,
        }, true);

        if ( request instanceof APIError ) {
            setError(request.errors);
            return;
        }

        setToken(request.id);
        setUser(request.user);
        localStorage.setItem('token', request.id);
        nav("/game");
    };

    const inputError = (path: string): string => {
        if ( errors.length === 0 ) return "";

        const error = errors.find((err)=>err.path === path);
        if ( !error ) return "";
        if ( !error.message ) return "";

        return error.message;
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if ( !token ) return;
        if ( token.length <= 10 ) return;

        nav("/game");
    }, []);

    return <Container>
        <Stack>
            <Input.Wrapper label="Username" error={inputError("username")}>
                <Input variant="filled" icon={<IconAt />} ref={username} onChange={() => setError([])} />
            </Input.Wrapper>
            <Input.Wrapper label="Password" error={inputError("password")}>
                <Input variant="filled" type={"password"} ref={password} onChange={() => setError([])} />
            </Input.Wrapper>

            <Button onClick={onLogin}>Login</Button>
        </Stack>
    </Container>
}