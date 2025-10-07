export default {
  name: 'careers',
  title: 'Job Openings',
  type: 'document',
  fields: [
    { name: 'title', title: 'Job Title', type: 'string' },
    { name: 'description', title: 'Job Description', type: 'text' },
    { name: 'requirements', title: 'Requirements', type: 'array', of: [{ type: 'string' }] },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'type', title: 'Job Type', type: 'string' }, // e.g., "Full-time", "Internship"
    { name: 'salary', title: 'Salary Range', type: 'string' }, // e.g., "$50,000 - $70,000"
    { name: 'applyUrl', title: 'Apply URL', type: 'url' }, // Link to application form
    { name: 'image', title: 'Job Image', type: 'image', options: { hotspot: true } },
  ],
};