<script setup>
import orderAPI from '@/composables/api/orderApi'

definePageMeta({ middleware: 'auth' })

const toast = useToast()
const orders = ref([])
const isLoading = ref(true)
const cancelTarget = ref(null)

async function fetchOrders() {
  isLoading.value = true
  const { data } = await orderAPI.getOrders({ key: `orders-${Date.now()}` })
  orders.value = data.value?.result || []
  isLoading.value = false
}

async function confirmCancel() {
  if (!cancelTarget.value) return
  await orderAPI.deleteOrder(cancelTarget.value._id, { key: `cancel-${Date.now()}` })
  cancelTarget.value = null
  toast.success('訂單已取消')
  await fetchOrders()
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}

function calcNights(checkIn, checkOut) {
  const diff = new Date(checkOut) - new Date(checkIn)
  return Math.max(0, Math.ceil(diff / 86400000))
}

await fetchOrders()
</script>

<template>
  <div class="mx-auto max-w-4xl px-8 py-16">
    <h1 class="font-display text-2xl font-light tracking-wider text-mocha-800">我的訂單</h1>
    <p class="mt-2 text-sm tracking-wider text-mocha-400">共 {{ orders.length }} 筆訂單</p>

    <!-- Loading -->
    <div v-if="isLoading" class="py-24 text-center">
      <p class="font-display tracking-wider text-mocha-300">載入中...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!orders.length" class="py-24 text-center">
      <p class="font-display text-lg tracking-wider text-mocha-300">尚無訂單紀錄</p>
      <NuxtLink
        to="/rooms"
        class="mt-5 inline-block text-sm tracking-wider text-mocha-500 transition duration-300 hover:text-mocha-700"
      >
        前往探索房型
      </NuxtLink>
    </div>

    <!-- Order List -->
    <div v-else class="mt-10 space-y-8">
      <div
        v-for="order in orders"
        :key="order._id"
        class="overflow-hidden rounded-3xl border border-mocha-100 bg-white shadow-sm"
      >
        <div class="flex flex-col sm:flex-row">
          <!-- Room Image -->
          <div class="aspect-[4/3] w-full shrink-0 bg-latte sm:aspect-auto sm:w-52">
            <img
              v-if="order.roomId?.imageUrl"
              :src="order.roomId.imageUrl"
              :alt="order.roomId?.name"
              class="h-full w-full object-cover"
            />
          </div>

          <!-- Order Info -->
          <div class="flex flex-1 flex-col justify-between p-6">
            <div>
              <div class="flex items-start justify-between">
                <h3 class="font-display text-lg font-medium tracking-wider text-mocha-700">
                  {{ order.roomId?.name }}
                </h3>
                <span
                  class="shrink-0 rounded-full px-3 py-1 text-xs tracking-wider"
                  :class="
                    order.status === 0
                      ? 'bg-amber-50 text-amber-600'
                      : order.status === -1
                        ? 'bg-stone-100 text-stone-400'
                        : 'bg-emerald-50 text-emerald-600'
                  "
                >
                  {{ order.status === 0 ? '待確認' : order.status === -1 ? '已取消' : '已確認' }}
                </span>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-mocha-400">
                <div>
                  <span class="text-mocha-300">入住：</span>{{ formatDate(order.checkInDate) }}
                </div>
                <div>
                  <span class="text-mocha-300">退房：</span>{{ formatDate(order.checkOutDate) }}
                </div>
                <div>
                  <span class="text-mocha-300">人數：</span>{{ order.peopleNum }} 人
                </div>
                <div>
                  <span class="text-mocha-300">晚數：</span
                  >{{ calcNights(order.checkInDate, order.checkOutDate) }} 晚
                </div>
              </div>
            </div>

            <div class="mt-5 flex items-center justify-between border-t border-mocha-100 pt-5">
              <div class="font-display text-lg font-medium text-mocha-600">
                NT$
                {{
                  (
                    (order.roomId?.price || 0) *
                    calcNights(order.checkInDate, order.checkOutDate)
                  ).toLocaleString()
                }}
              </div>
              <button
                v-if="order.status !== -1"
                class="rounded-2xl border border-red-100 px-5 py-2 text-xs tracking-wider text-red-400 transition duration-300 hover:bg-red-50"
                @click="cancelTarget = order"
              >
                取消訂單
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Cancel Confirm Modal -->
  <Teleport to="body">
    <div
      v-if="cancelTarget"
      class="fixed inset-0 z-50 flex items-center justify-center bg-mocha-900/40 backdrop-blur-sm"
      @click.self="cancelTarget = null"
    >
      <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h3 class="font-display text-lg font-medium tracking-wider text-mocha-700">
          確認取消訂單
        </h3>
        <p class="mt-3 text-sm leading-relaxed text-mocha-400">
          確定要取消「<span class="font-medium text-mocha-600">{{ cancelTarget.roomId?.name }}</span
          >」的訂單嗎？
        </p>
        <div class="mt-8 flex justify-end gap-3">
          <button
            class="rounded-2xl border border-mocha-200 px-6 py-2.5 text-sm tracking-wider text-mocha-500 transition duration-300 hover:bg-latte"
            @click="cancelTarget = null"
          >
            返回
          </button>
          <button
            class="rounded-2xl bg-red-500 px-6 py-2.5 text-sm tracking-wider text-white transition duration-300 hover:bg-red-600"
            @click="confirmCancel"
          >
            確認取消
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
