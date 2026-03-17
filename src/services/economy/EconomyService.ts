export class EconomyService {
    users: Map<string, number>

    constructor() {
        this.users = new Map()
    }

    getMoney(userId: string) {
        return this.users.get(userId) || 0
    }

    addMoney(userId: string, amount: number) {
        const current = this.getMoney(userId)
        this.users.set(userId, current + amount)
    }
}
