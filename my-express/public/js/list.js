$(".tabber li").click(function(){
	$(".navs").css("display","none")
	$(".nav" + ($(this).index() + 1)).css("display","block")
     $(this).children().css({"color":"#000","background":"#fff"})
     $(this).siblings().children().css({"color":"#787878","background":"#f3f3f3"});
})
$(".left>ul>li").click(function(){
	obj = $(this).next();
	if(obj.css("display") == "none"){
		obj.css("display","block")
	}else if(obj.css("display") == "block"){
		obj.css("display","none")
	}
})
$("#list li").click(function(){
	$(".right").css("display","none")
	$(".right" + ($(this).index() + 1)).css("display","block")
})

function btn(){
	if($("#goods_name").val() == ""){
		alert("商品名称不能为空");
		return;
	}
	if($("#cat_id option:selected").text() == ""){
		alert("商品分类不能为空");
		return;
	}
	if($("#price").val() == ""){
		alert("售价不能为空");
		return;
	}
	if($("#goods_num").val() == ""){
        goodsnum();
	}
	$.ajax({
	url: "/api/dash4ajax",
	type: "post",
	data: {
		goods_name: $("#goods_name").val(),
		goods_num: $("#goods_num").val(),
		cat_id : $("#cat_id option:selected").text(),
		price : $("#price").val(),
		details :$("#text").val(),
		virtual :$("#virtual").val(),
		inventory: $("#inventory").val(),
		is_best: $("#is_best").is(":checked"),
		is_new: $("#is_new").is(":checked"),
		is_hot: $("#is_hot").is(":checked")
	     },
	    success: function(res){
				console.log(res);
				if(res.code == 1){
					alert(res.message)	
					console.log(res.goods);
					 history.go(0);
				}else{
					alert(res.message);
					 history.go(0);
				}
	    }
    })
}
//分页
fenye();
function fenye(){
 $.ajax({
    	url: "/get",
	    type: "GET",
	    data : {
	    	pageNO : $("#pageCurrent").html(),
	    	perPageCnt : $("#pageSize").val()
	    },
	    success: function(res){
	    	$(".delet").remove();
	    	//总共有多少页

	    	var pages = res.total;
	    	$("#totalPages").html(pages);
	    	//记录商品总个数
	    	$("#totalRecords").html(res.leng)

	    	var len = res.data.length;
	    	var res = res.data;

	    	for(var i = 0;i < len;i ++){
	    		if(res[i].is_best == "true"){
	    			 res[i].is_best = '<img src="images/yes.gif">'
	    		}else{
	    			res[i].is_best = '<img src="images/no.gif">'
	    		}
	    		if(res[i].is_new == "true"){
	    			 res[i].is_new = '<img src="images/yes.gif">'
	    		}else{
	    			res[i].is_new = '<img src="images/no.gif">'
	    		}
	    		if(res[i].is_hot == "true"){
	    			 res[i].is_hot = '<img src="images/yes.gif">'
	    		}else{
	    			res[i].is_hot = '<img src="images/no.gif">'
	    		}
	    		if(res[i].inventory == null){
	    			 res[i].inventory = 0
	    		}
	    		if(res[i].virtual == null){
	    			 res[i].virtual = 0
	    		}
	    		
	    		$("#tbodys").append('<tr class="delet"><td><input type="checkbox" >' + (i + 1) +'</td><td>'+ res[i].goods_name +'</td><td>'+ res[i].goods_num +'</td><td>'+ res[i].price +'</td><td><img src="images/yes.gif"></td><td>'+ res[i].is_best +'</td><td>'+ res[i].is_new +'</td><td>'+ res[i].is_hot +'</td><td>'+ (i + 50) +'</td><td>'+ res[i].inventory +'</td><td>'+ res[i].virtual +'</td><td><a href="javascript:;" title="编辑"><img src="images/icon_edit.gif"></a><a href="javascript:;" title="删除"><img src="images/icon_trash.gif"></a></td></tr>')

	    	}
	    	
	    	//提取商品货号
	    	var lens = $("#tbodys tr").length;
	    	//删除
	    	for(var i = 1;i<lens;i++){
	    		$("#tbodys tr:eq(" + i + ") td:last a:last").click(function(){
	    			//$(this).parent().parent().children().eq(2).html()
	    			$.ajax({
	    				url : "/dele",
	    				type: "post",
	    				data : {
	    				      goods_num : $(this).parent().parent().children().eq(2).html()
	    				},
	    				success: function(res){
								//console.log(res);
							alert(res)
					    }
	    			})
	    			history.go(0);
	    		})
	    	}
	    	//编辑

			for(let i = 1;i<lens;i++){
				$("#tbodys tr:eq(" + i + ") td:last a:first").click(function(){
					$(".right1").css("display","none");
					$(".right2").css("display","block");
					$("#goods_name").val(res[i - 1].goods_name);
					$("#goods_num").val(res[i - 1].goods_num);
					$("#cat_id option:selected").text(res[i - 1].cat_id);
					$("#price").val(res[i - 1].price);
					$("#virtual").val(res[i - 1].virtual);
					$("#inventory").val(res[i - 1].inventory);
					
				})
			}
	    	
	    }
    })
}



