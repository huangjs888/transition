"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = exports.TAProperty = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutPropertiesLoose"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/object/keys"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/promise"));
var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/find-index"));
var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/splice"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/filter"));
var _animation = _interopRequireDefault(require("./animation"));
var _excluded = ["precision", "before", "after", "cancel"];
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-16 17:32:06
 * @Description: ******
 */
var TAProperty =
// 过渡需要变化的值
function TAProperty(value) {
  this.value = value;
};
exports.TAProperty = TAProperty;
var Transition = /*#__PURE__*/function () {
  // 该属性执行所有过渡的动画集合
  function Transition(_ref) {
    var element = _ref.element,
      propertyName = _ref.propertyName,
      propertyValue = _ref.propertyValue;
    // 过渡的元素
    // 当前将要过渡的动画应用在元素的哪个属性上
    // 当前将要过渡的动画属性的实时值
    this._animation = [];
    this.element = element;
    // 将驼峰转换为 - 连字符，style.setProperty只支持 - 连字符，不支持驼峰（不生效）
    this.propertyName = propertyName.replace(/([A-Z])/g, '-$1').toLowerCase();
    this.element.style.setProperty(this.propertyName, propertyValue.toString());
    this.propertyValue = propertyValue;
  }
  var _proto = Transition.prototype;
  _proto.bind = function bind(value) {
    // 这里直接做一次校准
    var element = this.element,
      propertyName = this.propertyName,
      propertyValue = this.propertyValue;
    var newValue = {};
    (0, _keys.default)(value).forEach(function (key) {
      var val = value[key];
      if (typeof val === 'number') {
        newValue[key] = val;
      }
    });
    propertyValue.value = newValue;
    element.style.setProperty(propertyName, propertyValue.toString());
  };
  _proto.apply = function apply(deltaValue, options) {
    var _this = this;
    return new _promise.default(function (resolve) {
      var _options$precision = options.precision,
        precision = _options$precision === void 0 ? {} : _options$precision,
        _options$before = options.before,
        before = _options$before === void 0 ? function () {} : _options$before,
        _options$after = options.after,
        after = _options$after === void 0 ? function () {} : _options$after,
        _options$cancel = options.cancel,
        cancel = _options$cancel === void 0 ? true : _options$cancel,
        restOptions = (0, _objectWithoutPropertiesLoose2.default)(options, _excluded);
      var element = _this.element,
        propertyName = _this.propertyName,
        propertyValue = _this.propertyValue;
      var produced = {};
      // 做一次精度筛选
      (0, _keys.default)(deltaValue).forEach(function (key) {
        var val = deltaValue[key];
        if (typeof val === 'number') {
          // 大于精度的先存起来，后面启用动画
          if (Math.abs(val) > (precision[key] || 0)) {
            produced[key] = val;
          } else {
            // 小于精度的直接累加到value
            if (typeof propertyValue.value[key] === 'number') {
              propertyValue.value[key] += val;
            }
          }
        }
      });
      var producedKeys = (0, _keys.default)(produced);
      // 存在需要执行动画的增量(大于精度的)，进行动画处理
      if (producedKeys.length > 0) {
        // 存储每一帧动画后还有多少剩余没有执行
        var remainValue = (0, _extends2.default)({}, produced);
        // 创建动画，并存储到this
        var animation = new _animation.default(restOptions);
        _this._animation.push({
          animation: animation,
          remainValue: remainValue,
          cancel: cancel
        });
        // 开启动画
        animation.start(function (progress) {
          var next = before(progress, propertyValue.value);
          if (next !== false) {
            var _progress = progress;
            if (typeof next === 'number') {
              _progress = next;
            }
            // 根据动画进度对value进行累加
            producedKeys.forEach(function (key) {
              // 总的需要消费数减去已经消费的部分，即为这一帧之后未消费的部分，_progress为已消费的进度
              var unconsumed = produced[key] * (1 - _progress);
              if (typeof propertyValue.value[key] === 'number') {
                // 上一帧未消费的部分减去这一帧之后未消费的部分，即为本次需要消费的部分
                propertyValue.value[key] += remainValue[key] - unconsumed;
              }
              // 更新最新剩余未消费的
              remainValue[key] = unconsumed;
            });
            // 每帧动画后应用到元素并执行帧回调
            element.style.setProperty(propertyName, propertyValue.toString());
          }
          after(progress, propertyValue.value);
          if (progress === 1) {
            var _context;
            // 动画结束后删除集合中的这个动画对象
            var index = (0, _findIndex.default)(_context = _this._animation).call(_context, function (a) {
              return animation === a.animation;
            });
            // 一般情况不出出现-1，这里强判断（防止动画出现了两次progress为1的情况）
            if (index !== -1) {
              var _context2;
              (0, _splice.default)(_context2 = _this._animation).call(_context2, index, 1);
            }
            resolve(propertyValue.value);
          }
        });
      } else {
        // 不存在需要执行动画的增量(小于精度的)，就直接将精度筛选时累加的值应用到元素并执行帧回调
        element.style.setProperty(propertyName, propertyValue.toString());
        resolve(propertyValue.value);
      }
    });
  };
  _proto.cancel = function cancel(end) {
    var _context3;
    if (end === void 0) {
      end = false;
    }
    // end是告诉动画取消时是停留在当前还是执行到终点
    var remainValues = [];
    this._animation = (0, _filter.default)(_context3 = this._animation).call(_context3, function (_ref2) {
      var animation = _ref2.animation,
        remainValue = _ref2.remainValue,
        cancel = _ref2.cancel;
      if (cancel) {
        animation[end ? 'end' : 'stop']();
        // 存储剩余没有执行的部分返回给调用者
        remainValues.push(remainValue);
        return false;
      }
      return true;
    });
    return remainValues;
  };
  _proto.transitioning = function transitioning() {
    return this._animation.length !== 0;
  };
  return Transition;
}();
exports.default = Transition;