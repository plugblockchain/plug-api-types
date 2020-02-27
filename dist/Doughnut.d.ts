import { AnyU8a, Registry } from '@polkadot/types/types';
import Raw from '@polkadot/types/codec/Raw';
/**
 * An encoded, signed v0 Doughnut certificate
 **/
export default class Doughnut extends Raw {
    get encodedLength(): number;
    constructor(registry: Registry, value?: AnyU8a);
    toU8a(isBare?: boolean): Uint8Array;
}
