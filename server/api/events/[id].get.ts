export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const today = new Date().toISOString().split('T')[0] 

  return await $fetch(`https://webapi.deskline.net/kaerntenevents/de/events/KTN/${id}`, {
    params: {
      fields: `id,name,isTopEvent,location{place,town,coordinate{long,lat}},descriptions(types:[32,33,51]){description,type},images(count:100,sizes:[55,56,57]){id,name,urls,copyright},criteria{groupId,groupName,items{id,name,value}},nextOccurrences(fromDate:"${today}",count:365){items{date,dayOfWeek,startTime,duration},hasMoreItems},addresses(types:[32,33,34,31]){title,firstName,lastName,company,address1,city,zipCode,email,phone,url},durationType`,
      limVISIBILITYLEVEL: 5,
      limExAccShSPwoPr: false,
    },
    headers: {
      'DW-Source': 'desklineweb',
      'DW-SessionId': globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
    },
  })
})