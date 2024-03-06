<template>
	<view style="display: flex; margin-left: 30rpx;">
	<text style="font-size: 38rpx;font-weight: 600;">购物车</text>	
	<view class="control">
		管理
	</view>	
	</view>
	
	<view class="goods">
	    <view class="top">
		<view  @click="choose" style="width: 60rpx;">
		<uni-icons type="circle" size="30" color="rgba(217, 217, 217, 1)" v-if="show==='0'"></uni-icons>
		<uni-icons type="checkbox" size="30" color="red" v-else></uni-icons>
		</view>
	   
         <view class="title">{{title}}</view>	
	    </view>
	
		<view class="info">
			<view style="margin-top: 50rpx;">
	<uni-icons type="circle" size="30" color="rgba(217, 217, 217, 1)" v-if="show==='0'"></uni-icons>
	<uni-icons type="checkbox" size="30" color="red" v-else></uni-icons>	
			</view>
	
		<view class="image">
			<image src="../../static/logo.png" mode="" style="width:100%;height: 100%;"></image>
		</view>
		
		 <view class="detail" >
			<view style="text-overflow: ellipsis;overflow: hidden;	white-space: nowrap;font-size: 27rpx;" >
				{{infomation}}
			</view>
			<view style="width: 163rpx;background-color: rgba(243, 243, 243, 1);margin-top: 15rpx;">
	       <uni-section title="" type="line">
	      <uni-data-select v-model="value" :localdata="range" @change="change" :clear="false" ></uni-data-select>
	       </uni-section>
			</view>
			<view class="block3">
				<view class="price">
			¥{{price}}	
			</view>
			<view >
			<uni-section title="基本用法" type="line" padding>
		     <uni-number-box @change="changeValue" />
			</uni-section>	
			</view>	
			</view>
		
			
		 </view>
		</view>
	</view>
	
<view class="bottom">
 <view style="width: 90%; margin: 30rpx auto;	display: flex;">
	<view  @click="choose" style="width: 60rpx;margin-top: -10rpx;">
	<uni-icons type="circle" size="30" color="rgba(217, 217, 217, 1)" v-if="show==='0'"></uni-icons>
	<uni-icons type="checkbox" size="30" color="red" v-else></uni-icons>
	</view>	 
	
	<view class="text2">全选</view>
	<view class="text3">总计</view>
	<view class="text4">¥{{total}}</view>
	<view class="button" @click="tocaculate">
		结算
	</view>
 </view>
  
</view>
	
</template>

<script setup>
	import {ref} from 'vue';
	let title="三只松鼠"
	let infomation="三只松鼠三只松鼠三只松鼠三只松鼠"
	let price="28.8"
	let total="28.8"
	 let value='1'
	  let show='0'
	let range= [
	        { value: 0, text: "4袋（500g/袋）" },
	        { value: 1, text: "3袋（50g/袋）" },
	        { value: 2, text: "2袋（50g/袋）" },
	      ]
	function changeValue(value) {
				console.log('返回数值：', value);
			}
	function choose(){
		show= (show=='0')== true?'1':'0';
		console.log(show);
	}
</script>

<style lang="scss">
	page{
		background-color: rgba(247, 247, 247, 1);
		padding-top: 100rpx;
	}
	.control{
		width: 73rpx;
		height: 38rpx;
		background: #E2D6BF;
		border-radius: 98rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 21rpx;
		color: rgba(255, 255, 255, 1);
		line-height: 36rpx;
		text-align: center;
		margin-left: 20rpx;
		margin-top: 8rpx;
		margin-bottom: 20rpx;
	}
	.goods{
		width: 706rpx;
		height: 267rpx;
		background: #FFFFFF;
		border-radius: 13rpx 13rpx 13rpx 13rpx;
		margin: 10rpx auto;
		.top{
			display: flex;
			padding-top: 10rpx;
			margin-left: 10rpx;
			margin-bottom: 10rpx;
		}
		.title{
			margin-top: 7rpx;
			margin-left: 20rpx;
			width: 390rpx;
			font-weight: 600;
			
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
		}
		.info{
			margin-left: 10rpx;
			display: flex;
			.image{
				margin-left: 20rpx;
				width: 167rpx;
				height: 167rpx;
				border-radius: 10rpx 10rpx 10rpx 10rpx;
			}
		}
		.detail{
			width: 420rpx;
			margin-left: 23rpx;
			
			.price{
			width: 106rpx;
			height: 58rpx;
			font-family: Inter, Inter;
			font-weight: 600;
			font-size: 28rpx;
			color: #834820;
			text-align: left;
			}
			.block3{
				margin-top: 60rpx;
					justify-content: space-between;
			display: flex;
			}
		}
		
	}
	.bottom{
		width: 750rpx;
		height: 96rpx;
		background: #FFFFFF;
		position:fixed; bottom:0;
	.text2{
		color: rgba(153, 153, 153, 1);
		line-height: 40rpx;
		margin-left: 10rpx;
	}
	.text3{
		margin-left: 90rpx;
		width: 55rpx;
		height: 40rpx;
		font-family: Inter, Inter;
		font-weight: 400;
		font-size: 27rpx;
		color: #000000;
		line-height: 40rpx;
		
	}
	.text4{
	width: 119rpx;
	height: 58rpx;
	font-family: Inter, Inter;
	font-weight: normal;
	font-size: 38rpx;
	color: #834820;
	line-height: 42rpx;
	margin-left: 8rpx;
	}
	.button{
		width: 258rpx;
		height: 71rpx;
		background: #C8B697;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		margin-top: -15rpx;
		font-weight: 500;
		font-size: 31rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 70rpx;
	}
	}
</style>