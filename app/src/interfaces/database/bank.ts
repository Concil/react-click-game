

export interface Bank {
    id: string;
    name: string;
    countryCode: string;
    bankCode: string;
    iban: string;
    money: number;
    created: Date;
    deleteAt: Date;
}