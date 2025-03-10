<template>
  <view class="nav">
    <view class="tn-flex-center-evenly">
      <button class="icon" @click="favorite">
        <TnIcon
          :name="props.like === 1 ? 'star-fill' : 'star'"
          size="56"
          :color="props.like === 1 ? '#FF7310' : '#000'"
          :custom-style="{ height: 0 }"
        />
        <text style="white-space: nowrap">{{
          props.like === 1 ? "已收藏" : "收藏"
        }}</text>
      </button>
      <button class="icon" open-type="share">
        <TnIcon
          name="share-square"
          size="56"
          color="#000"
          :custom-style="{ height: 0 }"
        />
        <text>分享</text>
      </button>
    </view>
    <view class="right">
      <TnCountDown
        v-if="props.time"
        :time="props.time"
        show-day
        separator-mode="cn"
        size="35"
        text-color="tn-red"
      />
      <button
        style="width: 100%; border-radius: 50rpx"
        :class="normal ? 'normal' : 'cart'"
        @click="onButtonClick"
      >
        {{ normal ? "加入购物车" : "立即购买" }}
      </button>
    </view>
  </view>
  <button class="fixed" @click="toCart">
    <view class="badge" v-if="cart.cart > 0">
      {{ cart.cart }}
    </view>
    <TnIcon :name="`${preUrl}cart.png`" size="102rpx" />
  </button>
</template>

<script setup>
import TnIcon from "@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue"
import TnCountDown from "@/uni_modules/tuniaoui-vue3/components/count-down/src/count-down.vue"
import { set_favorite } from "@/api/goods/goods"
import { CartStore } from "@/store"

const preUrl = "/static/detail/"

const cart = CartStore()

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  like: {
    type: Number,
    default: 0,
  },
  normal: {
    //是否为普通商品，只有普通商品为加入购物车
    type: Boolean,
    default: false,
  },
  time: {
    type: Number,
    default: undefined,
  },
})

// 点击购物车
const toCart = () => {
  uni.switchTab({
    url: "/pages/shopping/shopping",
  })
}

// 点击收藏
const favorite = async () => {
  uni.showLoading({
    title: "加载中",
  })
  console.log(props)
  await set_favorite(props.id).then((res) => {
    if (res.code === 200) {
      emits("changeLike")
    }
  })
  uni.hideLoading({})
}

const emits = defineEmits(["buttonClick", "changeLike"])

const onButtonClick = () => {
  emits("buttonClick")
}
</script>

<style lang="scss" scoped>
.nav {
  box-sizing: border-box;
  width: 750rpx;
  height: 110rpx;
  position: fixed;
  bottom: 0;
  background: #ffffff;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .icon {
    position: relative;
    //删除默认样式
    border: none;
    background: none;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 22rpx;
    justify-content: center;
    overflow: visible;
    margin-top: 35rpx;

    .badge {
      position: absolute;
      top: -18%;
      right: 25%;
      background: #f00;
      color: #fff;
      border-radius: 50%;
      width: 24rpx;
      height: 24rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20rpx;
    }

    text {
      margin-top: -20rpx;
    }
  }

  .normal {
    background: #14bf20;
    color: #fff;
  }

  .cart {
    background: #ff4121;
    color: #fff;
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 517rpx;
    height: 80rpx;
    font-size: 32rpx;
    margin: 15rpx 20rpx;
  }
}
.fixed {
  position: fixed;
  right: 24rpx;
  bottom: 144rpx;
  overflow: visible;
  background: transparent;
  z-index: 9;
  .badge {
    position: absolute;
    top: 6rpx;
    right: 30rpx;
    background: #f00;
    color: #fff;
    border-radius: 50%;
    width: 24rpx;
    height: 24rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 22rpx;
    color: #ffffff;
    line-height: 30rpx;
    text-align: left;
    font-style: normal;
    z-index: 10;
  }
}
</style>
