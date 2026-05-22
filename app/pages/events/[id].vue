<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: event, pending, error } = await useFetch<Record<string, any>>(
  `/api/events/${id}` 
)

const description = computed(() =>
  event.value?.descriptions?.find((d: any) => d.type === 32)?.description ?? ''
)
const nextDates = computed(() => event.value?.nextOccurrences?.items ?? [])
const address = computed(() => event.value?.addresses?.[0] ?? null)
//const groupName = computed(() => event.value?.criteria?.groupName ?? null)
const datesPerPage = 12
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(nextDates.value.length / datesPerPage))

const paginatedDates = computed(() => {
  const start = (currentPage.value - 1) * datesPerPage
  const end = start + datesPerPage

  return nextDates.value.slice(start, end)
})

const images = computed(() => event.value?.images?.flatMap((img: any) => img.urls?.[0]) ?? [])
const currentImageIndex = ref(0)
const mainImage = computed(() => images.value[currentImageIndex.value] ?? null)
const fullImageView = ref(false)
const imageCredits = computed(() => {
  const img = event.value?.images?.[currentImageIndex.value]
  if (!img) return null
  return {
    name: img.name ?? event.value?.name,
    copyright: img.copyright ?? null
  }
})

const durationType = computed(() => event.value?.durationType ?? null)
console.log('Duration Type:', durationType.value)

function prevImage() {
  if (images.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length 
}
function nextImage() {
  if (images.value.length === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length 
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

</script>

<template>
  <div class="min-h-dvh bg-cover bg-center bg-no-repeat bg-fixed" :style="`background-image: ${mainImage ? `url(${mainImage})` : 'none'}; background-size: cover; background-position: center; background-repeat: no-repeat;`">
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="bg-white/70 backdrop-blur shadow-lg border border-gray-200">
    <div v-if="pending" class="text-center text-slate-500 mt-20">Lade Event...</div>

    <div v-else-if="error" class="text-center text-red-500 mt-20">
      Fehler beim Laden des Events.
    </div>

    <div v-else-if="event" class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="rounded-2xl bg-white shadow overflow-hidden">
        <!-- Image carousel-->
         <div v-if="mainImage" class="relative group h-72">
          <img :src="mainImage"
                class="w-full h-full object-cover transition-opacity duration-300"
                @click="fullImageView = true"
          />
        <!--if multiple images, show navigation-->
          <template v-if="images.length > 1">
      <!-- Left arrow -->
           <button
              @click="prevImage"
              class="absolute left-3 top-1/2 -translate-y-1/2
              flex items-center justify-center w-9 h-9 rounded-full
              bg-black/30 text-white backdrop-blur-sm
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200 hover:bg-black/50"
            aria-label="Vorheriges Bild"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clip-rule="evenodd" />
              </svg>
            </button>

      <!-- Right arrow -->
            <button
              @click="nextImage"
              class="absolute right-3 top-1/2 -translate-y-1/2
              flex items-center justify-center w-9 h-9 rounded-full
              bg-black/30 text-white backdrop-blur-sm
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200 hover:bg-black/50"
            aria-label="Nächstes Bild"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
              </svg>
            </button>

      <!-- Dot indicators -->
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        <button
          v-for="(_, i) in images"
          :key="i"
          @click="currentImageIndex = i"
          :class="[
            'w-1.5 h-1.5 rounded-full transition-all duration-200',
            i === currentImageIndex ? 'bg-white w-3' : 'bg-white/50 hover:bg-white/80'
          ]"
        />
      </div>

      <!-- Image counter -->
      <div class="absolute top-3 right-3 rounded-full bg-black/30 backdrop-blur-sm px-2.5 py-1 text-xs text-white">
        {{ currentImageIndex + 1 }} / {{ images.length }}
      </div>
    </template>
  </div>
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
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Weitere Termine</h2>
        <ul class="divide-y divide-gray-100 min-h-[445px]">
          <li v-for="(item, i) in paginatedDates" :key="i" class="py-2 flex justify-between text-sm text-slate-700">
            <span>{{ new Date(item.date).toLocaleDateString('de-AT', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }) }}</span>
            <span v-if="durationType == 2 && item.duration" class="text-slate-500">{{ item.startTime }} · {{ item.duration }} Std.</span>
            <span v-else-if="durationType == 3 && item.duration" class="text-slate-500">{{ item.startTime }} · {{ Math.round(item.duration)}} Min.</span>
            <span v-else class="text-slate-500">{{ item.startTime }}</span>
          </li>
        </ul>
        <!-- pagination controls -->
        <div v-if="totalPages > 1" class="mt-4 flex justify-center items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50">
              <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50">
              <path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

          </button>
      </div>
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
            v-for="c in event.criteria"
            :key="c.id"
            class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
          >
            {{ c.groupName }}
          </span>
          <span
            v-for="item in event.criteria.flatMap((c: any) => c.items)"
            :key="item.id"
            class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
          >
            {{ item.name }}
          </span>
        </div>
      </div>
      <!-- Location -->
      <div v-if="event.location" class="rounded-2xl bg-white shadow p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-3">Ort</h2>
        <div class="text-sm text-slate-700 space-y-1">
          <p>{{ event.location.place }}, {{ event.location.town }}</p>
          <p>{{ address.zipCode }} {{ address.city }}</p>
        </div>
        <div v-if="event.location.latitude && event.location.longitude" class="mt-4">
        <iframe
  :src="`https://www.openstreetmap.org/export/embed.html?bbox=${event.location.longitude-0.01},${event.location.latitude-0.01},${event.location.longitude+0.01},${event.location.latitude+0.01}&layer=mapnik&marker=${event.location.latitude},${event.location.longitude}`"
  class="w-full h-64 rounded-lg border-0"
  allowfullscreen
  loading="lazy"
/>
        </div>
      </div>
    
  </div>
    </div>
  </div>
  <!-- full Image View -->
<Teleport to="body">
  <Transition name="lightbox">
    <div
      v-if="fullImageView"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      @click.self="fullImageView = false"
    >
      <!-- Close button -->
      <button
        @click="fullImageView = false"
        class="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Schließen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Prev arrow -->
      <button
        v-if="images.length > 1"
        @click="prevImage"
        class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Vorheriges Bild"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Image container -->
      <div class="relative max-w-5xl max-h-[90vh] w-full mx-16 flex flex-col">
        <img
          :src="mainImage"
          class="w-full max-h-[82vh] object-contain rounded-lg"
        />

        <!-- Caption bar -->
        <div class="mt-2 flex items-center justify-start px-1 gap-3">
          <p class="text-white/90 text-sm font-bold">
            {{ imageCredits?.name ?? event?.name }},
          </p>
          <p v-if="imageCredits?.copyright" class="text-white/50 text-xs">
            © {{ imageCredits.copyright }}
          </p>
        </div>
      </div>

      <!-- Next arrow -->
      <button
        v-if="images.length > 1"
        @click="nextImage"
        class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Nächstes Bild"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </Transition>
</Teleport>
  </div>
</template>