<!-- events/index.vue - Main event listing page with filters and pagination -->
<script setup lang="ts">
import {ref, computed, watch } from 'vue'
import EventCard from '~/components/events/eventcard.vue'
import EventFilter from '~/components/events/EventFilter.vue'

//page state 
const page = ref(0)
const pageSize = 24
const filters = ref({
  search: '',
  towns: [] as string[],
  groups: [] as string[],
  themes: [] as string[],
  topOnly: false,
  startDate: null as string | null,
  endDate: null as string | null,
})
const pageInput = ref(page.value + 1)
watch(page, (val) => {
  pageInput.value = val + 1
})


//date fetching
const { data: initialData, status: initialStatus, error: initialError } = await useFetch<Record<string, any>>(
  '/api/events',
  { params: { pageNo: 0, pageSize: pageSize } }
)
 
//fetching all events in the background — used for filtering & pagination
const { data: fullCache, status: cacheStatus, error: cacheError } = useLazyFetch<Record<string, any>>(
  '/api/events',
  { params: { pageNo: 0, pageSize: 3000 } }
)
const initialPending = computed(() => initialStatus.value === 'pending')
const cacheinitialPending = computed(() => cacheStatus.value === 'pending')
const error = computed(() => initialError.value || cacheError.value)

//all events from the full cache (used for client-side filtering)
const allEvents = computed<Record<string, any>[]>(() => fullCache.value?.data ?? [])
 
const totalRecords = computed(() =>
  Number(initialData.value?.paging?.totalRecordCount ?? 0)
)

//filter options (derived from cached events)
const townOptions = computed(() =>
  [...new Set(
    allEvents.value
      .map(ev => ev.location?.town ?? ev.location?.place)
      .filter(Boolean)
      .map(String)
  )].sort()
)
 
const groupOptions = computed(() =>
  [...new Set(
    allEvents.value
      .flatMap(ev => (ev.criteria ?? []).map((c: any) => c?.groupName).filter(Boolean))
      .map(String)
  )].sort()
)
 
const themeOptions = computed(() =>
  [...new Set(
    allEvents.value
      .flatMap(ev => (ev.holidayThemes ?? ev.themes ?? []).map((t: any) => t?.name).filter(Boolean))
      .map(String)
  )].sort()
)

//filtering 

const hasFilters = computed(
  () =>
    Boolean(filters.value.search) ||
    filters.value.towns.length > 0 ||
    filters.value.groups.length > 0 ||
    filters.value.themes.length > 0 ||
    filters.value.topOnly ||
    Boolean(filters.value.startDate) ||
    Boolean(filters.value.endDate)
)

const allFilteredEvents = computed(() => {
  // While cache is still loading, nothing to filter yet
  if (cacheinitialPending.value) return []
 
  return allEvents.value.filter((ev) => {
    const title = String(ev.name ?? ev['@id'] ?? '').toLowerCase()
    const description = String(
      ev.description ?? ev['dc:description'] ?? ev.plainDescriptions?.[0]?.description ?? ''
    ).toLowerCase()
    const town = String(ev.location?.town ?? ev.location?.place ?? '').toLowerCase()
    const themeGroups = ((ev.holidayThemes ?? ev.themes ?? []) as any[])
      .map((t) => String(t?.name ?? '').toLowerCase())
      .join(' ')
    const criteriaGroups = ((ev.criteria ?? []) as any[])
      .map((c) => String(c?.groupName ?? ''))
      .join(' ')
      .toLowerCase()
 
    if (filters.value.search) {
      const q = filters.value.search.toLowerCase()
      if (
        !title.includes(q)
      )
        return false
    }
 
    if (filters.value.towns.length > 0) {
      if (!filters.value.towns.some((f) => town.includes(String(f).toLowerCase()))) return false
    }
 
    if (filters.value.groups.length > 0) {
      if (!filters.value.groups.some((f) => criteriaGroups.includes(String(f).toLowerCase()))) return false
    }
 
    if (filters.value.themes.length > 0) {
      if (!filters.value.themes.some((f) => themeGroups.includes(String(f).toLowerCase()))) return false
    }
 
    if (filters.value.topOnly && !ev.isTopEvent) return false
 
    if (filters.value.startDate || filters.value.endDate) {
      const evDateStr =
        ev.date ??
        ev.dateStartTimes?.[0] ??
        ev.nextOccurrences?.items?.[0]?.date ??
        ev.selectedEventDate?.items?.[0]?.date
      if (evDateStr) {
        const evDate = new Date(evDateStr)
        if (!isNaN(evDate.getTime())) {
          if (filters.value.startDate) {
            const start = new Date(filters.value.startDate)
            if (!isNaN(start.getTime()) && evDate < start) return false
          }
          if (filters.value.endDate) {
            const end = new Date(filters.value.endDate)
            if (!isNaN(end.getTime()) && evDate > end) return false
          }
        }
      }
    }
 
    return true
  })
})

