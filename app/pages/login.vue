<script setup>
import userAPI from '@/composables/api/userApi'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'

definePageMeta({ layout: false })

const commonStore = useCommonStore()
const token = useTokenCookie()
const toast = useToast()

const schema = toTypedSchema(
  yup.object({
    email: yup.string().required('請輸入電子信箱').email('信箱格式不正確'),
    password: yup.string().required('請輸入密碼').min(8, '密碼至少 8 碼')
  })
)

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })
const { value: email, errorMessage: emailError } = useField('email', undefined, {
  initialValue: commonStore.remember ? commonStore.email : ''
})
const { value: password, errorMessage: passwordError } = useField('password')

const remember = ref(commonStore.remember)
const serverError = ref('')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''

  const { data, error } = await userAPI.login(
    { email: values.email, password: values.password },
    { key: `login-${Date.now()}` }
  )

  if (error.value) {
    serverError.value = error.value?.data?.message || '登入失敗，請檢查帳號密碼'
    return
  }

  const result = data.value
  token.value = result.token
  commonStore.token = result.token

  commonStore.remember = remember.value
  commonStore.email = remember.value ? values.email : ''

  toast.success('登入成功')
  navigateTo('/admin/rooms')
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-cream px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="mb-10 text-center">
        <NuxtLink to="/" class="font-display text-3xl font-semibold tracking-widest text-mocha-700">
          Luxt
        </NuxtLink>
        <p class="mt-3 text-sm tracking-wider text-mocha-400">登入後台管理系統</p>
      </div>

      <!-- Login Card -->
      <div class="rounded-3xl border border-mocha-100 bg-white p-10 shadow-sm">
        <div
          v-if="serverError"
          class="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm text-red-600"
        >
          {{ serverError }}
        </div>

        <form class="space-y-6" @submit="onSubmit">
          <div>
            <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
              電子信箱
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="name@example.com"
              class="w-full rounded-2xl border bg-cream px-4 py-3 text-mocha-700 transition duration-300 placeholder:text-mocha-300 focus:outline-none focus:ring-1"
              :class="emailError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : 'border-mocha-100 focus:border-mocha-300 focus:ring-mocha-300'"
            />
            <p v-if="emailError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ emailError }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
              密碼
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="請輸入密碼（至少 8 碼，含英文及數字）"
              class="w-full rounded-2xl border bg-cream px-4 py-3 text-mocha-700 transition duration-300 placeholder:text-mocha-300 focus:outline-none focus:ring-1"
              :class="passwordError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : 'border-mocha-100 focus:border-mocha-300 focus:ring-mocha-300'"
            />
            <p v-if="passwordError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ passwordError }}</p>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex cursor-pointer items-center gap-2 text-sm tracking-wider text-mocha-400">
              <input v-model="remember" type="checkbox" class="accent-mocha-500" />
              記住帳號
            </label>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full rounded-2xl bg-mocha-600 py-3.5 font-display text-sm tracking-[0.15em] text-white transition duration-300 hover:bg-mocha-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {{ isSubmitting ? '登入中...' : '登入' }}
          </button>
        </form>
      </div>

      <p class="mt-8 text-center text-sm tracking-wider text-mocha-300">
        還沒有帳號？
        <NuxtLink to="/signup" class="text-mocha-500 transition duration-300 hover:text-mocha-700">
          立即註冊
        </NuxtLink>
        <span class="mx-2">·</span>
        <NuxtLink to="/" class="text-mocha-500 transition duration-300 hover:text-mocha-700">
          回到首頁
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
