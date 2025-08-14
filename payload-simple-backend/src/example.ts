import type { SimpleSchema } from './types.js'

import { payloadSimpleBackendPlugin } from './index.js'
import { deserializeSchemas, serializeSchemas } from './serialize.js'

const todoSchema: SimpleSchema = {
  slug: 'simple-todos',
  access: {
    create: true,
    delete: true,
    read: true,
    update: true,
  },
  admin: {
    description: 'Simple todo items created via simplified schema',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        placeholder: 'Enter todo title',
      },
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        placeholder: 'Enter todo description',
      },
      required: false,
    },
    {
      name: 'completed',
      type: 'checkbox',
      admin: {
        description: 'Mark this todo as completed',
      },
      defaultValue: false,
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
    {
      name: 'dueDate',
      type: 'date',
      required: false,
    },
  ],
}

const schemas = {
  'simple-todos': todoSchema,
}

const serializedSchemas = serializeSchemas(schemas)
console.log('Serialized schemas:', serializedSchemas)

const deserializedSchemas = deserializeSchemas(serializedSchemas)
console.log('Deserialized schemas:', deserializedSchemas)

export const examplePlugin = payloadSimpleBackendPlugin({
  schemas: deserializedSchemas,
})
