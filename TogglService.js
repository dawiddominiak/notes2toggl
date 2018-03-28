const TogglClient = require('toggl-api');
const Promise = require('bluebird');

const DELAY_AFTER_SINGLE_ENTRY_IN_MS = 200;

class TogglService {
  constructor(apiToken, workspaceId) {
    this.apiToken = apiToken;
    this.workspaceId = workspaceId;
    this.togglClient = new TogglClient({ apiToken });
  }

  async getProjectsMap() {
    const getWorkspaceProjectsAsync = Promise.promisify(
      this.togglClient.getWorkspaceProjects.bind(this.togglClient),
    );
    const projects = await getWorkspaceProjectsAsync(this.workspaceId);
    return projects.reduce((map, project) =>
      ({ ...map, [project.name]: parseInt(project.id, 10) }), {});
  }

  async sendTimeEntries(timeEntires = []) {
    const createTimeEntryAsync = Promise
      .promisify(
        this.togglClient.createTimeEntry.bind(this.togglClient),
      );

    const results = await Promise.map(
      timeEntires,
      entry => createTimeEntryAsync(entry)
        .delay(DELAY_AFTER_SINGLE_ENTRY_IN_MS),
      {
        concurrency: 1,
      },
    );

    return results;
  }
}

module.exports = TogglService;
