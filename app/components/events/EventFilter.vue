<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker';

const props = defineProps<{
  events?: Array<Record<string, any>>
  towns?: string[]
  groups?: string[]
  topOnly?: boolean
}>()
const emit = defineEmits<{
  (e: 'update', payload: { search: string; towns: string[]; groups: string[]; topOnly: boolean; startDate?: string | null; endDate?: string | null }): void
}>()

const search = ref('')
const topOnly = ref(Boolean(props.topOnly))

const stagedTowns = ref<string[]>([])
const stagedGroups = ref<string[]>([])
const stagedStart = ref<string | null>(null)
const stagedEnd = ref<string | null>(null)
const date = ref<string | null>(null)

const appliedSearch = ref('')
const appliedTopOnly = ref(false)
const appliedTowns = ref<string[]>([])
const appliedGroups = ref<string[]>([])
const appliedStart = ref<string | null>(null)
const appliedEnd = ref<string | null>(null)

const filterRoot = ref<HTMLElement | null>(null)
const showTownMenu = ref(false)
const showGroupMenu = ref(false)

function closeAllMenus() {
  showTownMenu.value = false
  showGroupMenu.value = false
}

const handleOutsideClick = (event: MouseEvent) => {
  if (!filterRoot.value) return
  if (!(event.target instanceof Node)) return
  if (!filterRoot.value.contains(event.target)) {
    closeAllMenus()
  }
}

onMounted(() => {
  window.addEventListener('click', handleOutsideClick, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleOutsideClick, true)
})

const towns = computed(() => {
  if (Array.isArray(props.towns) && props.towns.length) {
    return props.towns
  }
  const values = new Set<string>()
  ;(props.events || []).forEach((ev) => {
    const t = ev.location?.town ?? ev.location?.place
    if (t) values.add(String(t))
  })
  return Array.from(values).sort()
})

const groups = computed(() => {
  if (Array.isArray(props.groups) && props.groups.length) {
    return props.groups
  }
  const values = new Set<string>()
  ;(props.events || []).forEach((ev) => {
    const raw = ev.criteria ?? []
    const items = Array.isArray(raw) ? raw : Array.from(raw as Iterable<any>)

    items.forEach((c) => {
      const name = c?.groupName
      if (name) values.add(String(name))
    })
  })
  return Array.from(values).sort()
})

const isApplied = computed(
  () =>
    appliedSearch.value.length > 0 ||
    appliedTopOnly.value ||
    appliedTowns.value.length > 0 ||
    appliedGroups.value.length > 0 ||
    Boolean(appliedStart.value) ||
    Boolean(appliedEnd.value)
)

function emitCurrent() {
  emit('update', {
    search: appliedSearch.value,
    towns: appliedTowns.value,
    groups: appliedGroups.value,
    topOnly: appliedTopOnly.value,
    startDate: appliedStart.value,
    endDate: appliedEnd.value,
  })
}

onMounted(() => emitCurrent())

function toggleTown(option: string) {
  const index = stagedTowns.value.indexOf(option)
  if (index >= 0) {
    stagedTowns.value.splice(index, 1)
  } else {
    stagedTowns.value.push(option)
  }
}

function toggleGroup(option: string) {
  const index = stagedGroups.value.indexOf(option)
  if (index >= 0) {
    stagedGroups.value.splice(index, 1)
  } else {
    stagedGroups.value.push(option)
  }
}

function applyFilters() {
  console.log('Applying filters', { date: date.value })
  appliedSearch.value = search.value
  appliedTopOnly.value = topOnly.value
  appliedTowns.value = [...stagedTowns.value]
  appliedGroups.value = [...stagedGroups.value]
  appliedStart.value = date.value?.[0] ?? null
  // if (appliedStart.value) {
  //appliedStart.value.setHours(0, 0, 0, 1)
  //}
  appliedEnd.value = date.value?.[1] ?? null
  if (appliedEnd.value) {
  appliedEnd.value.setHours(23, 59, 59, 999)
  }
  showTownMenu.value = false
  showGroupMenu.value = false
  emitCurrent()
}

