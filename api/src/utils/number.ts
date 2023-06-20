
export function generateRandomCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters1 = letters[Math.floor(Math.random() * letters.length)];
    const randomLetters2 = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber1 = Math.floor(Math.random() * 10);
    const randomNumber2 = Math.floor(Math.random() * 10);

    return `${randomLetters1}${randomLetters1}${randomLetters1}${randomNumber1}-${randomLetters2}${randomLetters2}${randomLetters2}${randomNumber2}`;
}

export function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


export function generateRandomIBAN(countryCode: string, bankCode: string): string {
    //const countryCode = 'DE'; // Landescode (hier: Deutschland)
    //const bankCode = '10020030'; // Bankleitzahl (8-11 Stellen)
    const accountNumber = generateRandomNumber(10); // Kontonummer (10 Stellen)

    // Prüfziffer berechnen
    const checkDigits = calculateCheckDigits(countryCode, bankCode, accountNumber);

    // IBAN zusammensetzen
    return `${countryCode}${checkDigits}${bankCode}${accountNumber}`;
}

export function generateRandomNumber(length: number): string {
    let number = '';
    for (let i = 0; i < length; i++) {
        const digit = Math.floor(Math.random() * 10);
        number += digit.toString();
    }
    return number;
}


function calculateCheckDigits(countryCode: string, bankCode: string, accountNumber: string): string {
    const countryCodeDigits = convertLettersToDigits(countryCode);
    const bankCodeDigits = bankCode + '00'; // Bankleitzahl + '00'
    const accountNumberDigits = accountNumber + countryCodeDigits + bankCodeDigits + '00';

    let checksum: number = 98 - modulo97(accountNumberDigits);
    if (checksum < 10) {
        checksum = parseInt('0' + checksum.toString());
    }

    return checksum.toString();
}

function convertLettersToDigits(letters: string): string {
    let digits = '';
    for (let i = 0; i < letters.length; i++) {
        const char = letters[i];
        const charCode = char.charCodeAt(0) - 55; // 'A' = 10, 'B' = 11, usw.
        digits += charCode.toString();
    }
    return digits;
}

function modulo97(number: string): number {
    let value = number;
    let chunkSize = 9;

    while (value.length > chunkSize) {
        const chunk = value.slice(0, chunkSize);
        const remainder = parseInt(chunk, 10) % 97;
        value = remainder.toString() + value.slice(chunkSize);
    }

    return parseInt(value, 10) % 97;
}

export function generateCountryCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const letterA = letters[Math.floor(Math.random() * letters.length)];
    const letterB = letters[Math.floor(Math.random() * letters.length)];
    return letterA + letterB;
}


export function randomIP(): string {
    return randomNumber(100, 999) + "." + randomNumber(100, 999) + "." + randomNumber(100, 999) + "." + randomNumber(100, 999);
}