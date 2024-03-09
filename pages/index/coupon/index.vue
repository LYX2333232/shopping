<template>
  <Header title="领券中心" />
  <image
    src="/static/icon/index/coupon/coupon.png"
    mode="widthFix"
    class="background"
  />
  <view class="all">
    <view v-for="coupon in couponList" :key="coupon.id" class="card tn-flex-center-start">
      <image
        :src="coupon.img"
        style="width:140rpx;height:140rpx;margin:15rpx;"
        mode="scaleToFill"
      />
      <view class="main">
        <view class="title" :style="(coupon.isSurplus || coupon.have) ? 'color:#FFC542' : 'color:#D4D1D4'">{{ coupon.title }}</view>
        <view>
          <view class="price" :style="(coupon.isSurplus || coupon.have) ? 'color:#FFC542' : 'color:#D4D1D4'">
            ￥ {{ coupon.price }}
          </view>
          <view class="info">
            满{{ coupon.threshold }}减{{ coupon.price }}
          </view>
        </view>
      </view>
      <image
        :src="coupon.have ? '/static/icon/index/coupon/done.png':coupon.isSurplus ? '/static/icon/index/coupon/todo.png' : '/static/icon/index/coupon/none.png'"
        mode="heightFix"
        class="right"
      />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'

const couponList = ref([])

// 获取优惠券列表
const getData = () => {
  // 获取优惠券列表
  const list = [
    {
      id: 0,
      img: 'https://source.unsplash.com/random',
      title: '水果干通用券',
      price: 100,
      threshold: 500,
      start_time: '8.5',
      end_time: '8.15',
      have: true,
      isSurplus: true
    },
    {
      id: 1,
      img: 'https://source.unsplash.com/random',
      title: '水果干通用券',
      price: 100,
      threshold: 500,
      start_time: '8.5',
      end_time: '8.15',
      have: false,
      isSurplus: false
    },
    {
      id: 2,
      img: 'https://source.unsplash.com/random',
      title: '水果干通用券',
      price: 100,
      threshold: 500,
      start_time: '8.5',
      end_time: '8.15',
      have: true,
      isSurplus: true
    },
    {
      id: 3,
      img: 'https://source.unsplash.com/random',
      title: '水果干通用券',
      price: 100,
      threshold: 500,
      start_time: '8.5',
      end_time: '8.15',
      have: false,
      isSurplus: false
    },
    {
      id: 4,
      img: 'https://source.unsplash.com/random',
      title: '水果干通用券',
      price: 100,
      threshold: 500,
      start_time: '8.5',
      end_time: '8.15',
      have: true,
      isSurplus: true
    },
    {
      id: 5,
      img: 'https://source.unsplash.com/random',
      title: '水果干通用券',
      price: 100,
      threshold: 500,
      start_time: '8.5',
      end_time: '8.15',
      have: true,
      isSurplus: true
    },
    {
      id: 6,
      img: 'https://source.unsplash.com/random',
      title: '水果干通用券',
      price: 100,
      threshold: 500,
      start_time: '8.5',
      end_time: '8.15',
      have: false,
      isSurplus: true
    },
    {
      id: 7,
      img: 'https://source.unsplash.com/random',
      title: '水果干通用券',
      price: 100,
      threshold: 500,
      start_time: '8.5',
      end_time: '8.15',
      have: true,
      isSurplus: true
    }
  ]
  couponList.value = list
}

onShow(() => {
  getData()
  console.log(couponList.value);
})
</script>

<style lang="scss" scoped>
.background{
  width: 100%;
  margin-top: 175rpx;
}
.all{
  margin-top: -10rpx;
  min-height: 700rpx;
  background: #F59854;
  display: flex;
  flex-direction: column;
  align-items: center;
  .card{
    position: relative;
    margin: 30rpx 0 20rpx;
    width: 90%;
    border-radius: 10rpx;
    background: #FFFFFF;
    .main{
      height: 140rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title{
        font-family: Inter, Inter;
        font-weight: 400;
        font-size: 35rpx;
        line-height: 35rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .price{
        font-family: Inter, Inter;
        font-weight: 500;
        font-size: 35rpx;
        color: #FFC542;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .info{
        font-family: Inter, Inter;
        font-weight: 400;
        font-size: 17rpx;
        color: #999999;
        line-height: 26rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
    .right{
      height: 190rpx;
      position: absolute;
      right: 0;
    }
  }
}
</style>