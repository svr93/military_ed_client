'use strict';

import { ng } from 'js/module/wrapper/angular.js';
import { cs } from 'js/module/wrapper/cesium.js';

/**
 * Cesium part entry point.
 */
export function initialize() {

    console.log(
        `ng version: ${ ng.version.full }, cs version: ${ cs.VERSION }`
    );
    var viewer = new cs.Viewer('cesiumContainer', { animation: false });
    viewer.resolutionScale = 0.5;
}
