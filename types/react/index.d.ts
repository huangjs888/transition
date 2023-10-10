import React from 'react';
import Core, { type ICSSLikeStyle, type ICSSOptionProperties, type IAnimationExtendOptions } from '../core';
export * from '../core';
export type ILaunch = {
    cssProperties?: ICSSOptionProperties;
    extendOptions?: IAnimationExtendOptions;
    transitionEnd?: (v: ICSSLikeStyle) => void;
};
export type ICancel = boolean | {
    end?: boolean;
    count?: (v: number) => void;
};
export type ITransitionRef = {
    findDOMElement: () => Element | null | undefined;
    getInstance: () => Core | null | undefined;
};
export type ITransitionProps = {
    launch?: ILaunch;
    cancel?: ICancel;
    children?: React.ReactNode;
};
declare const _default: React.ForwardRefExoticComponent<ITransitionProps & React.RefAttributes<ITransitionRef>>;
export default _default;
