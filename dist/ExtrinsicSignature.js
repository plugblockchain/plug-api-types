"use strict";
// Copyright 2017-2019 @polkadot/types authors & contributors & 2019-2020 Plug New Zealand Ltd.
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@polkadot/types");
const Struct_1 = require("@polkadot/types/codec/Struct");
const constants_1 = require("@polkadot/types/extrinsic/constants");
const ExtrinsicPayload_1 = require("./ExtrinsicPayload");
const util_1 = require("@polkadot/util");
/**
 * @name PlugExtrinsicSignatureV1
 * @description
 * A container for the [[Signature]] associated with a specific [[Extrinsic]]
 */
class PlugExtrinsicSignatureV1 extends Struct_1.default {
    constructor(registry, value, { isSigned } = {}) {
        super(registry, {
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
        return isSigned ? value : constants_1.EMPTY_U8A;
    }
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength() {
        return this.isSigned ? super.encodedLength : 0;
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
     * @description The [[Doughnut]]
     */
    get doughnut() {
        return this.get('doughnut');
    }
    /**
     * @description The [[Balance]] tip
     */
    get tip() {
        return this.get('tip');
    }
    injectSignature(signer, signature, { era, doughnut, nonce, tip }) {
        this.set('era', era);
        this.set('doughnut', doughnut);
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
        return this.injectSignature(types_1.createType(this.registry, 'Address', signer), types_1.createType(this.registry, 'MultiSignature', signature), new ExtrinsicPayload_1.default(this.registry, payload));
    }
    /**
     * @description Creates a payload from the supplied options
     */
    createPayload(method, { blockHash, doughnut, era, genesisHash, nonce, runtimeVersion: { specVersion }, tip }) {
        return new ExtrinsicPayload_1.default(this.registry, {
            blockHash,
            doughnut: doughnut || types_1.createType(this.registry, 'Option<Doughnut>'),
            era: era || constants_1.IMMORTAL_ERA,
            genesisHash,
            method: method.toHex(),
            nonce,
            specVersion,
            tip: tip || 0,
        });
    }
    /**
     * @description Generate a payload and applies the signature from a keypair
     */
    sign(method, account, options) {
        const signer = types_1.createType(this.registry, 'Address', account.publicKey);
        const payload = this.createPayload(method, options);
        const signature = types_1.createType(this.registry, 'MultiSignature', payload.sign(account));
        return this.injectSignature(signer, signature, payload);
    }
    /**
     * @description Generate a payload and applies a fake signature
     */
    signFake(method, address, options) {
        const signer = types_1.createType(this.registry, 'Address', address);
        const payload = this.createPayload(method, options);
        const signature = types_1.createType(this.registry, 'MultiSignature', util_1.u8aConcat(new Uint8Array([1]), new Uint8Array(64).fill(0x42)));
        return this.injectSignature(signer, signature, payload);
    }
    /**
     * @description Encodes the value as a Uint8Array as per the SCALE specifications
     * @param isBare true when the value has none of the type-specific prefixes (internal)
     */
    toU8a(isBare) {
        return this.isSigned ? super.toU8a(isBare) : constants_1.EMPTY_U8A;
    }
}
exports.default = PlugExtrinsicSignatureV1;
