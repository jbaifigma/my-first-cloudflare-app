import type { SimpleBackendSchema } from 'simple-backend'

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const SCHEMA_FILE_PATH = join(process.cwd(), 'src', 'backend-schema.json')

export const POST = async (request: Request) => {
  try {
    const schema: SimpleBackendSchema = await request.json()

    await writeFile(SCHEMA_FILE_PATH, JSON.stringify(schema, null, 2), 'utf8')

    return Response.json({ message: 'Schema saved successfully', success: true })
  } catch (_error) {
    return Response.json({ error: 'Failed to save schema', success: false }, { status: 500 })
  }
}

export const GET = async (_request: Request) => {
  try {
    const schemaData = await readFile(SCHEMA_FILE_PATH, 'utf8')
    const schema = JSON.parse(schemaData)

    return Response.json(schema)
  } catch (error) {
    console.error('[jbaifigma] Failed to read schema', error)
    return Response.json({ error: 'Failed to read schema', success: false }, { status: 500 })
  }
}
