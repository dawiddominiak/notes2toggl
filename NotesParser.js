const os = require('os');
const moment = require('moment');
const LineDestructor = require('./LineDestructor');

const EMPTY_LINE_REGEXP = /^\s*$/;
const HOURS_REGEXP = /^\s*([0-9]{1,2}):([0-9]{2})\s*-\s*([0-9]{1,2}):([0-9]{2})[\s-]*/;

class NotesParser {
  constructor(togglService) {
    this.togglService = togglService;
  }

  async parse(notes) {
    const lines = notes.split(os.EOL);
    const projectsMap = await this.togglService.getProjectsMap();
    let lastDate = moment();
    return lines.reduce(async (timeEntriesPromise, line) => {
      const isDate = /^\s*[0-9]{1,2}\.[0-9]{2}\.[0-9]{4}\s*$/.test(line);
      const isEntry = HOURS_REGEXP.test(line);
      const isEmptyLine = EMPTY_LINE_REGEXP.test(line);
      const timeEntries = await timeEntriesPromise;

      if (isDate) {
        lastDate = moment(line.trim(), 'DD.MM.YYYY');
      } else if (isEntry) {
        const lineDestructor = new LineDestructor(line, lastDate, projectsMap);
        const timeEntry = await lineDestructor.toObject({ created_with: 'notes2toggl' });

        timeEntries.push(timeEntry);
      } else if (!isEmptyLine) {
        console.error(`Could not parse line "${line}". Input from ${lastDate.format('DD.MM.YYYY')}.`);
      }

      return timeEntries;
    }, []);
  }
}

module.exports = NotesParser;
