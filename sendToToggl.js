const TogglClient = require('toggl-api');
const { promisify } = require('util');

const { API_TOKEN } = process.env;
const toggl = new TogglClient({ apiToken: API_TOKEN });
const createTimeEntryAsync = promisify(toggl.createTimeEntry);

async function sendToToggl(timeEntires = []) {
  const results = await Promise.all(timeEntires.map(createTimeEntryAsync));
  toggl.destroy();
  return results;
}

module.exports = sendToToggl;
