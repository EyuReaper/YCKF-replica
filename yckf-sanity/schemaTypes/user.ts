export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full Name', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Phone Number', type: 'string' },
    { name: 'password', title: 'Password Hash', type: 'string' },
    { name: 'salt', title: 'Password Salt', type: 'string' },
    { 
      name: 'role', 
      title: 'Role', 
      type: 'string',
      options: {
        list: [
          { title: 'Student', value: 'student' },
          { title: 'Secondary Admin', value: 'secondary_admin' },
          { title: 'Master Admin', value: 'master_admin' }
        ]
      },
      initialValue: 'student'
    },
    { name: 'isActive', title: 'Is Active', type: 'boolean', initialValue: true },
    { name: 'emailVerified', title: 'Email Verified', type: 'boolean', initialValue: false },
    { name: 'emailVerificationToken', title: 'Email Verification Token', type: 'string' },
    { name: 'passwordResetToken', title: 'Password Reset Token', type: 'string' },
    { name: 'passwordResetExpires', title: 'Password Reset Expires', type: 'datetime' },
    { name: 'lastLogin', title: 'Last Login', type: 'datetime' },
    { name: 'profileImage', title: 'Profile Image', type: 'image', options: { hotspot: true } },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'preferences', title: 'Preferences', type: 'object', fields: [
      { name: 'theme', title: 'Theme', type: 'string', options: { list: ['light', 'dark', 'system'] } },
      { name: 'notifications', title: 'Notifications', type: 'object', fields: [
        { name: 'email', title: 'Email Notifications', type: 'boolean', initialValue: true },
        { name: 'courseUpdates', title: 'Course Updates', type: 'boolean', initialValue: true },
        { name: 'certificates', title: 'Certificate Notifications', type: 'boolean', initialValue: true }
      ]}
    ]},
    { name: 'enrollments', title: 'Enrollments', type: 'array', of: [{ type: 'reference', to: [{ type: 'studentEnrollment' }] }] },
    { name: 'createdAt', title: 'Created At', type: 'datetime', initialValue: () => new Date().toISOString() },
    { name: 'updatedAt', title: 'Updated At', type: 'datetime', initialValue: () => new Date().toISOString() }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      role: 'role',
      media: 'profileImage'
    },
    prepare(selection) {
      const { title, subtitle, role } = selection;
      return {
        title: title,
        subtitle: `${subtitle} • ${role}`,
        media: selection.media
      };
    }
  }
};
