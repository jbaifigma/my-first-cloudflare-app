import type { CollectionConfig, Field } from 'payload'

import type { SimpleField, SimpleSchema } from './types.js'

export function transformSimpleField(simpleField: SimpleField): Field {
  const baseField: Partial<Field> = {
    name: simpleField.name,
    admin: simpleField.admin,
    defaultValue: simpleField.defaultValue,
    required: simpleField.required ?? false,
  }

  switch (simpleField.type) {
    case 'checkbox':
      return {
        ...baseField,
        type: 'checkbox',
      } as Field

    case 'date':
      return {
        ...baseField,
        type: 'date',
      } as Field

    case 'email':
      return {
        ...baseField,
        type: 'email',
      } as Field

    case 'number':
      return {
        ...baseField,
        type: 'number',
        max: simpleField.max,
        min: simpleField.min,
      } as Field

    case 'select':
      return {
        ...baseField,
        type: 'select',
        hasMany: simpleField.hasMany,
        options: simpleField.options,
      } as Field

    case 'text':
      return {
        ...baseField,
        type: 'text',
        maxLength: simpleField.maxLength,
        minLength: simpleField.minLength,
      } as Field

    case 'textarea':
      return {
        ...baseField,
        type: 'textarea',
        maxLength: simpleField.maxLength,
        minLength: simpleField.minLength,
      } as Field

    default:
      throw new Error(`Unsupported field type: ${(simpleField as any).type}`)
  }
}

export function transformSimpleSchema(slug: string, schema: SimpleSchema): CollectionConfig {
  const fields = schema.fields.map(transformSimpleField)

  const access = schema.access
    ? {
        create: () => schema.access?.create ?? true,
        delete: () => schema.access?.delete ?? true,
        read: () => schema.access?.read ?? true,
        update: () => schema.access?.update ?? true,
      }
    : {
        create: () => true,
        delete: () => true,
        read: () => true,
        update: () => true,
      }

  return {
    slug,
    access,
    admin: {
      description: schema.admin?.description,
      useAsTitle: schema.admin?.useAsTitle,
    },
    fields,
  }
}
