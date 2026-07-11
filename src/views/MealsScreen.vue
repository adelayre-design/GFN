<template>
  <div class="screen">
    <div class="top-title">Meal Plans</div>
    <hr class="divider" />

    <div class="search-field">
      <span v-html="ICONS.search"></span>
      <input v-model="store.mealSearch" placeholder="Search Meals" />
    </div>

    <div class="list-scroll">
      <div class="empty-note" v-if="filteredMeals.length === 0">No meals found. Tap + to add one.</div>
      <div class="item-card" v-for="m in filteredMeals" :key="m.id">
        <div class="item-left" @click="openMealDetail(m.id)">
          <div class="item-name">{{ m.name }}</div>
          <div class="item-sub">{{ m.schedule }}</div>
        </div>
        <div class="item-right">
          <div class="toggle" :class="{ on: m.active }" @click="setActiveMeal(m.id)"><div class="knob"></div></div>
          <button class="icon-btn" @click="openMealModal(m.id)" title="Edit"><span v-html="ICONS.edit"></span></button>
          <button class="icon-btn danger" @click="deleteMeal(m.id)" title="Delete"><span v-html="ICONS.trash"></span></button>
        </div>
      </div>
    </div>

    <button class="fab" @click="openMealModal(null)">+</button>
    <BottomNav />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, setActiveMeal, deleteMeal, openMealModal, openMealDetail } from '../store.js'
import { ICONS } from '../icons.js'
import BottomNav from '../components/BottomNav.vue'

const filteredMeals = computed(() => {
  const q = store.mealSearch.toLowerCase()
  return store.meals.filter((m) => m.name.toLowerCase().includes(q))
})
</script>
