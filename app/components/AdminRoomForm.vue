<script setup>
const props = defineProps({
  initialData: { type: Object, default: null },
  submitLabel: { type: String, default: '儲存' },
  isSubmitting: { type: Boolean, default: false }
})

const emit = defineEmits(['submit'])

const defaultLayoutInfo = [
  { title: '市景', isProvide: false },
  { title: '獨立衛浴', isProvide: false },
  { title: '客廳', isProvide: false },
  { title: '書房', isProvide: false },
  { title: '樓中樓', isProvide: false }
]

const defaultFacilityInfo = [
  { title: '平面電視', isProvide: false },
  { title: '吹風機', isProvide: false },
  { title: '冰箱', isProvide: false },
  { title: '熱水壺', isProvide: false },
  { title: '檯燈', isProvide: false },
  { title: '衣櫃', isProvide: false },
  { title: '除濕機', isProvide: false },
  { title: '浴缸', isProvide: false },
  { title: '書桌', isProvide: false },
  { title: '音響', isProvide: false }
]

const defaultAmenityInfo = [
  { title: '衛生紙', isProvide: false },
  { title: '拖鞋', isProvide: false },
  { title: '沐浴乳', isProvide: false },
  { title: '洗髮精', isProvide: false },
  { title: '香皂', isProvide: false },
  { title: '浴帽', isProvide: false },
  { title: '刮鬍刀', isProvide: false },
  { title: '牙刷', isProvide: false },
  { title: '牙膏', isProvide: false },
  { title: '梳子', isProvide: false }
]

function mergeInfo(defaults, existing) {
  if (!existing?.length) return JSON.parse(JSON.stringify(defaults))
  return defaults.map(d => {
    const match = existing.find(e => e.title === d.title)
    return { title: d.title, isProvide: match ? match.isProvide : d.isProvide }
  })
}

const form = reactive({
  name: props.initialData?.name || '',
  description: props.initialData?.description || '',
  imageUrl: props.initialData?.imageUrl || '',
  imageUrlList: props.initialData?.imageUrlList?.join('\n') || '',
  areaInfo: props.initialData?.areaInfo || '',
  bedInfo: props.initialData?.bedInfo || '',
  maxPeople: props.initialData?.maxPeople || 2,
  price: props.initialData?.price || 0,
  layoutInfo: mergeInfo(defaultLayoutInfo, props.initialData?.layoutInfo),
  facilityInfo: mergeInfo(defaultFacilityInfo, props.initialData?.facilityInfo),
  amenityInfo: mergeInfo(defaultAmenityInfo, props.initialData?.amenityInfo)
})

function handleSubmit() {
  const payload = {
    ...form,
    imageUrlList: form.imageUrlList
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean),
    price: Number(form.price),
    maxPeople: Number(form.maxPeople)
  }
  emit('submit', payload)
}
</script>

<template>
  <form class="space-y-8" @submit.prevent="handleSubmit">
    <!-- 基本資訊 -->
    <section class="rounded-xl border bg-white p-6 shadow-sm">
      <h3 class="mb-6 text-lg font-bold text-gray-800">基本資訊</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-gray-700">房型名稱 *</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="例：豪華雙人房"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-gray-700">房型描述 *</label>
          <textarea
            v-model="form.description"
            required
            rows="4"
            placeholder="請輸入房型描述..."
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">價格 (NT$) *</label>
          <input
            v-model.number="form.price"
            type="number"
            required
            min="0"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">人數上限 *</label>
          <input
            v-model.number="form.maxPeople"
            type="number"
            required
            min="1"
            max="10"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">坪數</label>
          <input
            v-model="form.areaInfo"
            type="text"
            placeholder="例：12"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">床型</label>
          <input
            v-model="form.bedInfo"
            type="text"
            placeholder="例：一張大床"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>
    </section>

    <!-- 圖片 -->
    <section class="rounded-xl border bg-white p-6 shadow-sm">
      <h3 class="mb-6 text-lg font-bold text-gray-800">圖片設定</h3>
      <div class="space-y-6">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">主圖 URL *</label>
          <input
            v-model="form.imageUrl"
            type="url"
            required
            placeholder="https://example.com/image.jpg"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <div v-if="form.imageUrl" class="mt-3 h-40 w-64 overflow-hidden rounded-lg bg-gray-100">
            <img :src="form.imageUrl" alt="預覽" class="h-full w-full object-cover" />
          </div>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">圖片列表（每行一個 URL）</label>
          <textarea
            v-model="form.imageUrlList"
            rows="4"
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 font-mono text-sm transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>
    </section>

    <!-- 格局資訊 -->
    <section class="rounded-xl border bg-white p-6 shadow-sm">
      <h3 class="mb-6 text-lg font-bold text-gray-800">房間格局</h3>
      <div class="flex flex-wrap gap-3">
        <label
          v-for="(item, idx) in form.layoutInfo"
          :key="idx"
          class="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 transition"
          :class="item.isProvide ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-500'"
        >
          <input v-model="item.isProvide" type="checkbox" class="accent-emerald-600" />
          {{ item.title }}
        </label>
      </div>
    </section>

    <!-- 設施 -->
    <section class="rounded-xl border bg-white p-6 shadow-sm">
      <h3 class="mb-6 text-lg font-bold text-gray-800">房間設施</h3>
      <div class="flex flex-wrap gap-3">
        <label
          v-for="(item, idx) in form.facilityInfo"
          :key="idx"
          class="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 transition"
          :class="item.isProvide ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-gray-200 bg-white text-gray-500'"
        >
          <input v-model="item.isProvide" type="checkbox" class="accent-amber-600" />
          {{ item.title }}
        </label>
      </div>
    </section>

    <!-- 備品 -->
    <section class="rounded-xl border bg-white p-6 shadow-sm">
      <h3 class="mb-6 text-lg font-bold text-gray-800">備品提供</h3>
      <div class="flex flex-wrap gap-3">
        <label
          v-for="(item, idx) in form.amenityInfo"
          :key="idx"
          class="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 transition"
          :class="item.isProvide ? 'border-blue-300 bg-blue-50 text-blue-800' : 'border-gray-200 bg-white text-gray-500'"
        >
          <input v-model="item.isProvide" type="checkbox" class="accent-blue-600" />
          {{ item.title }}
        </label>
      </div>
    </section>

    <!-- Submit -->
    <div class="flex items-center gap-4">
      <button
        type="submit"
        :disabled="isSubmitting"
        class="rounded-lg bg-amber-700 px-8 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ isSubmitting ? '處理中...' : submitLabel }}
      </button>
      <NuxtLink to="/admin/rooms" class="text-sm text-gray-500 hover:text-gray-700">
        取消返回
      </NuxtLink>
    </div>
  </form>
</template>
