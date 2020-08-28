// pages/pbmenu/pbmenu.js
import {get,add} from '../../utils/db.js';
import {multiUpload} from '../../utils/tools.js';
const app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
	typeList:[],//菜单分类列表
	files:[],//图片链接集合
	menuName:'',//菜单名称
	desc:'',//介绍
	ischeck:false,
	menuList:[]//菜单列表
  },
	// 页面加载是触发
	onLoad(e){
		// 菜单分类列表
		this.getTypeList();
	},
	// 获取菜单分类列表
	async getTypeList(){
		let res=await get('menuType');
		this.setData({
			typeList:res.data
		})
	},
	// 选择图片时触发的函数
	selectFile(e){
		let tempFilePaths=e.detail.tempFilePaths;
		let files=tempFilePaths.map(item=>{
			return {
				url:item
			}
		})
		this.setData({
			files
		})
	},
	// 发布菜单，上传数据库
	async fbcd(e){
		let avatarUrl=app.globalData.userInfo.avatarUrl;//用户头像
		let nickName=app.globalData.userInfo.nickName;//用户昵称
		let menuName=e.detail.value.menuName;//菜单名称
		let typeId=e.detail.value.recipeTypeid;//菜单分类id
		let desc=e.detail.value.recipesMake;//介绍
		let res =await multiUpload(this.data.files);
		let fileIds=res.map(item=>{
			return item.fileID
		});//菜单图片集合
		let data={
			avatarUrl,
			nickName,
			menuName,
			typeId,
			fileIds,
			desc,
			addTime:new Date().getTime()
			
		}
		let result=await add('menu',data)
		if(result){
			wx.showToast({
				title:"添加成功"
			})
			this.empty()
		}
	},
	// 清空
	empty(){
		this.setData({
			files:[],
			menuName:'',
			desc:'',
			ischeck:false
		})
	}
	
 
})