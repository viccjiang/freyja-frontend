<script setup>
import adminRoomAPI from '@/composables/api/adminRoomApi'
import roomInfoAPI from '@/composables/api/roomInfoApi'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const roomId = computed(() => route.params.id)

const roomData = ref(null)
const isSubmitting = ref(false)
const errorMsg = ref('')

// 使用公開 API 取得房型資料（Admin API 無單筆 GET 路由）
const { data } = await roomInfoAPI.getRoomInfoApi(roomId.value)
roomData.value = data.value?.result || null

async function handleUpdate(payload) {
  isSubmitting.value = true
  errorMsg.value = ''

  const { error } = await adminRoomAPI.updateRoom(roomId.value, payload, {
    key: `update-room-${Date.now()}`
  })

  if (error.value) {
    errorMsg.value = error.value?.data?.message || '更新失敗，請檢查欄位後重試'
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
      <h2 class="mt-2 text-2xl font-bold text-gray-800">
        編輯房型 — {{ roomData?.name }}
      </h2>
    </div>

    <div v-if="!roomData" class="py-20 text-center text-gray-400">載入中...</div>

    <template v-else>
      <div v-if="errorMsg" class="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ errorMsg }}
      </div>

      <AdminRoomForm
        :initial-data="roomData"
        submit-label="更新房型"
        :is-submitting="isSubmitting"
        @submit="handleUpdate"
      />
    </template>
  </div>
</template>
