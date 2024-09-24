import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseSeederService {
    constructor(private dataSource: DataSource) { }

    async seed() {
        try {
            const filePath = path.join(process.cwd(), 'src', 'data.sql');
            const sql = fs.readFileSync(filePath, 'utf-8');
            
            const queries = sql
                .split(';')
                .map(query => query.trim())
                .filter(query => query.length > 0);

            for (const query of queries) {
                console.log('Ejecutando query:', query);
                await this.dataSource.query(query);
            }

        } catch (error) {
            console.error('Error ejecutando el seed:', error);
        }
    }
}