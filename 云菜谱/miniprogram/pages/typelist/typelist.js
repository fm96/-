// pages/typelist/typelist.js
import {get} from '../../utils/db.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
	// 菜单分类列表
	this.getType()
  },
	//获取菜谱分类列表
	 async getType(){
		 let res= await get('menuType')
		 this.setData({
			 typeList:res.data
		 })
	 },
	 // 获取搜索框输入值
	 search(e){
		 this.setData({
			 searchWord:e.detail.value
		 })
	 },
	 //根据搜索词 跳转到菜单列表页
	 doSearch(){
		 let keyword = this.data.searchWord
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
			 url:'/pages/recipelist/recipelist?key='+this.data.searchWord
		 })
		this.setData({
			searchWord:''
		})
	 },
	 // 跳转到菜单列表
	 toList(e){
		 // console.log(e)
		 let {id,value}=e.currentTarget.dataset
		 wx.navigateTo({
		 			 url:'/pages/recipelist/recipelist?id='+id+'&name='+value
		 })
	 }
  
})