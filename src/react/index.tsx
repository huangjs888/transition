/*
 * @Author: Huangjs
 * @Date: 2023-08-22 16:15:47
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-16 15:27:15
 * @Description: ******
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { setStyle } from '@huangjs888/lightdom';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import {
  Transition as Core,
  type ICSSLikeStyle,
  type ICSSOptionProperties,
  type IAnimationExtendOptions,
} from '../core';

export type ILaunch = {
  cssProperties?: ICSSOptionProperties;
  extendOptions?: IAnimationExtendOptions;
  transitionEnd?: (v: ICSSLikeStyle) => void;
};
export type ICancel = boolean | { end?: boolean; count?: (v: number) => void };

export type ITransitionRef = {
  findDOMElement: () => Element | null | undefined;
  getInstance: () => Core | null | undefined;
};

export type ITransitionProps = {
  launch?: ILaunch;
  cancel?: ICancel;
  children?: React.ReactNode;
};

const Transition = React.forwardRef<ITransitionRef, ITransitionProps>(
  ({ children, launch, cancel }, ref) => {
    const elementRef = React.useRef<Element | null>(null);
    const coreRef = React.useRef<Core | null>(null);

    useIsomorphicLayoutEffect(() => {
      coreRef.current = new Core({
        apply: (style) => {
          const el = elementRef.current;
          if (!(el instanceof Element)) {
            console.warn(`Warning: Transition children is not dom.`);
          }
          setStyle(el, style);
          // 也可以使用setState
        },
      });
    }, []);

    useIsomorphicLayoutEffect(() => {
      if (launch && coreRef.current) {
        const { cssProperties, extendOptions, transitionEnd = () => {} } = launch;
        cssProperties && coreRef.current.apply(cssProperties, extendOptions).then(transitionEnd);
      }
    }, [launch]);

    useIsomorphicLayoutEffect(() => {
      if (cancel && coreRef.current) {
        const count = coreRef.current.cancel(cancel === true ? false : cancel.end);
        if (cancel !== true) {
          typeof cancel.count === 'function' && cancel.count(count);
        }
      }
    }, [cancel]);

    React.useImperativeHandle(
      ref,
      (): ITransitionRef => ({
        findDOMElement: () => elementRef.current,
        getInstance: () => coreRef.current,
      }),
      [],
    );

    // 这里ref函数使用useCallback，为了使每次渲染ref函数为同一个函数
    // 如果函数直接写在下面的ref里，如下所示，则箭头函数在每次渲染都相当于重新创建
    // 此时react里会比较发现ref函数变化，就会先执行变化前的函数，传入null，再执行变化后的函数，传入实际值
    // React.cloneElement(children, {
    //   ref: (a)=>{
    //     ...
    //   },
    // })
    const refFun = React.useCallback((_ref: React.ReactInstance) => {
      let element: any = _ref;
      // ref是Element的时候不需要查找，只有是React.Component的时候才可以查找
      if (!(_ref instanceof Element) && _ref instanceof React.Component) {
        element = ReactDOM.findDOMNode(_ref);
      }
      if (!(element instanceof Element)) {
        element = null;
      }
      elementRef.current = element;
    }, []);

    if (!children) {
      console.warn('Warning: Transition children must exist.');
      return null;
    }

    return React.Children.only(
      React.cloneElement(children as any, {
        ref: refFun,
      }),
    );
  },
);

export * from '../core';

export { Transition };
