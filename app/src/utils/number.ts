import {ItemTypes} from "../interfaces/item";


export function getShort(number: number): string {
    const units = ['', 'K', 'M', 'B', 'T', 'Q'];
    let unitIndex = 0;

    while (number >= 1000 && unitIndex < units.length - 1) {
        number /= 1000;
        unitIndex++;
    }

    const shortenedNumber = number % 1 === 0 ? Math.floor(number) : number.toFixed(1);
    const shortenedText = shortenedNumber.toString().replace(/\.0$/, '') + units[unitIndex];

    return shortenedText;
}

export function randNum(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomIP(): string {
    return randNum(100, 999) + "." + randNum(100, 999) + "." + randNum(100, 999) + "." + randNum(100, 999);
}

//const randomIBAN = generateRandomIBAN();


export function getConditionText(condition: number, itemType: number): string {
    if ( itemType === ItemTypes.BOX ) return "";
    if (condition <= 0.2 ) return "Kampfspuren";
    if (condition <= 0.4 ) return "Abgenutzt";
    if (condition <= 0.6 ) return "Einsatzerprobt";
    if (condition <= 0.8 ) return "Minimale Gebrauchsspuren";
    return "Fabrikneu";
}