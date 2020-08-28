// pages/recipelist/recipelist.js
import {get} from '../../utils/db.js'
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	menuList:[]//菜单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
	  console.log(e)
	  // 获取搜索词
	  let key=e.key;
	// 获取id
	let id=e.id;
	if(e.key){
		// 获取搜索列表
		this.getSearchList(key)
		wx.setNavigationBarTitle({
			title:key
		})
	}
	if(e.id){
		// 获取菜谱列表
		this.getMenuList(id)
		wx.setNavigationBarTitle({
			title:e.name
		})
	}
	
  },
	// 获取菜谱列表
	async getMenuList(id){
		let data={
			typeId:id
		}
		let res=await get('menu',data);
		// console.log(res)
		this.setData({
			menuList:res.data
		})
		
	},
	// 根据搜索词，查询列表
	async getSearchList(key){
		let data={
			menuName:db.RegExp({
				regexp:key,
				options:'i',
			})
		}
		let res=await get('menu',data);
		this.setData({
			menuList:res.data
		})
	}
  
})