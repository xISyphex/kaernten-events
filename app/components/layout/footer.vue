<template>
  <footer class="relative overflow-hidden text-slate-100 bg-slate-950">
    <div class="absolute inset-0"></div>
    <div class="absolute inset-0 opacity-50 bg-cover bg-center"></div>
    <div class="relative max-w-7xl mx-auto px-6 py-16 sm:px-8 lg:px-10">
      <div class="grid gap-y-12 gap-x-10 lg:grid-cols-[320px_1fr_280px]">
        <div class="space-y-6">
          <div class="flex flex-wrap items-start gap-4">
            <a href="/" class="flex items-center gap-3 text-white hover:text-yellow-300 transition">
                    <span class="relative h-10 w-12 overflow-hidden rounded-sm border border-slate-700 shadow-inner">
                        <span class="absolute inset-x-0 top-0 h-1/3 bg-yellow-400"></span>
                        <span class="absolute inset-x-0 top-1/3 h-1/3 bg-red-600"></span>
                        <span class="absolute inset-x-0 top-2/3 h-1/3 bg-white"></span>
                    </span>
                    <span class="text-lg font-semibold tracking-tight">Events Kärnten</span>
                </a>
          </div>
          <div class="space-y-2 text-sm text-slate-300">
            <p>Eine einfache Website für Veranstaltungen in Kärnten.</p>
            <p class="font-medium text-slate-100">Für die Bewerbung an die pixelpoint multimedia werbe GmbH</p>
          </div>
          <div class="text-xs uppercase tracking-[0.25em] text-slate-500">© 2026 KTN Eventserver Codingchallenge</div>
        </div>

        <div class="space-y-4 sm:pr-4">
          <h2 class="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">Kärnten Werbung</h2>
          <div class="space-y-2 text-base text-slate-100">
            <p>Völkermarkter Ring 21- 23</p>
            <p>9020 Klagenfurt, Österreich</p>
            <p>Tel: +43 463 3000</p>
            <p>E-Mail: info@kaernten.at</p>
          </div>
        </div>

        <div class="space-y-4">
          <h2 class="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">Kontakt &amp; Informationen</h2>
          <ul class="space-y-3 text-sm text-slate-300">
            <li><a href="https://www.kaernten.at/service/impressum/" class="underline hover:text-yellow-300 transition">Impressum</a></li>
            <li><a href="https://www.kaernten.at/service/datenschutz/" class="underline hover:text-yellow-300 transition">Datenschutz</a></li>
            <li><a href="https://www.kaernten.at/service/nutzungsbedingungen/" class="underline hover:text-yellow-300 transition">Nutzungsbedingungen</a></li>
            <li><a href="https://www.kaernten.at/service/barrierefreiheitserklaerung/" class="underline hover:text-yellow-300 transition">Barrierefreiheitserklärung</a></li>

          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
