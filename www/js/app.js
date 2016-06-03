'use strict';
define([
  'jquery',
  'underscore',
  'datejs',
  'foundation',
], function($,_) {

  var APOD_PREFIX = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
  var MAX_ITEMS = 4;
  var API_COUNT = 0;
  var carouselInit = false; // Work around stuff that just doesnt work as advertised
  var loadedItems = 0;

  function randomColour() {
    var colour = "#";
    for (var i=0; i < 6; i++) {
      colour = colour + Math.floor(Math.random()*15).toString(16);
    }
    return colour;
  }

  // If there are less than 7 images, add to the image list then fetch one more
  // Not worh having a separate model for now.
  // Obj is a JSON with the following items:
  // date, explanation, media_type E (video, image), title, url or hdurl, copyright, service_version
  function populateNewImage(obj, day)
  {
    var items = $('#carousel ul#image-list li').length;
    console.log(obj, items);
    if (!_.isNull(obj)) {
      if (obj.media_type === "image") {
        var inner = "<div style='background-color:#ff00ff;'>" +
                    "<h3>Test" + obj.title + "</h3>" + obj.date +
                    "<img src='" + obj.url + "'/></div>";
        console.log(inner);
        var elem = $("<li>" + inner + "</li>");
        $('#carousel ul#image-list').append(elem);
        if (items === 0) {
          elem.addClass("is-active");
        }
        loadedItems ++;
      }
    }
    var fin = false;
    if (loadedItems < MAX_ITEMS) {
      day = day.addDays(-1);
      setTimeout(function(){
        var result = {
          date:day.toString("yyyy-MM-dd"),
          url:"http://example.com/1/2/" + Math.floor(Math.random() * 9),
          title:"Blahahahaa" + Math.floor(Math.random() * 1000000),
          media_type: "image"
        };
        populateNewImage(result, day);
      }, 500);
    } else
    if (loadedItems < MAX_ITEMS && API_COUNT < 5) {
      var uri = APOD_PREFIX + "&date=" + day.toString("yyyy-MM-dd");
      console.log(uri, API_COUNT);
      API_COUNT = API_COUNT + 1;
      $.getJSON(uri, function(result){
        console.log(JSON.stringify(result));
        day = day.addDays(-1);
        populateNewImage(result, day);
      });
    } else {
      fin = true;
    }
    if (fin && !carouselInit) {
      console.log("Carousel init");
      carouselInit = true;
    }
  }

  // Try and load 7 days worth of APOD images, ignore video for now
  function populateImages() {
    $('#carousel ul#image-list li').remove();
    loadedItems = 0;
    var day = Date.today();
    // Note, date needs to be in USA (or UTC?) time or you get server error on today in Australia
    // Easiest workaround is just subtract one at the start
    populateNewImage(null, day.addDays(-1));
  }

  return {
    exec : function() {
      console.log("app.exec");
      $(".button").on("click", function(e) { e.preventDefault(); });
      $("#menu-about").on("click", function() { $("#about").show()});
      $(document).foundation();
      populateImages();
    }
  };
});