// Copyright 2019 Plug New Zealand Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Compact from '@polkadot/types/codec/Compact';
import U8a from '@polkadot/types/codec/U8a';
import Bytes from '@polkadot/types/primitive/Bytes';
import { AnyU8a, Codec } from '@polkadot/types/types';

/**
 * An encoded, signed v0 Doughnut certificate
 **/
export default class Doughnut extends U8a implements Codec {
  public get encodedLength(): number {
    return this.toU8a().length;
  }

  constructor(value?: AnyU8a) {
    // This function is used as both a constructor and a decoder
    // Doughnut has its own codec but it must be length prefixed to support the SCALE codec used by the extrinsic

    // Failure to decode indicates a call as a constructor
    const decoded = new Bytes(value);
    if (decoded.length > 0) {
      super(decoded);
    } else {
      super(value);
    }
  }

  toU8a(isBare?: boolean): Uint8Array {
    // Encode the doughnut with length prefix to support SCALE codec
    return isBare ? (this as Uint8Array) : Compact.addLengthPrefix(this);
  }
}
