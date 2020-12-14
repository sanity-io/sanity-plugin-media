import {CloseCircleIcon, CloseIcon, PlugIcon, SelectIcon} from '@sanity/icons'
import {
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
  MenuItem,
  Select,
  Stack,
  Text,
  TextInput
} from '@sanity/ui'
import React from 'react'

type Props = {}

const FacetTextInput = (props: Props) => {
  return (
    <Card padding={1} radius={3}>
      <Flex align="center">
        <Box paddingLeft={1} paddingRight={2}>
          <Label size={0}>File size</Label>
        </Box>

        <MenuButton
          button={<Button fontSize={1} iconRight={SelectIcon} padding={2} text="is greater than" />}
          id="test"
          menu={
            <Menu>
              <MenuItem text="is greater than" />
              <MenuItem text="is greater than or equal to" />
              <MenuItem text="is less than" />
              <MenuItem text="is less than or equal to" />
              <MenuDivider />
              <MenuItem text="is equal to" />
            </Menu>
          }
        />

        <Box marginX={1} style={{maxWidth: '50px'}}>
          <TextInput fontSize={1} padding={2} radius={2} width={2} />
        </Box>

        <MenuButton
          button={
            <Button fontSize={1} iconRight={SelectIcon} padding={2} text="KB" tone="primary" />
          }
          id="test"
          menu={
            <Menu>
              <MenuItem text="KB" />
              <MenuItem text="MB" />
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

export default FacetTextInput
