import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'auditLog',
  title: 'Audit Log',
  type: 'document',
  fields: [
    defineField({
      name: 'action',
      title: 'Action',
      type: 'string',
    }),
    defineField({
      name: 'entityType',
      title: 'Entity Type',
      type: 'string',
    }),
    defineField({
      name: 'entityId',
      title: 'Entity ID',
      type: 'string',
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
    }),
    defineField({
      name: 'userEmail',
      title: 'User Email',
      type: 'string',
    }),
    defineField({
      name: 'userRole',
      title: 'User Role',
      type: 'string',
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
    }),
    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'string',
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'object',
      fields: [
        defineField({
          name: 'before',
          title: 'Before',
          type: 'object',
          fields: [
            defineField({
              name: 'state',
              title: 'State Before',
              type: 'string', // Example field; adjust as needed
              description: 'A brief description of the state before the action',
            }),
          ],
        }),
        defineField({
          name: 'after',
          title: 'After',
          type: 'object',
          fields: [
            defineField({
              name: 'state',
              title: 'State After',
              type: 'string', // Example field; adjust as needed
              description: 'A brief description of the state after the action',
            }),
          ],
        }),
        defineField({
          name: 'metadata',
          title: 'Metadata',
          type: 'object',
          fields: [
            defineField({
              name: 'notes',
              title: 'Additional Notes',
              type: 'text', // Example field; adjust as needed
              description: 'Any additional metadata or notes about the action',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Success', value: 'success' },
          { title: 'Failed', value: 'failed' },
          { title: 'Pending', value: 'pending' },
        ],
      },
    }),
    defineField({
      name: 'errorMessage',
      title: 'Error Message',
      type: 'text',
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
    }),
    defineField({
      name: 'requestId',
      title: 'Request ID',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      action: 'action',
      entityType: 'entityType',
      userEmail: 'userEmail',
      status: 'status',
      timestamp: 'timestamp',
    },
    prepare(selection) {
      const { action, entityType, userEmail, status, timestamp } = selection;
      return {
        title: `${action} ${entityType}`,
        subtitle: `${userEmail} • ${status} • ${new Date(timestamp).toLocaleString()}`,
        media: status === 'success' ? '✅' : status === 'failed' ? '❌' : '⏳',
      };
    },
  },
});
