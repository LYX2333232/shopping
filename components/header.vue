<template>
  <view class="big_out" :style="{ color: color, background }">
    <!-- 左上角返回按钮 -->
    <!-- 这里为什么要加4px，是因为这个左箭头<的高度为16rpx需要下降一半，就是8rpx=4px,可以自己试一下，我这里没有问题 -->
    <view
      class="back"
      :style="{ marginTop: 4 + 'px', border }"
      @click="back_page"
    >
      <!-- <view class="back_img" :style="{ borderColor: color }"> </view> -->
      <TnIcon name="left" size="32" />
    </view>
    <view class="title">
      <slot>
        {{ title }}
      </slot>
    </view>
  </view>
</template>

<script>
import TnIcon from "@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue"

export default {
  name: "backPages",
  components: {
    TnIcon,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#000",
    },
    background: {
      type: String,
      default: "transparent",
    },
    border: {
      type: String,
      default: "",
    },
  },

  //这里原来使用的onLoad一直有bug（不重新进入页面就会错位），
  // 后来使用onShow  更改于2022/09/30  以后再修改
  onLoad() {
    //加载时调用 getHeight
    this.getHeight()
  },
  methods: {
    //利用胶囊按钮定位宽高

    //直接返回上一级
    back_page() {
      // 获取当前页面栈
      const pages = getCurrentPages()
      if (pages.length === 1) {
        uni.switchTab({
          url: "/pages/index/index",
        })
        return
      } else
        uni.navigateBack({
          delta: 1, // 返回的页面数
        })
    },
  },
}
</script>

<style scoped>
.big_out {
  position: fixed;
  display: flex;
  width: 750rpx;
  justify-content: center;
  align-items: center;
  z-index: 999;
  /* background-color: red; */
  padding: 100rpx 0 20rpx;
  background: transparent;
}

.back {
  position: absolute;
  left: 20rpx;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back_img {
  /* 用border值来控制箭头粗细 */
  border: 3rpx solid;
  /* 上、右、下、左  四个边框的宽度 */
  border-width: 0px 2px 2px 0px;
  display: inline-block;
  /* padding值控制箭头大小 */
  padding: 5px;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
  margin-left: 30rpx;
}

.back_text {
  float: right;
}

.title {
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 36rpx;
  line-height: 50rpx;
  text-align: right;
  font-style: normal;
}
</style>
