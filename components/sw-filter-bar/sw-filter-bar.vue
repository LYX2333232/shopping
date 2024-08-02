<template>
	<view class="filter-wrap">
		<view class="filter-bar">
			<view class="block" v-for="(item, index) in titleList"
				:style="'color:' + (item.isActive ? item.activeColor : '#444')" :key="index">
				<!-- 标题 -->
				<view class="block" @tap="tapThis(index, item.isActive, item.type)">
					<text>{{ item.name }}</text>
					<text :class="item.isActive ? item.iconDefaultClass : item.iconActiveClass"></text>
				</view>
				<!-- 内容 -->
				<view class="filter-content" v-if="item.type === 'radio' || item.type === 'checkbox'"
					:animation="animate[index]">
					<view class="block" v-for="(list, i) in item.list" :key="i"
						@tap="selectThis(index, i, list.isSelect)">
						<text class="name">{{ list.name }}</text>
						<text class="icon iconfont icon-v-filter" v-if="list.isSelect"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			animate: [{}, {}, {}, {}, {}],
			preAnimationIndex: '',
			animation: {},
			titleList: [
				{
					name: '切换',
					type: 'switch',
					activeColor: 'red',
					isActive: false,
					iconDefaultClass: 'icon iconfont icon-v-filter',
					iconActiveClass: 'icon iconfont icon-r-edit'
				},
				{
					name: '点击',
					type: 'click',
					activeColor: 'red',
					isActive: false,
					iconDefaultClass: 'icon iconfont icon-v-filter',
					iconActiveClass: 'icon iconfont icon-r-edit'
				},
				{
					name: '单选',
					type: 'radio',
					isActive: false,
					iconDefaultClass: 'icon iconfont icon-v-filter',
					iconActiveClass: 'icon iconfont icon-r-edit',
					list: [
						{ name: '按价格升序', isSelect: false },
						{ name: '按价格升序', isSelect: false },
						{ name: '离我最近', isSelect: false },
					]
				},
				{
					name: '多选',
					type: 'checkbox',
					isActive: false,
					iconClass: 'icon iconfont icon-v-filter',
					iconDefaultClass: 'icon iconfont icon-v-filter',
					iconActiveClass: 'icon iconfont icon-r-edit',
					list: [
						{ name: '按价格升序2', isSelect: true },
						{ name: '按价格升序2', isSelect: true },
						{ name: '离我最近2', isSelect: true },
						{ name: '离我最远2', isSelect: true },
					]
				}
			]
		}
	},
	methods: {
		tapThis(index, isActive, type) {
			this.titleList[index].isActive = !isActive
			if (type === 'switch' || type === 'click') {
				const obj = {
					type, index, isActive: !isActive
				}
				this.$emit('tapBar', obj)
			} else {
				//显示单选或者多选的列表
				this.createAnimate(index)
			}
		},
		//单选多选处理
		selectThis(index, subIndex, isSelect) {
			const obj = { index, isSelect: !isSelect }
			if (this.titleList[index].type === 'radio') {
				this.titleList[index].list.forEach(item => {
					item.isSelect = false
				})
				this.titleList[index].list[subIndex].isSelect = true
				this.createAnimate(index) //单选完关闭
				obj.selected = [subIndex]
			} else {
				const selectArray = []
				this.titleList[index].list[subIndex].isSelect = !isSelect
				this.titleList[index].list.forEach((item, i) => {
					item.isSelect && (selectArray.push(i))
				})
				obj.selected = selectArray
			}
			this.$emit('tapBar', obj)
		},
		//创建动画
		createAnimate(index) {
			//现将之前的关闭
			if (this.preAnimationIndex) {
				if (this.preAnimationIndex === index) { //点击同一个两次,显示、隐藏
					this.animation.height(0).step()
					this.animate[index] = this.animation.export()
					this.preAnimationIndex = null
					return
				}
				//切换其他的
				var animation = uni.createAnimation({
					duration: 0, timingFunction: "ease", delay: 0
				})
				animation.height(0).step()
				this.animate[this.preAnimationIndex] = animation.export()
			}

			let height = (this.titleList[index].list.length * 65) + 'upx'
			this.animation.height(height).step()
			this.preAnimationIndex = index
			this.animate[index] = this.animation.export()
		}
	},
	created() {
		var animation = uni.createAnimation({
			duration: 300,
			timingFunction: "ease",
			delay: 0
		})
		this.animation = animation
	}
}
</script>

<style scoped lang="scss">
.filter-wrap {
	font-size: 28upx;
	position: relative;
	color: #444;

	.filter-bar {
		display: flex;
		justify-content: space-around;
		height: 55upx;
		line-height: 55upx;
		border-bottom: 1upx solid #ccc;
		background: #fff;

		.icon {
			font-size: 26upx;
		}

		.filter-content {
			position: absolute;
			top: 60upx;
			left: 0;
			width: 100%;
			background: #fff;
			width: 100%;
			overflow: hidden;
			opacity: .9;
			height: 0;

			.block {
				display: flex;
				justify-content: space-between;
				padding: 0 2%;
				margin: 5upx 0;
			}
		}
	}

}
</style>
