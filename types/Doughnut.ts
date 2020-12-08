// Copyright 2019-2020 Plug New Zealand Ltd.
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

import {AnyU8a, Codec, Registry} from '@polkadot/types/types';
import Bytes from '@polkadot/types/primitive/Bytes';
import Compact from '@polkadot/types/codec/Compact';
import Raw from '@polkadot/types/codec/Raw';

/**
 * An encoded, signed v0 Doughnut certificate
 **/
export default class Doughnut extends Raw implements Codec {
    public get encodedLength (): number {
        return this.toU8a().length;
    }

    constructor(registry: Registry, value?: AnyU8a) {
        // This function is used as both a constructor and a decoder
        // Doughnut has its own codec but it must be length prefixed to support the SCALE codec used by the extrinsic

        // Failure to decode indicates a call as a constructor
        const decoded = new Bytes(registry, value);
        if (decoded.length > 0) {
            super(registry, decoded);
        } else {
            super(registry, value);
        }
    }
}
