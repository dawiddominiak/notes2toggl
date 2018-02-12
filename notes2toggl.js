const getStdin = require('get-stdin');
const parseNotes = require('./parseNotes');
const sendToToggl = require('./sendToToggl');
const { promisify } = require('util');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);
const notesFile = process.argv.length > 2 && process.argv[2];

async function main() {
  try {
    const notes = notesFile ? await readFileAsync(notesFile) : await getStdin();
    const timeEntryData = parseNotes(notes.toString());
    await sendToToggl(timeEntryData);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
main();
