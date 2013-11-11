/*
 * This is a modified version of jquery.xdomainajax-0.11.js
 * The original version works on YQL and older version of JQuery (without the $.Deferred())
 *
 * This modified version add support (and only support) $.Deferred()
 * Also support "Simple PHP Proxy" (http://benalman.com/projects/php-simple-proxy/) as an alternative
 *
 * --------------------------------------------------------------------------------------
 *
 * jQuery.ajax mid - CROSS DOMAIN AJAX
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */

xdomainajax_use_yql = true;
xdomainajax_proxy_url = '/pxy/pxy.php';
xdomainajax_proxy_useragent = null;

jQuery.ajax = (function(_ajax){
  var protocol = location.protocol,
      hostname = location.hostname,
      exRegex = RegExp(protocol + '//' + hostname),
      yql = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
      yqlQuery = 'select * from html where url="{URL}" and xpath="*"',
      pxyQuery = '{URL}';

  function isExternal(url) {
    return !exRegex.test(url) && /:\/\//.test(url);
  }

  return function(url, o) {
    o = o || {};

    o.type = o.type || 'GET';

    if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
      if (xdomainajax_use_yql) {
        // Manipulate options so that JSONP-x request is made to YQL
        o.url = yql;
        o.dataType = 'json';
        o.data = {
          q: yqlQuery.replace('{URL}',
                              url + (o.data ?
                                    (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                                    : '')
                             ),
          format: 'xml'
        };
      }
      else {
        o.url = xdomainajax_proxy_url;
        o.dataType = 'json';
        o.data = {
          url: pxyQuery.replace('{URL}',
                                 url + (o.data ?
                                       (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                                       : '')
                                ),
          // fix the user agent to avoid some website display mobile site on mobile device
          user_agent: xdomainajax_proxy_useragent,
          full_headers: 'true'
        };
      }

      // Since it's a JSONP request
      // complete === success
      if (!o.success && o.complete) {
          o.success = o.complete;
          delete o.complete;
      }

      o.success = (function(_success){
        return function(data) {
          if (_success) {
            // Fake XHR callback.
            _success.call(this, {
                          responseText: (data.results[0] || '')
                          // YQL screws with <script>s
                          // Get rid of them
                          .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
            }, 'success');
          }
        };
      })(o.success);
    }

    var inarg = [o];
    if (arguments) {
      for (var i=0 ; i<arguments.length ; i++) {
        inarg.push(arguments[i]);
      }
    }

    var oriDeferred = _ajax.apply(this, inarg);
    var deferred = $.Deferred();
    oriDeferred.done(function(data) {
      var realdata = xdomainajax_use_yql?data.results[0]:data.contents;
      if (data.headers && data.headers['Content-Type'] && data.headers['Content-Type'].indexOf('xml') !== -1 &&
          typeof realdata === 'string' && realdata.indexOf('<?xml') === 0)
      {
        var xmlStr = realdata;
        if (typeof window.DOMParser != 'undefined') {
          realdata = (new window.DOMParser()).parseFromString(xmlStr, 'text/xml');
        }
        else if (typeof window.ActiveXObject != 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
          realdata = new window.ActiveXObject('Microsoft.XMLDOM');
          realdata.async = "false";
          realdata.loadXML(xmlStr);
        }
      }

      deferred.resolve(realdata);
    });

    return deferred;
  };

})(jQuery.ajax);
