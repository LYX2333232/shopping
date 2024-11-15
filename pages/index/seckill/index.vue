<template>
  <Header />
  <view class="all">
    <image class="background"
      src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhS8PmdQBKx8ibh5O3dju5VYEanKbAXP1GiayrWu3KLQPtian8UECGxjfNtf7eqnlKrloxNriaAQ5AuglQ/0?wx_fmt=png"
      mode="scaleToFill" />
    <TnScrollList :indicator="false">
      <view class="tn-flex-center-start indexs">
        <view v-for="(item, index) in indexs" :key="item" @click="active_index = index">
          <view v-if="item.start < new Date()" :class="['item', 'doing', active_index === index ? 'active' : '']">
            <CountDown :time="item.end - new Date()" @finish="getIndexs" />
            <view style="margin-top: 20rpx;">
              {{ item.hour }}点{{ item.min ? '半' : '' }}场
            </view>
          </view>
          <view v-else :class="['item', 'wait', active_index === index ? 'active' : '']">
            <view>
              {{ formatTime(item.start, 'h:m') }}
            </view>
            <view style="margin-top:20rpx;">
              整点秒杀
            </view>
          </view>
        </view>
      </view>
    </TnScrollList>
    <view v-for="(item, index) in items" :key="'item' + index" class="item">
      <image :src="item.path" mode="scaleToFill" style="width:200rpx;height:160rpx" />
      <view class="right">
        <view class="item_name">{{ item.name }} </view>
        <view class="tn-flex-center-between" style="width: 400rpx">
          <view>
            <view class="tn-flex-center-start">
              <view class="item_price">
                ￥ {{ item.flash_price }}
              </view>
              <view class="item_old_price">
                原价：{{ item.price }}
              </view>
            </view>
            <view class="last">
              仅剩
              <text style="color: #834820">{{ item.last }}</text>
              件
            </view>
          </view>
          <TnButton width="140" height="60" shape="round" bg-color="#C8B697" text-color="#FFFFFF"
            @click="toBuy(item.id)">马上抢
          </TnButton>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'

import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import TnScrollList from '@tuniao/tnui-vue3-uniapp/components/scroll-list/src/scroll-list.vue'
import TnCountDown from '@tuniao/tnui-vue3-uniapp/components/count-down/src/count-down.vue'
import Header from '@/components/header.vue'
import CountDown from '@/components/CountDown'
import { get_goods_list } from '@/api/index/seckill/seckill'
import { setTime, formatTime } from '@/utils/format'

// 顶部选项框
const indexs = ref([])
const active_index = ref(0)
const getIndexs = () => {
  const list = [
    {
      start: '15 15:00',
      end: '15 20:00',
      list: []
    },
    {
      start: '16 8:00',
      end: '16 10:00',
      list: []
    },
    {
      start: '16 10:30',
      end: '16 11:00',
      list: []
    },
    {
      start: '16 11:00',
      end: '16 12:00',
      list: []
    }
  ]
  indexs.value = list.map(item => {
    const start = setTime(item.start)
    console.log(start);
    const hour = start.getHours()
    const min = start.getMinutes()
    return { ...item, hour, min, start, end: setTime(item.end) }
  })
}

// 底部的数据
const items = ref([])

// 马上抢
const toBuy = (id) => {
  uni.navigateTo({
    url: '/pages/index/seckill/detail/index?id=' + id
  })
}

const getData = () => {
  // 获取数据
  get_goods_list(1).then(res => {
    page = 1
    items.value = res.data.data
  })
}

onShow(() => {
  getIndexs()
  getData()
})

var page = 1
onReachBottom(() => {
  get_goods_list(++page).then(res => {
    if (res.data.data.length)
      items.value = items.value.concat(res.data.data)
    else {
      page--
      uni.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
    }
  })
}) 
</script>

<style lang="scss" scoped>
.all {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  padding: 340rpx 0 0;
  background: transparent;
  z-index: 0;
}

.background {
  position: fixed;
  top: 0;
  width: 750rpx;
  height: 494rpx;
  z-index: -1;
}

.indexs {
  width: 750rpx;
  background: #fd745a;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 33rpx;
  text-align: left;
  font-style: normal;
  color: #FFF;

  .item {
    padding: 20rpx 20rpx 10rpx;
  }

  .wait {
    width: 180rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .doing {
    width: 180rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .active {
    color: #14BF20;
  }
}

.item {
  width: 90%;
  margin: 20rpx auto;
  padding: 20rpx 0;
  display: flex;

  .right {
    margin-left: 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 160rpx;

    .item_name {
      font-family: Inter, Inter;
      font-weight: 500;
      font-size: 27rpx;
      color: #000000;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

    .item_price {
      font-family: Inter, Inter;
      font-weight: normal;
      font-size: 30rpx;
      color: #834820;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

    .item_old_price {
      margin-left: 25rpx;
      font-family: Inter, Inter;
      font-weight: 400;
      font-size: 20rpx;
      color: #767676;
      line-height: 35rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
      text-decoration: line-through;
    }

    .last {
      font-family: Inter, Inter;
      font-weight: 800;
      font-size: 27rpx;
      color: #000000;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>