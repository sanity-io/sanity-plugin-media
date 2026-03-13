import {Box, Button, Card, Inline, Text, TextInput} from '@sanity/ui'
import {type ChangeEvent, useMemo} from 'react'
import {type Control, type UseFormSetValue, useWatch} from 'react-hook-form'
import useTypedSelector from '../../hooks/useTypedSelector'
import type {AssetFormData} from '../../types'
import normalizeFolderPath from '../../utils/normalizeFolderPath'
import FormFieldInputLabel from '../FormFieldInputLabel'

type Props = {
  control: Control<AssetFormData>
  disabled?: boolean
  error?: string
  name: 'opt.media.folder'
  setValue: UseFormSetValue<AssetFormData>
}

const FormFieldInputFolder = ({control, disabled, error, name, setValue}: Props) => {
  const currentFolderPath = useTypedSelector(state => state.folders.currentFolderPath)
  const rawFolderPath = useWatch({control, name}) || ''
  const normalizedFolderPath = normalizeFolderPath(rawFolderPath)

  const segments = useMemo(() => {
    if (!normalizedFolderPath) {
      return []
    }

    return normalizedFolderPath
      .split('/')
      .reduce((acc: {name: string; path: string}[], segment) => {
        const previousPath = acc[acc.length - 1]?.path
        const path = previousPath ? `${previousPath}/${segment}` : segment
        acc.push({name: segment, path})
        return acc
      }, [])
  }, [normalizedFolderPath])

  const updateFolderPath = (nextFolderPath: string) => {
    setValue(name, nextFolderPath, {shouldDirty: true, shouldValidate: true})
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateFolderPath(event.currentTarget.value)
  }

  return (
    <Box>
      <FormFieldInputLabel
        description="Choose a location from the browser or type a custom path."
        error={error}
        label="Location"
        name={name}
      />

      <Card padding={3} radius={2} style={{border: '1px solid var(--card-border-color)'}}>
        <Inline space={1}>
          <Button
            disabled={disabled}
            fontSize={1}
            mode={!normalizedFolderPath ? 'default' : 'bleed'}
            onClick={() => updateFolderPath('')}
            text="Home"
          />

          {segments.map(segment => (
            <Inline key={segment.path} space={1}>
              <Text muted size={1}>
                /
              </Text>
              <Button
                disabled={disabled}
                fontSize={1}
                mode={normalizedFolderPath === segment.path ? 'default' : 'bleed'}
                onClick={() => updateFolderPath(segment.path)}
                text={segment.name}
              />
            </Inline>
          ))}

          {segments.length === 0 && (
            <Text muted size={1}>
              No folder assigned
            </Text>
          )}
        </Inline>

        <Box marginTop={3}>
          <Inline space={2}>
            {currentFolderPath && currentFolderPath !== normalizedFolderPath && (
              <Button
                disabled={disabled}
                fontSize={1}
                mode="bleed"
                onClick={() => updateFolderPath(currentFolderPath)}
                text="Use open folder"
                tone="primary"
              />
            )}

            {normalizedFolderPath && (
              <Button
                disabled={disabled}
                fontSize={1}
                mode="bleed"
                onClick={() => updateFolderPath('')}
                text="Clear"
              />
            )}
          </Inline>
        </Box>
      </Card>

      <Box marginTop={3}>
        <TextInput
          autoComplete="off"
          disabled={disabled}
          id={name}
          onChange={handleChange}
          placeholder={currentFolderPath || 'Type a folder path'}
          value={rawFolderPath}
        />
      </Box>
    </Box>
  )
}

export default FormFieldInputFolder
