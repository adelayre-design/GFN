<script setup>
import { ref, computed } from 'vue'
import { goTo } from '../store.js'

const newPassword = ref('')
const repeatPassword = ref('')
const showNew = ref(false)
const showRepeat = ref(false)
const error = ref('')
const success = ref(false)

const digitCount = computed(() => (newPassword.value.match(/\d/g) || []).length)

const strength = computed(() => {
    let score = 0
    if (newPassword.value.length >= 8) score++
    if (digitCount.value >= 2) score++
    if (newPassword.value.length >= 12) score++
    if (/[A-Z]/.test(newPassword.value) && /[a-z]/.test(newPassword.value)) score++
    return score // 0-4
})

const strengthColor = computed(() => {
    if (strength.value <= 1) return '#E8503A'
    if (strength.value === 2) return '#F2A93B'
    return '#2FD97A'
})

function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'
    let pwd = ''
    for (let i = 0; i < 14; i++) {
        pwd += chars[Math.floor(Math.random() * chars.length)]
    }
    newPassword.value = pwd
    repeatPassword.value = pwd
    showNew.value = true
    showRepeat.value = true
}

function handleConfirm() {
    error.value = ''
    if (newPassword.value.length < 8 || digitCount.value < 2) {
        error.value = 'Password must be at least 8 characters and include at least 2 numbers.'
        return
    }
    if (newPassword.value !== repeatPassword.value) {
        error.value = 'Passwords do not match.'
        return
    }

    // TODO: hook up to your auth change-password call (e.g. Firebase updatePassword)
    success.value = true
    setTimeout(() => goTo('profile'), 900)
}
</script>

<template>
    <div class="cp-screen">
        <div class="cp-header">
            <button class="cp-back-btn" @click="goTo('profile')">←</button>
            <h1 class="cp-title">Change Password</h1>
        </div>

        <p class="cp-sub">Make sure to save your password in a password manager!</p>

        <div class="cp-field">
            <label class="cp-label">New Password</label>
            <div class="cp-input-wrap">
                <input class="cp-input" :type="showNew ? 'text' : 'password'" v-model="newPassword"
                    placeholder="Enter new password" />
                <button class="cp-eye-btn" @click="showNew = !showNew">{{ showNew ? '🙈' : '👁' }}</button>
            </div>
            <div class="cp-strength-bar">
                <div v-for="n in 4" :key="n" class="cp-strength-seg"
                    :style="{ background: n <= strength ? strengthColor : 'rgba(255,255,255,0.08)' }"></div>
            </div>
        </div>

        <p class="cp-hint">At least 8 characters and at least 2 numbers</p>

        <div class="cp-field">
            <label class="cp-label">Repeat New Password</label>
            <div class="cp-input-wrap">
                <input class="cp-input" :type="showRepeat ? 'text' : 'password'" v-model="repeatPassword"
                    placeholder="Repeat new password" />
                <button class="cp-eye-btn" @click="showRepeat = !showRepeat">{{ showRepeat ? '🙈' : '👁' }}</button>
            </div>
        </div>

        <p v-if="error" class="cp-error-msg">{{ error }}</p>
        <p v-if="success" class="cp-success-msg">Password updated!</p>

        <button class="cp-confirm-btn" @click="handleConfirm">Confirm</button>

        <button class="cp-generate-link" @click="generatePassword">Generate a Secure Password for Me
            (recommended!)</button>
    </div>
</template>

<style scoped>
.cp-screen {
    flex: 1;
    min-height: 100%;
    background: linear-gradient(180deg, #0D0F14 0%, #0D0F14 72%, #090A0E 100%);
    color: #FFFFFF;
    padding: 24px 20px 40px;
    font-family: 'Inter', sans-serif;
}

.cp-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
}

.cp-back-btn {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.cp-back-btn:hover {
    background: rgba(255, 255, 255, 0.12);
}

.cp-title {
    font-size: 1.4rem;
    font-weight: 700;
}

.cp-sub {
    color: #8B93A7;
    font-size: 13px;
    margin: 8px 0 24px;
    line-height: 1.5;
}

.cp-field {
    display: flex;
    flex-direction: column;
    margin-bottom: 22px;
}

.cp-label {
    display: block;
    width: 100%;
    font-size: 13px;
    font-weight: 600;
    color: #C7CCDA;
    margin-bottom: 8px;
}

.cp-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
}

.cp-input {
    width: 100%;
    background: #161920;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 12px 42px 12px 14px;
    color: #FFFFFF;
    font-size: 14px;
    outline: none;
    transition: border-color .2s;
}

.cp-input::placeholder {
    color: #565D6E;
}

.cp-input:focus {
    border-color: #E8503A;
}

.cp-eye-btn {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 15px;
    opacity: 0.7;
    color: #C7CCDA;
}

.cp-eye-btn:hover {
    opacity: 1;
}

.cp-strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 10px;
}

.cp-strength-seg {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    transition: background .25s;
}

.cp-hint {
    font-size: 11px;
    color: #6C7385;
    margin: -10px 0 22px;
}

.cp-error-msg {
    color: #E8503A;
    font-size: 12px;
    margin-bottom: 14px;
}

.cp-success-msg {
    color: #2FD97A;
    font-size: 12px;
    margin-bottom: 14px;
}

.cp-confirm-btn {
    width: 100%;
    background: #E8503A;
    color: #FFFFFF;
    border: none;
    border-radius: 10px;
    padding: 14px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background .2s;
    margin-top: 6px;
}

.cp-confirm-btn:hover {
    background: #f0654f;
}

.cp-generate-link {
    display: block;
    width: 100%;
    background: none;
    border: none;
    color: #5B8CFF;
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    margin-top: 18px;
    cursor: pointer;
}

.cp-generate-link:hover {
    text-decoration: underline;
}
</style>