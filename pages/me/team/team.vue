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
      <TnTag v-if="item.referee" type="success" shape="circle" width="100" height="40">推荐人</TnTag>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { get_up_list } from '@/api/user/user.js'
import Header from '@/components/header.vue'
import TnTag from '@/uni_modules/tuniaoui-vue3/components/tag/src/tag.vue'

const userList = ref([])

const getData = () => {
  const list = [
    {
      avatar: 'https://picsum.photos/50/50',
      name: '张三',
      referee: true
    },
    {
      avatar: 'https://picsum.photos/50/50',
      name: '李四',
      referee: false
    },
    {
      avatar: 'https://picsum.photos/50/50',
      name: '王五',
      referee: false
    },
    {
      avatar: 'https://picsum.photos/50/50',
      name: '赵六',
      referee: true
    }
  ]
  userList.value = list
  get_up_list().then(res => {
    if (res.data.up_user)
      userList.value.push({
        ...res.data.up_user,
        referee: true
      })
    // 数组拼接
    userList.value = userList.value.concat(res.data.data.map(item => {
      return {
        ...item,
        referee: false
      }
    }))
  })
}

onShow(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.all {
  padding: 80rpx 30rpx 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #F6F6F6;

  .user {
    width: 100%;
    margin: 40rpx 0;
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