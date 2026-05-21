<!-- Homepage with short introduction and explaination of the site. Able to switch to events/index.vue-->
 <script setup>
</script>

<template>
  <div class="min-h-screen bg-cover bg-center bg-no-repeat p-8" style="background-image: url('/images/bg.jpg')">
  <div class="max-w-3xl mx-auto mt-20 px-4 py-16 text-center bg-white/50 rounded-2xl shadow-sm backdrop-blur pt-12">
    <h1 class="text-4xl font-bold text-slate-900 mb-6">Willkommen zu Events Kärnten!</h1>
    <p class="text-lg text-slate-700 mb-8">Entdecken Sie die vielfältigen Veranstaltungen in Kärnten auf einen Blick. Von Konzerten über Festivals bis hin zu kulturellen Highlights – hier finden Sie alle Informationen, um Ihren nächsten Ausflug zu planen.</p>
    <NuxtLink
  to="/events"
  class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 via-red-600 to-white text-slate-900 font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform"
>
  Jetzt Veranstaltungen entdecken
</NuxtLink>
  </div>
  </div>
</template>
