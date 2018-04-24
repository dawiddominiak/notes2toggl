const LineDestructor = require('./LineDestructor');
const MockTogglService = new (require('./mocks/TogglService'));
const {expect} = require('chai');
const moment = require('moment');

const date = moment('2018-05-04');

describe('LineDestructor', () => {
  it('should test basic functionality', async () => {
    const testLine = '10:00 - 12:00 Working [Project]';
    const projectsMap = await MockTogglService.getProjectsMap();
    const destructor = new LineDestructor(testLine, date, projectsMap);
    const object = await destructor.toObject();
    expect(object.pid).to.equal(5);
    expect(object.billable).to.equal(true);
    expect(+object.start).to.equal(1525420800000); // Date -> int
    expect(object.duration).to.equal(7200);
    expect(object.tags).to.be.an('array').and.eql([]);
  });

  it('should test record with tags', async () => {
    const testLine = '10:00 - 12:00 Working [Activity] #wip #willfinishoneday';
    const projectsMap = await MockTogglService.getProjectsMap();
    const destructor = new LineDestructor(testLine, date, projectsMap);
    const object = await destructor.toObject();

    expect(object.pid).to.equal(10);
    expect(object.billable).to.equal(false);
    expect(object.tags).to.be.an('array').and.eql(['wip', 'willfinishoneday']);
  });
});
