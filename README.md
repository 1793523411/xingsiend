## 初始化项目完毕

## 安装依赖完毕

## 后端接口提取

根路径：`http://39.101.140.225:8080`

### 新闻

- 上传接口：`/news/add`

请求参数：POST

```json
{
"author": "xxx",//新闻作者姓名
"title": "xxx",//新闻标题
"thumb": "xxx",//新闻缩略图 url 地址
"head": "xxx",//新闻头，也即新闻的中心句
"content": "xxxx"//新闻内容，为从文本编辑器中获取的 html 文本
"img": [
"http://39.101.140.255:8888group1/M00/00/00/rBp_uV8xWf2AQ8H9AAAhVSefIYE347.jpg",
"http://39.101.140.255:8888group1/M00/00/00/rBp_uV8xWf2AQ8H9AAAhVSefIYE347.jpg",
……
]//img 为数组，保存的是编辑新闻内容的过程中上传的所有图片的 url 地址
}
```

- 预览接口(即单条新闻查询接口):`/preview/news/single/get`

请求参数：GET

```json
{
  "id": 22 //新闻 id 编号，上传新闻成功后，后端返回的数据中包含新闻编号
}
```

- 修改新闻 的策略：删除+重新上传

- 删除新闻：`/news/delete/1` ?????参数呢？id？

### 首页轮播图

- 图片上传接口：GET
  - 首页轮播：`/image/upload/swiper?picture=xxx`
  - 新闻封面：`/image/upload/news/thumb?picture=xxx`
  - 相册封面：`/image/upload/album/thumb?picture=xxx`
  - 新闻图片：`/image/upload/news`

### 图片删除

GET
`/image/delete/commom?picture=xxx`

### 登录接口

POST

`/login`

### 行思相册

GET

新增相册
`/album/add`

请求参数：

```json
{
  "name": "xxx", //相册名称
  "thumb": "xxx.jpg", //相册封面图片完整的 url 地址
  "description": "xxx" //相册描述
}
```

往相册上传图片：请求参数`/image/upload/album?picture=xxxx`

请求参数：GET

```json
{
"id":78 //此 id 编号为相册的 id，在哪一个相册中上传图片，这个 id 参数就是哪一个相册的 id
"description":上传的图片的简略文字描述
}
```

修改相册：`/album/update`
请求参数：GET

```json
{
  "id": 1, //要修改的相册 id
  "name": "xxxx", //修改后的相册名
  "description": "xxx", //修改后相册描述
  "thumb": "vxxxx.jpg" //修改后相册缩略图完整 url 地址
}
```

删除相册接口：`/album/delete/1`

### 行思历史

增加： `/history/add`

请求参数：POST

```json
{
"year": “2020”,//年份
"description": "xxxx", //描述，可以描述 2020 年对应多少届，有什么成就之类的
}
```

接着上面接口添加任职情况：
`/history/person/add`

```json
{
"id": 21//id 为行思历史编号
"data": [
{
"name": "张三",
"grade": "软件工程-1801",
"job": "程序组组长"
},
{
"name": "李四",
"grade": "软件工程-1802",
"job": "主任"
}
],

}
```

删除历史：`/history/delete/1`

修改历史：`/history/update`

```json
{
“id”:11 //id 为每届历史编号
"year": 2020,//修改后的年份
"description": "xxxx", //描述，可以描述 2020 年对应多少届，有什么成就之类的
"data": [
{
"name": "张三",
"grade": "软件工程-1801",
"job": "程序组组长"
},
{
"name": "李四",
"grade": "软件工程-1802",
"job": "主任"
}
]
}
```

### 常用网站

常用网站接口：`/website/add`

添加类目：

```json
{
  "description": "xxx" //例如:影视娱乐
}
```

修改类目

`/website/update`

```json
{
  "id": 1, //id 为要修改的类目编号
  "description": "影视娱乐" //类目描述
}
```

向类目中添加网址：`/website/detail/add`

请求参数：

```json
{
  "id": 1, //id 为已创建的网站类目 id 编号
  "name": "谷歌",
  "url": "www.google.com"
}
```

删除：`/website/detail/delete/1`

## 前台接口

### 轮播
请求格式：get请求 http://121.36.55.44:8080/carousel_pics
{	
	"code": 0,
	"msg":
	"list": [{"url": , 
"jumpUrl":
}]
}
### 新闻缩略：
请求：get http://121.36.55.44:8080/news
{
	"code": 0,	//成功0，不成功-1
	"msg": ""
	"data":
		{	
			"total": 100,	//数据总条数
			"list": [{"newsId":4,"newsTitle":"fgf","authorName":"dfd","createTime":"2020-08-11T10:20:07.000+00:00","visited":5,"newsPictureViewUrl":"gf","newsContentView":null}]
			"pageNum":2,	//第几页
			"pageSize":3,	//每页数据数
			"size":2,		//本页数据数
			"startRow":4,	
			"endRow":5,
			"pages":2,		//总页数
			"prePage":1,	
			"nextPage":0,	
			"isFirstPage":false,	//是否是第一页
			"isLastPage":true,		//是否是最后一页
			"hasPreviousPage":true,
			"hasNextPage":false,
			"navigatePages":8,
			"navigatepageNums":[1,2],
			"navigateFirstPage":1,
			"navigateLastPage":2
		}
}

### 单条新闻：
请求格式：Get请求http://121.36.55.44:8080/news/detail/{1}  1为新闻id
{
	"code": 
	"msg":
	"data":{
		"newsId": 1,
		"newsTitle":
		"authorName":
		"createTime": "发布时间"
		"visited": "访问次数",
		"newsContent": "内容"
	}

}

###  相册：
相册列表：
get请求 http://121.36.55.44:8080/album

{
	"code": 
	"msg":
	"data":{
		"albumId": 1,
		"albumName": "相册名字",
		"albumDesc": "相册描述",
		"albumTime": "相册创建时间",
	}
}

### 具体相册：
get  http://121.36.55.44:8080/album/{id}  id为相册id
{
	"code": 
	"msg":
	"data":{
		"albumId": 1,
		"albumName": "相册名字",
		"albumDesc": "相册描述",
		"albumTime": "相册创建时间",
		“photoList”: {
			“id”: 图片id
			“photoUrl”:
			“photoDesc”: 相片描述
			“createTime”: 上传时间
		}
	}

}

### 历史：
Get请求 http://121.36.55.44:8080/history
{
	"code":
	"msg":
	"data":{
		"year":
		"description":
		"person":{"name": "张三", "grade": "计科", "job": "xxx"}
	}
}

### 网址导航
Get  121.36.55.44:8080/nagivation
{
	"code":
	"msg":
	"data":{
		“类型1”：
			[列表]
		“类型2”:
			[列表]
	}
}


