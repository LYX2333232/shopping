
<template>
<view style="width: 93%; margin: 0 auto;">

	<view class="top">
		
		<image src="../../static/logo.png" mode="widthFix" class="image"></image>
		<view class="tabel">
			个人买家
		</view>
		<view class="" v-if="login==1">
			<view class="denglu">
			点击授权登录	
			</view>
			
			<view class="bianhao" >
				编号：{{num}}
			</view>
		</view>
		<view class="" v-if="login==0">
			<view class="denglu">
			initial
			</view>
		 <view class="bianhao" >
			编号：{{num}}
		 </view>
		</view>
		<image src="../../static/logo.png" mode="" style="width: 15px; height: 15px;  margin:30rpx 0 0 20rpx ;" @click="toedit" ></image>
	</view>
	
	<view class="middle" >
		<image src="../../static/logo.png" mode="aspectFill" style="position: absolute; z-index: -999;width: 700rpx;height: 140.38rpx;border-radius: 11.54rpx;" ></image>
	

	 <view  class="block">
		<view class="image">
			<image src="../../static/icon/tabbar/1.png" mode="" ></image>
		</view>
		
		<view class="p1">
			立即加盟分销商
		</view>
     </view>
		<view class="block">
			
			<view class="p2">
			多重好礼任你选，各种特权
			</view>
			<view class="p3" @click="tojoin">
			立即加盟	
			</view>
		</view>
	
	</view>


 <view class="block1" >
	 <view  style="display: flex;justify-content: space-between;"> 	 
	 <view class="myorder">
		我的订单
	 </view>
	 <view style="padding-top: 15rpx;color: rgba(124, 124, 124, 1);margin-right: 20rpx;" @click="toall">
		全部订单	
		<uni-icons type="right" size="14" color=" rgba(124, 124, 124, 1)" style="margin-left: -5rpx;"></uni-icons>
	 </view>
	 </view>
	 <view class="function">
	 	<view class="tofunction"  v-for="(item,index) in funList" @click="tap_item(index)">
	 		<view class="img" >
	 			<img :src="item.icon" alt="" mode="aspectFill" />
	 		</view>
	 		<view  style="font-size: 27rpx;color: rgba(102, 102, 102, 1);">
	 		{{item.name}}	
	 		</view>
	 		
	 	</view>
	 </view>
</view>

 <view class="block2">

	<view class="myorder">
			我的应用
	</view>
	
	<view class="function">
		<view class="tofunction"  v-for="(item,index) in funList1" @click="tap_item(index)">
			<view class="img" >
				<img :src="item.icon" alt="" mode="aspectFill" />
			</view>
			<view  style="font-size: 27rpx;color: rgba(102, 102, 102, 1);">
			{{item.name}}	
			</view>
			
		</view>
	</view>
	
 </view>

</view>	
</template>
<script setup>
	let login='1'
	let num='121212121'
	
	
	let funList=[
		{
			name: '待付款',
			icon: '../../static/logo.png'
			},{
			name: '待发货',
			icon: '../../static/logo.png'
		},{
			name: '待收货',
			icon: '../../static/logo.png'
		},
		{
			name: '退款/售后',
			icon: '../../static/logo.png'
		},
	]
	let funList1=[
		{
			name: '账号设置',
			icon: '../../static/logo.png'
			},{
			name: '消息中心',
			icon: '../../static/logo.png'
		},{
			name: '收货地址',
			icon: '../../static/logo.png'
		},
		{
			name: '核销记录',
			icon: '../../static/logo.png'
		},
	]
</script>

<style lang="scss">
	page{
		width: 750rpx;
	height: auto;
	background :  linear-gradient(  0deg,rgba(240, 240, 240, 1.0) 67.000002%,  rgba(240, 224, 198, 1)100.000002%);
		  
	  .top{
		  height: 180rpx;
		  display: flex;
		  margin-top: 150rpx;
		  .image{
			  width: 65px;
			  height: 65px;
			  border-radius: 100%;
			  margin-right: 25rpx;
		  }
		  .tabel{
			position: absolute;
			background: linear-gradient(90deg,rgba(255, 232, 184, 0.77) 20%,rgba(250, 197, 82, 1)100%);
			width: 121.15rpx;
			height: 36.54rpx;
			border-radius:53.85rpx;
			color: rgba(152, 99, 40, 1);
			top: 255rpx;
			
		  }
		  .denglu{
			  font-style:Inter-Medium ;
			  font-size: 34rpx;
			  margin-top: 20rpx;
			  margin-bottom: 10rpx;
		  }
		  .bianhao{
			color: #6D6D6D;
			font-size: 22rpx;
		  }
	  }
		
		.middle{
			height: 140.38rpx;
			border-radius: 11.54rpx;
		.block{
			display: flex; 
	     padding-top: 10rpx;
		 padding-left: 26rpx;
		 font-family: PingFang SC, PingFang SC;
		 .image{
			width: 30rpx;height: 30rpx;margin-right: 10rpx;margin-top: 30rpx;
		 }
		 .p1{
		margin-top: 20rpx;
		font-weight: 500;
		font-size: 31rpx;
		color: #FFDFC3;
		line-height: 46rpx;
		text-align: left;
		 }
		 .p2{
			font-weight: 400;
			font-size: 23rpx;
			color: #FFDFC3;
			line-height: 35rpx;
		 }
		 .p3{
			 width: 146rpx;
			 height: 56rpx;
			 background: linear-gradient( 96deg, #EDD3A9 0%, #E0B57E 100%);
			 border-radius: 56rpx;
			 text-align: center;
			 font-family: PingFang SC, PingFang SC;
			 font-weight: 500;
			 font-size: 27rpx;
			 color: #835A2C;
			 padding-top: 12rpx;
			position: absolute;
			right: 50rpx;
			top: 375rpx;
			 
		 }
		}
		
		}
		.block1{
			height: 232.69rpx;
			background-color: #fff;
			border-radius: 13.46rpx;
			margin-top: 40rpx;
			
			
			.myorder{
				font-family: Inter, Inter;
				font-weight: 600;
				font-size: 31rpx;
				color: #000000;
				line-height: 46rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
				padding-left: 20rpx;
				padding-top: 10rpx;
			}
		}
		.block2{
			height: 438.46rpx;
			background-color: #fff;
			border-radius: 13.46rpx;
			margin-top: 15rpx;
			
			.myorder{
				font-family: Inter, Inter;
				font-weight: 600;
				font-size: 31rpx;
				color: #000000;
				line-height: 46rpx;
				text-align: left;
				font-style: normal;
				text-transform: none;
				padding-left: 20rpx;
				padding-top: 10rpx;
			}
		}
		
		.function{
			margin-top: 15rpx;
			display: flex;
			text-align: center;
			justify-content: space-between;
		}
		.tofunction{
			
			  background-color: rgba(255, 255, 255, 1);
			  border-radius: 6px;
			  width: 100px;
			  height: 88px;
			
			  .img{
				   width: 26px;
				   height: 26px;
				  text-align: center;
				  margin: 0 auto;
				  margin-top: 35rpx;
				  margin-bottom: 25rpx;
			  }
		}
	
	}
	 
	
	
</style>