const moment = require('moment');

/**
 * Inverse of builder pattern. We're destructing builded line.
*/
class LineDestructor {
  constructor(line, date = moment(), projectsMap = {}) {
    this.line = line;
    this.date = date;
    this.projectsMap = projectsMap;
  }

  async toObject(options = {}) {
    this.modificated = this.line;

    // TODO: handle missing PID
    const pid = await this.desctructProjectId();
    const tags = this.desctructTags();
    const [start, duration] = await this.desctructStartAndDuration();
    const description = this.desctructDescription();
    const billable = this.destructProjectIsBillable(pid);

    return {
      ...options,
      description,
      tags,
      pid,
      start,
      duration,
      billable,
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
    const tokens = Object.keys(this.projectsMap)
      .map(name => `\\[${name}\\]`);

    const regexp = new RegExp(tokens.join('|'));
    const projectName = this.modificated
      .match(regexp)
      .map(match => match.trim().slice(1, -1))[0];

    const projectId = this.projectsMap[projectName].id;
    this.modificated = this.modificated.replace(regexp, '');

    return projectId;
  }

  destructProjectIsBillable(id) {
    const project = Object.values(this.projectsMap).find(p => p.id === id);
    return project.isBillable;
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
