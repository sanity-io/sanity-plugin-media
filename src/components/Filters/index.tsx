import {AddIcon, EditIcon} from '@sanity/icons'
import {Box, Button, Inline, Menu, MenuButton, MenuItem} from '@sanity/ui'
import React from 'react'

import FacetAutocomplete from '../FacetAutocomplete'
import FacetSelect from '../FacetSelect'
import FacetTextInput from '../FacetTextInput'

const Filters = () => {
  return (
    <>
      <Box display={['none', 'none', 'none', 'block']}>
        <Inline space={2}>
          <FacetSelect />
          <FacetTextInput />
          <FacetAutocomplete />

          <MenuButton
            button={
              <Button fontSize={1} icon={AddIcon} mode="ghost" text="Add filter" tone="primary" />
            }
            id="test"
            menu={
              <Menu>
                <MenuItem text="Tag" />
                <MenuItem text="File size" />
                <MenuItem text="Orientation" />
                <MenuItem text="Resolution" />
              </Menu>
            }
          />
        </Inline>
      </Box>
      <Box display={['block', 'block', 'block', 'none']}>
        <Button fontSize={1} icon={EditIcon} mode="ghost" text="Filters (2)" tone="primary" />
      </Box>
    </>
  )
}

export default Filters
