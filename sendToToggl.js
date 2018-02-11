const TogglClient = require('toggl-api');
const { promisify } = require('util');

const { API_TOKEN } = process.env;
const toggl = new TogglClient({ apiToken: API_TOKEN });
const createTimeEntryAsync = promisify(toggl.createTimeEntry.bind(toggl));

async function sendToToggl(timeEntires = []) {
  const results = await Promise.all(timeEntires.map(entry => createTimeEntryAsync(entry)));
  toggl.destroy();
  return results;
}

module.exports = sendToToggl;
