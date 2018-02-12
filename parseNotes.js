const moment = require('moment');

const PROJECT_ID_REGEXP = /\[[0-9]+\]/g;
const TAG_REGEXP = /#\w+/g;
const HOURS_REGEXP = /^\s*([0-9]{1,2}):([0-9]{2})\s*-\s*([0-9]{1,2}):([0-9]{2})\s*/g;
const EMPTY_LINE_REGEXP = /^\s*$/g;
function findProjectId(line) {
  const projectId = line
    .match(PROJECT_ID_REGEXP)
    .map(match => match.trim().slice(1, -1));
  const parsedProjectId = parseInt(projectId, 10);

  return Number.isNaN(parsedProjectId) ? undefined : parsedProjectId;
}

function findTags(line) {
  const matches = line.match(TAG_REGEXP);
  return !matches ? [] : matches.map(tag => tag.slice(1));
}

function findDescription(line) {
  return line
    .replace(HOURS_REGEXP, '')
    .replace(PROJECT_ID_REGEXP, '')
    .replace(TAG_REGEXP, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findStartAndDuration(line, lastDate) {
  const [, startHour, startMinute, endHour, endMinute] = HOURS_REGEXP.exec(line);
  const startMoment = moment(lastDate).hour(startHour).minute(startMinute);
  const endMoment = moment(lastDate).hour(endHour).minute(endMinute);
  const duration = endMoment.diff(startMoment, 'seconds');

  return [startMoment.toDate(), duration];
}

function parseNotes(notes) {
  const lines = notes.split('\n');
  let lastDate = null;
  return lines.reduce((timeEntries, line) => {
    if (/^\s*[0-9]{1,2}\.[0-9]{2}\.[0-9]{4}\s*$/g.test(line)) {
      lastDate = moment(line.trim(), 'DD.MM.YYYY');
    } else if (HOURS_REGEXP.test(line)) {
      const pid = findProjectId(line);
      const tags = findTags(line);
      const description = findDescription(line);
      const [start, duration] = findStartAndDuration(line, lastDate);

      timeEntries.push({
        description,
        tags,
        pid,
        start,
        duration,
        billable: true,
        created_with: 'notes2toggl',
      });
    } else if (!EMPTY_LINE_REGEXP.test(line)) {
      console.error(`Could not parse line "${line}". Input from ${lastDate.format('DD.MM.YYYY')}.`);
    }

    return timeEntries;
  }, []);
}

module.exports = parseNotes;
