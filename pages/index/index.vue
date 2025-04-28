<template>
  <view class="all">
    <view class="contain">
      <!-- ! 旧版头部 -->
      <!-- <view class="map" @click="address_visible = true">
        <TnIcon name="map" size="40" />
        <view class="text">
          {{ address.address ?? "定位失败" }}
        </view>
        <TnIcon name="down" size="40" />
      </view>
      <view class="tab">
        <view class="pic">
          <image src="/static/index/title.png" mode="scaleToFill" />
        </view>
        <view class="search" @click="toSearch">
          <view style="flex: 1">
            <TnIcon name="search" size="40" />
          </view>
          <input style="flex: auto" type="text" disabled />
          <view>
            <TnButton type="success" shape="round">搜索</TnButton>
          </view>
        </view>
      </view> -->
      <TnSwiper
        loop
        autoplay
        :data="swiperData"
        width="100%"
        height="960"
        indicator
        indicator-type="dot"
        indicator-active-bg-color="#FFF"
        indicator-bg-color="rgba(255,255,255,0.6)"
        @item-click="toWeb"
      >
        <template #default="{ data }">
          <view class="swiper-data">
            <image :src="data.path" mode="scaleToFill"></image>
          </view>
        </template>
      </TnSwiper>
      <view class="absolute" :style="{ top: `${top}px` }">
        <image class="logo" :src="`${preUrl}logo.png`" mode="aspectFill">
        </image>
        <view class="search" @click="toSearch">
          <view style="flex: 1">
            <TnIcon name="search" size="40" />
          </view>
          <input style="flex: auto" type="text" disabled />
          <view>
            <TnButton type="success" shape="round">搜索</TnButton>
          </view>
        </view>
      </view>
      <view class="description">
        <view class="item">
          <TnIcon :name="`${preUrl}self.png`" size="25" />
          <view style="margin-left: 20rpx"> 官方自营 </view>
        </view>
        <view class="item">
          <TnIcon :name="`${preUrl}time.png`" size="25" />
          <view style="margin-left: 20rpx"> 同城48小时送达 </view>
        </view>
        <view class="item">
          <TnIcon :name="`${preUrl}sale.png`" size="25" />
          <view style="margin-left: 20rpx"> 售后无忧 </view>
        </view>
      </view>
      <view class="functions">
        <image
          class="item"
          v-for="(_, index) in 4"
          :src="`${preUrl}item${index}.png`"
          :key="index"
          @click="top_button(index)"
        />
      </view>
      <view class="seckill" v-if="seckill_list.length > 0" @click="toSeckill">
        <view
          class="top"
          :style="{
            background: `url(${preUrl}seckill.png) no-repeat`,
            backgroundSize: '100%',
          }"
        >
          时间还剩：
          <TnCountDown
            :time="2000"
            text-color="#fafff0"
            separator-color="#fafff0"
          />
        </view>
        <view class="items">
          <view v-for="card in seckill_list" :key="card.id" class="item">
            <view class="left">
              <view class="name">
                {{ card.name }}
              </view>
              <view class="desc">
                {{
                  card.label?.map((item) => (item ? item.text : "")).join(" ")
                }}
              </view>
              <view class="tn-flex-center-start tn-mt-10 tn-mb-20">
                <view class="flash"> ￥{{ card.flash_price }} </view>
                <view class="size">/{{ card.item_name }}</view>
              </view>
              <button>立即购买</button>
              <!-- <view class="old"> ￥{{ card.price }} </view> -->
            </view>
            <image :src="card.path" mode="scaleToFill" class="image" />
          </view>
        </view>
      </view>
      <view class="hot">
        <view
          class="top"
          :style="{
            background: `url(${preUrl}hot.png) no-repeat`,
            backgroundSize: '100%',
          }"
        >
          实实在在的口碑之选
        </view>
        <view class="items">
          <view
            v-for="card in hot_list"
            :key="card.id"
            class="item"
            @click="toDetail(card.id)"
          >
            <view class="left">
              <view class="name">
                {{ card.name }}
              </view>
              <view class="desc">
                {{
                  card.label?.map((item) => (item ? item.text : "")).join(" ")
                }}
              </view>
              <view class="tn-flex-center-start tn-mt-10 tn-mb-20">
                <view class="flash"> ￥{{ card.price }} </view>
                <view class="size">/{{ card.item_name }}</view>
              </view>
              <button>立即购买</button>
              <!-- <view class="old"> ￥{{ card.price }} </view> -->
            </view>
            <image :src="card.path" mode="aspectFit" class="image" />
          </view>
        </view>
      </view>
      <view class="must">
        <view
          class="top"
          :style="{
            background: `url(${preUrl}must.png)`,
            backgroundSize: '100%',
          }"
        >
          跟榜买 不会错！
        </view>
        <view class="main-must" @click="toDetail(must_title.c_id)">
          <image class="background" :src="must_title.img" mode="aspectFill">
          </image>
          <view class="mask"></view>
          <view class="price">
            <view class="name">{{ must_title.name }}</view>
            <view class="flash"> {{ must_title.price }}元 </view>
          </view>
        </view>
        <view class="items">
          <view
            class="item"
            v-for="card in must_list"
            :key="card.id"
            @click="toDetail(card.id)"
          >
            <image class="image" :src="card.path" mode="aspectFit"> </image>
            <view class="name">
              {{ card.name }}
            </view>
            <view class="price">
              <view class="flash"> {{ card.price }}/{{ card.item_name }} </view>
              <image class="buy" :src="`${preUrl}buy.png`"> </image>
            </view>
          </view>
        </view>
      </view>
      <!-- !旧UI -->
      <!-- <view class="today" v-if="today_list.length > 0" @click="toToday">
        <view class="more">
          <view style="z-index: 2"> 查看更多 </view>
          <view class="icon">></view>
        </view>
        <view class="item" v-for="item in today_list" :key="item.id">
          <image :src="item.path" mode="scaleToFill" class="image" />
          <view>
            <view class="name">
              {{ item.name }}
            </view>
            <view class="doing">
              <image
                :src="image.avatar"
                mode="scaleToFill"
                v-for="image in item.seng"
                :key="image.id"
                class="avatar"
              />
              已有{{ item.seng_count }}人拼团
            </view>
            <TnTag
              font-size="22"
              border
              bg-color="transparent"
              text-color="#FF1F25"
              border-color="#FF1F25"
              shape="circle"
            >
              立省{{ (item.teamwork_price - item.price).toFixed(2) }}元
            </TnTag>
            <view class="bottom">
              <view class="left">
                <view class="price">
                  拼团价￥
                  <text style="font-size: 25rpx">{{ item.price }}</text>
                </view>
                <view class="old"> ￥{{ item.teamwork_price }} </view>
              </view>
              <view class="button"> 立即拼团 </view>
            </view>
          </view>
        </view>
      </view> -->
      <!-- <TnWaterFall :data="infoList">
        <template #left="{ item }">
          <view class="block3" @click="toDetail(item.id)">
            <image :src="item.path" mode="aspectFit" class="image"></image>
            <view class="name">
              {{ item.name }}
            </view>
            <view class="good-desc">
              {{ item.desc }}
            </view>
            <view class="bottom">
              <view class="left">
                <view class="price"> ¥{{ item.price }} </view>
                <view v-if="item.or_price" class="old">
                  ￥{{ item.or_price }}
                </view>
              </view>
              <TnButton
                icon="cart"
                type="success"
                shape="circle"
                font-size="40"
              ></TnButton>
            </view>
          </view>
        </template>
        <template #right="{ item }">
          <view class="block3" @click="toDetail(item.id)">
            <image :src="item.path" mode="aspectFit" class="image"></image>
            <view class="name">
              {{ item.name }}
            </view>
            <view class="good-desc">
              {{ item.desc }}
            </view>
            <view class="bottom">
              <view class="left">
                <view class="price"> ¥{{ item.price }} </view>
                <view v-if="item.or_price" class="old">
                  ￥{{ item.or_price }}
                </view>
              </view>
              <TnButton
                icon="cart"
                type="success"
                shape="circle"
                font-size="40"
              ></TnButton>
            </view>
          </view>
        </template>
      </TnWaterFall> -->
      <view class="title">森美精选好物</view>
      <view
        class="info"
        v-for="item in infoList"
        :key="item.id"
        @click="toDetail(item.id)"
      >
        <image class="image" :src="item.path" mode="aspectFill"> </image>
        <view class="right">
          <view>
            <view class="name">{{ item.name }}</view>
            <view class="desc">
              {{ item.label?.map((item) => (item ? item.text : "")).join(" ") }}
            </view>
          </view>
          <view class="tn-flex-center-between">
            <view class="tn-flex-center-start">
              <view class="price"> ￥{{ item.price }} </view>
              <view class="old" v-if="item.or_price">
                ￥{{ item.or_price }}
              </view>
            </view>
            <image class="cart" :src="`${preUrl}cart.png`"> </image>
          </view>
        </view>
      </view>
    </view>
    <view class="VIP_view" v-if="VIP_visible">
      <view class="close" @click="VIP_visible = false">
        <TnIcon name="close" color="#FFF" size="30rpx" />
      </view>
      <button class="no_button" open-type="contact">
        <image class="VIP" :src="VIP" mode="aspectFit"> </image>
      </button>
    </view>
    <!-- <AddressPopup
      :visible="address_visible"
      @close="address_visible = false"
    /> -->
  </view>
