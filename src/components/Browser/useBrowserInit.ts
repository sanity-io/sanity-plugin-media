import type {MutationEvent, SanityClient} from '@sanity/client'
import groq from 'groq'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import type {AssetSourceComponentProps} from 'sanity'
import type {Dispatch} from 'redux'

import {inputs} from '../../config/searchFacets'
import {TAG_DOCUMENT_NAME} from '../../constants'
import {searchActions} from '../../modules/search'
import {tagsActions} from '../../modules/tags'
import type {RootReducerState} from '../../modules/types'
import type {Asset, Tag} from '../../types'
import {assetsActions} from '../../modules/assets'

function getMediaTagNames(schemaType?: AssetSourceComponentProps['schemaType']): string[] {
  const mediaTags = (schemaType?.options as {mediaTags?: string[]} | undefined)?.mediaTags
  if (!mediaTags?.length) return []
  const unique = new Set(
    mediaTags.map(t => t?.trim()).filter((t): t is string => Boolean(t?.length))
  )
  return Array.from(unique)
}

function createAssetHandler(dispatch: Dispatch) {
  return (update: MutationEvent) => {
    const {documentId, result, transition} = update

    switch (transition) {
      case 'appear':
        dispatch(assetsActions.listenerCreateQueue({asset: result as Asset}))
        break
      case 'disappear':
        dispatch(assetsActions.listenerDeleteQueue({assetId: documentId}))
        break
      case 'update':
        dispatch(assetsActions.listenerUpdateQueue({asset: result as Asset}))
        break
      default:
        break
    }
  }
}

function createTagHandler(dispatch: Dispatch) {
  return (update: MutationEvent) => {
    const {documentId, result, transition} = update

    switch (transition) {
      case 'appear':
        dispatch(tagsActions.listenerCreateQueue({tag: result as Tag}))
        break
      case 'disappear':
        dispatch(tagsActions.listenerDeleteQueue({tagId: documentId}))
        break
      case 'update':
        dispatch(tagsActions.listenerUpdateQueue({tag: result as Tag}))
        break
      default:
        break
    }
  }
}

export function useBrowserInit(
  client: SanityClient,
  schemaType?: AssetSourceComponentProps['schemaType']
): void {
  const dispatch = useDispatch()
  const tagsByIds = useSelector((state: RootReducerState) => state.tags.byIds)
  const tagsFetchCount = useSelector((state: RootReducerState) => state.tags.fetchCount)

  const tagNames = getMediaTagNames(schemaType)
  const hasMediaTags = tagNames.length > 0

  useEffect(() => {
    if (!hasMediaTags) {
      dispatch(searchActions.facetsClear())
    }

    dispatch(tagsActions.fetchRequest())

    const assetSubscription = client
      .listen(
        groq`*[_type in ["sanity.fileAsset", "sanity.imageAsset"] && !(_id in path("drafts.**"))]`
      )
      .subscribe(createAssetHandler(dispatch))

    const tagSubscription = client
      .listen(groq`*[_type == "${TAG_DOCUMENT_NAME}" && !(_id in path("drafts.**"))]`)
      .subscribe(createTagHandler(dispatch))

    return () => {
      assetSubscription.unsubscribe()
      tagSubscription.unsubscribe()
    }
  }, [client, dispatch, hasMediaTags])

  // When mediaTags are configured, wait for the tag fetch to complete then apply facets.
  // Dispatching clear + add synchronously keeps all actions within assetsSearchEpic's
  // 400ms debounce window, so the browser performs exactly one asset fetch on open.
  useEffect(() => {
    if (!hasMediaTags || tagsFetchCount < 0) return

    const tagFacetInput = inputs.tag
    if (tagFacetInput.type !== 'searchable') return

    const resolvedTags = tagNames
      .map(name => Object.values(tagsByIds).find(item => item.tag.name.current === name))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))

    dispatch(searchActions.facetsClear())

    for (const tagItem of resolvedTags) {
      dispatch(
        searchActions.facetsAdd({
          facet: {
            ...tagFacetInput,
            operatorType: 'references',
            value: {label: tagItem.tag.name.current, value: tagItem.tag._id}
          }
        })
      )
    }
  }, [tagsFetchCount, hasMediaTags]) // eslint-disable-line react-hooks/exhaustive-deps
}
