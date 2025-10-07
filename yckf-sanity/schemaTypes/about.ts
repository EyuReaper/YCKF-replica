export default {
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'whoWeAre', title: 'Who We Are', type: 'text' },
    { name: 'mission', title: 'Mission', type: 'text' }, // Ensure this is present
    { name: 'vision', title: 'Vision', type: 'text' },
    { name: 'story', title: 'Story', type: 'text' },
    {
      name: 'coreValues',
      title: 'Core Values',
      type: 'array',
      of: [{ type: 'string', name: 'value' }],
    },
    { name: 'history', title: 'History', type: 'text' },
    {
      name: 'historyMilestones',
      title: 'History Milestones',
      type: 'array',
      of: [{ type: 'string', name: 'milestone' }],
    },
  ],
};