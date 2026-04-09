<script setup>
import roomInfoAPI from '@/composables/api/roomInfoApi'
import orderAPI from '@/composables/api/orderApi'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'

const route = useRoute()
const roomId = computed(() => route.params.id)
const token = useTokenCookie()
const toast = useToast()

const room = ref(null)

const { data } = await roomInfoAPI.getRoomInfoApi(roomId.value)
room.value = data.value?.result || null

const today = new Date()
today.setHours(0, 0, 0, 0)

const checkInDate = ref(new Date(Date.now() + 86400000))
const checkOutDate = ref(new Date(Date.now() + 86400000 * 2))
const peopleNum = ref(1)

function toDateString(date) {
  return date.toISOString().split('T')[0]
}

const showBookingModal = ref(false)
const successOrder = ref(null)

const nights = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 0
  const diff = checkOutDate.value.getTime() - checkInDate.value.getTime()
  return Math.max(0, Math.ceil(diff / 86400000))
})

const totalPrice = computed(() => {
  return (room.value?.price || 0) * nights.value
})

function openBooking() {
  if (!token.value) {
    navigateTo('/login')
    return
  }
  successOrder.value = null
  showBookingModal.value = true
}

const bookingSchema = toTypedSchema(
  yup.object({
    name: yup.string().required('請輸入姓名'),
    email: yup.string().required('請輸入電子信箱').email('信箱格式不正確'),
    phone: yup.string().required('請輸入手機號碼').matches(/^09\d{8}$/, '請輸入正確的手機號碼'),
    zipcode: yup.string().required('請輸入郵遞區號').matches(/^\d{3,6}$/, '請輸入正確的郵遞區號'),
    addressDetail: yup.string().required('請輸入地址')
  })
)

const {
  handleSubmit: handleBookingSubmit,
  isSubmitting,
  resetForm
} = useForm({ validationSchema: bookingSchema })

const { value: bName, errorMessage: nameError } = useField('name')
const { value: bEmail, errorMessage: bEmailError } = useField('email')
const { value: bPhone, errorMessage: phoneError } = useField('phone')
const { value: bZipcode, errorMessage: zipcodeError } = useField('zipcode')
const { value: bAddress, errorMessage: addressError } = useField('addressDetail')
const serverError = ref('')

const submitOrder = handleBookingSubmit(async (values) => {
  serverError.value = ''

  const { data, error } = await orderAPI.createOrder(
    {
      roomId: roomId.value,
      checkInDate: toDateString(checkInDate.value),
      checkOutDate: toDateString(checkOutDate.value),
      peopleNum: Number(peopleNum.value),
      userInfo: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: {
          zipcode: Number(values.zipcode),
          detail: values.addressDetail
        }
      }
    },
    { key: `create-order-${Date.now()}` }
  )

  if (error.value) {
    serverError.value = error.value?.data?.message || '預訂失敗，請檢查欄位後重試'
    return
  }

  successOrder.value = data.value?.result
  toast.success('預訂成功，祝您旅途愉快！')
})

watch(showBookingModal, (val) => {
  if (val && !successOrder.value) {
    resetForm()
    serverError.value = ''
  }
})
</script>

