// Copyright 2017-2019 @polkadot/types authors & contributors & 2019-2020 Plug New Zealand Ltd.
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Compact from '@polkadot/types/codec/Compact';
import Option from '@polkadot/types/codec/Option';
import Struct from '@polkadot/types/codec/Struct';
import { Balance, ExtrinsicEra, Hash, Index } from '@polkadot/types/interfaces';
import Bytes from '@polkadot/types/primitive/Bytes';
import { sign } from '@polkadot/types/primitive/Extrinsic/util';
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

// The base fields in a Plug V1 extrinsic payload
export const BasePayloadV1: Record<string, PlugInterfaceTypes> = {
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
export const SignedExtraV1: Record<string, PlugInterfaceTypes> = {
  // prml_doughnut::Option<PlugDoughnut<Doughnut, Runtime>>
  // system::CheckVersion<Runtime>
  specVersion: 'u32',
  // system::CheckGenesis<Runtime>
  genesisHash: 'Hash',
  // system::CheckEra<Runtime>
  blockHash: 'Hash',
  // system::CheckNonce<Runtime>
  // system::CheckWeight<Runtime>
  // transaction_payment::ChargeTransactionPayment<Runtime>,
  // contracts::CheckBlockGasLimit<Runtime>,
};

// The full definition for the extrinsic payload.
// It will be encoded (+ hashed if len > 256) and then signed to make the extrinsic signature
export const PayloadV1: Record<string, PlugInterfaceTypes> = {
  ...BasePayloadV1,
  ...SignedExtraV1
};

/**
 * @name PlugExtrinsicPayloadV1
 * @description
 * A signing payload for an [[Extrinsic]]. For the final encoding, it is variable length based
 * on the contents included
 */
export default class PlugExtrinsicPayloadV1 extends Struct {
  public constructor (registry: Registry, value?: PlugExtrinsicPayloadValue | Uint8Array | string) {
    super(registry, PayloadV1, value);
  }

  /**
   * @description The block [[Hash]] the signature applies to (mortal/immortal)
   */
  public get blockHash(): Hash {
    return this.get('blockHash') as Hash;
  }

  /**
   * @description The [[ExtrinsicEra]]
   */
  public get era(): ExtrinsicEra {
    return this.get('era') as ExtrinsicEra;
  }

  /**
   * @description The genesis [[Hash]] the signature applies to (mortal/immortal)
   */
  public get genesisHash(): Hash {
    return this.get('genesisHash') as Hash;
  }

  /**
   * @description The [[Bytes]] contained in the payload
   */
  public get method(): Bytes {
    return this.get('method') as Bytes;
  }

  /**
   * @description The nonce
   */
  public get nonce(): Compact<Index> {
    return this.get('nonce') as Compact<Index>;
  }

  /**
   * @description The specVersion for this signature
   */
  public get specVersion(): u32 {
    return this.get('specVersion') as u32;
  }

  /**
   * @description The tip [[Balance]]
   */
  public get tip(): Compact<Balance> {
    return this.get('tip') as Compact<Balance>;
  }

  /**
   * @description The [[Doughnut]]
   */
  public get doughnut(): Option<Doughnut> {
    return this.get('doughnut') as Option<Doughnut>;
  }

  /**
  * @description Sign the payload with the keypair
  */
  public sign (signerPair: IKeyringPair): Uint8Array {
    // NOTE The `toU8a({ method: true })` argument is absolutely critical - we don't want the method (Bytes)
    // to have the length prefix included. This means that the data-as-signed is un-decodable,
    // but is also doesn't need the extra information, only the pure data (and is not decoded)
    // ... The same applies to V1..V3, if we have a V5, carry move this comment to latest
    return sign(signerPair, this.toU8a({ method: true }), { withType: true });
  }
}
