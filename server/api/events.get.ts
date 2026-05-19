export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const pageNo = Number(query.pageNo ?? query.page ?? '0')
  const pageSize = Number(query.pageSize ?? '24')

  const base = 'https://webapi.deskline.net/kaerntenevents/de/events'
  const params = new URLSearchParams({
    filterId: '',
    fields:
      'id,name,dbCode,owner,isTopEvent,visibilityLevel,date,hasMoreDates,onlineBookable,location{place,town,regions,country,coordinate{name,long,lat}},plainDescriptions(len:50){description,type},descriptions(types:[32,33]){description,type},dateStartTimes,mainCriteria{id,name,value},criteria{groupId,groupName,items{id,name,value}},eventGroups{id,name},holidayThemes{id,name,order},images(count:1,sizes:[54]){id,name,extension,copyright,author,license,urls,resolutionX,resolutionY,description},urlFriendlyName,startTimeDurations{time,weekDays,duration,},guestCards{id,name,type,hasIcon,iconUrl,webLink}',
    sortingFields: 'date,-topEvent,time',
    pageNo: String(pageNo),
    pageSize: String(pageSize),
    hashF: '0',
    limVISIBILITYLEVEL: '5',
    limExAccShSPwoPr: 'false',
  })

  const url = `${base}?${params.toString()}`
  const sessionId = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)

  try {
    return await $fetch(url, {
      headers: {
        'User-Agent': 'Nuxt/DesklineClient',
        'DW-Source': 'desklineweb',
        'DW-SessionId': sessionId,
      },
    })
  } catch (error) {
    return {
      error: true,
      message: 'Unable to fetch Deskline events. See server logs for details.',
      details: String(error),
    }
  }
})