</template>

<script setup>
import TnSwiper from "@/uni_modules/tuniaoui-vue3/components/swiper/src/swiper.vue"
import TnIcon from "@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue"
import TnButton from "@/uni_modules/tuniaoui-vue3/components/button/src/button.vue"
import TnCountDown from "@/uni_modules/tuniaoui-vue3/components/count-down/src/count-down.vue"
import { ref } from "vue"
import {
  onReachBottom,
  onShareAppMessage,
  onShareTimeline,
  onLoad,
} from "@dcloudio/uni-app"

import AddressPopup from "@/components/AddressPopup"
import { AddressStore } from "@/store"
import { get_home, get_commodity } from "@/api/index"
// import { get_today_list } from "@/api/index/today/today"
import { getRandomImage } from "@/utils/constant"

const preUrl = import.meta.env.VITE_BASE_URL + "/mini_app/static/index/"

const VIP =
  "http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhR0plibtQOMrUJ4Dz7ibKHmkdbjMxvh0aszJibS4uLXx2BHNic33zhvIn40jQiaVW9hPXiaaSFOymIpk23Q/0?wx_fmt=png"

const address = AddressStore()
const address_visible = ref(false)
// 轮播图数据
const swiperData = ref([])

const toWeb = (value) => {
  console.log(value)
  uni.navigateTo({
    url: "/pages/web/index?src=" + swiperData.value[value].path,
  })
}