function clearFilters() {
  search.value = ''
  topOnly.value = false
  stagedTowns.value = []
  stagedGroups.value = []
  stagedStart.value = null
  date.value = null
  stagedEnd.value = null
  appliedSearch.value = ''
  appliedTopOnly.value = false
  appliedTowns.value = []
  appliedGroups.value = []
  appliedStart.value = null
  appliedEnd.value = null
  showTownMenu.value = false
  showGroupMenu.value = false
  emitCurrent()
}

const townLabel = computed(() => {
  if (stagedTowns.value.length === 0) return 'Alle Orte'
  return `${stagedTowns.value.length} ausgewählt`
})
const groupLabel = computed(() => {
  if (stagedGroups.value.length === 0) return 'Alle Kategorien'
  return `${stagedGroups.value.length} ausgewählt`
})
</script>

<template>
  <div class="w-full" ref="filterRoot">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <button
        type="button"
        @click="topOnly = !topOnly"
        :class="[
          'rounded-xl border px-4 py-2 text-sm font-medium transition',
          topOnly ? 'border-red-600 bg-red-600 text-white' : 'border-gray-200 bg-white text-slate-900'
        ]"
      >
        Nur TOP-Events
      </button>

      <input
        v-model="search"
        type="search"
        placeholder="Search events..."
        class="w-full sm:flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm"
      />
    </div>

    <div class="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
      <div class="relative">
        <button
          type="button"
          class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-sm shadow-sm hover:border-slate-400"
          @click="showTownMenu = !showTownMenu; showGroupMenu = false"
        >
          <div class="flex items-center justify-between">
            <span>{{ townLabel }}</span>
            <span class="ml-2 text-slate-400">▼</span>
          </div>
        </button>
        <div
          v-if="showTownMenu"
          class="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-gray-200 bg-white shadow-lg"
          @click.stop
        >
          <ul class="divide-y divide-gray-100 text-sm font-medium">
            <li
              v-for="town in towns"
              :key="town"
              @click.stop="toggleTown(town)"
              class="flex items-center justify-between px-3 py-2 hover:bg-red-400 cursor-pointer"
              :class="stagedTowns.includes(town) ? 'bg-slate-900 text-white' : 'text-slate-700'"
            >
              <span>{{ town }}</span>
              <span v-if="stagedTowns.includes(town)">✓</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="relative">
        <button
          type="button"
          class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-sm shadow-sm hover:border-slate-400"
          @click="showGroupMenu = !showGroupMenu; showTownMenu = false"
        >
          <div class="flex items-center justify-between">
            <span>{{ groupLabel }}</span>
            <span class="ml-2 text-slate-400">▼</span>
          </div>
        </button>
        <div
          v-if="showGroupMenu"
          class="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-gray-200 bg-white shadow-lg"
          @click.stop
        >
          <ul class="divide-y divide-gray-100 text-sm font-medium">
            <li
              v-for="group in groups"
              :key="group"
              @click.stop="toggleGroup(group)"
              class="flex items-center justify-between px-3 py-2 hover:bg-red-400 cursor-pointer"
              :class="stagedGroups.includes(group) ? 'bg-slate-900 text-white' : 'text-slate-700'"
            >
              <span>{{ group }}</span>
              <span v-if="stagedGroups.includes(group)">✓</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- Date Range Picker -->
      <div class="relative">
        <VueDatePicker
          v-model="date"
          :placeholder="'Datum auswählen (Von - Bis)'"
          :time-config="{ enableTimePicker: false }"
          :range="{ partialRange: false }"
          class="w-full bg-white text-sm">
        </VueDatePicker>
      </div>

      <!-- Apply and Reset filter buttons -->
      <div class="sm:col-span-3 flex justify-end mt-2 gap-2">
        <button
          type="button"
          @click="applyFilters"
          class="rounded-xl border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Filter Anwenden
        </button>
        <button
          v-if="isApplied"
          type="button"
          @click="clearFilters"
          class="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
        >
          Filter zurücksetzen
        </button>
      </div>
    </div>
  </div>
</template>
