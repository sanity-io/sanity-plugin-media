import {Icon, SearchIcon} from '@sanity/icons'
import {Box, Flex, TextInput} from '@sanity/ui'
import React, {ChangeEvent, useEffect, useRef, useState} from 'react'
import {useDispatch} from 'react-redux'
import {Subject} from 'rxjs'
import {debounceTime, distinctUntilChanged} from 'rxjs/operators'

import {assetsSetSearchQuery} from '../../modules/assets'

const TextInputSearch = () => {
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
    <Box
      style={{
        position: 'relative'
      }}
    >
      <TextInput
        fontSize={1}
        icon={SearchIcon}
        onChange={handleChange}
        placeholder="Search"
        radius={2}
        value={query}
      />

      {/* Clear form button */}
      {query.length > 0 && (
        <Flex
          align="center"
          justify="center"
          onClick={() => setQuery('')}
          style={{
            cursor: 'pointer',
            height: '100%',
            opacity: 0.75,
            position: 'absolute',
            right: 0,
            top: 0,
            width: '2em'
            // zIndex: 1 // TODO: try to avoid manually setting z-indices
          }}
        >
          <Icon symbol="close" />
        </Flex>
      )}
    </Box>
  )
}

export default TextInputSearch
