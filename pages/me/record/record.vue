<template>
  <Header title="销售记录"></Header>
  <view class="all">
    <view class="item" v-for="item in recordList" :key="item.id">
      <view class="user">
        <text>分销用户:</text>
        <image :src="item.avatar" mode="scaleToFill" class="avatar" />
        <text>{{ item.user_name }}</text>
      </view>
      <view class="main" v-for="good in item.goods" :key="good.id">
        <image
          :src="good.path"
          mode="scaleToFill"
          style="width: 160rpx; height: 160rpx; border-radius: 15rpx"
        />
        <view class="right">
          <text class="name">{{ good.name }}</text>
          <text class="size">{{ good.item_name }}</text>
          <text class="number">x{{ good.cont }}</text>
          <view class="bottom">
            <view class="tags">
              <!-- <text class="tag" v-for="(tag, index) in good.labels" :key="index">{{ tag }}</text> -->
              <TnTag
                bg-color="#14BF20"
                text-color="#FFF"
                :custom-style="{ marginRight: '10rpx' }"
                v-for="(tag, index) in good.labels"
                :key="index"
              >
                {{ tag }}</TnTag
              >
            </view>
            <view class="price">已赚 ￥{{ good.up_price }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue"
import { onShow } from "@dcloudio/uni-app"
import TnTag from "@tuniao/tnui-vue3-uniapp/components/tag/src/tag.vue"
import { get_userList } from "@/api/surplus/surplus"
import Header from "@/components/header.vue"

const recordList = ref([])

// 获取销售记录
const getData = () => {
  get_userList().then((res) => {
    recordList.value = res.data.data
    recordList.value.push(
      {
        id: 1,
        user_name: "张三",
        avatar: "https://picsum.photos/50/50",
        goods: [
          {
            id: 1,
            name: "商品名称",
            item_name: "商品规格",
            path: "https://picsum.photos/160/160",
            cont: 1,
            labels: ["标签1", "标签2"],
            up_price: 10,
          },
          {
            id: 2,
            name: "商品名称",
            item_name: "商品规格",
            path: "https://picsum.photos/160/160",
            cont: 1,
            labels: ["标签1", "标签2"],
            up_price: 10,
          },
        ],
      },
      {
        id: 2,
        user_name: "李四",
        avatar: "https://picsum.photos/50/50",
        goods: [
          {
            id: 2,
            name: "商品名称",
            item_name: "商品规格",
            path: "https://picsum.photos/160/160",
            cont: 1,
            labels: ["标签1", "标签2"],
            up_price: 10,
          },
        ],
      }
    )
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
  background: #f7f7f7;
  padding: 120rpx 20rpx 50rpx;

  .item {
    width: 100%;
    margin-top: 50rpx;

    .user {
      display: flex;
      align-items: center;
      margin-bottom: 5rpx;

      .avatar {
        margin: 0 10rpx;
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
      }
    }

    .main {
      width: 100%;
      padding: 30rpx;
      background: #ffffff;
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
          color: #9f9f9f;
          line-height: 38rpx;
          text-align: center;
          font-style: normal;
          text-transform: none;
        }

        .number {
          font-family: Inter, Inter;
          font-weight: 400;
          font-size: 25rpx;
          color: #9f9f9f;
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
          }

          .price {
            font-family: Inter, Inter;
            font-weight: 700;
            font-size: 35rpx;
            color: #ee2532;
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
