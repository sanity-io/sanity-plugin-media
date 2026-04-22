import type {SanityClient} from '@sanity/client'
import {useClient} from 'sanity'

const useVersionedClient = (): SanityClient => useClient({apiVersion: '2025-10-02'})

export default useVersionedClient