// 顶部的按钮
const top_button = async (index) => {
  if (index === 3)
    uni.navigateTo({
      url: "/pages/index/coupon/index",
    })
  else {
    uni.setStorageSync("index", index)
    uni.switchTab({
      url: "/pages/goods/goods",
    })
  }
}

// 秒杀商品
const seckill_list = ref([])

const toSeckill = () =>
  uni.navigateTo({
    url: "/pages/index/seckill/index",
  })

// 热卖商品
const hot_list = ref([])

// 必吃商品
const must_list = ref([])
const must_title = ref({})

// 今日开团商品
// const today_list = ref([])

// const toToday = () =>
//   uni.navigateTo({
//     url: "/pages/index/today/index",
//   })

// 底部推荐商品
const infoList = ref()

const toDetail = (id) => {
  console.log(id)
  uni.navigateTo({
    url: "/pages/goods/goods_detail?id=" + id,
  })
}

const getData = () => {
  get_home().then((res) => {
    swiperData.value = res.data.swiper
    seckill_list.value = res.data.flash_commodity
    // 静态数据
    // hot_list.value = [
    //   {
    //     id: 1,
    //     name: "苹果",
    //     path: getRandomImage(),
    //     flash_price: 100,
    //     price: 150,
    //     item_name: "1kg/袋",
    //   },
    //   {
    //     id: 2,
    //     name: "雪梨",
    //     path: getRandomImage(),
    //     flash_price: 100,
    //     price: 150,
    //     item_name: "1kg/袋",
    //   },
    //   {
    //     id: 3,
    //     name: "葡萄",
    //     path: getRandomImage(),
    //     flash_price: 100,
    //     price: 150,
    //     item_name: "1kg/袋",
    //   },
    // ]
    hot_list.value = res.data.hot
    must_list.value = [
      {
        id: 1,
        name: "商品1sjdhgkjfdnbgkfjhgfndkjhgfgoijgihnjdkghfdjk,ghdjklgdfn",
        price: 100,
        path: getRandomImage(),
      },
      {
        id: 2,
        name: "商品1",
        price: 100,
        path: getRandomImage(),
      },
      {
        id: 3,
        name: "商品1",
        price: 100,
        path: getRandomImage(),
      },
      {
        id: 4,
        name: "商品1",
        price: 100,
        path: getRandomImage(),
      },
    ]
    must_list.value = res.data.must_eat.commoditys
    must_title.value = { ...res.data.must_eat }
  })
  get_commodity({ ids: [] }).then((res) => {
    infoList.value = res.data.data
  })
  // get_today_list(1).then((res) => {
  //   // 最多获取两个
  //   today_list.value = res.data.data.slice(0, 2)
  // })
}

