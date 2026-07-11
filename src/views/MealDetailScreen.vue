<template>
  <div class="screen" v-if="meal">
    <div class="back-row" @click="goTo('meals')"><span v-html="ICONS.back"></span> BACK</div>
    <div class="top-title">{{ meal.name }}</div>
    <hr class="divider" />

    <div class="list-scroll">
      <div class="empty-note" v-if="meal.items.length === 0">No food items yet. Tap + to add one.</div>
      <div class="item-card" v-for="it in meal.items" :key="it.id">
        <div class="item-left">
          <div class="item-name">{{ it.name }}</div>
          <div class="item-sub">{{ it.kcal }} kcal</div>
        </div>
        <div class="item-right">
          <button class="icon-btn" @click="openFoodItemModal(it.id)" title="Edit"><span v-html="ICONS.edit"></span></button>
          <button class="icon-btn danger" @click="deleteFoodItem(it.id)" title="Delete"><span v-html="ICONS.trash"></span></button>
        </div>
      </div>
    </div>

    <button class="fab" @click="openFoodItemModal(null)">+</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { store, goTo, openFoodItemModal, deleteFoodItem } from '../store.js'
import { ICONS } from '../icons.js'

const meal = computed(() => store.meals.find((m) => m.id === store.currentMealId) || null)
</script>
