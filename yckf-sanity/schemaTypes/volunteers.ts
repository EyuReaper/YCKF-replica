export default {
  name: 'volunteers',
  title: 'Volunteers',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'joinedDate', title: 'Joined Date', type: 'datetime' },
    { name: 'image', title: 'Profile Image', type: 'image', options: { hotspot: true } },
  ],
};