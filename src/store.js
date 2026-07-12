import { reactive } from "vue";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase.js";

export const store = reactive({
  screen: "start",
  uid: null,
  user: {
    name: "",
    email: "",
    gender: "Male",
    age: "",
    weight: "",
    height: "",
    goal: "",
  },

  routinesFinished: 0,
  mealsFinished: 0,
  caloriesLogged: 0,
  lastStatsResetAt: Date.now(),
  progressLog: [],
  workoutInProgress: null,

  planSearch: "",
  mealSearch: "",
  currentPlanId: null,
  currentMealId: null,
  nextPlanId: 2,
  nextMealId: 2,

  plans: [
    {
      id: 1,
      name: "Leg Day",
      schedule: "Mon Wed",
      active: true,
      exercises: [
        { id: 1, name: "Squats", sub: "4 x 12" },
        { id: 2, name: "Lunges", sub: "3 x 15" },
        { id: 3, name: "Leg Press", sub: "4 x 10" },
      ],
    },
  ],
  meals: [
    {
      id: 1,
      name: "Rice Meal",
      schedule: "Tue Thu",
      active: true,
      items: [
        { id: 1, name: "Rice", kcal: 200 },
        { id: 2, name: "Breast Chick & Rice", kcal: 420 },
      ],
    },
  ],

  // modal: null | 'plan' | 'exercise' | 'meal' | 'foodItem'
  modal: null,
  planDraft: null,
  exerciseDraft: null,
  mealDraft: null,
  foodItemDraft: null,
});

function snapshotForSave() {
  return {
    user: store.user,
    routinesFinished: store.routinesFinished,
    mealsFinished: store.mealsFinished,
    caloriesLogged: store.caloriesLogged,
    lastStatsResetAt: store.lastStatsResetAt,
    progressLog: store.progressLog,
    nextPlanId: store.nextPlanId,
    nextMealId: store.nextMealId,
    plans: store.plans,
    meals: store.meals,
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

function resetDailyStats() {
  store.routinesFinished = 0;
  store.mealsFinished = 0;
  store.caloriesLogged = 0;
  store.lastStatsResetAt = Date.now();
}

function ensureDailyStatsCurrent() {
  const last = Number(store.lastStatsResetAt || 0);
  if (!last || Date.now() - last >= DAY_MS) {
    resetDailyStats();
    saveData();
  }
}

let saveTimer = null;
export function saveData() {
  if (!store.uid) return;

  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    setDoc(doc(db, "users", store.uid), snapshotForSave()).catch((e) =>
      console.error("Failed to save to Firestore:", e),
    );
  }, 400);
}

export async function loadData(uid) {
  store.uid = uid;
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) {
    Object.assign(store, snap.data());
    if (typeof store.caloriesLogged !== "number") store.caloriesLogged = 0;
    if (!store.lastStatsResetAt) store.lastStatsResetAt = Date.now();
    ensureDailyStatsCurrent();
  } else {
    resetDailyStats();
    saveData();
  }
}

export function goTo(screen) {
  store.screen = screen;
}

export function beginWorkout(planId) {
  store.workoutInProgress = planId;
}
export function finishWorkout(planId) {
  ensureDailyStatsCurrent();
  const plan = store.plans.find((p) => p.id === planId);
  if (!plan) return;
  store.routinesFinished += 1;
  store.progressLog.push(`Finished ${plan.name}`);
  store.workoutInProgress = null;
  saveData();
}

export function finishMealLog(mealId) {
  ensureDailyStatsCurrent();
  const meal = store.meals.find((m) => m.id === mealId);
  if (!meal) return;
  const mealCalories = meal.items.reduce(
    (sum, item) => sum + (Number(item.kcal) || 0) * (Number(item.qty) || 1),
    0,
  );
  store.mealsFinished += 1;
  store.caloriesLogged += mealCalories;
  store.progressLog.push(`Finished meal ${meal.name}`);
  saveData();
}

setInterval(() => {
  if (!store.uid) return;
  ensureDailyStatsCurrent();
}, 60 * 1000);

export function setActivePlan(id) {
  store.plans.forEach((p) => (p.active = p.id === id ? !p.active : false));
  const stillActive = store.plans.some((p) => p.active);
  if (!stillActive) store.workoutInProgress = null;
  saveData();
}
export function deletePlan(id) {
  if (!confirm("Delete this workout plan?")) return;
  store.plans = store.plans.filter((p) => p.id !== id);
  saveData();
}
export function openPlanDetail(id) {
  store.currentPlanId = id;
  store.screen = "planDetail";
}
export function deleteExercise(exId) {
  const plan = store.plans.find((p) => p.id === store.currentPlanId);
  plan.exercises = plan.exercises.filter((e) => e.id !== exId);
  saveData();
}

