<template>
    <Header />
    <view style="position: relative;">
        <swiper :indicator-dots="false" autoplay="false" circular @change="changeSwiper" style="height:750rpx;">
            <swiper-item v-for="item in swiperImg" :key="'swiperImg' + item.id">
                <image :src="item.path" mode="aspectFill" style="width: 750rpx;height: 750rpx;"
                    @click="toWeb(item.path)">
                </image>
            </swiper-item>
        </swiper>
        <view class="show">
            <view>
                <view v-if="other" class="other">
                    <image :src="other.avatar" mode="scaleToFill" class="avatar" />
                    <view>
                        {{ other.name + other.text }}
                    </view>
                </view>
            </view>
            <view class="index">
                <view class="current">
                    {{ current }}
                </view>
                <view class="total">
                    {{ swiperImg.length }}
                </view>
            </view>
        </view>
    </view>
    <view class="all">
        <view class="flash">
            <view class="tn-flex-center-start">
                <view class="now">
                    ￥{{ size.price }}
                </view>
                <view v-show="size.or_price" class="old">
                    ￥{{ size.or_price }}
                </view>
            </view>
            <view class="right">
                <view class="tn-flex-center-start">
                    <view>
                        距结束
                    </view>
                    <CountDown :time="end - new Date()" textColor="#DD1A21" @finish="finish" />
                </view>
            </view>
        </view>
        <view class="white_boxs">

            <view class="info">
                {{ name }}
            </view>
            <view class="tn-flex-center-start">
                <view class="type" v-for="item in typeList" :key="item.id">
                    {{ item }}
                </view>
            </view>
            <view class="sold">
                已售 {{ sell }}
            </view>
            <view class="others" v-if="users.length > 0">
                <image v-for="(path, index) in users" :key="index" :src="path" mode="scaleToFill" class="avatar" />
                已有{{ users.length }}人参团
            </view>
        </view>
        <view class="desc">
            <image
                src="http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQ9xr6k6haSXtWWE8Sa8PIkCRJA3AgMic3n41fiacAVqEYmicaAPWP7XibYp8LKkpQFLnWJsZib6NYQHCA/0?wx_fmt=png"
                mode="scaleToFill" />
        </view>
        <view class="size">
            <view class="title">
                {{ size.name }}
            </view>
            <view class="tn-flex-center-between">
                <view class="title">数量</view>
                <view>
                    <uni-section title="基本用法" type="line" padding>
                        <uni-number-box v-model="cont" :min="1" />
                    </uni-section>
                </view>
            </view>
        </view>
        <view class="detail">
            <view class="title" style="width: 90%;margin: 0 auto;">
                <text>商品详情</text>
            </view>
            <view v-for="item in swiperVideo" :key="'swiperVideo' + item.id" style="width: 90%;margin: 0 auto;">
                <video style="width:100%" :src="'https://senmei.top/' + item.url"></video>
            </view>
            <view style="width: 90%;margin: 10rpx 5%;">
                <rich-text :nodes="content"></rich-text>
            </view>
        </view>
    </view>
    <GoodNav :id="size.id" :like="size.like" :normal="false" @buttonClick="buttonClick" @changeLike="changeLike" />
    <!-- 分享定义在组件goods-nav中 -->
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import { get_today_detail } from '@/api/index/today/today'
import Header from '@/components/header.vue'
import GoodNav from '@/components/goodNav'
import CountDown from '@/components/CountDown'
import { setTime } from '@/utils/format'

// 轮播图相关
const swiperVideo = ref([])
const swiperImg = ref([])
const current = ref(1)
const changeSwiper = e => {
    if (e && e.detail && e.detail.current !== undefined) {
        current.value = e.detail.current + 1
    } else {
        console.error('Invalid event object:', e)
    }
}
const toWeb = (path) => {
    uni.navigateTo({
        url: '/pages/web/index?src=' + path
    })
}