// 点击输入框
const toSearch = () => {
  uni.navigateTo({
    url: "/pages/index/search/index",
  })
}

const VIP_visible = ref(true)

var top = ref(0)

onLoad(() => {
  // 获取状态栏高度
  top.value = uni.getMenuButtonBoundingClientRect().top
  getData()
})
onReachBottom(() => {
  const data = {
    ids: infoList.value.map((item) => item.id),
  }
  get_commodity(data).then((res) => {
    infoList.value = infoList.value.concat(res.data.data)
  })
})

onShareAppMessage(() => {
  return {
    title: "森美臻品",
    path: "/pages/index/index",
  }
})

onShareTimeline(() => {
  return {
    title: "森美臻品",
    path: "/pages/index/index",
  }
})
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: #f6f6f6;
  z-index: 0;
}

//  旧版背景
// .all::before {
//   content: "";
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 500rpx;
//   background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhSVIHwxfRM3wibsshXu5Wh1aanKIwgD6RgKjISicMREfe4cYpZGbfkQqgYMwHqOkI5DMHWckibTYCeJA/0?wx_fmt=png")
//     no-repeat;
//   background-size: 100% auto;
//   z-index: -1;
// }

.contain {
  width: 100%;
  background: transparent;
  z-index: 2;
}

// 旧版头部
// .map {
//   display: flex;
//   align-items: center;

//   .text {
//     max-width: 333rpx;
//     //设置超出长度时用省略号表示
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     z-index: 1;
//   }
// }

// .tab {
//   width: 100%;
//   margin: 36rpx 0 20rpx;
//   display: flex;
//   align-items: center;

//   .pic {
//     width: 162rpx;
//     height: 40rpx;
//     margin-right: 17rpx;
//   }

// }

