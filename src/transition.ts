/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-20 14:54:52
 * @Description: ******
 */

import Animation, { type AIOptions } from './animation';

type TIValue = {
  [key: string]: number;
};
export type TAIOptions = AIOptions & {
  cancel?: boolean; // 该过渡过程是否可以取消
  precision?: TIValue; // 传入精度，如果变化值小于这个精度，就不再动画，直接赋值
  // 过渡时每一帧执行之前（只针对过渡动画，对于精度值小于precision的变化，由于不会开启Animation，所以不会调用该函数）
  // 返回false，则该帧不执行即丢帧，返回其它则按照原来的继续向下执行（若返回是数字，则会达到篡改progress目的）
  before?: (p: number, v: TIValue) => void | boolean | number;
  // 过渡时每一帧执行之后（只针对过渡动画，对于精度值小于precision的变化，由于不会开启Animation，所以不会调用该函数）
  after?: (p: number, v: TIValue) => void;
};

export abstract class TAProperty {
  value: TIValue; // 过渡需要变化的值
  constructor(value: TIValue) {
    this.value = value;
  }
  abstract toString(): string; // 要实现该值转变为style的字符串方法
}
export type TIOptions = {
  element: HTMLElement; // 过渡应用的元素
  propertyName: string; // 当前将要过渡的动画应用在元素的哪个属性上
  propertyValue: TAProperty; // 当前将要过渡的动画属性的实时值
};

export default class Transition {
  element: HTMLElement; // 过渡的元素
  propertyName: string; // 当前将要过渡的动画应用在元素的哪个属性上
  propertyValue: TAProperty; // 当前将要过渡的动画属性的实时值
  _animation: {
    animation: Animation; // 当前正在执行的过渡动画
    remainValue: TIValue; // 该过渡动画被取消后剩余未执行的值
    cancel: boolean; // 该过渡动画是否可以停止
  }[] = []; // 该属性执行所有过渡的动画集合
  constructor({ element, propertyName, propertyValue }: TIOptions) {
    this.element = element;
    // 将驼峰转换为 - 连字符，style.setProperty只支持 - 连字符，不支持驼峰（不生效）
    this.propertyName = propertyName.replace(/([A-Z])/g, '-$1').toLowerCase();
    this.element.style.setProperty(this.propertyName, propertyValue.toString());
    this.propertyValue = propertyValue;
  }
  bind(value: TIValue) {
    // 这里直接做一次校准
    const { element, propertyName, propertyValue } = this;
    const newValue: TIValue = {};
    Object.keys(value).forEach((key) => {
      const val = value[key];
      if (typeof val === 'number') {
        newValue[key] = val;
      }
    });
    propertyValue.value = newValue;
    element.style.setProperty(propertyName, propertyValue.toString());
  }
  apply(deltaValue: TIValue, options: TAIOptions) {
    return new Promise<TIValue>((resolve) => {
      const {
        precision = {},
        before = () => {},
        after = () => {},
        cancel = true,
        ...restOptions
      } = options;
      const { element, propertyName, propertyValue } = this;
      const produced: TIValue = {};
      // 做一次精度筛选
      Object.keys(deltaValue).forEach((key) => {
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
        const remainValue = { ...produced };
        // 创建动画，并存储到this
        const animation = new Animation(restOptions);
        this._animation.push({ animation, remainValue, cancel });
        // 开启动画
        animation.start((progress) => {
          const next = before(progress, propertyValue.value);
          if (next !== false) {
            let _progress = progress;
            if (typeof next === 'number') {
              _progress = next;
            }
            // 根据动画进度对value进行累加
            producedKeys.forEach((key) => {
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
            const index = this._animation.findIndex(
              (a) => animation === a.animation,
            );
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
  cancel(end: boolean = false) {
    // end是告诉动画取消时是停留在当前还是执行到终点
    const remainValues: TIValue[] = [];
    this._animation = this._animation.filter(
      ({ animation, remainValue, cancel }) => {
        if (cancel) {
          animation[end ? 'end' : 'stop']();
          // 存储剩余没有执行的部分返回给调用者
          remainValues.push(remainValue);
          return false;
        }
        return true;
      },
    );
    return remainValues;
  }
  transitioning() {
    return this._animation.length !== 0;
  }
}
