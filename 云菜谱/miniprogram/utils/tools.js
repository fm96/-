/* 
 *上传文件到云存储
 * @params _filePath  文件临时路径
 * 		   _cloudPath  文件上传服务器后的云端路径
 */
async function upload(_filePath){
	let ext=_filePath.split(".").pop();
	let nowtime=new Data().getTime();
	return await wx.cloud.uploadFile({
		cloudPath:nowtime+'.'+ext,
		filePath:_filePath
	})
}
/* 
 *多个文件上传
 * @params tempFilePaths  临时文件数组
 */
async function multiUpload(tempFilePaths){
	let arr=[];
	tempFilePaths.forEach(item=>{
		let nowtime=new Date().getTime();//定义文件名称
		let ext=item.url.split(".").pop();//获取文件扩展名（后缀）
		// 把pormise对象push到数组里面去
		let item1=wx.cloud.uploadFile({
			cloudPath:nowtime+'.'+ext,
			filePath:item.url
		})
		arr.push(item1)
	})
	// 所有上传都完成，返回一个结果
	let result=await Promise.all(arr);
	return result
}

export {upload,multiUpload}