<template>
  <Header />
  <view class="all">
    <image class="background"
      src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhS8PmdQBKx8ibh5O3dju5VYEanKbAXP1GiayrWu3KLQPtian8UECGxjfNtf7eqnlKrloxNriaAQ5AuglQ/0?wx_fmt=png"
      mode="scaleToFill" />
    <TnScrollList :indicator="false">
      <view style="height: 180rpx">
        <view class="tn-flex-center-start indexs">
          <view style="height:100%;overflow:visible" v-for="(item, index) in indexs" :key="index"
            @click="active_index = index">
            <view v-if="item.start < new Date()" :class="['item', 'doing', active_index === index ? 'active' : '']">
              <image v-if="active_index === index"
                src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhShtTUhH934Jtia8VR1p39plXzlB1BtEQqSLFsiabWVMMHjdgb8Wvxyn5xt5rBADdvYVfZ3U2Nm8F7g/0?wx_fmt=png"
                class="image" mode="scaleToFill" />
              <CountDown :time="item.end - new Date()" @finish="getIndexs"
                :textColor="active_index === index ? '#FFF' : '#EE2532'"
                :background="active_index === index ? '#14BF20' : '#FFF'" />
              <view style="margin-top: 20rpx;">
                {{ item.hour }}点{{ item.min ? '半' : '' }}场
              </view>
            </view>
            <view v-else :class="['item', 'wait', active_index === index ? 'active' : '']">
              <image v-if="active_index === index"
                src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhShtTUhH934Jtia8VR1p39plXzlB1BtEQqSLFsiabWVMMHjdgb8Wvxyn5xt5rBADdvYVfZ3U2Nm8F7g/0?wx_fmt=png"
                class="image" mode="scaleToFill" />
              <view>
                {{ formatTime(item.start, 'h:m') }}
              </view>
              <view style="margin-top:20rpx;">
                整点秒杀
              </view>
            </view>
          </view>
        </view>
      </view>
    </TnScrollList>
    <view v-for="(item, index) in indexs[active_index]?.list" :key="'item' + index" class="item" @click="toBuy(item.id)">
      <image class="image" :src="item.path" mode="scaleToFill" />
      <view class="right">
        <view class="item_name">{{ item.name }} </view>
        <view class="tn-flex-center-start">
          <view class="progress">
            <view class="progress_background" :style="{ width: `${Math.floor(item.last * 100 / item.total)}%` }"></view>
            <view class="text">
              已抢{{ Math.floor(item.last * 100 / item.total) }}%
            </view>
          </view>
          <view class="limit">
            限购{{ item.total }}件
          </view>
        </view>
        <view :class="['buy', indexs[active_index].start < new Date() ? 'doing' : 'wait']">
          <view class="flash">
            秒杀￥ {{ item.flash_price }}
          </view>
          <view class="old">
            ￥{{ item.price }}
          </view>
        </view>
        <!-- <view class="tn-flex-center-between" style="width: 400rpx">
          <view>
            <view class="tn-flex-center-start">
              <view class="item_price">
                ￥ {{ item.flash_price }}
              </view>
              <view class="item_old_price">
                原价：{{ item.price }}
              </view>
            </view>
          </view>
          <TnButton width="140" height="60" shape="round" bg-color="#C8B697" text-color="#FFFFFF"
            @click="toBuy(item.id)">马上抢
          </TnButton>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onReachBottom } from '@dcloudio/uni-app'

import TnScrollList from '@tuniao/tnui-vue3-uniapp/components/scroll-list/src/scroll-list.vue'
import Header from '@/components/header.vue'
import CountDown from '@/components/CountDown'
import { get_goods_list } from '@/api/index/seckill/seckill'
import { setTime, formatTime } from '@/utils/format'
import { getRandomImage } from '@/utils/constant'

