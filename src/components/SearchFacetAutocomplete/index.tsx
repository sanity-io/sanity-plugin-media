import {CloseIcon, SelectIcon} from '@sanity/icons'
import {Autocomplete, Box, Button, Label, Menu, MenuButton, Stack, Text} from '@sanity/ui'
import {SearchFacetNumberProps} from '@types'
import React, {FC} from 'react'

import SearchFacet from '../SearchFacet'

type Props = {
  facet: SearchFacetNumberProps
}

const SearchFacetAutocomplete: FC<Props> = (props: Props) => {
  const {facet} = props

  return (
    <SearchFacet facet={facet}>
      <Box paddingLeft={1} paddingRight={2}>
        <Label size={0}>Tag</Label>
      </Box>

      <MenuButton
        button={<Button fontSize={1} iconRight={SelectIcon} padding={2} text="includes" />}
        id="operators"
        menu={
          <Menu>
            <Stack space={1}>
              <Button disabled mode="bleed" text="includes" />
              <Button mode="bleed" text="excludes" />
            </Stack>
          </Menu>
        }
      />

      <Box marginX={1}>
        <Autocomplete
          fontSize={1}
          // loading={true}
          padding={2}
          id="autoComplete"
        />
      </Box>

      <Box paddingLeft={3} paddingRight={2} style={{opacity: 0.75}}>
        <Text size={0}>
          <CloseIcon />
        </Text>
      </Box>
    </SearchFacet>
  )
}

export default SearchFacetAutocomplete