// 其他用户的购买信息
const other = ref({})

// 其他拼团用户
const users = ref([])

const c_id = ref('')
var teamwork_com_id

const end = ref(setTime('18:00'))
const finish = () => {

}

// 商品售价
const sell = ref(0)
const name = ref('')
const typeList = ref([])

// 商品规格
const size = ref({})

// 数量
const cont = ref(1)

// 详细描述
const content = ref('')

// 底部信息
const like = ref(0)

const changeLike = () => {
    size.value.is_like = size.value.is_like ? 0 : 1
}

function buttonClick() {
    // 创建订单
    uni.navigateTo({
        url: `/pages/me/order/new_order?teamwork_id=${teamwork_com_id}&com_cont=${cont.value}`
    })
}

onLoad((options) => {
    const that = this
    get_today_detail({ id: options.id }).then(res => {
        // 轮播图
        swiperImg.value = res.data.paths
        // 视频轮播图
        swiperVideo.value = res.data.videost

        c_id.value = res.data.id
        teamwork_com_id = res.data.teamwork_com_id

        other.value = res.data.users[0]

        users.value = res.data.users

        // 规格
        size.value = res.data.item

        // 商品名称
        name.value = res.data.name

        typeList.value = res.data.labels

        content.value = res.data.content.replace(/(<img [^>]*)(style="[^"]*")?/gi, '$1 style="width:100%;"')

        like.value = res.data.is_like

        sell.value = res.data.volume
    })
})
</script>

<style lang="scss" scoped>
page {
    background: #F6F6F6;
}



.show {
    position: absolute;
    width: 100%;
    bottom: 20rpx;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .other {
        background: #000;
        opacity: 0.6;
        display: flex;
        align-items: center;
        width: 450rpx;
        border-radius: 0 30rpx 30rpx 0;
        padding: 0 20rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        color: #FFFFFF;
        line-height: 33rpx;
        text-align: left;
        font-style: normal;

        .avatar {
            margin: 0 20rpx;
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
        }
    }

    .index {
        margin-right: 20rpx;
        background: rgba($color: #000000, $alpha: 0.4);
        width: 80rpx;
        height: 40rpx;
        border-radius: 30rpx;
        display: flex;
        align-items: center;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 26rpx;
        color: #FFFFFF;
        line-height: 40rpx;

        .current {
            width: 40rpx;
            height: 40rpx;
            text-align: center;
            border-radius: 30rpx 0 30rpx 30rpx;
            background: rgba($color: #000000, $alpha: 0.2);
        }

        .total {
            width: 40rpx;
            height: 40rpx;
            text-align: center;
        }
    }
}

.all {
    background-color: #F6F6F6;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
}

.flash {
    width: 710rpx;
    height: 162rpx;
    margin-bottom: -40rpx;
    background: url("http://mmbiz.qpic.cn/mmbiz_png/4UKU63bxibhQ9xr6k6haSXtWWE8Sa8PIkWm7dWr5Qvu2vBz1tvqN077GSia1LoK2ibI7rNrUIJRauV5tibbjtzJmeQ/0?wx_fmt=png") no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #FFF;

    .now {
        font-family: WeChat-Sans-Std, WeChat-Sans-Std;
        font-weight: bold;
        font-size: 50rpx;
        text-align: left;
        font-style: normal;
        margin: 0 30rpx;
    }

    .old {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 26rpx;
        text-align: left;
        font-style: normal;
        text-decoration-line: line-through;
    }

    .right {
        margin-right: 30rpx;
        height: 100rpx;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }
}

.white_boxs {
    width: 710rpx;
    margin: 20rpx;
    padding: 20rpx;
    background-color: #FFF;
    border-radius: 24rpx;



    .info {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 34rpx;
        color: #131313;
        line-height: 44rpx;
        text-align: left;
        font-style: normal;
        margin: 20rpx 0;
    }

    .type {
        height: 35rpx;
        margin-top: 20rpx;
        margin-right: 15rpx;
        padding: 5rpx 10rpx;
        font-size: 25rpx;
        color: #999;
        border: 2rpx dotted #999;
        line-height: 35rpx;
        display: flex;
        align-items: center;
    }

    .sold {
        width: 100%;
        font-family: Inter, Inter;
        font-weight: 400;
        font-size: 23rpx;
        margin-top: 15rpx;
        color: #8A8A8A;
        line-height: 35rpx;
        padding-bottom: 40rpx;
        text-align: right;
    }

    .others {
        display: flex;
        align-items: center;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 22rpx;
        color: #EE2532;
        line-height: 30rpx;
        text-align: left;
        font-style: normal;

        .avatar {
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
            margin-left: -10rpx;
        }
    }
}

.desc {
    width: 711rpx;
    height: 78rpx;
    background: #FFF5EA;
    border-radius: 24rpx;
    margin: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
        width: 670rpx;
        height: 30rpx;
    }
}

.deliver {
    width: 100%;
    display: flex;
    background: #FFF;
    padding: 30rpx 20rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #131313;
    line-height: 40rpx;
    text-align: left;
    font-style: normal;

    .label {
        color: #999999;
    }

    .text {
        margin-left: 30rpx;
    }
}

.size {
    width: 100%;
    background-color: #fff;
    margin: 20rpx;
    padding: 30rpx 20rpx;

    .title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #999999;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
    }

    .uni-px-5 {
        padding-top: 15rpx;
        padding-right: 15px;
        padding-bottom: 35rpx;
    }
}

.param {
    width: 100%;
    background-color: #fff;
    margin: 20rpx;
    padding: 30rpx 20rpx;

    .title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 28rpx;
        color: #131313;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        margin-bottom: 30rpx;
    }

    .card {
        border-radius: 16rpx;
        border: 1rpx solid #D0D0D0;
        display: flex;
        flex-direction: column;
        align-items: center;

        .item {
            width: 100%;
            padding: 20rpx;
            display: flex;
            align-items: center;

            .label {
                width: 120rpx;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 28rpx;
                color: #999999;
                line-height: 40rpx;
                text-align: left;
                font-style: normal;
            }

            .text {
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 28rpx;
                color: #131313;
                line-height: 40rpx;
                text-align: left;
                font-style: normal;
            }
        }

        .block {
            width: 100%;
            margin: 0 20rpx;
            height: 1rpx;
            background-color: #EEE;
        }
    }
}

