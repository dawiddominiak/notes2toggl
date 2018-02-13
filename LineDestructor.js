const moment = require('moment');
const TogglClient = require('toggl-api');
const { promisify } = require('util');

const { API_TOKEN, WORKSPACE_ID } = process.env;

/**
 * Inverse of builder pattern. We're destructing builded line.
*/
class LineDestructor {
  constructor(line, date) {
    this.line = line;
    this.date = date;
  }

  async toObject(options = {}) {
    this.modificated = this.line;

    const pid = await this.desctructProjectId();
    const tags = this.desctructTags();
    const [start, duration] = await this.desctructStartAndDuration();
    const description = this.desctructDescription();

    return {
      ...options,
      description,
      tags,
      pid,
      start,
      duration,
      billable: true,
    };
  }

  desctructTags() {
    const tagRegexp = /#\w+/g;
    const matches = this.modificated.match(tagRegexp);
    this.modificated = this.modificated.replace(tagRegexp, '');

    return !matches ? [] : matches.map(tag => tag.slice(1));
  }

  async desctructProjectId() {
    let projectId = this.desctuctProjectIdInLine();

    if (!projectId) {
      projectId = await this.desctructProjectIdByName();
    }

    return projectId;
  }

  desctuctProjectIdInLine() {
    const projectIdRegexp = /\[[0-9]+\]/;
    const matches = this.modificated.match(projectIdRegexp);

    if (!matches) {
      return undefined;
    }

    const projectId = matches.map(match => match.trim().slice(1, -1))[0];
    let parsedProjectId = parseInt(projectId, 10);

    if (Number.isNaN(parsedProjectId)) {
      parsedProjectId = undefined;
    } else {
      this.modificated = this.modificated.replace(projectIdRegexp, '');
    }

    return parsedProjectId;
  }

  async desctructProjectIdByName() {
    // TODO: to other abstraction layer and pass as argument.
    const toggl = new TogglClient({ apiToken: API_TOKEN });
    const getWorkspaceProjectsAsync = promisify(toggl.getWorkspaceProjects.bind(toggl));
    const projects = await getWorkspaceProjectsAsync(WORKSPACE_ID);
    const projectsMap = projects.reduce((map, project) =>
      ({ ...map, [project.name]: parseInt(project.id, 10) }), {});
    const tokens = Object.keys(projectsMap)
      .map(name => `\\[${name}\\]`);

    const regexp = new RegExp(tokens.join('|'));
    const projectName = this.modificated
      .match(regexp)
      .map(match => match.trim().slice(1, -1))[0];
    const projectId = projectsMap[projectName];

    this.modificated = this.modificated.replace(regexp, '');

    return projectId;
  }

  desctructStartAndDuration() {
    const hoursRegexp = /^\s*([0-9]{1,2}):([0-9]{2})\s*-\s*([0-9]{1,2}):([0-9]{2})[\s-]*/;
    const [, startHour, startMinute, endHour, endMinute] = hoursRegexp.exec(this.modificated);
    const startMoment = moment(this.date).hour(startHour).minute(startMinute);
    const endMoment = moment(this.date).hour(endHour).minute(endMinute);
    const duration = endMoment.diff(startMoment, 'seconds');

    this.modificated = this.modificated.replace(hoursRegexp, '');

    return [startMoment.toDate(), duration];
  }

  desctructDescription() {
    return this.modificated
      .replace(/\s+/g, ' ')
      .trim();
  }
}

module.exports = LineDestructor;
