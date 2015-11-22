'use strict';

import { ng } from 'js/module/wrapper/angular.js';

/**
 * Cesium part entry point.
 */
export function initialize() {

    console.log(`initialization successful; ng version: ${ ng.version.full }`);
}
