import fs from "fs";
import generateObject from "../generateObject.js";
import validateSchema from "./validators/schemaValidator";
const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help")) {
    console.log(`
Usage: node cli.js <schema-file> [--count <number>] [--out <file>]

Options:
  --count <number>   Number of objects to generate (default: 1)
  --out <file>       Output JSON file (if not provided, prints to console)
  --help             Show this help message
`);
    process.exit(0);
}


const schemaPath = args[0];

let count = 1;
let outFile = null;

const countIndex = args.indexOf("--count");
const outIndex = args.indexOf("--out");

if (countIndex !== -1) {
  count = Number(args[countIndex + 1]);
  if (isNaN(count) || count < 1) {
    console.error("--count must be a positive number");
    process.exit(1);
  }
}


if (outIndex !== -1) {
  outFile = args[outIndex + 1];
}

let schemaRaw;

try {
  schemaRaw = fs.readFileSync(schemaPath, "utf-8");
} catch (err) {
  console.error("Failed to read schema file");
  console.error(err.message);
  process.exit(1);
}

let schema;

try {
  schema = JSON.parse(schemaRaw);
} catch (err) {
  console.error("Invalid JSON in schema file");
  console.error(err.message);
  process.exit(1);
}

try {
    
    validateSchema(schema);
} catch (err) {
    console.error("Schema error:", err.message);
    process.exit(1);
}


const results = [];
for(let i = 0; i < (count); i++){
    results.push(generateObject(schema));
}

if(outFile){
    fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
    console.log(`Data saved to ${outFile}`);
} else {
    console.log(JSON.stringify(results, null, 2));
}



