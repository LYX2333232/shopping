<template>
  <Header
    background="rgba(255, 255, 255, 0.6)"
    border="1rpx solid rgba(151, 151, 151, 0.2)"
  />
  <view style="position: relative">
    <swiper
      :indicator-dots="false"
      autoplay="false"
      circular
      @change="changeSwiper"
      style="height: 750rpx"
    >
      <swiper-item v-for="item in swiperImg" :key="'swiperImg' + item.id">
        <image
          :src="item.path"
          mode="aspectFill"
          style="width: 750rpx; height: 750rpx"
          @click="toWeb(item.path)"
        >
        </image>
      </swiper-item>
    </swiper>
    <view class="show">
      <view>
        <view v-if="other" class="other">
          <image :src="other.avatar" mode="scaleToFill" class="avatar" />
          <view>
            {{ other.name + other.text }}
          </view>
        </view>
      </view>
      <view class="index">
        <view class="current">
          {{ current }}
        </view>
        <view class="total">
          {{ swiperImg.length }}
        </view>
      </view>
    </view>
  </view>
  <view class="all">
    <view
      class="flash"
      :style="{
        background: `url(${preUrl}flash.png)`,
        backgroundSize: '100%',
      }"
    >
      <view>
        <view class="now"> ￥{{ size.price }} </view>
        <view class="tn-flex-center-start">
          <view class="old"> ￥{{ size.or_price }} </view>
          <view style="margin: 0 10rpx">|</view>
          <view>已售{{ size.number }}</view>
        </view>
      </view>
      <view class="right">
        <view class="tn-flex-center-start">
          <view> 距结束仅剩： </view>
          <CountDown
            :time="end - new Date().getTime()"
            textColor="#DD1A21"
            @finish="finish"
          />
        </view>
      </view>
    </view>
    <view class="white_boxs">
      <view class="info">
        {{ name }}
      </view>
      <view class="tn-flex-center-start">
        <view class="type" v-for="item in typeList" :key="item.id">
          {{ item }}
        </view>
      </view>
    </view>
    <view class="size">
      <view class="tn-flex-center-start">
        <view class="title">配送</view>
        <view class="desc">同城48小时送达</view>
      </view>
      <view class="tn-flex-center-between tn-mt-xl">
        <view class="tn-flex-center-start">
          <view class="title">规格</view>
          <view class="desc">{{ size.item_name }}</view>
        </view>
        <view>
          <TnNumberBox v-model="cont" />
        </view>
      </view>
    </view>
    <view class="detail">
      <view class="title">
        <text>商品详情</text>
      </view>
      <view
        v-for="item in swiperVideo"
        :key="'swiperVideo' + item.id"
        style="width: 90%; margin: 0 auto"
      >
        <video
          style="width: 100%"
          :src="'https://senmei.top/' + item.url"
        ></video>
      </view>
      <view style="width: 100%; margin: 10rpx 0">
        <rich-text :nodes="content"></rich-text>
      </view>
    </view>
  </view>
  <GoodNav
    :id="c_id"
    :like="size.is_like"
    :normal="false"
    @buttonClick="buttonClick"
    @changeLike="changeLike"
  />
  <!-- 分享定义在组件goods-nav中 -->
</template>

<script setup>
import { ref } from "vue"
import { onLoad } from "@dcloudio/uni-app"

import TnNumberBox from "@tuniao/tnui-vue3-uniapp/components/number-box/src/number-box.vue"
import { get_goods_detail } from "@/api/index/seckill/seckill"
import Header from "@/components/header.vue"
import GoodNav from "@/components/goodNav"
import CountDown from "@/components/CountDown"

const preUrl = "/static/detail/"

// 轮播图相关
const swiperVideo = ref([])
const swiperImg = ref([])
const current = ref(1)
const changeSwiper = (e) => {
  if (e && e.detail && e.detail.current !== undefined) {
    current.value = e.detail.current + 1
  } else {
    console.error("Invalid event object:", e)
  }
}
const toWeb = (path) => {
  uni.navigateTo({
    url: "/pages/web/index?src=" + path,
  })
}

// 其他用户的购买信息
const other = ref(null)

const c_id = ref("")
var flash_id

const end = ref(new Date())
const finish = () => {}

// 商品售价
const sell = ref(0)
const name = ref("")
const typeList = ref([])

// 商品规格
const size = ref({})

// 数量
const cont = ref(1)

// 详细描述
const content = ref("")

// 底部信息
const like = ref(0)

const changeLike = () => {
  size.value.is_like = size.value.is_like ? 0 : 1
}

/**
 * 立即购买
 */
function buttonClick() {
  uni.navigateTo({
    url: `/pages/me/order/new_order?flash_id=${flash_id}&com_cont=${cont.value}`,
  })
}

onLoad((options) => {
  const that = this
  get_goods_detail({ id: options.id }).then((res) => {
    // 轮播图
    swiperImg.value = res.data.paths
    // 视频轮播图
    swiperVideo.value = res.data.videost

    c_id.value = res.data.id
    flash_id = res.data.flash_com_id

    end.value = new Date(res.data.end_time * 1000)
    console.log(end.value)

    // 规格
    size.value = res.data.item
    other.value = res.data.users[0]

    // 商品名称
    name.value = res.data.name

    typeList.value = res.data.labels

    content.value = res.data.content.replace(
      /(<img [^>]*)(style="[^"]*")?/gi,
      '$1 style="width:100%;"'
    )

    like.value = res.data.is_like

    sell.value = res.data.volume
  })
})
</script>

