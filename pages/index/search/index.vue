<template>
  <Header title="搜索" />
  <view class="all">
    <view class="search">
      <view class="input">
        <view>
          <TnIcon name="search" size="40" />
        </view>
        <input style="flex:auto" type="text" v-model="value" @confirm="search(value)" />
      </view>
      <view style="margin-left:20rpx">
        <TnButton type="success" shape="round" width="130" height="64" @click="search(value)">搜索</TnButton>
      </view>
    </view>
    <view class="main">
      <view class="title">
        历史搜索
      </view>
      <view class="tags">
        <TnTag v-for="(item, index) in historyList" :key="index" shape="round" bg-color="#F7F7F7" text-color="#333"
          :custom-style="{ margin: '20rpx' }" @click="search(item)">
          {{ item }}</TnTag>
      </view>
      <view class="title">
        热门搜索
      </view>
      <view class="tags">
        <TnTag v-for="(item, index) in hotList" :key="index" shape="round" bg-color="#F7F7F7" text-color="#333"
          :custom-style="{ margin: '20rpx' }" @click="search(item)">
          {{ item }}</TnTag>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
import TnTag from '@/uni_modules/tuniaoui-vue3/components/tag/src/tag.vue'
import Header from '@/components/header.vue'

// 历史搜索数据
const historyList = ref([])
// 热门搜索数据
const hotList = ref([])

const value = ref('');
// 进行搜索
const search = (searching = undefined) => {
  if (searching) {
    value.value = searching
  }
  uni.setStorageSync('searchInfo', value.value)
  if (!Array.isArray(historyList.value)) {
    historyList.value = []
  }
  if (!value.value || value.value === '') {
    return
  }
  if (historyList.value.includes(value.value))
    historyList.value.splice(historyList.value.indexOf(value.value), 1)
  // 保存搜索历史并把value作为第一项
  historyList.value.unshift(value.value)
  // 只保留5条历史记录
  if (historyList.value.length > 5) {
    historyList.value.pop()
  }
  uni.setStorageSync('history', historyList.value)
  value.value = undefined
  uni.switchTab({
    url: '/pages/goods/goods'
  })
}
const getData = () => {
  if (!uni.getStorageSync('history')) {
    uni.setStorageSync('history', [])
  }
  historyList.value = uni.getStorageSync('history')
  hotList.value = ['土豆', '苹果', '香蕉', '橙子', '西瓜', '葡萄', '草莓', '樱桃', '蓝莓', '草莓']
}
onLoad(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  padding-top: 180rpx;
  min-height: 100vh;
  background: #F6F6F6;
}

.search {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;

  .input {
    width: 100%;
    display: flex;
    align-items: center;
    background: #FFF;
    border-radius: 40rpx;
    border: 2rpx solid #14BF20;
    padding: 10rpx 20rpx;
  }
}

.main {
  width: 100%;
  min-height: 80vh;
  background: #FFF;
  border-radius: 40rpx 40rpx 0 0;
  padding: 30rpx;

  .title {
    margin-top: 60rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: bold;
    font-size: 35rpx;
    color: #131313;
    line-height: 45rpx;
    text-align: left;
    font-style: normal;
  }

  .tags {
    width: 90%;
    display: gird;
    grid-template-columns: repeat(auto-fit, minmax(100rpx, 1fr));
    grid-gap: 20rpx;
  }
}
</style>