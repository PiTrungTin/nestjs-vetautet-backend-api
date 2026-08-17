import { Inject, Injectable } from '@nestjs/common';
import { access, readFile, writeFile } from 'fs/promises';
import type { DbModuleOptions } from './db.module';

@Injectable()
export class DbService {

    @Inject('OPTIONS') 
    private options!: DbModuleOptions;

    async read() {
        const path = this.options.path;
        await access(path);

        const jsonData = await readFile(path, {
            encoding: 'utf-8',
        });
        const parsedData = JSON.parse(jsonData);
        return Array.isArray(parsedData) ? parsedData : [];

    }

    async write(obj: Record<string, any>) { //save db options
        await writeFile(this.options.path, JSON.stringify(obj || []),{
            encoding: 'utf-8',
        });
    }
}
