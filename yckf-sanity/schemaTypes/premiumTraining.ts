export default {
  name: 'premiumTraining',
  title: 'Premium Training Courses',
  type: 'document',
  fields: [
    { name: 'title', title: 'Course Title', type: 'string' },
    { name: 'description', title: 'Course Description', type: 'text' },
    { name: 'shortDescription', title: 'Short Description', type: 'string' },
    { name: 'instructor', title: 'Instructor', type: 'string' },
    { name: 'instructorBio', title: 'Instructor Bio', type: 'text' },
    { name: 'duration', title: 'Course Duration', type: 'string' }, // e.g., "4 weeks", "8 hours"
    { name: 'level', title: 'Difficulty Level', type: 'string', options: {
      list: [
        { title: 'Beginner', value: 'beginner' },
        { title: 'Intermediate', value: 'intermediate' },
        { title: 'Advanced', value: 'advanced' }
      ]
    }},
    { name: 'category', title: 'Category', type: 'string', options: {
      list: [
        { title: 'Network Security', value: 'network-security' },
        { title: 'Web Application Security', value: 'web-app-security' },
        { title: 'Ethical Hacking', value: 'ethical-hacking' },
        { title: 'Digital Forensics', value: 'digital-forensics' },
        { title: 'Incident Response', value: 'incident-response' },
        { title: 'Risk Management', value: 'risk-management' },
        { title: 'Compliance', value: 'compliance' }
      ]
    }},
    { name: 'image', title: 'Course Image', type: 'image', options: { hotspot: true } },
    { name: 'bannerImage', title: 'Banner Image', type: 'image', options: { hotspot: true } },
    { 
      name: 'modules', 
      title: 'Course Modules', 
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Module Title', type: 'string' },
          { name: 'description', title: 'Module Description', type: 'text' },
          { name: 'duration', title: 'Module Duration', type: 'string' },
          { name: 'lessons', title: 'Lessons', type: 'array', of: [{ type: 'string' }] },
          { name: 'resources', title: 'Resources', type: 'array', of: [{ type: 'string' }] }
        ]
      }]
    },
    { 
      name: 'donationTiers', 
      title: 'Donation Tiers', 
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', title: 'Tier Name', type: 'string' },
          { name: 'amount', title: 'Minimum Donation Amount', type: 'number' },
          { name: 'description', title: 'Tier Description', type: 'text' },
          { name: 'benefits', title: 'Benefits', type: 'array', of: [{ type: 'string' }] }
        ]
      }]
    },
    { name: 'minDonationAmount', title: 'Minimum Donation Amount', type: 'number' },
    { name: 'maxDonationAmount', title: 'Maximum Donation Amount', type: 'number' },
    { name: 'suggestedDonationAmount', title: 'Suggested Donation Amount', type: 'number' },
    { name: 'isActive', title: 'Is Active', type: 'boolean', initialValue: true },
    { name: 'startDate', title: 'Course Start Date', type: 'datetime' },
    { name: 'endDate', title: 'Course End Date', type: 'datetime' },
    { name: 'enrollmentDeadline', title: 'Enrollment Deadline', type: 'datetime' },
    { name: 'maxStudents', title: 'Maximum Students', type: 'number' },
    { name: 'prerequisites', title: 'Prerequisites', type: 'array', of: [{ type: 'string' }] },
    { name: 'learningObjectives', title: 'Learning Objectives', type: 'array', of: [{ type: 'string' }] },
    { name: 'certificateTemplate', title: 'Certificate Template', type: 'image', options: { hotspot: true } },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'featured', title: 'Featured Course', type: 'boolean', initialValue: false },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }
  ],
  preview: {
    select: {
      title: 'title',
      instructor: 'instructor',
      level: 'level',
      media: 'image'
    },
    prepare(selection) {
      const { title, instructor, level } = selection;
      return {
        title: title,
        subtitle: `${instructor} • ${level}`,
        media: selection.media
      };
    }
  }
};
