const JOB_BOARD_URL = 'https://www.apptio.com/company/careers/job-openings';

const NO_UPDATES = {
  subject: 'No Updates',
  body: `
  No updates to job board.
  URL to view job board: ${JOB_BOARD_URL}
`
};

const UPDATES = {
  subject: 'Updates to Job Board',
  body: (additions, deletions) => {
    const addedJobsFormatted = additions.length > 0 ? additions.map(jobString) : 'None';
    const deletedJobsFormatted = deletions.length > 0 ? deletions.map(jobString) : 'None';
    return `
  The following jobs have been added:
  ${addedJobsFormatted}
  
  The following jobs have been deleted:
  ${deletedJobsFormatted}

  URL to view job board: ${JOB_BOARD_URL}
`;
  }
};

const jobString = job => {
  const {
    metadata,
    absolute_url,
    updated_at,
    title
  } = job;
  return `
${title}
${metadata.find(({ name }) => name === 'ReqLevel').value}
Updated at: ${new Date(updated_at).toLocaleString()}
Link: ${absolute_url}

`;
};

const constructEmail = (additions, deletions) => {
  if(additions.length <= 0 && deletions.length <= 0) {
    return [NO_UPDATES.subject, NO_UPDATES.body];
  }
  return [UPDATES.subject, UPDATES.body(additions, deletions)];
};

module.exports = {
  NO_UPDATES,
  UPDATES,
  constructEmail,
};
