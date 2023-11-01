import {createAction} from '@reduxjs/toolkit'
import {AssetItem, HttpError, Tag} from '../../types'
import {Season} from '../seasons'
import {Collaboration} from '../collaborations'

export const ASSETS_ACTIONS = {
  tagsAddComplete: createAction(
    'actions/tagsAddComplete',
    function prepare({assets, tag}: {assets: AssetItem[]; tag: Tag}) {
      return {payload: {assets, tag}}
    }
  ),
  tagsAddError: createAction(
    'actions/tagsAddError',
    function prepare({assets, error, tag}: {assets: AssetItem[]; error: HttpError; tag: Tag}) {
      return {payload: {assets, error, tag}}
    }
  ),
  tagsAddRequest: createAction(
    'actions/tagsAddRequest',
    function prepare({assets, tag}: {assets: AssetItem[]; tag: Tag}) {
      return {payload: {assets, tag}}
    }
  ),
  tagsRemoveComplete: createAction(
    'actions/tagsRemoveComplete',
    function prepare({assets, tag}: {assets: AssetItem[]; tag: Tag}) {
      return {payload: {assets, tag}}
    }
  ),
  tagsRemoveError: createAction(
    'actions/tagsRemoveError',
    function prepare({assets, error, tag}: {assets: AssetItem[]; error: HttpError; tag: Tag}) {
      return {payload: {assets, error, tag}}
    }
  ),
  tagsRemoveRequest: createAction(
    'actions/tagsRemoveRequest',
    function prepare({assets, tag}: {assets: AssetItem[]; tag: Tag}) {
      return {payload: {assets, tag}}
    }
  ),
  seasonsRemoveRequest: createAction(
    'actions/seasonsRemoveRequest',
    function prepare({assets, season}: {assets: AssetItem[]; season: Season}) {
      return {payload: {assets, season}}
    }
  ),
  seasonsAddRequest: createAction(
    'actions/seasonsAddRequest',
    function prepare({assets, season}: {assets: AssetItem[]; season: Season}) {
      return {payload: {assets, season}}
    }
  ),
  collaborationsRemoveRequest: createAction(
    'actions/collaborationsRemoveRequest',
    function prepare({assets, collaboration}: {assets: AssetItem[]; collaboration: Collaboration}) {
      return {payload: {assets, collaboration}}
    }
  ),
  collaborationsAddRequest: createAction(
    'actions/collaborationsAddRequest',
    function prepare({assets, collaboration}: {assets: AssetItem[]; collaboration: Collaboration}) {
      return {payload: {assets, collaboration}}
    }
  )
}
