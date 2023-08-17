"use strict";

exports.__esModule = true;
exports.createEase = createEase;
exports.createEaseInOut = createEaseInOut;
exports.easeOutQuart = exports.easeOutQuad = exports.easeOutInQuad = exports.easeInOutQuad = void 0;
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-19 14:47:27
 * @Description: ******
 */

// 对于函数 s = f(t)
// 函数平移(x,y)（函数自变量t变为t-x，整体结果s+y）
// 函数缩放 k 倍（函数自变量t变为t/k，整体结果s*k）
// 先平移再缩放：s = (f((t/k)-x)+y)*k
// 先缩放再平移：s = (f((t-x)/k)*k)+y

var baseEase = {
  linear: function linear(t) {
    return t;
  },
  inQuad: function inQuad(t) {
    return t * t;
  },
  outQuad: function outQuad(t) {
    return 1 - (1 - t) * (1 - t);
  },
  inCubic: function inCubic(t) {
    return t * t * t;
  },
  outCubic: function outCubic(t) {
    return 1 - (1 - t) * (1 - t) * (1 - t);
  },
  inQuart: function inQuart(t) {
    return t * t * t * t;
  },
  outQuart: function outQuart(t) {
    return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t);
  },
  inQuint: function inQuint(t) {
    return t * t * t * t * t;
  },
  outQuint: function outQuint(t) {
    return 1 - (1 - t) * (1 - t) * (1 - t) * (1 - t) * (1 - t);
  }
};
// 取值easeFn函数变量的某一段转成easing函数，a为开始变量值，b为结束变量值
function createEase(a, b, easeFn) {
  if (a === void 0) {
    a = 0;
  }
  if (b === void 0) {
    b = 1;
  }
  if (easeFn === void 0) {
    easeFn = baseEase.linear;
  }
  var k = 1 / (b - a);
  if (!k || k <= 0) {
    return function () {
      return 0;
    };
  }
  // easeFn先平移( -a , -easeFn(a) )，再缩放 k 倍
  // 接着使函数值也在(0,1)之间，即：经上述变换之后的函数，另变量为1，求函数值，函数再除以该函数值得到最终的函数
  return function (t) {
    return (easeFn(t / k + a) - easeFn(a)) * k / ((easeFn(1 / k + a) - easeFn(a)) * k);
  };
}
// 把两个easing函数连接转成新的easing函数，k为比例
function createEaseInOut(k, easeIn, easeOut) {
  if (k === void 0) {
    k = 1 / 2;
  }
  if (easeIn === void 0) {
    easeIn = baseEase.linear;
  }
  if (easeOut === void 0) {
    easeOut = baseEase.linear;
  }
  if (k <= 0) {
    return easeOut;
  }
  if (k >= 1) {
    return easeIn;
  }
  return function (t) {
    return t <= k ?
    // easeIn直接缩放k
    easeIn(t / k) * k :
    // easeOut衔接easeIn，需要先平移( k/(1-k) , k/(1-k) )，再缩放 1-k
    (easeOut(t / (1 - k) - k / (1 - k)) + k / (1 - k)) * (1 - k);
  };
}
var easeInOutQuad = createEaseInOut(1 / 2, baseEase.outQuad, baseEase.inQuad);
exports.easeInOutQuad = easeInOutQuad;
var easeOutInQuad = createEaseInOut(1 / 2, baseEase.inQuad, baseEase.outQuad);
exports.easeOutInQuad = easeOutInQuad;
var easeOutQuad = baseEase.outQuad;
exports.easeOutQuad = easeOutQuad;
var easeOutQuart = baseEase.outQuart;
exports.easeOutQuart = easeOutQuart;