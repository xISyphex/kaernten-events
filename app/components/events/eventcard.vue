<script setup lang="ts">
const props = defineProps<{ event: Record<string, any> }>()

const eventImage = computed(() => {
  const event = props.event
  return (
    event.images?.[0]?.urls?.[0] ??
    event.images?.[0]?.urls?.[0]?.url ??
    event.images?.[0]?.url ??
    event.imageUrl ??
    ''
  )
})

const title = computed(() => props.event.name ?? props.event['@id'] ?? 'Untitled event')
const description = computed(() => String(props.event.description ?? props.event['dc:description'] ?? props.event.plainDescriptions?.[1]?.description ?? 'No description available.'))
const duration = computed(() => {
  const d = props.event.startTimeDurations?.[0]?.duration
  return d ?? null
})
const durationText = computed(() => {
  const d = props.event.startTimeDurations?.[0]?.duration

  if (d === null || d === undefined) return ''

  if (d === 0) return 'Ganztägig'

  if (d > 24) {
    return `${d} Minuten`
  }

  return `${d} Stunden`
})
const locationText = computed(() => {
  const location = props.event.location ?? {}
  return location.place ?? location.town ?? location.region ?? location.country ?? ''
})
const eventDate = computed(() => {
  const raw = props.event.date ?? props.event.startTimes?.[0] ?? null 

  return raw ? new Date(raw) : null
})
const day = computed(() => {
  if (!eventDate.value) return ''
  return eventDate.value.getDate()
})
const month = computed(() => {
  if (!eventDate.value) return ''
  return eventDate.value.toLocaleDateString('de-AT', { month: 'long' }).toUpperCase()
})
const timeText = computed(() => {
  if (!eventDate.value) return ''
  return eventDate.value.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
<NuxtLink :to="`/events/${event.id ?? event['@id']}`" target="_blank">
  <article class="group h-full flex flex-col rounded-2xl bg-slate-50 border-2 border-gray-400 overflow-hidden shadow-lg hover:scale-[1.08] hover:shadow-lg hover:border-blue-500 hover:border-3 transition-transform">
    <div v-if="eventImage" class="relative h-48 bg-slate-200">
      <!-- Event Image-->
      <img
        :src="eventImage"
        alt="Event image"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <!-- Date badge -->
      <div class="absolute top-3 left-3 rounded-lg bg-white/70 backdrop-blur px-3 py-2 text-center shadow-md">
       <div class="text-lg font-bold text-slate-900">
        {{ day }}
      </div>
       <div class="text-sm font-semibold text-red-600">
        {{ month }}
      </div>
      </div>
      <div v-if="props.event.isTopEvent" class="absolute top-3 right-3 rounded-lg bg-red-600/90 px-2 py-1 text-xs font-bold text-white border border-white shadow-md">
        TOP Event!
      </div>

    </div>
    <div v-else class="h-48 flex items-center justify-center bg-slate-200">
      <span class="text-sm text-slate-500">Kein Bild verfügbar</span>
    </div>
    <div class="p-5 flex flex-col flex-1 gap-2">
      <h3 class="event-title text-lg font-semibold text-slate-900 group-hover:text-blue-500">{{ title }}</h3>
      <div 
        v-if="description"
        class="mt-2 mb-2 text-sm text-slate-600" v-html="description">
      </div>
      <div v-else class="mt-2 mb-2 text-sm text-slate-600 font-style italic">
        Keine Beschreibung verfügbar.
      </div>
      <div class="mt-auto flex flex-wrap gap-2 text-xs">
        <span
          v-if="timeText && timeText !== '00:00'"
          class="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 border border-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-slate-500">
            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clip-rule="evenodd" />
          </svg>
            {{ timeText }}
        </span>
        <span
          v-if="duration !== null && duration !== undefined"
          class="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 border border-gray-300"
        >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-slate-500">
          <path d="M22,6H10C8.3,6,7,4.7,7,3v0h18v0C25,4.7,23.7,6,22,6z" />
          <path d="M10,26h12c1.7,0,3,1.3,3,3v0H7v0C7,27.3,8.3,26,10,26z" />
          <path d="M23,26v-4c0-0.6-0.3-1.2-0.8-1.6l-3.7-2.8c-1.1-0.8-1.1-2.4,0-3.2l3.7-2.8c0.5-0.4,0.8-1,0.8-1.6V6" />
          <path d="M9,6v4c0,0.6,0.3,1.2,0.8,1.6l3.7,2.8c1.1,0.8,1.1,2.4,0,3.2l-3.7,2.8C9.3,20.8,9,21.4,9,22v4" />
          <polygon points="11,26 16,21 21,26" />
          <polygon points="16,12 13,10 19,10" />
        </svg>
          Dauer: {{ durationText }}
        </span>
        <span
          v-if="locationText"
          class="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 border border-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-slate-500">
            <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
          </svg>
            {{ locationText }}
        </span>
      </div>
    </div>
  </article>
  </NuxtLink>
</template>


<!--GET
	https://webapi.deskline.net/kaerntenevents/de/events/KTN/fc2d5d21-0070-4af2-ad36-fc1288c2ecdb?fields=id,active,name,dbCode,owner,copyright,author,license,urlFriendlyName,isTopEvent,visibilityLevel,location{place,townId,town,regions,country,coordinate{name,long,lat}},onlineBookable,descriptions(types:[32,33,51]){description,type},linkedAccommodations,linkedAddServices,linkedInfrastructures,images(count:100,sizes:[55,56,57]){id,name,copyright,author,license,urls,resolutionX,resolutionY,description},dynamicDescriptions(types:[]){type,name,description},links(types:[]){id,name,url,order,type},documents{id,name,order,url,nameWithExtension,extension},addresses(types:[32,33,34,31]){id,parentId,title,firstName,lastName,company,addressType,address1,address2,city,country,zipCode,email,fax,mobile,phone,url},criteria{groupId,groupName,items{id,name,value}},durationType,healthAndSecurityCriteria{groupId,groupName,image,items{id,name,value}},sustainabilityCriteria{groupId,groupName,image,items{id,name,value}},startTimeDurations{time,weekDays,duration},nextOccurrences(fromDate:"2026-5-17",count:12){items{date,dayOfWeek,startTime,duration},hasMoreItems},selectedEventDate:nextOccurrences(fromDate:"2026-5-17",count:1){items{date,dayOfWeek,startTime,duration},hasMoreItems}guestCards{id,name,type,hasIcon,iconUrl,webLink,description(fromDate:"2026-5-17")},handicapFacilities{groupId,groupName,items{id,name,value,comment,handicapGroupIds}},handicapClassifications{id,name,order,icon,image},classifications{id,name,order,url,icon,image}&limVISIBILITYLEVEL=5&limExAccShSPwoPr=false-->