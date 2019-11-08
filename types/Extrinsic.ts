// Copyright 2017-2019 @polkadot/types authors & contributors & Plug New Zealand Ltd.
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
This file is a copy of `@polkadot/types/primitive/Extrinsic/v4/Extrinsic`
It has had its payload and signature type changed to use Plug versions.
**/
import { Address, Call } from '@polkadot/types/interfaces/runtime';
import { ExtrinsicPayloadValue, IExtrinsicImpl, IKeyringPair, SignatureOptions } from '@polkadot/types/types';
import { ExtrinsicOptions } from '@polkadot/types/primitive/Extrinsic/types';

import { isU8a } from '@polkadot/util';

import { createType, ClassOf } from '@polkadot/types/codec/create';
import Struct from '@polkadot/types/codec/Struct';
import PlugExtrinsicSignatureV1 from './ExtrinsicSignature';

export const TRANSACTION_VERSION = 4;

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
  public constructor (value?: Uint8Array | ExtrinsicValueV4 | Call, { isSigned }: Partial<ExtrinsicOptions> = {}) {
    super({
      signature: PlugExtrinsicSignatureV1,
      method: 'Call'
    }, PlugExtrinsicV1.decodeExtrinsic(value, isSigned));
  }

  public static decodeExtrinsic (value?: Call | Uint8Array | ExtrinsicValueV4, isSigned = false): ExtrinsicValueV4 {
    if (!value) {
      return {};
    } else if (value instanceof PlugExtrinsicV1) {
      return value;
    } else if (value instanceof ClassOf('Call')) {
      return { method: value };
    } else if (isU8a(value)) {
      // here we decode manually since we need to pull through the version information
      const signature = new PlugExtrinsicSignatureV1(value, { isSigned });
      const method = createType('Call', value.subarray(signature.encodedLength));

      return {
        method,
        signature
      };
    }

    return value;
  }

  /**
   * @description The length of the value when encoded as a Uint8Array
   */
  public get encodedLength (): number {
    return this.toU8a().length;
  }

  /**
   * @description The [[Call]] this extrinsic wraps
   */
  public get method (): Call {
    return this.get('method') as Call;
  }

  /**
   * @description The [[PlugExtrinsicSignatureV1]]
   */
  public get signature (): PlugExtrinsicSignatureV1 {
    return this.get('signature') as PlugExtrinsicSignatureV1;
  }

  /**
   * @description The version for the signature
   */
  public get version (): number {
    return TRANSACTION_VERSION;
  }

  /**
   * @description Add an [[PlugExtrinsicSignatureV1]] to the extrinsic (already generated)
   */
  public addSignature (signer: Address | Uint8Array | string, signature: Uint8Array | string, payload: ExtrinsicPayloadValue | Uint8Array | string): PlugExtrinsicV1 {
    this.signature.addSignature(signer, signature, payload);

    return this;
  }

  /**
   * @description Sign the extrinsic with a specific keypair
   */
  public sign (account: IKeyringPair, options: SignatureOptions): PlugExtrinsicV1 {
    this.signature.sign(this.method, account, options);

    return this;
  }
}
