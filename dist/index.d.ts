import PlugExtrinsicV1 from './Extrinsic';
import Doughnut from './Doughnut';
import Option from '@polkadot/types/codec/Option';
declare const PlugRuntimeTypes: {
    'Doughnut': typeof Doughnut;
    'ExtrinsicV3': typeof PlugExtrinsicV1;
    'RewardBalance': string;
    'Option': typeof Option;
};
export default PlugRuntimeTypes;
