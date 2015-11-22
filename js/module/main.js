requirejs.config({

    paths: {

        angular: 'wrapper/angular'
    }
});

requirejs([
    'cesium-base'
], (CesiumBase) => {
    'use strict';

    CesiumBase.initialize();
});
