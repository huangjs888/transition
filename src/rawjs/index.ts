/*
 * @Author: Huangjs
 * @Date: 2023-08-23 09:36:07
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-16 15:26:56
 * @Description: ******
 */

import { type IElement, setStyle, getElement } from '@huangjs888/lightdom';
import { Transition as Core, type ITransitionOptions } from '../core';

class Transition extends Core {
  constructor(element: IElement, options?: ITransitionOptions) {
    super({
      apply: (style) => setStyle(getElement(element), style),
      ...(options || {}),
    });
  }
}

export * from '../core';

export { Transition };
