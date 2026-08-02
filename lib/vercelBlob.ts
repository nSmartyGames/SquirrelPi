import { put } from '@vercel/blob'

export async function uploadImageToBlob(dataUrl: string): Promise<string> {
  const res = await fetch(dataUrl)
  const blob = await res.blob()

  const { url } = await put(`campaign-cards/${Date.now()}.png`, blob, {
    access: 'public',
    contentType: 'image/png',
  })

  return url
}
