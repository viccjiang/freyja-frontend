<script setup>
import adminRoomAPI from '@/composables/api/adminRoomApi'

definePageMeta({ layout: 'admin' })

const rooms = ref([])
const isLoading = ref(true)
const deleteTarget = ref(null)

async function fetchRooms() {
  isLoading.value = true
  const { data } = await adminRoomAPI.getRooms()
  rooms.value = data.value?.result || []
  isLoading.value = false
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  await adminRoomAPI.deleteRoom(deleteTarget.value._id, { key: `delete-${deleteTarget.value._id}-${Date.now()}` })
  deleteTarget.value = null
  await fetchRooms()
}

await fetchRooms()
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">房型管理</h2>
        <p class="mt-1 text-sm text-gray-500">管理所有房型資訊，共 {{ rooms.length }} 筆資料</p>
      </div>
      <NuxtLink
        to="/admin/rooms/create"
        class="rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-800"
      >
        + 新增房型
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="py-20 text-center text-gray-400">載入中...</div>

    <!-- Empty State -->
    <div v-else-if="!rooms.length" class="rounded-xl border-2 border-dashed border-gray-300 py-20 text-center">
      <p class="text-lg text-gray-400">尚無房型資料</p>
      <NuxtLink
        to="/admin/rooms/create"
        class="mt-4 inline-block text-sm text-amber-700 hover:underline"
      >
        建立第一筆房型
      </NuxtLink>
    </div>

    <!-- Room Table -->
    <div v-else class="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table class="w-full text-left text-sm">
        <thead class="border-b bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th class="px-6 py-4">房型圖片</th>
            <th class="px-6 py-4">名稱</th>
            <th class="px-6 py-4">價格</th>
            <th class="px-6 py-4">坪數</th>
            <th class="px-6 py-4">人數上限</th>
            <th class="px-6 py-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="room in rooms" :key="room._id" class="transition hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="h-16 w-24 overflow-hidden rounded-lg bg-gray-100">
                <img
                  v-if="room.imageUrl"
                  :src="room.imageUrl"
                  :alt="room.name"
                  class="h-full w-full object-cover"
                />
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="font-medium text-gray-800">{{ room.name }}</div>
              <div class="mt-0.5 line-clamp-1 text-xs text-gray-400">{{ room.description }}</div>
            </td>
            <td class="px-6 py-4 font-medium text-amber-700">
              NT$ {{ room.price?.toLocaleString() }}
            </td>
            <td class="px-6 py-4 text-gray-600">{{ room.areaInfo }} 坪</td>
            <td class="px-6 py-4 text-gray-600">{{ room.maxPeople }} 人</td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink
                  :to="`/admin/rooms/${room._id}`"
                  class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-100"
                >
                  編輯
                </NuxtLink>
                <button
                  class="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-50"
                  @click="deleteTarget = room"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="deleteTarget = null"
      >
        <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
          <h3 class="text-lg font-bold text-gray-800">確認刪除</h3>
          <p class="mt-2 text-sm text-gray-500">
            確定要刪除「<span class="font-medium text-gray-700">{{ deleteTarget.name }}</span>」嗎？此操作無法復原。
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
              @click="deleteTarget = null"
            >
              取消
            </button>
            <button
              class="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
              @click="confirmDelete"
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
