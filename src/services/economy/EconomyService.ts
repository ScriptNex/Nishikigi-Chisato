export class EconomyService {
    users: Map<string, { yenes: number; bank: number }>;

    constructor() {
        this.users = new Map();
    }

    getUser(userId: string) {
        if (!this.users.has(userId)) this.users.set(userId, { yenes: 0, bank: 0 });
        return this.users.get(userId)!;
    }

    addMoney(userId: string, amount: number) {
        const user = this.getUser(userId);
        user.yenes += amount;
    }
}
