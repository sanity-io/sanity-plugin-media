import React, {ChangeEvent, useEffect, useRef, useState} from 'react'
import {IoIosClose, IoIosSearch} from 'react-icons/io'
import {useDispatch} from 'react-redux'
import {Subject} from 'rxjs'
import {debounceTime, distinctUntilChanged} from 'rxjs/operators'

import {assetsSetSearchQuery} from '../../modules/assets'
import Box from '../../styled/Box'
import Flex from '../../styled/Flex'
import FormInput from '../../styled/FormInput'
import {BoxProps} from '../../types'

type Props = BoxProps & {}

const SearchInput = (props: Props) => {
  const {...boxProps} = props

  // Refs
  const mounted = useRef(false)

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

  // Update search on query (but not on initial mount)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
    } else {
      search$.next(query)
    }
  }, [query])

  // Callbacks
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value)
  }

  return (
    <Flex alignItems="center" position="relative" width="100%" {...boxProps}>
      {/* Search icon */}
      <Box
        left={0}
        mt="3px"
        position="absolute"
        pointerEvents="none"
        px="9px"
        textColor="lighterGray"
      >
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
        <Flex
          alignItems="center"
          cursor="pointer"
          height="100%"
          onClick={() => setQuery('')}
          position="absolute"
          px="5px"
          right={0}
        >
          <IoIosClose size={18} style={{display: 'block'}} />
        </Flex>
      )}
    </Flex>
  )
}

export default SearchInput
