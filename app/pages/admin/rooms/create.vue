<script setup>
import adminRoomAPI from '@/composables/api/adminRoomApi'

definePageMeta({ layout: 'admin' })

const isSubmitting = ref(false)
const errorMsg = ref('')

async function handleCreate(payload) {
  isSubmitting.value = true
  errorMsg.value = ''

  const { error } = await adminRoomAPI.createRoom(payload, { key: `create-room-${Date.now()}` })

  if (error.value) {
    errorMsg.value = error.value?.data?.message || '新增失敗，請檢查欄位後重試'
    isSubmitting.value = false
    return
  }

  navigateTo('/admin/rooms')
}
</script>

<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin/rooms" class="text-sm text-amber-700 hover:underline">
        &larr; 返回房型列表
      </NuxtLink>
      <h2 class="mt-2 text-2xl font-bold text-gray-800">新增房型</h2>
    </div>

    <div v-if="errorMsg" class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMsg }}
    </div>

    <AdminRoomForm
      submit-label="新增房型"
      :is-submitting="isSubmitting"
      @submit="handleCreate"
    />
  </div>
</template>
