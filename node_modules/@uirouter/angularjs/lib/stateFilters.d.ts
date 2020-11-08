/** @publicapi @module ng1 */ /** */
import { StateService } from '@uirouter/core';
declare function $IsStateFilter($state: StateService): any;
declare namespace $IsStateFilter {
    var $inject: string[];
}
declare function $IncludedByStateFilter($state: StateService): any;
declare namespace $IncludedByStateFilter {
    var $inject: string[];
}
export { $IsStateFilter, $IncludedByStateFilter };
