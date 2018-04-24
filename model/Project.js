class Project {
  constructor(config) {
    this.id = parseInt(config.id, 10);
    this.isBillable = config.billable;
  }

  static fromTogglEntry(togglEntry) {
    return new Project(togglEntry);
  }

  [Symbol.toPrimitive]() {
    return this.id;
  }
}

module.exports = Project;
