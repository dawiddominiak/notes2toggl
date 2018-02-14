const TogglClient = require('toggl-api');
const { promisify } = require('util');

class TogglService {
  constructor(apiToken, workspaceId) {
    this.apiToken = apiToken;
    this.workspaceId = workspaceId;
    this.togglClient = new TogglClient({ apiToken });
  }

  async getProjectsMap() {
    const getWorkspaceProjectsAsync = promisify(
      this.togglClient.getWorkspaceProjects.bind(this.togglClient),
    );
    const projects = await getWorkspaceProjectsAsync(this.workspaceId);
    return projects.reduce((map, project) =>
      ({ ...map, [project.name]: parseInt(project.id, 10) }), {});
  }

  async sendTimeEntries(timeEntires = []) {
    const createTimeEntryAsync = promisify(this.togglClient.createTimeEntry.bind(this.togglClient));
    const results = await Promise.all(timeEntires.map(entry => createTimeEntryAsync(entry)));

    return results;
  }
}

module.exports = TogglService;
