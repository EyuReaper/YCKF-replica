import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'paymentLog',
  title: 'Payment Log',
  type: 'document',
  fields: [
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'courseId',
      title: 'Course ID',
      type: 'string',
    }),
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          {title: 'GHS', value: 'ghs'},
          {title: 'USD', value: 'usd'},
        ],
      },
      initialValue: 'ghs',
      validation: (Rule) => Rule.required(), // Updated: Make required and GHS/USD focused
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Success', value: 'success'},
          {title: 'Failed', value: 'failed'},
          {title: 'Refunded', value: 'refunded'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          {title: 'Card', value: 'card'},
          {title: 'PayPal', value: 'paypal'},
          // Add more as needed
        ],
      },
    }),
    defineField({
      name: 'gatewayResponse',
      title: 'Gateway Response',
      type: 'object',
      fields: [
        defineField({
          name: 'transactionId',
          title: 'Transaction ID',
          type: 'string',
          description: 'Unique ID from payment gateway',
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
          title: 'Notes',
          type: 'text',
          description: 'Additional notes or custom data',
        }),
        defineField({ // New: For conversions
          name: 'exchangeRate',
          title: 'Exchange Rate',
          type: 'number',
          description: 'USD to GHS rate at transaction time',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      timestamp: 'timestamp',
      status: 'status',
      amount: 'amount',
      currency: 'currency',
    },
    prepare(selection) {
      const {timestamp, status, amount, currency} = selection
      return {
        title: `${status} - ${amount} ${currency?.toUpperCase() || ''}`,
        subtitle: timestamp ? new Date(timestamp).toLocaleString() : '',
      }
    },
  },
})