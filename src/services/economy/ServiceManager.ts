import CacheManager from '../utils/CacheManager.js';
import { EconomyService } from './economy/EconomyService.js';

export class ServiceManager {
    economy: EconomyService;
    cache: CacheManager;

    constructor() {
        this.economy = new EconomyService();
        this.cache = new CacheManager(300);
    }
}
