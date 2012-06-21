PinterestPlus
=============

An improved implementation of the Pinterest "Pin It" button with an HTML5-valid syntax option

## How to get this

On the command line, `cd` into the directory where you'd like to store the JavaScript code and run `git clone https://github.com/skibblenybbles/PinterestPlus.git` to get a copy of the latest master branch.

Alternatively, [download a zip file](https://github.com/skibblenybbles/PinterestPlus/zipball/master) of the latest source code and unzip it.

On your Web server, you'll need to host either `pinterest-plus.min.js` for the standard Pinterest `<a>` tag buttons or `pinterest-plus-html5.min.js` for HTML5-valid syntax support. Just load the JavaScript file that you'd like to use in a `<script>` tag right before the close of the `<body>` tag of your HTML document. If you'd like to load the script asynchronously, check out the example below.

## HTML example using <a href="http://pinterest.com/about/goodies/#button_for_websites" target="_blank">Pinterest's standard button syntax</a>

Here's an example using Pinterest's button syntax. Note that the path of the `pinterest-plus.min.js` file must correspond to wherever you host it on your server.

    <!DOCTYPE html>
    <html>
        <head>

            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />    
            <title>PinterestPlus</title>

        </head>
        </body>

            <div style="width:960px; margin: 100px auto;">

                <p>Here's a Pinterest button using the &lt;a&gt; tag syntax from 
                    <a target="_blank" href="http://pinterest.com/about/goodies/">Pinterest&rsquo;s Goodies page</a>:
                </p>

                <a href="http://pinterest.com/pin/create/button/?url=https%3A%2F%2Fgithub.com%2Fskibblenybbles%2FPinterestPlus&amp;media=http%3A%2F%2Fpassets-ec.pinterest.com%2Fimages%2FLogoRed.png&amp;description=An%20improved%20implementation%20of%20the%20Pinterest%20%22Pin%20It%22%20button%20with%20an%20HTML5-valid%20syntax%20option" class="pin-it-button" count-layout="horizontal">
                    <img border="0" src="http://assets.pinterest.com/images/PinExt.png" title="Pin It" />
                </a>

            </div>

            <!-- Note: this should use the location where you host this file -->
            <script src="../pinterest-plus.min.js"></script>

        </body>
    </html>

## HTML5 example using new syntax

Here's an example using a new HTML5-valid syntax. Note that the path of the `pinterest-plus-html5.min.js` file must correspond to wherever you host it on your server.

    <!DOCTYPE html>
    <html>
        <head>

            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />    
            <title>PinterestPlus</title>

        </head>
        </body>

            <div style="width:960px; margin: 100px auto;">

                <p>Here's a Pinterest button using the new HTML5 syntax that the pinterest-plus-html5.min.js script supports:
                </p>

                <div class="pin-it-button" data-url="https://github.com/skibblenybbles/PinterestPlus" data-image="http://passets-ec.pinterest.com/images/LogoRed.png" data-description="An improved implementation of the Pinterest &quot;Pin It&quot; button with an HTML5-valid syntax option"></div>

            </div>

            <!-- Note: this should use the location where you host this file -->
            <script src="../pinterest-plus-html5.min.js"></script>

        </body>
    </html>

This was designed to be similar to the Google Plus button syntax. You can see the full list of required and optional data-* attributes as well as how to use this script asynchronously below.

## HTML5 example with asynchronous script loading

Social sharing buttons are notorious for causing long page load times. These kind of problems are easily remedied by loading the required JavaScript files asynchronously. I recommend that you use a JavaScript library method for asynchronous script loading, such as jQuery's `$.getScript(...)` or Dojo's `require(...)`. But, for the sake of demonstration, I've used Google's async script loading code as a starting point to show how to do this with the PinterestPlust script. With a library, you won't need to use the `window.___pincfg.onready` callback hack as you'll see below. Rather, just use the library's callback methodology.

    <!DOCTYPE html>
    <html>
        <head>

            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />    
            <title>PinterestPlus</title>

            <script>
            // configure PinterestPlus to explicitly parse tags
            // and set up the callback to perform the parse
            window.___pincfg = {
                parsetags: "explicit",
                onready: function() {
                    PinterestPlus.pinit(document);
                }
            }
            </script>

        </head>
        </body>

            <div style="width:960px; margin: 100px auto;">

                <p>Here's a Pinterest button using the new HTML5 syntax that the pinterest-plus-html5.min.js script supports:
                </p>

                <div class="pin-it-button" data-url="https://github.com/skibblenybbles/PinterestPlus" data-image="http://passets-ec.pinterest.com/images/LogoRed.png" data-description="An improved implementation of the Pinterest &quot;Pin It&quot; button with an HTML5-valid syntax option"></div>

            </div>

            <script type="text/javascript">
            // load the PinterestPlus script asynchronously
            (function() {
                var s = document.createElement("script"),
                    f = document.getElementsByTagName("script")[0];
                s.async = true;
                s.src = "../pinterest-plus-html5.min.js"; // Note: this should be the location where you host this file
                f.parentNode.insertBefore(s, f);
            })();
            </script>

        </body>
    </html>

## Configuration and usage

Taking inspiration from <a href="https://developers.google.com/+/plugins/+1button/#async-load" target="_blank">the Google Plus button</a>, you can configure how `pinterest-plus-html5.min.js` behaves. In the `<head>` of your document, just set the `window.___pincfg` value to a JavaScript object with the following optional properties:

* `parsetags`: should be set to `"onload"` or `"explicit"` (the default is `"onload"`). If set to `"explicit"`, you will need to manually call `PinterestPlus.pinit()` after the script has loaded to parse the Pinterest button tags.
* `onready`: should be set to a callback function that does something after the script has loaded. For example, it might call `PinterestPlus.pinit()` like the example above.
* `nodetype`: overrides the type of DOM node that you would like to use for your Pinterest buttons, e.g `"span"`. The default is `"div"`, as demonstrated in the HTML5 example above.
* `classname`: overrides the class name that the script uses to find your Pinterest buttons. The default is `"pin-it-button"`.
* `layout`: sets the default button layout to override the usual `"horizontal"` setting. The options are `"none"`, `"vertical"` and `"horizontal"`.

You can also configure how the standard syntax `pinterest-plus.min.js` script works, but only `parsetags` and `onready` are supported.

After either script has loaded, you can call `PinterestPlus.pinit()`, optionally passing a DOM node as an argument, to process any new Pinterest buttons on the page (or inside the specified DOM node). This works great if you're loading content with Pinterest buttons via AJAX methods.

## HTML5 data attributes

The HTML5 syntax supported by the `pinterest-plus-html5.min.js` script may simplify some things for you if you need to generate Pinterest buttons on the server side. You do not need to worry about URI-encoding the `url` and `media` parameters that would normally go in the query string of a traditional Pinterest `<a>` tag. Rather, you just specify these directly in the `data-url` and `data-image` tag attributes, respectively. However, to be a good Web citizen, you should still take care to escape the usual HTML entity characters such as "&" with `&amp;` and so on.

The supported `data-*` attributes for the HTML5 syntax are:

* `data-url`: **(required)** the URL of the page you want to Pin. This should not be URI-encoded, i.e. encodeURIComponent is called by the script for you.
* `data-image`: **(required)** the URL of the image you want to Pin. This should not be URI-encoded either.
* `data-layout`: (optional) one of `"none"`, `"vertical"` or `"horizontal"`.
* `data-title`: (optional) the title to post with your Pin. Be especially careful to escape quote characters if you're generating these server-side.
* `data-description`: (optional) the description to post with your Pin. Again, be careful with HTML entity quoting.
* `data-always-show-count`: (optional) this is not mentioned on the Pinterest site, but it is part of the minified JavaScript options. For best results, leave this attribute out.

## Should I use this?

This is not officially supported by Pinterest in any capacity, so use it at your own risk. The Pinterest API is likely to change over time, so using their CDN-hosted `pinit.js` script is much safer for production work that you do not monitor closely. This works as of my last commits in current versions of Chrome, Safari and Firefox, but I can make no guarantees about its future viability. Hopefully, Pinterest will incorporate similar functionality into their JavaScript APIs.

## How does this work?

Basically, it works through simple reverse engineering efforts.

I started by downloading the `pinit.js` file from Pinterest's server (on the morning of June 19, 2012). I manually de-minified it and translated it to be more human-readable so that I could understand the algorithms. I used that work as a starting point to write the two scripts I'm promoting here.

You can see my homework in the `src` directory. I expect that the `pinit.js` functionality (the version I used is preserved in `src/pinit.original.js`) will change over time, so I've built my scripts to be quite configurable to handle changes to the Pinterest API endpoint URLs and parameter names.

## Why write this?

Three main reasons:

* `FB.XFBML.parse()`
* `twttr.widgets.load()`
* `gapi.plusone.go()`

If you've used the Facebook, Twitter or Google Plus sharing buttons, you've probably seen that these JavaScript methods can be used to parse new HTML content that you fly into the page via AJAX. The Pinterest `pinit.js` script lacked this functionality, so I took the time to build it.

Some other reasons:

* the standard Pinterest button syntax is not valid HTML, XHTML or HTML5.
* in the version I downloaded, I found problems in the `pinit.js` sanity checking code.
* in the version I downloaded, `pinit.js` finds Pinterest buttons by searching all `<a>` tags that have a certain substring in their `href` attributes, not by `class` name, as seems to be implied.
* I saw room for cross-browser time efficiency improvements by:
    * providing an API that allows developers to parse Pinterest tags limited to a specific DOM node.
    * querying for Pinterest tags by `class` name instead of `href` substrings.
    * using `getElementsByClassName()` instead of `getElementsByTagName()` in supporting browsers.
    * avoiding non-native function call overheads inside of the DOM node processing loops.

I also wanted to have an HTML5-valid syntax similar to the one used for the Google Plus button. The `pinterst-plus-html5.min.js` script is configurable for developers who would like to use almost any alternative Pinterest button syntax imagine. If you would still like to use the standard `<a>` tag with an `<img>` tag inside approach, you can accomplish this by setting `window.___pinconfig.nodetype` to `"a"`.

## A note on style

You may love or hate my JavaScript style. I strive to take my coding advice from <a href="http://www.amazon.com/JavaScript-Good-Parts-Douglas-Crockford/dp/0596517742" target="_blank">Douglas Crockford's *JavaScript, the Good Parts*</a>. If you haven't read it, please buy a copy and check it out. It's an awesome, quick read for JavaScript developers.
