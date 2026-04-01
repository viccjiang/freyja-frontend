<script setup>
import roomInfoAPI from '@/composables/api/roomInfoApi'

const rooms = ref([])

const { data } = await roomInfoAPI.getRoomsApi()
rooms.value = (data.value?.result || []).slice(0, 3)
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-mocha-800 px-6 py-40 text-center text-white">
      <div
        class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80')] bg-cover bg-center opacity-30"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-mocha-900/40 via-transparent to-mocha-900/60" />
      <div class="relative mx-auto max-w-2xl">
        <p class="font-display text-sm tracking-[0.3em] text-mocha-200">LUXURY &amp; COMFORT</p>
        <h1 class="mt-6 font-display text-5xl font-light leading-relaxed tracking-wider">
          放慢腳步<br />享受每一刻
        </h1>
        <p class="mx-auto mt-8 max-w-md text-base leading-loose tracking-wide text-white/70">
          Luxt 旅館藏身於城市中最靜謐的角落，<br />讓時間慢下來，讓旅行成為一種生活
        </p>
        <NuxtLink
          to="/rooms"
          class="mt-12 inline-block rounded-full border border-white/30 px-10 py-4 text-sm tracking-[0.2em] transition duration-500 hover:border-white/60 hover:bg-white/10"
        >
          探索房型
        </NuxtLink>
      </div>
    </section>

    <!-- Features -->
    <section class="mx-auto max-w-5xl px-8 py-24">
      <div class="grid gap-16 md:grid-cols-3">
        <div class="text-center">
          <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-latte">
            <svg class="h-8 w-8 text-mocha-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 class="mt-6 font-display text-lg font-medium tracking-wider text-mocha-700">
            24 小時管家服務
          </h3>
          <p class="mt-3 text-sm leading-relaxed tracking-wide text-mocha-400">
            專屬管家全天候待命<br />滿足您的一切需求
          </p>
        </div>
        <div class="text-center">
          <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-latte">
            <svg class="h-8 w-8 text-mocha-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 3C8 3 6 7 6 9a6 6 0 0 0 12 0c0-2-2-6-2-6H8Zm4 12v6m-3 0h6" />
            </svg>
          </div>
          <h3 class="mt-6 font-display text-lg font-medium tracking-wider text-mocha-700">
            精緻餐飲體驗
          </h3>
          <p class="mt-3 text-sm leading-relaxed tracking-wide text-mocha-400">
            由米其林主廚掌勺<br />提供在地與國際風味料理
          </p>
        </div>
        <div class="text-center">
          <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-latte">
            <svg class="h-8 w-8 text-mocha-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 13h16v0a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM3 13h1V6a2 2 0 0 1 2-2h1m13 9h1m-3 5-1 2m-10-2 1 2" />
            </svg>
          </div>
          <h3 class="mt-6 font-display text-lg font-medium tracking-wider text-mocha-700">
            頂級 SPA 放鬆
          </h3>
          <p class="mt-3 text-sm leading-relaxed tracking-wide text-mocha-400">
            結合東西方療法的養生 SPA<br />讓身心徹底放鬆
          </p>
        </div>
      </div>
    </section>

    <!-- Featured Rooms -->
    <section v-if="rooms.length" class="bg-latte px-8 py-24">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <p class="font-display text-xs tracking-[0.3em] text-mocha-400">OUR ROOMS</p>
          <h2 class="mt-3 font-display text-3xl font-light tracking-wider text-mocha-800">
            精選房型
          </h2>
          <p class="mt-4 text-sm tracking-wide text-mocha-400">為您推薦最受歡迎的住宿選擇</p>
        </div>

        <div class="grid gap-10 md:grid-cols-3">
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
            </div>
            <div class="p-6">
              <h3 class="font-display text-lg font-medium tracking-wider text-mocha-700">
                {{ room.name }}
              </h3>
              <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-mocha-400">
                {{ room.description }}
              </p>
              <div class="mt-5 flex items-center justify-between border-t border-mocha-100 pt-5">
                <span class="text-xs tracking-wider text-mocha-300">
                  {{ room.areaInfo }} · {{ room.maxPeople }} 人
                </span>
                <span class="font-display text-lg font-medium text-mocha-600">
                  NT$ {{ room.price?.toLocaleString() }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-16 text-center">
          <NuxtLink
            to="/rooms"
            class="inline-block rounded-full border border-mocha-300 px-10 py-3.5 text-sm tracking-[0.15em] text-mocha-500 transition duration-300 hover:bg-mocha-500 hover:text-white"
          >
            查看所有房型
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-mocha-700 px-8 py-24 text-center">
      <p class="font-display text-xs tracking-[0.3em] text-mocha-200">BOOK NOW</p>
      <h2 class="mt-4 font-display text-3xl font-light tracking-wider text-white">
        準備好開始您的旅程了嗎？
      </h2>
      <p class="mx-auto mt-5 max-w-md text-sm leading-loose tracking-wide text-white/60">
        立即預訂，享受早鳥優惠與專屬禮遇
      </p>
      <NuxtLink
        to="/rooms"
        class="mt-10 inline-block rounded-full bg-white/10 px-10 py-4 text-sm tracking-[0.2em] text-white backdrop-blur-sm transition duration-500 hover:bg-white/20"
      >
        立即預訂
      </NuxtLink>
    </section>
  </div>
</template>
