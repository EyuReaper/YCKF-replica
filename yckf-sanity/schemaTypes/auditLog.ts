export default {
  name: 'auditLog',
  title: 'Audit Log',
  type: 'document',
  fields: [
    { name: 'action', title: 'Action', type: 'string' },
    { name: 'entityType', title: 'Entity Type', type: 'string' },
    { name: 'entityId', title: 'Entity ID', type: 'string' },
    { name: 'userId', title: 'User ID', type: 'string' },
    { name: 'userEmail', title: 'User Email', type: 'string' },
    { name: 'userRole', title: 'User Role', type: 'string' },
    { name: 'ipAddress', title: 'IP Address', type: 'string' },
    { name: 'userAgent', title: 'User Agent', type: 'string' },
    { name: 'details', title: 'Details', type: 'object', fields: [
      { name: 'before', title: 'Before', type: 'object' },
      { name: 'after', title: 'After', type: 'object' },
      { name: 'metadata', title: 'Metadata', type: 'object' }
    ]},
    { name: 'status', title: 'Status', type: 'string', options: {
      list: [
        { title: 'Success', value: 'success' },
        { title: 'Failed', value: 'failed' },
        { title: 'Pending', value: 'pending' }
      ]
    }},
    { name: 'errorMessage', title: 'Error Message', type: 'text' },
    { name: 'timestamp', title: 'Timestamp', type: 'datetime', initialValue: () => new Date().toISOString() },
    { name: 'sessionId', title: 'Session ID', type: 'string' },
    { name: 'requestId', title: 'Request ID', type: 'string' }
  ],
  preview: {
    select: {
      action: 'action',
      entityType: 'entityType',
      userEmail: 'userEmail',
      status: 'status',
      timestamp: 'timestamp'
    },
    prepare(selection) {
      const { action, entityType, userEmail, status, timestamp } = selection;
      return {
        title: `${action} ${entityType}`,
        subtitle: `${userEmail} • ${status} • ${new Date(timestamp).toLocaleString()}`,
        media: status === 'success' ? '✅' : status === 'failed' ? '❌' : '⏳'
      };
    }
  }
};
