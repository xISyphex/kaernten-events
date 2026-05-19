<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import Navbar from '~/components/layout/navbar.vue'
import EventCard from '~/components/events/eventcard.vue'
import EventFilter from '~/components/events/EventFilter.vue'

const page = ref(0)
const pageSize = 24
const filters = reactive({
  search: '',
  towns: [] as string[],
  groups: [] as string[],
  topOnly: false,
  startDate: null as string | null,
  endDate: null as string | null,
})
const nextApiPage = ref(0)

const hasFilters = computed(
  () =>
    Boolean(filters.search) ||
    filters.towns.length > 0 ||
    filters.groups.length > 0 ||
    filters.topOnly ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate)
)
const apiPageNo = computed(() => (page.value === 0 ? 0 : page.value + 1))
const params = computed(() => ({
  pageNo: hasFilters.value ? nextApiPage.value : apiPageNo.value,
  pageSize: hasFilters.value ? 500 : pageSize,
}))

const { data, pending, error } = await useFetch<Record<string, any>>('/api/events', {
  params,
})
const { data: filterOptions } = await useFetch<Record<string, any>>('/api/events/options')

const allLoadedEvents = ref<Record<string, any>[]>([])

function getNextDesklinePage(currentPageNo: number) {
  return currentPageNo === 0 ? 2 : currentPageNo + 1
}

watch(hasFilters, (active) => {
  page.value = 0
  allLoadedEvents.value = []
  nextApiPage.value = 0
})

watch(data, () => {
  const newEvents = data.value?.data ?? []
  if (hasFilters.value && newEvents.length > 0) {
    allLoadedEvents.value = [...allLoadedEvents.value, ...newEvents]
    const allEventsLoaded = allLoadedEvents.value.length >= totalRecords.value
    if (!allEventsLoaded) {
      nextApiPage.value = getNextDesklinePage(nextApiPage.value)
    }
  }
})

const events = computed(() => data.value?.data ?? [])
const totalRecords = computed(() => Number(data.value?.paging?.totalRecordCount ?? 0))

const allFilteredEvents = computed(() => {
  const source = hasFilters.value ? allLoadedEvents.value : events.value
  return (source as Record<string, any>[]).filter((ev) => {
    const title = String(ev.name ?? ev['@id'] ?? '').toLowerCase()
    const description = String(ev.description ?? ev['dc:description'] ?? ev.plainDescriptions?.[0]?.description ?? '').toLowerCase()
    const town = String(ev.location?.town ?? ev.location?.place ?? '').toLowerCase()
    const criteriaGroups = ((ev.criteria ?? []) as any[])
      .map((c) => String(c?.groupName ?? ''))
      .join(' ')
      .toLowerCase()

    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!title.includes(q) && !description.includes(q) && !criteriaGroups.includes(q)) return false
    }
    if (filters.towns.length > 0) {
      if (!filters.towns.some((townFilter) => town.includes(String(townFilter).toLowerCase()))) return false
    }
    if (filters.groups.length > 0) {
      if (!filters.groups.some((groupFilter) => criteriaGroups.includes(String(groupFilter).toLowerCase()))) return false
    }
    if (filters.topOnly && !ev.isTopEvent) {
      return false
    }

    // Date filtering: try several common event date fields
    if (filters.startDate || filters.endDate) {
      const evDateStr = ev.date ?? ev.dateStartTimes?.[0] ?? ev.nextOccurrences?.items?.[0]?.date ?? ev.selectedEventDate?.items?.[0]?.date
      if (evDateStr) {
        const evDate = new Date(evDateStr)
        if (!isNaN(evDate.getTime())) {
          if (filters.startDate) {
            const start = new Date(filters.startDate)
            if (!isNaN(start.getTime()) && evDate < start) return false
          }
          if (filters.endDate) {
            const end = new Date(filters.endDate)
            if (!isNaN(end.getTime()) && evDate > end) return false
          }
        }
      }
    }

    return true
  })
})

