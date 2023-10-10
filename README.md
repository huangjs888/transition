<!--
 * @Author: Huangjs
 * @Date: 2021-05-10 15:55:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-10 15:20:55
 * @Description: ******
-->

## Transition

自定义过渡动画

### 安装使用

```sh

npm install @huangjs888/transition --save

```

### transition 使用方法

```js

import Transition, { Value, easeOutQuart } from '@huangjs888/transition';

const transition = new Transition(document.querySelector('.rect'), {
  cssProperties: {
    transform: new Value(
      { a: 0, k: 1, x: 0, y: 0 }, // 初始位置
      { a: 0.001, k: 0.001, x: 1, y: 1 }, // 初始化动画精度
      (v) => `translate(${v.x}px, ${v.y}px) scale(${v.k}) rotate(${v.a}deg)`, // 应用CSS转换
    ),
  },
});
transition
  .apply(new Value({ a: 90, k: 2, x: 100, y: 100 }), {
    duration: 500,
    easing: easeOutQuart,
    cancel: true, // 动画可以取消
    before: (p) => {
      // console.log('before:', p);
    },
    after: (p) => {
      // console.log('after:', p);
    },
  })
  .then((vv) => {
    console.log('transitionEnd:', vv);
  });
const count = transition.cancel();
console.log('结束了', count, '个动画');

```

### react-transition 使用方法

```js

import React from 'react';
import Transition, { Value, type ILaunch, type ICancel } from '@huangjs888/transition/react';

function App() {
  const [cancel, setCancel] = React.useState<ICancel>(false);
  const stop = () => {
    setCancel({
      count: (v) => {
        console.log('结束了', v, '个动画');
      },
    });
  };
  const [launch, setLaunch] = React.useState<ILaunch>({
    cssProperties: {
      transform: new Value(
        { a: 0, k: 1, x: 0, y: 0 }, // 初始位置
        { a: 0.001, k: 0.001, x: 1, y: 1 }, // 初始化动画精度
        (v) => `translate(${v.x}px, ${v.y}px) scale(${v.k}) rotate(${v.a}deg)`, // 应用CSS转换
      ),
    },
  });
  const start = () => {
    setCancel(false);
    setLaunch({
      cssProperties: new Value({ a: 90, k: 2, x: 100, y: 100 }),
      extendOptions: {
        duration: 500,
        easing: (t) => 1 - (1 - t) * (1 - t),
        cancel: true, // 动画可以取消
        before: () => {
          // console.log('before:', p);
        },
        after: () => {
          // console.log('after:', p);
        },
      },
      transitionEnd: (vv) => {
        console.log('transitionEnd:', vv);
      },
    });
  };

  return (
    <div className="app">
      <div className="btn">
        <input type="button" onClick={() => start()} value="启动" />
      </div>
      <Transition launch={launch} cancel={cancel}>
        <div className="rect" onMouseDown={stop} onTouchStart={stop}>
          测试方块
        </div>
      </Transition>
    </div>
  );
}


```

### animation 使用方法

```js

import Animation from '@huangjs888/transition/animation';
import { easeOutQuart } from '@huangjs888/transition/easing';

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

在线测试预览地址：[https://huangjs888.github.io/transition/](https://huangjs888.github.io/transition/ "预览")
