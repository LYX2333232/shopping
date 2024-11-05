<template>
    <view class="tn-flex-center-between nav">
        <view class="tn-flex-center-start">
            <button class="icon" @click="toCart">
                <TnIcon name="cart" size="50" color="#000" />
                <text>购物车</text>
            </button>
            <button class="icon" @click="favorite">
                <TnIcon name="like" size="50" :color="props.like === 1 ? 'tn-red' : '#000'" />
                <text>收藏</text>
            </button>
            <button class="icon" open-type="share">
                <TnIcon name="share-square" size="50" color="#000" />
                <text>分享</text>
            </button>
        </view>
        <view style="display: flex;flex-direction: column;align-items: center;">
            <TnCountDown v-if="props.time" :time="props.time" show-day separator-mode="cn" size="35"
                text-color="tn-red" />
            <button style="border-radius: 50rpx;width: 300rpx;font-size: 40rpx;margin: 0 20rpx;"
                :class="normal ? 'normal' : 'cart'" @click="onButtonClick">{{ normal ?
                    '加入购物车' : '立即购买' }} </button>
        </view>
    </view>
</template>

<script setup>
import { computed } from 'vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
import TnCountDown from '@/uni_modules/tuniaoui-vue3/components/count-down/src/count-down.vue'
import { set_favorite } from '@/api/goods/goods'

const props = defineProps({
    id: {
        type: Number,
        required: true
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
    position: fixed;
    bottom: 0;
    background: #FFFFFF;

    .icon {
        //删除默认样式
        border: none;
        background: none;

        color: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 30rpx;
        justify-content: start;

        text {
            margin-top: -40rpx;
        }
    }

    .normal {
        background: #C8B697;
        color: #fff;
    }

    .cart {
        background: linear-gradient(90deg, #F9E3C9 0%, #DDC8A4 63%, #DDC8A4 100%);
        color: #fff
    }
}
</style>