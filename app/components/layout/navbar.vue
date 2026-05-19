<template>
    <nav class="bg-slate-950 h-24 shadow sticky top-0 z-50 border-b border-slate-800">
        <div class="h-1 w-full bg-gradient-to-r from-yellow-400 via-red-600 to-white"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="relative flex items-center h-20">
                <a href="/" class="flex items-center gap-3 text-white hover:text-yellow-300 transition">
                    <span class="relative h-10 w-12 overflow-hidden rounded-sm border border-slate-700 shadow-inner">
                        <span class="absolute inset-x-0 top-0 h-1/3 bg-yellow-400"></span>
                        <span class="absolute inset-x-0 top-1/3 h-1/3 bg-red-600"></span>
                        <span class="absolute inset-x-0 top-2/3 h-1/3 bg-white"></span>
                    </span>
                    <span class="text-lg font-semibold tracking-tight">Events Kärnten</span>
                </a>
                <div class="hidden sm:ml-12 sm:flex sm:space-x-8">
                    <a href="/" class="inline-flex items-center px-3 py-2 text-sm font-bold text-slate-300 hover:text-white hover:border-b-2 hover:border-yellow-400 transition">Home</a>
                    <a href="/events" class="inline-flex items-center px-3 py-2 text-sm font-bold text-slate-300 hover:text-white hover:border-b-2 hover:border-red-500 transition">Events</a>
                    <a href="/about" class="inline-flex items-center px-3 py-2 text-sm font-bold text-slate-300 hover:text-white hover:border-b-2 hover:border-white transition">About</a>
                </div>
            </div>
        </div>
    </nav>
</template>