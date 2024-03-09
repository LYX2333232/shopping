<template>
  <Header title="限时秒杀" />
  <view class="all">
    <view class="background" />
    <view class="top">
      <TnScrollList :indicator="false">
        <view class="item-container">
          <view class="main">
            <image
              :src="mainCard.img"
              style="width: 300rpx;height: 300rpx;"
              mode="scaleToFill"
            />
            <view class="tn-flex-center-start">
              <image
                :src="mainCard.subImg"
                mode="scaleToFill"
                style="width: 70rpx;height: 70rpx;margin: 15rpx;"
              />
              <view class="mainText">
                <view class="main_title">{{ mainCard.title }}</view>
                <view class="main_price">
                  ￥ {{ mainCard.price }}
                </view>
                <view class="tn-flex-center-start">
                    <TnLineProgress style="width: 150rpx;" :percent="mainCard.saled" active-color="#834820"/>
                  <view class="main_done">已抢{{ mainCard.saled }}%</view>
                </view>
              </view>
            </view>
          </view>
          <view v-for="(item,index) in subCard" :key="'subCard'+index" class="sub">
              <image
              :src="mainCard.img"
              style="width: 240rpx;height: 240rpx;"
              mode="scaleToFill"
            />
            <view class="tn-flex-center-start">
              <image
                :src="mainCard.subImg"
                mode="scaleToFill"
                style="width: 60rpx;height: 60rpx;margin: 15rpx;"
              />
              <view class="subText">
                <view class="sub_title">{{ mainCard.title }}</view>
                <view class="sub_price">
                  ￥ {{ mainCard.price }}
                </view>
                <view class="tn-flex-center-start">
                    <TnLineProgress style="width: 120rpx;" :percent="mainCard.saled" active-color="#834820"/>
                  <view class="sub_done">已抢{{ mainCard.saled }}%</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </TnScrollList>
    </view>
    <view v-for="(item,index) in items" :key="'item'+index" class="item">
      <image
        :src="item.img"
        mode="scaleToFill"
        style="width:200rpx;height:160rpx"
      />
      <view class="right">
        <view class="item_name">{{ item.name }} </view>
        <view class="tn-flex-center-between" style="width: 400rpx">
          <view>
            <view class="tn-flex-center-start">
              <view class="item_price">
                ￥ {{ item.price }}
              </view>
              <view class="item_old_price">
                原价：{{ item.old_price }}
              </view>
            </view>
            <view class="last">
              仅剩
              <text style="color: #834820">{{ item.last }}</text>
              件
            </view>
          </view>
          <view>
            <TnButton width="140" height="40" shape="round" bg-color="#C8B697" text-color="#FFFFFF">马上抢</TnButton>
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
import TnScrollList from '@/uni_modules/tuniaoui-vue3/components/scroll-list/src/scroll-list.vue'
import TnLineProgress from '@/uni_modules/tuniaoui-vue3/components/line-progress/src/line-progress.vue'
import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'

const mainCard = ref({})
const subCard = ref([])
const items = ref([])

