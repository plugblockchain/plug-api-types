import { AnyU8a, Codec, Registry } from '@polkadot/types/types';
import Raw from '@polkadot/types/codec/Raw';
/**
 * An encoded, signed v0 Doughnut certificate
 **/
export default class Doughnut extends Raw implements Codec {
    get encodedLength(): number;
    constructor(registry: Registry, value?: AnyU8a);
}
