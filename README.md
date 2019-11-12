# plug-sdk-types
Type definitions for the Plug blockchain runtime.  
These should be injected into an API session from `@polkadot/api` session in order to connect and transact with
a Plug chain.

Add as dependency
```json
// package.json
{ 
  "dependencies": {
    "@plugnet/plug-sdk-types": "https://github.com/plugblockchain/plug-sdk-types.git"
  }
}
```

```ts
import {ApiPromise, WsProvider} from '@polkadot/api';
import PlugRuntimeTypes from '@plugnet/plug-sdk-types';

async function main() {
  const provider = new WsProvider('ws//example.com:9944');
  const api = await ApiPromise.create({ 
    provider,
    types: PlugRuntimeTypes,
  });

  //...

}
```
