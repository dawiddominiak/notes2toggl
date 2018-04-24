const Project = require('./Project');
const {expect} = require('chai');

describe('Project model', () => {
  it('should instantiate proper model', () => {
    const project = new Project({
      id: 50,
      billable: true,
    });
    expect(project.id).to.equal(50);
    expect(project.isBillable).to.equal(true);
  });

  it('should instantiate proper model - id as string', () => {
    const project = new Project({
      id: '30',
      billable: false,
    });
    expect(project.id).to.equal(30);
    expect(project.isBillable).to.equal(false);
  });
});
