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

// Copyright 2017-2018 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import PlugRuntimeTypes from '@plugnet/plug-api-types';
import {ApiPromise, Keyring, WsProvider} from '@polkadot/api';
import { TypeRegistry } from '@polkadot/types';
import {cryptoWaitReady} from '@polkadot/util-crypto';

describe('e2e transactions', () => {
  let api: ApiPromise;
  let alice, bob;
  const registry = new TypeRegistry();

  beforeAll(async () => {
    await cryptoWaitReady();

    const keyring = new Keyring({ type: 'sr25519' });
    alice = keyring.addFromUri('//Alice');
    bob = keyring.addFromUri('//Bob');

    api = await ApiPromise.create({
      provider: new WsProvider('ws://localhost:9944'),
      types: {
        ...PlugRuntimeTypes
      },
      registry
    });

  });

  afterAll(async () => {
    api.disconnect();
  });

  describe('Send extrinsics', () => {

    it('does a balance transfer with keypair via send', async done => {
      const nonce = await api.query.system.accountNonce(alice.address);
      const tx = api.tx.balances.transfer(bob.address, 123).sign(alice, {nonce});
      await tx.send(async ({events, status}) => {
        // event[0] is a treasury deposit
        if (status.isFinalized) {
          expect(events[1].event.method).toEqual('Transfer');
          expect(events[1].event.section).toEqual('balances');
          done();
        }
      });
    });


    it('does a balance transfer with keypair via signAndSend', async done => {
      await api.tx.balances.transfer(bob.address, 123).signAndSend(alice, async ({events, status}) => {
          if (status.isFinalized) {
            // event[0] is a treasury deposit
            expect(events[1].event.method).toEqual('Transfer');
            expect(events[1].event.section).toEqual('balances');
            done();
          }
      });
    });

  });


});
