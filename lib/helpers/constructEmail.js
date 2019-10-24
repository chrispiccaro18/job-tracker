const NO_UPDATES = {
  subject: 'No Updates',
  body: (company, url) => `
  No updates to ${capitalize(company)} job board.
  URL to view job board:
  ${url}
`
};

const capitalize = string => string[0].toUpperCase() + string.slice(1);

const UPDATES = {
  subject: 'Updates to Job Board',
  body: (company, url, additions, deletions) => {
    const addedJobsFormatted = additions.length > 0 ? additions.map(jobString) : 'None';
    const deletedJobsFormatted = deletions.length > 0 ? deletions.map(jobString) : 'None';
    return `
  Updates to ${capitalize(company)}
  
  The following jobs have been added:
  ${addedJobsFormatted}
  
  The following jobs have been deleted:
  ${deletedJobsFormatted}

  URL to view job board: ${url}
`;
  }
};

const jobString = (company, job) => {
  return formattedByCompany[company](job);
};

const formattedByCompany = {
  apptio: job => {
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
  },

  wallmart: job => {
    const { title, external_apply_url, } = job;
    return `
${title}
Link: ${external_apply_url}
`;
  },
};

const constructEmail = (updates) => {
  const updatesByCompany = updates.map(({ company, url, additions, deletions }) => {
    if(additions.length <= 0 && deletions.length <= 0) {
      return { company, url, message: NO_UPDATES.body(company, url) };
    } else {
      return { company, url, message: UPDATES.body(company, url, additions, deletions) };
    }
  });
  return [NO_UPDATES.subject, NO_UPDATES.body(url)];
  return [UPDATES.subject, UPDATES.body(url, additions, deletions)];
};

module.exports = {
  NO_UPDATES,
  UPDATES,
  constructEmail,
};
