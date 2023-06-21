
export interface UserSession {
    id: string;

    user: User;
    expire: Date;
    created: Date;
}

export interface User {
    id: string;

    username: string;
    email: string;
    password: string;

    health: number;
    money: number;
    exp: number;
    lastLogin?: Date;
    session?: UserSession;

    created: Date;
}