function goodsnum(){
	var Num=""; 
    for(var i=0;i<6;i++) { 
        Num += Math.floor(Math.random()*10); 
    } 
     $("#goods_num").val(Num)  
}
//重置按钮事件
function resect(){
	$("#goods_name").val("");
	$("#goods_num").val("");
	$("#cat_id option:selected").text("");
	$("#price").val("");
	$("#text").val("");
	$("#inventory").val("");
	$("#virtual").val("");
}


//给下一个添加事件
var addpage = parseInt($("#pageCurrent").html())
$("#addpage").click(function(){
	$("#pageCurrent").html(addpage += 1);
	fenye();
})
//给上一个添加事件
$("#minpage").click(function(){
	$("#pageCurrent").html(addpage -= 1);
	fenye();
})

//给第一个添加事件
$("#onepage").click(function(){
	$("#pageCurrent").html(1);
	fenye();
})
//添加失焦事件
$("#pageSize").blur(function(){
	fenye();
})


//给搜索按钮添加事件
$("#btn").click(function(){
	$.ajax({
		url: "/search",
	    type: "post",
	    data : {
	    	keyword : $("#keyword").val()
	    },
	    success : function(res){
	    	//console.log(res)
	    	$(".delet").remove();
	    	var len = res.length; 
	    	for(var i = 0;i < len;i ++){
	    		if(res[i].is_best == "true"){
	    			 res[i].is_best = '<img src="images/yes.gif">'
	    		}else{
	    			res[i].is_best = '<img src="images/no.gif">'
	    		}
	    		if(res[i].is_new == "true"){
	    			 res[i].is_new = '<img src="images/yes.gif">'
	    		}else{
	    			res[i].is_new = '<img src="images/no.gif">'
	    		}
	    		if(res[i].is_hot == "true"){
	    			 res[i].is_hot = '<img src="images/yes.gif">'
	    		}else{
	    			res[i].is_hot = '<img src="images/no.gif">'
	    		}
	    		if(res[i].inventory == null){
	    			 res[i].inventory = 0
	    		}
	    		if(res[i].virtual == null){
	    			 res[i].virtual = 0
	    		}
	    	$("#tbodys").append('<tr class="delet"><td><input type="checkbox" >' + (i + 1) +'</td><td>'+ res[i].goods_name +'</td><td>'+ res[i].goods_num +'</td><td>'+ res[i].price +'</td><td><img src="images/yes.gif"></td><td>'+ res[i].is_best +'</td><td>'+ res[i].is_new +'</td><td>'+ res[i].is_hot +'</td><td>'+ (i + 50) +'</td><td>'+ res[i].inventory +'</td><td>'+ res[i].virtual +'</td><td><a href="javascript:;" title="编辑"><img src="images/icon_edit.gif"></a><a href="javascript:;" title="删除"><img src="images/icon_trash.gif"></a></td></tr>')
	         }
	         
	         var lens = $("#tbodys tr").length;
	    	//删除
	    	for(var i = 1;i<lens;i++){
	    		$("#tbodys tr:eq(" + i + ") td:last a:last").click(function(){
	    			//$(this).parent().parent().children().eq(2).html()
	    			$.ajax({
	    				url : "/dele",
	    				type: "post",
	    				data : {
	    				      goods_num : $(this).parent().parent().children().eq(2).html()
	    				},
	    				success: function(res){
								//console.log(res);
							
					    }
	    			})
	    			history.go(0);
	    		})
	    	}

	    	//编辑

			for(let i = 1;i<lens;i++){
				$("#tbodys tr:eq(" + i + ") td:last a:first").click(function(){
					$(".right1").css("display","none");
					$(".right2").css("display","block");
					$("#goods_name").val(res[i - 1].goods_name);
					$("#goods_num").val(res[i - 1].goods_num);
					$("#cat_id option:selected").text(res[i - 1].cat_id);
					$("#price").val(res[i - 1].price);
					$("#virtual").val(res[i - 1].virtual);
					$("#inventory").val(res[i - 1].inventory);
					
				})
			}
	    }
	})
})


//图片上传
