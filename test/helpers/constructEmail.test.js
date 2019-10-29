const {
  NO_UPDATES,
  UPDATES,
  constructEmail,
} = require('../../lib/helpers/constructEmail');
const {
  addedJobRaw
} = require('../testJobs');

describe('construct email function', () => {
  it('returns no updates subject and body of email when no updates', () => {
    const updates = [
      {
        additions: [],
        deletions: [],
        company: 'apptio',
        url: 'https://www.apptio.com/company/careers/job-openings',
      },
      {
        additions: [],
        deletions: [],
        company: 'walmart',
        url: 'https://walmart.rolepoint.com/?shorturl=LawD5',
      },
    ];

    const testBody = `
  No updates to Apptio job board.
  URL to view job board:
  https://www.apptio.com/company/careers/job-openings

  No updates to Walmart job board.
  URL to view job board:
  https://walmart.rolepoint.com/?shorturl=LawD5
`;

    const [subject, body] = constructEmail(updates);
    expect(subject).toBe(NO_UPDATES.subject);
    expect(body).toBe(testBody);
  });

  it('returns subject and body of email', () => {
    const updates = [
      {
        additions: [
          addedJobRaw
        ],
        deletions: [],
        company: 'apptio',
        url: 'https://www.apptio.com/company/careers/job-openings',
      },
      {
        additions: [],
        deletions: [
          {
            title: 'Software Dev',
            external_apply_url: 'test.com'
          }
        ],
        company: 'walmart',
        url: 'https://walmart.rolepoint.com/?shorturl=LawD5',
      },
    ];

    const testBody = `
  Updates to Apptio

  The following jobs have been added:
    Frontend Engineer – Apptio Cloudability
    Experienced
    Updated at: 10/9/2019, 2:41:47 PM
    Link: https://www.apptio.com/company/careers/job-openings?gh_jid=1847853

  The following jobs have been deleted:
    None

  URL to view job board: https://www.apptio.com/company/careers/job-openings

  Updates to Walmart

  The following jobs have been added:
    None

  The following jobs have been deleted:
    Software Dev
    Link: test.com

  URL to view job board: https://walmart.rolepoint.com/?shorturl=LawD5
`;
    const [subject, body] = constructEmail(updates);
    expect(subject).toBe(UPDATES.subject);
    expect(body).toBe(testBody);
  });
});
