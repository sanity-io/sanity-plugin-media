import {Icon, SearchIcon} from '@sanity/icons'
import {Box, Flex, TextInput} from '@sanity/ui'
import React, {ChangeEvent} from 'react'
import {useDispatch} from 'react-redux'
import useTypedSelector from '../../hooks/useTypedSelector'

import {assetsSetSearchQuery} from '../../modules/assets'

const TextInputSearch = () => {
  // Redux
  const searchQuery = useTypedSelector(state => state.assets.searchQuery)

  // Redux
  const dispatch = useDispatch()

  // Callbacks
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(assetsSetSearchQuery(String(e.currentTarget.value)))
  }

  const handleClear = () => {
    dispatch(assetsSetSearchQuery(''))
  }

  return (
    <Box style={{position: 'relative'}}>
      <TextInput
        fontSize={1}
        icon={SearchIcon}
        onChange={handleChange}
        placeholder="Search filename"
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
            zIndex: 1 // TODO: try to avoid manually setting z-indices
          }}
        >
          <Icon symbol="close" />
        </Flex>
      )}
    </Box>
  )
}

export default TextInputSearch
