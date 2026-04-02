<script setup>
const { toasts, remove } = useToast()

const typeStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-mocha-200 bg-latte text-mocha-700'
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed right-6 top-6 z-[100] flex flex-col gap-3">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-8 opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-8 opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex min-w-[280px] max-w-sm cursor-pointer items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-lg backdrop-blur-sm"
          :class="typeStyles[toast.type]"
          @click="remove(toast.id)"
        >
          <span class="text-base">
            {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}
          </span>
          <span class="text-sm tracking-wider">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
