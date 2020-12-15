import {CloseCircleIcon, CloseIcon, PlugIcon, SelectIcon} from '@sanity/icons'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Inline,
  Label,
  Menu,
  MenuButton,
  MenuDivider,
  Select,
  Stack,
  Text,
  TextInput
} from '@sanity/ui'
import React, {FC} from 'react'

const FacetAutocomplete: FC = () => {
  return (
    <Card
      padding={1}
      radius={2}
      style={{
        background: 'rgba(255, 255, 255, 0.05)'
      }}
    >
      <Flex align="center">
        <Box paddingLeft={1} paddingRight={2}>
          {/* <Text size={1}>Tag</Text> */}
          <Label size={0}>Tag</Label>
        </Box>

        <MenuButton
          button={<Button fontSize={1} iconRight={SelectIcon} padding={2} text="includes" />}
          id="test"
          menu={
            <Menu>
              <Stack space={1}>
                <Button disabled mode="bleed" text="includes" />
                <Button mode="bleed" text="excludes" />
              </Stack>
            </Menu>
          }
        />

        {/*
        <Box marginX={1} style={{maxWidth: '50px'}}>
          <TextInput fontSize={1} padding={2} radius={2} width={2} />
        </Box>
        */}

        <Box marginX={1}>
          <Autocomplete
            fontSize={1}
            // loading={true}
            padding={2}
            id="test"
          />
        </Box>

        <Box paddingLeft={3} paddingRight={2} style={{opacity: 0.75}}>
          <Text size={0}>
            <CloseIcon />
          </Text>
        </Box>
      </Flex>
    </Card>
  )
}

export default FacetAutocomplete
