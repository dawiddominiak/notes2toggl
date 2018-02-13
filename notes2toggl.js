const getStdin = require('get-stdin');
const parseNotes = require('./parseNotes');
const sendToToggl = require('./sendToToggl');
const { promisify } = require('util');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);
const notesFile = process.argv.length > 2 && process.argv[2];

function logSuccess(results) {
  console.log('The following entries were successfully added:');
  results.forEach((result, i) => {
    const tagsDescription = typeof result.tags === 'undefined' ? 'no tags' : `the following tags ${result.tags.join(', ')}`
    console.log(`${i + 1}. ${result.description} with ${tagsDescription}.`);
  });
}

async function main() {
  try {
    const notes = notesFile ? await readFileAsync(notesFile) : await getStdin();
    const timeEntryData = await parseNotes(notes.toString());
    const results = await sendToToggl(timeEntryData);
    logSuccess(results);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
main();
