export default {
  name: 'team',
  title: 'Team Members',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'title', title: 'Job Title', type: 'string' },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'image', title: 'Profile Image', type: 'image', options: { hotspot: true } },
  ],
};