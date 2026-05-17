const https = require('https');
const params = new URLSearchParams({
  filterId: '',
  fields: 'id,name,dbCode,owner,isTopEvent,visibilityLevel,date,hasMoreDates,onlineBookable,location{place,town,regions,country,coordinate{name,long,lat}},plainDescriptions(len:50){description,type},descriptions(types:[32,33]){description,type},dateStartTimes,mainCriteria{id,name,value},criteria{groupId,groupName,items{id,name,value}},eventGroups{id,name},holidayThemes{id,name,order},images(count:1,sizes:[54]){id,name,extension,copyright,author,license,urls,resolutionX,resolutionY,description},urlFriendlyName,startTimeDurations{time,weekDays,duration,},guestCards{id,name,type,hasIcon,iconUrl,webLink}',
  sortingFields: 'date,-topEvent,time',
  pageNo: '0',
  pageSize: '24',
  hashF: '0',
  limVISIBILITYLEVEL: '5',
  limExAccShSPwoPr: 'false',
});
const url = `https://webapi.deskline.net/kaerntenevents/de/events?${params}`;
console.log(url);
https.get(url, {headers: {'User-Agent': 'node-fetch'}}, (res) => {
  console.log('status:', res.statusCode);
  console.log('content-type:', res.headers['content-type']);
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('length', body.length);
    console.log(body.slice(0, 1200));
  });
}).on('error', (err) => console.error('ERROR', err));
