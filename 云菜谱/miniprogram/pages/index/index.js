import {
	get
} from '../../utils/db.js'
Page({
	data: {
		search: '', //搜索框的值
		menuList: [], //菜单列表 
		navList: [
			{
				id: '7498b5fe5f43c8f3003c514a2cb25a7a',
				text: '儿童菜谱',
				img: '/static/index/ertong.png'
			},
			{
				id: '6518b7395f43cb8e003ad92433a94616',
				text: '养生菜谱',
				img: '/static/index/yangsheng.png'
			},
			{
				id: 'b5416b755f43c992004546c55853442e',
				text: '推荐菜谱',
				img: '/static/index/tuijian.png'
			}
		] //列表导航
	},
	onShow(e) {
		this.getMenuList()
	},
	// 获取菜单列表
	async getMenuList() {
		let res = await get('menu');
		this.setData({
			menuList: res.data
		})
	},
	// 跳转到详情页
	todetail(e) {
		let id = e.currentTarget.id;
		wx.navigateTo({
			url: '/pages/recipeDetail/recipeDetail?id=' + id
		})
	},
	// 点击跳转到菜单列表页
	torecipelist(e) {
		let{id,value}=e.currentTarget.dataset
		wx.navigateTo({
			url: '/pages/recipelist/recipelist?id=' + id+'&name='+value
		})

	},
	// 跳转到菜单分类页面
	totypelist(){
		wx.navigateTo({
			url:"/pages/typelist/typelist"
		})
	},
	// 获取搜索框的值
	search(e) {
		// console.log(e)
		this.setData({
			[e.currentTarget.dataset.value]: e.detail.value
		})
	},
	// 点击搜索，根据输入框的值，跳转到菜单列表页
	toList(){
		let keyword = this.data.search
		let arr = wx.getStorageSync('keyword') || []
		let index = arr.findIndex(item => {
			return item == keyword
		})
		// 数组删除
		if (index != -1) {
			arr.splice(index, 1)
		}
		// 数组末尾追加
		arr.unshift(keyword)
		// 缓存到本地
		wx.setStorageSync('keyword', arr)
		// 页面跳转
		wx.navigateTo({
			url:"/pages/recipelist/recipelist?key="+this.data.search
		})
		this.setData({
			search:''
		})
	}
		
})