export function setActiveMeal(id) {
  store.meals.forEach((m) => (m.active = m.id === id ? !m.active : false));
  saveData();
}
export function deleteMeal(id) {
  if (!confirm("Delete this meal plan?")) return;
  store.meals = store.meals.filter((m) => m.id !== id);
  saveData();
}
export function openMealDetail(id) {
  store.currentMealId = id;
  store.screen = "mealDetail";
}
export function deleteFoodItem(itemId) {
  const meal = store.meals.find((m) => m.id === store.currentMealId);
  meal.items = meal.items.filter((i) => i.id !== itemId);
  saveData();
}

export function openPlanModal(id) {
  const src =
    id != null
      ? store.plans.find((p) => p.id === id)
      : { name: "", schedule: "", exercises: [] };
  store.planDraft = {
    id: id ?? null,
    name: src.name,
    schedule: src.schedule,
    exercises: src.exercises.map((e) => ({ ...e })),
  };
  store.modal = "plan";
}
export function savePlanDraft() {
  const d = store.planDraft;
  const name = d.name.trim();
  if (!name) return;
  const cleanExercises = d.exercises
    .map((e) => ({ id: e.id, name: e.name.trim(), sub: e.sub.trim() }))
    .filter((e) => e.name);
  if (d.id != null) {
    const plan = store.plans.find((p) => p.id === d.id);
    plan.name = name;
    plan.schedule = d.schedule.trim();
    plan.exercises = cleanExercises;
  } else {
    store.plans.push({
      id: store.nextPlanId++,
      name,
      schedule: d.schedule.trim(),
      active: false,
      exercises: cleanExercises,
    });
  }
  saveData();
  closeModal();
}

export function openExerciseModal(exId) {
  const plan = store.plans.find((p) => p.id === store.currentPlanId);
  const src =
    exId != null
      ? plan.exercises.find((e) => e.id === exId)
      : { name: "", sub: "" };
  store.exerciseDraft = { id: exId ?? null, name: src.name, sub: src.sub };
  store.modal = "exercise";
}
export function saveExerciseDraft() {
  const plan = store.plans.find((p) => p.id === store.currentPlanId);
  const d = store.exerciseDraft;
  const name = d.name.trim();
  if (!name) return;
  if (d.id != null) {
    const ex = plan.exercises.find((e) => e.id === d.id);
    ex.name = name;
    ex.sub = d.sub.trim();
  } else {
    const nextId = plan.exercises.length
      ? Math.max(...plan.exercises.map((e) => e.id)) + 1
      : 1;
    plan.exercises.push({ id: nextId, name, sub: d.sub.trim() });
  }
  saveData();
  closeModal();
}

export function openMealModal(id) {
  const src =
    id != null
      ? store.meals.find((m) => m.id === id)
      : { name: "", schedule: "", items: [] };
  store.mealDraft = {
    id: id ?? null,
    name: src.name,
    schedule: src.schedule,
    items: src.items.map((i) => ({ ...i })),
  };
  store.modal = "meal";
}
export function saveMealDraft() {
  const d = store.mealDraft;
  const name = d.name.trim();
  if (!name) return;
  const cleanItems = d.items
    .map((i) => ({
      id: i.id,
      name: String(i.name).trim(),
      kcal: parseInt(i.kcal) || 0,
      qty: Math.max(1, parseInt(i.qty) || 1),
    }))
    .filter((i) => i.name);
  if (d.id != null) {
    const meal = store.meals.find((m) => m.id === d.id);
    meal.name = name;
    meal.schedule = d.schedule.trim();
    meal.items = cleanItems;
  } else {
    store.meals.push({
      id: store.nextMealId++,
      name,
      schedule: d.schedule.trim(),
      active: false,
      items: cleanItems,
    });
  }
  saveData();
  closeModal();
}

export function openFoodItemModal(itemId) {
  const meal = store.meals.find((m) => m.id === store.currentMealId);
  const src =
    itemId != null
      ? meal.items.find((i) => i.id === itemId)
      : { name: "", kcal: "", qty: 1 };
  store.foodItemDraft = {
    id: itemId ?? null,
    name: src.name,
    kcal: src.kcal,
    qty: src.qty ?? 1,
  };
  store.modal = "foodItem";
}
export function saveFoodItemDraft() {
  const meal = store.meals.find((m) => m.id === store.currentMealId);
  const d = store.foodItemDraft;
  const name = String(d.name).trim();
  if (!name) return;
  const kcal = parseInt(d.kcal) || 0;
  const qty = Math.max(1, parseInt(d.qty) || 1);
  if (d.id != null) {
    const item = meal.items.find((i) => i.id === d.id);
    item.name = name;
    item.kcal = kcal;
    item.qty = qty;
  } else {
    const nextId = meal.items.length
      ? Math.max(...meal.items.map((i) => i.id)) + 1
      : 1;
    meal.items.push({ id: nextId, name, kcal, qty });
  }
  saveData();
  closeModal();
}

export function closeModal() {
  store.modal = null;
  store.planDraft = null;
  store.exerciseDraft = null;
  store.mealDraft = null;
  store.foodItemDraft = null;
}

export function logout() {
  signOut(auth).catch(() => {});
  store.user = {
    name: "",
    email: "",
    gender: "Male",
    age: "",
    weight: "",
    height: "",
    goal: "",
  };
  store.screen = "auth";
}
