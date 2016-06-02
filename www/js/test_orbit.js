'use strict';
require.config({
  paths: {
    jquery: '../js/vendor/jquery.min',
    foundation: '../js/vendor/foundation.min',
    'foundation.orbit': '../js/vendor/foundation.orbit',
    'foundation.orbit': '../js/vendor/foundation.util.touch',
    'foundation.keyboard': '../js/vendor/foundation.util.keyboard',
    'foundation.motion': '../js/vendor/foundation.util.motion',
    'foundation.util.timerAndImageLoader': '../js/vendor/foundation.util.timerAndImageLoader',
    underscore: '../js/vendor/underscore-min'
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
    'foundation.orbit': ['foundation'],
    underscore: {
      deps: ['jquery'],
      exports: '_'
    }
  }
});
requirejs.onError = function (err) {
  console.log(JSON.stringify(err));
  throw err;
};
require([
  'jquery',
  'underscore',
  'foundation'], function($,_) {

  var orbitInit = false;
  var loadedItems = 0;
  var MAX_ITEMS = 2;
  
  function populateNewImage(obj, imageIndex)
  {
    console.log("populateNewImage()", obj, imageIndex);

    var items = $('#orbit ul#image-list li').length;
    if (!_.isNull(obj)) {
      loadedItems ++;
      var inner = "<div style='width:500px;height:300px;background-color:#ff00ff;'>" +
                  "<h3>Test" + obj.title + "</h3>" +
                  "<img src='" + obj.url + "'/></div>";
      var elem = $("<li class='orbit-slide'>" + inner + "</li>");
      $('#orbit ul#image-list').append(elem);
      if (items === 0) {
        elem.addClass("is-active");
      }
    } else {
      // First call.
      $('#orbit ul#image-list li').remove();
      loadedItems = 0;
    }

    var done = false;
    if (loadedItems < MAX_ITEMS) {
      // Simulate a bunch of sequential JSON queries
      setTimeout(function() {
        var result = {
          url:"http://example.com/1/2/" + Math.floor(Math.random() * 9),
          title:imageIndex + "Blahahahaa" + Math.floor(Math.random() * 1000000),
          media_type: "image"
        };
        populateNewImage(result, imageIndex+1);
      }, 500);
    } else {
      done = true;
    }
    // Separate out because in real code we may need to short circuit loading of MAX_ITEMS
    if (done && !orbitInit) {
      console.log("orbit init");
     var elem = new Foundation.Orbit($('#orbit'), 
      {
        'data-bullets':false,
      });
      elem.reflow();
     orbitInit = true;
    }
    console.log("populateNewImage(DONE)", obj, imageIndex);
  }

  function populate() {
    $('#orbit ul#image-list li').remove();
    populateNewImage(null, 1);
  }

  $( document ).ready(function() {
    console.log("document ready");
    populate();
  });
});