'use strict';
define([
  'jquery',
  'underscore',
  'foundation'
], function($,_) {

  return {
    exec : function() {
      console.log("app.exec");
      $(document).foundation();
      $(".button").on("click", function(e) { e.preventDefault(); });
      $("#menu-about").on("click", function() { $("#about").show()});
    }
  };
});