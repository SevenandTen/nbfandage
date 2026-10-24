<template>
  <view class="page">
    <view class="card">
      <view class="card-head">
        <text class="card-title">二维码内容</text>
        <text class="link" @click="pasteText">粘贴</text>
      </view>
      <textarea
        v-model="text"
        class="textarea"
        placeholder="请输入要生成二维码的文本或链接"
        :maxlength="-1"
        placeholder-class="ph"
      />
      <view class="len">共 {{ text.length }} 个字符</view>
      <button class="generate-btn" @click="generate">生成二维码</button>
    </view>

    <view class="card qrcode-card">
      <canvas
        canvas-id="qrcode"
        class="qrcode-canvas"
        :style="{ width: size + 'px', height: size + 'px' }"
      ></canvas>
      <text v-if="!hasQrcode" class="qrcode-empty">生成后显示在这里</text>
      <view v-else class="btn-row">
        <button class="btn btn-primary" size="mini" @click="saveToAlbum">保存到相册</button>
        <button class="btn" size="mini" @click="copyText">复制内容</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
import drawQrcode from 'weapp-qrcode'

const instance = getCurrentInstance()
const text = ref('')
const hasQrcode = ref(false)

const size = computed(() => {
  try {
    const info = uni.getSystemInfoSync()
    const px = Math.min(info.windowWidth, info.windowHeight) - 90
    return Math.max(200, Math.floor(px))
  } catch (e) {
    return 260
  }
})

function generate() {
  const content = (text.value || '').trim()
  if (!content) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  const ctx = uni.createCanvasContext('qrcode', instance && instance.proxy)
  if (!ctx) {
    uni.showToast({ title: '当前环境不支持绘图', icon: 'none' })
    return
  }
  try {
    drawQrcode({
      ctx,
      width: size.value,
      height: size.value,
      text: content,
      correctLevel: 2, // M
      background: '#ffffff',
      foreground: '#1f2329',
      callback: () => {
        hasQrcode.value = true
      },
    })
  } catch (e) {
    hasQrcode.value = false
    uni.showToast({ title: '生成失败', icon: 'none' })
  }
}

function saveToAlbum() {
  if (!hasQrcode.value) {
    uni.showToast({ title: '请先生成二维码', icon: 'none' })
    return
  }
  const doSave = () => {
    uni.canvasToTempFilePath(
      {
        canvasId: 'qrcode',
        success: (res) => {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => uni.showToast({ title: '已保存到相册', icon: 'success' }),
            fail: () => uni.showToast({ title: '保存失败', icon: 'none' }),
          })
        },
        fail: () => uni.showToast({ title: '导出图片失败', icon: 'none' }),
      },
      instance && instance.proxy
    )
  }

  // eslint-disable-next-line no-undef
  if (typeof wx !== 'undefined' && wx.getSetting) {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting && res.authSetting['scope.writePhotosAlbum'] === false) {
          uni.showModal({
            title: '提示',
            content: '需要相册权限，是否去设置开启？',
            success: (r) => {
              if (r.confirm) uni.openSetting()
            },
          })
        } else {
          doSave()
        }
      },
      fail: doSave,
    })
  } else {
    doSave()
  }
}

function copyText() {
  if (!text.value) return
  uni.setClipboardData({
    data: text.value,
    success: () => uni.showToast({ title: '已复制', icon: 'success' }),
  })
}

function pasteText() {
  uni.getClipboardData({
    success: (res) => {
      if (res.data) {
        text.value = res.data
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

.len {
  margin-top: 12rpx;
  text-align: right;
  font-size: 24rpx;
  color: #a8adb5;
}

.generate-btn {
  margin-top: 24rpx;
  color: #ffffff;
  background: linear-gradient(135deg, #4b8cff, #2f6bff);
  border-radius: 44rpx;
  font-size: 30rpx;
}

.qrcode-card {
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-canvas {
  margin: 0 auto;
}

.qrcode-empty {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #a8adb5;
}

.btn-row {
  margin-top: 28rpx;
  display: flex;
}

.btn {
  margin: 0 16rpx;
  font-size: 26rpx;
}

.btn-primary {
  color: #ffffff;
  background: #2f6bff;
}
</style>