// 顶部选项框
const indexs = ref([])
const active_index = ref(0)
const getIndexs = () => {
  const list = [
    {
      start: '14:00',
      end: '20:00',
      list: [
        {
          id: 102,
          path: getRandomImage(200, 200),
          name: '123',
          flash_price: '99.00',
          price: '199.00',
          last: 10,
          total: 20
        },
        {
          id: 2,
          path: getRandomImage(200, 200),
          name: '123',
          flash_price: '99.00',
          price: '199.00',
          last: 10,
          total: 20
        },
        {
          id: 3,
          path: getRandomImage(200, 200),
          name: '123',
          flash_price: '99.00',
          price: '199.00',
          last: 10,
          total: 20
        },
      ]
    },
    {
      start: '17 8:00',
      end: '17 12:00',
      list: [
        {
          id: 1,
          path: getRandomImage(200, 200),
          name: '123',
          flash_price: '99.00',
          price: '199.00',
          last: 10,
          total: 20
        },
        {
          id: 2,
          path: getRandomImage(200, 200),
          name: '123',
          flash_price: '99.00',
          price: '199.00',
          last: 10,
          total: 20
        },
      ]
    },
    {
      start: '17 10:30',
      end: '17 11:00',
      list: []
    },
    {
      start: '17 11:00',
      end: '17 12:00',
      list: []
    }
  ]
  indexs.value = list.map(item => {
    const start = setTime(item.start)
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
  items.value.push(
    {
      id: 1,
      path: getRandomImage(200, 200),
      name: '123',
      flash_price: '99.00',
      price: '199.00',
      last: 10
    }
  )
}

onShow(() => {
  getIndexs()
  // getData()
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
  padding: 360rpx 0 0;
  background: transparent;
  z-index: 0;
}

.background {
  position: fixed;
  top: 0;
  width: 750rpx;
  height: 494rpx;
  z-index: -2;
}

.indexs {
  margin: 20rpx 0;
  width: 750rpx;
  height: 130rpx;
  background: #fd745a;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 25rpx;
  text-align: left;
  font-style: normal;
  color: #FFF;
  overflow: visible;

  .item {
    width: 180rpx;
    height: 100%;
  }

  .wait {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .doing {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .active {
    color: #14BF20;
    overflow: visible;
    position: relative;
    z-index: 2;

    .image {
      position: absolute;
      width: 260rpx;
      top: -50rpx;
      height: 170rpx;
      left: -40rpx;
      z-index: -1;
    }
  }
}

.item {
  width: 100%;
  margin: 20rpx auto;
  padding: 20rpx;
  display: flex;

  .image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 20rpx;
  }

  .right {
    margin-left: 40rpx;

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

    .progress {
      width: 220rpx;
      border: 2rpx solid #FF7C66;
      border-radius: 20rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 18rpx;
      color: #FF4121;
      line-height: 25rpx;
      text-align: left;
      font-style: normal;
      position: relative;
      display: flex;
      justify-content: center;

      .progress_background {
        height: 100%;
        position: absolute;
        background: #FFEAE3;
        z-index: -1;
        left: 0;
      }
    }

    .limit {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #FF1925;
      line-height: 33rpx;
      text-align: left;
      font-style: normal;
      margin-left: 10rpx;
    }

    .buy {
      margin: 30rpx 0;
      width: 440rpx;
      height: 76rpx;
      display: flex;
      align-items: center;

      .flash {
        margin-left: 20rpx;
        font-family: WeChat-Sans-Std, WeChat-Sans-Std;
        font-weight: bold;
        font-size: 28rpx;
        line-height: 31rpx;
        text-align: center;
        font-style: normal;
      }

      .old {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 22rpx;
        line-height: 30rpx;
        text-align: center;
        font-style: normal;
        text-decoration-line: line-through;
      }
    }

    .doing {
      background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhRVKItZSgfib07mMPF0QTRLgB4ad0Vudt0a9MKvVGTVkGEItM5RicicCrK7KZERLc9GibBF8fEmBxg0UQ/0?wx_fmt=png") no-repeat center center;
      background-size: 100% 100%;
      color: #FFF;
    }

    .wait {
      background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhRVKItZSgfib07mMPF0QTRLgVLCIdEJ3jdbDzNoVJd3TQv74ToU0rHPYv7zr4NDCNfDI0hWCmj2nibw/0?wx_fmt=png") no-repeat center center;
      background-size: 100% 100%;
      color: #000;

      .old {
        color: #999;
      }
    }
  }
}
</style>