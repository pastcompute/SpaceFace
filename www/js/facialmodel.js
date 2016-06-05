'use strict';
define(['underscore'], function(_) {

  var sad = twemoji.parse(twemoji.convert.fromCodePoint('1f633')); // :flushed:

  Monocular.initialize({
    clientId: '9d70cd3ff37ad71708dcf21934bad5d4',
    clientSecret: 'e070ba39b3645fb2b769c6635f3cd108fdb0610a',
  });

  function detect(image) {
    this.infoCallout.hide();
    this.errorCallout.hide();
    var self = this;
    console.log("[DETECT] " + image);
    Monocular.faceDetection(image).then((faces) => {
      self.infoCallout.text('Detected ' + faces.length + ' face(s)');
      self.infoCallout.show();
    }).catch((error) => {
      console.log(error);
      self.errorCallout.html('Unable to process the image ' + sad);
      self.errorCallout.show();
    });
  }
    
  var FacialModel = function(infoCallout, errorCallout) {
    this.infoCallout = infoCallout;
    this.errorCallout = errorCallout;
  }

  FacialModel.prototype = {
    constructor : FacialModel,
    detect : function(image) { detect.call(this, image); }
  };

  return FacialModel;
});
