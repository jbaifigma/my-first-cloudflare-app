# Payload Simple Backend Plugin

A Payload CMS plugin that allows you to define collections using a simplified, completely serializable schema format. This is perfect for scenarios where you need to store collection definitions in blob storage, databases, or other external systems.

## Features

- **Simplified Schema Format**: Define collections using a minimal, easy-to-understand schema
- **Full Serialization Support**: Schemas are completely JSON serializable/deserializable
- **Type Safety**: Full TypeScript support with proper type definitions
- **Field Type Support**: Supports common field types (text, textarea, number, checkbox, select, date, email)
- **Access Control**: Simple boolean-based access control configuration
- **Admin Configuration**: Basic admin panel customization options

## Installation

```typescript
import { payloadSimpleBackendPlugin } from './plugins/payload-simple-backend'
```

## Usage

### Basic Example

```typescript
import { payloadSimpleBackendPlugin } from './plugins/payload-simple-backend'

const simpleSchemas = {
  'tasks': {
    slug: 'tasks',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        admin: {
          placeholder: 'Enter task title',
        },
      },
      {
        name: 'description',
        type: 'textarea',
        admin: {
          placeholder: 'Enter task description',
        },
      },
      {
        name: 'priority',
        type: 'select',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
        defaultValue: 'medium',
      },
      {
        name: 'completed',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'dueDate',
        type: 'date',
      },
    ],
    access: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    admin: {
      useAsTitle: 'title',
      description: 'Task management collection',
    },
  },
}

// Add to your Payload config
export default buildConfig({
  // ... other config
  plugins: [
    payloadSimpleBackendPlugin({
      schemas: simpleSchemas,
    }),
  ],
})
```

### Serialization Example

```typescript
import { serializeSchemas, deserializeSchemas } from './plugins/payload-simple-backend'

// Serialize schemas for storage
const serialized = serializeSchemas(simpleSchemas)
console.log(serialized) // JSON string

// Store in blob storage, database, etc.
await storeInBlobStorage('schemas.json', serialized)

// Later, retrieve and deserialize
const retrievedSchemas = await getFromBlobStorage('schemas.json')
const schemas = deserializeSchemas(retrievedSchemas)

// Use in plugin
const plugin = payloadSimpleBackendPlugin({ schemas })
```

## Supported Field Types

### Text Field
```typescript
{
  name: 'title',
  type: 'text',
  required: true,
  maxLength: 100,
  minLength: 3,
  admin: {
    placeholder: 'Enter title',
  },
}
```

### Textarea Field
```typescript
{
  name: 'description',
  type: 'textarea',
  maxLength: 500,
  admin: {
    placeholder: 'Enter description',
  },
}
```

### Number Field
```typescript
{
  name: 'age',
  type: 'number',
  min: 0,
  max: 120,
  required: true,
}
```

### Checkbox Field
```typescript
{
  name: 'isActive',
  type: 'checkbox',
  defaultValue: true,
  admin: {
    description: 'Is this item active?',
  },
}
```

### Select Field
```typescript
{
  name: 'status',
  type: 'select',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ],
  hasMany: false, // or true for multi-select
  defaultValue: 'draft',
}
```

### Date Field
```typescript
{
  name: 'publishedAt',
  type: 'date',
  required: false,
}
```

### Email Field
```typescript
{
  name: 'contactEmail',
  type: 'email',
  required: true,
  admin: {
    placeholder: 'user@example.com',
  },
}
```

## Schema Structure

```typescript
interface SimpleSchema {
  slug: string
  fields: SimpleField[]
  access?: {
    create?: boolean
    read?: boolean
    update?: boolean
    delete?: boolean
  }
  admin?: {
    useAsTitle?: string
    description?: string
  }
}
```

## API Reference

### `payloadSimpleBackendPlugin(options)`

Creates the plugin instance.

**Parameters:**
- `options.schemas`: Record of schema definitions keyed by collection slug

### `serializeSchemas(schemas)`

Converts schema definitions to a JSON string.

**Parameters:**
- `schemas`: Record of SimpleSchema objects

**Returns:** JSON string

### `deserializeSchemas(serializedSchemas)`

Converts a JSON string back to schema definitions.

**Parameters:**
- `serializedSchemas`: JSON string containing serialized schemas

**Returns:** Record of SimpleSchema objects

### `validateSerializedSchemas(serializedSchemas)`

Validates a serialized schema string.

**Parameters:**
- `serializedSchemas`: JSON string to validate

**Returns:** `{ valid: boolean; errors: string[] }`

## Benefits

1. **Blob Storage Compatible**: Store collection definitions in any external system
2. **Version Control**: Track schema changes in version control
3. **Dynamic Collections**: Create collections programmatically at runtime
4. **Configuration Management**: Manage schemas separately from code
5. **Type Safety**: Full TypeScript support with proper validation

## Limitations

- Only supports basic field types (no relationships, arrays, or complex nested fields)
- Access control is simplified (boolean values only)
- No support for hooks or custom validation logic
- Limited admin customization options

## Example: Loading from Blob Storage

```typescript
// Example with AWS S3 or any blob storage
async function loadSchemasFromStorage() {
  const serializedSchemas = await s3.getObject({
    Bucket: 'my-schemas',
    Key: 'collections.json'
  }).promise()
  
  const schemas = deserializeSchemas(serializedSchemas.Body.toString())
  
  return payloadSimpleBackendPlugin({ schemas })
}

// Use in config
export default buildConfig({
  plugins: [
    await loadSchemasFromStorage(),
  ],
})
```