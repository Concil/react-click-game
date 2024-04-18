import {User} from "../interfaces/database/user";
import {RPC} from "../interfaces/rpc";
import {createContext, FunctionComponent, ReactNode, useContext, useEffect, useState} from "react";


interface UserContextType {
    user: User | undefined;
    setUser: (user: User) => void;

    rpc: RPC | undefined;
    setRPC: (rpc: RPC) => void;

    token: string | null;
    setToken: (token: string) => void;
}


const GameContext = createContext<UserContextType | undefined>(undefined);


export const GameProvider: FunctionComponent<{children: ReactNode}> = ({ children }) => {
    const [ rpc, setRPC ] = useState<RPC | undefined>(undefined);
    const [ user, setUser ] = useState<User | undefined>(undefined);
    const [ token, setToken ] = useState<string | null>(localStorage.getItem('token'));

    return (
        <GameContext.Provider value={{ rpc, setRPC, user, setUser, token, setToken }}>
            {children}
        </GameContext.Provider>
    );
};

// custom hook
export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame muss innerhalb eines GameProvider verwendet werden');
    }
    return context;
};