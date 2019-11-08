"use strict";
// Copyright 2017-2019 @polkadot/types authors & contributors & Plug New Zealand Ltd.
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = require("@polkadot/types/codec/create");
const Struct_1 = require("@polkadot/types/codec/Struct");
const constants_1 = require("@polkadot/types/primitive/Extrinsic/constants");
const ExtrinsicPayload_1 = require("./ExtrinsicPayload");
/**
 * @name PlugExtrinsicSignatureV1
 * @description
 * A container for the [[Signature]] associated with a specific [[Extrinsic]]
 */
class PlugExtrinsicSignatureV1 extends Struct_1.default {
    constructor(value, { isSigned } = {}) {
        super({
            signer: 'Address',
            signature: 'MultiSignature',
            doughnut: 'Option<Doughnut>',
            era: 'ExtrinsicEra',
            nonce: 'Compact<Index>',
            tip: 'Compact<Balance>'
        }, PlugExtrinsicSignatureV1.decodeExtrinsicSignature(value, isSigned));
    }
    static decodeExtrinsicSignature(value, isSigned = false) {
        if (!value) {
            return constants_1.EMPTY_U8A;
        }
        else if (value instanceof PlugExtrinsicSignatureV1) {
            return value;
        }
        return isSigned
            ? value
            : constants_1.EMPTY_U8A;
    }
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength() {
        return this.isSigned
            ? super.encodedLength
            : 0;
    }
    /**
     * @description `true` if the signature is valid
     */
    get isSigned() {
        return !this.signature.isEmpty;
    }
    /**
     * @description The [[ExtrinsicEra]] (mortal or immortal) this signature applies to
     */
    get era() {
        return this.get('era');
    }
    /**
     * @description The [[Index]] for the signature
     */
    get nonce() {
        return this.get('nonce');
    }
    /**
     * @description The [[Doughnut]]
     */
    get doughnut() {
        return this.get('doughnut');
    }
    /**
     * @description The actual [[EcdsaSignature]], [[Ed25519Signature]] or [[Sr25519Signature]]
     */
    get signature() {
        return this.multiSignature.value;
    }
    /**
     * @description The raw [[MultiSignature]]
     */
    get multiSignature() {
        return this.get('signature');
    }
    /**
     * @description The [[Address]] that signed
     */
    get signer() {
        return this.get('signer');
    }
    /**
     * @description The [[Balance]] tip
     */
    get tip() {
        return this.get('tip');
    }
    injectSignature(signer, signature, { doughnut, era, nonce, tip }) {
        this.set('doughnut', doughnut);
        this.set('era', era);
        this.set('nonce', nonce);
        this.set('signer', signer);
        this.set('signature', signature);
        this.set('tip', tip);
        return this;
    }
    /**
     * @description Adds a raw signature
     */
    addSignature(signer, signature, payload) {
        return this.injectSignature(create_1.createType('Address', signer), create_1.createType('MultiSignature', signature), new ExtrinsicPayload_1.default(payload));
    }
    /**
     * @description Generate a payload and applies the signature from a keypair
     */
    sign(method, account, { blockHash, doughnut, era, genesisHash, nonce, runtimeVersion: { specVersion }, tip }) {
        console.log("V4 sign");
        const signer = create_1.createType('Address', account.publicKey);
        const payload = new ExtrinsicPayload_1.default({
            blockHash,
            doughnut: doughnut || create_1.createType('Option<Doughnut>'),
            era: era || constants_1.IMMORTAL_ERA,
            genesisHash,
            method: method.toHex(),
            nonce,
            specVersion,
            tip: tip || 0
        });
        console.log("ExtrinsicSignature.sign, payload: {}", payload);
        const signature = create_1.createType('MultiSignature', payload.sign(account));
        return this.injectSignature(signer, signature, payload);
    }
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare) {
        return this.isSigned
            ? super.toU8a(isBare)
            : constants_1.EMPTY_U8A;
    }
}
exports.default = PlugExtrinsicSignatureV1;
