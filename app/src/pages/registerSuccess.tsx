import {Container, Stack, Text, Title} from "@mantine/core";

export function RegisterSuccess() {
    return <Container>
        <Stack>
            <Title>successfully registered!</Title>
            <Text>
                please visit your email and confirm your registration!
            </Text>
        </Stack>
    </Container>
}