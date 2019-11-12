import { Address, Balance, Call, ExtrinsicEra, Index, Signature } from '@polkadot/types/interfaces/runtime';
import { IExtrinsicSignature, IKeyringPair } from '@polkadot/types/types';
import { ExtrinsicSignatureOptions } from '@polkadot/types/primitive/Extrinsic/types';
import Compact from '@polkadot/types/codec/Compact';
import Option from '@polkadot/types/codec/Option';
import Struct from '@polkadot/types/codec/Struct';
import { AnyU8a, AnyNumber, IExtrinsicEra, RuntimeVersionInterface } from '@polkadot/types/types';
import Doughnut from './Doughnut';
import PlugExtrinsicPayloadV1 from './ExtrinsicPayload';
export interface SignatureOptions {
    blockHash: AnyU8a;
    era?: IExtrinsicEra;
    doughnut?: Option<Doughnut>;
    genesisHash: AnyU8a;
    nonce: AnyNumber;
    runtimeVersion: RuntimeVersionInterface;
    tip?: AnyNumber;
}
/**
 * @name PlugExtrinsicSignatureV1
 * @description
 * A container for the [[Signature]] associated with a specific [[Extrinsic]]
 */
export default class PlugExtrinsicSignatureV1 extends Struct implements IExtrinsicSignature {
    constructor(value: PlugExtrinsicSignatureV1 | Uint8Array | undefined, { isSigned }?: ExtrinsicSignatureOptions);
    static decodeExtrinsicSignature(value: PlugExtrinsicSignatureV1 | Uint8Array | undefined, isSigned?: boolean): PlugExtrinsicSignatureV1 | Uint8Array;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    readonly encodedLength: number;
    /**
     * @description `true` if the signature is valid
     */
    readonly isSigned: boolean;
    /**
     * @description The [[ExtrinsicEra]] (mortal or immortal) this signature applies to
     */
    readonly era: ExtrinsicEra;
    /**
     * @description The [[Index]] for the signature
     */
    readonly nonce: Compact<Index>;
    /**
     * @description The [[Doughnut]]
     */
    readonly doughnut: Option<Doughnut>;
    /**
     * @description The actual [[EcdsaSignature]], [[Ed25519Signature]] or [[Sr25519Signature]]
     */
    readonly signature: Signature;
    /**
     * @description The [[Address]] that signed
     */
    readonly signer: Address;
    /**
     * @description The [[Balance]] tip
     */
    readonly tip: Compact<Balance>;
    protected injectSignature(signer: Address, signature: Signature, { doughnut, era, nonce, tip }: PlugExtrinsicPayloadV1): IExtrinsicSignature;
    /**
     * @description Adds a raw signature
     */
    addSignature(signer: Address | Uint8Array | string, signature: Uint8Array | string, payload: any | Uint8Array | string): IExtrinsicSignature;
    /**
     * @description Generate a payload and applies the signature from a keypair
     */
    sign(method: Call, account: IKeyringPair, { blockHash, doughnut, era, genesisHash, nonce, runtimeVersion: { specVersion }, tip }: SignatureOptions): IExtrinsicSignature;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
}
