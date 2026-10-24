<template>
  <view class="page">
    <view class="card">
      <text class="card-title">源进制</text>
      <view class="base-row">
        <view
          v-for="b in bases"
          :key="'from' + b"
          class="base-item"
          :class="{ 'base-item-active': fromBase === b }"
          @click="fromBase = b"
        >
          <text>{{ b }}</text>
        </view>
      </view>
      <textarea
        v-model="input"
        class="textarea"
        :placeholder="`请输入 ${fromBase} 进制数字`"
        :maxlength="-1"
        placeholder-class="ph"
      />
    </view>

    <view class="switch-row">
      <view class="switch-btn" hover-class="switch-hover" @click="swapBase">
        <text class="switch-text">交换进制</text>
      </view>
    </view>

    <view class="card">
      <text class="card-title">目标进制</text>
      <view class="base-row">
        <view
          v-for="b in bases"
          :key="'to' + b"
          class="base-item"
          :class="{ 'base-item-active': toBase === b }"
          @click="toBase = b"
        >
          <text>{{ b }}</text>
        </view>
      </view>
      <view class="output">
        <text v-if="output" class="output-text" selectable user-select>{{ output }}</text>
        <text v-else class="output-empty-text">结果将显示在这里</text>
      </view>
      <view class="opt-row">
        <text class="link" :class="{ 'link-disabled': !output }" @click="useAsInput">转为输入</text>
        <text class="link" :class="{ 'link-disabled': !output }" @click="copyOutput">复制结果</text>
      </view>
    </view>

    <view v-if="error" class="error">{{ error }}</view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { convertBase } from '../../utils/radix'

const bases = [2, 8, 10, 16, 32, 36, 62]
const input = ref('')
const output = ref('')
const error = ref('')
const fromBase = ref(10)
const toBase = ref(2)

function run() {
  error.value = ''
  output.value = ''
  if (!input.value.trim()) return
  try {
    output.value = convertBase(input.value, fromBase.value, toBase.value)
  } catch (e) {
    error.value = e && e.message ? e.message : '转换失败'
  }
}

watch([input, fromBase, toBase], run)

function swapBase() {
  const temp = fromBase.value
  fromBase.value = toBase.value
  toBase.value = temp
  if (output.value) {
    input.value = output.value
  }
}

function useAsInput() {
  if (!output.value) return
  input.value = output.value
  fromBase.value = toBase.value
}

function copyOutput() {
  if (!output.value) return
  uni.setClipboardData({
    data: output.value,
    success: () => uni.showToast({ title: '已复制', icon: 'success' }),
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 30rpx;
  box-sizing: border-box;
  background: #f5f6fa;
}

.card {
  padding: 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(31, 35, 41, 0.06);
}

.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2329;
}

.base-row {
  margin-top: 20rpx;
  display: flex;
  flex-wrap: wrap;
}

.base-item {
  width: 84rpx;
  height: 68rpx;
  margin: 0 12rpx 12rpx 0;
  border-radius: 12rpx;
  background: #f2f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #5c626b;
}

.base-item-active {
  background: #2f6bff;
  color: #ffffff;
  font-weight: 600;
}

.textarea {
  width: 100%;
  min-height: 180rpx;
  margin-top: 20rpx;
  padding: 20rpx;
  box-sizing: border-box;
  border-radius: 16rpx;
  background: #f7f8fa;
  font-size: 28rpx;
  line-height: 1.6;
  color: #1f2329;
}

.ph {
  color: #a8adb5;
}

.switch-row {
  display: flex;
  justify-content: center;
  padding: 28rpx 0;
}

.switch-btn {
  width: 260rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #4b8cff, #2f6bff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(47, 107, 255, 0.28);
}

.switch-hover {
  transform: scale(0.97);
}

.switch-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
}

.output {
  margin-top: 20rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  background: #f7f8fa;
}

.output-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: #1f2329;
  word-break: break-all;
}

.output-empty-text {
  font-size: 26rpx;
  color: #a8adb5;
}

.opt-row {
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
}

.link {
  font-size: 26rpx;
  color: #2f6bff;
}

.link-disabled {
  color: #b6bac1;
}

.error {
  margin-top: 24rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: #d93026;
  background: rgba(217, 48, 38, 0.08);
}
</style>
