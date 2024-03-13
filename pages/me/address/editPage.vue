<template>
  <Header :title="title" />
  <view class="all">
    <TnListItem width="750">
      <view class="tn-flex-center-start">
        <view class="label">姓名</view>
        <TnInput :border="false" type="text" placeholder="请输入姓名" v-model="name"></TnInput>
      </view>
    </TnListItem>
    <TnListItem width="750">
      <view class="tn-flex-center-start">
        <view class="label">手机号</view>
        <TnInput :border="false" type="number" :maxlength="11" placeholder="请输入手机号" v-model="phone"></TnInput>
      </view>
    </TnListItem>
    <TnListItem width="750">
      <view class="tn-flex-center-start">
        <view class="label">选择地区</view>
        <picker mode="region" :value="region" @change="change">
          <view class="tn-flex-center-start">
            {{ region.join('-') }}
          </view>
        </picker>
      </view>
    </TnListItem>
    <TnListItem width="750">
      <view class="tn-flex-center-start">
        <view class="label">详细地址</view>
        <TnInput :border="false" type="text" placeholder="街道、楼牌号等" v-model="phone"></TnInput>
      </view>
    </TnListItem>
    <TnListItem width="750">
      <view class="tn-flex-center-between">
        <view class="default">设为默认地址</view>
        <TnSwitch v-model="isDefault" width="80" active-color="#D8CCB5"></TnSwitch>
      </view>
    </TnListItem>
    <TnButton width="623" height="100" bg-color="#D8CCB5" text-color="#FFFFFF"
      :custom-style="{ position: 'fixed', bottom: '20px' }" shape="round" @click="toEdit(-1)">
      保存使用
    </TnButton>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'
import TnListItem from '@/uni_modules/tuniaoui-vue3/components/list/src/list-item.vue'
import TnInput from '@/uni_modules/tuniaoui-vue3/components/input/src/input.vue'
import TnSwitch from '@/uni_modules/tuniaoui-vue3/components/switch/src/switch.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'

const title = ref('')

const name = ref('')

const phone = ref('')

const region = ref(['北京市', '市辖区', '东城区'])

const isDefault = ref(false)

const change = (e) => {
  // console.log(region.value);
  console.log('e', e)
  region.value = e.detail.value
}

onLoad((options) => {
  console.log(options)
  if (options.index === '-1') {
    title.value = '新增地址'
  } else {
    title.value = '编辑地址'
  }
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: #F7F7F7;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150rpx;

  .label {
    background: pink;
    width: 150rpx;
    font-family: Inter, Inter;
    font-weight: 600;
    font-size: 35rpx;
    color: #292929;
    line-height: 32rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
}
</style>