.detail {
    width: 100%;
    background-color: #fff;
    margin: 20rpx;
    padding-bottom: 150rpx;

    .title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 28rpx;
        color: #131313;
        line-height: 40rpx;
        text-align: left;
        font-style: normal;
        margin: 20rpx 30rpx;
    }
}

.comment {
    background-color: #fff;
    margin-top: 20rpx;
    padding: 20rpx 0 150rpx;

    .text1 {
        font-family: Inter, Inter;
        font-weight: 600;
        font-size: 27rpx;
        color: #75694A;
        line-height: 40rpx;
        text-align: left;
    }

    .card {
        margin-top: 30rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 200rpx;

        .name {
            font-family: Noto Sans SC, Noto Sans SC;
            font-weight: 500;
            font-size: 23rpx;
            color: #494949;
            line-height: 27rpx;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }
    }
}

.goods-carts {
    height: 146rpx;
    background: #FFFFFF;
    box-shadow: 0rpx 8rpx 12rpx 0rpx rgba(0, 0, 0, 0.2);
    border-radius: 50rpx 50rpx 0rpx 0rpx;

    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    position: fixed;
    left: 0;
    right: 0;
    /* #ifdef H5 */
    left: var(--window-left);
    right: var(--window-right);
    /* #endif */
    bottom: 0;
    z-index: 100;
}
</style>