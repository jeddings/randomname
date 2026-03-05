#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Load the original generator code (non-module JS) into a sandboxed context
const generatorPath = path.join(__dirname, "..", "src", "generatenames.js");
const generatorCode = fs.readFileSync(generatorPath, "utf8");

const sandbox = { console }; // keep console available if needed
vm.createContext(sandbox);
vm.runInContext(generatorCode, sandbox, { filename: generatorPath });

// The generator defines generateNames(...) in the global scope of that context
const generateNames = sandbox.generateNames;
if (typeof generateNames !== "function") {
  console.error("Failed to load generateNames() from src/generatenames.js");
  process.exit(1);
}

function usage() {
  console.log(`
Usage:
  node bin/randomname.js --seed <filename-in-data-or-path> [--num 10] [--min 3] [--max 12] [--no-filter-dups]
  node bin/randomname.js --list
`);
}

function parseArgs(argv) {
  const args = { num: 10, min: 3, max: 12, filterDups: true };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--list") args.list = true;
    else if (a === "--seed") args.seed = argv[++i];
    else if (a === "--num") args.num = parseInt(argv[++i], 10);
    else if (a === "--min") args.min = parseInt(argv[++i], 10);
    else if (a === "--max") args.max = parseInt(argv[++i], 10);
    else if (a === "--no-filter-dups") args.filterDups = false;
    else {
      console.error(`Unknown arg: ${a}`);
      args.help = true;
    }
  }
  return args;
}

function resolveSeedPath(seedArg) {
  if (!seedArg) return null;
  const direct = path.resolve(process.cwd(), seedArg);
  if (fs.existsSync(direct)) return direct;

  const inData = path.join(__dirname, "..", "data", seedArg);
  if (fs.existsSync(inData)) return inData;

  return null;
}

const args = parseArgs(process.argv);
if (args.help) {
  usage();
  process.exit(0);
}

if (args.list) {
  const manifestPath = path.join(__dirname, "..", "data", "seedlists.json");
  const list = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const f of list) console.log(f);
  process.exit(0);
}

const seedPath = resolveSeedPath(args.seed);
if (!seedPath) {
  console.error("Missing or invalid --seed. Use --list to see available lists.");
  usage();
  process.exit(1);
}

const seedText = fs.readFileSync(seedPath, "utf8");
const out = generateNames(args.num, args.min, args.max, seedText, args.filterDups);
process.stdout.write(out);