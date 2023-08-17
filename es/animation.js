/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-17 11:44:19
 * @Description: ******
 */

const requestAnimationFrame = window.requestAnimationFrame || function () {
  let last = 0;
  // setTimeout时间并不精确，这里做了校准
  return function (fn) {
    const now = Date.now();
    const delay = Math.max(0, 16 - (now - last));
    last = now + delay;
    return window.setTimeout(fn, delay);
  };
}();
const cancelAnimationFrame = window.cancelAnimationFrame || function (id) {
  return window.clearTimeout(id);
};
const callDelay = (callback, delay) => {
  if (delay > 0) {
    window.setTimeout(callback, delay);
  } else {
    callback(Math.abs(delay));
  }
};
class Animation {
  // 每一帧动画执行函数
  constructor({
    duration,
    easing,
    delay
  }) {
    // 动画执行持续时间
    // 动画执行时变换函数
    // 动画延迟多久执行
    this._frameId = 0;
    // 当前正在执行帧的id
    this._sleepId = 0;
    // 当前正在休眠计时id
    this._elapsed = 0;
    // 本次动画已经消耗的时间
    this._tick = null;
    this.duration = typeof duration !== 'number' || duration <= 0 ? 0 : duration;
    this.easing = typeof easing !== 'function' ? v => v : easing;
    this.delay = typeof delay !== 'number' ? 0 : delay;
  }
  start(frameFn) {
    // 只有全新的开始才会运行
    if (this._frameId === 0 && this._elapsed === 0) {
      const {
        duration,
        easing,
        delay
      } = this;
      if (duration > 0) {
        const tick = last => {
          // 本帧时间戳，last：上一帧时间戳
          const now = Date.now();
          // 累计已经耗用的时间
          this._elapsed += now - last;
          if (this._elapsed < duration) {
            // 开启下一帧
            this._frameId = requestAnimationFrame(() => tick(now));
            // 每一帧的进度
            frameFn(easing(this._elapsed / duration));
          } else {
            frameFn(1);
            // 执行完毕后清除
            this._tick = null;
            this._frameId = 0;
            this._elapsed = 0;
          }
        };
        this._tick = tick;
        // 执行第一帧
        callDelay((elapsed = 0) => {
          // 第一次直接用掉这些时间
          this._elapsed = elapsed;
          tick(Date.now());
        }, delay);
      } else {
        callDelay(() => {
          frameFn(1);
        }, delay);
      }
    }
  }
  restart() {
    // restart之前先停止运行
    this.stop();
    // 停止后启动帧，只有动画已经开始并且未结束才可以
    if (this._elapsed < this.duration && this._tick) {
      // 启动帧
      this._tick(Date.now());
    }
  }
  sleep(time) {
    // 这里注意，如果动画先停止，再点休眠，时间一到会再重启动画，相当于delay一下再restart
    if (typeof time !== 'number' || time <= 0) {
      return;
    }
    // sleep之前先停止运行
    this.stop();
    // 停止后启动休眠，只有动画已经开始并且未结束才可以
    if (this._elapsed < this.duration && this._tick) {
      this._sleepId = window.setTimeout(() => {
        // 到时间后重启动画
        this.restart();
      }, time);
    }
  }
  stop() {
    // 如果在sleep，要先清除sleep
    window.clearTimeout(this._sleepId);
    // 清掉还未运行的帧
    cancelAnimationFrame(this._frameId);
    this._frameId = 0;
  }
  end() {
    // end之前先停止运行
    this.stop();
    // 停止后直接运行最后一帧结束动画，只有动画已经开始并且未结束才可以
    if (this._elapsed < this.duration && this._tick) {
      this._elapsed = this.duration;
      this._tick(Date.now());
    }
  }
}
export default Animation;