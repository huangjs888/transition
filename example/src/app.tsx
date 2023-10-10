/*
 * @Author: Huangjs
 * @Date: 2023-08-30 11:09:21
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-10 14:27:39
 * @Description: ******
 */

import React from 'react';
import Transition, { Value, type ILaunch, type ICancel } from '@huangjs888/transition/react';
import { easeOutQuart } from '@huangjs888/transition/easing';
import './app.css';

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
  const start = (v: number) => {
    setCancel(false);
    setLaunch({
      cssProperties: new Value(
        v === 1
          ? { x: 200 }
          : v === 2
          ? { a: 90 }
          : v === 3
          ? { y: 200 }
          : v === 4
          ? { k: 2 }
          : { a: 0, k: 1, x: 0, y: 0 },
      ),
      extendOptions: {
        duration: v === 1 ? 3000 : v === 2 ? 2000 : v === 3 ? 2500 : v === 4 ? 3500 : 500,
        easing: easeOutQuart,
        cancel: v === 1 || v === 2, // 动画可以取消
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
        <input type="button" onClick={() => start(0)} value="重置" />
        <input type="button" onClick={() => start(1)} value="平移" />
        <input type="button" onClick={() => start(2)} value="旋转" />
        <input type="button" onClick={() => start(3)} value="垂直（不）" />
        <input type="button" onClick={() => start(4)} value="放大（不）" />
      </div>
      <Transition
        ref={(a) => {
          console.log(a?.getInstance());
        }}
        launch={launch}
        cancel={cancel}>
        <div className="rect" onMouseDown={stop} onTouchStart={stop}>
          测试方块
        </div>
      </Transition>
    </div>
  );
}

export default App;
