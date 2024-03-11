<template>
  <Header />
  <view class="title">{{ title }}</view>
  <view class="main">
    <view class="message" v-for="(message, index) in messageList" :key="index">
      <view class="time">{{ message.time }}</view>
      <view v-if="message.sender === 0" class="my">
        <view>{{ message.message }} </view>
        <image :src="avatars.my" mode="scaleToFill" />
      </view>
      <view v-else class="other">
        <image :src="avatars.other" mode="scaleToFill" />
        <view>{{ message.message }} </view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'

// 对方名称
const title = ref('三只松鼠旗舰店')

const avatars = ref({
  my: 'https://source.unsplash.com/random?1',
  other: 'https://source.unsplash.com/random?2'
})

const messageList = ref([])

// 判断两个时间点是否相差5分钟以上
const near = (time1, time2) => {
  const t1 = new Date(time1)
  const t2 = new Date(time2)
  console.log(t1 - t2)
  return Math.abs(t1 - t2) > 5 * 60 * 1000
}

const getData = () => {
  const list = [
    {
      id: 0,
      sender: 0, //0为自己，1为对方
      message: '我想问一下，你们这个产品是不是有问题啊',
      time: '16:08:00'
    },
    {
      id: 1,
      sender: 1,
      message: '嗯嗯，我们这个产品是正常的',
      time: '16:09:20'
    },
    {
      id: 2,
      sender: 0,
      message: '那为什么我这边用不了呢？',
      time: '16:50:05'
    },
    {
      id: 3,
      sender: 1,
      message: '我们这边没有出现过这个问题，你可以截图发给我们看看',
      time: '16:52:30'
    },
    {
      id: 4,
      sender: 0,
      message: '好的，我知道了',
      time: '17:00:45'
    }
  ]
  messageList.value = list
}

onLoad((e) => {
  console.log(e)
  getData()
})
</script>

<style lang="scss" scoped>
.title {
  position: fixed;
  top: 0;
  width: 100%;
  text-align: center;
  margin: 50rpx 0;
  font-size: 35rpx;
  font-weight: 700;
}

.main {
  margin-top: 20rpx;
  background: #F7F7F7;
  padding-top: 120rpx;
  min-height: 100vh;
}

.message {
  width: 720rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .time {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 27rpx;
    color: #999999;
    line-height: 31rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin: 30rpx 0;
  }

  .my {
    width: 720rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    view {
      max-width: 470rpx;
      background: #C7BAA7;
      border-radius: 23rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 27rpx;
      color: #FFFFFF;
      line-height: 40rpx;
      text-align: justified;
      font-style: normal;
      text-transform: none;
      padding: 20rpx;
    }

    image {
      margin-left: 20rpx;
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }
  }

  .other {
    width: 720rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    view {
      max-width: 470rpx;
      background: #FFFFFF;
      border-radius: 23rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 27rpx;
      color: #333333;
      line-height: 40rpx;
      text-align: justified;
      font-style: normal;
      text-transform: none;
      padding: 20rpx;
    }

    image {
      margin-right: 20rpx;
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }
  }

}
</style>