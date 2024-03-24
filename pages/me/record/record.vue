<template>
  <Header title="销售记录"></Header>
  <view class="all">
    <view class="item" v-for="item in recordList" :key="item.id">
      <view class="user">
        <text>分销用户:</text>
        <image :src="item.avatar" mode="scaleToFill"
          style="margin-left: 10rpx;width: 50rpx; height: 50rpx; border-radius: 50%;" />
        <text>{{ item.user_name }}</text>
      </view>
      <view class="main">
        <image :src="item.path" mode="scaleToFill" style="width:160rpx; height:160rpx;border-radius: 15rpx;" />
        <view class="right">
          <text class="name">{{ item.name }}</text>
          <text class="size">{{ item.item_name }}</text>
          <text class="number">x{{ item.cont }}</text>
          <view class="bottom">
            <view class="tags">
              <text class="tag" v-for="(tag, index) in item.labels" :key="index">{{ tag }}</text>
            </view>
            <view class="price">已赚 ￥{{ item.up_price }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { get_userList } from '@/api/surplus/surplus'
import Header from '@/components/header.vue'

const recordList = ref([])

// 获取销售记录
const getData = () => {
  // TODO
  // const list = [
  //   {
  //     id: 1,
  //     user: '张三',
  //     avatar: 'https://source.unsplash.com/random?1',
  //     path: 'https://source.unsplash.com/random?1',
  //     name: '墨西哥牛油果',
  //     size: '100g',
  //     number: 1,
  //     price: 100,
  //     tags: ['新鲜', '热卖']
  //   },
  //   {
  //     id: 2,
  //     user: '李四',
  //     avatar: 'https://source.unsplash.com/random?1',
  //     path: 'https://source.unsplash.com/random?2',
  //     name: '墨西哥牛油果',
  //     size: '200g',
  //     number: 2,
  //     price: 200,
  //     tags: ['新鲜', '热卖']
  //   },
  //   {
  //     id: 3,
  //     user: '王五',
  //     avatar: 'https://source.unsplash.com/random?1',
  //     path: 'https://source.unsplash.com/random?3',
  //     name: '墨西哥牛油果',
  //     size: '300g',
  //     number: 3,
  //     price: 300,
  //     tags: ['新鲜', '热卖']
  //   },
  //   {
  //     id: 4,
  //     user: '赵六',
  //     avatar: 'https://source.unsplash.com/random?1',
  //     path: 'https://source.unsplash.com/random?4',
  //     name: '墨西哥牛油果',
  //     size: '400g',
  //     number: 4,
  //     price: 400,
  //     tags: ['新鲜', '热卖']
  //   }
  // ]
  get_userList().then(res => {
    console.log(res)
    recordList.value = res.data.data
  })
}

onShow(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.all {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background: #F7F7F7;
  padding: 120rpx 0 50rpx;

  .item {
    width: 90%;
    margin-top: 50rpx;

    .user {
      display: flex;
      align-items: center;
      margin-bottom: 5rpx;
    }

    .main {
      width: 100%;
      padding: 30rpx;
      background: #FFFFFF;
      display: flex;
      align-items: center;

      .right {
        display: flex;
        flex-direction: column;
        align-items: start;
        margin-left: 30rpx;

        .name {
          font-family: Inter, Inter;
          font-weight: 600;
          font-size: 29rpx;
          color: #000000;
          line-height: 43rpx;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }

        .size {
          font-family: Inter, Inter;
          font-weight: 400;
          font-size: 25rpx;
          color: #9F9F9F;
          line-height: 38rpx;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }

        .number {
          font-family: Inter, Inter;
          font-weight: 400;
          font-size: 25rpx;
          color: #9F9F9F;
          line-height: 38rpx;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }

        .bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 450rpx;

          .tags {
            display: flex;
            align-items: center;
            justify-content: start;
            flex-wrap: wrap;
            max-width: 200rpx;

            .tag {
              max-width: 200rpx;
              padding: 3rpx 10rpx;
              background: #FAEBD9;
              border-radius: 6rpx 6rpx 6rpx 6rpx;
              font-family: Inter, Inter;
              font-weight: 500;
              font-size: 17rpx;
              color: #A79A77;
              line-height: 26rpx;
              text-align: center;
              font-style: normal;
              text-transform: none;
              margin-right: 10rpx;
              margin-bottom: 10rpx;
            }
          }

          .price {
            font-family: Inter, Inter;
            font-weight: 700;
            font-size: 35rpx;
            color: #997D5D;
            line-height: 43rpx;
            text-align: right;
            font-style: normal;
            text-transform: none;
          }
        }
      }
    }
  }
}
</style>