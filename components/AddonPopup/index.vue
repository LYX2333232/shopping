<template>
  <TnPopup
    :model-value="visible"
    open-direction="bottom"
    height="1284"
    @open="open"
    @close="close"
    @overlay-click="close"
    radius="40"
  >
    <view class="popup">
      <view class="tn-flex-center-between">
        <view class="tn-flex-center-center">
          <image
            class="addon"
            src="/static/shopping/addon.png"
            mode="aspectFit"
          >
          </image>
          <view class="desc">｜包邮无忧 暖心送达</view>
        </view>
        <TnIcon name="close" size="56" />
      </view>
      <view class="free">
        <view class="tag">免配送费</view>
        <view>满99元免基础配送费</view>
      </view>
      <view class="good" v-for="good in list" :key="good.id">
        <image class="image" :src="good.path" mode="aspectFill"> </image>
        <view class="right">
          <view class="name">
            <view class="tag" v-if="good.tag">时令秒杀</view>
            {{ good.name }}
          </view>
          <view class="bottom">
            <view class="left">
              <view class="price">￥{{ good.price }}</view>
              <view class="old" v-if="good.or_price"
                >￥{{ good.or_price }}</view
              >
            </view>
            <TnNumberBox v-if="good.count" v-model="good.count" min="0" />
            <TnButton
              v-else
              width="110"
              height="48"
              shape="round"
              bg-color="#14BF20"
              text-color="#FFF"
              @click="add(good)"
              >凑单</TnButton
            >
          </view>
        </view>
      </view>
    </view>
  </TnPopup>
</template>

<script setup>
import { ref } from "vue"

import TnPopup from "@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue"
import TnIcon from "@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue"
import TnButton from "@/uni_modules/tuniaoui-vue3/components/button/src/button.vue"
import TnNumberBox from "@/uni_modules/tuniaoui-vue3/components/number-box/src/number-box.vue"
import { getRandomImage } from "@/utils/constant"

defineProps({
  visible: {
    type: Boolean,
    require,
  },
})

const list = ref([])
const getData = () => {
  list.value = [
    {
      id: 1,
      path: getRandomImage(),
      name: "商品1",
      or_price: 200,
      item_name: "1kg/袋",
      price: 100,
      tag: true,
      count: 0,
    },
    {
      id: 2,
      path: getRandomImage(),
      name: "商品1",
      or_price: 200,
      item_name: "1kg/袋",
      price: 100,
      tag: false,
      count: 1,
    },
  ]
}

const open = () => {
  getData()
}

const add = (good) => {
  good.count = 1
}
</script>

<style lang="scss" scoped>
.popup {
  width: 100%;
  height: 100%;
  padding: 35rpx 30rpx;
  background: linear-gradient(180deg, #ffe3cc 0%, #ffffff 20%);
}

.addon {
  width: 160rpx;
  height: 36rpx;
  margin-right: 10rpx;
}

.desc {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
  line-height: 33rpx;
  text-align: center;
  font-style: normal;
}
.free {
  margin-top: 23rpx;
  margin-bottom: 34rpx;
  display: flex;
  align-items: center;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 26rpx;
  color: #333333;
  line-height: 37rpx;
  text-align: left;
  font-style: normal;

  .tag {
    background: #ff7500;
    border-radius: 4rpx;
    padding: 0 8rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 22rpx;
    color: #ffffff;
    line-height: 30rpx;
    text-align: left;
    font-style: normal;
    margin-right: 16rpx;
  }
}

.good {
  margin-bottom: 40rpx;
  display: flex;
  align-items: stretch;

  .image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
  }

  .right {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;

    .name {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 30rpx;
      color: #333333;
      line-height: 42rpx;
      text-align: left;
      font-style: normal;

      .tag {
        background: #ff4121;
        border-radius: 4rpx;
        padding: 0 6rpx;
        margin-right: 8rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 22rpx;
        color: #ffffff;
        line-height: 30rpx;
        text-align: left;
        font-style: normal;
      }
    }

    .bottom {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left {
        display: flex;
        align-items: flex-end;

        .price {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          font-size: 36rpx;
          color: #ee2532;
          line-height: 50rpx;
          text-align: left;
          font-style: normal;
          margin-right: 10rpx;
        }

        .old {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
          line-height: 33rpx;
          text-align: left;
          font-style: normal;
          text-decoration-line: line-through;
        }
      }
    }
  }
}
</style>
