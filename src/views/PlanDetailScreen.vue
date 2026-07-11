<template>
  <div class="screen" v-if="plan">
    <div class="back-row" @click="goTo('plans')"><span v-html="ICONS.back"></span> BACK</div>
    <div class="top-title">{{ plan.name }}</div>
    <hr class="divider" />

    <div class="list-scroll">
      <div class="empty-note" v-if="plan.exercises.length === 0">No exercises yet. Tap + to add one.</div>
      <div class="item-card" v-for="ex in plan.exercises" :key="ex.id">
        <div class="item-left">
          <div class="item-name">{{ ex.name }}</div>
          <div class="item-sub">{{ ex.sub }}</div>
        </div>
        <div class="item-right">
          <button class="icon-btn" @click="openExerciseModal(ex.id)" title="Edit"><span v-html="ICONS.edit"></span></button>
          <button class="icon-btn danger" @click="deleteExercise(ex.id)" title="Delete"><span v-html="ICONS.trash"></span></button>
        </div>
      </div>
    </div>

    <button class="fab" @click="openExerciseModal(null)">+</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, goTo, openExerciseModal, deleteExercise } from '../store.js'
import { ICONS } from '../icons.js'

const plan = computed(() => store.plans.find((p) => p.id === store.currentPlanId) || null)
</script>
