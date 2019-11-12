/**
This file is a copy of `@polkadot/types/primitive/Extrinsic/v4/Extrinsic`
It has had its payload and signature type changed to use Plug versions.
**/
import { Address, Call } from '@polkadot/types/interfaces/runtime';
import { ExtrinsicPayloadValue, IExtrinsicImpl, IKeyringPair, SignatureOptions } from '@polkadot/types/types';
import { ExtrinsicOptions } from '@polkadot/types/primitive/Extrinsic/types';
import Struct from '@polkadot/types/codec/Struct';
import PlugExtrinsicSignatureV1 from './ExtrinsicSignature';
export declare const TRANSACTION_VERSION = 3;
export interface ExtrinsicValueV4 {
    method?: Call;
    signature?: PlugExtrinsicSignatureV1;
}
/**
 * @name PlugExtrinsicV1
 * @description
 * The first generation of Plug extrinsic.
 * It is lightly modified [[ExtrinsicV4]] from `@polkadot/types`
 */
export default class PlugExtrinsicV1 extends Struct implements IExtrinsicImpl {
    constructor(value?: Uint8Array | ExtrinsicValueV4 | Call, { isSigned }?: Partial<ExtrinsicOptions>);
    static decodeExtrinsic(value?: Call | Uint8Array | ExtrinsicValueV4, isSigned?: boolean): ExtrinsicValueV4;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    readonly encodedLength: number;
    /**
     * @description The [[Call]] this extrinsic wraps
     */
    readonly method: Call;
    /**
     * @description The [[PlugExtrinsicSignatureV1]]
     */
    readonly signature: PlugExtrinsicSignatureV1;
    /**
     * @description The version for the signature
     */
    readonly version: number;
    /**
     * @description Add an [[PlugExtrinsicSignatureV1]] to the extrinsic (already generated)
     */
    addSignature(signer: Address | Uint8Array | string, signature: Uint8Array | string, payload: ExtrinsicPayloadValue | Uint8Array | string): PlugExtrinsicV1;
    /**
     * @description Sign the extrinsic with a specific keypair
     */
    sign(account: IKeyringPair, options: SignatureOptions): PlugExtrinsicV1;
}
