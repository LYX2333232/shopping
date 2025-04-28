<template>
  <Header />
  <view class="all">
    <image
      class="background"
      src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhS8PmdQBKx8ibh5O3dju5VYEanKbAXP1GiayrWu3KLQPtian8UECGxjfNtf7eqnlKrloxNriaAQ5AuglQ/0?wx_fmt=png"
      mode="scaleToFill"
    />
    <TnScrollList :indicator="false">
      <view style="height: 180rpx">
        <view class="tn-flex-center-start indexs">
          <view
            style="height: 100%; overflow: visible"
            v-for="(item, index) in indexs"
            :key="index"
            @click="changeIndex(index)"
          >
            <!-- 未开始 -->
            <view
              v-if="item.start > new Date()"
              :class="['item', 'wait', active_index === index ? 'active' : '']"
            >
              <image
                v-if="active_index === index"
                src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhShtTUhH934Jtia8VR1p39plXzlB1BtEQqSLFsiabWVMMHjdgb8Wvxyn5xt5rBADdvYVfZ3U2Nm8F7g/0?wx_fmt=png"
                class="image"
                mode="scaleToFill"
              />
              <view>
                {{ dayText(item.start) + formatTime(item.start, "h:m") }}
              </view>
              <view style="margin-top: 20rpx"> 整点秒杀 </view>
            </view>
            <!-- 已开始且未结束 -->
            <view
              v-else-if="item.end > new Date()"
              :class="['item', 'doing', active_index === index ? 'active' : '']"
            >
              <image
                v-if="active_index === index"
                src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhShtTUhH934Jtia8VR1p39plXzlB1BtEQqSLFsiabWVMMHjdgb8Wvxyn5xt5rBADdvYVfZ3U2Nm8F7g/0?wx_fmt=png"
                class="image"
                mode="scaleToFill"
              />
              <CountDown
                :time="item.end - new Date()"
                :textColor="active_index === index ? '#FFF' : '#EE2532'"
                :background="active_index === index ? '#14BF20' : '#FFF'"
              />
              <view style="margin-top: 20rpx">
                {{ item.hour }}点{{ item.min ? "半" : "" }}场
              </view>
            </view>
          </view>
        </view>
      </view>
    </TnScrollList>
    <view
      v-for="(item, index) in items"
      :key="'item' + index"
      class="item"
      @click="toBuy(item.id)"
    >
      <image class="image" :src="item.path" mode="scaleToFill" />
      <view class="right">
        <view class="item_name">{{ item.name }} </view>
        <view class="tn-flex-center-start">
          <view class="progress">
            <view
              class="progress_background"
              :style="{ width: `${item.percentage}%` }"
            ></view>
            <view class="text"> 已抢{{ item.percentage }}% </view>
          </view>
          <view class="limit"> 限购{{ item.total }}件 </view>
        </view>
        <view
          :class="[
            'buy',
            indexs[active_index]?.start < new Date() ? 'doing' : 'wait',
          ]"
        >
          <view class="flash"> 秒杀￥ {{ item.flash_price }} </view>
          <view class="old"> ￥{{ item.price }} </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue"
import { onShow } from "@dcloudio/uni-app"

import TnScrollList from "@tuniao/tnui-vue3-uniapp/components/scroll-list/src/scroll-list.vue"
import Header from "@/components/header.vue"
import CountDown from "@/components/CountDown"
import { get_time_list, get_goods_list } from "@/api/index/seckill/seckill"

// 顶部选项框
const indexs = ref([])
const active_index = ref(0)
const changeIndex = (index) => {
  active_index.value = index
  get_goods_list(indexs.value[index].id).then((res) => {
    console.log(res)
    items.value = res.data
  })
}

// 底部的数据
const items = ref([])

// 马上抢
const toBuy = (id) => {
  uni.navigateTo({
    url: "/pages/index/seckill/detail/index?id=" + id,
  })
}

const getData = () => {
  // 获取数据
  get_time_list().then((res) => {
    indexs.value = res.data.map((item) => {
      const start = new Date(item.start * 1000)
      const hour = start.getHours()
      const min = start.getMinutes()
      return {
        ...item,
        hour,
        min,
        start,
        end: new Date(item.end * 1000),
      }
    })
    changeIndex(0)
  })
}

/**
 * 判断是否需要加上天（明天、后天）
 */
const dayText = (time) => {
  const now = new Date().setHours(0, 0, 0, 0)
  const start = new Date(time)
  // 注意可能会跨月份，需要用getTime来比较
  const day = (start - now) / (24 * 60 * 60 * 1000)
  if (day === 0) return ""
  if (day === 1) return "明天"
  if (day === 2) return "后天"
  return day + "天后"
}

onShow(() => {
  getData()
})

var page = 1
// onReachBottom(() => {
//   get_goods_list(++page).then(res => {
//     if (res.data.data.length)
//       items.value = items.value.concat(res.data.data)
//     else {
//       page--
//       uni.showToast({
//         title: '没有更多数据了',
//         icon: 'none'
//       })
//     }
//   })
// })
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
  color: #fff;
  overflow: visible;

  .item {
    width: 400rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .active {
    color: #14bf20;
    overflow: visible;
    position: relative;
    z-index: 2;

    .image {
      position: absolute;
      width: 100%;
      top: -50rpx;
      height: 170rpx;
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
      border: 2rpx solid #ff7c66;
      border-radius: 20rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 18rpx;
      color: #ff4121;
      line-height: 25rpx;
      text-align: left;
      font-style: normal;
      position: relative;
      display: flex;
      justify-content: center;

      .progress_background {
        height: 100%;
        position: absolute;
        background: #ffeae3;
        z-index: -1;
        left: 0;
      }
    }

    .limit {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #ff1925;
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
      background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhRVKItZSgfib07mMPF0QTRLgB4ad0Vudt0a9MKvVGTVkGEItM5RicicCrK7KZERLc9GibBF8fEmBxg0UQ/0?wx_fmt=png")
        no-repeat center center;
      background-size: 100% 100%;
      color: #fff;
    }

    .wait {
      background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhRVKItZSgfib07mMPF0QTRLgVLCIdEJ3jdbDzNoVJd3TQv74ToU0rHPYv7zr4NDCNfDI0hWCmj2nibw/0?wx_fmt=png")
        no-repeat center center;
      background-size: 100% 100%;
      color: #000;

      .old {
        color: #999;
      }
    }
  }
}
</style>
