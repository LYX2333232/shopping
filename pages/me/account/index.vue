<template>
  <Header title="账号设置"></Header>
  <view class="all">
    <TnListItem width="750" bg-color="#FFFFFF" right-icon="right" @click="toReal">
      <view class="tn-flex-center-between">
        <text>实名认证</text>
        <text class="right">{{ isReal ? '已认证' : '未认证' }}</text>
      </view>
    </TnListItem>
    <TnListItem width="750" bg-color="#FFFFFF" @click="changePhone">
      <view>
        更换手机
      </view>
    </TnListItem>
    <TnListItem width="750" bg-color="#FFFFFF">
      <view>
        关于我们
      </view>
    </TnListItem>
    <TnListItem width="750" bg-color="#FFFFFF" right-icon="right" @click="getVersion">
      <view class="tn-flex-center-between">
        <view>版本号</view>
        <view class="right">{{ version }}</view>
      </view>
    </TnListItem>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/header.vue';
import TnListItem from '@/uni_modules/tuniaoui-vue3/components/list/src/list-item.vue'

const isReal = ref(false)

const version = ref('1.0.0')

// 去实名认证
const toReal = () => {
}

// 更换手机
const changePhone = () => {
}

// 获取版本号
const getVersion = () => {
}
</script>

<style lang="scss" scoped>
.all {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150rpx;
  min-height: 100vh;
  background: #F7F7F7;

  .right {
    font-family: Inter, Inter;
    font-weight: 800;
    font-size: 31rpx;
    color: #292929;
    line-height: 36rpx;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-right: 30rpx;
  }
}
</style>