// 手写promise 摘抄于https://juejin.cn/post/6945319439772434469
// 定义promise中的三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 新建MyPromise类 
class MyPromise {
	// executor是一个立即执行器，进入会立即执行
	// 传入resolve和reject方法
	constructor(executor) {
    try {
      executor(this.resolve,this.reject);
    } catch(e){
      this.reject(e);
    }
	}

	// 存储初始状态值，初始值为pending
	status = PENDING;
	// 成功之后的返回值
	value = null;
	// 失败之后的原因
	reason = null;
  // 储存成功的回调
  onFulfilledCallbak = [];
  // 储存失败的回调
  onRejectedCallbak = [];

	// resolve和reject为什么是箭头函数？
	// 如果直接调用的话，普通函数this指向的是window或者undefined；箭头函数指向当前实例对象
	// 更改成功后的状态，同时存储成功后的返回值
	resovle = (value)=>{
		// 只有状态是等待，才执行状态修改
		if (this.status === PENDING) {
			this.status = FULFILLED;
			this.value = value;
      // 循环取出任务执行
      while(this.onFulfilledCallbak.length){
        // 取出执行回调函数的第一个函数执行，同时将该任务在列表里删除
        this.onFulfilledCallbak.shift()(value);
      }
      // this.onFulfilledCallbak && this.onFulfilledCallbak(this.value);
		} 
	}
	reject = (reason)=>{
		// 只有状态是等待，才执行状态修改
		if (this.status === PENDING) {
			this.status = REJECTED;
			this.reason = reason;
      // 循环取出任务执行
      while(this.onRejectedCallbak.length){
        // 取出执行回调函数的第一个函数执行，同时将该任务在列表里删除
        this.onRejectedCallbak.shift()(reason);
      }
      // this.onRejectedCallbak && this.onRejectedCallbak(this.reason);
		} 
	}
	// then方法
	then(onFulfilled,onRejected){
    // 若then方法没有传入任何参数，则使用默认方法
    const realOnFulfilled = onFulfilled instanceof Function ? onFulfilled : value=>value;
    const realOnRejected = onRejected instanceof Function ? onRejected : reason=>{throw reason}; 
    // 为了链式调用，这里直接创建一个promise对象，并在后面return出去
    const promise2 = new Promise((resolve,reject)=>{
      // 将处理请求的回调代码封装，便于复用
      const fulfilledMicrotask = () => {
        // 调用成功的回调，并把值传入方法
        // 创建一个微任务等待promise2完成初始化 传入resolvePromise方法用于判断是否存在循环调用
        queueMicrotask(()=>{
          try {
            const x = realOnFulfilled(this.value);
            // 传入方法集中处理
            resolvePromise(promise2,x,resolve,reject);  
          } catch(e){
            reject(e);
          }        
        })
      }
      const rejectedMicrotask = () => {
        queueMicrotask(()=>{
          try {
            const x = realOnRejected(this.reason);
            resolvePromise(promise2,x,resolve,reject);
          } catch(e){
            reject(e);
          }
        })
      }
      // 判断状态
      if (this.status === FULFILLED) {
        fulfilledMicrotask();
      }else if (this.status === REJECTED) {
        rejectedMicrotask();
      }else if (this.status === PENDING) {
        this.onFulfilledCallbak.push(fulfilledMicrotask);
        this.onRejectedCallbak.push(rejectedMicrotask);
      }
    })
    return promise2;
	}
  function resolvePromise(promise2,x,resolve,reject){
    // 若判断相等，则说明返回的是实例本身，将错误信息抛出去
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    // 判断x是不是MyPromise的实例
    if (x instanceof MyPromise) {
      // 执行x的then方法，目的是为了将其状态改为fulfilled或rejected
      // x.then(value =>resolve(value),reason=>reject(reason));
      x.then(resolve,reject); 
    } else {
      resolve(x);
    }
  }
  static resolve (params) {
    if (params instanceof MyPromise) {
      return params;
    }
    return new MyPromise(resolve=>{
      resolve(params);
    })
  }
  static reject (reason) {
    return new MyPromise((resolve,reject)=>{
      reject(reason);
    })
  }
}

module.exports = MyPromise;