const pageCount = computed(() => {
  if (hasFilters.value) {
    return Math.max(1, Math.ceil(allFilteredEvents.value.length / pageSize))
  }
  return Math.max(1, Math.ceil(totalRecords.value / pageSize))
})

const displayedEvents = computed(() => {
  if (!hasFilters.value) {
    return events.value
  }
  const start = page.value * pageSize
  const end = start + pageSize
  return allFilteredEvents.value.slice(start, end)
})

const resultCountText = computed(() => {
  const total = hasFilters.value ? allFilteredEvents.value.length : totalRecords.value
  return `${displayedEvents.value.length} of ${total} items`
})

const townOptions = computed(() => filterOptions.value?.towns ?? [])
const groupOptions = computed(() => filterOptions.value?.groups ?? [])

function onFiltersUpdate(next: { search?: string; towns?: string[]; groups?: string[]; topOnly?: boolean; startDate?: string | null; endDate?: string | null }) {
  filters.search = next.search ?? ''
  filters.towns = next.towns ?? []
  filters.groups = next.groups ?? []
  filters.topOnly = next.topOnly ?? false
  filters.startDate = next.startDate ?? null
  filters.endDate = next.endDate ?? null
}

function goToPage(newPage: number) {
  page.value = Math.max(0, Math.min(newPage, pageCount.value - 1))
}

const visiblePages = computed(() => {
  const pages: number[] = []
  const pagesBefore = 3
  const pagesAfter = 3
  const totalVisible = pagesBefore + pagesAfter + 1 // +1 for current page
  
  let start = Math.max(0, page.value - pagesBefore)
  let end = Math.min(pageCount.value - 1, page.value + pagesAfter)
  
  // If we don't have enough pages on one side, expand on the other
  if (start === 0 && end < totalVisible - 1) {
    end = Math.min(pageCount.value - 1, totalVisible - 1)
  } else if (end === pageCount.value - 1 && end - start + 1 < totalVisible) {
    start = Math.max(0, pageCount.value - totalVisible)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  // Add ellipsis and last page if needed
  if (end < pageCount.value - 1) {
    if (end < pageCount.value - 2) {
      pages.push(-1) // sentinel for ellipsis
    }
    pages.push(pageCount.value - 1)
  }
  
  return pages
})
</script>

<template>
  <div class="min-h-screen bg-cover bg-center bg-no-repeat p-8" style="background-image: url('/images/bg.jpg')">
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="rounded-2xl bg-white/60 p-6 shadow-sm border border-gray-200">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl font-semibold">Aktuelle Veranstaltungen</h2>
          </div>
          <div class="text-sm text-gray-500">
            <span v-if="pending">Loading events…</span>
            <span v-else-if="error">Error loading data.</span>
            <span v-else>{{ resultCountText }}</span>
          </div>
        </div>

        <div class="mt-4">
          <EventFilter :events="events" :towns="townOptions" :groups="groupOptions" @update="onFiltersUpdate" />
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
            <div v-if="displayedEvents.length > 0" class="grid gap-4 sm:grid-cols-3">
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
          <template v-if="!pending && !error && pageCount > 1">
            <div class="mt-4 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-4">
              <div class="flex flex-wrap items-center justify-center gap-2">
                <button
                  v-if="page > 0"
                  class="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                  @click="goToPage(page - 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M10.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L12.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z" clip-rule="evenodd" />
                    <path fill-rule="evenodd" d="M4.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L6.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z" clip-rule="evenodd" />
                  </svg>

                </button>
                <button
                  v-for="pageNum in visiblePages"
                  :key="pageNum"
                  :disabled="pageNum === -1"
                  :class="[
                    'rounded-xl border px-3 py-2 text-sm transition',
                    pageNum === page
                      ? 'border-black bg-red-500 text-white'
                      : 'border-gray-300 bg-white hover:bg-slate-100 disabled:cursor-default disabled:hover:bg-white disabled:border-gray-200',
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
                    <path fill-rule="evenodd" d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
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