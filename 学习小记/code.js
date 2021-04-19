// 随机生成指定长度的[from-to]区间的数组且数组内元素不重复。
function arrayCreate(len,from,to) {
  var result = [];  
  if (len/(to-from) > 0.3) { // 若比例超过0.3，则生成一个从from到to的整数数组，从中取数
    var arr = Array.from({length:to-from},(item,i)=>i+from);
    for (var i = 0;i <len;i++) {
      result.push(arr.splice(Math.round(Math.random()*arr.length),1)[0]);
    }
  } else { // 若比例较低，则重复率偏少，则采用set方式去重,去重后重新生成
    /*for (var i=0;i<len;i++) {
      result.push(Math.round(Math.random()*to+from));
      result = [...new Set(result)]
      i = result.length-1 !== i ? i-1 : i;
    }*/
    while (result.length < len) {
      result.push(Math.round(Math.random()*to+from));
      result = [...new Set(result)]
    }
  }
  return result;
}
// JS设置浏览器cookie name为cookie的键名 value为键值 expireDate为cookie设置多久后过期，如30min,单位为分钟
function setCookie (name,value,expireDate) {
  var expDate = new Date();
  expDate.setTime(expDate.getTime() + expireDate*60*1000); // 换算成毫秒
  document.cookie = name + '=' + value + ";expire=" + expDate.toGMTString();
}
// JS获取浏览器设置的cookie
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0;i < ca.length;i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length,c.length);
    }
  }
}
// JS判断数据类型
function typeOf(obj) {
  var res = Object.prototype.toString.call(obj).slice(8,-1).toLowerCase(); // 以数组为例，得到array
  return res; // array
}
// 数组去重
// ES5 利用indexOf方法总是返回数据在数组里的第一次出现的位置的特性
function unique(arr) {
  var res = arr.filter(function (item,index,array) {
    return array.indexOf(item) === index;
  })
  return res;
}
// ES6 利用Set数据结构特性去重
var unique1 = (arr) => [...new Set(arr)];
// 数组扁平化
// ES6 新增方法Array.prototype.flat()
// ES5 递归实现
function flatten(arr) {
  var res = [];
  for (var i=0;i<=arr.length-1;i++) {
    if (Array.isArray(arr[i])) {
      res = res.concat(flatten(arr[i]));
    } else {
      res.push(arr[i]);
    }
  }
  return res;
}
// ES6
function flatten1(arr) {
  while(arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr;
}
// 浅拷贝 只考虑对象类型
function shallowcopy(obj) {
  if (typeof obj !== 'object') {return ;}
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) { // for...in遍历会遍历对象上的所有可遍历属性，包括继承到的属性
    if (obj.hasOwnProperty(key)) { // 检测一个对象是否含有特定的自身属性，用来去除掉遍历出来的从原型上继承过来的属性
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
// 简易深拷贝 只考虑普通对象属性，不考虑内置对象和函数
function deepClone(obj) {
  if (typeof obj !== 'object') {return ;}
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
    }
  }
  return newObj;
}
// 优化版深拷贝 基于简易版本上增加了对象循环引用的场景判断，考虑了内置对象和函数的拷贝
var isObject = (target) => {
  if (typeof target === 'object' || typeof target === 'function' && target !== null) {
    return true;
  }
  return false;
}
function deepClone1(obj,map = new WeakMap()) {
  // 解决循环引用问题
  if (map.get(obj)) {
    return obj;
  }
  // 获取当前传入值的构造函数，判断该值的类型
  let constructor = obj.constructor;
  // 如果传入的是正则或日期类型，直接重新创建对应类型的实例
  if (/^(RegExp|Date)$/i.test(constructor.name)) {
    return new constructor(obj);
  }
  if (isObject(obj)) {
    let newObj = Array.isArray(obj) ? [] : {}; 
    // 将传入对象作为key传入weakmap中
    map.set(obj,true);
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = deepClone1(obj[key],map);
      }
    }
    return newObj;
  } else {
    return target;
  }
}
// 偏函数 考虑占位符 记录
function partial(fn, ...args) {
  return (...arg) => {
    index = args.indexOf('_')
    args[index] = arg.splice(index,1)[0];
    return fn(...args, ...arg)
  }
}
// for循环中使用setTimeout
// 方法一：利用闭包
for (var i=0;i<5;i++) {
  (function (j) {
    setTimeout(function() {
      console.log(j);
    },j*1000)
  })(i)
}
// 方法二：利用setTimeout的第三个参数 注：第三个参数，需要回调函数接收
for (var i=0;i<5;i++) {
  setTimeout(function(j) {
    console.log(j);
  },i*1000,i)
}
// 方法三：利用let声明块级作用域
for (let i=0;i<5;i++) {
  setTimeout(function() {
    console.log(i);
  },i*1000)
}
// 方法四：拆分方法，将setTimeout的定义与使用放在不同的方法中
function timer(i) {
  setTimeout(function() {
    console.log(i);
  },i*1000)
}
for(var i =0;i<5;i++) {
  timer(i);
}
// 手动实现instanceof
function instance_of(L,R){ // L为实例对象，R为构造函数
  var O = R.prototype,L = L.__proto__;
  while(true){
    if (L === null) {
      return false;
    }
    if (O === L) { // 全等，对象和引用地址相同且类型相同
      return true;
    }
    L = L.__proto__;
  }
}
// 手动实现instanceof 使用constructor，无法判断继承,因为子类继承了父类的构造函数
function instance_of(L,R){ // L为实例对象，R为构造函数
  var L = L.__proto__;
  while(true){
    if (L === null) {
      return false;
    }
    if (R === L.constructor) { // 全等，对象和引用地址相同且类型相同
      return true;
    }
    L = L.__proto__;
  }
}
// 实现new关键字
function _new(func,...args) {
    let obj = Object.create(func.prototype);
    let result = func.call(obj,...args);
    if (result && /^(object|function|number|string|boolean|symbol|bigint)$/.test(typeof(result))) {
        return result;
    }
    return obj;
}
function aa (age) {
    this.age = age;
}
var obj = _new(aa,1)
console.log(obj); //aa {age:1}
console.log(_new(Number,1)) // 1
console.log(_new(Boolean,1)) // true
console.log(_new(String,1)) // '1'
console.log(_new(Symbol,1)) // Symbol(1)
console.log(_new(BigInt,1)) // 1n
// 解决0.1+0.2！=0.3的问题
var addNum = (num1,num2) => {
  let len1=0,len2=0,m=0,sum=0; 
  try {
    len1 = num1.toString().split('.')[1] || 0;
  } catch(e) {
    console.log(e);
  }
  try {
    len2 = num2.toString().split('.')[1] || 0;
  } catch(e) {
    console.log(e);
  }
  m = Math.pow(10,Math.max(len1,len2));
  sum = (num1*m + num2*m)/m;
  return sum;
}
// 图片懒加载
// 选中所有img，生成imgList
let imgList = [...document.querySelectorAll('img')];
let length = imgList.length;
const imgLazyLoad = () => {
  let count = 0;
  return (() => {
    let deleteImgeList = [];
    imgList.forEach((img,index)=>{
      let rect = img.getBoundingClientRect();
      if (rect.top <= window.innerHeight) {
        img.src = img['data-set']['src'];
        deleteImgeList.push(index);
        conut++;
      }
    })
    if (count.length === imgList.length) { // 说明所有图片均已加载完成
      window.removeEventListener('scroll',imgLazyLoad);
    }
    imgList.filter((img,index)=>deleteImgeList.includes(index));
  })()
}
window.addEventListener('scroll',imgLazyLoad);