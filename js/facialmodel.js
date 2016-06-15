'use strict';
define(['underscore'], function(_) {

  Monocular.initialize({
    clientId: '9d70cd3ff37ad71708dcf21934bad5d4'
  });

  function detect(image) {
    var self = this;
    console.log("[DETECT] " + image);
    Monocular.faceDetection(image)
      .then((faces) => { this.doneHandler(faces); })
      .catch((error) => { this.errorHandler(error); });
  }
    
  var FacialModel = function(doneHandler, errorHandler) {
    this.doneHandler = doneHandler;
    this.errorHandler = errorHandler;
  }

  FacialModel.prototype = {
    constructor : FacialModel,
    detect : function(image) { detect.call(this, image); }
  };

  return FacialModel;
});
