import {Asset, TagSelectOption} from '@types'
import {useCallback, useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetById} from '../../modules/assets'
import {selectTagSelectOptions, selectTags, tagsActions} from '../../modules/tags'
import getTagSelectOptions from '../../utils/getTagSelectOptions'
import FormFieldInputTags from '../FormFieldInputTags'

type Props = {
  control: any
  disabled?: boolean
  assetSnapshot: Asset | undefined
  assetId: string | undefined
  error: string
  label: string
  placeholder: string
  type: string
  name: string
  zIndex?: number
}

const FormFieldTags = (props: Props) => {
  const {control, disabled, error, label, placeholder, name, type, assetSnapshot, assetId, zIndex} =
    props

  const dispatch = useDispatch()
  const assetItem = useTypedSelector(state => selectAssetById(state, String(assetId)))

  const currentAsset = assetItem ? assetItem?.asset : assetSnapshot

  const assetTagOptions = useTypedSelector(
    selectTagSelectOptions(currentAsset, name.split('.').reverse()[0])
  )

  const tags = useTypedSelector(selectTags)

  const [allTagOptions, setAllTagOptions] = useState<TagSelectOption[]>([])

  const handleCreateTag = useCallback(
    (tagName: string) => {
      // Dispatch action to create new tag
      dispatch(
        tagsActions.createRequest({
          assetId: currentAsset?._id,
          name: tagName
        })
      )
    },
    [currentAsset?._id, dispatch]
  )

  useEffect(() => {
    const _tags = tags.filter(tag => tag.tag._type === type)
    const _allTagOptions = getTagSelectOptions(_tags)
    setAllTagOptions(_allTagOptions)
  }, [tags, type])

  return (
    <FormFieldInputTags
      control={control}
      disabled={disabled}
      error={error}
      label={label}
      name={name}
      placeholder={placeholder}
      onCreateTag={handleCreateTag}
      options={allTagOptions}
      value={assetTagOptions}
      zIndex={zIndex}
    />
  )
}

export default FormFieldTags
