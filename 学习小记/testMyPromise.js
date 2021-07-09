// 引入我们的MyPromise.js
const MyPromise = require('./MyPromise');
const promise = new MyPromise((resolve,reject) => {
	resolve('success');
	reject('error');
});
promise.then((value)=>{console.log(value)},(reason)=>{console.log(reason)})