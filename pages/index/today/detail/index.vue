<template>
    <Header />
    <swiper indicator-dots autoplay circular style="height:780rpx;">
        <swiper-item v-for="(item, index) in swiperImg" :key="'swiper' + index">
            <image :src="item.path" mode="aspectFill" style="width: 100%;height: 750rpx;" @click="toWeb(item.path)">
            </image>
        </swiper-item>
    </swiper>

    <view class="white_boxs">
        <view style=" width: 90%;margin: 0 auto;">
            <view style="display: flex;">
                <view class="now">
                    ¥{{ size[sizeIndex].price }}
                </view>
            </view>
            <view class="info">
                {{ name }}
            </view>
            <view style="display: flex;">
                <view class="type" v-for="item in typelist">
                    {{ item }}
                </view>
            </view>
            <!-- <view class="block1">
                已售 {{ sell }}+
            </view> -->
        </view>
    </view>
    <view class="detail">
        <view style="width: 90%;margin: 0 auto;">
            <view>
                规格
            </view>
            <uni-section title="更多样式 - tag" subTitle="使用mode=tag属性使用标签样式" type="line">
                <view class="uni-px-5">
                    <uni-data-checkbox mode="tag" v-model="sizeIndex" :localdata="size"
                        selectedColor="rgba(202, 199, 193, 1)"></uni-data-checkbox>
                </view>
            </uni-section>
            <view style="display: flex;justify-content: space-between;">
                <text>数量</text>
                <view>
                    <uni-section title="基本用法" type="line" padding>
                        <uni-number-box v-model="cont" @change="changeValue" :min="1" />
                    </uni-section>
                </view>
            </view>
        </view>
    </view>
    <view class="moredetail">
        <view class="text1" style="width: 90%;margin: 0 auto;">
            <text>商品详情</text>
        </view>
        <!-- <image v-for="image in detailImg" :src="image" mode="widthFix" style="width: 90%;margin: 10rpx 5%;" /> -->
        <view style="width: 90%;margin: 10rpx 5%;" v-html="content"></view>
    </view>
    <TnPopup v-model="detailVisible" open-direction="bottom" height="80%">
        <view class="goods">
            <view style="font-size:45rpx;margin-top:30rpx">订单详细</view>
            <view class="detail_address" v-if="address.address" @click="selectAddress">
                <view
                    style="font-size:35rpx;margin-bottom: 20rpx;max-width: 80%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                    {{ address.address }} </view>
                <view style="display:flex">
                    <view style="max-width: 200rpx;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                        {{ address.name }}
                    </view>
                    - {{ address.phone }}
                </view>
            </view>
            <view class="detail_address" style="font-size:35rpx;" v-else @click="selectAddress">请先选择地址</view>
            <view class="good">
                <image :src="swiperImg[0].path" mode="scaleToFill"
                    style="width:100rpx; height:100rpx;margin-left:30rpx" />
                <view>
                    {{ name }}
                </view>
            </view>
            <view class="good" style="color:#C7BAA5;">
                <view>商品价格</view>
                <view style="display:flex;flex-direction:column;align-items:center;">
                    <view>
                        ￥{{ detail_price.price }}
                    </view>
                    <view style="text-decoration:line-through;color:black;font-size:20rpx;margin-top:10rpx;"
                        v-if="detail_price.price != detail_price.show_price">
                        原价：￥{{ detail_price.show_price }}
                    </view>
                </view>
            </view>
            <view class="good">
                <view>
                    运费
                </view>
                <view style="display:flex;flex-direction:column;align-items:center;color:#C7BAA5;">
                    ￥{{ detail_price.freight }}
                </view>
            </view>
            <view class="btn">
                <view class="total">
                    总计：￥{{ (parseFloat(detail_price.freight) + parseFloat(detail_price.price)).toFixed(2) }}
                </view>
                <view class="button" @click="order">
                    确认结算
                </view>
            </view>
        </view>
    </TnPopup>

    <GoodNav :id="c_id" :like="true" :normal="false" @buttonClick="buttonClick" />
    <!-- 分享定义在组件goods-nav中 -->
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app';
import { get_today_detail } from '@/api/index/today/today'
import Header from '@/components/header.vue'
import swiper from '@/uni_modules/nutui-uni/components/swiper/swiper.vue'
import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
import GoodNav from '@/components/goodNav'
import { new_order, get_order_price } from '@/api/order/order'
import { AddressStore } from '@/store'

const address = AddressStore()

const detailVisible = ref(false)

const detail_price = ref({
    freight: 0,
    price: 0
})

const swiperImg = ref([])

const c_id = ref('')

let teamwork_com_id = undefined

let sell = ref("150")
const name = ref('')
const typelist = ref([])
// 商品规格
const size = ref([])

const sizeIndex = ref(0)

const content = ref('')

const cont = ref(1)

const toWeb = (url) => {
    uni.navigateTo({
        url: '/pages/web/index?src=' + url
    })
}

