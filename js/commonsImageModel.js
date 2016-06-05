/*
 * Copyright (c) 2016, Andrew McDonnell
 * All rights reserved.
 *
 * License: https://opensource.org/licenses/BSD-3-Clause , file: [/LICENSE]
 */
'use strict';
define([
  'jquery',
  'underscore'
], function($,_) {

  var THUMB_SIZE = 400;
  var RESULT_LIMIT = 20;
  var URL_PREFIX = "https://commons.wikimedia.org/w/api.php?";
  // action=query&generator=search&gsrnamespace=6&gsrsearch=astronomy%20people&gsrlimit=20&gsroffset=20&prop=imageinfo&iiprop=url&&iiurlwidth=400

  function clearImages() {
    this.images = {};
  }
  
  // Helper, takes mediawiki query inner API call result and unbundles,
  // adding to sum total of items we know about
  function parseResults(query) {
    var self = this;
    _.each(query, function(item) {
      var image = {url: item.imageinfo[0].url, thumb: item.imageinfo[0].thumburl, source: item.imageinfo[0].descriptionshorturl, title: item.title};
      self.images[item.pageid] = image;
    });
  }
  
  // Helper function to do the work of querying the API, return a promise.
  function fetch() {
    var args = {
      action: "query",
      generator: "search",
      gsrnamespace: 6,  // This seems to mean, search for images only, although I'm having trouble tracking down the doco. Also it turns up videos & OGGs
      gsrsearch: this.searchKey,
      gsrlimit: RESULT_LIMIT,
      gsroffset: (Math.random() * 500).toFixed(),
      prop: "imageinfo",
      iiprop: "url|mediatype",
      iilimit: 1,
      iiurlwidth: THUMB_SIZE,
      format: "json"
    };
    var url = URL_PREFIX + $.param(args);
    console.log(url);
    var self = this;
    var promise = new Promise(function(resolve, reject) {
      $.ajax({
            url: url,
            dataType: "jsonp" // needed to avoid CORS errors
        })
        .fail(function(jqXhr, txt, err) { reject(txt); }) // text=="error" occurs on CORS violation
        .then(function(data) {
          // Data is a somewhat nested JSON blob with a keyed set of 'pages'
          // console.log(JSON.stringify(data.query.pages));
          parseResults.call(self, data.query.pages);
          resolve(self);
        })
        ;
    });
    return promise;
  }

  /**
   * Constructor - set the key for subsequent search results.
   * @param {searchKey} Search string passed into MediaWiki API query
   *        to be run against commons.wikimedia.org
   *        The usual rules about quotes,etc. apply.
   */
  var CommonsImageModel = function(searchKey) {
    this.searchKey = searchKey;
    this.images = {};
  }

  /** CommonsImageModel class */
  CommonsImageModel.prototype = {
    constructor : CommonsImageModel,
    /**
     * Run predefined image search over commons.wikimedia.org and return image metadata
     * At present, the requested data includes full image and a 400px thumbnail
     * and we only get up to 20 results.
     * @return Promise resolved when query completes, argument == this
     *         with this.fetchResults set to the query result json,
     */
    fetch : function() { return fetch.call(this); },
    clear : function() { return clearImages.call(this); }
  };

  return CommonsImageModel;
});
