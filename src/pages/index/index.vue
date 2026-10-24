<template>
  <view class="page">
    <view class="header">
      <text class="header-title">工具箱</text>
      <text class="header-sub">扫码 / 二维码 / Base64 转换</text>
    </view>

    <view class="grid">
      <view
        v-for="item in menus"
        :key="item.url"
        class="card"
        hover-class="card-hover"
        hover-stay-time="80"
        @click="go(item.url)"
      >
        <view class="icon" :class="item.iconClass">
          <text class="icon-text">{{ item.icon }}</text>
        </view>
        <text class="card-title">{{ item.title }}</text>
        <text class="card-desc">{{ item.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const menus = [
  {
    icon: '扫',
    iconClass: 'icon-blue',
    title: '扫码识别',
    desc: '识别二维码 / 条形码',
    url: '/pages/scan/index',
  },
  {
    icon: '码',
    iconClass: 'icon-purple',
    title: '生成二维码',
    desc: '文本转二维码并保存',
    url: '/pages/qrcode/index',
  },
  {
    icon: '解',
    iconClass: 'icon-orange',
    title: 'Base64 解码',
    desc: 'Base64 转原始文本',
    url: '/pages/base64/index?type=decode',
  },
  {
    icon: '密',
    iconClass: 'icon-green',
    title: 'Base64 加密',
    desc: '文本转 Base64',
    url: '/pages/base64/index?type=encode',
  },
  {
    icon: '进',
    iconClass: 'icon-cyan',
    title: '进制转换',
    desc: '2/8/10/16/32/36/62 进制',
    url: '/pages/radix/index',
  },
  {
    icon: 'U',
    iconClass: 'icon-pink',
    title: 'URL 编码',
    desc: 'URL 编码与解码',
    url: '/pages/url/index',
  },
  {
    icon: '摘',
    iconClass: 'icon-red',
    title: 'MD5 / SHA',
    desc: 'MD5、SHA-1/256/512 摘要',
    url: '/pages/hash/index',
  },
]

function go(url) {
  uni.navigateTo({ url })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
  background: #f5f6fa;
}

.header {
  padding: 30rpx 10rpx 40rpx;
}

.header-title {
  display: block;
  font-size: 46rpx;
  font-weight: 700;
  color: #1f2329;
}

.header-sub {
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #8a8f99;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.card {
  width: 330rpx;
  margin-bottom: 30rpx;
  padding: 36rpx 28rpx 32rpx;
  box-sizing: border-box;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(31, 35, 41, 0.06);
  transition: transform 0.15s ease;
}

.card-hover {
  transform: scale(0.97);
  background: #fafbfc;
}

.icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
}

.icon-blue {
  background: linear-gradient(135deg, #4b8cff, #2f6bff);
}

.icon-purple {
  background: linear-gradient(135deg, #9b6bff, #6f42ff);
}

.icon-orange {
  background: linear-gradient(135deg, #ffab5b, #ff7a2f);
}

.icon-green {
  background: linear-gradient(135deg, #4fd18b, #12b76a);
}

.icon-cyan {
  background: linear-gradient(135deg, #37c8d8, #0bb5c9);
}

.icon-pink {
  background: linear-gradient(135deg, #ff8fb1, #f5568b);
}

.icon-red {
  background: linear-gradient(135deg, #ff8a6b, #f2542d);
}

.card-title {
  display: block;
  margin-top: 24rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2329;
}

.card-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #8a8f99;
}
</style>
