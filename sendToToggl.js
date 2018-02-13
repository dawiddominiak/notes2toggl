const TogglClient = require('toggl-api');
const { promisify } = require('util');

const { API_TOKEN } = process.env;

async function sendToToggl(timeEntires = []) {
  const toggl = new TogglClient({ apiToken: API_TOKEN });
  const createTimeEntryAsync = promisify(toggl.createTimeEntry.bind(toggl));
  const results = await Promise.all(timeEntires.map(entry => createTimeEntryAsync(entry)));
  toggl.destroy();
  return results;
}

module.exports = sendToToggl;
