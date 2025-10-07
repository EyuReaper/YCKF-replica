export default {
  name: 'freeTraining',
  title: 'Free Training Sessions',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'date', title: 'Date', type: 'datetime' },
    { name: 'duration', title: 'Duration', type: 'string' }, // e.g., "2 hours"
    { name: 'instructor', title: 'Instructor', type: 'string' },
    { name: 'registrationUrl', title: 'Registration URL', type: 'url' },
    { name: 'image', title: 'Training Image', type: 'image', options: { hotspot: true } },
  ],
};