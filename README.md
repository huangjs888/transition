<!--
 * @Author: Huangjs
 * @Date: 2021-05-10 15:55:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-27 10:59:21
 * @Description: ******
-->
## transition
自定义过渡动画
### 使用方法
```javascript

import Transition, {
  TAProperty,
  Animation,
  easeOutQuart,
} from '@huangjs888/transition';

const transition = new Transition({
  element: document.body,
  propertyName: 'transform',
  propertyValue: new (class extends TAProperty {
    toString() {
      return `translate(${this.value.x}px,${this.value.y}px)`;
    }
  })({ x: 0, y: 0 }),
});

transition
  .apply(
    { x: 10, y: 10 },
    {
      precision: { x: 1, y: 1 },
      cancel: true,
      duration: 500,
      easing: easeOutQuart,
    },
  )
  .then((value) => {
    if (!transition.transitioning()) {
      // 在最后一个动画的最后一帧结束重新绑定一下过渡值，目的是为了让_transition里的value和_transform保持一致
      transition.bind({ x: 1, y: 1 });
    }
    return value;
  });

transition.cancel().map((value) => {
  // 取消动画时剩余未执行部分
});
// 动画部分
const animation = new Animation({
  duration: 500,
  easing: easeOutQuart,
  delay: -100,
});
// 开启动画
animation.start((progress) => {
  // 动画每一帧执行
  if (progress === 1) {
    // 动画结束后删除集合中的这个动画对象
  }
});
animation.stop();
animation.restart();
animation.sleep(2000);
animation.end();

```
