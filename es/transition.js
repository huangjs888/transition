const _excluded = ["precision", "before", "after", "cancel"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-16 17:32:06
 * @Description: ******
 */

import Animation from './animation';
export class TAProperty {
  // 过渡需要变化的值
  constructor(value) {
    this.value = value;
  }
  // 要实现该值转变为style的字符串方法
}

export default class Transition {
  // 该属性执行所有过渡的动画集合
  constructor({
    element,
    propertyName,
    propertyValue
  }) {
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
  bind(value) {
    // 这里直接做一次校准
    const {
      element,
      propertyName,
      propertyValue
    } = this;
    const newValue = {};
    Object.keys(value).forEach(key => {
      const val = value[key];
      if (typeof val === 'number') {
        newValue[key] = val;
      }
    });
    propertyValue.value = newValue;
    element.style.setProperty(propertyName, propertyValue.toString());
  }
  apply(deltaValue, options) {
    return new Promise(resolve => {
      const {
          precision = {},
          before = () => {},
          after = () => {},
          cancel = true
        } = options,
        restOptions = _objectWithoutPropertiesLoose(options, _excluded);
      const {
        element,
        propertyName,
        propertyValue
      } = this;
      const produced = {};
      // 做一次精度筛选
      Object.keys(deltaValue).forEach(key => {
        const val = deltaValue[key];
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
      const producedKeys = Object.keys(produced);
      // 存在需要执行动画的增量(大于精度的)，进行动画处理
      if (producedKeys.length > 0) {
        // 存储每一帧动画后还有多少剩余没有执行
        const remainValue = _extends({}, produced);
        // 创建动画，并存储到this
        const animation = new Animation(restOptions);
        this._animation.push({
          animation,
          remainValue,
          cancel
        });
        // 开启动画
        animation.start(progress => {
          const next = before(progress, propertyValue.value);
          if (next !== false) {
            let _progress = progress;
            if (typeof next === 'number') {
              _progress = next;
            }
            // 根据动画进度对value进行累加
            producedKeys.forEach(key => {
              // 总的需要消费数减去已经消费的部分，即为这一帧之后未消费的部分，_progress为已消费的进度
              const unconsumed = produced[key] * (1 - _progress);
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
            // 动画结束后删除集合中的这个动画对象
            const index = this._animation.findIndex(a => animation === a.animation);
            // 一般情况不出出现-1，这里强判断（防止动画出现了两次progress为1的情况）
            if (index !== -1) {
              this._animation.splice(index, 1);
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
  }
  cancel(end = false) {
    // end是告诉动画取消时是停留在当前还是执行到终点
    const remainValues = [];
    this._animation = this._animation.filter(({
      animation,
      remainValue,
      cancel
    }) => {
      if (cancel) {
        animation[end ? 'end' : 'stop']();
        // 存储剩余没有执行的部分返回给调用者
        remainValues.push(remainValue);
        return false;
      }
      return true;
    });
    return remainValues;
  }
  transitioning() {
    return this._animation.length !== 0;
  }
}