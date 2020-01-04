const NO_UPDATES = {
  subject: 'No Updates',
  body: (company, url) => `
  No updates to ${capitalize(company)} job board.
  URL to view job board:
  ${url}`
};

const capitalize = string => string[0].toUpperCase() + string.slice(1);

const UPDATES = {
  subject: 'Updates to Job Board',
  body: (company, url, additions, deletions) => {
    const addedJobsFormatted = additions.length > 0 ?
      additions.map(job => jobString(company, job, url)) : 'None';

    const deletedJobsFormatted = deletions.length > 0 ?
      deletions.map(job => jobString(company, job, url)) : 'None';

    return `
  Updates to ${capitalize(company)}

  The following jobs have been added:
    ${addedJobsFormatted}

  The following jobs have been deleted:
    ${deletedJobsFormatted}

  URL to view job board: ${url}`;
  }
};

const jobString = (company, job, url) => {
  return formattedByCompany[company](job, url);
};

const formattedByCompany = {
  apptio: job => {
    const {
      metadata,
      absolute_url,
      updated_at,
      title
    } = job;
    return (
    // eslint-disable-next-line indent
`${title}
    ${metadata.find(({ name }) => name === 'ReqLevel').value || 'No level'}
    Updated at: ${new Date(updated_at).toISOString()}
    Link: ${absolute_url}
`);
  },

  walmart: job => {
    const { title, external_apply_url, } = job;
    return (
    // eslint-disable-next-line indent
`${title}
    Link: ${external_apply_url}
`);
  },

  airbnb: (job, url) => {
    const { title, id } = job;
    return (
    // eslint-disable-next-line indent
  `${title}
    Link: ${url}/${id}
`);
  },
  amazon: job => {
    const { title, posted_date, url_next_step } = job;
    return (
    // eslint-disable-next-line indent
  `${title}
    Posted Date: ${posted_date}
    Link: ${url_next_step}
`);
  },
};

const constructEmail = (updates) => {
  let numberOfUpdates = 0;
  const updatesByCompany = updates.map(({ company, url, additions, deletions }) => {
    if(additions.length <= 0 && deletions.length <= 0) {
      return { message: NO_UPDATES.body(company, url) };
    } else {
      numberOfUpdates++;
      return { message: UPDATES.body(company, url, additions, deletions) };
    }
  });

  const subject = numberOfUpdates ? UPDATES.subject : NO_UPDATES.subject;
  const body = updatesByCompany.reduce((acc, { message }) => {
    return `${acc}${message}
`;
  }, '');
  return [subject, body];
};

module.exports = {
  NO_UPDATES,
  UPDATES,
  constructEmail,
};
