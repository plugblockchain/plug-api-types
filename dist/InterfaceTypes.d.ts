import Option from '@polkadot/types/codec/Option';
import { InterfaceTypes } from '@polkadot/types/types/registry';
import Doughnut from './Doughnut';
declare module '@polkadot/types/types/registry' {
    interface InterfaceTypes {
        Doughnut: Doughnut;
        'Option<Doughnut>': Option<Doughnut>;
    }
}
export declare type PlugInterfaceTypes = keyof InterfaceTypes;
