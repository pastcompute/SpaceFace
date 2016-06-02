'use strict';
require.config({
  paths: {
    jquery: '../js/vendor/jquery.min',
    'jquery.dynatable': '../js/vendor/jquery.dynatable',
    foundation: '../js/vendor/foundation.min',
    'foundation.abide': '../js/vendor/foundation.abide',
    'foundation.orbit': '../js/vendor/foundation.orbit',
    'foundation.orbit': '../js/vendor/foundation.util.touch',
    'foundation.keyboard': '../js/vendor/foundation.util.keyboard',
    'foundation.motion': '../js/vendor/foundation.util.motion',
    'foundation.util.timerAndImageLoader': '../js/vendor/foundation.util.timerAndImageLoader',
    underscore: '../js/vendor/underscore-min',
    datejs: '../js/vendor/date.min'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    'jquery.dynatable': ['jquery'],
    foundation: {
      deps: ['jquery'],
      exports: 'Foundation'
    },
    'foundation.abide': ['foundation'],
    'foundation.orbit': ['foundation'],
    underscore: {
      deps: ['jquery'],
      exports: '_'
    }
  },
  deps: [
    'app'
  ]
});
requirejs.onError = function (err) {
  console.log(JSON.stringify(err));
  throw err;
};
require(['app', 'datejs'], function(app) {
  // Shim for Cordova, when we get around to it
  var onDeviceReady = function () {
    console.log("onDeviceReady");
    app.exec();
  };
  document.addEventListener("deviceready", onDeviceReady, false);
  if (typeof cordova === 'undefined') {
    $( document ).ready(function() {
      console.log("document ready");
      app.exec();
    });
  }
});