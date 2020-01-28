import Compact from '@polkadot/types/codec/Compact';
import Option from '@polkadot/types/codec/Option';
import Struct from '@polkadot/types/codec/Struct';
import { Balance, ExtrinsicEra, Hash, Index } from '@polkadot/types/interfaces/runtime';
import Bytes from '@polkadot/types/primitive/Bytes';
import u32 from '@polkadot/types/primitive/U32';
import { AnyNumber, AnyU8a, IExtrinsicEra, IKeyringPair, IMethod, Registry } from '@polkadot/types/types';
import Doughnut from './Doughnut';
import { PlugInterfaceTypes } from './InterfaceTypes';
export interface PlugExtrinsicPayloadValue {
    blockHash: AnyU8a;
    doughnut?: Option<Doughnut>;
    era: AnyU8a | IExtrinsicEra;
    genesisHash: AnyU8a;
    method: AnyU8a | IMethod;
    nonce: AnyNumber;
    specVersion: AnyNumber;
    tip?: AnyNumber;
}
export declare const BasePayloadV1: Record<string, PlugInterfaceTypes>;
export declare const SignedExtraV1: Record<string, PlugInterfaceTypes>;
export declare const PayloadV1: Record<string, PlugInterfaceTypes>;
/**
 * @name PlugExtrinsicPayloadV1
 * @description
 * A signing payload for an [[Extrinsic]]. For the final encoding, it is variable length based
 * on the contents included
 */
export default class PlugExtrinsicPayloadV1 extends Struct {
    constructor(registry: Registry, value?: PlugExtrinsicPayloadValue | Uint8Array | string);
    /**
     * @description The block [[Hash]] the signature applies to (mortal/immortal)
     */
    get blockHash(): Hash;
    /**
     * @description The [[ExtrinsicEra]]
     */
    get era(): ExtrinsicEra;
    /**
     * @description The genesis [[Hash]] the signature applies to (mortal/immortal)
     */
    get genesisHash(): Hash;
    /**
     * @description The [[Bytes]] contained in the payload
     */
    get method(): Bytes;
    /**
     * @description The [[Index]]
     */
    get nonce(): Compact<Index>;
    /**
     * @description The specVersion for this signature
     */
    get specVersion(): u32;
    /**
     * @description The tip [[Balance]]
     */
    get tip(): Compact<Balance>;
    /**
     * @description The [[Doughnut]]
     */
    get doughnut(): Option<Doughnut>;
    /**
    * @description Sign the payload with the keypair
    */
    sign(signerPair: IKeyringPair): Uint8Array;
}
