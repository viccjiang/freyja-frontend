<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: null
  }
})

const statusCode = computed(() => props.error?.statusCode || 500)
const message = computed(() => {
  if (statusCode.value === 404) return '找不到這個頁面'
  if (statusCode.value === 403) return '您沒有權限存取此頁面'
  return '發生了一些問題'
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
    <p class="font-display text-8xl font-light tracking-widest text-mocha-200">
      {{ statusCode }}
    </p>
    <h1 class="mt-6 font-display text-2xl font-light tracking-wider text-mocha-700">
      {{ message }}
    </h1>
    <p class="mt-3 text-sm tracking-wide text-mocha-400">
      別擔心，喝杯咖啡再回來吧
    </p>
    <button
      class="mt-10 rounded-full border border-mocha-300 px-10 py-3.5 text-sm tracking-[0.15em] text-mocha-500 transition duration-300 hover:bg-mocha-500 hover:text-white"
      @click="handleError"
    >
      回到首頁
    </button>
  </div>
</template>
