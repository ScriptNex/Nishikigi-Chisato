import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'economy.json');

export class EconomyService {
    data: Record<string, number>;

    constructor() {
        if (fs.existsSync(dbPath)) {
            this.data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        } else {
            this.data = {};
        }
    }

    addMoney(userId: string, amount: number) {
        if (!this.data[userId]) this.data[userId] = 0;
        this.data[userId] += amount;
        this.save();
    }

    getMoney(userId: string) {
        return this.data[userId] || 0;
    }

    private save() {
        fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2));
    }
}
