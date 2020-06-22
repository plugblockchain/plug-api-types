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

import Option from '@polkadot/types/codec/Option';
import { InterfaceTypes } from '@polkadot/types/types/registry';
import Doughnut from './Doughnut';

// Merge the [[InterfaceRegistry]] definition from `@polkadot/types/interfaceRegistry` with plug types
declare module '@polkadot/types/types/registry' {
    interface InterfaceTypes {
        // Add types that only Plug knows about.
        // TS will merge them into the polkadot provided [[InterfaceRegistry]]
        Doughnut: Doughnut;
        'Option<Doughnut>': Option<Doughnut>;
    }
}

export type PlugInterfaceTypes = keyof InterfaceTypes;
