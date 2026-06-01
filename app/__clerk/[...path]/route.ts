export const runtime = 'edge'

const CLERK_FRONTEND_API = 'https://clerk.allibuild.com'

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const url = new URL(req.url)
  const upstream = `${CLERK_FRONTEND_API}/${path.join('/')}${url.search}`
  return fetch(upstream, { headers: req.headers })
}
