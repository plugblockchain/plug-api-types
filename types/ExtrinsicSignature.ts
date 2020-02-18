// Copyright 2017-2019 @polkadot/types authors & contributors & 2019-2020 Plug New Zealand Ltd.
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Compact from '@polkadot/types/codec/Compact';
import { createType } from '@polkadot/types/codec/create';
import Option from '@polkadot/types/codec/Option';
import Struct from '@polkadot/types/codec/Struct';
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
} from '@polkadot/types/interfaces';
import { EMPTY_U8A, IMMORTAL_ERA } from '@polkadot/types/primitive/Extrinsic/constants';
import { ExtrinsicSignatureOptions } from '@polkadot/types/primitive/Extrinsic/types';

import {
  AnyNumber,
  AnyU8a,
  IExtrinsicEra,
  IExtrinsicSignature,
  IKeyringPair,
  Registry,
  RuntimeVersionInterface,
} from '@polkadot/types/types';

import Doughnut from './Doughnut';
import PlugExtrinsicPayloadV1, {PlugExtrinsicPayloadValue} from './ExtrinsicPayload';
import { u8aConcat } from '@polkadot/util';

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
  constructor (registry: Registry, value: PlugExtrinsicSignatureV1 | Uint8Array | undefined, { isSigned }: ExtrinsicSignatureOptions = {}) {
    super(registry, {
      signer: 'Address',
      signature: 'MultiSignature',
      doughnut: 'Option<Doughnut>',
      era: 'ExtrinsicEra',
      nonce: 'Compact<Index>',
      tip: 'Compact<Balance>'
    }, PlugExtrinsicSignatureV1.decodeExtrinsicSignature(value, isSigned));
  }

  public static decodeExtrinsicSignature (value: PlugExtrinsicSignatureV1 | Uint8Array | undefined, isSigned = false): PlugExtrinsicSignatureV1 | Uint8Array {
    if (!value) {
      return EMPTY_U8A;
    } else if (value instanceof PlugExtrinsicSignatureV1) {
      return value;
    }

    return isSigned ? value : EMPTY_U8A;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  public get encodedLength(): number {
    return this.isSigned ? super.encodedLength : 0;
  }

  /**
   * @description `true` if the signature is valid
   */
  public get isSigned(): boolean {
    return !this.signature.isEmpty;
  }

  /**
   * @description The [[ExtrinsicEra]] (mortal or immortal) this signature applies to
   */
  public get era(): ExtrinsicEra {
    return this.get('era') as ExtrinsicEra;
  }

  /**
   * @description The [[Index]] for the signature
   */
  public get nonce(): Compact<Index> {
    return this.get('nonce') as Compact<Index>;
  }

  /**
   * @description The actual [[EcdsaSignature]], [[Ed25519Signature]] or [[Sr25519Signature]]
   */
  public get signature (): EcdsaSignature | Ed25519Signature | Sr25519Signature {
    return this.multiSignature.value as Sr25519Signature;
  }

  /**
   * @description The raw [[MultiSignature]]
   */
  public get multiSignature (): MultiSignature {
    return this.get('signature') as MultiSignature;
  }

  /**
   * @description The [[Address]] that signed
   */
  public get signer(): Address {
    return this.get('signer') as Address;
  }

  /**
   * @description The [[Doughnut]]
   */
  public get doughnut (): Option<Doughnut> {
    return this.get('doughnut') as Option<Doughnut>;
  }

  /**
   * @description The [[Balance]] tip
   */
  public get tip(): Compact<Balance> {
    return this.get('tip') as Compact<Balance>;
  }

  protected injectSignature (signer: Address, signature: MultiSignature, { era, doughnut, nonce, tip }: PlugExtrinsicPayloadV1): IExtrinsicSignature {
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
  public addSignature (signer: Address | Uint8Array | string, signature: Uint8Array | string, payload: PlugExtrinsicPayloadValue | Uint8Array | string): IExtrinsicSignature {
    return this.injectSignature(
      createType(this.registry, 'Address', signer),
      createType(this.registry, 'MultiSignature', signature),
      new PlugExtrinsicPayloadV1(this.registry, payload)
    );
  }

  /**
   * @description Creates a payload from the supplied options
   */
  public createPayload (method: Call, { blockHash, doughnut, era, genesisHash, nonce, runtimeVersion: { specVersion }, tip }: SignatureOptions): PlugExtrinsicPayloadV1 {
    return new PlugExtrinsicPayloadV1(this.registry, {
      blockHash,
      doughnut: doughnut || createType(this.registry, 'Option<Doughnut>'),
      era: era || IMMORTAL_ERA,
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
  public sign (method: Call, account: IKeyringPair, options: SignatureOptions): IExtrinsicSignature {
    const signer = createType(this.registry, 'Address', account.publicKey);
    const payload = this.createPayload(method, options);
    const signature = createType(this.registry, 'MultiSignature', payload.sign(account));

    return this.injectSignature(signer, signature, payload);
  }

  /**
   * @description Generate a payload and applies a fake signature
   */
  public signFake (method: Call, address: Address | Uint8Array | string, options: SignatureOptions): IExtrinsicSignature {
    const signer = createType(this.registry, 'Address', address);
    const payload = this.createPayload(method, options);
    const signature = createType(this.registry, 'MultiSignature', u8aConcat(new Uint8Array([1]), new Uint8Array(64).fill(0x42)));

    return this.injectSignature(signer, signature, payload);
  }

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  public toU8a(isBare?: boolean): Uint8Array {
    return this.isSigned ? super.toU8a(isBare) : EMPTY_U8A;
  }
}
