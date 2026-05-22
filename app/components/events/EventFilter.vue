<!-- EventFilter.vue - Component for filtering events by various criteria -->
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker';

const props = defineProps<{
  towns?: string[]
  groups?: string[]
  themes?: string[]
  topOnly?: boolean
}>()
const emit = defineEmits<{
  (e: 'update', payload: { search: string; towns: string[]; groups: string[]; themes: string[]; topOnly: boolean; startDate?: string | null; endDate?: string | null }): void
}>()

const search = ref('')
const topOnly = ref(Boolean(props.topOnly))

const stagedTowns = ref<string[]>([])
const stagedGroups = ref<string[]>([])
const stagedThemes = ref<string[]>([])
const stagedStart = ref<string | null>(null)
const stagedEnd = ref<string | null>(null)
const date = ref<string | null>(null)

const appliedSearch = ref('')
const appliedTopOnly = ref(false)
const appliedTowns = ref<string[]>([])
const appliedGroups = ref<string[]>([])
const appliedThemes = ref<string[]>([])
const appliedStart = ref<string | null>(null)
const appliedEnd = ref<string | null>(null)

const filterRoot = ref<HTMLElement | null>(null)
const showTownMenu = ref(false)
const showGroupMenu = ref(false)
const showThemeMenu = ref(false)

