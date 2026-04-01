<script setup>
import roomInfoAPI from '@/composables/api/roomInfoApi'

const rooms = ref([])

const { data } = await roomInfoAPI.getRoomsApi()
rooms.value = data.value?.result || []
</script>

<template>
  <div>
    <!-- Hero Banner -->
    <section class="bg-mocha-700 px-8 py-20 text-center">
      <p class="font-display text-xs tracking-[0.3em] text-mocha-200">OUR ROOMS</p>
      <h1 class="mt-4 font-display text-4xl font-light tracking-wider text-white">
        探索我們的房型
      </h1>
      <p class="mx-auto mt-5 max-w-lg text-sm leading-loose tracking-wide text-white/60">
        每一間房間都經過精心設計，為您打造舒適且難忘的住宿體驗
      </p>
    </section>

    <!-- Room Cards -->
    <section class="mx-auto max-w-6xl px-8 py-16">
      <div v-if="!rooms.length" class="py-24 text-center text-mocha-300">
        <p class="font-display text-lg tracking-wider">目前沒有可用的房型資訊</p>
      </div>

      <div v-else class="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="room in rooms"
          :key="room._id"
          :to="`/room/${room._id}`"
          class="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="aspect-[4/3] overflow-hidden">
            <img
              v-if="room.imageUrl"
              :src="room.imageUrl"
              :alt="room.name"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div v-else class="flex h-full items-center justify-center bg-latte text-mocha-300">
              <span class="text-5xl">🏨</span>
            </div>
          </div>

          <div class="p-6">
            <h2 class="font-display text-xl font-medium tracking-wider text-mocha-700">
              {{ room.name }}
            </h2>
            <p v-if="room.description" class="mt-3 line-clamp-2 text-sm leading-relaxed text-mocha-400">
              {{ room.description }}
            </p>

            <div class="mt-5 flex items-center justify-between border-t border-mocha-100 pt-5">
              <div v-if="room.areaInfo" class="text-xs tracking-wider text-mocha-300">
                {{ room.areaInfo }} 坪
              </div>
              <div v-if="room.price" class="font-display text-lg font-medium text-mocha-600">
                NT$ {{ room.price.toLocaleString() }}
                <span class="text-xs font-normal tracking-wider text-mocha-300"> / 晚</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
