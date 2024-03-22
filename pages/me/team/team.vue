<template>
  <Header title="我的团队"></Header>
  <view class="all">
    <view style="height:100rpx"></view>
    <view v-for="(item, index) in userList" :key="index" class="user">
      <view style="display: flex;align-items: center">
        <image :src="item.avatar" mode="scaleToFill"
          style="width: 100rpx;height: 100rpx;border-radius: 50%;margin-right: 20rpx;" />
        <text class="name">{{ item.name }}</text>
      </view>
      <TnTag v-if="item.referee" bg-color="#C8B697" text-color="#fff" shape="round" width="100" height="40">推荐人</TnTag>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'
import TnTag from '@/uni_modules/tuniaoui-vue3/components/tag/src/tag.vue'

const tab_index = ref(0)

const userList = ref([])

const getData = () => {
  const list = [
    {
      avatar: 'https://source.unsplash.com/random?1',
      name: '张三',
      referee: true
    },
    {
      avatar: 'https://source.unsplash.com/random?2',
      name: '李四',
      referee: false
    },
    {
      avatar: 'https://source.unsplash.com/random?3',
      name: '王五',
      referee: false
    },
    {
      avatar: 'https://source.unsplash.com/random?4',
      name: '赵六',
      referee: true
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
  padding-top: 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .user {
    width: 90%;
    margin: 10rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

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