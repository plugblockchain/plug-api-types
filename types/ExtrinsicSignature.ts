// Copyright 2017-2019 @polkadot/types authors & contributors & Plug New Zealand Ltd.
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
    Address,
    Balance,
    Call,
    EcdsaSignature,
    Ed25519Signature,
    ExtrinsicEra,
    Index,
    MultiSignature,
    Sr25519Signature,
} from '@polkadot/types/interfaces/runtime';
import { ExtrinsicSignatureOptions } from '@polkadot/types/primitive/Extrinsic/types';

import Compact from '@polkadot/types/codec/Compact';
import { createType } from '@polkadot/types/codec/create';
import Option from '@polkadot/types/codec/Option';
import Struct from '@polkadot/types/codec/Struct';
import { EMPTY_U8A, IMMORTAL_ERA } from '@polkadot/types/primitive/Extrinsic/constants';

import {
    AnyNumber,
    AnyU8a,
    IExtrinsicEra,
    IExtrinsicSignature,
    IKeyringPair,
    RuntimeVersionInterface,
} from '@polkadot/types/types';

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
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength(): number {
        return this.isSigned ? super.encodedLength : 0;
    }

    /**
     * @description `true` if the signature is valid
     */
    get isSigned(): boolean {
        return !this.signature.isEmpty;
    }

    /**
     * @description The [[ExtrinsicEra]] (mortal or immortal) this signature applies to
     */
    get era(): ExtrinsicEra {
        return this.get('era') as ExtrinsicEra;
    }

    /**
     * @description The [[Index]] for the signature
     */
    get nonce(): Compact<Index> {
        return this.get('nonce') as Compact<Index>;
    }

    /**
     * @description The [[Doughnut]]
     */
    get doughnut(): Option<Doughnut> {
        return this.get('doughnut') as Option<Doughnut>;
    }

    /**
     * @description The actual [[EcdsaSignature]], [[Ed25519Signature]] or [[Sr25519Signature]]
     */
    get signature(): EcdsaSignature | Ed25519Signature | Sr25519Signature {
        return this.multiSignature.value as Sr25519Signature;
    }

    /**
     * @description The raw [[MultiSignature]]
     */
    get multiSignature(): MultiSignature {
        return this.get('signature') as MultiSignature;
    }

    /**
     * @description The [[Address]] that signed
     */
    get signer(): Address {
        return this.get('signer') as Address;
    }

    /**
     * @description The [[Balance]] tip
     */
    get tip(): Compact<Balance> {
        return this.get('tip') as Compact<Balance>;
    }

    static decodeExtrinsicSignature(
        value: PlugExtrinsicSignatureV1 | Uint8Array | undefined,
        isSigned = false
    ): PlugExtrinsicSignatureV1 | Uint8Array {
        if (!value) {
            return EMPTY_U8A;
        } else if (value instanceof PlugExtrinsicSignatureV1) {
            return value;
        }

        return isSigned ? value : EMPTY_U8A;
    }
    constructor(
        value: PlugExtrinsicSignatureV1 | Uint8Array | undefined,
        { isSigned }: ExtrinsicSignatureOptions = {}
    ) {
        super(
            {
                signer: 'Address',
                signature: 'MultiSignature',
                doughnut: 'Option<Doughnut>',
                era: 'ExtrinsicEra',
                nonce: 'Compact<Index>',
                tip: 'Compact<Balance>',
            },
            PlugExtrinsicSignatureV1.decodeExtrinsicSignature(value, isSigned)
        );
    }

    /**
     * @description Adds a raw signature
     */
    addSignature(
        signer: Address | Uint8Array | string,
        signature: Uint8Array | string,
        payload: any | Uint8Array | string
    ): IExtrinsicSignature {
        return this.injectSignature(
            createType('Address', signer),
            createType('MultiSignature', signature),
            new PlugExtrinsicPayloadV1(payload)
        );
    }

    /**
     * @description Generate a payload and applies the signature from a keypair
     */
    sign(
        method: Call,
        account: IKeyringPair,
        { blockHash, doughnut, era, genesisHash, nonce, runtimeVersion: { specVersion }, tip }: SignatureOptions
    ): IExtrinsicSignature {
        // console.log('V4 sign');
        const signer = createType('Address', account.publicKey);
        const payload = new PlugExtrinsicPayloadV1({
            blockHash,
            doughnut: doughnut || createType('Option<Doughnut>'),
            era: era || IMMORTAL_ERA,
            genesisHash,
            method: method.toHex(),
            nonce,
            specVersion,
            tip: tip || 0,
        });
        // console.log('ExtrinsicSignature.sign, payload: {}', payload);
        const signature = createType('MultiSignature', payload.sign(account));

        return this.injectSignature(signer, signature, payload);
    }

    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare?: boolean): Uint8Array {
        return this.isSigned ? super.toU8a(isBare) : EMPTY_U8A;
    }

    protected injectSignature(
        signer: Address,
        signature: MultiSignature,
        { doughnut, era, nonce, tip }: PlugExtrinsicPayloadV1
    ): IExtrinsicSignature {
        this.set('doughnut', doughnut);
        this.set('era', era);
        this.set('nonce', nonce);
        this.set('signer', signer);
        this.set('signature', signature);
        this.set('tip', tip);

        return this;
    }
}
