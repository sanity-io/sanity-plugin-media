import React, {ChangeEvent, useEffect, useState} from 'react'
import {IoIosClose, IoIosSearch} from 'react-icons/io'
import {useDispatch} from 'react-redux'
import {Subject} from 'rxjs'
import {debounceTime, distinctUntilChanged} from 'rxjs/operators'

import {assetsSetSearchQuery} from '../../modules/assets'
import Box from '../../styled/Box'
import FormInput from '../../styled/FormInput'
import {BoxProps} from '../../types'

type Props = BoxProps & {}

const SearchInput = (props: Props) => {
  const {...boxProps} = props

  // State
  const [search$] = useState(() => new Subject())
  const [query, setQuery] = useState('')

  // Redux
  const dispatch = useDispatch()

  // Effects
  // - Debounce search input
  useEffect(() => {
    const subscription = search$
      .pipe(
        debounceTime(400), //
        distinctUntilChanged()
      )
      .subscribe(val => {
        const result = String(val)
        dispatch(assetsSetSearchQuery(result))
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // search$.next(e.currentTarget.value)
    search$.next(query)
  }, [query])

  // Callbacks
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value)
  }

  return (
    <Box alignItems="center" display="flex" position="relative" width="100%" {...boxProps}>
      {/* Search icon */}
      <Box left={0} position="absolute" pointerEvents="none" px="9px" textColor="lighterGray">
        <IoIosSearch size={16} />
      </Box>

      <FormInput
        as="input"
        onChange={handleChange}
        placeholder="Search"
        pl="32px"
        pr="32px"
        type="text"
        width="100%"
        value={query}
      />

      {/* Clear form button */}
      {query.length > 0 && (
        <Box
          alignItems="center"
          cursor="pointer"
          display="flex"
          height="100%"
          onClick={() => setQuery('')}
          position="absolute"
          px="5px"
          right={0}
        >
          <IoIosClose size={18} style={{display: 'block'}} />
        </Box>
      )}
    </Box>
  )
}

export default SearchInput
