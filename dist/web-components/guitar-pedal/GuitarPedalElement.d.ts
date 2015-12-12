declare class GuitarPedalElement extends HTMLElement {
    constructor();
    is: string;

    properties: {
        name: StringConstructor;
        color: {
            type: StringConstructor;
            value: string;
        };
        actived: boolean;
    };

    name: string;
    color: string;
    actived: boolean;

    ready(): void;
    //click: any;
    notify(evento: any): void;
    toggle(): void;

    active(): void;
    disable(): void;
    addKnobs(knobs: any): void;

    knobs: Array<WebAudioKnobElement>;
}
