<template>
  <view class="fix">
    <view class="nav">
      <view class="tn-flex-center-evenly">
        <button class="icon" @click="favorite">
          <TnIcon
            :name="props.like === 1 ? 'star-fill' : 'star'"
            size="50"
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
            size="50"
            color="#000"
            :custom-style="{ height: 0 }"
          />
          <text>分享</text>
        </button>
      </view>
      <view class="right">
        <button class="cart" @click="addToCart">加入购物车</button>
        <button class="buy" @click="buy">立即购买</button>
      </view>
    </view>
  </view>
  <view class="fixed">
    <button open-type="share">
      <TnIcon :name="`${preUrl}share.jpg`" size="86rpx" />
    </button>
    <button @click="toTop" v-if="top">
      <TnIcon :name="`${preUrl}top.jpg`" size="86rpx" />
    </button>
    <button @click="toCart">
      <view class="badge" v-if="cart.cart > 0">
        {{ cart.cart }}
      </view>
      <TnIcon :name="`${preUrl}cart.jpg`" size="86rpx" />
    </button>
  </view>
</template>

<script setup>
import { onPageScroll } from "vue"
import TnIcon from "@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue"
import { set_favorite } from "@/api/goods/goods"
import { CartStore } from "@/store"

const preUrl = import.meta.env.VITE_BASE_URL + "/mini_app/static/detail/"

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
  //距离顶部的位置
  top: {
    type: Number,
    default: 0,
  },
})

const toTop = () => {
  console.log("toTop")
  //跳转到顶部
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300,
  })
}

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

const emits = defineEmits(["addToCart", "buy", "changeLike"])
const addToCart = () => {
  emits("addToCart")
}
const buy = () => {
  emits("buy")
}
</script>

<style lang="scss" scoped>
.fix {
  box-sizing: border-box;
  width: 750rpx;
  height: 180rpx;
  position: fixed;
  bottom: 0;
  background: #ffffff;
  z-index: 999;
}
.nav {
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

  .right {
    display: flex;
    align-items: center;
    height: 80rpx;
    font-size: 32rpx;
    margin: 0 20rpx;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cart {
      width: 258rpx;
      height: 80rpx;
      background: #ffe9e9;
      border-radius: 40rpx 0rpx 0rpx 40rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #ff4121;
      line-height: 40rpx;
      text-align: right;
      font-style: normal;
    }
    .buy {
      width: 259rpx;
      height: 80rpx;
      background: #ff4121;
      border-radius: 0rpx 40rpx 40rpx 0rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
      line-height: 40rpx;
      text-align: right;
      font-style: normal;
    }
  }
}
.fixed {
  position: fixed;
  right: 33rpx;
  bottom: 210rpx;
  overflow: visible;
  background: transparent;
  z-index: 20;
  button {
    background: transparent;
  }
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
