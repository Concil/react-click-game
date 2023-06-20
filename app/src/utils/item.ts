
export function getItemImagePath(name: string, condition: number): string {
    if ( condition <= 0.2) return `/images/items/${name}-0.2.png`;
    if ( condition <= 0.4) return `/images/items/${name}-0.4.png`;
    if ( condition <= 0.6) return `/images/items/${name}-0.6.png`;
    if ( condition <= 0.8) return `/images/items/${name}-0.8.png`;
    return `/images/items/${name}-1.png`;
}

export function getItemPrice(price: number, condition: number, offer: number = 0): number {
    const priceRegular = (price * condition);

    if ( offer !== 0 ) {
        const offerPrice = priceRegular * offer / 100;
        return priceRegular - offerPrice;
    }

    return priceRegular;
}