.swiper-data {
  width: 100%;
  height: 100%;

  .image {
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
}

.absolute {
  position: absolute;
  left: 20rpx;
  .logo {
    width: 162rpx;
    height: 40rpx;
    margin-bottom: 24rpx;
  }
  .search {
    display: flex;
    align-items: center;
    width: 710rpx;
    background: #fff;
    border-radius: 40rpx;
    padding: 10rpx 20rpx;
  }
}

.description {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 22rpx 0;
  padding: 0 20rpx;
  color: #878787;

  .item {
    vertical-align: middle;
    display: flex;
    align-items: center;
    font-size: 25rpx;
  }
}

.functions {
  margin-top: 30rpx;
  display: flex;
  align-items: center;

  .item {
    width: 162rpx;
    height: 202rpx;
    margin-left: 21rpx;
  }
}

.seckill {
  margin: 20rpx auto;
  width: 710rpx;
  // 旧背景
  // background: url('http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQALAl1LiaicbL5icnESbI4SrzibNddNnPdXOx9x0xhMQ0qZqC16ib9gS6UibSa3kbofcg2cYEVj58NU3gw/0?wx_fmt=png') no-repeat center center;
  // background-size: 100% 100%;
  background: #e5f3cc;
  z-index: 1;

  .top {
    height: 90rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    padding: 10rpx 64rpx 28rpx 400rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #fafff0;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
    z-index: 2;
  }

  .items {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .item {
      width: 670rpx;
      background: #ffffff;
      display: flex;
      align-items: center;
      padding: 32rpx 0 32rpx 30rpx;
      margin-bottom: 20rpx;

      .left {
        width: 300rpx;
        .name {
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 500;
          font-size: 38rpx;
          color: #1f2024;
          line-height: 57rpx;
          text-align: left;
          font-style: normal;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .desc {
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 26rpx;
          color: #1f2024;
          line-height: 39rpx;
          text-align: left;
          font-style: normal;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .flash {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          font-size: 40rpx;
          color: #ee2532;
          line-height: 56rpx;
          text-align: left;
          font-style: normal;
        }
        .size {
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 500;
          font-size: 28rpx;
          color: #1f2024;
          line-height: 42rpx;
          text-align: left;
          font-style: normal;
        }
        button {
          width: 250rpx;
          height: 56rpx;
          background: linear-gradient(270deg, #fa2c1b 0%, #ff6b15 100%);
          border-radius: 28rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 500;
          font-size: 30rpx;
          color: #ffffff;
          line-height: 45rpx;
          text-align: left;
          font-style: normal;
        }
      }

      .image {
        margin-left: 71rpx;
        width: 280rpx;
        height: 250rpx;
        flex-shrink: 0;
      }
    }
  }
}

.hot {
  margin: 20rpx auto;
  width: 710rpx;
  background: #ffe4d3;

  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rpx 71rpx 28rpx 387rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
  }

  .items {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .item {
      width: 670rpx;
      background: #ffffff;
      display: flex;
      align-items: center;
      padding: 32rpx 0 32rpx 30rpx;
      margin-bottom: 20rpx;

      .left {
        width: 300rpx;
        .name {
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 500;
          font-size: 38rpx;
          color: #1f2024;
          line-height: 57rpx;
          text-align: left;
          font-style: normal;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .desc {
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 26rpx;
          color: #1f2024;
          line-height: 39rpx;
          text-align: left;
          font-style: normal;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .flash {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          font-size: 40rpx;
          color: #ee2532;
          line-height: 56rpx;
          text-align: left;
          font-style: normal;
        }
        .size {
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 500;
          font-size: 28rpx;
          color: #1f2024;
          line-height: 42rpx;
          text-align: left;
          font-style: normal;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        button {
          width: 250rpx;
          height: 56rpx;
          background: linear-gradient(270deg, #fa2c1b 0%, #ff6b15 100%);
          border-radius: 28rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 500;
          font-size: 30rpx;
          color: #ffffff;
          line-height: 45rpx;
          text-align: left;
          font-style: normal;
        }
      }

      .image {
        margin-left: 71rpx;
        width: 280rpx;
        height: 250rpx;
        flex-shrink: 0;
      }
    }
  }
}

.must {
  margin: 20rpx auto;
  width: 710rpx;
  background: #e5f3cc;
  display: flex;
  flex-direction: column;
  align-items: center;
  .top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rpx 92rpx 28rpx 412rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;
  }

  .main-must {
    width: 670rpx;
    height: 420rpx;
    border-radius: 10rpx;
    position: relative;
    .background {
      width: 100%;
      height: 100%;
    }
    .mask {
      width: 100%;
      height: 100%;
      //添加一个蒙层，让无论什么背景都能看得到文字
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, #000000 100%);
      position: absolute;
      top: 0;
      z-index: 1;
    }
    .price {
      position: absolute;
      left: 0;
      top: 271rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
      .name {
        max-width: 240rpx;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 500;
        font-size: 38rpx;
        color: #ffffff;
        line-height: 57rpx;
        text-align: left;
        font-style: normal;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .flash {
        width: 240rpx;
        height: 69rpx;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 500;
        font-size: 40rpx;
        color: #ee2532;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
      }
    }
  }

  .items {
    width: 690rpx;
    margin: 20rpx auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 11rpx;
    .item {
      margin-bottom: 10rpx;
      width: 216rpx;
      padding: 10rpx;
      background: #ffffff;
      border-radius: 20rpx;

      .image {
        width: 100%;
        height: 196rpx;
      }
      .name {
        max-width: 100%;
        margin: 12rpx 0;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #1f2024;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .price {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .flash {
          font-family: PingFangSC, PingFang SC;
          font-weight: 600;
          font-size: 30rpx;
          color: #ee2532;
          line-height: 42rpx;
          text-align: left;
          font-style: normal;
          width: 60%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .buy {
          width: 48rpx;
          height: 48rpx;
          flex-shrink: 0;
        }
      }
    }
  }
}

.title {
  margin: 30rpx 20rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  font-size: 36rpx;
  color: #131313;
  line-height: 50rpx;
  text-align: left;
  font-style: normal;
}

.info {
  margin: 20rpx auto;
  width: 710rpx;
  background: #fff;
  padding: 20rpx;
  display: flex;
  align-items: stretch;
  .image {
    width: 220rpx;
    height: 220rpx;
    border-radius: 16rpx;
    margin-right: 20rpx;
  }
  .right {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name {
      // 文字最多两行显示，超出的用省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 28rpx;
      color: #333333;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
    }

    .desc {
      margin-bottom: 10rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 33rpx;
      text-align: left;
      font-style: normal;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .price {
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      font-size: 36rpx;
      color: #ee2532;
      line-height: 50rpx;
      text-align: left;
      font-style: normal;
    }
    .old {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      color: #999999;
      line-height: 33rpx;
      text-align: left;
      font-style: normal;
      text-decoration-line: line-through;
    }
    .cart {
      width: 56rpx;
      height: 56rpx;
    }
  }
}

.VIP_view {
  position: fixed;
  right: 20rpx;
  top: 50vh;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .close {
    margin-bottom: 20rpx;
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    background: rgba($color: #000000, $alpha: 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .no_button {
    //去除按钮默认样式
    all: unset; /* 清除所有默认样式 */
    display: block; /* 根据需要设置显示方式 */
    width: auto; /* 自定义宽度 */
    height: auto; /* 自定义高度 */
    background: none; /* 移除背景 */
    border: none; /* 移除边框 */
    padding: 0; /* 移除内边距 */
    margin: 0; /* 移除外边距 */
    color: inherit; /* 继承字体颜色 */
    font: inherit; /* 继承字体样式 */
    text-align: inherit; /* 继承文本对齐方式 */
  }

  .VIP {
    width: 130rpx;
    height: 130rpx;
  }
}

// .today {
//   width: 100%;
//   padding-bottom: 20rpx;
//   margin: 20rpx 0;
//   position: relative;
//   //background: url('/static/index/today.png') no-repeat;
//   background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQALAl1LiaicbL5icnESbI4SrzswCuasDY4EnFHhbW5wsBg1ne1icRDZno0yojCJRJLsux4EI3LNd080A/0?wx_fmt=png")
//     no-repeat top center;
//   background-size: 100% 584rpx;
//   overflow: hidden;

//   .more {
//     margin: 20rpx 55rpx 34rpx 518rpx;
//     display: flex;
//     align-items: center;
//     font-family: PingFangSC, PingFang SC;
//     font-weight: 400;
//     font-size: 26rpx;
//     color: #ffffff;
//     line-height: 37rpx;
//     text-align: justify;
//     font-style: normal;

//     .icon {
//       width: 30rpx;
//       height: 30rpx;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       border-radius: 50%;
//       background: #fff;
//       color: #14bf20;
//       z-index: 2;
//       margin-left: 5rpx;
//     }
//   }

//   .item {
//     width: 680rpx;
//     height: 230rpx;
//     display: flex;
//     margin: 20rpx;
//     border-radius: 10rpx;
//     background: #fff;

//     .image {
//       width: 230rpx;
//       height: 230rpx;
//       margin-right: 16rpx;
//     }

//     .name {
//       font-family: PingFangSC, PingFang SC;
//       font-weight: bold;
//       font-size: 28rpx;
//       color: #333333;
//       line-height: 40rpx;
//       text-align: left;
//       font-style: normal;
//       margin: 16rpx 0 10rpx;
//     }

//     .doing {
//       display: flex;
//       align-items: center;
//       font-family: PingFangSC, PingFang SC;
//       font-weight: 400;
//       font-size: 22rpx;
//       color: #666666;
//       line-height: 30rpx;
//       text-align: left;
//       font-style: normal;
//       margin-bottom: 28rpx;

//       .avatar {
//         width: 40rpx;
//         height: 40rpx;
//         border-radius: 50%;
//       }

//       .avatar:nth-child(n + 1) {
//         margin-left: -10rpx;
//       }
//     }

//     .bottom {
//       margin-bottom: 14rpx;
//       width: 422rpx;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;

//       .left {
//         display: flex;
//         align-items: center;

//         .price {
//           font-family: PingFangSC, PingFang SC;
//           font-weight: 600;
//           font-size: 20rpx;
//           color: #ee2532;
//         }

//         .old {
//           font-family: PingFangSC, PingFang SC;
//           font-weight: 400;
//           font-size: 20rpx;
//           color: #999999;
//           line-height: 33rpx;
//           text-align: left;
//           font-style: normal;
//           text-decoration-line: line-through;
//           margin-left: 10rpx;
//         }
//       }

//       .button {
//         width: 150rpx;
//         height: 56rpx;
//         background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQALAl1LiaicbL5icnESbI4SrzEvfywYPjxhicmSNNdFtlQdvwZ2ojtAVpkf77sQ1qsXQ7rXxsjaonk1A/0?wx_fmt=png")
//           no-repeat;
//         background-size: 100% 100%;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         color: #fff;
//       }
//     }
//   }
// }

// .main {
//   display: grid;
//   grid-template-columns: 1fr 1fr;
// }

// .block3 {
//   width: 345rpx;
//   background: #fff;
//   margin-bottom: 20rpx;
//   border-radius: 20rpx;

//   .image {
//     width: 345rpx;
//     height: 345rpx;
//   }

//   .name {
//     margin: 14rpx;
//     width: 317rpx;
//     font-family: PingFangSC, PingFang SC;
//     font-weight: 500;
//     font-size: 28rpx;
//     color: #333333;
//     line-height: 40rpx;
//     text-align: left;
//     font-style: normal;
//     //最多两行显示
//     display: -webkit-box;
//     -webkit-box-orient: vertical;
//     -webkit-line-clamp: 2;
//     line-clamp: 2;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }

//   .good-desc {
//     width: 308rpx;
//     font-family: PingFangSC, PingFang SC;
//     font-weight: 400;
//     font-size: 22rpx;
//     color: #999999;
//     line-height: 30rpx;
//     text-align: left;
//     font-style: normal;
//     white-space: no-wrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }

//   .bottom {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 14rpx 14rpx 20rpx;

//     .left {
//       display: flex;
//       align-items: center;

//       .price {
//         font-family: PingFangSC, PingFang SC;
//         font-weight: 600;
//         font-size: 36rpx;
//         color: #ee2532;
//         line-height: 50rpx;
//         text-align: left;
//         font-style: normal;
//       }

//       .old {
//         font-family: PingFangSC, PingFang SC;
//         font-weight: 400;
//         font-size: 24rpx;
//         color: #999999;
//         line-height: 33rpx;
//         text-align: left;
//         font-style: normal;
//         text-decoration-line: line-through;
//       }
//     }
//   }
// }

// .search {
//   display: flex;
//   width: 610rpx;
//   height: 72rpx;
//   margin-top: 20rpx;

//   border-radius: 20rpx;
//   justify-content: space-between;
//   border: 1.5px solid rgba(182, 176, 167, 1);

//   .pic1 {
//     margin-left: 20rpx;
//     width: 40rpx;
//     height: 40rpx;
//     display: block;
//   }

//   .pic2 {
//     background-color: #a9abff;
//     width: 80rpx;
//     height: 80rpx;
//     margin-right: 20rpx;
//     display: block;
//   }
// }
</style>
