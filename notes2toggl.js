const getStdin = require('get-stdin');
const NotesParser = require('./NotesParser');
const TogglService = require('./TogglService');
const { promisify } = require('util');
const fs = require('fs');

const { API_TOKEN, WORKSPACE_ID } = process.env;
const readFileAsync = promisify(fs.readFile);
const notesFile = process.argv.length > 2 && process.argv[2];

function logSuccess(results) {
  console.log('The following entries were successfully added:');
  results.forEach((result, i) => {
    const tagsDescription = typeof result.tags === 'undefined' ? 'no tags' : `the following tags ${result.tags.join(', ')}`;
    console.log(`${i + 1}. ${result.description} with ${tagsDescription}.`);
  });
}

async function main() {
  try {
    const togglService = new TogglService(API_TOKEN, WORKSPACE_ID);
    const notesParser = new NotesParser(togglService);

    const notes = notesFile ? await readFileAsync(notesFile) : await getStdin();
    const timeEntryData = await notesParser.parse(notes.toString());
    const results = await togglService.sendTimeEntries(timeEntryData);

    logSuccess(results);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
main();
