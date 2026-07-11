<template>
  <div class="bottom-nav">
    <button class="nav-item" :class="{ active: store.screen === 'home' }" @click="goTo('home')">
      <span v-html="ICONS.navHome"></span>Home
    </button>
    <button class="nav-item" :class="{ active: store.screen === 'plans' }" @click="goTo('plans')">
      <span v-html="ICONS.navPlans"></span>Plans
    </button>
    <button class="nav-item" :class="{ active: store.screen === 'meals' }" @click="goTo('meals')">
      <span v-html="ICONS.navMeals"></span>Meals
    </button>
    <button class="nav-item" :class="{ active: store.screen === 'profile' }" @click="goTo('profile')">
      <span v-html="ICONS.person"></span>Profile
    </button>
  </div>
</template>

<script setup>
import { store, goTo } from '../store.js'
import { ICONS } from '../icons.js'
</script>
