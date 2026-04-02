const toasts = ref<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>([])
let nextId = 0

export function useToast() {
  function add(message: string, type: 'success' | 'error' | 'info' = 'success', duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  function remove(id: number) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  return {
    toasts: readonly(toasts),
    success: (msg: string) => add(msg, 'success'),
    error: (msg: string) => add(msg, 'error', 4000),
    info: (msg: string) => add(msg, 'info'),
    remove
  }
}
