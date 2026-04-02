<script setup>
import userAPI from '@/composables/api/userApi'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'

definePageMeta({ layout: false })

const token = useTokenCookie()
const commonStore = useCommonStore()
const toast = useToast()

const schema = toTypedSchema(
  yup.object({
    name: yup.string().required('請輸入姓名'),
    email: yup.string().required('請輸入電子信箱').email('信箱格式不正確'),
    password: yup
      .string()
      .required('請輸入密碼')
      .min(8, '密碼至少 8 碼')
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, '密碼需包含英文及數字'),
    confirmPassword: yup
      .string()
      .required('請再次輸入密碼')
      .oneOf([yup.ref('password')], '兩次密碼不一致'),
    phone: yup.string().required('請輸入手機號碼').matches(/^09\d{8}$/, '請輸入正確的手機號碼'),
    birthday: yup.date().required('請選擇生日').typeError('請選擇生日'),
    address: yup.object({
      zipcode: yup.number().required('請輸入郵遞區號').typeError('請輸入數字'),
      detail: yup.string().required('請輸入地址')
    })
  })
)

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })

const { value: name, errorMessage: nameError } = useField('name')
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField('confirmPassword')
const { value: phone, errorMessage: phoneError } = useField('phone')
const { value: birthday, errorMessage: birthdayError } = useField('birthday')
const { value: zipcode, errorMessage: zipcodeError } = useField('address.zipcode')
const { value: addressDetail, errorMessage: addressDetailError } = useField('address.detail')

const serverError = ref('')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''

  const { data, error } = await userAPI.signup(
    {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      birthday: values.birthday.toISOString().split('T')[0],
      address: {
        zipcode: values.address.zipcode,
        detail: values.address.detail
      }
    },
    { key: `signup-${Date.now()}` }
  )

  if (error.value) {
    serverError.value = error.value?.data?.message || '註冊失敗，請檢查欄位後重試'
    return
  }

  const result = data.value
  token.value = result.token
  commonStore.token = result.token

  toast.success('註冊成功，歡迎加入！')
  navigateTo('/admin/rooms')
})

const inputBase = 'w-full rounded-2xl border bg-cream px-4 py-3 text-mocha-700 transition duration-300 placeholder:text-mocha-300 focus:outline-none focus:ring-1'
const inputNormal = `${inputBase} border-mocha-100 focus:border-mocha-300 focus:ring-mocha-300`
const inputError = `${inputBase} border-red-300 focus:border-red-400 focus:ring-red-300`
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="mb-10 text-center">
        <NuxtLink to="/" class="font-display text-3xl font-semibold tracking-widest text-mocha-700">
          Luxt
        </NuxtLink>
        <p class="mt-3 text-sm tracking-wider text-mocha-400">建立帳號</p>
      </div>

      <!-- Signup Card -->
      <div class="rounded-3xl border border-mocha-100 bg-white p-10 shadow-sm">
        <div
          v-if="serverError"
          class="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm text-red-600"
        >
          {{ serverError }}
        </div>

        <form class="space-y-5" @submit="onSubmit">
          <div>
            <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
              姓名
            </label>
            <input
              v-model="name"
              type="text"
              placeholder="請輸入姓名"
              :class="nameError ? inputError : inputNormal"
            />
            <p v-if="nameError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ nameError }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
              電子信箱
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="name@example.com"
              :class="emailError ? inputError : inputNormal"
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
              placeholder="至少 8 碼，含英文及數字"
              :class="passwordError ? inputError : inputNormal"
            />
            <p v-if="passwordError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ passwordError }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
              確認密碼
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="請再次輸入密碼"
              :class="confirmPasswordError ? inputError : inputNormal"
            />
            <p v-if="confirmPasswordError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ confirmPasswordError }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
              手機號碼
            </label>
            <input
              v-model="phone"
              type="tel"
              placeholder="0912345678"
              :class="phoneError ? inputError : inputNormal"
            />
            <p v-if="phoneError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ phoneError }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
              生日
            </label>
            <ClientOnly>
              <VDatePicker
                v-model="birthday"
                :max-date="new Date()"
                :popover="{ placement: 'bottom-start' }"
              >
                <template #default="{ togglePopover, inputValue }">
                  <button
                    type="button"
                    class="w-full text-left"
                    :class="birthdayError ? inputError : inputNormal"
                    @click="togglePopover"
                  >
                    {{ inputValue || '選擇生日' }}
                  </button>
                </template>
              </VDatePicker>
            </ClientOnly>
            <p v-if="birthdayError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ birthdayError }}</p>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
                郵遞區號
              </label>
              <input
                v-model.number="zipcode"
                type="text"
                placeholder="100"
                :class="zipcodeError ? inputError : inputNormal"
              />
              <p v-if="zipcodeError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ zipcodeError }}</p>
            </div>
            <div class="col-span-2">
              <label class="mb-1.5 block text-xs font-medium tracking-wider text-mocha-500">
                地址
              </label>
              <input
                v-model="addressDetail"
                type="text"
                placeholder="請輸入詳細地址"
                :class="addressDetailError ? inputError : inputNormal"
              />
              <p v-if="addressDetailError" class="mt-1.5 text-xs tracking-wider text-red-500">{{ addressDetailError }}</p>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full rounded-2xl bg-mocha-600 py-3.5 font-display text-sm tracking-[0.15em] text-white transition duration-300 hover:bg-mocha-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {{ isSubmitting ? '註冊中...' : '建立帳號' }}
          </button>
        </form>
      </div>

      <p class="mt-8 text-center text-sm tracking-wider text-mocha-300">
        已有帳號？
        <NuxtLink to="/login" class="text-mocha-500 transition duration-300 hover:text-mocha-700">
          前往登入
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
