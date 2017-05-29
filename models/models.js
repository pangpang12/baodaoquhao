var Waterline = require('waterline');
var mysqlAdapter = require('sails-mysql');
var mongoAdapter = require('sails-mongo');
//需要先npm install 安装上面三个模块  
  
// 适配器  
var adapters = {
  mongo: mongoAdapter,
  mysql: mysqlAdapter,
  default: 'mysql'  
};
  
// 连接  
var connections = {
  // mongo: {
  //   adapter: 'mongo',
  //   url: 'mongodb://localhost:27017/notes'
  // },
  mysql: {
    adapter: 'mysql',
    url: 'mysql://root:lenovo88@localhost/query'  
  }
};
// 数据集合 
// 报道流程
var pro_query = Waterline.Collection.extend({
  identity:'pro_query',
  connection:'mysql',
  schema:true,
  attributes:{
    stu_id:{
      type:'string',
      size:10,
      required:true      
    },
    finance:{
      type:'string',
      size:1,
      required:true
    },
    affair:{
      type:'string',
      size:1,
      required:true
    }
  }
});
// 学生信息 
var stu_info = Waterline.Collection.extend({
  identity:'stu_info',
  connection:'mysql',
  schema:true,
  attributes:{
    Stu_id:{
      type:'string',
      size:10,
      required:true
    },
    Name:{
      type:'string',
      required:true
    },
    Gender:{
      type:'string',
      size:1,
      required:true
    },
    Room:{
      type:'string',
      required:true
    }
  }
});
//宿舍信息
var dormitory = Waterline.Collection.extend({
  identity:'dormitory',
  connection:'mysql',
  schema:true,
  attributes:{
    Gender:{
      type:'string',
      size:1,
      required:true
    },
    Apartment:{
      type:'string',
      required:true
    },
    Floor:{
      type:'string',
      required:true
    },
    Room:{
      type:'string',
      required:true
    },
    Bed:{
      type:'string',
      required:true
    },
    Notes:{
      type:'string',
    },
    RB:{
      type:'string',
      required:true
    }
  }

})

// var User = Waterline.Collection.extend({
//     identity: 'users', //集合的 id  
//     connection: 'mysql', //使用的连接数  
//     schema: true, //强制模式  
//     //属性(配置) ---"类似"于 Mongoose 中的 Schema  
//     attributes: {
//         username: {
//           type: 'string',
//           // 校验器  
//           required: true,
//           minLength: 3,
//           maxLength: 20
//         },
//         password: {
//           type: 'string',
//           //校验器  
//           required: true,
//           minLength: 6  
//         },
//         createTime: {
//           type: 'date',
//           //在某个时间点之前  
//           before: '2020-01-01',
//           //在某个时间点之后  
//           after: function(){
//             return new Date();
//           }
//         }
//     },
//     beforeCreate: function(value, cb) {
//         value.createTime = new Date();
          
//         console.log('beforeCreate executed');
//         return cb();
//     }
// });
// var Note = Waterline.Collection.extend({
//     identity: 'notes', //集合的 id  
//     connection: 'mysql', //使用的连接数  
//     schema: true, //强制模式  
//     //属性(配置) ---"类似"于 Mongoose 中的 Schema  
//     attributes: {
//         title: {
//           type: 'string',
//           // 校验器  
//           required: true
//         },
//         author: {
//           type: 'string',
//           // 校验器  
//           required: true
//         },
//         tag: {
//           type: 'string',
//           //校验器  
//           required: true,
//         },
//         content: {
//           type: 'string',
//           //校验器  
//           required: true,
//         },

//         createTime: {
//           type: 'date',
//           //在某个时间点之前  
//           before: '2020-01-01',
//           //在某个时间点之后  
//           after: function(){
//             return new Date();
//           }
//         }
//     }, 
//     // 生命周期回调 --类似于Mongoose中间件  
//     beforeCreate: function(value, cb) {
//         value.createTime = new Date();
          
//         console.log('beforeCreate executed');
//         return cb();
//     }
// });
var orm = new Waterline();
  
// 加载数据集合  
orm.loadCollection(pro_query);
orm.loadCollection(dormitory);
orm.loadCollection(stu_info);
  
var config = {
  adapters: adapters,
  connections: connections  
}
  
exports.orm = orm;
exports.config = config;
