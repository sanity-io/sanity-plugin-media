import type {SanityClient} from '@sanity/client'
import sanityClient from 'part:@sanity/base/client'
import {API_VERSION} from './constants'

export const client: SanityClient =
  typeof sanityClient.withConfig === 'function'
    ? sanityClient.withConfig({apiVersion: API_VERSION})
    : sanityClient
