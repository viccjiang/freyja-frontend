export default defineNuxtRouteMiddleware(() => {
  const token = useTokenCookie()
  if (!token.value) {
    return navigateTo('/login')
  }
})
