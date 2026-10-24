<template>
  <view class="page">
    <view class="scan-btn-wrap">
      <view class="scan-btn" hover-class="scan-btn-hover" @click="startScan">
        <text class="scan-btn-icon">扫</text>
        <text class="scan-btn-text">{{ hasResult ? '继续扫描' : '开始扫描' }}</text>
      </view>
      <text class="tip">支持二维码、条形码，也可从相册选择图片识别</text>
    </view>

    <view v-if="hasResult" class="result card">
      <view class="result-head">
        <text class="result-title">扫描结果</text>
        <text class="result-type">{{ typeName }}</text>
      </view>
      <view class="result-body">
        <text class="result-text" selectable user-select>{{ result }}</text>
      </view>
      <view class="btn-row">
        <button class="btn btn-primary" size="mini" @click="copyResult">复制结果</button>
        <button class="btn" size="mini" @click="clearResult">清空</button>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">还没有扫描记录</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'

const result = ref('')
const scanType = ref('')
const hasResult = computed(() => !!result.value)

const typeName = computed(() => {
  const map = {
    QR_CODE: '二维码',
    EAN_13: 'EAN 13 条形码',
    EAN_8: 'EAN 8 条形码',
    UPC_A: 'UPC A 条形码',
    UPC_E: 'UPC E 条形码',
    CODE_39: 'CODE 39 条形码',
    CODE_128: 'CODE 128 条形码',
    ITF: 'ITF 条形码',
    AZTEC: 'Aztec 码',
    DATA_MATRIX: 'Data Matrix 码',
    PDF_417: 'PDF 417 码',
    WX_CODE: '小程序码',
  }
  return map[scanType.value] || (scanType.value ? scanType.value : '')
})

function startScan() {
  uni.scanCode({
    onlyFromCamera: false,
    scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
    success: (res) => {
      result.value = res.result || ''
      scanType.value = res.scanType || ''
      uni.vibrateShort({ type: 'light', fail: () => {} })
    },
    fail: (err) => {
      // 用户取消扫描不提示
      if (err && (err.errMsg || '').indexOf('cancel') > -1) return
      uni.showToast({ title: '扫描失败', icon: 'none' })
    },
  })
}

function copyResult() {
  uni.setClipboardData({
    data: result.value,
    success: () => uni.showToast({ title: '已复制', icon: 'success' }),
  })
}

function clearResult() {
  result.value = ''
  scanType.value = ''
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
  background: #f5f6fa;
}

.scan-btn-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0 40rpx;
}

.scan-btn {
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4b8cff, #2f6bff);
  box-shadow: 0 16rpx 40rpx rgba(47, 107, 255, 0.32);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}

.scan-btn-hover {
  transform: scale(0.95);
}

.scan-btn-icon {
  font-size: 64rpx;
  font-weight: 700;
  color: #ffffff;
}

.scan-btn-text {
  margin-top: 8rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.92);
}

.tip {
  margin-top: 32rpx;
  font-size: 24rpx;
  color: #8a8f99;
}

.card {
  padding: 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(31, 35, 41, 0.06);
}

.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2329;
}

.result-type {
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #2f6bff;
  background: rgba(47, 107, 255, 0.1);
}

.result-body {
  margin-top: 20rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  background: #f7f8fa;
}

.result-text {
  font-size: 28rpx;
  color: #1f2329;
  word-break: break-all;
  line-height: 1.6;
}

.btn-row {
  margin-top: 24rpx;
  display: flex;
}

.btn {
  margin: 0 16rpx 0 0;
  font-size: 26rpx;
}

.btn-primary {
  color: #ffffff;
  background: #2f6bff;
}

.empty {
  padding: 120rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 26rpx;
  color: #a8adb5;
}
</style>
