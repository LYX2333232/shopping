<template>
    <view class="nav">
        <view class="tn-w-full tn-flex-center-evenly">
            <button class="icon" @click="toCart">
                <view class="badge" v-if="props.cart > 0">
                    {{ props.cart }}
                </view>
                <TnIcon name="cart" size="50" :custom-style="{ height: 0 }" color="#000" />
                <text>购物车</text>
            </button>
            <button class="icon" @click="favorite">
                <TnIcon :name="props.like === 1?'star-fill':'star'" size="50" :color="props.like === 1 ? 'tn-red' : '#000'"
                    :custom-style="{ height: 0 }" />
                <text>收藏</text>
            </button>
            <button class="icon" open-type="share">
                <TnIcon name="share-square" size="50" color="#000" :custom-style="{ height: 0 }" />
                <text>分享</text>
            </button>
        </view>
        <view style="display: flex;flex-direction: column;align-items: center;">
            <TnCountDown v-if="props.time" :time="props.time" show-day separator-mode="cn" size="35"
                text-color="tn-red" />
            <button style="border-radius: 50rpx;width: 300rpx;font-size: 32rpx;margin: 0 20rpx;"
                :class="normal ? 'normal' : 'cart'" @click="onButtonClick">{{ normal ?
                    '加入购物车' : '立即购买' }} </button>
        </view>
    </view>
</template>

<script setup>
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnCountDown from '@/uni_modules/tuniaoui-vue3/components/count-down/src/count-down.vue'
import { set_favorite } from '@/api/goods/goods'

const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    cart: {
        type: Number,
        default: 3
    },
    like: {
        type: Number,
        default: 0
    },
    normal: { //是否为普通商品，只有普通商品为加入购物车
        type: Boolean,
        default: false
    },
    time: {
        type: Number,
        default: undefined
    }
})

// 点击购物车
const toCart = () => {
    uni.switchTab({
        url: '/pages/shopping/shopping'
    })
}

// 点击收藏
const favorite = () => {
    uni.showLoading({
        title: '加载中'
    })
    set_favorite(
        props.id
    ).then(res => {
        if (res.code === 200) {
            emits('changeLike')
            uni.hideLoading({})
        }
    })
}


const emits = defineEmits(['buttonClick', 'changeLike'])

const onButtonClick = () => {
    emits('buttonClick')
}
</script>

<style lang="scss" scoped>
.nav {
    width: 750rpx;
    height: 110rpx;
    position: fixed;
    bottom: 0;
    background: #FFFFFF;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .icon {
        position: relative;
        //删除默认样式
        border: none;
        background: none;
        color: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 22rpx;
        justify-content: center;
        overflow: visible;
        margin-top: 35rpx;

        .badge {
            position: absolute;
            top: -18%;
            right: 25%;
            background: #f00;
            color: #fff;
            border-radius: 50%;
            width: 24rpx;
            height: 24rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20rpx;
        }

        text {
            margin-top: -20rpx;
        }
    }

    .normal {
        background: #14BF20;
        color: #fff;
    }

    .cart {
        background: #FF4121;
        color: #fff
    }
}
</style>