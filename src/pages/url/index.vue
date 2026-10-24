<template>
  <view class="page">
    <view class="tabs">
      <view class="tab" :class="{ 'tab-active': mode === 'encode' }" @click="switchMode('encode')">
        <text>URL 编码</text>
      </view>
      <view class="tab" :class="{ 'tab-active': mode === 'decode' }" @click="switchMode('decode')">
        <text>URL 解码</text>
      </view>
    </view>

    <view class="card">
      <view class="card-head">
        <text class="card-title">{{ mode === 'encode' ? '原始内容' : '已编码内容' }}</text>
        <text class="link" @click="pasteInput">粘贴</text>
      </view>
      <textarea
        v-model="input"
        class="textarea"
        :placeholder="inputPlaceholder"
        :maxlength="-1"
        placeholder-class="ph"
      />
      <text class="link clear" @click="input = ''">清空</text>
    </view>

    <view class="switch-row">
      <view class="arrow-box" hover-class="arrow-hover" @click="doConvert">
        <text class="arrow-text">{{ mode === 'encode' ? '编码' : '解码' }}</text>
      </view>
      <text class="switch-hint" @click="swap">交换输入/输出</text>
    </view>

    <view class="card">
      <view class="card-head">
        <text class="card-title">{{ mode === 'encode' ? '编码结果' : '解码结果' }}</text>
      </view>
      <view v-if="output" class="output">
        <text class="output-text" selectable user-select>{{ output }}</text>
      </view>
      <view v-else class="output">
        <text class="output-empty-text">结果将显示在这里</text>
      </view>
      <button class="copy-btn" size="mini" :disabled="!output" @click="copyOutput">复制结果</button>
    </view>

    <view v-if="error" class="error">{{ error }}</view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

const mode = ref('encode')
const input = ref('')
const output = ref('')
const error = ref('')

const inputPlaceholder = computed(() =>
  mode.value === 'encode' ? '请输入要编码的文本或链接' : '请输入要解码的 URL 编码字符串'
)

onLoad((options) => {
  if (options && options.type === 'decode') {
    mode.value = 'decode'
  }
})

function switchMode(next) {
  if (mode.value === next) return
  mode.value = next
  error.value = ''
  const oldInput = input.value
  const oldOutput = output.value
  input.value = oldOutput || oldInput
  output.value = ''
}

function doConvert() {
  error.value = ''
  if (!input.value) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  try {
    output.value = mode.value === 'encode' ? encodeURIComponent(input.value) : decodeURIComponent(input.value)
  } catch (e) {
    output.value = ''
    error.value = '解码失败，请检查是否为合法的 URL 编码字符串'
  }
}

function swap() {
  const old = input.value
  input.value = output.value
  output.value = old
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  error.value = ''
}

function copyOutput() {
  if (!output.value) return
  uni.setClipboardData({
    data: output.value,
    success: () => uni.showToast({ title: '已复制', icon: 'success' }),
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

.tabs {
  display: flex;
  padding: 6rpx;
  margin-bottom: 30rpx;
  border-radius: 16rpx;
  background: #e9ebf0;
}

.tab {
  flex: 1;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #5c626b;
}

.tab-active {
  background: #ffffff;
  color: #2f6bff;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(31, 35, 41, 0.08);
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

.clear {
  display: block;
  margin-top: 12rpx;
  text-align: right;
}

.textarea {
  width: 100%;
  min-height: 200rpx;
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
  flex-direction: column;
  align-items: center;
  padding: 28rpx 0;
}

.arrow-box {
  width: 260rpx;
  height: 84rpx;
  border-radius: 42rpx;
  background: linear-gradient(135deg, #4b8cff, #2f6bff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(47, 107, 255, 0.28);
}

.arrow-hover {
  transform: scale(0.97);
}

.arrow-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #ffffff;
}

.switch-hint {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #8a8f99;
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

.copy-btn {
  margin-top: 20rpx;
  font-size: 26rpx;
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
