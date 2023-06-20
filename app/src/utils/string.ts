

export function generateRandomUserAgent(): string {
    const platforms = [
        'Windows NT 10.0',
        'Windows NT 6.1',
        'Windows NT 6.3',
        'Macintosh; Intel Mac OS X 10_15_7',
        'Macintosh; Intel Mac OS X 11_4_0',
        'X11; Linux x86_64'
        // Füge hier weitere Plattformen hinzu, falls gewünscht
    ];

    const browsers = [
        'Chrome',
        'Firefox',
        'Safari',
        'Opera',
        'Edge'
        // Füge hier weitere Browser hinzu, falls gewünscht
    ];

    const versions = [
        '93.0.4577.63',
        '92.0.4515.131',
        '91.0.4472.124',
        '90.0.4430.93',
        '89.0.4389.82'
        // Füge hier weitere Versionen hinzu, falls gewünscht
    ];

    const randomPlatformIndex = Math.floor(Math.random() * platforms.length);
    const randomBrowserIndex = Math.floor(Math.random() * browsers.length);
    const randomVersionIndex = Math.floor(Math.random() * versions.length);

    const platform = platforms[randomPlatformIndex];
    const browser = browsers[randomBrowserIndex];
    const version = versions[randomVersionIndex];

    return `Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/${version}`;
}


export function getRandomUserAgent(): string {
    const userAgents = [
        generateRandomUserAgent(),
        generateRandomUserAgent(),
        generateRandomUserAgent(),
        generateRandomUserAgent(),
        generateRandomUserAgent(),
        generateRandomUserAgent(),
    ];

    const randomIndex = Math.floor(Math.random() * userAgents.length);
    return userAgents[randomIndex];
}