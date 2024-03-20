<template>
  <Header title="推荐人"></Header>
  <view class="all">
    <view class="user" v-for="user in userList" :key="user.id">
      <image :src="user.path" mode="scaleToFill"
        style="width: 100rpx;height: 100rpx;border-radius: 50%;margin-right:20rpx" />
      <text>{{ user.user }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import Header from '@/components/header.vue';

const userList = ref([])

const getData = () => {
  const list = [
    {
      id: 1,
      path: 'https://source.unsplash.com/random?1',
      user: '张三'
    },
    {
      id: 2,
      path: 'https://source.unsplash.com/random?2',
      user: '李四'
    },
    {
      id: 3,
      path: 'https://source.unsplash.com/random?3',
      user: '王五'
    },
    {
      id: 4,
      path: 'https://source.unsplash.com/random?4',
      user: '赵六'
    },
    {
      id: 5,
      path: 'https://source.unsplash.com/random?5',
      user: '孙七'
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
  padding-top: 120rpx;
  padding-left: 5%;

  .user {
    margin-top: 30rpx;
    display: flex;
    align-items: center;
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
</style>