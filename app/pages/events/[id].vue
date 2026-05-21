<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: event, pending, error } = await useFetch<Record<string, any>>(
  `/api/events/${id}` 
)

const mainImage = computed(() => event.value?.images?.[0]?.urls?.[0] ?? null)
const description = computed(() =>
  event.value?.descriptions?.find((d: any) => d.type === 32)?.description ?? ''
)
const nextDates = computed(() => event.value?.nextOccurrences?.items ?? [])
const address = computed(() => event.value?.addresses?.[0] ?? null)
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div v-if="pending" class="text-center text-slate-500 mt-20">Lade Event...</div>

    <div v-else-if="error" class="text-center text-red-500 mt-20">
      Fehler beim Laden des Events.
    </div>

    <div v-else-if="event" class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="rounded-2xl bg-white shadow overflow-hidden">
        <img v-if="mainImage" :src="mainImage" class="w-full h-72 object-cover" />
        <div class="p-6">
          <div class="flex items-start justify-between gap-4">
            <h1 class="text-2xl font-bold text-slate-900">{{ event.name }}</h1>
            <span v-if="event.isTopEvent" class="shrink-0 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
              TOP Event
            </span>
          </div>
          <p class="mt-1 text-sm text-slate-500">
            📍 {{ event.location?.town ?? event.location?.place }}
          </p>
        </div>
      </div>

      <!-- Description -->
      <div v-if="description" class="rounded-2xl bg-white shadow p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Beschreibung</h2>
        <div class="prose prose-sm max-w-none text-slate-700" v-html="description" />
      </div>

      <!-- Next Dates -->
      <div v-if="nextDates.length" class="rounded-2xl bg-white shadow p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Nächste Termine</h2>
        <ul class="divide-y divide-gray-100">
          <li v-for="(item, i) in nextDates" :key="i" class="py-2 flex justify-between text-sm text-slate-700">
            <span>{{ new Date(item.date).toLocaleDateString('de-AT', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }) }}</span>
            <span class="text-slate-500">{{ item.startTime }} · {{ item.duration }} Std.</span>
          </li>
        </ul>
      </div>

      <!-- Contact -->
      <div v-if="address" class="rounded-2xl bg-white shadow p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Kontakt</h2>
        <div class="text-sm text-slate-700 space-y-1">
          <p v-if="address.company">{{ address.company }}</p>
          <p v-if="address.address1">{{ address.address1 }}, {{ address.zipCode }} {{ address.city }}</p>
          <p v-if="address.phone">📞 {{ address.phone }}</p>
          <a v-if="address.email" :href="`mailto:${address.email}`" class="text-indigo-600 hover:underline">✉️ {{ address.email }}</a>
          <a v-if="address.url" :href="address.url" target="_blank" class="block text-indigo-600 hover:underline">🌐 {{ address.url }}</a>
        </div>
      </div>

      <!-- Criteria -->
      <div v-if="event.criteria?.length" class="rounded-2xl bg-white shadow p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Kategorien</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="item in event.criteria.flatMap((c: any) => c.items)"
            :key="item.id"
            class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
          >
            {{ item.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>