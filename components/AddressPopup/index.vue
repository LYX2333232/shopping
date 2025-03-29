<template>
  <TnPopup
    :model-value="visible"
    open-direction="bottom"
    height="750"
    @open="open"
    @close="close"
    @overlay-click="close"
  >
    <view class="address-all">
      <view class="close">
        <TnIcon name="close" size="56" @click="close" />
      </view>
      <view class="header"> 选择地址 </view>
      <view class="item" v-for="item in list" :key="item.id">
        <view class="left">
          <TnCheckbox
            v-model="item.isSelect"
            active-color="#14bf20"
            checked-shape="circle"
            @change="(val) => changeAddress(val, item)"
          ></TnCheckbox>
          <view class="tn-ml-lg">
            <view class="up">
              <text class="tag" v-if="item.tag">
                {{ item.tag }}
              </text>
              {{ item.address_name + " " + item.detail }}
            </view>
            <view class="down"> {{ item.name }} {{ item.phone }} </view>
          </view>
        </view>
        <TnIcon name="edit" size="56" @click="toDetail(item.id)" />
      </view>
      <TnButton
        width="710"
        height="100"
        shape="round"
        type="success"
        @click="newAddress"
        >新增地址</TnButton
      >
    </view>
  </TnPopup>
</template>

<script setup>
import { ref } from "vue"

import TnIcon from "@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue"
import TnButton from "@/uni_modules/tuniaoui-vue3/components/button/src/button.vue"
import TnCheckbox from "@/uni_modules/tuniaoui-vue3/components/checkbox/src/checkbox.vue"
import TnPopup from "@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue"

import { get_address_list } from "@/api/address/address"

import { AddressStore } from "@/store"

const address = AddressStore()

const props = defineProps({
  visible: {
    type: Boolean,
    require,
  },
})
const list = ref([])

const emit = defineEmits(["close"])

const open = () => {
  get_address_list(1).then((res) => {
    list.value = res.data.data.map((item) => ({
      ...item,
      isSelect: item.id === address.address.id,
    }))
  })
}
const changeAddress = (val, item) => {
  // 不允许不选择地址
  if (!val) {
    item.isSelect = true
    return
  }
  list.value.forEach((item) => {
    item.isSelect = false
  })
  item.isSelect = true
  address.setAddress(item)
}
const close = () => {
  console.log("close")
  emit("close")
}
const toDetail = (id) =>
  uni.navigateTo({
    url: "/pages/me/address/editPage?index=" + id,
  })
const newAddress = () =>
  uni.navigateTo({
    url: "/pages/me/address/editPage?index=-1",
  })
</script>

<style lang="scss" scoped>
.address-all {
  height: 750rpx;
  width: 100%;
  overflow: auto;
  padding: 30rpx 20rpx;
  position: relative;

  .close {
    position: absolute;
    right: 20rpx;
    top: 20rpx;
    z-index: 999;
  }

  .header {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 32rpx;
    color: #0f0d0d;
    line-height: 45rpx;
    text-align: center;
    font-style: normal;
  }

  .item {
    width: 100%;
    display: flex;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #dedede;
    align-items: center;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;

      .up {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 32rpx;
        color: #131313;
        line-height: 45rpx;
        text-align: left;
        font-style: normal;

        .tag {
          background: #fff2ef;
          color: #ee2532;
          margin-right: 10rpx;
        }
      }

      .down {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
      }
    }
  }
}
</style>
