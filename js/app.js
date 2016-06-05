'use strict';
define([
  'jquery',
  'underscore',
  'datejs',
  'foundation',
  'galleria',
  'facialmodel',
  'commonsImageModel'
], function($,_,x,y,Galleria,FacialModel,CommonsImageModel) {

  var loadedItems = 0;

  _.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };

  function randomColour() {
    var colour = "#";
    for (var i=0; i < 6; i++) {
      colour = colour + Math.floor(Math.random()*15).toString(16);
    }
    return colour;
  }

  function populateImage(obj)
  {
    var items = $('#carousel img').length;
    var fragment = _.template("<a href='{{url}}'><img src='{{thumb}}' data-title='{{title}}' data-description='{{desc}}'></img></a>");
    var html = fragment({ url : obj.url, thumb: obj.thumb, title : obj.title, desc: obj.source });
    // console.log(html);
    var img = $(html);
    $('#carousel').append(img);
    loadedItems ++;
  }

  function populateImages(items) {
    $('#carousel img').remove();
    loadedItems = 0;
    _.each(items.slice(0,10), populateImage); // limit to reduce load time. TODO: randomise
    Galleria.run('#carousel');
  }

  function clearCache() {
    window.localStorage.clear();
    $("#main-feedback").html("<p><i>Reload browser to fetch data from APOD.</i></p>");
    $("#main-feedback").show();
  }
  
  function userError(msg) {
    if (_.isNull(msg)) { $("#main-error").hide(); return; }
    $("#main-error").html(msg);
    $("#main-error").show();    
  }

  return {
    exec : function() {
      console.log("app.exec");

      $(".button").on("click", function(e) { e.preventDefault(); });
      $("#menu-about").on("click", function() { $("#about").show()});
      $("#mainBtn-clear").on("click", function() { clearCache(); });

      var w = window.localStorage;
      for (var i = 0; i < w.length; i++) {
        console.log(w.key(i), w.getItem(w.key(i)));
      }

      var imageModel = new CommonsImageModel("astronomy people");
      var promise = imageModel.fetch();
      promise.catch(function(error) {
        console.warn("Unable to fetch commons query", error);
        userError("<i>Unable to complete image query of commons.wikimedia.org</i>");
      }).
      then(function(model) {
        // console.log(JSON.stringify(imageModel.images));
        populateImages(_.map(imageModel.images, function(v) { return v; }));
      });

      Galleria.loadTheme('galleria/themes/classic/galleria.classic.min.js');
      var ready = false;
      Galleria.ready(function(options) {
        this.bind('image', function(e) {
          if (!ready) {
            // setup on first image
            $('#main-status').hide();
            $("#mainBtn-detect").prop("disabled", false);
            $("#mainBtn-detect").on("click", function() {
              var img = $('#carousel').data('galleria').getActiveImage();
              console.log(img.src);
              $("#main-working").show();
              $("#main-feedback").hide();
              $("#main-error").hide();
              model.detect(img.src);
           });
          }
          ready = true;
          console.log('Now viewing ' + e.imageTarget.src);
        });
      });

      $(document).foundation();

      var sad = twemoji.parse(twemoji.convert.fromCodePoint('1f633')); // :flushed:

      var model = new FacialModel(
        function(faces) {
          $("#main-feedback").text('Detected ' + faces.length + ' face(s)');
          $("#main-feedback").show();
          $("#main-working").hide();
        },
        function(error) {
          console.warn(error);
          userError("Unable to process the image " + sad);
          $("#main-error").show();
          $("#main-working").hide();
        });
   }
  };
});