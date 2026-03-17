export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-ES').format(num);
};

export const formatNumberLarge = (num: number): string => {
    const suffixes = [
        { val: 1e33, suffix: 'Dc' },
        { val: 1e30, suffix: 'No' },
        { val: 1e27, suffix: 'Oc' },
        { val: 1e24, suffix: 'Sp' },
        { val: 1e21, suffix: 'Sx' },
        { val: 1e18, suffix: 'Qi' },
        { val: 1e15, suffix: 'Qa' },
        { val: 1e12, suffix: 'T' },
        { val: 1e9, suffix: 'B' },
        { val: 1e6, suffix: 'M' },
        { val: 1e3, suffix: 'K' }
    ];

    for (const { val, suffix } of suffixes) {
        if (num >= val) {
            const formatted = (num / val).toFixed(1);
            return (formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted) + suffix;
        }
    }

    return num.toString();
};

export const formatCoins = (amount: number): string => {
    return amount.toLocaleString('es-ES');
};

export const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;

    return `${seconds}s`;
};

export const getCooldown = (lastTime: number, cooldownMs: number): number => {
    const now = Date.now();
    const timeLeft = lastTime + cooldownMs - now;
    return timeLeft > 0 ? timeLeft : 0;
};

export const styleText = (
    text: string,
    style: 'bold' | 'italic' | 'underline' | 'code' | 'strike' = 'bold'
): string => {
    switch (style) {
        case 'bold':
            return `**${text}**`;
        case 'italic':
            return `*${text}*`;
        case 'underline':
            return `__${text}__`;
        case 'code':
            return `\`${text}\``;
        case 'strike':
            return `~~${text}~~`;
        default:
            return text;
    }
};
