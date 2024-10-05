<script setup async>
import roomInfoAPI from '@/composables/api/roomInfoApi'

const route = useRoute()
const roomId = computed(() => {
  return route.params.id
})

// 定義一個 ref 來存儲 response 數據
const roomData = ref(null)

const { response } = await roomInfoAPI.getRoomInfoApi(roomId.value)
console.log(response.value) // 取得房間信息;

// 確保 response 有值後，將其賦值給 roomData
roomData.value = response.value
</script>

<template>
  <div v-if="roomData">
    <h1>{{ roomData.result.name }}</h1>
  </div>
</template>
