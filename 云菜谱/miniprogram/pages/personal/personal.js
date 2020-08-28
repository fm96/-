// pages/personal/personal.js
const app = getApp();
const db=wx.cloud.database()
import {
	get,
	del
} from '../../utils/db.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id: 0,
		userInfo: {},
		isLogin: false,
		list: ['菜单', '菜谱', '关注'],
		menuType: [], //菜单分类列表
		menuList: [], //菜单列表
		followList:[]//关注列表
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(e) {
		// 判断用户是否登录
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				isLogin: true
			})
		} else {
			app.userInfoReadyCallback = res => {
				// console.log(res)
				this.setData({
					userInfo: res.userInfo,
					isLogin: true
				})

			}
		}
		
	},
	onShow(){
		// 获取openid
		let openid = wx.getStorageSync('openid')
		// 获取菜单分类
		this.getType(openid)
		// 菜单列表
		this.getMenuList(openid)
		// 关注列表
		this.getFollowList(openid)
	},
	login(e) {
		console.log(e)
		this.setData({
			userInfo: e.detail.userInfo,
			isLogin: true
		})
	},
	// 点击头像，跳转到添加菜单分类页面
	addMenu() {
		wx.navigateTo({
			url: '/pages/pbmenutype/pbmenutype',
		})
	},
	// 点击选项卡切换
	clickTab(e) {
		// console.log(e)
		let openid=wx.getStorageSync('openid')
		this.getFollowList(openid)
		let id = e.currentTarget.id;
		this.setData({
			id
		})
		
	},
	// 获取菜单分类列表
	async getType(openid) {
		let res = await get('menuType', {
			_openid: openid
		});
		this.setData({
			menuType: res.data
		})
	},
	// 添加菜单
	pbmenu() {
		wx.navigateTo({
			url: "/pages/pbmenu/pbmenu"
		})
	},
	// 获取菜单列表
	async getMenuList(openid) {
		let res = await get('menu', {
			_openid: openid
		});
		this.setData({
			menuList: res.data
		})
	},
	// 获取关注的菜单列表
	async getFollowList(openid) {
		let res=await get('menuFollow',{_openid:openid});
		let arr=res.data.map(item=>{
			return item.menuId
		})
		// 根据数组，获取menu详情
		let list =await get('menu',{_id:db.command.in(arr)})
		this.setData({
			followList:list.data
		})
	},
	// 跳转到详情页
	todetail(e){
		// console.log(e)
		// 获取id
		let id=e.currentTarget.id
		// 跳转
		wx.navigateTo({
			url:"/pages/recipeDetail/recipeDetail?id="+id
		})
	},
	// 删除菜单列表
	 delCdlb(e){
		// 获取菜单id和下标
		let {id,index}=e.currentTarget.dataset;
		wx.showModal({
			title:'你确定要删除吗？',
			success:async res=>{
				// console.log(res)
				if(res.confirm==true){
					// 删除数据库的数据
					let openid=wx.getStorageSync('openid')
					let data={
						_openid:openid,
						menuId:id
					}
					// 删除关注表的数据
					let follow=await get('menuFollow',data)
					// console.log(follow)
					if(follow.data.length>0){
						let followId=follow.data[0]._id
						await del('menuFollow',followId)
					}
					// 删除菜单表的数据
					let result= await del('menu',id);
					if(result){
						this.data.menuList.splice(index,1);
						this.setData({
							menuList:this.data.menuList
						})
					}
				}
			}
		})
		
	}

})
