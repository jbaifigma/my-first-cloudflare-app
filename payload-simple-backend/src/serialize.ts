import type { SimpleBackendSchema } from './index.js'
import type { SimpleSchema } from './types.js'

export function serializeSchema(schema: SimpleBackendSchema): string {
  return JSON.stringify(schema, null, 2)
}

export function deserializeSchema(serializedSchema: string): SimpleBackendSchema {
  try {
    const parsed = JSON.parse(serializedSchema)

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Invalid schema format: expected object')
    }

    if (!parsed.collections || typeof parsed.collections !== 'object') {
      throw new Error('Invalid schema format: expected collections property')
    }

    for (const [key, schema] of Object.entries(parsed.collections)) {
      if (!isValidSimpleSchema(schema)) {
        throw new Error(`Invalid schema format for collection "${key}"`)
      }
    }

    return parsed as SimpleBackendSchema
  } catch (error) {
    throw new Error(
      `Failed to deserialize schema: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

function isValidSimpleSchema(schema: any): schema is SimpleSchema {
  if (typeof schema !== 'object' || schema === null) {
    return false
  }

  if (typeof schema.slug !== 'string' || !Array.isArray(schema.fields)) {
    return false
  }

  for (const field of schema.fields) {
    if (!isValidSimpleField(field)) {
      return false
    }
  }

  return true
}

function isValidSimpleField(field: any): boolean {
  if (typeof field !== 'object' || field === null) {
    return false
  }

  if (typeof field.name !== 'string' || typeof field.type !== 'string') {
    return false
  }

  const validTypes = ['text', 'textarea', 'number', 'checkbox', 'select', 'date', 'email']
  if (!validTypes.includes(field.type)) {
    return false
  }

  if (field.type === 'select' && !Array.isArray(field.options)) {
    return false
  }

  return true
}

export function validateSerializedSchema(serializedSchema: string): {
  errors: string[]
  valid: boolean
} {
  const errors: string[] = []

  try {
    deserializeSchema(serializedSchema)
    return { errors: [], valid: true }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown validation error')
    return { errors, valid: false }
  }
}
