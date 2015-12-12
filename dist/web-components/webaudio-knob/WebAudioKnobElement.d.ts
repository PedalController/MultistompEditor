declare class WebAudioKnobElement extends HTMLElement {
    constructor();
    is: string;
    properties: {
        value: {
            type: NumberConstructor;
            value: number;
            observer: string;
        };
        min: {
            type: NumberConstructor;
            value: number;
        };
        max: {
            type: NumberConstructor;
            value: number;
        };
        step: {
            type: NumberConstructor;
            value: number;
        };
        src: {
            type: StringConstructor;
            value: string;
        };
        name: StringConstructor;
        listener: {
            type: ObjectConstructor;
            value: any;
        };
    };
    
    value: number;
    min: number;
    max: number;
    step: number;
    src: string;
    name: string;
    listener: any;

    valueTip: any;
    attached(): void;
    calculeSprites(sprite: any): void;
    findTips(): any[];
    mousemove(e: any): void;
    cancel(e: any): void;
    update(value: any): void;
    updateByImage(knob: any, value: any): void;
    calculePercentual(value: any): number;
    updateByRodate(knob: any, value: any): void;
    calculeAngle(value: any): number;
    mousedown(e: any): void;
    offsetSize(): any;
    valueChanged(newValue: any, oldValue: any): void;
}
