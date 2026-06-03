import { createCookieSessionStorage } from 'react-router'

// Cookie session used solely to gate Sanity Visual Editing preview mode.
const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: '__preview',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SANITY_SESSION_SECRET ?? 'letece-kele-preview-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
})

export { commitSession, destroySession, getSession }