//Pagination
 
//rset to page 0 whenever filters change
watch(filters, () => { page.value = 0 }, { deep: true })
 
const pageCount = computed(() => {
  if (cacheinitialPending.value) {
    //before cache is ready, using the total from the API
    return Math.max(1, Math.ceil(totalRecords.value / pageSize))
  }
  if (hasFilters.value) {
    return Math.max(1, Math.ceil(allFilteredEvents.value.length / pageSize))
  }
  return Math.max(1, Math.ceil(allEvents.value.length / pageSize))
})
 
const displayedEvents = computed(() => {
  //while the full cache is loading, showing the initial 24
  if (cacheinitialPending.value) {
    return initialData.value?.data ?? []
  }
 
  if (hasFilters.value) {
    const start = page.value * pageSize
    return allFilteredEvents.value.slice(start, start + pageSize)
  }
 
  const start = page.value * pageSize
  return allEvents.value.slice(start, start + pageSize)
})
 
const resultCountText = computed(() => {
  if (cacheinitialPending.value) {
    return `${initialData.value?.data?.length ?? 0} von ${totalRecords.value} Ergebnissen (lädt…)`
  }
  const total = hasFilters.value ? allFilteredEvents.value.length : allEvents.value.length
  return `${displayedEvents.value.length} von ${total} Ergebnissen`
})

//visible page numbers for pagination control
const visiblePages = computed(() => {
  const pages: number[] = []
  const pagesBefore = 2
  const pagesAfter = 2
  const totalVisible = pagesBefore + pagesAfter + 1
 
  let start = Math.max(0, page.value - pagesBefore)
  let end = Math.min(pageCount.value - 1, page.value + pagesAfter)
 
  if (start === 0 && end < totalVisible - 1) {
    end = Math.min(pageCount.value - 1, totalVisible - 1)
  } else if (end === pageCount.value - 1 && end - start + 1 < totalVisible) {
    start = Math.max(0, pageCount.value - totalVisible)
  }
 
  for (let i = start; i <= end; i++) pages.push(i)
 
  //ellipsis + last page
  if (end < pageCount.value - 1) {
    if (end < pageCount.value - 2) pages.push(-1)
    pages.push(pageCount.value - 1)
  }

  //first page + ellipsis
  if (start > 0) {
    if (start > 1) pages.unshift(-1)  // ellipsis
    pages.unshift(0)                   // page 1
  }
 
  return pages
})

function onFiltersUpdate(next: {
  search?: string
  towns?: string[]
  groups?: string[]
  themes?: string[]
  topOnly?: boolean
  startDate?: string | null
  endDate?: string | null
}) {
  filters.value = {
    search: next.search ?? '',
    towns: next.towns ?? [],
    groups: next.groups ?? [],
    themes: next.themes ?? [],
    topOnly: next.topOnly ?? false,
    startDate: next.startDate ?? null,
    endDate: next.endDate ?? null,
  }
}
 
