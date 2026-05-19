let cache: { towns: string[]; groups: string[] } | null = null

export default defineEventHandler(async () => {
  if (cache) {
    return cache
  }

  const base = 'https://webapi.deskline.net/kaerntenevents/de/events'
  const fields = 'location{place,town},criteria{groupName}'
  const pageSizes = [1000, 500, 200, 100]
  const towns = new Set<string>()
  const groups = new Set<string>()

  for (const pageSize of pageSizes) {
    try {
      const firstPage = (await fetchPage(base, fields, 0, pageSize)) as Record<string, any>
      if (!firstPage?.paging || !Array.isArray(firstPage.data)) {
        continue
      }

      const pageCount = Number(firstPage.paging.pageCount ?? 1)
      collectValues(firstPage.data, towns, groups)

      for (let pageNo = 1; pageNo < pageCount; pageNo += 1) {
        const pageData = (await fetchPage(base, fields, pageNo, pageSize)) as Record<string, any>
        if (!pageData?.data) {
          break
        }
        collectValues(pageData.data, towns, groups)
      }

      cache = {
        towns: Array.from(towns).sort(),
        groups: Array.from(groups).sort(),
      }
      return cache
    } catch (error) {
      // Try a smaller page size on failure
    }
  }

  cache = { towns: [], groups: [] }
  return cache
})

async function fetchPage(base: string, fields: string, pageNo: number, pageSize: number): Promise<any> {
  const params = new URLSearchParams({
    filterId: '',
    fields,
    sortingFields: 'date,-topEvent,time',
    pageNo: String(pageNo),
    pageSize: String(pageSize),
    hashF: '0',
    limVISIBILITYLEVEL: '5',
    limExAccShSPwoPr: 'false',
  })
  const url = `${base}?${params.toString()}`
  const sessionId = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
  return await $fetch(url, {
    headers: {
      'User-Agent': 'Nuxt/DesklineClient',
      'DW-Source': 'desklineweb',
      'DW-SessionId': sessionId,
    },
  })
}

function collectValues(data: Array<Record<string, any>>, towns: Set<string>, groups: Set<string>) {
  data.forEach((event) => {
    const town = event.location?.town ?? event.location?.place
    if (town) {
      towns.add(String(town))
    }

    const rawGroups = event.criteria ?? []
    const items = Array.isArray(rawGroups) ? rawGroups : Array.from(rawGroups as Iterable<any>)
    items.forEach((group) => {
      const name = group?.groupName
      if (name) groups.add(String(name))
    })
  })
}
