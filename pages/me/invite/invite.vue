<template>
  <Header title="邀请好友"></Header>
  <view class="all">
    <view class="main">
      <image src="/static/invite.png" mode="widthFix" style="width: 100%" />
      <view class="bottom">
        <view class="left">
          <view class="user">
            <image :src="user.userInfo.avatar" mode="scaleToFill"
              style="width:60rpx;height:60rpx;border-radius: 50%;" />
            <text>{{ user.userInfo.name }}</text>
          </view>
          <text class="text">邀请您加入小程序</text>
        </view>
        <image :src="QR" mode="scaleToFill" style="width:150rpx;height:150rpx;border-radius: 50%" />
      </view>
    </view>
    <view class="share">
      <view class="icon">
        <TnIcon name="wechat" size="50" color="#997D5D"></TnIcon>
        保存海报
      </view>
      <view class="icon">
        <TnIcon name="pay" size="50" color="#997D5D"></TnIcon>
        微信好友
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { get_share } from '@/api/share/share.js'
import { UserStore } from '@/store'
import Header from '@/components/header.vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'

const user = UserStore()

let baseUrl = import.meta.env.VITE_API_BASE_URL

const QR = ref()

const getData = () => {
  QR.value = baseUrl + '/share/qrcode'
  // get_share().then(res => {
  //   console.log('res', res)
  //   // QR.value = res
  //   // console.log(QR.value)
  // })
}

onShow(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.all {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background: #F7F7F7;
  padding-top: 150rpx;

  .main {
    width: 90%;
    background: #FFFFFF;
    border-radius: 30rpx;

    .bottom {
      width: 100%;
      padding: 30rpx 80rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        flex-direction: column;
        justify-content: start;

        .user {
          display: flex;
          align-items: center;
          font-family: Inter, Inter;
          font-weight: 400;
          font-size: 27rpx;
          color: #7F7F7B;
          line-height: 40rpx;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }

        .text {
          margin-top: 30rpx;
          font-family: Inter, Inter;
          font-weight: 400;
          font-size: 30rpx;
          color: #7F7F7B;
          line-height: 35rpx;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
    }
  }

  .share {
    width: 80%;
    display: flex;
    justify-content: space-around;
    margin-top: 50rpx;

    .icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: Inter, Inter;
      font-weight: 400;
      font-size: 27rpx;
      color: #7F7F7B;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>