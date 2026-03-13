import {Box, Card, Flex, Text} from '@sanity/ui'
import {useDispatch} from 'react-redux'
import {useColorSchemeValue} from 'sanity'
import {styled, css} from 'styled-components'
import {foldersActions} from '../../modules/folders'
import {getSchemeColor} from '../../utils/getSchemeColor'

type Props = {
  name: string
  path: string
  totalCount: number
}

const CardWrapper = styled(Flex)`
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
`

const FolderCard = styled(Card)`
  cursor: pointer;
  height: 100%;
  transition: border-color 200ms ease;
  width: 100%;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--card-border-color);
    }
  }
`

const FolderGlyph = styled(Box)(
  ({theme}) => css`
    align-items: flex-end;
    background: linear-gradient(
      180deg,
      ${theme.sanity.color.spot.yellow} 0%,
      ${theme.sanity.color.spot.yellow} 100%
    );
    border-radius: 8px;
    display: flex;
    height: 72px;
    position: relative;
    width: 96px;

    &::before {
      background: ${theme.sanity.color.spot.yellow};
      border-radius: 8px 8px 0 0;
      content: '';
      height: 18px;
      left: 0;
      position: absolute;
      top: -8px;
      width: 38px;
    }
  `
)

const CardFolder = ({name, path, totalCount}: Props) => {
  const dispatch = useDispatch()
  const scheme = useColorSchemeValue()

  return (
    <CardWrapper padding={1}>
      <FolderCard
        onClick={() => dispatch(foldersActions.currentFolderSet({folderPath: path}))}
        padding={3}
        radius={2}
        style={{
          background: getSchemeColor(scheme, 'bg'),
          border: '1px solid transparent'
        }}
      >
        <Flex direction="column" height="fill" justify="space-between">
          <Flex align="center" flex={1} justify="center">
            <FolderGlyph />
          </Flex>

          <Box marginTop={3}>
            <Text size={1} textOverflow="ellipsis" weight="semibold">
              {name}
            </Text>
            <Text muted size={0}>
              {totalCount} item{totalCount === 1 ? '' : 's'}
            </Text>
          </Box>
        </Flex>
      </FolderCard>
    </CardWrapper>
  )
}

export default CardFolder
