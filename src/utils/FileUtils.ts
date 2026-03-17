import fs from 'fs/promises';
import { existsSync } from 'fs';

export const FileUtils = {
    async readJSON(filePath: string): Promise<any | null> {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            return JSON.parse(content);
        } catch (error: any) {
            if (error.code === 'ENOENT') return null;
            throw error;
        }
    },

    async writeJSON(filePath: string, data: any, pretty: boolean = true): Promise<void> {
        const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
        await fs.writeFile(filePath, content, 'utf8');
    },

    async readBuffer(filePath: string): Promise<Buffer> {
        return fs.readFile(filePath);
    },

    async writeBuffer(filePath: string, buffer: Buffer): Promise<void> {
        await fs.writeFile(filePath, buffer);
    },

    exists(filePath: string): boolean {
        return existsSync(filePath);
    },

    async copy(src: string, dest: string): Promise<void> {
        await fs.copyFile(src, dest);
    },

    async delete(filePath: string): Promise<boolean> {
        try {
            await fs.unlink(filePath);
            return true;
        } catch {
            return false;
        }
    },

    async ensureDir(dirPath: string): Promise<void> {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error: any) {
            if (error.code !== 'EEXIST') throw error;
        }
    },

    async listFiles(dirPath: string, extension: string | null = null): Promise<string[]> {
        const files = await fs.readdir(dirPath);
        return extension ? files.filter(f => f.endsWith(extension)) : files;
    }
};

export default FileUtils;