<template>
  <div v-if="room">
    <!-- Image Gallery -->
    <section class="bg-mocha-900">
      <div class="mx-auto max-w-6xl">
        <div v-if="room.imageUrlList?.length" class="grid grid-cols-1 gap-1 md:grid-cols-2">
          <div class="aspect-[4/3] overflow-hidden">
            <img
              :src="room.imageUrlList[0]"
              :alt="room.name"
              class="h-full w-full object-cover"
            >
          </div>
          <div v-if="room.imageUrlList.length > 1" class="hidden grid-cols-2 gap-1 md:grid">
            <div
              v-for="(img, idx) in room.imageUrlList.slice(1, 5)"
              :key="idx"
              class="aspect-square overflow-hidden"
            >
              <img
                :src="img"
                :alt="`${room.name} ${idx + 2}`"
                class="h-full w-full object-cover"
              >
            </div>
          </div>
        </div>
        <div v-else-if="room.imageUrl" class="aspect-[21/9] overflow-hidden">
          <img :src="room.imageUrl" :alt="room.name" class="h-full w-full object-cover" >
        </div>
      </div>
    </section>

    <!-- Room Detail -->
    <section class="mx-auto max-w-6xl px-8 py-16">
      <div class="grid gap-16 lg:grid-cols-3">
        <!-- Left: Room Info -->
        <div class="lg:col-span-2">
          <NuxtLink
            to="/rooms"
            class="mb-6 inline-block text-sm tracking-wider text-mocha-400 transition duration-300 hover:text-mocha-600"
          >
            &larr; 返回房型一覽
          </NuxtLink>
          <h1 class="font-display text-3xl font-light tracking-wider text-mocha-800">
            {{ room.name }}
          </h1>
          <p v-if="room.description" class="mt-5 leading-loose tracking-wide text-mocha-500">
            {{ room.description }}
          </p>

          <!-- Room Specs -->
          <div class="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3">
            <div v-if="room.areaInfo" class="rounded-2xl bg-latte p-5 text-center">
              <div class="font-display text-2xl font-medium text-mocha-600">
                {{ room.areaInfo }}
              </div>
              <div class="mt-1 text-xs tracking-wider text-mocha-400">坪數</div>
            </div>
            <div v-if="room.bedInfo" class="rounded-2xl bg-latte p-5 text-center">
              <div class="font-display text-2xl font-medium text-mocha-600">
                {{ room.bedInfo }}
              </div>
              <div class="mt-1 text-xs tracking-wider text-mocha-400">床型</div>
            </div>
            <div v-if="room.maxPeople" class="rounded-2xl bg-latte p-5 text-center">
              <div class="font-display text-2xl font-medium text-mocha-600">
                {{ room.maxPeople }}
              </div>
              <div class="mt-1 text-xs tracking-wider text-mocha-400">人</div>
            </div>
          </div>

          <!-- Layout Info -->
          <div v-if="room.layoutInfo?.length" class="mt-10">
            <h2 class="font-display text-xl font-medium tracking-wider text-mocha-700">
              房間格局
            </h2>
            <div class="mt-5 flex flex-wrap gap-3">
              <span
                v-for="(item, idx) in room.layoutInfo.filter((i) => i.isProvide)"
                :key="idx"
                class="rounded-full border border-mocha-200 bg-latte px-4 py-1.5 text-sm tracking-wider text-mocha-500"
              >
                {{ item.title }}
              </span>
            </div>
          </div>

          <!-- Facility Info -->
          <div v-if="room.facilityInfo?.length" class="mt-10">
            <h2 class="font-display text-xl font-medium tracking-wider text-mocha-700">
              房間設施
            </h2>
            <div class="mt-5 flex flex-wrap gap-3">
              <span
                v-for="(item, idx) in room.facilityInfo.filter((i) => i.isProvide)"
                :key="idx"
                class="rounded-full border border-mocha-200 bg-latte px-4 py-1.5 text-sm tracking-wider text-mocha-500"
              >
                {{ item.title }}
              </span>
            </div>
          </div>

          <!-- Amenity Info -->
          <div v-if="room.amenityInfo?.length" class="mt-10">
            <h2 class="font-display text-xl font-medium tracking-wider text-mocha-700">
              備品提供
            </h2>
            <div class="mt-5 flex flex-wrap gap-3">
              <span
                v-for="(item, idx) in room.amenityInfo.filter((i) => i.isProvide)"
                :key="idx"
                class="rounded-full border border-mocha-100 bg-cream px-4 py-1.5 text-sm tracking-wider text-mocha-400"
              >
                {{ item.title }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Booking Card -->
        <div class="lg:col-span-1">
          <div class="sticky top-8 rounded-3xl border border-mocha-100 bg-white p-7 shadow-sm">
            <div v-if="room.price" class="mb-7">
              <span class="font-display text-3xl font-medium text-mocha-600">
                NT$ {{ room.price.toLocaleString() }}
              </span>
              <span class="text-sm tracking-wider text-mocha-300"> / 晚</span>
            </div>

            <div class="space-y-5">
              <div>
                <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
                  入住日期
                </label>
                <ClientOnly>
                  <VDatePicker
                    v-model="checkInDate"
                    :min-date="today"
                    :popover="{ placement: 'bottom-start' }"
                  >
                    <template #default="{ togglePopover, inputValue }">
                      <button
                        type="button"
                        class="w-full rounded-2xl border border-mocha-100 bg-cream px-4 py-3 text-left text-mocha-700 transition duration-300 focus:border-mocha-300 focus:outline-none focus:ring-1 focus:ring-mocha-300"
                        @click="togglePopover"
                      >
                        {{ inputValue || '選擇日期' }}
                      </button>
                    </template>
                  </VDatePicker>
                </ClientOnly>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
                  退房日期
                </label>
                <ClientOnly>
                  <VDatePicker
                    v-model="checkOutDate"
                    :min-date="checkInDate"
                    :popover="{ placement: 'bottom-start' }"
                  >
                    <template #default="{ togglePopover, inputValue }">
                      <button
                        type="button"
                        class="w-full rounded-2xl border border-mocha-100 bg-cream px-4 py-3 text-left text-mocha-700 transition duration-300 focus:border-mocha-300 focus:outline-none focus:ring-1 focus:ring-mocha-300"
                        @click="togglePopover"
                      >
                        {{ inputValue || '選擇日期' }}
                      </button>
                    </template>
                  </VDatePicker>
                </ClientOnly>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
                  人數
                </label>
                <select
                  v-model="peopleNum"
                  class="w-full rounded-2xl border border-mocha-100 bg-cream px-4 py-3 text-mocha-700 transition duration-300 focus:border-mocha-300 focus:outline-none focus:ring-1 focus:ring-mocha-300"
                >
                  <option v-for="n in room.maxPeople || 2" :key="n" :value="n">
                    {{ n }} 人
                  </option>
                </select>
              </div>
            </div>

            <div v-if="nights > 0" class="mt-6 space-y-2 border-t border-mocha-100 pt-5 text-sm">
              <div class="flex justify-between text-mocha-400">
                <span>NT$ {{ room.price?.toLocaleString() }} x {{ nights }} 晚</span>
                <span>NT$ {{ totalPrice.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-lg">
                <span class="font-medium text-mocha-700">總計</span>
                <span class="font-display font-medium text-mocha-600">
                  NT$ {{ totalPrice.toLocaleString() }}
                </span>
              </div>
            </div>

            <button
              :disabled="nights <= 0"
              class="mt-7 w-full rounded-2xl bg-mocha-600 py-3.5 font-display text-sm tracking-[0.15em] text-white transition duration-300 hover:bg-mocha-700 disabled:cursor-not-allowed disabled:opacity-40"
              @click="openBooking"
            >
              立即預訂
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="flex min-h-[50vh] items-center justify-center">
    <p class="font-display text-lg tracking-wider text-mocha-300">載入中...</p>
  </div>

  <!-- Booking Modal -->
  <Teleport to="body">
    <div
      v-if="showBookingModal"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-mocha-900/40 p-4 backdrop-blur-sm"
      @click.self="!isSubmitting && (showBookingModal = false)"
    >
      <div class="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        <!-- Success State -->
        <div v-if="successOrder" class="p-10 text-center">
          <div
            class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 font-display text-2xl text-emerald-600"
          >
            ✓
          </div>
          <h3 class="mt-6 font-display text-2xl font-light tracking-wider text-mocha-800">
            預訂成功
          </h3>
          <p class="mt-2 text-sm tracking-wide text-mocha-400">
            您的訂單已成立，祝您旅途愉快！
          </p>

          <div class="mt-8 rounded-2xl bg-cream p-5 text-left text-sm">
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-mocha-400">房型</span>
                <span class="font-medium text-mocha-700">{{ room.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-mocha-400">入住</span>
                <span class="font-medium text-mocha-700">
                  {{ successOrder.checkInDate?.split('T')[0] }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-mocha-400">退房</span>
                <span class="font-medium text-mocha-700">
                  {{ successOrder.checkOutDate?.split('T')[0] }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-mocha-400">人數</span>
                <span class="font-medium text-mocha-700">{{ successOrder.peopleNum }} 人</span>
              </div>
              <div class="flex justify-between border-t border-mocha-100 pt-3">
                <span class="font-medium text-mocha-700">總計</span>
                <span class="font-display font-medium text-mocha-600">
                  NT$ {{ totalPrice.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-8 flex gap-3">
            <NuxtLink
              to="/orders"
              class="flex-1 rounded-2xl border border-mocha-200 py-3 text-center text-sm tracking-wider text-mocha-500 transition duration-300 hover:bg-latte"
            >
              查看我的訂單
            </NuxtLink>
            <button
              class="flex-1 rounded-2xl bg-mocha-600 py-3 text-sm tracking-wider text-white transition duration-300 hover:bg-mocha-700"
              @click="showBookingModal = false"
            >
              關閉
            </button>
          </div>
        </div>

        <!-- Booking Form -->
        <template v-else>
          <div class="border-b border-mocha-100 px-8 py-5">
            <h3 class="font-display text-lg font-medium tracking-wider text-mocha-700">
              填寫預訂資訊
            </h3>
            <p class="mt-1 text-sm text-mocha-400">
              {{ room.name }} · {{ nights }} 晚 ·
              <span class="font-medium text-mocha-600">NT$ {{ totalPrice.toLocaleString() }}</span>
            </p>
          </div>

          <form class="p-8" @submit="submitOrder">
            <div
              v-if="serverError"
              class="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm text-red-600"
            >
              {{ serverError }}
            </div>

            <div class="space-y-5">
              <div>
                <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
                  姓名 *
                </label>
                <input
                  v-model="bName"
                  type="text"
                  placeholder="請輸入真實姓名"
                  class="w-full rounded-2xl border bg-cream px-4 py-3 text-mocha-700 transition duration-300 placeholder:text-mocha-300 focus:outline-none focus:ring-1"
                  :class="nameError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : 'border-mocha-100 focus:border-mocha-300 focus:ring-mocha-300'"
                >
                <p v-if="nameError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ nameError }}</p>
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
                  電子信箱 *
                </label>
                <input
                  v-model="bEmail"
                  type="email"
                  placeholder="name@example.com"
                  class="w-full rounded-2xl border bg-cream px-4 py-3 text-mocha-700 transition duration-300 placeholder:text-mocha-300 focus:outline-none focus:ring-1"
                  :class="bEmailError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : 'border-mocha-100 focus:border-mocha-300 focus:ring-mocha-300'"
                >
                <p v-if="bEmailError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ bEmailError }}</p>
              </div>

              <div>
                <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
                  手機號碼 *
                </label>
                <input
                  v-model="bPhone"
                  type="tel"
                  placeholder="0912345678"
                  class="w-full rounded-2xl border bg-cream px-4 py-3 text-mocha-700 transition duration-300 placeholder:text-mocha-300 focus:outline-none focus:ring-1"
                  :class="phoneError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : 'border-mocha-100 focus:border-mocha-300 focus:ring-mocha-300'"
                >
                <p v-if="phoneError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ phoneError }}</p>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
                    郵遞區號 *
                  </label>
                  <input
                    v-model="bZipcode"
                    type="text"
                    placeholder="100"
                    class="w-full rounded-2xl border bg-cream px-4 py-3 text-mocha-700 transition duration-300 placeholder:text-mocha-300 focus:outline-none focus:ring-1"
                    :class="zipcodeError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : 'border-mocha-100 focus:border-mocha-300 focus:ring-mocha-300'"
                  >
                  <p v-if="zipcodeError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ zipcodeError }}</p>
                </div>
                <div class="col-span-2">
                  <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
                    地址 *
                  </label>
                  <input
                    v-model="bAddress"
                    type="text"
                    placeholder="請輸入詳細地址"
                    class="w-full rounded-2xl border bg-cream px-4 py-3 text-mocha-700 transition duration-300 placeholder:text-mocha-300 focus:outline-none focus:ring-1"
                    :class="addressError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : 'border-mocha-100 focus:border-mocha-300 focus:ring-mocha-300'"
                  >
                  <p v-if="addressError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ addressError }}</p>
                </div>
              </div>
            </div>

            <div class="mt-8 flex gap-3">
              <button
                type="button"
                :disabled="isSubmitting"
                class="flex-1 rounded-2xl border border-mocha-200 py-3 text-sm tracking-wider text-mocha-500 transition duration-300 hover:bg-latte disabled:opacity-40"
                @click="showBookingModal = false"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 rounded-2xl bg-mocha-600 py-3 text-sm tracking-wider text-white transition duration-300 hover:bg-mocha-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {{ isSubmitting ? '提交中...' : '確認預訂' }}
              </button>
            </div>
          </form>
        </template>
      </div>
    </div>
  </Teleport>
</template>
