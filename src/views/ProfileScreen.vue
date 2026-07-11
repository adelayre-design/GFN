<template>
  <div class="screen">
    <div class="top-title">Profile</div>
    <hr class="divider" />

    <div class="profile-header">
      <div class="avatar" v-html="ICONS.person"></div>
      <div class="profile-name">{{ store.user.name || 'Your Name' }}</div>
    </div>

    <div class="section-label">Stats summary</div>
    <div class="stat-row">
      <div class="stat-box">
        <div class="stat-num">{{ store.routinesFinished }}</div>
        <div class="stat-lbl">Workouts<br />Finished</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">{{ store.dayStreak }}</div>
        <div class="stat-lbl">Day<br />Streak</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">{{ totalCaloriesLogged }}</div>
        <div class="stat-lbl">Calories<br />Logged</div>
      </div>
    </div>

    <div class="section-label">Body stats</div>

    <template v-if="isEditingStats">
      <div class="field"><input v-model="store.user.age" placeholder="Age" /></div>
      <div class="field"><input v-model="store.user.weight" placeholder="Weight (kg)" /></div>
      <div class="field"><input v-model="store.user.height" placeholder="Height (cm)" /></div>
      <div class="field">
        <select class="field-select" style="width: 100%;" v-model="store.user.gender">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="field">
        <select class="field-select" style="width: 100%;" v-model="store.user.goal">
          <option value="">Select a fitness goal</option>
          <option value="Lose Weight">Lose Weight</option>
          <option value="Build Muscle">Build Muscle</option>
          <option value="Maintain">Maintain</option>
          <option value="Improve Endurance">Improve Endurance</option>
        </select>
      </div>
      <button class="btn btn-red confirm-btn" @click="confirmStats">Confirm</button>
    </template>

    <template v-else>
      <div class="info-row"><span class="k">Age</span><span class="v">{{ store.user.age || '--' }}</span></div>
      <div class="info-row"><span class="k">Weight</span><span class="v">{{ store.user.weight ? store.user.weight + ' kg' : '--' }}</span></div>
      <div class="info-row"><span class="k">Height</span><span class="v">{{ store.user.height ? store.user.height + ' cm' : '--' }}</span></div>
      <div class="info-row"><span class="k">Gender</span><span class="v">{{ store.user.gender || '--' }}</span></div>
      <div class="info-row"><span class="k">Goal</span><span class="v">{{ store.user.goal || '--' }}</span></div>
      <button class="btn btn-outline edit-btn" @click="isEditingStats = true">Edit</button>
    </template>

    <div class="section-label profile-settings-label">Settings</div>
    <div class="settings-row"><span>Change password</span><span class="chev">›</span></div>
    <div class="settings-row">
      <span>Notifications</span>
      <div class="toggle" :class="{ on: store.notif }" @click="toggleNotif"><div class="knob"></div></div>
    </div>

    <div class="logout-row" @click="logout()">Log Out</div>
    <div class="spacer"></div>
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, logout, saveData } from '../store.js'
import { ICONS } from '../icons.js'
import BottomNav from '../components/BottomNav.vue'

const isEditingStats = ref(!store.user.age)

function confirmStats() {
  isEditingStats.value = false
  saveData()
}

function toggleNotif() {
  store.notif = !store.notif
  saveData()
}

const totalCaloriesLogged = computed(() =>
  store.meals.reduce((sum, meal) => sum + meal.items.reduce((s, item) => s + (item.kcal || 0), 0), 0)
)
</script>

<style scoped>
.profile-settings-label { margin-top: 20px; }
.chev { color: var(--muted); }
.spacer { flex: 1; }
.confirm-btn { margin-top: 4px; margin-bottom: 12px; }
.edit-btn { margin-top: 8px; margin-bottom: 12px; padding: 9px 0; font-size: 12px; }
</style>
