<template>
  <!-- 超出配送范围弹窗 -->
  <TnPopup :model-value="visible" bg-color="transparent">
    <view class="popup">
      <image class="background" :src="background" mode="aspectFit"> </image>
      <view class="title"> 该地址超出配送范围\n暂不支持配送 </view>
      <view class="desc">平台暂时只支持深圳市内配送</view>
      <view class="tn-flex-center-between" style="width: 90%">
        <TnButton
          width="250rpx"
          height="80rpx"
          shape="round"
          border-color="#979797"
          plain
          text-color="#666"
          @click="close"
        >
          知道了
        </TnButton>
        <TnButton
          width="250rpx"
          height="80rpx"
          bg-color="#14BF20"
          text-color="#FFF"
          shape="round"
          @click="toEdit"
        >
          去修改地址
        </TnButton>
      </view>
    </view>
  </TnPopup>
</template>

<script setup>
import TnPopup from "@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue"
import TnButton from "@/uni_modules/tuniaoui-vue3/components/button/src/button.vue"

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
const preUrl = import.meta.env.VITE_BASE_URL + "/mini_app/static/popup"

const emit = defineEmits(["close", "toEdit"])

const background = preUrl + "/popup.png"

const close = () => {
  emit("close")
}
const toEdit = () => {
  emit("toEdit")
}
</script>

<style lang="scss" scoped>
.popup {
  position: relative;
  width: 580rpx;
  height: 620rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.title {
  margin-top: 305rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 36rpx;
  color: #131313;
  text-align: center;
  font-style: normal;
  // 根据\n换行
  white-space: pre;
}
.desc {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #666666;
  line-height: 40rpx;
  text-align: center;
  font-style: normal;
  margin-top: 20rpx;
  margin-bottom: 45rpx;
}
</style>
