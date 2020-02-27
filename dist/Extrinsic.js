"use strict";
// Copyright 2017-2019 @polkadot/types authors & contributors & 2019-2020 Plug New Zealand Ltd.
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@polkadot/types");
const util_1 = require("@polkadot/util");
// import { ClassOf, createType } from '@polkadot/types/codec/create';
const Struct_1 = require("@polkadot/types/codec/Struct");
const ExtrinsicSignature_1 = require("./ExtrinsicSignature");
exports.TRANSACTION_VERSION = 4;
/**
 * @name PlugExtrinsicV1
 * @description
 * The first generation of Plug extrinsics (based on the fourth generation of compact extrinsics)
 */
class PlugExtrinsicV1 extends Struct_1.default {
    constructor(registry, value, { isSigned } = {}) {
        super(registry, {
            signature: ExtrinsicSignature_1.default,
            method: 'Call'
        }, PlugExtrinsicV1.decodeExtrinsic(registry, value, isSigned));
    }
    static decodeExtrinsic(registry, value, isSigned = false) {
        if (!value) {
            return {};
        }
        else if (value instanceof PlugExtrinsicV1) {
            return value;
        }
        else if (value instanceof types_1.ClassOf(registry, 'Call')) {
            return { method: value };
        }
        else if (util_1.isU8a(value)) {
            // here we decode manually since we need to pull through the version information
            const signature = new ExtrinsicSignature_1.default(registry, value, { isSigned });
            const method = types_1.createType(registry, 'Call', value.subarray(signature.encodedLength));
            return {
                method,
                signature,
            };
        }
        return value;
    }
    /**
     * @description The length of the value when encoded as a Uint8Array
     */
    get encodedLength() {
        return this.toU8a().length;
    }
    /**
     * @description The [[Call]] this extrinsic wraps
     */
    get method() {
        return this.get('method');
    }
    /**
     * @description The [[PlugExtrinsicSignatureV1]]
     */
    get signature() {
        return this.get('signature');
    }
    /**
     * @description The version for the signature
     */
    get version() {
        return exports.TRANSACTION_VERSION;
    }
    /**
     * @description Add an [[PlugExtrinsicSignatureV1]] to the extrinsic (already generated)
     */
    addSignature(signer, signature, payload) {
        this.signature.addSignature(signer, signature, payload);
        return this;
    }
    /**
     * @description Sign the extrinsic with a specific keypair
     */
    sign(account, options) {
        this.signature.sign(this.method, account, options);
        return this;
    }
    /**
     * @describe Adds a fake signature to the extrinsic
     */
    signFake(signer, options) {
        this.signature.signFake(this.method, signer, options);
        return this;
    }
}
exports.default = PlugExtrinsicV1;
