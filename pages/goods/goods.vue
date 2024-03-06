
<template>
	 <view class=" tab" >
		 <view class="pic" >
		  <image src="../../static/logo.png" mode="" style=""></image>		
		 </view>
		 <view style="width: 580rpx;height: 50rpx;">
		 	 <uni-section title="图标"  type="line" padding  >
	 			<uni-easyinput prefixIcon="search" v-model="value" placeholder="请输入商品关键词" @iconClick="iconClick" suffixIcon="camera"  :styles="styles"></uni-easyinput>
	 		</uni-section>
		 </view>
		 
		 
   	</view>
	<view class="content">
		<view class="item" v-for="(item,index) in goodslist" @click="tap_item(item,index)" >
			<image :src=item.icon mode="" style="width: 60rpx;height: 60rpx;margin-top: 30rpx;margin-bottom: 10rpx;"></image>
			<view class="">
					{{item.name}}
			</view>
		</view>
	</view>


<view class="goods" style="display: flex;background-color:rgba(255, 255, 255, 1) ;">
	<view style="width: 113rpx;height: 100%;background-color: #F1EDE9; ">
	<view class="select" style="" v-for="(item,index) in selectlist" >
		{{item.name}}
	</view>	
	</view>
	<view style="display: block;">
	 <view class="select1">
	    <view class="p1">
		综合
	    </view>
	    <view class="p1">
		最新
	    </view>
		<view class="p2">
		价格
		  <view  style="margin-left: 5rpx;margin-top: -10rpx;">
			<view  style="width: 10rpx;height: 15rpx;">
			<uni-icons type="up" size="10" style="" color="rgba(126, 117, 92, 1)"></uni-icons>	
			</view>
		   <view  style="width: 10rpx;height: 15rpx;">
		   <uni-icons type="down" size="10" color="rgba(126, 117, 92, 1)" ></uni-icons>	
		   </view>
		</view>
		
		</view>
		<view class="p2">
		销量
		<view  style="margin-left: 5rpx;margin-top: -10rpx;">
			<view  style="width: 10rpx;height: 15rpx;">
			<uni-icons type="up" size="10" style="" color="rgba(126, 117, 92, 1)"></uni-icons>	
			</view>
		   <view  style="width: 10rpx;height: 15rpx;">
		   <uni-icons type="down" size="10" color="rgba(126, 117, 92, 1)"></uni-icons>	
		   </view>
		</view>
		</view>
     </view>
	 
	 <view class="block3">
	 	
	 
	 <view class="block3"  v-for="(item) in infolist" >
		 <view style="display: block;">
		<image :src="item.icon"  mode="" class="image"></image>
		<view style="width: 96%;margin: 0 auto;font-size: 24rpx;">
			{{item.detail}}
		</view>
		<view style="display: flex;justify-content: space-between;width: 94%;margin-top: 15rpx;">
			<view class="text1">
				¥{{item.price}}
			</view>
			<view class="text2">
				已售{{item.num}}包
			</view>
		</view>
		</view>
	 </view>
	</view>
	</view>

</view>

</template>

<script setup>
import {ref} from 'vue'
import TnSubsection from '@/uni_modules/tuniaoui-vue3/components/subsection/src/subsection.vue'
import TnSubsectionItem from '@/uni_modules/tuniaoui-vue3/components/subsection/src/subsection-item.vue'
import { reactive, toRefs } from 'vue'
import TnScrollList from '@/uni_modules/tuniaoui-vue3/components/scroll-list/src/scroll-list.vue'
const subsectionValue = ref<number>(0)
	 let value = ref('')
	 let password = ref('')  
	 let button=[0]
	 let temp=[0]
	 let i=0
	 let styles = ref({  
	   color: 'rgba(182, 176, 167, 1)',  
	   borderColor: 'rgba(182, 176, 167, 1)'  
	 })
function iconClick(type){
			
	if(type=='suffix')	
	{
		console.log(type)
	}  }
	 const state = reactive({
	        show1: false,
	        width: '80%',
	        height: '100%',
	      })						
	 const handleClick1 = () => {
	state.show1 = true
}
		
	 let selectlist=[
	{
		name: '芒果干',
			
	},{
		name: '苹果干',
	},{
		name: '地瓜干',
	},
	{
		name: '地瓜干',
	},
]				
							
let goodslist=[
	{
		name: '芒果干',
		icon: '../../static/logo.png',
			
	},{
		name: '苹果干',
		icon: '../../static/logo.png'
	},{
		name: '地瓜干',
		icon: '../../static/logo.png'
	},
	{
		name: '猕猴桃干',
		icon: '../../static/logo.png'
	},
	{
		name: '各类水果',
		icon: '../../static/logo.png'
	},
	 ]
	
let infolist=[{
	name: '芒果干',
	icon: '../../static/logo.png',
	detail:'休闲芒果干大礼包，50g一包超值',
	price:'189',
	num:'200'
},
{
	name: '芒果干',
	icon: '../../static/logo.png',
	detail:'休闲芒果干大礼包，50g一包超值',
	price:'189',
	num:'200'
},
	
]

</script>

<style lang="scss">
page{
		background-color: #F7F7F7;
}

.tab{
	width: 90%;
	margin: 0 auto;
	margin-top: 110rpx;
	height: 100rpx;
	padding-top: 22rpx;
	display: flex;
	.pic{
	width: 32px;
	height: 32px;
	margin-top: 3rpx;
	margin-right: 28rpx;
	border-radius: 50rpx;
	}
}

.content {
	margin-bottom: -15rpx;
	width: 100%;
	overflow: hidden;
	overflow-x: auto;
	white-space: nowrap;
	text-align: center;
}
.item {
	border-radius: 10rpx 10rpx 10rpx 10rpx;
	display: inline-block;
	background: #fff;
	margin: 10px;
	width: 100px;
	height: 100px;
	box-shadow:  1px 1px 5px #d6cfcc;
}
.goods{
	height: 100vh;
	margin-top: 30rpx;
	border-radius: 40rpx 40rpx  0 0;
	position: relative;
	z-index: 999;
	padding-top: 30rpx;
	.select{
		height: 107rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 25rpx;
		color: #555555;
		line-height: 35rpx;
		text-align: center;
		font-style: normal;
		margin-top: 30rpx;
	}
	.select1{
		width:620rpx ;
		height:80rpx ;
		margin-top: -10rpx;
		font-family: Inter, Inter;
		font-weight: normal;
		font-size: 29rpx;
		line-height: 40rpx;
		color: #75694A;
		display: flex;
		text-align: center;
		justify-content: space-around;
		.p2{
			display: flex;
		}
	}
	.block3{
		display: flex;
		margin-left: 15rpx;
		.image{
		width: 290rpx;
		height: 243rpx;
		border-radius: 13rpx 13rpx 13rpx 13rpx;
		}
		.text1{
			font-family: Inter, Inter;
			font-weight: 600;
			font-size: 33rpx;
			color: #834820;
			line-height: 46rpx;
		}
		.text2{
		font-family: Inter, Inter;
		font-weight: 500;
		font-size: 23rpx;
		color: #8D8D8D;
		margin-top: 5rpx;
		line-height: 50rpx;
		}
	}
}

</style>