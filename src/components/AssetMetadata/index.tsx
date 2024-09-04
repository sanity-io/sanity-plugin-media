import {DownloadIcon} from '@sanity/icons'
import {Box, Button, Flex, Inline, Stack, Text} from '@sanity/ui'
import {Asset, AssetItem} from '@types'
import format from 'date-fns/format'
import filesize from 'filesize'
import {ReactNode, useState} from 'react'
import Select from 'react-select'
import {useColorScheme} from 'sanity'
import {reactSelectComponents, reactSelectStyles} from '../../styled/react-select/alt'
import getAssetResolution from '../../utils/getAssetResolution'
import {isImageAsset} from '../../utils/typeGuards'
import ButtonAssetCopy from '../ButtonAssetCopy'

type Props = {
  asset: Asset
  item?: AssetItem
}

const Row = ({label, value}: {label: string; value: ReactNode}) => {
  return (
    <Flex justify="space-between">
      <Text
        size={1}
        style={{
          opacity: 0.8,
          width: '40%'
        }}
        textOverflow="ellipsis"
      >
        {label}
      </Text>
      <Text
        size={1}
        style={{
          opacity: 0.4,
          textAlign: 'right',
          width: '60%'
        }}
        textOverflow="ellipsis"
      >
        {value}
      </Text>
    </Flex>
  )
}

const AssetMetadata = (props: Props) => {
  const {asset, item} = props
  const {scheme} = useColorScheme()

  const exif = asset?.metadata?.exif

  const options = [
    {value: 0, label: 'Original Width'},
    {value: 1920, label: '1920w'},
    {value: 1080, label: '1080w'},
    {value: 720, label: '720w'}
  ]
  const handleSizeSelect = (option: Option[]) => {
    setOption(option)
  }
  const [option, setOption] = useState([options[0]])
  interface Option {
    label: string
    value: number
  }

  // const handleChange = (option: TagSelectOption) => {
  //   dispatch(
  //     searchActions.facetsUpdateById({
  //       id: facet.id,
  //       value: option
  //     })
  //   )
  // }
  // const [option, setOption] = useState<{value: number; label: string}>(options[0])
  // const handleSizeSelect = (selection: ValueType<(typeof options)[0], true>) => {
  //   setOption(selection)
  // }

  // Callbacks
  const handleDownload = () => {
    const [fileName, fileExtension] = (asset.originalFilename ?? '').split('.')

    option.forEach(file => {
      if (file.value == 0) {
        window.open(`${asset.url}?dl=${asset.originalFilename}`)
      } else {
        window.open(`${asset.url}?w=${file.value}&dl=${fileName}-w${file.value}.${fileExtension}`)
      }
    })
  }

  return (
    <Box marginTop={3}>
      {/* Base */}
      <Box>
        <Stack space={3}>
          <Row label="Size" value={filesize(asset?.size, {base: 10, round: 0})} />
          <Row label="MIME type" value={asset?.mimeType} />
          <Row label="Extension" value={(asset?.extension).toUpperCase()} />
          {isImageAsset(asset) && <Row label="Dimensions" value={getAssetResolution(asset)} />}
        </Stack>
      </Box>
      {/* EXIF */}
      {exif &&
        (exif.DateTimeOriginal ||
          exif.FNumber ||
          exif.FocalLength ||
          exif.ExposureTime ||
          exif.ISO) && (
          <>
            {/* Divider */}
            <Box
              marginY={4}
              style={{
                background: 'var(--card-border-color)',
                height: '1px',
                width: '100%'
              }}
            />
            <Box>
              <Stack space={3}>
                {exif.ISO && <Row label="ISO" value={exif.ISO} />}
                {exif.FNumber && <Row label="Aperture" value={`ƒ/${exif.FNumber}`} />}
                {exif.FocalLength && <Row label="Focal length" value={`${exif.FocalLength}mm`} />}
                {exif.ExposureTime && (
                  <Row label="Exposure time" value={`1/${1 / exif.ExposureTime}`} />
                )}
                {exif.DateTimeOriginal && (
                  <Row
                    label="Original date"
                    value={format(new Date(exif.DateTimeOriginal), 'PPp')}
                  />
                )}
              </Stack>
            </Box>
          </>
        )}

      {/* Asset actions */}
      <Box marginTop={5}>
        <Inline space={3}>
          {/* Download */}
          <Flex
            align={'center'}
            style={{
              background: '#f2f3f5',
              padding: 4,
              gap: 6,
              borderRadius: 3
            }}
          >
            <Button
              disabled={!item || item?.updating}
              fontSize={1}
              icon={DownloadIcon}
              mode="ghost"
              onClick={handleDownload}
              text="Download"
            />
            {isImageAsset(asset) && (
              <>
                <span>@</span>
                <Select
                  value={option}
                  components={reactSelectComponents}
                  isSearchable
                  name="downloadSize"
                  options={options}
                  isMulti
                  defaultValue={options[0]}
                  menuPlacement="top"
                  styles={reactSelectStyles(scheme)}
                  onChange={value => handleSizeSelect(value as Option[])}
                />
              </>
            )}
          </Flex>
          {/* Copy to clipboard */}
          <ButtonAssetCopy disabled={!item || item?.updating} url={asset.url} />
        </Inline>
      </Box>
    </Box>
  )
}

export default AssetMetadata
