<template>
  <Header title="我的团队"></Header>
  <view class="all">
    <TnTabs v-model="tab_index" font-size="30" bar-width="250" active-color="#C8B697" bar-color="#C8B697"
      color="#AEAEAE">
      <TnTabsItem title="直推团队">
        <view style="width: 375rpx;text-align: center">
          上一级用户</view>
      </TnTabsItem>
      <TnTabsItem title="间推团队">
        <view style="width: 375rpx;text-align: center">
          下一级用户</view>
      </TnTabsItem>
    </TnTabs>
    <view style="height:100rpx"></view>
    <view v-for="(item, index) in userList" :key="index" class="user">
      <image :src="item.avatar" mode="scaleToFill"
        style="width: 100rpx;height: 100rpx;border-radius: 50%;margin-right: 20rpx;" />
      <text class="name">{{ item.name }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'
import TnTabs from '@/uni_modules/tuniaoui-vue3/components/tabs/src/tabs.vue'
import TnTabsItem from '@/uni_modules/tuniaoui-vue3/components/tabs/src/tabs-item.vue'

const tab_index = ref(0)

const userList = ref([])

const getData = () => {
  const list = [
    {
      avatar: 'https://source.unsplash.com/random?1',
      name: '张三',
    },
    {
      avatar: 'https://source.unsplash.com/random?2',
      name: '李四',
    },
    {
      avatar: 'https://source.unsplash.com/random?3',
      name: '王五',
    },
    {
      avatar: 'https://source.unsplash.com/random?4',
      name: '赵六',
    }
  ]
  userList.value = list
}

onShow(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.all {
  padding-top: 180rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .user {
    width: 90%;
    margin: 10rpx;
    display: flex;
    align-items: center;
    justify-content: start;

    .name {
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 27rpx;
      color: #333333;
      line-height: 31rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }

}
</style>