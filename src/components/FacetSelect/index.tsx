import {CloseIcon, SelectIcon} from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Flex,
  Inline,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  Text
} from '@sanity/ui'
import React from 'react'

type Props = {}

const FacetSelect = (props: Props) => {
  return (
    <Card padding={1} radius={3}>
      <Flex align="center">
        <Box paddingLeft={1} paddingRight={2}>
          <Label size={0}>Orientation</Label>
        </Box>

        <MenuButton
          button={<Button fontSize={1} iconRight={SelectIcon} padding={2} text="is" />}
          id="test"
          menu={
            <Menu>
              <MenuItem text="is" tone="positive" />
              <MenuItem text="is not" tone="critical" />
            </Menu>
          }
        />

        {/* HACK */}
        <Box marginX={1} />

        <MenuButton
          button={
            <Button
              fontSize={1}
              iconRight={SelectIcon}
              padding={2}
              text="Portrait"
              tone="primary"
            />
          }
          id="test"
          menu={
            <Menu>
              <MenuItem text="Portrait" />
              <MenuItem text="Landscape" />
              <MenuItem text="Square" />
            </Menu>
          }
        />

        <Box paddingLeft={3} paddingRight={2} style={{opacity: 0.75}}>
          <Text size={0}>
            <CloseIcon />
          </Text>
        </Box>
      </Flex>
    </Card>
  )
}

export default FacetSelect
