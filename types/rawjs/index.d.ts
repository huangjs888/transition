import { type IElement } from '@huangjs888/lightdom';
import Core, { type ITransitionOptions } from '../core';
declare class Transition extends Core {
    constructor(element: IElement, options?: ITransitionOptions);
}
export * from '../core';
export default Transition;
