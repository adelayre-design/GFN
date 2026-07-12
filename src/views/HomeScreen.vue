<template>
  <div class="screen">
    <div class="home-header">
      <div class="logo-circle" v-html="ICONS.logo"></div>
      <div class="brand">GYMFIT NOTES</div>
    </div>

    <div class="section-label">Progress made</div>
    <div class="progress-box">
      {{
        store.progressLog.length
          ? store.progressLog.slice(-3).reverse().join(' • ')
          : 'Log a routine to start tracking progress.'
      }}
    </div>

    <div class="stat-row">
      <div class="stat-box">
        <div class="stat-num">{{ store.routinesFinished }}</div>
        <div class="stat-lbl">Routines<br />Finished</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">{{ store.mealsFinished }}</div>
        <div class="stat-lbl">Meals<br />Finished</div>
      </div>
    </div>

    <div class="section-label">Scheduled workout</div>
    <div class="wk-card" v-if="activePlan">
      <div class="wk-top">
        <div>
          <div class="wk-name">{{ activePlan.name }}</div>
          <div class="wk-sub">
            {{ activePlan.exercises.length }} sets of X-reps / {{ activePlan.schedule }}
            <span v-if="inProgress"> · in progress</span>
          </div>
        </div>
        <button v-if="!inProgress" class="begin-btn" @click="beginWorkout(activePlan.id)">Begin</button>
        <button v-else class="begin-btn begin-btn-finish" @click="finishWorkout(activePlan.id)">Finish</button>
      </div>
      <div v-if="inProgress" class="exercise-list">
        <div v-for="ex in activePlan.exercises" :key="ex.id" class="exercise-row">
          <span>{{ ex.name }}</span>
          <span class="exercise-sub">{{ ex.sub }}</span>
        </div>
      </div>
    </div>
    <div class="wk-card" v-else>
      <div class="empty-note">No workout scheduled yet.</div>
    </div>

    <div class="section-label">Food log</div>
    <div class="food-card" v-if="activeMeal">
      <div class="food-top">
        <div>
          <div class="food-name">{{ activeMeal.name }}</div>
          <div class="food-sub">
            {{ activeMeal.items.length }} food{{ activeMeal.items.length === 1 ? '' : 's' }} logged
            <span v-if="showFoodLog"> · expanded</span>
          </div>
        </div>
        <button v-if="!showFoodLog" class="show-btn" @click="showFoodLog = true">Show</button>
        <button v-else class="show-btn show-btn-active" @click="showFoodLog = false">Hide</button>
      </div>

      <div v-if="showFoodLog" class="food-list">
        <div v-for="item in activeMeal.items" :key="item.id" class="food-row">
          <span class="food-row-name">{{ item.qty || 1 }} {{ item.name }}</span>
          <span class="food-row-count">{{ item.kcal }} kcal</span>
        </div>
        <div class="food-actions">
          <button class="finish-food-btn" @click="finishMealLog(activeMeal.id); showFoodLog = false">Finished</button>
        </div>
      </div>
    </div>
    <div class="food-card" v-else>
      <div class="empty-note">No meal logged yet.</div>
    </div>

    <div class="spacer"></div>
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, beginWorkout, finishWorkout, finishMealLog } from '../store.js'
import { ICONS } from '../icons.js'
import BottomNav from '../components/BottomNav.vue'

const activePlan = computed(() => store.plans.find((p) => p.active) || null)

const inProgress = computed(
  () => activePlan.value && store.workoutInProgress === activePlan.value.id
)

const activeMeal = computed(() => store.meals.find((m) => m.active))
const showFoodLog = ref(false)
</script>

<style scoped>
.home-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}

.home-header .logo-circle {
  width: 32px;
  height: 32px;
  margin: 0;
}

.home-header .logo-circle :deep(svg) {
  width: 16px;
  height: 16px;
}

.home-header .brand {
  font-size: 14px;
  text-align: left;
}

.progress-box {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px 14px;
  margin-bottom: 16px;
  min-height: 46px;
  display: flex;
  align-items: center;
  color: var(--muted);
  font-size: 12px;
}

.wk-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 16px;
}

.wk-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.wk-name {
  font-weight: 700;
  font-size: 14px;
}

.wk-sub {
  font-size: 11px;
  color: var(--muted);
  margin-top: 3px;
}

.begin-btn {
  background: transparent;
  color: white;
  border: 1px solid #cfcfcf;
  border-radius: 0;
  font-size: 12px;
  padding: 10px 22px;
  cursor: pointer;
}

.begin-btn-finish {
  border-color: var(--border);
  background: rgba(255, 255, 255, 0.03);
}

.exercise-list {
  margin-top: 12px;
  border-top: 1px solid var(--border);
  padding-top: 10px;
}

.exercise-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 12px;
}

.exercise-sub {
  color: var(--muted);
}

.food-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 90px;
}

.food-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.food-name {
  font-size: 13px;
  font-weight: 700;
}

.food-sub {
  font-size: 11px;
  color: var(--muted);
  margin-top: 3px;
}

.show-btn {
  background: transparent;
  color: white;
  border: 1px solid #cfcfcf;
  border-radius: 0;
  font-size: 12px;
  padding: 10px 22px;
  cursor: pointer;
}

.show-btn-active {
  border-color: var(--border);
  background: rgba(255, 255, 255, 0.03);
}

.food-list {
  margin-top: 12px;
  border-top: 1px solid var(--border);
  padding-top: 10px;
}

.food-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 12px;
}

.food-row-name {
  font-weight: 600;
}

.food-row-count {
  color: var(--red);
  font-weight: 700;
}

.food-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.finish-food-btn {
  background: var(--green);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  padding: 7px 14px;
  cursor: pointer;
}

.spacer {
  flex: 1;
}
</style>
