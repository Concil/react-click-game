export function formatDateTime(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(date, today)) {
        return 'Heute um ' + formatTime(date);
    } else if (isSameDay(date, yesterday)) {
        return 'Gestern um ' + formatTime(date);
    } else {
        return formatDate(date) + ' um ' + formatTime(date);
    }
}

function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

function formatTime(date: Date): string {
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return hours + ':' + minutes;
}

function formatDate(date: Date): string {
    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear();
    return day + '.' + month + '.' + year;
}

function padZero(value: number): string {
    return value.toString().padStart(2, '0');
}

function formatTime2(hours: number, minutes: number, seconds: number): string {
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function calculateRemainingTime(endDate: Date): string {
    const currentTime = new Date();
    const remainingMilliseconds = endDate.getTime() - currentTime.getTime();

    if (remainingMilliseconds <= 0) {
        return '00:00:00';
    }

    const remainingSeconds = Math.floor(remainingMilliseconds / 1000);
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    return formatTime2(hours, minutes, seconds);
}