export default {
  name: 'events',
  title: 'Events',
  type: 'document',
  fields: [
    { name: 'title', title: 'Event Title', type: 'string' },
    { name: 'description', title: 'Event Description', type: 'text' },
    { name: 'date', title: 'Event Date', type: 'datetime' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'registrationUrl', title: 'Registration URL', type: 'url' }, // Link to registration form
    { name: 'image', title: 'Event Image', type: 'image', options: { hotspot: true } },
  ],
};