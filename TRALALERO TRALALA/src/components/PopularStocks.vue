<template>
  <div>
    <div class="flex flex-wrap justify-center gap-6 p-4">
      <router-link
        to="/stock/amzn"
        class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white w-40 sm:w-48 md:w-56 lg:w-64"
      >
        <img
          src="/images/bezosososososososos.webp"
          alt="Amazon"
          class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-fill"
        />
        <div class="p-2 text-center text-sm font-semibold text-gray-800">Amazon</div>
      </router-link>

      <router-link
        to="/stock/aapl"
        class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white w-40 sm:w-48 md:w-56 lg:w-64"
      >
        <img
          src="/images/ohiorizzapple.jpg"
          alt="Apple"
          class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-fill"
        />
        <div class="p-2 text-center text-sm font-semibold text-gray-800">Apple</div>
      </router-link>

      <router-link
        to="/stock/googl"
        class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white w-40 sm:w-48 md:w-56 lg:w-64"
      >
        <img
          src="/images/googleman.jpg"
          alt="Google"
          class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-fill"
        />
        <div class="p-2 text-center text-sm font-semibold text-gray-800">Google</div>
      </router-link>

      <router-link
        to="/stock/tsla"
        class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white w-40 sm:w-48 md:w-56 lg:w-64"
      >
        <img
          src="/images/poop.jfif"
          alt="Tesla"
          class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-fill"
        />
        <div class="p-2 text-center text-sm font-semibold text-gray-800">Tesla</div>
      </router-link>

      <router-link
        to="/stock/nvda"
        class="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 bg-white w-40 sm:w-48 md:w-56 lg:w-64"
      >
        <img
          src="/images/stupidgpu.jpg"
          alt="NVIDIA"
          class="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-fill"
        />
        <div class="p-2 text-center text-sm font-semibold text-gray-800">NVIDIA</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
