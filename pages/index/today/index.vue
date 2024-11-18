<template>
  <Header />
  <image
    src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQ9xr6k6haSXtWWE8Sa8PIkmraNPlm7T7vIBDgSh3UZXbzauzVR6BBINDZfH07zPRpicvTboib1icNcA/0?wx_fmt=png"
    mode="scaleToFill" class="header" />
  <image
    src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQ9xr6k6haSXtWWE8Sa8PIkCNRIjlskKtfpibZAlLyQluzAxExeBQt84n5HSjg2QKvcnAAcfOPaZ0g/0?wx_fmt=png"
    mode="scaleToFill" class="desc" />
  <view class="all">
    <view v-for="item in dataList" :key="item.id" @click="toDetail(item.id)">
      <!-- 有余量 -->
      <view class="item" v-if="true">
        <image :src="item.path" mode="scaleToFill" class="image" />
        <view class="right">
          <view class="title">
            <text style="color:#14BF20">{{ item.count }}人团</text>
            | {{ item.name }}
          </view>
          <view class="others" v-if="item.seng.length > 0">
            <image v-for="(path, index) in item.seng" :key="item.id + index" :src="path" mode="scaleToFill"
              class="avatar" />
            已有{{ item.seng.length }}人参团
          </view>
          <view class="btn">
            <view class="price">拼团到手￥{{ item.price }}</view>
            <view class="old">单买到手￥{{ item.teamwork_price }}</view>
          </view>
        </view>
      </view>
      <!-- 无余量 -->
      <view v-else class="item none">
        <image :src="item.path" mode="scaleToFill" class="image" />
        <view class="right">
          <view style="font-size:32rpx">
            {{ item.count }}人团 | {{ item.name }}
          </view>
          <view style="margin-bottom:95rpx">
            已抢光
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'

import Header from '@/components/header.vue'
import { get_today_list } from '@/api/index/today/today'
import { getRandomImage } from '@/utils/constant'

const dataList = ref([])

const toDetail = (id) => {
  uni.navigateTo({
    url: '/pages/index/today/detail/index?id=' + id
  })
}

const getData = () => {
  get_today_list(1).then(res => {
    page = 1
    dataList.value = res.data.data
  })
}

var page = 1

onShow(() => {
  getData()
})

onReachBottom(() => {
  get_today_list(++page).then(res => {
    if (res.data.data.length)
      dataList.value = dataList.value.concat(res.data.data)
    else {
      page--
      uni.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    }
  })
})
</script>

<style lang="scss" scoped>
page {
  width: 100%;
  min-height: 100vh;
}

.header {
  width: 100%;
  height: 500rpx;
  position: absolute;
  top: 0;
}

.desc {
  width: 100%;
  height: 168rpx;
  margin-top: 460rpx;
}

.all {
  position: relative;
  width: 100%;
  padding: 30rpx 20rpx;
  margin-top: -80rpx;
  background: #FFFFFF;
  border-radius: 40rpx;
  z-index: 1;
}

.item {
  display: flex;
  margin-bottom: 60rpx;
  width: 100%;
  background: #FFFFFF;

  .image {
    width: 260rpx;
    height: 260rpx;
    border-radius: 16rpx;
    margin-right: 20rpx;
  }

  .right {
    height: 260rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #0C0C0D;
    line-height: 45rpx;
    text-align: justify;
    font-style: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 10rpx;
  }

  .others {
    display: flex;
    align-items: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 22rpx;
    color: #EE2532;
    line-height: 30rpx;
    text-align: left;
    font-style: normal;

    .avatar {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      margin-left: -10rpx;
    }
  }

  .btn {
    width: 430rpx;
    height: 90rpx;
    background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQ9xr6k6haSXtWWE8Sa8PIkq0ol7b31M4iaE7n4ibhr8yvicbJRkYJc8Fe4jEDfC0NzxASjyr5lCn5lw/0?wx_fmt=png") no-repeat center center;
    background-size: 100%;
    padding: 20rpx;
    font-family: WeChat-Sans-Std, WeChat-Sans-Std;
    color: #FFFFFF;
    line-height: 31rpx;
    text-align: left;
    font-style: normal;

    .price {
      font-weight: bold;
      font-size: 28rpx;
      margin-bottom: 3rpx;
    }

    .old {
      font-size: 22rpx;
    }
  }
}

.none {
  color: #666;

  .image {
    opacity: 0.3;
  }
}
</style>