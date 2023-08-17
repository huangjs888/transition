import Animation, { type AIOptions } from './animation';
type TIValue = {
    [key: string]: number;
};
export type TAIOptions = AIOptions & {
    cancel?: boolean;
    precision?: TIValue;
    before?: (p: number, v: TIValue) => void | boolean | number;
    after?: (p: number, v: TIValue) => void;
};
export declare abstract class TAProperty {
    value: TIValue;
    constructor(value: TIValue);
    abstract toString(): string;
}
export type TIOptions = {
    element: HTMLElement;
    propertyName: string;
    propertyValue: TAProperty;
};
export default class Transition {
    element: HTMLElement;
    propertyName: string;
    propertyValue: TAProperty;
    _animation: {
        animation: Animation;
        remainValue: TIValue;
        cancel: boolean;
    }[];
    constructor({ element, propertyName, propertyValue }: TIOptions);
    bind(value: TIValue): void;
    apply(deltaValue: TIValue, options: TAIOptions): Promise<TIValue>;
    cancel(end?: boolean): TIValue[];
    transitioning(): boolean;
}
export {};
