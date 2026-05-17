<script setup lang="ts">
const { data, pending, error } = await useFetch<Record<string, any>>('/api/events')
const events = computed(() => data.value?.data ?? data.value?.events ?? data.value?.items ?? data.value?.['@graph'] ?? [])
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 class="text-4xl font-bold mb-2">Kärnten Events</h1>
        <p class="text-gray-700">Event platform powered by Nuxt 4 and the Deskline event API.</p>
      </div>

      <div class="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl font-semibold">Upcoming events</h2>
            <p class="text-sm text-gray-500">Loaded through a server API proxy.</p>
          </div>
          <div class="text-sm text-gray-500">
            <span v-if="pending">Loading events…</span>
            <span v-else-if="error">Error loading data.</span>
            <span v-else>{{ events.length }} items</span>
          </div>
        </div>

        <div class="mt-6 space-y-4">
          <template v-if="pending">
            <div class="animate-pulse space-y-3">
              <div class="h-6 rounded bg-slate-200 w-3/4"></div>
              <div class="h-6 rounded bg-slate-200 w-2/3"></div>
              <div class="h-6 rounded bg-slate-200 w-1/2"></div>
            </div>
          </template>

          <template v-else-if="error">
            <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              <p class="font-semibold">Failed to fetch events.</p>
              <p>{{ error.message }}</p>
            </div>
          </template>

          <template v-else>
            <div class="grid gap-4 sm:grid-cols-2">
              <div v-for="(event, index) in events" :key="event.id || event['@id'] || index" class="rounded-2xl border border-gray-200 bg-slate-50 p-5 hover:shadow-lg transition-shadow">
                <h3 class="text-lg font-semibold text-slate-900">{{ event.name ?? event['@id'] ?? 'Untitled event' }}</h3>
                <p class="mt-2 text-sm text-slate-600">{{ event.description ?? event['dc:description'] ?? event.plainDescriptions?.[0]?.description ?? 'No description available.' }}</p>
                <div class="mt-3 flex flex-col gap-1 text-xs text-slate-500">
                  <span v-if="event.date">Date: {{ event.date }}</span>
                  <span v-if="event.location?.place">Place: {{ event.location.place }}</span>
                  <span v-else-if="event.location?.town">Town: {{ event.location.town }}</span>
                  <span>ID: {{ event.id || event['@id'] || 'unknown' }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>