function goToPage(newPage: number) {
  page.value = Math.max(0, Math.min(newPage, pageCount.value - 1))
}

</script>

<template>
  <div class="min-h-screen bg-cover bg-center bg-no-repeat p-8" style="background-image: url('/images/bg.jpg')">
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="rounded-2xl bg-white/60 p-6 shadow-sm border border-gray-200">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl text-black font-semibold">Aktuelle Veranstaltungen</h2>
          </div>
          <div class="text-sm text-gray-500">
            <span v-if="initialPending">Loading events…</span>
            <span v-else-if="error">Error loading data.</span>
            <span v-else>
              {{ resultCountText }}
                <span v-if="!initialPending && cacheinitialPending" class="ml-2 text-xs text-indigo-400 animate-pulse">
                  (Alle Events werden geladen…)
                </span>
            </span>
          </div>
        </div>

        <div class="mt-4">
          <EventFilter :towns="townOptions" :groups="groupOptions" :themes="themeOptions" @update="onFiltersUpdate" />
        </div>
          <!-- Loading skeleton -->
        <div class="mt-6 space-y-4">
          <template v-if="initialPending">
            <div class="animate-pulse space-y-3">
              <div class="h-6 rounded bg-slate-200 w-3/4"></div>
              <div class="h-6 rounded bg-slate-200 w-2/3"></div>
              <div class="h-6 rounded bg-slate-200 w-1/2"></div>
            </div>
          </template>
            <!-- Error state -->
          <template v-else-if="error">
            <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              <p class="font-semibold">Failed to fetch events.</p>
              <p>{{ error.message }}</p>
            </div>
          </template>

            <!-- Events grid -->
          <template v-else>
            <div v-if="displayedEvents.length > 0" class="grid gap-4 sm:grid-cols-3 items-stretch">
              <EventCard
                v-for="(event, index) in displayedEvents"
                :key="event.id || event['@id'] || index"
                :event="event"
              />
            </div>
            <div v-else class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <p class="font-semibold">No events match your filters.</p>
              <p>Try adjusting your search or filter options.</p>
            </div>
          </template>

            <!-- Pagination controls -->
          <template v-if="!initialPending && !error && pageCount > 1">
            <div class="mt-4 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-4">
            
              <!-- page buttons -->
              <div class="flex flex-wrap items-center justify-center gap-2">
                  <!-- little search-input (only numbers allowed) to select a page -->
               <input
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                min="1"
                :max="pageCount"
                v-model.number="pageInput"
                @change="goToPage(pageInput - 1)"
                class="w-10 h-8 rounded ring-gray-400 ring-2 bg-white text-center text-sm text-black focus:ring-2 focus:ring-indigo-500"
                :disabled="initialPending || error"
              />
                <button
                  v-if="page > 0"
                  class="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                  @click="goToPage(page - 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="size-4">
                    <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clip-rule="evenodd" />
                  </svg>


                </button>
                <button
                  v-for="pageNum in visiblePages"
                  :key="pageNum"
                  :disabled="pageNum === -1"
                  :class="[
                    'rounded-xl border px-3 py-2 text-sm transition flex items-center justify-center',
                    pageNum === page
                      ? 'border-black bg-red-500 text-white text-lg h-10 w-10 underline'
                      : 'border-gray-300 bg-white text-black hover:bg-slate-100 disabled:cursor-default disabled:hover:bg-white disabled:border-gray-200',
                  ]"
                  @click="pageNum !== -1 && goToPage(pageNum)"
                >
                  {{ pageNum === -1 ? '…' : pageNum + 1 }}
                </button>
                <button
                  v-if="page < pageCount - 1"
                  class="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                  @click="goToPage(page + 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="size-4">
                    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
                  </svg>           
                </button>
              </div>
              <!--<div class="text-sm text-slate-600">Seite {{ page + 1 }} von {{ pageCount }}</div>-->
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
