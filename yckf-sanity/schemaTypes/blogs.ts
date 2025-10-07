export default {
  name: 'blogs',
  title: 'Blogs',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(50),
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
  ],
};