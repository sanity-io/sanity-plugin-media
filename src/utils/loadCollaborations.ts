export const loadCollaborations = async (): Promise<
  Array<{
    id: string
    name: string
  }>
> => {
  const response = await fetch(
    'https://sanity-ct-products-provider.fly.dev/sanity/collaborations'
  ).then(res => res.json())
  return response.data
}

export const loadSeasons = async (): Promise<
  Array<{
    id: string
    name: string
  }>
> => {
  const response = await fetch('https://sanity-ct-products-provider.fly.dev/sanity/seasons').then(
    res => res.json()
  )
  return response.data
}
