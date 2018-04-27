const Promise = require('bluebird');
const Project = require('../model/Project');

class TogglService {
  constructor(apiToken, workspaceId) {
    this.apiToken = apiToken;
    this.workspaceId = workspaceId;
  }

  async getProjectsMap() {
    return {
      Project: new Project({ id: 5, billable: true }),
      Activity: new Project({ id: 10, billable: false }),
    };
  }

  async sendTimeEntries() {
    return Promise.resolve();
  }
}

module.exports = TogglService;
