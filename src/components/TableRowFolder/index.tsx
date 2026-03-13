import {Box, Flex, Grid, Text, useMediaIndex} from '@sanity/ui'
import {useDispatch} from 'react-redux'
import {useColorSchemeValue} from 'sanity'
import {styled, css} from 'styled-components'
import {GRID_TEMPLATE_COLUMNS} from '../../constants'
import {foldersActions} from '../../modules/folders'
import {getSchemeColor} from '../../utils/getSchemeColor'

type Props = {
  name: string
  path: string
  totalCount: number
}

const ContainerGrid = styled(Grid)(
  ({theme}) => css`
    align-items: center;
    cursor: pointer;
    height: 100%;
    user-select: none;
    white-space: nowrap;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background: ${theme.sanity.color.card.enabled.bg};
      }
    }
  `
)

const FolderBadge = styled(Box)(
  ({theme}) => css`
    background: ${theme.sanity.color.spot.yellow};
    border-radius: 6px;
    height: 42px;
    position: relative;
    width: 52px;

    &::before {
      background: ${theme.sanity.color.spot.yellow};
      border-radius: 6px 6px 0 0;
      content: '';
      height: 12px;
      left: 0;
      position: absolute;
      top: -6px;
      width: 18px;
    }
  `
)

const TableRowFolder = ({name, path, totalCount}: Props) => {
  const dispatch = useDispatch()
  const mediaIndex = useMediaIndex()
  const scheme = useColorSchemeValue()

  return (
    <ContainerGrid
      onClick={() => dispatch(foldersActions.currentFolderSet({folderPath: path}))}
      style={{
        background: getSchemeColor(scheme, 'bg'),
        gridColumnGap: mediaIndex < 3 ? 0 : '16px',
        gridTemplateColumns:
          mediaIndex < 3 ? GRID_TEMPLATE_COLUMNS.SMALL : GRID_TEMPLATE_COLUMNS.LARGE,
        gridTemplateRows: mediaIndex < 3 ? 'auto' : '1fr'
      }}
    >
      <Box />
      <Flex align="center" justify="center" style={{gridColumn: 2, height: '90px', width: '100px'}}>
        <FolderBadge />
      </Flex>
      <Box
        marginLeft={mediaIndex < 3 ? 3 : 0}
        style={{gridColumn: mediaIndex < 3 ? 3 : 3, gridRow: mediaIndex < 3 ? '2/4' : 'auto'}}
      >
        <Text size={1} textOverflow="ellipsis" weight="semibold">
          {name}
        </Text>
        <Text muted size={1}>
          Folder
        </Text>
      </Box>
      <Box style={{display: mediaIndex < 3 ? 'none' : 'block', gridColumn: 7}}>
        <Text muted size={1}>
          {totalCount} item{totalCount === 1 ? '' : 's'}
        </Text>
      </Box>
      <Box style={{display: mediaIndex < 3 ? 'none' : 'block', gridColumn: 8}}>
        <Text muted size={1}>
          Open folder
        </Text>
      </Box>
      <Box />
    </ContainerGrid>
  )
}

export default TableRowFolder
