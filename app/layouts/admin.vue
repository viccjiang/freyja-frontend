<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-gray-300">
      <div class="px-6 py-5">
        <NuxtLink to="/" class="text-xl font-bold tracking-wide text-white">Luxt</NuxtLink>
        <span class="ml-2 rounded bg-amber-700 px-2 py-0.5 text-xs text-white">Admin</span>
      </div>
      <nav class="mt-4 space-y-1 px-3">
        <NuxtLink
          to="/admin/rooms"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-gray-800 hover:text-white"
          active-class="bg-gray-800 text-white"
        >
          <span class="text-lg">🏨</span>
          房型管理
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col bg-gray-50">
      <header class="flex items-center justify-between border-b bg-white px-8 py-4">
        <h1 class="text-lg font-semibold text-gray-800">後台管理系統</h1>
        <NuxtLink to="/" class="text-sm text-gray-500 hover:text-amber-700">回到前台</NuxtLink>
      </header>
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
