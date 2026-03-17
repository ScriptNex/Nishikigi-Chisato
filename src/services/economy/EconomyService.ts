import fs from 'fs';
import path from 'path';

export class EconomyService {
    dataPath: string;
    users: Record<string, number>;

    constructor() {
        this.dataPath = path.join(process.cwd(), 'data', 'economy.json');
        if (!fs.existsSync(path.dirname(this.dataPath))) {
            fs.mkdirSync(path.dirname(this.dataPath), { recursive: true });
        }
        if (!fs.existsSync(this.dataPath)) {
            fs.writeFileSync(this.dataPath, JSON.stringify({}));
        }
        this.users = JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
    }

    save() {
        fs.writeFileSync(this.dataPath, JSON.stringify(this.users, null, 2));
    }

    addMoney(userId: string, amount: number) {
        if (!this.users[userId]) this.users[userId] = 0;
        this.users[userId] += amount;
        this.save();
    }

    getBalance(userId: string) {
        return this.users[userId] || 0;
    }
}
