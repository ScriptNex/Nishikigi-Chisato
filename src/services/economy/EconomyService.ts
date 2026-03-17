export class EconomyService {
    db: any

    constructor(db: any) {
        this.db = db
    }

    getUser(id: string) {
        if (!this.db.users[id]) {
            this.db.users[id] = {
                yenes: 0,
                bank: 0,
                characters: []
            }
        }
        return this.db.users[id]
    }

    getMoney(id: string) {
        return this.getUser(id).yenes
    }

    addMoney(id: string, amount: number) {
        const user = this.getUser(id)
        user.yenes += amount
        return user.yenes
    }

    removeMoney(id: string, amount: number) {
        const user = this.getUser(id)
        if (user.yenes < amount) return false
        user.yenes -= amount
        return true
    }

    deposit(id: string, amount: number) {
        const user = this.getUser(id)
        if (user.yenes < amount) return false
        user.yenes -= amount
        user.bank += amount
        return true
    }

    withdraw(id: string, amount: number) {
        const user = this.getUser(id)
        if (user.bank < amount) return false
        user.bank -= amount
        user.yenes += amount
        return true
    }
}
