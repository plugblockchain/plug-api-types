"use strict";
// Copyright 2017-2019 @polkadot/types authors & contributors & 2019-2020 Plug New Zealand Ltd.
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
const Struct_1 = require("@polkadot/types/codec/Struct");
const util_1 = require("@polkadot/types/extrinsic/util");
// The base fields in a Plug V1 extrinsic payload
exports.BasePayloadV1 = {
    method: 'Bytes',
    doughnut: 'Option<Doughnut>',
    era: 'ExtrinsicEra',
    nonce: 'Compact<Index>',
    tip: 'Compact<Balance>',
};
// These fields are signed here as part of the extrinsic signature but are NOT encoded in
// the final extrinsic payload itself.
// The Plug node will populate these fields from on-chain data and check the signature compares
// hence they are implicit
exports.SignedExtraV1 = {
    // prml_doughnut::Option<PlugDoughnut<Doughnut, Runtime>>
    // system::CheckVersion<Runtime>
    specVersion: 'u32',
    // system::CheckGenesis<Runtime>
    genesisHash: 'Hash',
    // system::CheckEra<Runtime>
    blockHash: 'Hash',
};
// The full definition for the extrinsic payload.
// It will be encoded (+ hashed if len > 256) and then signed to make the extrinsic signature
exports.PayloadV1 = {
    ...exports.BasePayloadV1,
    ...exports.SignedExtraV1
};
/**
 * @name PlugExtrinsicPayloadV1
 * @description
 * A signing payload for an [[Extrinsic]]. For the final encoding, it is variable length based
 * on the contents included
 */
class PlugExtrinsicPayloadV1 extends Struct_1.default {
    constructor(registry, value) {
        super(registry, exports.PayloadV1, value);
    }
    /**
     * @description The block [[Hash]] the signature applies to (mortal/immortal)
     */
    get blockHash() {
        return this.get('blockHash');
    }
    /**
     * @description The [[ExtrinsicEra]]
     */
    get era() {
        return this.get('era');
    }
    /**
     * @description The genesis [[Hash]] the signature applies to (mortal/immortal)
     */
    get genesisHash() {
        return this.get('genesisHash');
    }
    /**
     * @description The [[Bytes]] contained in the payload
     */
    get method() {
        return this.get('method');
    }
    /**
     * @description The nonce
     */
    get nonce() {
        return this.get('nonce');
    }
    /**
     * @description The specVersion for this signature
     */
    get specVersion() {
        return this.get('specVersion');
    }
    /**
     * @description The tip [[Balance]]
     */
    get tip() {
        return this.get('tip');
    }
    /**
     * @description The [[Doughnut]]
     */
    get doughnut() {
        return this.get('doughnut');
    }
    /**
    * @description Sign the payload with the keypair
    */
    sign(signerPair) {
        // NOTE The `toU8a({ method: true })` argument is absolutely critical - we don't want the method (Bytes)
        // to have the length prefix included. This means that the data-as-signed is un-decodable,
        // but is also doesn't need the extra information, only the pure data (and is not decoded)
        // ... The same applies to V1..V3, if we have a V5, carry move this comment to latest
        return util_1.sign(signerPair, this.toU8a({ method: true }), { withType: true });
    }
}
exports.default = PlugExtrinsicPayloadV1;
