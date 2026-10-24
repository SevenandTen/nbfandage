<template>
  <view class="page">
    <view class="card">
      <view class="card-head">
        <text class="card-title">待计算内容</text>
        <text class="link" @click="pasteInput">粘贴</text>
      </view>
      <textarea
        v-model="input"
        class="textarea"
        placeholder="请输入要计算摘要的文本"
        :maxlength="-1"
        placeholder-class="ph"
      />
      <view class="opt-row">
        <text class="len">共 {{ input.length }} 个字符</text>
        <text class="link" @click="input = ''">清空</text>
      </view>
    </view>

    <view class="case-row">
      <text class="case-label">输出格式</text>
      <view class="case-switch">
        <view class="case-item" :class="{ 'case-active': !upper }" @click="upper = false">
          <text>小写</text>
        </view>
        <view class="case-item" :class="{ 'case-active': upper }" @click="upper = true">
          <text>大写</text>
        </view>
      </view>
    </view>

    <view v-for="item in results" :key="item.key" class="card hash-card">
      <view class="hash-head">
        <text class="hash-name">{{ item.name }}</text>
        <text class="hash-bit">{{ item.bits }} 位</text>
      </view>
      <view class="hash-body">
        <text v-if="item.value" class="hash-value" selectable user-select>{{ item.value }}</text>
        <text v-else class="hash-empty">—</text>
      </view>
      <text class="link copy" :class="{ 'link-disabled': !item.value }" @click="copy(item)">复制</text>
    </view>

    <view class="tip">摘要算法不可逆，常用于校验数据完整性，不适合存储密码。</view>
  </view>
</template>

<script setup>
import MD5 from 'crypto-js/md5'
import SHA1 from 'crypto-js/sha1'
import SHA256 from 'crypto-js/sha256'
import SHA512 from 'crypto-js/sha512'
import Utf8 from 'crypto-js/enc-utf8'
import { computed, ref, watch } from 'vue'

const input = ref('')
const upper = ref(false)
const raw = ref({ md5: '', sha1: '', sha256: '', sha512: '' })

const algorithms = [
  { key: 'md5', name: 'MD5', bits: 32, fn: MD5 },
  { key: 'sha1', name: 'SHA-1', bits: 40, fn: SHA1 },
  { key: 'sha256', name: 'SHA-256', bits: 64, fn: SHA256 },
  { key: 'sha512', name: 'SHA-512', bits: 128, fn: SHA512 },
]

const results = computed(() =>
  algorithms.map((item) => {
    const value = raw.value[item.key] || ''
    return {
      key: item.key,
      name: item.name,
      bits: item.bits,
      value: upper.value ? value.toUpperCase() : value,
    }
  })
)

function calc() {
  if (!input.value) {
    raw.value = { md5: '', sha1: '', sha256: '', sha512: '' }
    return
  }
  const words = Utf8.parse(input.value)
  const next = {}
  algorithms.forEach((item) => {
    next[item.key] = item.fn(words).toString()
  })
  raw.value = next
}

watch(input, calc)

function copy(item) {
  if (!item.value) return
  uni.setClipboardData({
    data: item.value,
    success: () => uni.showToast({ title: `已复制 ${item.name}`, icon: 'success' }),
  })
}

function pasteInput() {
  uni.getClipboardData({
    success: (res) => {
      if (res.data) {
        input.value = res.data
      } else {
        uni.showToast({ title: '剪贴板为空', icon: 'none' })
      }
    },
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

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2329;
}

.link {
  font-size: 26rpx;
  color: #2f6bff;
}

.link-disabled {
  color: #b6bac1;
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

.opt-row {
  margin-top: 12rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.len {
  font-size: 24rpx;
  color: #a8adb5;
}

.case-row {
  margin: 30rpx 0;
  padding: 0 6rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.case-label {
  font-size: 28rpx;
  color: #5c626b;
}

.case-switch {
  display: flex;
  padding: 4rpx;
  border-radius: 28rpx;
  background: #e9ebf0;
}

.case-item {
  min-width: 120rpx;
  height: 60rpx;
  padding: 0 20rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #5c626b;
}

.case-active {
  background: #ffffff;
  color: #2f6bff;
  font-weight: 600;
}

.hash-card {
  margin-bottom: 24rpx;
}

.hash-head {
  display: flex;
  align-items: center;
}

.hash-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1f2329;
}

.hash-bit {
  margin-left: 16rpx;
  padding: 2rpx 12rpx;
  border-radius: 16rpx;
  font-size: 20rpx;
  color: #6f42ff;
  background: rgba(111, 66, 255, 0.1);
}

.hash-body {
  margin-top: 16rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  background: #f7f8fa;
}

.hash-value {
  font-size: 26rpx;
  line-height: 1.6;
  color: #1f2329;
  word-break: break-all;
}

.hash-empty {
  font-size: 26rpx;
  color: #a8adb5;
}

.copy {
  display: block;
  margin-top: 16rpx;
  text-align: right;
}

.tip {
  padding: 0 10rpx 40rpx;
  font-size: 22rpx;
  color: #a8adb5;
  line-height: 1.6;
}
</style>