const getData = () => {
  // 获取数据
  const main = {
    img: 'https://img.yzcdn.cn/vant/apple-1.jpg',
    subImg:'https://img.yzcdn.cn/vant/apple-2.jpg',
    title: '休闲芒果干大礼包休闲芒果干大礼包休闲芒果干大礼包休闲芒果干大礼包',
    price: 100,
    saled: 50
  }
  const sub = [
    {
      img: 'https://img.yzcdn.cn/vant/apple-2.jpg',
      subImg:'https://img.yzcdn.cn/vant/apple-3.jpg',
      title: '休闲芒果干大礼包休闲芒果干大礼包休闲芒果干大礼包休闲芒果干大礼包',
      price: 100,
      saled: 50
    },
    {
      img: 'https://img.yzcdn.cn/vant/apple-3.jpg',
      subImg: 'https://img.yzcdn.cn/vant/apple-4.jpg',
      title: '休闲芒果干大礼包休闲芒果干大礼包休闲芒果干大礼包休闲芒果干大礼包',
      price: 100,
      saled: 50
    },
    {
      img: 'https://img.yzcdn.cn/vant/apple-4.jpg',
      subImg: 'https://img.yzcdn.cn/vant/apple-5.jpg',
      title: '休闲芒果干大礼包休闲芒果干大礼包休闲芒果干大礼包休闲芒果干大礼包',
      price: 100,
      saled: 50
    }
  ]
  const item = [
    {
      img: 'https://img.yzcdn.cn/vant/apple-1.jpg',
      name: '智利车厘子1000g（当季限定）',
      price: 199,
      old_price: 299,
      last: 100
    },
    {
      img: 'https://img.yzcdn.cn/vant/apple-2.jpg',
      name: '智利车厘子1000g（当季限定）',
      price: 199,
      old_price: 299,
      last: 100
    },
    {
      img: 'https://img.yzcdn.cn/vant/apple-3.jpg',
      name: '智利车厘子1000g（当季限定）',
      price: 199,
      old_price: 299,
      last: 100
    },
    {
      img: 'https://img.yzcdn.cn/vant/apple-4.jpg',
      name: '智利车厘子1000g（当季限定）',
      price: 199,
      old_price: 299,
      last: 100
    },
    {
      img: 'https://img.yzcdn.cn/vant/apple-5.jpg',
      name: '智利车厘子1000g（当季限定）',
      price: 199,
      old_price: 299,
      last: 100
    }
  ]
  mainCard.value = main
  subCard.value = sub
  items.value = item
}

onShow(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.all{
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background: #F7F7F7;
  z-index: -2;
}

.background{
  position: absolute;
  top: 0;
  width: 100%;
  height: 400rpx;
  background-color: #F9E9CC;
  z-index: -1;
}
.top{
  width: 100vw;
  padding: 200rpx 0 0;
  background: none;
  .item-container {
    position: relative;
    width: fit-content;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
  .main{
    margin-left: 20rpx;
    width: 300rpx;
    background: #FFFFFF;
    .mainText{
      width: 200rpx;
      text-align: left;
      .main_title{
        font-family: Inter, Inter;
        font-weight: 500;
        font-size: 19rpx;
        color: #000000;
        line-height: 29rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .main_price{
        font-family: Inter, Inter;
        font-weight: normal;
        font-size: 19rpx;
        color: #834820;
        line-height: 29rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .main_done{
        font-family: Inter, Inter;
        font-weight: 500;
        font-size: 10rpx;
        color: #834820;
        line-height: 14rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
  }

  .sub{
    margin-left: 20rpx;
    width: 240rpx;
    background: #FFFFFF;
    .subText{
      width: 180rpx;
      text-align: left;
      .sub_title{
        font-family: Inter, Inter;
        font-weight: 500;
        font-size: 15rpx;
        color: #000000;
        line-height: 29rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .sub_price{
        font-family: Inter, Inter;
        font-weight: normal;
        font-size: 15rpx;
        color: #834820;
        line-height: 29rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .sub_done{
        font-family: Inter, Inter;
        font-weight: 500;
        font-size: 6rpx;
        color: #834820;
        line-height: 14rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
  }
}

.item{
  width: 90%;
  margin: 0 auto;
  padding: 20rpx 0;
  display: flex;
  .right{
    margin-left: 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 160rpx;
    .item_name{
      font-family: Inter, Inter;
      font-weight: 500;
      font-size: 27rpx;
      color: #000000;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    .item_price{
      font-family: Inter, Inter;
      font-weight: normal;
      font-size: 30rpx;
      color: #834820;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    .item_old_price{
      margin-left: 25rpx;
      font-family: Inter, Inter;
      font-weight: 400;
      font-size: 20rpx;
      color: #767676;
      line-height: 35rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
      text-decoration: line-through;
    }
    .last{
      font-family: Inter, Inter;
      font-weight: 800;
      font-size: 27rpx;
      color: #000000;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>