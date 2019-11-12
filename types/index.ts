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

import PlugExtrinsicV1 from './Extrinsic';
import Doughnut from './Doughnut';
import Option from '@polkadot/types/codec/Option';

// Monkey patch [[Option]] to encode `None` as a `0` byte
// Remove when https://github.com/polkadot-js/api/issues/1542 is sorted upstream
Option.prototype.toU8a = function toU8a(isBare?: boolean): Uint8Array {
  // Hack to always encode `0` for None (ignores `isBare`)
  if (this.isNone) return new Uint8Array([0]);
  if (this.isSome && isBare) {
    return this.unwrap().toU8a(isBare)
  } else {
    let buf = new Uint8Array([1]);
    buf.set(this.unwrap().toU8a(isBare), 1);
    return buf;
  }
}

// Type definitions required by the Plug runtime
const PlugRuntimeTypes = {
  // The doughnut ceritificate type
  'Doughnut': Doughnut,
  // The Plug extrinsic type
  'ExtrinsicV3': PlugExtrinsicV1,
  // The staking reward currency type
  'RewardBalance': 'Balance',
  // The patched [[Option]] type
  'Option': Option
};

export default PlugRuntimeTypes;