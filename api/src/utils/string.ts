

export function generateBankName(): string {
    const bankAdjectives: string[] = [
        "National", "International", "Global", "Regional", "United", "Central", "First", "Trust",
        "Citizens", "Secure", "Investment", "Capital", "Safe", "Reserve", "Commercial", "Private",
        "Reliable", "Premier", "Solid", "Innovative", "Leading", "Advanced", "Premium", "Exclusive"
    ];
    const bankNouns: string[] = [
        "Bank", "Trust", "Group", "Financial", "Institution", "Corp", "Holdings", "Union",
        "Credit", "Savings", "Assets", "Wealth", "Ventures", "Partners", "Capital", "Equity",
        "Funds", "Investments", "Securities", "Services", "Banking", "Finance", "Advisors", "Alliance"
    ];

    const randomAdjective: string = bankAdjectives[Math.floor(Math.random() * bankAdjectives.length)];
    const randomNoun: string = bankNouns[Math.floor(Math.random() * bankNouns.length)];

    return `${randomAdjective} ${randomNoun}`;
}