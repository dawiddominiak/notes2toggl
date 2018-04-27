const { expect } = require('chai');
const NotesParser = require('./NotesParser');
const TogglServiceMock = require('./mocks/TogglService');

const MockTogglService = new TogglServiceMock();

const notes1 = `20.04.2018
10:00 - 12:00 First task [Project]`;

describe('NotesParser', () => {
  it('should parse notes for one day', async () => {
    const parser = new NotesParser(MockTogglService);
    const entries = await parser.parse(notes1);
    expect(entries).to.be.an('array').with.length(1);
    expect(entries[0].pid).to.equal(5);
    expect(entries[0].description).to.equal('First task');
    expect(entries[0].duration).to.equal(7200);
    expect(+entries[0].start).to.equal(1524211200000);
    expect(entries[0].billable).to.equal(true);
  });
});
