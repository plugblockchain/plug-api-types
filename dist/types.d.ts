import { u128 } from '@polkadot/types/primitive';
import { CompactEncodable } from '@polkadot/types/codec/Compact';
export interface Balance extends u128, CompactEncodable {
    toNumber(): number;
}
