var express = require('express');
var router = express.Router();
var UserModel = require("../model/User")
var mongoose = require('mongoose');
var multiparty = require("multiparty");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {});
});

router.get('/dashboard', function(req, res, next) {
    //判断用户是否登录
    if(req.session == null || req.session.username == null){
        res.redirect("/login");
        return;
    }
    res.render('dashboard', {});

});


router.post('/api/login4ajax', function(req, res, next) {
	var username = req.body.username;
    var psw = req.body.psw;
    var txt = req.body.txt;
    var yanzheng = req.body.yanzheng;

    var result = {
            code : 1,
            message: "登录成功"
   };
   if(username != "admin" || psw != "h5h5h5h5"){
	   	result.code = -101;
	    result.message = "账号密码错误";   
   }else if(yanzheng != txt){
   	    result.code = -101;
	    result.message = "验证码错误";
   }else{
   	    //登录成功，生成session
        req.session.username = username;
   }
    res.json(result);
})

router.post('/api/dash4ajax', function(req, res, next) {
  var form = new multiparty.Form({
    uploadDir: "public/images"
    });
    var result = {
        code : 1,
        message: "保存成功"
   };
     var goods_name = req.body.goods_name;
     var goods_num = req.body.goods_num;
     var price = req.body.price;
     var cat_id = req.body.cat_id;
     var details = req.body.details;
     var inventory = req.body.inventory;
     var is_best = req.body.is_best;
     var is_new = req.body.is_new;
     var is_hot = req.body.is_hot;
     var virtual = req.body.virtual;

     

      UserModel.find({goods_num : goods_num},function(err,docs){
        //修改数据
          if(docs.length > 0){
            UserModel.update({goods_num : goods_num},{$set:{goods_name:goods_name,price:price,cat_id:cat_id,details:details,inventory:inventory,is_best:is_best,is_new:is_new,is_hot:is_hot,virtual:virtual}},function(err){
              if(err){
                console.log(err)
              }
              
            }) 
            result.code = 200;
            result.message = "修改成功";
            res.json(result);
            
            //return;
          }else{
             var um = new UserModel();
             um.goods_name = goods_name;
             um.goods_num = goods_num;
             um.price = price;
             um.cat_id = cat_id;
             um.details = details;
             um.inventory = inventory;
             um.is_best = is_best;
             um.is_new = is_new;
             um.is_hot = is_hot;
             um.virtual = virtual;
             um.save(function(err){
                  if(err){
                    res.code = -100;
                    result.message = "保存失败";
                    res.send("保存失败");
                  }
                    res.json(result)
                });
          }
      })
      
})


router.get('/get', function(req, res, next) {
      // UserModel.find({},function(err,docs){
      //   //console.log(docs);
      //      res.send(docs)
      // })
      var pageNO = req.query.pageNO || 1;
      pageNO = parseInt(pageNO);
      var perPageCnt = req.query.perPageCnt || 5;
      perPageCnt = parseInt(perPageCnt);
      UserModel.count({}, function(err, count){
          var pages = Math.ceil(count / perPageCnt)
          if(pageNO <=0){
             pageNO = 1
          }
          if(pageNO > pages){
             pageNO = pages
          }
          var query = UserModel.find({}).skip((pageNO-1)*perPageCnt).limit(perPageCnt);
          query.exec(function(err, docs){
              var result = {
                leng : count,  
                total: pages,
                data: docs,
                pageNOs : pageNO,
                perPageCnts : perPageCnt
              }
              res.json(result);
          })
      })
      
})



//删除数据库中的数据
router.post('/dele', function(req, res, next) {
    
    var goods_num = req.body.goods_num;

   UserModel.remove({goods_num : goods_num},function(err,docs){
       if(!err){
         res.send("删除成功")
       }
   })
})
//模糊搜索
router.post('/search', function(req, res, next) {
       var keyword = req.body.keyword;
       UserModel.find({goods_name: {$regex: keyword}},function(err,docs){
           res.json(docs)
    })
})





module.exports = router;
