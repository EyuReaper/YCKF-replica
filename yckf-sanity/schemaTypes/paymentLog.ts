export default {
  name: 'paymentLog',
  title: 'Payment Log',
  type: 'document',
  fields: [
    { name: 'transactionId', title: 'Transaction ID', type: 'string' },
    { name: 'paymentMethod', title: 'Payment Method', type: 'string' },
    { name: 'amount', title: 'Amount', type: 'number' },
    { name: 'currency', title: 'Currency', type: 'string', initialValue: 'USD' },
    { name: 'status', title: 'Status', type: 'string', options: {
      list: [
        { title: 'Pending', value: 'pending' },
        { title: 'Processing', value: 'processing' },
        { title: 'Completed', value: 'completed' },
        { title: 'Failed', value: 'failed' },
        { title: 'Cancelled', value: 'cancelled' },
        { title: 'Refunded', value: 'refunded' }
      ]
    }},
    { name: 'gateway', title: 'Payment Gateway', type: 'string' },
    { name: 'gatewayTransactionId', title: 'Gateway Transaction ID', type: 'string' },
    { name: 'gatewayResponse', title: 'Gateway Response', type: 'object' },
    { name: 'enrollment', title: 'Enrollment', type: 'reference', to: [{ type: 'studentEnrollment' }] },
    { name: 'user', title: 'User', type: 'reference', to: [{ type: 'user' }] },
    { name: 'course', title: 'Course', type: 'reference', to: [{ type: 'premiumTraining' }] },
    { name: 'donationTier', title: 'Donation Tier', type: 'string' },
    { name: 'fees', title: 'Fees', type: 'object', fields: [
      { name: 'processingFee', title: 'Processing Fee', type: 'number' },
      { name: 'platformFee', title: 'Platform Fee', type: 'number' },
      { name: 'totalFees', title: 'Total Fees', type: 'number' }
    ]},
    { name: 'refund', title: 'Refund', type: 'object', fields: [
      { name: 'refundId', title: 'Refund ID', type: 'string' },
      { name: 'refundAmount', title: 'Refund Amount', type: 'number' },
      { name: 'refundReason', title: 'Refund Reason', type: 'string' },
      { name: 'refundDate', title: 'Refund Date', type: 'datetime' },
      { name: 'refundStatus', title: 'Refund Status', type: 'string' }
    ]},
    { name: 'ipAddress', title: 'IP Address', type: 'string' },
    { name: 'userAgent', title: 'User Agent', type: 'string' },
    { name: 'metadata', title: 'Metadata', type: 'object' },
    { name: 'createdAt', title: 'Created At', type: 'datetime', initialValue: () => new Date().toISOString() },
    { name: 'updatedAt', title: 'Updated At', type: 'datetime', initialValue: () => new Date().toISOString() }
  ],
  preview: {
    select: {
      transactionId: 'transactionId',
      amount: 'amount',
      status: 'status',
      userEmail: 'user.email',
      createdAt: 'createdAt'
    },
    prepare(selection) {
      const { transactionId, amount, status, userEmail, createdAt } = selection;
      return {
        title: `$${amount} - ${transactionId}`,
        subtitle: `${userEmail} • ${status} • ${new Date(createdAt).toLocaleDateString()}`,
        media: status === 'completed' ? '✅' : status === 'failed' ? '❌' : '⏳'
      };
    }
  }
};
