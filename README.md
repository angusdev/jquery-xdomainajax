jquery-xdomainajax
==================

Forked from [padolsey / jquery.fn / cross-domain-ajax](https://github.com/padolsey/jquery.fn/tree/master/cross-domain-ajax/) to support latest version of jQuery.

Also add support for [Simple PHP Proxy](http://benalman.com/projects/php-simple-proxy/) for certain cases that YQL can't meed your need.

Usage
-----
Just include jquery.xdomainajax.ellab-{ver}.js after jQuery:
```html
<script src="jquery-1.10.2.min.js"></script>
<script src="jquery.xdomainajax.ellab-1.0.js"></script>
<script>
$(document).ready(function() {
  $.ajax("http://www.google.com/").done(function(responseText) {
    // do something here
  });
});
</script>
```
If you don't want to use YQL:
```html
<script src="jquery-1.10.2.min.js"></script>
<script src="jquery.xdomainajax.ellab-1.0.js"></script>
<script>
  xdomainajax_use_yql = false;
  xdomainajax_proxy_url = 'pxy/pxy.php';
  // use a desktop browser useragent to avoid website display mobile site on mobile devices
  xdomainajax_proxy_useragent = 'Mozilla/5.0 (Windows) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1685.0 Safari/537.36';
</script>
<script>
$(document).ready(function() {
  $.ajax("http://www.google.com/").done(function(responseText) {
    // do something here
  });
});
</script>
```
> **xdomainajax_proxy_url** is the url of [Simple PHP Proxy](http://benalman.com/projects/php-simple-proxy/).
Note the proxy url should be in the same server (or use Access-Control-Allow-Headers), otherwise you are making
another cross domain AJAX request.

> Simple PHP Proxy will pass your browser's user agent to the target website, set **xdomainajax_proxy_useragent** 
if you want to use a specified user agent (e.g. you want a desktop site in mobile device, or vice-versa).

The default value is:
```javascript
xdomainajax_use_yql = true;
xdomainajax_proxy_url = '/pxy/pxy.php'; // ignore if xdomainajax_use_yql == true
xdomainajax_proxy_useragent = null; // ignore if xdomainajax_use_yql == true
```
