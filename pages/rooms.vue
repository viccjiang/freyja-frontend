<script setup>
import roomInfoAPI from '@/composables/api/roomInfoApi'

const roomInfo = ref('')

const { response } = await roomInfoAPI.getRoomsApi()
console.log(response.value) // 取得房間信息

roomInfo.value = response.value.result
</script>

<template>
  <div class="text-5xl font-extrabold text-green-500">所有房型</div>
  <ul>
    <li v-for="room in roomInfo" :key="room._id">
      {{ room.name }}
      <NuxtLink :to="`/room/${room._id}`">查看詳情</NuxtLink>
    </li>
  </ul>
</template>
