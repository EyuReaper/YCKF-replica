import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'premiumTraining',
  title: 'Premium Training Courses',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Course Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Course Description',
      type: 'text',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
    }),
    defineField({
      name: 'instructor',
      title: 'Instructor',
      type: 'string',
    }),
    defineField({
      name: 'instructorBio',
      title: 'Instructor Bio',
      type: 'text',
    }),
    defineField({
      name: 'duration',
      title: 'Course Duration',
      type: 'string', // e.g., "4 weeks", "8 hours"
    }),
    defineField({
      name: 'level',
      title: 'Difficulty Level',
      type: 'string',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
        ],
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Network Security', value: 'network-security'},
          {title: 'Web Application Security', value: 'web-app-security'},
          {title: 'Ethical Hacking', value: 'ethical-hacking'},
          {title: 'Digital Forensics', value: 'digital-forensics'},
          {title: 'Incident Response', value: 'incident-response'},
          {title: 'Risk Management', value: 'risk-management'},
          {title: 'Compliance', value: 'compliance'},
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Course Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'modules',
      title: 'Course Modules',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Module Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Module Description',
              type: 'text',
            }),
            defineField({
              name: 'duration',
              title: 'Module Duration',
              type: 'string',
            }),
            defineField({
              name: 'lessons',
              title: 'Lessons',
              type: 'array',
              of: [{type: 'string'}],
            }),
            defineField({
              name: 'resources',
              title: 'Resources',
              type: 'array',
              of: [{type: 'string'}],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'donationTiers',
      title: 'Donation Tiers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Tier Name',
              type: 'string',
            }),
            defineField({
              name: 'amount',
              title: 'Minimum Donation Amount',
              type: 'number',
              validation: (Rule) => Rule.min(50).max(100), // New: GHS range validation
            }),
            defineField({
              name: 'currency', // New: Per-tier currency
              title: 'Tier Currency',
              type: 'string',
              options: {
                list: [
                  {title: 'GHS', value: 'ghs'},
                  {title: 'USD', value: 'usd'},
                ],
              },
              initialValue: 'ghs',
            }),
            defineField({
              name: 'description',
              title: 'Tier Description',
              type: 'text',
            }),
            defineField({
              name: 'benefits',
              title: 'Benefits',
              type: 'array',
              of: [{type: 'string'}],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'currency', // New: Default document currency
      title: 'Default Currency',
      type: 'string',
      options: {
        list: [
          {title: 'GHS', value: 'ghs'},
          {title: 'USD', value: 'usd'},
        ],
      },
      initialValue: 'ghs',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'minDonationAmount',
      title: 'Minimum Donation Amount',
      type: 'number',
      validation: (Rule) => Rule.min(50), // Updated: Enforce min
    }),
    defineField({
      name: 'maxDonationAmount',
      title: 'Maximum Donation Amount',
      type: 'number',
      validation: (Rule) => Rule.max(100), // Updated: Enforce max
    }),
    defineField({
      name: 'suggestedDonationAmount',
      title: 'Suggested Donation Amount',
      type: 'number',
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'startDate',
      title: 'Course Start Date',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      title: 'Course End Date',
      type: 'datetime',
    }),
    defineField({
      name: 'enrollmentDeadline',
      title: 'Enrollment Deadline',
      type: 'datetime',
    }),
    defineField({
      name: 'maxStudents',
      title: 'Maximum Students',
      type: 'number',
    }),
    defineField({
      name: 'prerequisites',
      title: 'Prerequisites',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'learningObjectives',
      title: 'Learning Objectives',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'certificateTemplate',
      title: 'Certificate Template',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Course',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
    }),
  ],
  preview: {
    select: {
      title: 'title',
      instructor: 'instructor',
      level: 'level',
      media: 'image',
    },
    prepare(selection) {
      const {title, instructor, level} = selection;
      return {
        title: title,
        subtitle: `${instructor} • ${level}`,
        media: selection.media,
      };
    },
  },
});