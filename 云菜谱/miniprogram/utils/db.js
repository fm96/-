const db=wx.cloud.database();
// 条件查询
async function get(_collection='',_where={}){
	let result=await db.collection(_collection).where(_where).get();
	return result
}
// 读取数据详情
async function getId(_collection,id){
	let result =await db.collection(_collection).doc(id).get();
	return result
}
// 添加
async function add(_collection='',data={}){
	let result =await db.collection(_collection).add({
		data:data
	});
	return result
}
// 修改
async function update(_collection='',id,data={}){
	let result =await db.collection(_collection).doc(id).update({
		data:data
	})
	return result
}
// 删除
async function del(_collection,id){
	let result=await db.collection(_collection).doc(id).remove();
	return result
}
// 数据自增
async function incData(_collection,id,attr,num){
	const _=db.command
	let data={};
	data[attr]=_.inc(num)
	let result =await db.collection(_collection).doc(id).update({
		data
	})
	return result
}
/*  联表查询 
*@params _collection---数据库表名 第一张表
* 		table-----数据库表 第二张表
* 		attr1-----第一张表的字段属性
* 		attr2-----第二张表的字段属性
* 		list------指定连接匹配出的记录列表要存放的字段名
*/
async function table(_collection,table,attr1,attr2,list){
	let data={};
	const $ = db.command.aggregate
	/* data.form=table;
	data.localField=attr1;
	data.foreignField=attr2;
	data.as=list */
	let result=await db.collection('menuFollow').aggregate().lookup({
		from:'menu',
		let:{
			menuFollow_openid:'$_openid',
			menuFollow_menuId:'$menuId'
		},
		pipeline: $.pipeline().match(_.expr($.and([
			$.eq(['$_openid','$$menuFollow_openid']),
			$.eq(['$_id','$$menuFollow_menuId'])
		]))).project({
			_id:0,
			fileIds:1,
			menuName:1,
		}).done(),
		as:'list',
	}).end();
	return result
}
export{get,getId,add,update,del,incData,table}