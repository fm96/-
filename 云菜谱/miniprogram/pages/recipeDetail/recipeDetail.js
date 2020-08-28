// pages/recipeDetail/recipeDetail.js
import {
	getId,
	add,
	get,
	del,
	update,
	incData
} from '../../utils/db.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		detail: {}, //数据详情
		isAttention: false //是否关注
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(e) {
		let id = e.id;
		// 加载详情页，浏览数自增1
		await incData('menu',id,'views',1);
		// 获取详情
		this.getDetail(id);
		// 查看用户是否已关注
		this.getFollows(id);
		
	},
	//根据id获取某条数据
	async getDetail(id) {
		let res = await getId('menu', id);
		// console.log(res)
		this.setData({
			detail: res.data
		})
	},
	// 查看用户是否已关注
	async getFollows(id) {
		let openid = wx.getStorageSync('openid');
		// 查询当前用户所有已关注的菜单
		let res=await get('menuFollow',{_openid: openid,menuId:id});
		// 循环判断当前页面菜单id与menuFollow表的菜单id是否相等，是---返回下标，否---返回-1
		/* let result=res.data.findIndex(item=>{
			return item.menuId==id
		}) */
		if(res.data.length==0){
			this.setData({
				isAttention:false
			})
		}else{
			this.setData({
				isAttention:true
			})
		}
	},
	// 点击关注，添加进数据库
	async attention(e) {
		// 获取菜单id
		let id = e.currentTarget.id;
		// 获取openid
		let openid = wx.getStorageSync('openid');
		// 查询数据库，判断是否已关注
		let result = await get('menuFollow', {
			_openid: openid,
			menuId:id
		});
		// console.log(result);return;
		// 循环数据
		// let follow=result.data.findIndex(item=>{
		// 	return item.menuId==id
		// })
		// 如果不存在，添加关注
		if(result.data.length==0){
			// 查询menu表对应的数据，更新关注数
			await incData('menu',id,'follows',1)
			// 存入数据库
			let data={
				menuId:id,
				addTime:new Date().getTime()
			}
			// 添加关注表
			await add('menuFollow',data);
			let res= await getId('menu',id)
				this.setData({
					isAttention:true,
					detail:res.data
				})
				
		}else{
			// 存在，删除数据库已有的数据
			// console.log(id)
			// 关注id
			let fid=result.data[0]._id
			await del('menuFollow',fid);
			// 获取列表
			// let res= await getId('menu',id)
			this.data.detail.follows-=1;
				this.setData({
					isAttention:false,
					detail:this.data.detail
				})
				// 查询menu表对应的数据，更新关注数
				await incData('menu',id,'follows',-1)
					
		}
		
			

		
	}

})
