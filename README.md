# plug-api-types
[![CircleCI](https://circleci.com/gh/plugblockchain/plug-api-types.svg?style=svg)](https://circleci.com/gh/plugblockchain/plug-api-types)

Type definitions for the Plug blockchain runtime.  
These should be injected into an API session from `@polkadot/api` in order to connect and transact with
a Plug chain.

Add as dependency
```json
// package.json
{ 
  "dependencies": {
    "@plugnet/plug-api-types": "git+https://github.com/plugblockchain/plug-api-types.git#1.0.0-rc2"
  }
}
```

```ts
import {ApiPromise, WsProvider} from '@polkadot/api';
import PlugRuntimeTypes from '@plugnet/plug-api-types';

async function main() {
  const provider = new WsProvider('ws://example.com:9944');
  const api = await ApiPromise.create({ 
    provider,
    types: PlugRuntimeTypes,
  });

  //...

}
```

## Build
To build the package for distribution run:
```
tsc
```