function closeAllMenus() {
  showTownMenu.value = false
  showGroupMenu.value = false
  showThemeMenu.value = false
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

const towns = computed(() => props.towns ?? [])
const groups = computed(() => props.groups ?? [])
const themes = computed(() => props.themes ?? [])

const isApplied = computed(
  () =>
    appliedSearch.value.length > 0 ||
    appliedTopOnly.value ||
    appliedTowns.value.length > 0 ||
    appliedGroups.value.length > 0 ||
    appliedThemes.value.length > 0 ||
    Boolean(appliedStart.value) ||
    Boolean(appliedEnd.value)
)

function emitCurrent() {
  emit('update', {
    search: appliedSearch.value,
    towns: appliedTowns.value,
    groups: appliedGroups.value,
    themes: appliedThemes.value,
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

function toggleTheme(option: string) {
  const index = stagedThemes.value.indexOf(option)
  if (index >= 0) {
    stagedThemes.value.splice(index, 1)
  } else {
    stagedThemes.value.push(option)
  }
}


function applyFilters() {
  showTownMenu.value = false
  showGroupMenu.value = false
  showThemeMenu.value = false

  syncAppliedFilters()
}

function syncAppliedFilters() {
  appliedSearch.value = search.value
  appliedTopOnly.value = topOnly.value
  appliedTowns.value = [...stagedTowns.value]
  appliedGroups.value = [...stagedGroups.value]
  appliedThemes.value = [...stagedThemes.value]
  appliedStart.value = date.value?.[0] ?? null
  appliedEnd.value = date.value?.[1] ?? null

  emitCurrent()
}

function clearFilters() {
  search.value = ''
  topOnly.value = false
  stagedTowns.value = []
  stagedGroups.value = []
  stagedThemes.value = []
  stagedStart.value = null
  date.value = null
  stagedEnd.value = null
  appliedSearch.value = ''
  appliedTopOnly.value = false
  appliedTowns.value = []
  appliedGroups.value = []
  appliedThemes.value = []
  appliedStart.value = null
  appliedEnd.value = null
  showTownMenu.value = false
  showGroupMenu.value = false
  showThemeMenu.value = false
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
const themeLabel = computed(() => {
  if (stagedThemes.value.length === 0) return 'Alle Urlaubsthemen'
  return `${stagedThemes.value.length} ausgewählt`
})

const activeFilterPills = computed(() => {
  const pills: { label: string; remove: () => void }[] = []
 
  if (topOnly.value)
    pills.push({ label: 'TOP-Events', remove: () => { topOnly.value = false; syncAppliedFilters() } }) 
 
  stagedTowns.value.forEach(t =>
    pills.push({ label: t, remove: () => { toggleTown(t); syncAppliedFilters() } }))
  stagedGroups.value.forEach(g =>
    pills.push({ label: g, remove: () => { toggleGroup(g); syncAppliedFilters() } }))
  stagedThemes.value.forEach(th =>
    pills.push({ label: th, remove: () => { toggleTheme(th); syncAppliedFilters() } }))
 
  return pills
})

</script>

<template>
  <div
    ref="filterRoot"
    class="relative z-40 mt-8 w-full rounded-3xl border border-white/10 bg-white/50 backdrop-blur-md p-6"
  >
    <!-- TOP ROW -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">

      <!-- TOP EVENT -->
      <div class="lg:col-span-3">
        <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          TOP-Events
        </label>

       <fieldset class="rounded-2xl flex items-center bg-white border border-gray-300 w-64 h-12 px-4">
        <label class="flex items-center gap-3 cursor-pointer text-black w-full">
           <input
              v-model="topOnly"
              type="checkbox"
              class="toggle toggle-success transition-all duration-200"
              :class="
                topOnly
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-red-500 border-red-500 text-white'"
                />
            <span class="font-medium">
             {{ topOnly ? 'Nur TOP-Events' : 'Alle Events' }}
            </span>
        </label>
      </fieldset>
      </div>

      <!-- SEARCH -->
      <div class="lg:col-span-5">
        <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Suche
        </label>

        <div
          class="h-12 flex items-center rounded-2xl border border-gray-300 bg-white px-4"
        >
          <input
            v-model="search"
            type="search"
            placeholder="Events durchsuchen..."
            class="w-full bg-transparent outline-none text-black placeholder:text-gray-400"
          />
        </div>
      </div>

      <!-- DATE -->
      <div class="lg:col-span-4">
        <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Zeitraum
        </label>

         <ClientOnly>
    <VueDatePicker
      v-model="date"
      :placeholder="'Datum auswählen (Von - Bis)'"
      :time-config="{ enableTimePicker: false }"
      :range="{ partialRange: false }"
      class="custom-datepicker"
    />
  </ClientOnly>
      </div>
    </div>

    <!-- SECOND ROW -->
    <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 z-40">

      <!-- ORT -->
      <div class="relative">
        <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Ort
        </label>

         <button
          type="button"
          class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-black text-sm shadow-sm hover:border-slate-400"
          @click="showTownMenu = !showTownMenu; showGroupMenu = false; showThemeMenu = false"
        >
          <div class="flex items-center justify-between h-8">
            <span>{{ townLabel }}</span>
            <span class="ml-2 text-slate-400">▼</span>
          </div>
        </button>
        <div
          v-if="showTownMenu"
          class="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-gray-200 bg-white shadow-lg"
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

        <!-- dropdown -->
      </div>

      <!-- CATEGORY -->
      <div class="relative">
        <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Kategorie
        </label>

       <button
          type="button"
          class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-black text-sm shadow-sm hover:border-slate-400"
          @click="showGroupMenu = !showGroupMenu; showTownMenu = false; showThemeMenu = false"
        >
          <div class="flex items-center justify-between h-8">
            <span>{{ groupLabel }}</span>
            <span class="ml-2 text-slate-400">▼</span>
          </div>
        </button>
        <div
          v-if="showGroupMenu"
          class="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-gray-200 bg-white shadow-lg"
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

      <!-- THEMES -->
      <div class="relative">
        <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Urlaubsthema
        </label>

        <button
          type="button"
          class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-black text-sm shadow-sm hover:border-slate-400"
          @click = "showThemeMenu = !showThemeMenu; showTownMenu = false; showGroupMenu = false"
        >
          <div class="flex items-center justify-between h-8">
            <span>{{ themeLabel }}</span>
            <span class="ml-2 text-slate-400">▼</span>
          </div>
        </button>
        <div
          v-if="showThemeMenu"
          class="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-gray-200 bg-white shadow-lg"
          @click.stop
        >
          <ul class="divide-y divide-gray-100 text-sm font-medium">
            <li
              v-for="theme in themes"
              :key="theme"
              @click.stop="toggleTheme(theme)"
              class="flex items-center justify-between px-3 py-2 hover:bg-red-400 cursor-pointer"
              :class="stagedThemes.includes(theme) ? 'bg-slate-900 text-white' : 'text-slate-700'"
            >
              <span>{{ theme }}</span>
              <span v-if="stagedThemes.includes(theme)">✓</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div
      class="mt-6 flex flex-col gap-4 border-t border-gray-400 pt-5 md:flex-row md:items-center md:justify-between"
    >
      <div class="text-sm text-gray-500">
        <span v-if="isApplied" class="text-gray-700 font-bold">
          {{ activeFilterPills.length }} Filter aktiv:
          <span
            @click="pill.remove"
            v-for="(pill, index) in activeFilterPills"
            :key="index"
            class="ml-2 inline-flex items-center gap-1 rounded-full bg-gray-200 border border-blue-500 px-2 py-1 text-xs text-black-700 hover:bg-gray-300 cursor-pointer"
          >
            {{ pill.label }} 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" class="size-3">
              <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </span>
        </span>
        <span v-else>
          Keine aktiven Filter
        </span>
      </div>

      <div class="flex gap-3">
        <button
          v-if="isApplied"
          @click="clearFilters"
          class="h-12 rounded-2xl border border-gray-300 bg-white px-5 text-sm font-medium hover:bg-gray-50 text-black transition"
        >
          Zurücksetzen
        </button>

        <button
          @click="applyFilters"
          class="h-12 rounded-2xl flex flex-row gap-2 items-center bg-red-500 px-6 text-sm font-medium text-white shadow-lg transition hover:bg-red-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
            <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
          </svg>
          Filter anwenden
        </button>
      </div>
    </div>
  </div>
</template>


<style scoped>
:deep(.custom-datepicker .dp__main) {
  width: 100%;
}

:deep(.custom-datepicker .dp__input) {
  height: 48px;
  border-radius: 1rem;
  border: 1px solid rgb(209 213 219);
  font-size: 0.95rem;
}
</style>