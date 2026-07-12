<template>
  <div class="modal-overlay" v-if="store.modal">
    <div class="modal-box">

      <!-- Plan editor: name + schedule + inline exercise list -->
      <template v-if="store.modal === 'plan'">
        <div class="modal-title">{{ store.planDraft.id ? 'Edit' : 'New' }} Workout Plan</div>
        <div class="field"><input v-model="store.planDraft.name" placeholder="Plan name" /></div>
        <div class="field"><input v-model="store.planDraft.schedule" placeholder="Schedule (e.g. Mon Wed)" /></div>

        <div class="section-label draft-label">Exercises</div>
        <div class="draft-list">
          <div class="empty-note" v-if="store.planDraft.exercises.length === 0">No exercises yet.</div>
          <div class="item-card draft-row" v-for="(ex, idx) in store.planDraft.exercises" :key="ex.id">
            <div class="draft-fields">
              <input class="draft-input" v-model="ex.name" placeholder="Exercise name" />
              <input class="draft-input" v-model="ex.sub" placeholder="Sets x reps (e.g. 4 x 12)" />
            </div>
            <button class="icon-btn danger" @click="store.planDraft.exercises.splice(idx, 1)">
              <span v-html="ICONS.trash"></span>
            </button>
          </div>
        </div>
        <button class="btn btn-outline add-row-btn"
          @click="store.planDraft.exercises.push({ id: Date.now(), name: '', sub: '' })">
          + Add exercise
        </button>

        <div class="modal-actions">
          <button class="btn btn-outline" @click="closeModal()">Cancel</button>
          <button class="btn btn-red" @click="savePlanDraft()">Save</button>
        </div>
      </template>

      <!-- Single exercise editor: used from the Plan Detail screen's + button -->
      <template v-if="store.modal === 'exercise'">
        <div class="modal-title">{{ store.exerciseDraft.id ? 'Edit' : 'New' }} Exercise</div>
        <div class="field"><input v-model="store.exerciseDraft.name" placeholder="Exercise name" /></div>
        <div class="field"><input v-model="store.exerciseDraft.sub" placeholder="Sets x reps" /></div>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="closeModal()">Cancel</button>
          <button class="btn btn-red" @click="saveExerciseDraft()">Save</button>
        </div>
      </template>

      <!-- Meal editor: name + schedule + inline food item list -->
      <template v-if="store.modal === 'meal'">
        <div class="modal-title">{{ store.mealDraft.id ? 'Edit' : 'New' }} Meal Plan</div>
        <div class="field"><input v-model="store.mealDraft.name" placeholder="Meal name" /></div>
        <div class="field"><input v-model="store.mealDraft.schedule" placeholder="Schedule (e.g. Tue Thu)" /></div>

        <div class="section-label draft-label">Food Items</div>
        <div class="draft-list">
          <div class="empty-note" v-if="store.mealDraft.items.length === 0">No food items yet.</div>
          <div class="item-card draft-row" v-for="(it, idx) in store.mealDraft.items" :key="it.id">
            <div class="draft-fields">
              <input class="draft-input" v-model="it.name" placeholder="Food name" />
              <div class="qty-row">
                <button class="qty-btn" type="button" @click="it.qty = Math.max(1, (Number(it.qty) || 1) - 1)"><i
                    class="fa-solid fa-minus"></i></button>
                <button class="qty-btn" type="button" @click="it.qty = Math.max(1, (Number(it.qty) || 1) + 1)"><i
                    class="fa-solid fa-plus"></i></button>
                <span class="qty-total">Total foods: {{ Number(it.qty) || 1 }}</span>
              </div>
              <input class="draft-input" v-model="it.kcal" placeholder="Calories (kcal)" />
            </div>
            <button class="icon-btn danger" @click="store.mealDraft.items.splice(idx, 1)">
              <span v-html="ICONS.trash"></span>
            </button>
          </div>
        </div>
        <button class="btn btn-outline add-row-btn"
          @click="store.mealDraft.items.push({ id: Date.now(), name: '', kcal: '', qty: 1 })">
          + Add food item
        </button>

        <div class="modal-actions">
          <button class="btn btn-outline" @click="closeModal()">Cancel</button>
          <button class="btn btn-red" @click="saveMealDraft()">Save</button>
        </div>
      </template>

      <!-- Single food item editor: used from the Meal Detail screen's + button -->
      <template v-if="store.modal === 'foodItem'">
        <div class="modal-title">{{ store.foodItemDraft.id ? 'Edit' : 'New' }} Food Item</div>
        <div class="field"><input v-model="store.foodItemDraft.name" placeholder="Food name" /></div>
        <div class="field qty-field">
          <div class="qty-row">
            <button class="qty-btn" type="button"
              @click="store.foodItemDraft.qty = Math.max(1, (Number(store.foodItemDraft.qty) || 1) - 1)"><i
                class="fa-solid fa-minus"></i></button>
            <button class="qty-btn" type="button"
              @click="store.foodItemDraft.qty = Math.max(1, (Number(store.foodItemDraft.qty) || 1) + 1)"><i
                class="fa-solid fa-plus"></i></button>
            <span class="qty-total">Total foods: {{ Number(store.foodItemDraft.qty) || 1 }}</span>
          </div>
        </div>
        <div class="field"><input v-model="store.foodItemDraft.kcal" placeholder="Calories (kcal)" /></div>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="closeModal()">Cancel</button>
          <button class="btn btn-red" @click="saveFoodItemDraft()">Save</button>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import {
  store,
  closeModal,
  savePlanDraft,
  saveExerciseDraft,
  saveMealDraft,
  saveFoodItemDraft,
} from '../store.js'
import { ICONS } from '../icons.js'
</script>

<style scoped>
.draft-label {
  margin-top: 6px;
}

.draft-list {
  max-height: 220px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.draft-row {
  align-items: flex-start;
}

.draft-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.qty-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--card-2);
  color: var(--text);
  font-weight: 700;
}

.qty-btn i {
  font-size: 12px;
  line-height: 1;
}

.qty-total {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}

.add-row-btn {
  padding: 9px 0;
  font-size: 12px;
  margin-bottom: 12px;
}
</style>
