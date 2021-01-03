import {Box} from '@sanity/ui'
import groq from 'groq'
import client from 'part:@sanity/base/client'
import React, {forwardRef, useState} from 'react'
import {Controller, FieldError} from 'react-hook-form'
import AsyncCreatableSelect from 'react-select/async-creatable'

import FormFieldInputLabel from '../FormFieldInputLabel'

type Props = {
  control: any
  description?: string
  disabled?: boolean
  error?: FieldError
  label: string
  name: string
  placeholder?: string
  value?: string
}

type Ref = HTMLInputElement

const FormFieldInputTags = forwardRef<Ref, Props>((props: Props, ref) => {
  const {control, description, disabled, error, label, name, placeholder, value} = props

  // State
  const [isCreating, setIsCreating] = useState(false)

  // Callbacks
  const handleChange = (newValue: any, actionMeta: any) => {
    console.group('Value Changed')
    console.log(newValue)
    console.log(`action: ${actionMeta.action}`)
    console.groupEnd()
  }

  const handleCreate = () => {
    console.log('create....')
    setIsCreating(true)

    // TODO: dispatch action to create new tag

    // TODO: how do we determine if a tag has been successfully created?

    // TODO: do we want to cache tag results?
  }

  const handleLoadOptions = async (inputValue: string) => {
    const query = groq`*[
        _type == "mediaTag"
        && name.current match '*${inputValue}*'
        && !(_id in path("drafts.**"))
      ] {
        "name": name.current
      } | order(name.current asc)`
    const result = await client.fetch(query)

    return new Promise(resolve => {
      console.log('>>> result', result)
      const tags = result.map(v => ({
        label: v.name,
        value: v.name
      }))

      resolve(tags)
    })
  }

  return (
    <Box
      style={{
        background: 'blue'
      }}
    >
      {/* Label */}
      <FormFieldInputLabel description={description} error={error} label={label} name={name} />

      {/* Select */}
      <Controller
        as={AsyncCreatableSelect}
        cacheOptions={false}
        control={control}
        defaultOptions
        instanceId="tags"
        isClearable={false} // TODO: re-enable when we're able to correctly (manually) re-validate on clear
        isDisabled={isCreating || disabled}
        isMulti
        isLoading={isCreating}
        loadOptions={handleLoadOptions}
        menuPortalTarget={document.body}
        name={name}
        onChange={handleChange}
        onCreateOption={handleCreate}
        // options={CATEGORIES}
        placeholder={placeholder}
        styles={{
          control: (
            styles: any,
            {isDisabled, isFocused}: {isDisabled: boolean; isFocused: boolean}
          ) => {
            return {
              ...styles,
              // backgroundColor: isDisabled ? 'none' : 'inherit',
              // borderColor: isFocused
              backgroundColor: 'pink',
              //   ? theme?.colors?.black
              //   : error
              //   ? theme?.colors?.danger
              //   : theme?.colors?.accent,
              boxShadow: 'none',
              opacity: isDisabled ? 0.5 : 'inherit',
              outline: 'none'
            }
          },
          menu: (styles: any) => {
            return {
              ...styles,
              background: 'magenta'
            }
          },
          menuPortal: (styles: any) => {
            return {
              ...styles,
              zIndex: 9000
            }
          },
          /*
          multiValue: (styles: any) => {
            return {
              ...styles,
              backgroundColor: theme?.colors?.black,
              borderRadius: '2px',
              overflow: 'hidden'
            }
          },
          multiValueLabel: (styles: any) => {
            return {
              ...styles,
              borderRadius: '2px',
              color: theme?.colors?.white,
              paddingLeft: '6px',
              paddingRight: '4px'
            }
          },
          multiValueRemove: (styles: any) => {
            return {
              ...styles,
              borderRadius: 0,
              color: theme?.colors?.white,
              '&:hover': {
                backgroundColor: '#444',
                color: theme?.colors?.white
              }
            }
          },
          */
          valueContainer: (styles: any) => {
            return {
              ...styles,
              background: 'red',
              padding: '6px 10px'
            }
          }
        }}
        theme={(defaultTheme: any) => ({
          ...defaultTheme,
          borderRadius: '3px',
          /*
          colors: {
            ...defaultTheme.colors,
            neutral30: theme?.colors?.black, // outline (rollover)
            primary: theme?.colors?.black,
            primary25: theme?.colors?.inputFocus, // selection
            primary50: theme?.colors?.muted // option pointer down
          },
          */
          padding: 0
        })}
      />
    </Box>
  )
})

export default FormFieldInputTags
