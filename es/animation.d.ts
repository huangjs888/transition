declare class Animation {
    duration: number;
    easing: AIEasing;
    delay: number;
    _frameId: number;
    _sleepId: number;
    _elapsed: number;
    _tick: ((t: number) => void) | null;
    constructor({ duration, easing, delay }: AIOptions);
    start(frameFn: (v: number) => void): void;
    restart(): void;
    sleep(time: number): void;
    stop(): void;
    end(): void;
}
export type AIEasing = (v: number) => number;
export type AIOptions = {
    duration?: number;
    easing?: AIEasing;
    delay?: number;
};
export default Animation;
