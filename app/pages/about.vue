<template>
  <div
    class="min-h-dvh bg-cover bg-center bg-no-repeat bg-fixed p-8 transition-all duration-700"
    :style="{ backgroundImage: `url(/images/about.jpg)` }"
  >
    <div class="max-w-4xl rounded mx-auto bg-white p-10 shadow-sm border border-gray-200">
      <!-- Pin needle -->
      <div class="absolute left-1/2 -translate-x-1/2 -top-2 z-10 flex flex-col items-center">
        <!-- Pin head -->
        <div class="w-5 h-5 rounded-full bg-red-500 shadow-md border-2 border-red-700"
             style="box-shadow: inset -2px -2px 4px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.4);">
        </div>
        <!-- Pin needle -->
        <div class="w-0.5 h-6 bg-gradient-to-b from-gray-400 to-gray-600"
             style="box-shadow: 1px 0 1px rgba(0,0,0,0.2);">
        </div>
      </div>
      <p class="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">
        About this project
      </p>

      <h1 class="text-2xl font-semibold text-slate-900 mb-4">
        Veranstaltungen Kärnten
      </h1>

      <p class="text-slate-600 leading-relaxed mb-4">
        Diese Website wurde für die 'pixelpoint multimedia werbe GmbH' als Teil einer Jobbewerbung erstellt. Ein kleines aber funktionales Demo, das meinen Ansatz bei der Frontend-Entwicklung, Datenpräsentation und Benutzererfahrung zeigt.
      </p>

      <p class="text-slate-600 leading-relaxed mb-8">
        Sie zeigt Veranstaltungen aus Kärnten, Österreich, und zeigt sie in einer sauberen, zugänglichen Oberfläche an. Das Ziel war es, etwas wirkliches und nützliches innerhalb einer kurzen Zeitspanne zu erstellen.
      </p>

      <div class="border-t border-gray-100 pt-6 flex flex-col gap-2">
        <div class="flex items-center gap-3 text-sm text-slate-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          Focused on Kärnten, Austria
        </div>
        <div class="flex items-center gap-3 text-sm text-slate-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
          Built as a job application demo
        </div>
        <div class="flex items-center gap-3 text-sm text-slate-500">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
          <path fill-rule="evenodd" d="M17.834 6.166a8.25 8.25 0 1 0 0 11.668.75.75 0 0 1 1.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0 1 21.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 1 1-.82-6.26V8.25a.75.75 0 0 1 1.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 0 0-2.416-5.834ZM15.75 12a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0Z" clip-rule="evenodd" />
        </svg>

          svenbluem@outlook.com
        </div>
         <div class="flex items-center gap-3 text-sm text-slate-500">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
        </svg>
          <a href="https://github.com/xISyphex/kaernten-events.git" class="text-blue-500 hover:underline">
            GitHub Repository 
          </a>
        </div>
      </div>
    </div>
  </div>
</template>