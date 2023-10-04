/* eslint-disable no-process-env */
/* eslint-disable no-undef */

const baseUrl = process?.env?.SANITY_STUDIO_PROVIDER_BASEURL

export const loadCollaborations = async (): Promise<
  Array<{
    id: string
    name: string
  }>
> => {
  const urlToUse = baseUrl
    ? `${baseUrl}/sanity/collaborations`
    : 'https://sanity-ct-products-provider.fly.dev/sanity/collaborations'
  const response = await fetch(urlToUse).then(res => res.json())
  return response.data
}

export const loadSeasons = async (): Promise<
  Array<{
    id: string
    name: string
  }>
> => {
  const urlToUse = baseUrl
    ? `${baseUrl}/sanity/seasons`
    : 'https://sanity-ct-products-provider.fly.dev/sanity/seasons'
  const response = await fetch(urlToUse).then(res => res.json())
  return response.data
}