function buttonClick(e) {
    detailVisible.value = true
    get_order_price({
        address_id: address.address_id,
        teamwork_com_id,
        com_id: size.value[sizeIndex.value].id,
        com_cont: cont.value
    }).then(res => {
        console.log(res)
        detail_price.value = res.data
    })
}

const selectAddress = () => {
    uni.navigateTo({
        url: '/pages/shopping/selectAddress/index'
    })
}

const order = () => {
    new_order({
        com_id: size.value[sizeIndex.value].id,
        com_cont: cont.value,
        ids: [{
            id: size.value[sizeIndex.value].id,
            cont: cont.value
        }],
        address_id: address.address_id,
        teamwork_com_id,
        freight: detail_price.value.freight
    }).then(res => {
        uni.requestPayment({
            provider: 'wxpay',
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success: function (res) {
                console.log('success', res)
                if (res.errMsg === 'requestPayment:ok') {
                    uni.showToast({
                        title: '支付成功',
                        icon: 'none'
                    })
                }
            },
            fail: function (err) {
                console.log('fail', err)
            }
        })
        detailVisible.value = false
    })
}

onLoad((options) => {
    console.log('options', options)
    get_today_detail(options.id).then(res => {
        console.log(res)
        // 轮播图
        swiperImg.value = res.data.paths

        c_id.value = res.data.id

        sell.value = res.data.seng_count

        teamwork_com_id = res.data.teamwork_com_id

        // 规格
        size.value = [
            {
                ...res.data.item,
                text: res.data.item.name,
                value: 0
            }
        ]
        sizeIndex.value = 0

        // 商品名称
        name.value = res.data.name

        typelist.value = res.data.labels

        console.log('typelist', typelist.value)

        content.value = res.data.content.replace(/(<img [^>]*)(style="[^"]*")?/gi, '$1 style="width:100%;"')
    })
})

onShow(() => {
    get_order_price({
        address_id: address.address_id,
        teamwork_com_id,
        com_id: size.value[sizeIndex.value].id, com_cont: cont.value
    }).then(res => {
        console.log(res)
        detail_price.value = res.data
    })
})
</script>

<style lang="scss" scoped>
page {
    background-color: rgba(248, 248, 248, 1);
}

.white_boxs {
    background-color: rgba(255, 255, 255, 1.0);
    margin-top: -40rpx;
    border-radius: 19rpx 19rpx 0rpx 0rpx;
    position: relative;
    z-index: 10;

    .now {
        height: 75rpx;
        font-family: Inter, Inter;
        font-weight: 600;
        font-size: 40rpx;
        color: #834820;
        line-height: 46rpx;
        text-align: left;
        padding-top: 18rpx;
        margin-right: 30rpx;
    }

    .info {
        font-family: Inter, Inter;
        font-weight: 600;
        font-size: 50rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .type {
        width: 120rpx;
        height: 35rpx;
        margin-top: 20rpx;
        margin-right: 15rpx;
        font-size: 19rpx;
        color: #A79A77;
        background: #FAEBD9;
        line-height: 35rpx;
        text-align: center;
        border-radius: 6rpx 6rpx 6rpx 6rpx;
    }

    .block1 {
        font-family: Inter, Inter;
        font-weight: 400;
        font-size: 23rpx;
        margin-top: 15rpx;
        color: #8A8A8A;
        line-height: 35rpx;
        padding-bottom: 40rpx;
    }
}

.detail {
    background-color: #fff;
    margin-top: 10rpx;
    padding-top: 20rpx;
    font-family: Inter, Inter;
    font-weight: 600;
    font-size: 27rpx;
    color: #75694A;
    line-height: 40rpx;
    text-align: left;

    .uni-px-5 {
        padding-top: 15rpx;
        padding-right: 15px;
        padding-bottom: 35rpx;
    }
}

.moredetail {
    background-color: #fff;
    margin: 20rpx 0 20rpx;
    padding-bottom: 200rpx;

    .text1 {
        font-family: Inter, Inter;
        font-weight: 600;
        font-size: 27rpx;
        color: #75694A;
        line-height: 40rpx;
        text-align: left;
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

.goods {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 150rpx;
    background: #F5F5F5;

    .detail_address {
        width: 90%;
        display: flex;
        flex-direction: column;
        margin: 30rpx;
        padding: 20rpx;
        background: #FFFFFF;
    }

    .good {
        width: 90%;
        margin: 10rpx auto;
        padding: 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 35rpx;
    }

    .btn {
        width: 90%;
        position: fixed;
        bottom: 0;
        margin-bottom: 20rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .total {
            font-size: 35rpx;
            color: #834820;
            margin-right: 20rpx;
        }

        .button {
            width: 258rpx;
            height: 71rpx;
            margin-bottom: 20rpx;
            background: #C8B697;
            border-radius: 10rpx;
            font-weight: 500;
            font-size: 31rpx;
            color: #FFFFFF;
            text-align: center;
            margin-left: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>