PinterestPlus
=============

An improved implementation of the Pinterest "Pin It" button with an HTML5-valid syntax option

## How to use this

On the command line, `cd` into the directory where you'd like to store the JavaScript code and `git clone https://github.com/skibblenybbles/PinterestPlus.git`.

Alternatively, [download a zip file](https://github.com/skibblenybbles/PinterestPlus/zipball/master) of the latest source code and unzip it.

On your Web server, you'll need to host either `pinterest-plus.min.js` (for the Pinterest style `<a>` tags) or `pinterest-plus-html5.min.js` (for the new HTML5 syntax that the script enables). Just reference the JavaScript file that you'd like to use in a `<script>` tag right before the close of the `<body>` of your HTML document. If you'd like to load the script asynchronously, please see an example of how to do this below.

## HTML example using [Pinterest's standard button syntax](http://pinterest.com/about/goodies/)

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

            <script src="pinterest-plus.min.js"></script>

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
        
            <script src="pinterest-plus-html5.min.js"></script>
        
        </body>
    </html>

This was designed to be similar to the Google Plus button syntax. You can see the full list of required and optional data-* attributes as well as how to use this script asynchronously below.

## HTML5 example with asynchronous script loading

Social sharing buttons are notorious for causing long page load times. This problem can be remedied with asynchronous script loading. I recommend that you use a JavaScript library method for asynchronous script loading, such as jQuery's `$.getScript(...)` or Dojo's `require(...)`, but I've borrowed Google's async script loading code to demo what you can do with the PinterestPlus script.

    <!DOCTYPE html>
    <html>
        <head>
        
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />    
            <title>PinterestPlus</title>
        
            <script>
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
            (function() {
                var s = document.createElement("script"),
                    f = document.getElementsByTagName("script")[0];
                s.async = true;
                s.src = "pinterest-plus-html5.min.js"; // Note: this should be the location where you host this file
                f.parentNode.insertBefore(s, f);
            })();
            </script>
        
        </body>
    </html>

## Configuration and usage

Similar to the Google Plus button, you can configure how `pinterest-plus-html5.min.js` behaves. In the `<head>` of your document, just set the `window.___pincfg` value to a JavaScript object with the following optional properties:
    
* `parsetags`: should be set to `"onload"` or `"explicit"`. If set to `"explicit"`, you will need to manually call `PinterestPlus.pinit()` after the script has loaded.
* `onready`: should be set to a callback function that does something after the script has loaded. For example, it might call `PinterestPlus.pinit()` like the example above.
* `nodetype`: overrides the type of DOM node that you would like to use for your Pinterest buttons, e.g `"span"`. The default is `"div"`, as demonstrated in the HTML5 example above.
* `classname`: overrides the class name that the script uses to find your Pinterest buttons. The default is `"pin-it-button"`.
* `layout`: sets the default button layout to override the usual `"horizontal"` setting. The options are `"none"`, `"vertical"` and `"horizontal"`.

