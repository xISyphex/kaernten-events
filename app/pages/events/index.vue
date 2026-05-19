<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from '#imports'

const router = useRouter()

onMounted(() => {
  router.replace('/')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="rounded-2xl bg-white p-8 shadow border border-gray-200 text-center">
      <p class="text-lg font-medium text-slate-900">Redirecting to the event list…</p>
      <p class="mt-3 text-sm text-slate-600">If you are not redirected automatically, <a href="/" class="text-indigo-600 hover:underline">click here</a>.</p>
    </div>
  </div>
</template>
