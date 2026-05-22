<!-- Homepage with short introduction and explaination of the site. Able to switch to events/index.vue-->
 <script setup>

 // current background based on time of the day (just for fun)
const currentBackground = computed (() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return '/images/kärnten_morning_2.jpg'
  if (hour >= 12 && hour < 17) return '/images/kärnten_day_2.jpg'
  if (hour >= 17 && hour < 21) return '/images/kärnten_evening.jpg'
  return '/images/kärnten_night.jpg'
})

</script>

<template>
  <div
    class="min-h-dvh bg-cover bg-center bg-no-repeat bg-fixed p-8 transition-all duration-700"
    :style="{ backgroundImage: `url(${currentBackground})` }"
  >
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

<!-- Von Autor/-in unbekannt - Eigenes Werk, basierend auf: (auf Deutsch) (<span class="mw-formatted-date" title="2003-04-23">2003-04-23</span>). "Kärtner Landessymbolegesetz (K-LSG 202) 2. Abschnitt Landeswappen §4 Aussehen". Landesgesetzblatt für Kärnten: 27., Gemeinfrei, <a href="https://commons.wikimedia.org/w/index.php?curid=765893">Link</a> -->