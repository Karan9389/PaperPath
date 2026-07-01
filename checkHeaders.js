import fs from 'fs';
import readline from 'readline';

// 🎯 REPLACE THIS with the actual filename or path of your Kaggle CSV file
const CSV_FILE_PATH = './dblp-v10.csv'; 

const checkFirstLine = async () => {
    try {
        const fileStream = fs.createReadStream(CSV_FILE_PATH);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        // Read only the very first line (the headers) and stop immediately
        for await (const line of rl) {
            console.log("\n🎯 FOUND YOUR CSV COLUMNS:");
            console.log("--------------------------------------------------");
            console.log(line);
            console.log("--------------------------------------------------\n");
            rl.close();
            break;
        }
    } catch (error) {
        console.error("❌ Error reading the file:", error.message);
    }
};

checkFirstLine();