<style lang="scss" scoped>
page {
  background: #f6f6f6;
}

.show {
  position: absolute;
  width: 100%;
  bottom: 20rpx;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .other {
    background: #000;
    opacity: 0.6;
    display: flex;
    align-items: center;
    width: 450rpx;
    height: 60rpx;
    border-radius: 0 30rpx 30rpx 0;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #ffffff;
    line-height: 33rpx;
    text-align: left;
    font-style: normal;

    .avatar {
      margin: 0 20rpx;
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
    }
  }

  .index {
    margin-right: 20rpx;
    background: rgba($color: #000000, $alpha: 0.4);
    width: 80rpx;
    height: 40rpx;
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    color: #ffffff;
    line-height: 40rpx;

    .current {
      width: 40rpx;
      height: 40rpx;
      text-align: center;
      border-radius: 30rpx 0 30rpx 30rpx;
      background: rgba($color: #000000, $alpha: 0.2);
    }

    .total {
      width: 40rpx;
      height: 40rpx;
      text-align: center;
    }
  }
}

.all {
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
}

.flash {
  width: 710rpx;
  height: 162rpx;
  margin-bottom: -30rpx;
  // 旧背景图
  // background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhRVKItZSgfib07mMPF0QTRLgJPSrW6ez1oJ4GIlU5rK1tTWTGCbtiaW7qicTOtHlGF7qHTHDSlQ1fypQ/0?wx_fmt=png")
  //   no-repeat center center;
  // background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;

  .now {
    font-family: WeChat-Sans-Std, WeChat-Sans-Std;
    font-weight: bold;
    font-size: 50rpx;
    text-align: left;
    font-style: normal;
    margin: 22rpx 23rpx 10rpx;
  }

  .old {
    margin-left: 20rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 26rpx;
    text-align: left;
    font-style: normal;
    text-decoration-line: line-through;
  }

  .right {
    margin-right: 30rpx;
    height: 100rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
}

.white_boxs {
  width: 710rpx;
  margin: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 24rpx;

  .info {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 34rpx;
    color: #131313;
    line-height: 44rpx;
    text-align: left;
    font-style: normal;
    margin: 20rpx 0;
  }

  .type {
    height: 35rpx;
    margin-top: 20rpx;
    margin-right: 15rpx;
    padding: 5rpx 10rpx;
    font-size: 25rpx;
    color: #999;
    border: 2rpx dotted #999;
    line-height: 35rpx;
    display: flex;
    align-items: center;
  }

  .sold {
    width: 100%;
    font-family: Inter, Inter;
    font-weight: 400;
    font-size: 23rpx;
    margin-top: 15rpx;
    color: #8a8a8a;
    line-height: 35rpx;
    padding-bottom: 40rpx;
    text-align: right;
  }
}

.deliver {
  width: 100%;
  display: flex;
  background: #fff;
  padding: 30rpx 20rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #131313;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;

  .label {
    color: #999999;
  }

  .text {
    margin-left: 30rpx;
  }
}

.size {
  width: 100%;
  background-color: #fff;
  margin: 20rpx;
  padding: 30rpx 20rpx;

  .title {
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #131313;
    line-height: 40rpx;
    margin-right: 30rpx;
  }

  .desc {
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #131313;
    line-height: 40rpx;
  }

  .uni-px-5 {
    padding-top: 15rpx;
    padding-right: 15px;
    padding-bottom: 35rpx;
  }
}

.param {
  width: 100%;
  background-color: #fff;
  margin: 20rpx;
  padding: 30rpx 20rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #131313;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    margin-bottom: 30rpx;
  }

  .card {
    border-radius: 16rpx;
    border: 1rpx solid #d0d0d0;
    display: flex;
    flex-direction: column;
    align-items: center;

    .item {
      width: 100%;
      padding: 20rpx;
      display: flex;
      align-items: center;

      .label {
        width: 120rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #999999;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
      }

      .text {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #131313;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
      }
    }

    .block {
      width: 100%;
      margin: 0 20rpx;
      height: 1rpx;
      background-color: #eee;
    }
  }
}

.detail {
  width: 100%;
  background-color: #fff;
  margin: 20rpx;
  padding-bottom: 150rpx;

  .title {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #131313;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    margin: 30rpx 20rpx;
  }
}

.comment {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 20rpx 0 150rpx;

  .text1 {
    font-family: Inter, Inter;
    font-weight: 600;
    font-size: 27rpx;
    color: #75694a;
    line-height: 40rpx;
    text-align: left;
  }

  .card {
    margin-top: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 200rpx;

    .name {
      font-family: Noto Sans SC, Noto Sans SC;
      font-weight: 500;
      font-size: 23rpx;
      color: #494949;
      line-height: 27rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}

.goods-carts {
  height: 146rpx;
  background: #ffffff;
  box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.2);
  border-radius: 50rpx 50rpx 0rpx 0rpx;

  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  position: fixed;
  left: 0;
  right: 0;
  /* #ifdef H5 */
  left: var(--window-left);
  right: var(--window-right);
  /* #endif */
  bottom: 0;
  z-index: 100;
}
</style>
