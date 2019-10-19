const {
  NO_UPDATES,
  UPDATES,
  constructEmail,
} = require('../../lib/helpers/constructEmail');
const discernChanges = require('../../lib/helpers/discern-changes');
const {
  databaseTestJobs,
  newTestJobs,
} = require('./testJobs');

describe('construct email function', () => {
  it('returns no updates subject and body of email when no updates', () => {
    const additions = [];
    const deletions = [];
    const [subject, body] = constructEmail(additions, deletions);
    expect(subject).toBe(NO_UPDATES.subject);
    expect(body).toBe(NO_UPDATES.body);
  });

  it('returns subject and body of email', () => {
    const [additions, deletions] = discernChanges(databaseTestJobs, newTestJobs);
    const [subject, body] = constructEmail(additions, deletions);
    expect(subject).toBe(UPDATES.subject);
    expect(body).toBe(UPDATES.body(additions, deletions));
  });
  
  it('returns subject and body of email when one is empty', () => {
    const [additions] = discernChanges(databaseTestJobs, newTestJobs);
    const deletions = [];
    const [subject, body] = constructEmail(additions, deletions);
    expect(subject).toBe(UPDATES.subject);
    expect(body).toBe(UPDATES.body(additions, deletions));
  });
});