<template>
  <div class="screen">
    <div class="top-title">Workout Plans</div>
    <hr class="divider" />

    <div class="search-field">
      <span v-html="ICONS.search"></span>
      <input v-model="store.planSearch" placeholder="Search Plans" />
    </div>

    <div class="list-scroll">
      <div class="empty-note" v-if="filteredPlans.length === 0">No plans found. Tap + to add one.</div>
      <div class="item-card" v-for="p in filteredPlans" :key="p.id">
        <div class="item-left" @click="openPlanDetail(p.id)">
          <div class="item-name">{{ p.name }}</div>
          <div class="item-sub">{{ p.schedule }}</div>
        </div>
        <div class="item-right">
          <div class="toggle" :class="{ on: p.active }" @click="setActivePlan(p.id)">
            <div class="knob"></div>
          </div>
          <button class="icon-btn" @click="openPlanModal(p.id)" title="Edit"><span v-html="ICONS.edit"></span></button>
          <button class="icon-btn danger" @click="deletePlan(p.id)" title="Delete"><span
              v-html="ICONS.trash"></span></button>
        </div>
      </div>
    </div>

    <button class="fab" @click="openPlanModal(null)">+</button>
    <BottomNav />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, setActivePlan, deletePlan, openPlanModal, openPlanDetail } from '../store.js'
import { ICONS } from '../icons.js'
import BottomNav from '../components/BottomNav.vue'

const filteredPlans = computed(() => {
  const q = store.planSearch.toLowerCase()
  return store.plans.filter((p) => p.name.toLowerCase().includes(q))
})
</script>
