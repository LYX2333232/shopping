<template>
  <Header title="我的收藏" />
  <view class="all">
    <view class="item" v-for="item in   list  " :key="item.id">
      <image :src="item.path" style="height:100%;max-width:200rpx;border-radius:15rpx;margin-right:30rpx;"
        mode="scaleToFill" />
      <view class="right">
        <view style="margin-bottom:50rpx;">
          <view class="title">{{ item.name }} </view>
          <view class="number">{{ item.collection_count }}人已收藏 </view>
        </view>
        <view class="tn-flex-center-between" style="width:380rpx;">
          <view>
            <TnTag :custom-style="{ marginRight: '10rpx' }" v-for="tag in item.tags" :key="tag.id" bg-color="#FAEBD9"
              text-color="#A79A77" width="100">
              {{ tag }}
            </TnTag>
          </view>
          <view class="price">
            ￥ {{ item.price }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import Header from '@/components/header.vue'
import TnTag from '@/uni_modules/tuniaoui-vue3/components/tag/src/tag.vue'
import { get_favorite_list } from '@/api/goods/goods'

const list = ref([])

const getData = () => {
  // const data = [
  //   {
  //     id: 1,
  //     path: 'https://source.unsplash.com/random',
  //     title: '【限时抢购】华为mate40pro 5G 8GB+256GB 5G手机',
  //     number: 100,
  //     tags: ['手机', '华为'],
  //     price: 9999
  //   },
  //   {
  //     id: 2,
  //     path: 'https://source.unsplash.com/random',
  //     title: '【限时抢购】华为mate40pro 5G 8GB+256GB 5G手机',
  //     number: 100,
  //     tags: ['手机', '华为'],
  //     price: 9999
  //   }
  // ]
  get_favorite_list().then(res => {
    console.log(res)
    list.value = res.data.data
  })
  // list.value = data
}

onShow(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: #F7F7F7;
  padding-top: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .item {
    width: 90%;
    display: flex;
    align-items: stretch;
    background: #FFF;
    margin-bottom: 20rpx;
    padding: 30rpx;
    border-radius: 15rpx;

    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;


      .title {
        font-family: Inter, Inter;
        font-weight: 800;
        font-size: 30rpx;
        color: #000000;
        text-align: left;
      }

      .number {
        font-family: Inter, Inter;
        font-weight: 400;
        font-size: 20rpx;
        color: #9F9F9F;
        line-height: 38rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }

      .price {
        font-family: Inter, Inter;
        font-weight: 500;
        font-size: 40rpx;
        color: #834820;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
  }
}
</style>