import fs from 'fs';
import path from 'path';

export const readFile = filePath => fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');

export const getExt = filePath => path.extname(filePath);
