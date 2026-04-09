<script setup>
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'

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

const layoutInfo = reactive(mergeInfo(defaultLayoutInfo, props.initialData?.layoutInfo))
const facilityInfo = reactive(mergeInfo(defaultFacilityInfo, props.initialData?.facilityInfo))
const amenityInfo = reactive(mergeInfo(defaultAmenityInfo, props.initialData?.amenityInfo))

const schema = toTypedSchema(
  yup.object({
    name: yup.string().required('請輸入房型名稱'),
    description: yup.string().required('請輸入房型描述'),
    price: yup.number().required('請輸入價格').min(1, '價格必須大於 0').typeError('請輸入數字'),
    maxPeople: yup.number().required('請輸入人數上限').min(1, '至少 1 人').max(10, '最多 10 人').typeError('請輸入數字'),
    areaInfo: yup.string(),
    bedInfo: yup.string(),
    imageUrl: yup.string().required('請輸入主圖 URL').url('請輸入正確的 URL 格式'),
    imageUrlList: yup.string()
  })
)

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.initialData?.name || '',
    description: props.initialData?.description || '',
    price: props.initialData?.price || 0,
    maxPeople: props.initialData?.maxPeople || 2,
    areaInfo: props.initialData?.areaInfo || '',
    bedInfo: props.initialData?.bedInfo || '',
    imageUrl: props.initialData?.imageUrl || '',
    imageUrlList: props.initialData?.imageUrlList?.join('\n') || ''
  }
})

const { value: name, errorMessage: nameError } = useField('name')
const { value: description, errorMessage: descriptionError } = useField('description')
const { value: price, errorMessage: priceError } = useField('price')
const { value: maxPeople, errorMessage: maxPeopleError } = useField('maxPeople')
const { value: areaInfo } = useField('areaInfo')
const { value: bedInfo } = useField('bedInfo')
const { value: imageUrl, errorMessage: imageUrlError } = useField('imageUrl')
const { value: imageUrlList } = useField('imageUrlList')

const onSubmit = handleSubmit((values) => {
  const payload = {
    ...values,
    imageUrlList: (values.imageUrlList || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean),
    price: Number(values.price),
    maxPeople: Number(values.maxPeople),
    layoutInfo,
    facilityInfo,
    amenityInfo
  }
  emit('submit', payload)
})

const inputClass = 'w-full rounded-lg border border-gray-300 px-4 py-2.5 transition focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500'
const inputErrorClass = 'w-full rounded-lg border border-red-300 px-4 py-2.5 transition focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500'
</script>

<template>
  <form class="space-y-8" @submit="onSubmit">
    <!-- 基本資訊 -->
    <section class="rounded-xl border bg-white p-6 shadow-sm">
      <h3 class="mb-6 text-lg font-bold text-gray-800">基本資訊</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-gray-700">房型名稱 *</label>
          <input
            v-model="name"
            type="text"
            placeholder="例：豪華雙人房"
            :class="nameError ? inputErrorClass : inputClass"
          >
          <p v-if="nameError" class="mt-1 text-xs text-red-500">{{ nameError }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-gray-700">房型描述 *</label>
          <textarea
            v-model="description"
            rows="4"
            placeholder="請輸入房型描述..."
            :class="descriptionError ? inputErrorClass : inputClass"
          />
          <p v-if="descriptionError" class="mt-1 text-xs text-red-500">{{ descriptionError }}</p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">價格 (NT$) *</label>
          <input
            v-model.number="price"
            type="number"
            min="0"
            :class="priceError ? inputErrorClass : inputClass"
          >
          <p v-if="priceError" class="mt-1 text-xs text-red-500">{{ priceError }}</p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">人數上限 *</label>
          <input
            v-model.number="maxPeople"
            type="number"
            min="1"
            max="10"
            :class="maxPeopleError ? inputErrorClass : inputClass"
          >
          <p v-if="maxPeopleError" class="mt-1 text-xs text-red-500">{{ maxPeopleError }}</p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">坪數</label>
          <input
            v-model="areaInfo"
            type="text"
            placeholder="例：12"
            :class="inputClass"
          >
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">床型</label>
          <input
            v-model="bedInfo"
            type="text"
            placeholder="例：一張大床"
            :class="inputClass"
          >
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
            v-model="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            :class="imageUrlError ? inputErrorClass : inputClass"
          >
          <p v-if="imageUrlError" class="mt-1 text-xs text-red-500">{{ imageUrlError }}</p>
          <div v-if="imageUrl && !imageUrlError" class="mt-3 h-40 w-64 overflow-hidden rounded-lg bg-gray-100">
            <img :src="imageUrl" alt="預覽" class="h-full w-full object-cover" >
          </div>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">圖片列表（每行一個 URL）</label>
          <textarea
            v-model="imageUrlList"
            rows="4"
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            :class="`${inputClass} font-mono text-sm`"
          />
        </div>
      </div>
    </section>

    <!-- 格局資訊 -->
    <section class="rounded-xl border bg-white p-6 shadow-sm">
      <h3 class="mb-6 text-lg font-bold text-gray-800">房間格局</h3>
      <div class="flex flex-wrap gap-3">
        <label
          v-for="(item, idx) in layoutInfo"
          :key="idx"
          class="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 transition"
          :class="item.isProvide ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-500'"
        >
          <input v-model="item.isProvide" type="checkbox" class="accent-emerald-600" >
          {{ item.title }}
        </label>
      </div>
    </section>

    <!-- 設施 -->
    <section class="rounded-xl border bg-white p-6 shadow-sm">
      <h3 class="mb-6 text-lg font-bold text-gray-800">房間設施</h3>
      <div class="flex flex-wrap gap-3">
        <label
          v-for="(item, idx) in facilityInfo"
          :key="idx"
          class="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 transition"
          :class="item.isProvide ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-gray-200 bg-white text-gray-500'"
        >
          <input v-model="item.isProvide" type="checkbox" class="accent-amber-600" >
          {{ item.title }}
        </label>
      </div>
    </section>

    <!-- 備品 -->
    <section class="rounded-xl border bg-white p-6 shadow-sm">
      <h3 class="mb-6 text-lg font-bold text-gray-800">備品提供</h3>
      <div class="flex flex-wrap gap-3">
        <label
          v-for="(item, idx) in amenityInfo"
          :key="idx"
          class="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 transition"
          :class="item.isProvide ? 'border-blue-300 bg-blue-50 text-blue-800' : 'border-gray-200 bg-white text-gray-500'"
        >
          <input v-model="item.isProvide" type="checkbox" class="accent-blue-600" >
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
