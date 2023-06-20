import {useEffect} from "react";
import {useNavigate} from "react-router-dom";


export function Home() {
    const nav = useNavigate();
    useEffect(() => {
        nav("/game");
    })
    return <></>;
}