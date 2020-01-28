import Option from '@polkadot/types/codec/Option';
import { InterfaceRegistry } from '@polkadot/types/interfaceRegistry';
import Doughnut from './Doughnut';
declare module '@polkadot/types/interfaceRegistry' {
    interface InterfaceRegistry {
        Doughnut: Doughnut;
        'Option<Doughnut>': Option<Doughnut>;
    }
}
export declare type PlugInterfaceTypes = keyof InterfaceRegistry;
