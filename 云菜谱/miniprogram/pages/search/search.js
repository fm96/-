// pages/search/search.js
const db = wx.cloud.database()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		search: '',//搜索框输入的值
		hotList:[],//热门列表
		menuName:''//菜单名字
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		// 热门搜索
		let res = await db.collection('menu').orderBy('views', 'menuName').limit(9).get()
		// 循环返回菜单名字的数组
		let hotList=res.data.map(item=>{
			return item.menuName
		})
		this.setData({
			hotList
		})
	},
	// 获取搜索框的值
	search(e) {
		this.setData({
			[e.currentTarget.dataset.value]: e.detail.value
		})
	},
	onShow() {
		let arr = wx.getStorageSync('keyword') || [];
		this.setData({
			arr
		})
	},
	// 点击搜索，跳转到菜单列表页
	doSearch() {
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
			url: "/pages/recipelist/recipelist?key=" + this.data.search
		})
		this.setData({
			search: ''
		})
	},
	// 跳转到菜单列表
	toList(e){
		// console.log(e)
		this.setData({
			menuName:e.currentTarget.dataset.value
		})
		// 跳转页面
		wx.navigateTo({
			url:"/pages/recipelist/recipelist?key="+this.data.menuName
		})
	}

})
