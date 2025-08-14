import type { Config, Plugin } from 'payload'

import type { SimpleSchema } from './types.js'

import { transformSimpleSchema } from './transform.js'

export interface SimpleBackendSchema {
  collections: Record<string, SimpleSchema>
}

export const payloadSimpleBackendPlugin =
  (options: SimpleBackendSchema): Plugin =>
  (incomingConfig: Config): Config => {
    const transformedCollections = Object.entries(options.collections).map(([slug, schema]) =>
      transformSimpleSchema(slug, schema),
    )

    return {
      ...incomingConfig,
      collections: [...(incomingConfig.collections || []), ...transformedCollections],
    }
  }

export * from './serialize.js'
export * from './transform.js'
export * from './types.js'
