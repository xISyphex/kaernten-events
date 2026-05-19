<!-- Homepage with short introduction and explaination of the site. Able to switch to events/index.vue-->
 <script setup>
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-16 text-center">
    <h1 class="text-4xl font-bold text-slate-900 mb-6">Willkommen zu Events Kärnten!</h1>
    <p class="text-lg text-slate-700 mb-8">Entdecken Sie die vielfältigen Veranstaltungen in Kärnten auf einen Blick. Von Konzerten über Festivals bis hin zu kulturellen Highlights – hier finden Sie alle Informationen, um Ihren nächsten Ausflug zu planen.</p>
    <button @click="navigateTo('/events')" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 via-red-600 to-white text-slate-900 font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform">
      Jetzt Veranstaltungen entdecken
    </button>
  </div>
</template>