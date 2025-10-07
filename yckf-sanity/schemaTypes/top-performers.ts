export default {
  name: 'topPerformers',
  title: 'Top Performers',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'recognition', title: 'Recognition', type: 'text' },
    { name: 'year', title: 'Year', type: 'number' },
    { name: 'category', title: 'Category', type: 'string' }, // e.g., "Volunteer", "Intern"
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
  ],
};