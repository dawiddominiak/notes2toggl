const getStdin = require('get-stdin');
const parseNotes = require('./parseNotes');
const sendToToggl = require('./sendToToggl');
const { promisify } = require('util');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);
const notesFile = process.argv.length > 1 && process.argv[1];

async function main() {
  try {
    const notes = await notesFile ? readFileAsync(notesFile) : getStdin();
    const timeEntryData = parseNotes(notes);
    const results = sendToToggl(timeEntryData);
    console.log(results);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
main();
