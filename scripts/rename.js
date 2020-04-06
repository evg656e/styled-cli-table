import * as fs from 'fs';
const { rename } = fs.promises;
const [src, dst] = process.argv.slice(2);
rename(src, dst).catch(err => {
    console.error(err);
    process.exit(err.errno);
});
