import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const connection = require('postgres');

const sql = connection(process.env.DATABASE_URL!);

export const DrizzleProvider = {
  provide: 'DRIZZLE',
  useFactory: () => {
    return drizzle(sql, { schema });
  },
};