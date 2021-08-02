// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
// 返回传入的回调函数的有效版本(对于当前引擎)的内部函数，以便在其他下划线函数中重复应用
/**
 * 这里主要是为了处理回调函数上下文指向的工具函数。也是起到性能优化的作用。内部优化方法。主要是针对参数格式在4个以内的时候，通过 call 进行处理。
 * 例如在 each、map中，第二个参数 iteratee ，第三个参数 context。会通过 optimizeCb 返回一个绑定this指向的执行回调，当未传入context，则直接返回原函数。
 * 这里为什么使用 argCount 呢？如果直接使用 arguments 是否可以实现同样功能呢 ？
 * 答案是肯定的。之所以使用 argCount 是为了避免使用 arguments，直接使用 call，对比使用 apply 提升一点性能。将 switch 这段逻辑注释，也是实现同样功能。这也是为什么 switch 之后还有 return
 * 那么为什么 argCount 没有 2 的情况呢？
 * 这是因为根据 underscore 函数用到的情况，没有使用到两个参数的情况。
 * argCount 为 3 的包括： each、map、filter。。。
 * argCount 为 4 的包括： reduce、reduceRight。。。
 * @param {*} func 回调函数
 * @param {*} context 执行上下文
 * @param {*} argCount 参数个数
 * @returns 
 */
export default function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1: return function(value) {
      return func.call(context, value);
    };
    // The 2-argument case is omitted because we’re not using it.
    case 3: return function(value, index, collection) {
      return func.call(context, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(context, accumulator, value, index, collection);
    };
  }
  return function() {
    return func.apply(context, arguments);
  };
}

// https://blog.csdn.net/WEB_YH/article/details/72576876
// https://segmentfault.com/a/1190000012209493
// https://www.jianshu.com/p/b80b49783de0
// https://stackoverflow.com/questions/23769556/why-is-call-so-much-faster-than-apply
// https://zhuanlan.zhihu.com/p/27659836