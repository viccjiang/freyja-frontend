<script setup>
const token = useCookie('token')
const isLoggedIn = computed(() => !!token.value)

function logout() {
  token.value = null
  navigateTo('/')
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-cream">
    <header class="border-b border-mocha-100/60 bg-cream/80 backdrop-blur-sm">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
        <NuxtLink to="/" class="font-display text-2xl font-semibold tracking-widest text-mocha-700">
          Luxt
        </NuxtLink>
        <div class="flex items-center gap-8">
          <NuxtLink
            to="/rooms"
            class="text-sm tracking-wider text-mocha-400 transition duration-300 hover:text-mocha-700"
          >
            房型一覽
          </NuxtLink>
          <template v-if="isLoggedIn">
            <NuxtLink
              to="/orders"
              class="text-sm tracking-wider text-mocha-400 transition duration-300 hover:text-mocha-700"
            >
              我的訂單
            </NuxtLink>
            <button
              class="text-sm tracking-wider text-mocha-300 transition duration-300 hover:text-red-400"
              @click="logout"
            >
              登出
            </button>
          </template>
          <NuxtLink
            v-else
            to="/login"
            class="rounded-2xl border border-mocha-300 px-5 py-2 text-sm tracking-wider text-mocha-500 transition duration-300 hover:bg-mocha-500 hover:text-white"
          >
            登入
          </NuxtLink>
        </div>
      </nav>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-mocha-100 bg-latte py-10 text-center">
      <p class="font-display text-sm tracking-widest text-mocha-300">
        &copy; 2026 Luxt Hotel &mdash; 慢慢來，不急
      </p>
    </footer>
  </div>
</template>
