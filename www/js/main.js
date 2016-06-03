'use strict';
require.config({
  paths: {
    jquery: '../js/vendor/jquery.min',
    foundation: '../js/vendor/foundation.min',
    slick: '../js/vendor/slick.min',
    underscore: '../js/vendor/underscore-min',
    datejs: '../js/vendor/date.min'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    slick: {
      deps: ['jquery']
    },
    foundation: {
      deps: ['jquery']
    },
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