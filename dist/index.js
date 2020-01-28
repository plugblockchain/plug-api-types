"use strict";
// Copyright 2019-2020 Plug New Zealand Limited
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
Object.defineProperty(exports, "__esModule", { value: true });
const Doughnut_1 = require("./Doughnut");
const Extrinsic_1 = require("./Extrinsic");
// Type definitions required by the Plug runtime
const PlugRuntimeTypes = {
    // The doughnut ceritificate type
    Doughnut: Doughnut_1.default,
    // The Plug extrinsic type
    ExtrinsicV4: Extrinsic_1.default,
    // The staking reward currency type
    RewardBalance: 'Balance',
};
exports.default = PlugRuntimeTypes;
