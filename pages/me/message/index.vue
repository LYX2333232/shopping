<template>
  <!-- <Header :title="title" /> -->
  <view class="all">
    <view class="top">
      <view style="margin-right: 30rpx" @click="back_page">
        <TnIcon name="left" color="#834820"/>
      </view>
      消息中心
      <text v-if="haveMessage">({{ total }})</text>
      <view class="clear">
        <TnIcon name="clear" color="#834820"/>
      </view>
    </view>
    <view class="main">
      <view class="card" v-for="(item,index) in messageList" :key="index">
        <view class="tn-flex-center-start">
          <image
            :src="item.img"
            mode="scaleToFill"
            style="width: 100rpx;height: 100rpx;border-radius: 15rpx;"
          />
          <view class="text">
            <view class="title">{{ item.title }}</view>
            <view class="message">{{ item.last_message }}</view>
          </view>
        </view>
        <view class="right">
          <text class="time">{{ item.last_time }}</text>
          <view class="number" :style="item.unread > 0 ? 'visibility: visible':'visibility: hidden'">{{ item.unread }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import {onShow} from '@dcloudio/uni-app'
import Header from '@/components/header.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'

const haveMessage = ref(true)

const total = ref(10)

const title = ref('')

const messageList = ref([])

const back_page = () => {
  // 判断是否有上一页
  const pages = getCurrentPages()
  if (pages.length <= 1) {
    uni.switchTab({
      url: '/pages/me/index'
    })
    return
  }
  uni.navigateBack({
    delta:1,
  })
}

const getData = () => {
  let str = '消息中心'

  const list = [
    {
      img:'https://source.unsplash.com/random',
      title: '三只松鼠旗舰店',
      last_message: '您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货您的订单已发货',
      last_time: '10分钟前',
      unread: 1
    },
    {
      img:'https://source.unsplash.com/random',
      title: '三只松鼠旗舰店',
      last_message: '您的订单已发货',
      last_time: '10分钟前',
      unread: 1
    },
    {
      img:'https://source.unsplash.com/random',
      title: '三只松鼠旗舰店',
      last_message: '您的订单已发货',
      last_time: '昨天',
      unread: 0
    },
    {
      img:'https://source.unsplash.com/random',
      title: '三只松鼠旗舰店',
      last_message: '您的订单已发货',
      last_time: '昨天',
      unread: 0
    },
    {
      img:'https://source.unsplash.com/random',
      title: '三只松鼠旗舰店',
      last_message: '您的订单已发货',
      last_time: '前天',
      unread: 4
    },
    {
      img:'https://source.unsplash.com/random',
      title: '三只松鼠旗舰店',
      last_message: '您的订单已发货',
      last_time: '前天',
      unread: 5
    },
    {
      img:'https://source.unsplash.com/random',
      title: '三只松鼠旗舰店',
      last_message: '您的订单已发货',
      last_time: '上周',
      unread: 0
    },
    {
      img:'https://source.unsplash.com/random',
      title: '三只松鼠旗舰店',
      last_message: '您的订单已发货',
      last_time: '上个月',
      unread: 7
    },
  ]
  messageList.value = list
  // 未读消息总数
  total.value = list.reduce((prev, cur) => {
    return prev + cur.unread
  }, 0)

  // 判断是否有未读消息
  if (haveMessage.value)
    str += '(' + total.value + ')'
  title.value = str
}

onShow(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.all{
  width: 100%;
  min-height: 100vh;
}

.top{
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 35rpx;
  color: #000000;
  line-height: 41rpx;
  text-align: right;
  font-style: normal;
  text-transform: none;
  padding-top: 150rpx;
  position: fixed;
  top: 0;
  z-index: 10;
  display: flex;
  width: 100%;
  padding-left: 50rpx;
  padding-bottom: 40rpx;
  background: #F7F7F7;
  .clear{
    margin-left: 30rpx;
  }
}

.main{
  width: 100%;
  min-height: 100vh;
  margin-top: 250rpx;
  border-radius: 15rpx;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  .card{
    width: 90%;
    display: flex;
    justify-content: space-between;
    margin-top: 60rpx;
    .text{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: space-around;
      margin-left: 20rpx;
      .title{
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 27rpx;
        color: #333333;
        line-height: 31rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .message{
        font-family: PingFang SC, PingFang SC;
        font-weight: 300;
        font-size: 23rpx;
        color: #666666;
        line-height: 31rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        max-width: 400rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .right{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-end;
      .time{
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 23rpx;
        color: #999999;
        line-height: 31rpx;
        text-align: right;
        font-style: normal;
        text-transform: none;
      }
      .number{
        width: 30rpx;
        height: 30rpx;
        border-radius: 50%;
        background: #C8B697;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>