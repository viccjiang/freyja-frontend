export function useTokenCookie() {
  return useCookie('token', {
    secure: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  })
}
