import { AnyU8a, Codec } from '@polkadot/types/types';
import U8a from '@polkadot/types/codec/U8a';
/**
 * An encoded, signed v0 Doughnut certificate
 **/
export default class Doughnut extends U8a implements Codec {
    readonly encodedLength: number;
    constructor(value?: AnyU8a);
    toU8a(isBare?: boolean): Uint8Array;
}
