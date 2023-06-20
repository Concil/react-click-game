import {Button, Container, Input, Stack} from "@mantine/core";
import {IconAt, IconUser} from "@tabler/icons-react";
import {useRef, useState} from "react";
import {API, APIError, APIErrors, RequestMethod} from "../core/api";
import {UserSession} from "../interfaces/user";
import {useNavigate} from "react-router-dom";


export function Register() {
    const [errors, setError] = useState<APIErrors[]>([]);
    const nav = useNavigate();

    const username = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const passwordRepeat = useRef<HTMLInputElement>(null);

    const onSubmit = async () => {
        if ( username.current == null ) return;
        if ( email.current == null ) return;
        if ( password.current == null ) return;
        if ( passwordRepeat.current == null ) return;

        if ( password.current.value !== passwordRepeat.current.value ) {
            setError([
                new APIErrors("password", "password not matching"),
                new APIErrors("passwordRepeat", "not match with password")
            ])
            return;
        }

        const request = await API.request<UserSession>(RequestMethod.POST, "user/register", {
            username: username.current.value,
            email: email.current.value,
            password: password.current.value,
        }, true);

        if ( request instanceof APIError ) {
            console.log(request.errors);
            setError(request.errors);
        } else {
            nav("/register/success");
        }
    };

    const inputError = (path: string): string => {
        if ( errors.length === 0 ) return "";

        const error = errors.find((err)=>err.path === path);
        if ( !error ) return "";
        if ( !error.message ) return "";

        return error.message;
    }

    return <Container>
        <Stack>
            <Input.Wrapper label="Username" error={inputError("username")}>
                <Input variant="filled" icon={<IconUser />} ref={username} onChange={() => setError([])} />
            </Input.Wrapper>
            <Input.Wrapper label="EMail" error={inputError("username")}>
                <Input type="email" variant="filled" icon={<IconAt />} ref={email} onChange={() => setError([])} />
            </Input.Wrapper>
            <Input.Wrapper label="Password" error={inputError("password")}>
                <Input variant="filled" type={"password"} ref={password} onChange={() => setError([])} />
            </Input.Wrapper>
            <Input.Wrapper label="Password Repeat" error={inputError("password")}>
                <Input variant="filled" type={"password"} ref={passwordRepeat} onChange={() => setError([])} />
            </Input.Wrapper>

            <Button onClick={onSubmit}>Register</Button>
        </Stack>
    </Container>
}