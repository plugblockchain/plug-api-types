import Compact from '@polkadot/types/codec/Compact';
import Option from '@polkadot/types/codec/Option';
import Struct from '@polkadot/types/codec/Struct';
import { Address, Balance, Call, EcdsaSignature, Ed25519Signature, ExtrinsicEra, Index, MultiSignature, Sr25519Signature } from '@polkadot/types/interfaces';
import { ExtrinsicSignatureOptions } from '@polkadot/types/primitive/Extrinsic/types';
import { AnyNumber, AnyU8a, IExtrinsicEra, IExtrinsicSignature, IKeyringPair, Registry, RuntimeVersionInterface } from '@polkadot/types/types';
import Doughnut from './Doughnut';
import PlugExtrinsicPayloadV1, { PlugExtrinsicPayloadValue } from './ExtrinsicPayload';
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
    constructor(registry: Registry, value: PlugExtrinsicSignatureV1 | Uint8Array | undefined, { isSigned }?: ExtrinsicSignatureOptions);
    static decodeExtrinsicSignature(value: PlugExtrinsicSignatureV1 | Uint8Array | undefined, isSigned?: boolean): PlugExtrinsicSignatureV1 | Uint8Array;
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number;
    /**
     * @description `true` if the signature is valid
     */
    get isSigned(): boolean;
    /**
     * @description The [[ExtrinsicEra]] (mortal or immortal) this signature applies to
     */
    get era(): ExtrinsicEra;
    /**
     * @description The [[Index]] for the signature
     */
    get nonce(): Compact<Index>;
    /**
     * @description The actual [[EcdsaSignature]], [[Ed25519Signature]] or [[Sr25519Signature]]
     */
    get signature(): EcdsaSignature | Ed25519Signature | Sr25519Signature;
    /**
     * @description The raw [[MultiSignature]]
     */
    get multiSignature(): MultiSignature;
    /**
     * @description The [[Address]] that signed
     */
    get signer(): Address;
    /**
     * @description The [[Doughnut]]
     */
    get doughnut(): Option<Doughnut>;
    /**
     * @description The [[Balance]] tip
     */
    get tip(): Compact<Balance>;
    protected injectSignature(signer: Address, signature: MultiSignature, { era, doughnut, nonce, tip }: PlugExtrinsicPayloadV1): IExtrinsicSignature;
    /**
     * @description Adds a raw signature
     */
    addSignature(signer: Address | Uint8Array | string, signature: Uint8Array | string, payload: PlugExtrinsicPayloadValue | Uint8Array | string): IExtrinsicSignature;
    /**
     * @description Creates a payload from the supplied options
     */
    createPayload(method: Call, { blockHash, doughnut, era, genesisHash, nonce, runtimeVersion: { specVersion }, tip }: SignatureOptions): PlugExtrinsicPayloadV1;
    /**
     * @description Generate a payload and applies the signature from a keypair
     */
    sign(method: Call, account: IKeyringPair, options: SignatureOptions): IExtrinsicSignature;
    /**
     * @description Generate a payload and applies a fake signature
     */
    signFake(method: Call, address: Address | Uint8Array | string, options: SignatureOptions): IExtrinsicSignature;
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array;
}
