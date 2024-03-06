<template>
		<Header/>
		<image src="../../static/logo.png" mode="aspectFill" style="width: 100%;height: 575rpx;"></image>
		
	<view class="white_boxs">
		 <view style=" width: 90%;margin: 0 auto;">
				
			
	    <view style="display: flex;">
	     	<view class="now">
	     		¥{{cost}}
	     	</view>
			<view style="color: #767676;padding-top: 26rpx;font-size: 24rpx;">原价：</view>
			<view style="color: #767676;padding-top: 26rpx;font-size: 24rpx;text-decoration:line-through">
			{{bcost}}
			</view>	
	    </view>
	    
		<view class="info">
			{{desc}}
		</view>
		
		<view style="display: flex;">
		<view class="type"  v-for="(item,index) in typelist" >
		{{item}}	
		</view>	
		</view>
		<view class="block1">
			已售 {{sell}}+
		</view>
	 </view>
	       
    </view>
		
	   <view class="detail">
		 <view style="width: 90%;margin: 0 auto;">
			 <view class="">
			 	规格
			 </view>
			 	<uni-section title="更多样式 - tag" subTitle="使用mode=tag属性使用标签样式" type="line">
			 			<view class="uni-px-5">
			 				<uni-data-checkbox mode="tag" v-model="radio3" :localdata="size" selectedColor="rgba(202, 199, 193, 1)"></uni-data-checkbox>
			 			</view>
			 			
			 		</uni-section>
			<view style="display: flex;justify-content: space-between;">
             <text>数量</text>
			 <view >
			<uni-section title="基本用法" type="line" padding>
			 <uni-number-box @change="changeValue" />
			</uni-section>				
			</view>
				
			</view>	
		</view>
	   </view>	
	   
	   <view class="moredetail">
		   <view class="text1" style="width: 90%;margin: 0 auto;">
		   	   	<text>商品详情</text>
		   </view>
	
	   </view>
	   
				<view class="uni-container">				
					<view class="goods-carts">
						<uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="onClick"
							@buttonClick="buttonClick" />
					</view>
				</view>
					<!-- 分享定义在组件goods-nav中 -->
</template>

<script setup>
	import Header from '@/components/header.vue'
	let cost="150"
	let bcost="150"
	let sell="150"
	let desc="休闲芒果干大礼包，50g一包超值"
	let options=[{
					icon: 'cart',
					text: '购物车',
					info: 0
					}, {
						icon: 'star',
						text: '收藏',
						info: 0,
						infoColor: "#f5f5f5"
					}, {
						icon: '../../static/share.svg',
						text: '分享',
						info: 0
					}];
		let typelist=['正品保障','正品保障']			
		let	buttonGroup= [{
							text: '加入购物车',
							backgroundColor: ' linear-gradient( 90deg, #F9E3C9 0%, #DDC8A4 63%, #DDC8A4 100%)',
							color: '#fff'
						},
						{
							text: '立即购买',
							backgroundColor: '#C8B697',
							color: '#fff'
						}
					];
		let	size=[{
					text: '100g',
					value: 0
				}, {
					text: '200g',
					value: 1
				}, {
					text: '300g',
					value: 2
				}];		
				function onClick(e) {
									uni.showToast({
										title: `点击${e.content.text}`,
										icon: 'none'
									})
								};
				function buttonClick(e) {
									console.log(e)
									this.options[2].info++
								}
				
</script>

<style lang="scss">
	page{
		 background-color: rgba(248, 248, 248, 1);
	}
	 .white_boxs{
	  
		 background-color: rgba(255, 255, 255, 1.0);
			margin-top: -40rpx;
			border-radius: 19rpx 19rpx 0rpx 0rpx;
			position: relative;
			z-index: 10;
			.now{
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
			.info{
			font-family: Inter, Inter;
			font-weight: 600;
			font-size: 31rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}
			.type{
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
			.block1{
			font-family: Inter, Inter;
			font-weight: 400;
			font-size: 23rpx;
			margin-top: 15rpx;
			color: #8A8A8A;
			line-height: 35rpx;
			padding-bottom: 40rpx;
		
			}
	       }
		   
		   
	.detail{
			background-color: #fff;
			  height: 240rpx;
			   margin-top: 10rpx;
			   padding-top:20rpx;
			   font-family: Inter, Inter;
			   font-weight:600;
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
		.moredetail{
			background-color: #fff;
			  height: 1000rpx;
			   margin-top: 15rpx;
			   padding-top:20rpx;
			   .text1{
				font-family: Inter, Inter;
				font-weight:600;
				font-size: 27rpx;
				color: #75694A;
				line-height: 40rpx;
				text-align: left;   
			   }
		}
		.goods-carts {
			height: 146rpx;
			
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