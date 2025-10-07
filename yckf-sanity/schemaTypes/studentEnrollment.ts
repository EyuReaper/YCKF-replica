export default {
  name: 'studentEnrollment',
  title: 'Student Enrollment',
  type: 'document',
  fields: [
    { name: 'studentName', title: 'Student Name', type: 'string' },
    { name: 'studentEmail', title: 'Student Email', type: 'string' },
    { name: 'studentPhone', title: 'Student Phone', type: 'string' },
    { name: 'course', title: 'Course', type: 'reference', to: [{ type: 'premiumTraining' }] },
    { name: 'enrollmentDate', title: 'Enrollment Date', type: 'datetime' },
    { name: 'donationAmount', title: 'Donation Amount', type: 'number' },
    { name: 'donationTier', title: 'Donation Tier', type: 'string' },
    { name: 'paymentStatus', title: 'Payment Status', type: 'string', options: {
      list: [
        { title: 'Pending', value: 'pending' },
        { title: 'Completed', value: 'completed' },
        { title: 'Failed', value: 'failed' },
        { title: 'Refunded', value: 'refunded' }
      ]
    }},
    { name: 'paymentMethod', title: 'Payment Method', type: 'string' },
    { name: 'transactionId', title: 'Transaction ID', type: 'string' },
    { name: 'enrollmentStatus', title: 'Enrollment Status', type: 'string', options: {
      list: [
        { title: 'Active', value: 'active' },
        { title: 'Completed', value: 'completed' },
        { title: 'Dropped', value: 'dropped' },
        { title: 'Suspended', value: 'suspended' }
      ]
    }},
    { name: 'certificateIssued', title: 'Certificate Issued', type: 'boolean', initialValue: false },
    { name: 'certificateUrl', title: 'Certificate URL', type: 'string' },
    { name: 'notes', title: 'Notes', type: 'text' }
  ],
  preview: {
    select: {
      title: 'studentName',
      course: 'course.title',
      status: 'enrollmentStatus',
      date: 'enrollmentDate'
    },
    prepare(selection) {
      const { title, course, status, date } = selection;
      return {
        title: title,
        subtitle: `${course} • ${status} • ${new Date(date).toLocaleDateString()}`
      };
    }
  }
};
