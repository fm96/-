// pages/pbmenutype/pbmenutype.js
import {add,get,update,getId,del} from '../../utils/db.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  isAdd:false,
	  isUpdate:false,
	  typeName:'',
	  menuTypeList:[],
	  value:'',
	  id:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
	this.getTypeList()
  },
  // 获取分类菜单列表
  async getTypeList(){
	  let res=await get('menuType');
	  this.setData({
	  	menuTypeList:res.data,
		value:'',
		isUpdate:false,
		isAdd:false
	  })
  },

	// 点击添加按钮
	fladd(){
		this.setData({
			isAdd:true,
			isUpdate:false,
			value:''
		})
	},
	// 获取添加输入框的值
	getType(e){
		this.setData({
			typeName:e.detail.value
		})
	},
	// 获取修改输入框的值
	updateType(e){
		this.getType(e)
	},
	// 点击修改
	async toupdate(e){
		let id=e.currentTarget.id;
		let res=await getId('menuType',id);
		console.log(res)
		this.setData({
			isUpdate:true,
			isAdd:false,
			id,
			value:res.data.typeName
		})
		
	},
	// 点击修改，修改数据库的数据
	async update(e){
		let data={
			typeName:this.data.typeName
		}
		let res=await update('menuType',this.data.id,data);
		console.log(data)
		if(res){
			wx.showToast({
				title:"修改成功"
			})
			this.getTypeList()
		}
	},
	// 点击添加，数据添加进数据库
	async addType(){
		// console.log(e)
		let data={
			typeName:this.data.typeName
		}
		let result=await add('menuType',data);
		if(result){
			wx.showToast({
				title:'添加成功'
			})
			this.getTypeList()
		}
		
	},
	//点击删除
	async delType(e){
		 // 获取id
		 let id=e.currentTarget.id;
		 // 删除
		 let res=await del('menuType',id);
		 if(res){
			 wx.showToast({
				 title:"删除成功"
			 })
			 // 刷新页面
			 this.getTypeList()
		 }
		 
	 }
})