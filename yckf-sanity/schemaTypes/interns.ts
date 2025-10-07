export default {
  name: 'interns',
  title: 'Interns',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'department', title: 'Department', type: 'string' },
    { name: 'batch', title: 'Batch', type: 'string' },
    { name: 'year', title: 'Year', type: 'number' },
    { name: 'program', title: 'Program', type: 'string' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
  ],
};