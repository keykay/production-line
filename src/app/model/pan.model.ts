import { SteelPanHandle } from './steel-pan-handle.model';
import { CeramicPan } from './ceramic-pan';

export class Pan {
    ceramicPan: CeramicPan;
    steelHandle: SteelPanHandle;

    constructor(ceramicPan: CeramicPan, steelHandle: SteelPanHandle) {
        this.ceramicPan = ceramicPan;
        this.steelHandle = steelHandle;
    }
}