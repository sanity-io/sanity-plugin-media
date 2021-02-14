import {CloseIcon, SearchIcon} from '@sanity/icons'
import {Box, Flex, TextInput} from '@sanity/ui'
import React, {ChangeEvent, FC} from 'react'
import {useDispatch} from 'react-redux'

import useTypedSelector from '../../hooks/useTypedSelector'
import {querySet} from '../../modules/search'

const TextInputSearch: FC = () => {
  // Redux
  const searchQuery = useTypedSelector(state => state.search.query)

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(querySet({searchQuery: e.currentTarget.value}))
  }

  const handleClear = () => {
    dispatch(querySet({searchQuery: ''}))
  }

  return (
    <Box style={{position: 'relative'}}>
      <TextInput
        fontSize={1}
        icon={SearchIcon}
        onChange={handleChange}
        placeholder="Search"
        radius={2}
        value={searchQuery}
      />

      {/* Clear form button */}
      {searchQuery.length > 0 && (
        <Flex
          align="center"
          justify="center"
          onClick={handleClear}
          style={{
            cursor: 'pointer',
            height: '100%',
            opacity: 0.75,
            position: 'absolute',
            right: 0,
            top: 0,
            width: '2em',
            zIndex: 1 // force stacking context
          }}
        >
          <CloseIcon />
        </Flex>
      )}
    </Box>
  )
}

export default TextInputSearch
