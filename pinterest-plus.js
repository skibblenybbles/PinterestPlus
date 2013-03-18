// To configure whether PinterestPlus automatically parses Pinterest tags
// after the <script> has loaded, set the window.___pincfg (note that there 
// are three underscore characters) configuration value like so :
//
// window.___pincfg = {
//     // when to parse the Pinterest <a> tags
//     // either "explicit" or "onload"
//     // (the default is "onload")
//     parsetags: "explicit"
//
//     // specify a function to run once the PinterestPlus
//     // script has loaded
//     // (the default is null)
//     onready: null
// };
//
// If you use "explicit" parsing, you must call PinterestPlus.pinit(<optional DOM element>)
// after the pinit-plus.js <script> has loaded.
//
// You can also call PinterestPlus.pinit(<optional DOM element>) after modifying the DOM
// via AJAX or DHTML methods to parse any new Pinterest <a> tags inside of a particular
// DOM element.
//
// If you don't specify the <optional DOM element>, the method will parse the entire
// document to replace the Pinterest <a> tags.

(function() {
    
    // already loaded?
    if (window.PinterestPlus)
        return;
    
    // get the user's configuration
    window.___pincfg = window.___pincfg && typeof(window.___pincfg) === "object" 
        ? 
        window.___pincfg
        : 
        { };
    
    // configuration data for controlling parsing and <iframe> rendering
    var config = {
        
        // the <iframe> URL
        url: window.location.protocol === "https:"
            ?
            "https://assets.pinterest.com/pinit.html"
            :
            "http://assets.pinterest.com/pinit.html",
        
        // Pinterest <a> tag attributes to parse
        // note that these are not valid HTML or XHTML
        attrs: {
            layout: "count-layout",
            count: "always-show-count"
        },
        
        // the required href regular expression for the Pinterest <a> tags
        // this guarantees that the href split operations won't go out of bounds
        buttonHrefRx: /^http(s?):\/\/pinterest.com\/pin\/create\/button\/\?.+/,
        
        // the required class name and regular expression for Pinterest <a> tags
        buttonClass: "pin-it-button",
        buttonClassRx: /(.*\s)?pin-it-button(\s.*)?/,
        
        // general url testing regular expression
        urlRx: /^http(s?):\/\/.+/i,
        
        // required and optional parameters for the Pinterest <a> tags' query strings
        params: {
            required: ["url", "media"],
            optional: ["title", "description"]
        },
        
        // <iframe> layout options data and regular expression
        layout: {
            none: {
                width:43,
                height:20
            },
            vertical: {
                width: 43,
                height: 58
            },
            horizontal: {
                width: 90,
                height: 20
            }
        },
        layoutRx: /^(none)|(vertical)|(horizontal)$/,
        
        // parse tags on load?
        parseTags: window.___pincfg.parsetags || "onload",
        
        // run a function once ready?
        onReady: window.___pincfg.onready || null
    };
    
    // uses element.getElementsByClassName to find Pinterest <a> tags
    // with the config.buttonClass class name.
    // theoretically, this is more efficient, as more native code than
    // JavaScript code will be executed, so long as random elements that
    // are not Pinterest buttons have the config.buttonClass class name
    function getPinterestTagsByClass(element) {
        
        // to avoid potential problems with a NodeList that changes
        // while we modify the DOM, return results in a proper array
        var elements = [],
            nodeList = element.getElementsByClassName(config.buttonClass),
            node,
            len,
            i;
        
        i = 0;
        for (len = nodeList.length; i < len; i += 1) {
            
            // only keep <a> tags
            // be careful with HTML/XHTML case-sensitivity issues
            node = nodeList[i];
            if (node.nodeName.toLowerCase() == "a")
                elements.push(node);
        }
        
        return elements;
    }
    
    // uses element.getElementsByTagName to find Pinterest <a> tags
    // with the config.buttonClass class name
    function getPinterestTagsByName(element) {
        
        // to avoid potential problems with a NodeList that changes
        // while we modify the DOM, return results in a proper array
        var elements = [],
            nodeList = element.getElementsByTagName("a"),
            buttonClassRx = config.buttonClassRx,
            node,
            len,
            i;
        
        i = 0;
        for (len = nodeList.length; i < len; i += 1) {
            
            // only keep tags with the config.buttonClass class name
            node = nodeList[i];
            if (buttonClassRx.test(node.getAttribute("class") || "")) {
                elements.push(node);
            }
        }
        
        return elements;
    }
    
    // processes an array of <a> tags and returns an array of objects
    // describing what to do with each tag
    function processTags(elements) {
        
        var tagsData = [],
            data,
            element,
            attrHref,
            attrLayout,
            attrCount,
            keysValues,
            keyValue,
            parsedParams,
            params,
            param,
            hasRequiredParams,
            query,
            
            // loop variables
            lenOuter,
            lenInner,
            i,
            j;
        
        i = 0;
        for (lenOuter = elements.length; i < lenOuter; i += 1) {
            
            element = elements[i];
            
            // set up the data structure for this tag,
            // but mark it invalid until proven otherwise.
            // there is no presumption of innocence in JavaScript!
            data = {
                element: element,
                valid: false
            };
            tagsData.push(data);
            
            // retrieve the attributes we'll need from the tag
            attrHref = element.getAttribute("href");
            attrLayout = element.getAttribute(config.attrs.layout) || "horizontal";
            attrCount = element.getAttribute(config.attrs.count) || false;
            
            // do some sanity checks before we waste more processing power
            if (attrHref &&
                config.buttonHrefRx.test(attrHref) &&
                config.layoutRx.test(attrLayout)
            ) {
                
                // build the key / value parameters map from the query string
                parsedParams = { };
                keysValues = attrHref.split("?")[1].split("#")[0].split("&");
                j = 0;
                for (lenInner = keysValues.length; j < lenInner; j += 1) {
                    
                    keyValue = keysValues[j].split("=");
                    parsedParams[keyValue[0]] = keyValue[1];
                }
                
                // start building the query string
                // while checking for the required parameters
                query = [];
                hasRequiredParams = true;
                params = config.params.required;
                j = 0;
                for (lenInner = params.length; j < lenInner; j += 1) {
                    
                    param = params[j];
                    if (param in parsedParams) {
                        
                        query.push(param + "=" + parsedParams[param]);
                    
                    } else {
                        
                        // bail out of the loop if we missed a required param
                        hasRequiredParams = false;
                        break;
                    }
                }
                
                // do some more sanity checks on our params before proceeding
                // note that decodeURIComponenet will throw an exception for invalid character encodings
                try {
                    
                    if (hasRequiredParams &&
                        config.urlRx.test(decodeURIComponent(parsedParams.url)) &&
                        config.urlRx.test(decodeURIComponent(parsedParams.media))
                    ) {
                        
                        // keep building the query string with optional parameters
                        params = config.params.optional;
                        j = 0;
                        for (lenInner = params.length; j < lenInner; j += 1) {
                            
                            param = params[j];
                            if (param in parsedParams) {
                                
                                query.push(param + "=" + parsedParams[param]);
                            }
                        }
                        
                        // add the count value to the query string?
                        if (attrCount !== false) {
                            
                            query.push("count=1");
                        }
                        
                        // this tag is valid, so keep all this data
                        // we worked so hard to parse!
                        data.layout = attrLayout;
                        data.query = query.join("&");
                        data.valid = true;
                    }
                    
                } catch (exception) {
                    
                    // don't bother processing this element anymore
                }
            }
        }
        
        // wooh, finally!
        return tagsData;
    }
    
    // replace tags using the data from processTags
    // and return the new <iframe> tags
    function replaceTags(tagsData) {
        
        var iframes = [],
            data,
            element,
            layout,
            iframe,
            len,
            i;
        
        i = 0;
        for (len = tagsData.length; i < len; i += 1) {
            
            data = tagsData[i];
            element = data.element;
            
            // create the <iframe> or remove the tag?
            if (data.valid) {
                
                layout = data.layout;
                
                iframe = document.createElement("iframe");
                iframe.setAttribute("src", config.url + "?" + data.query);
                iframe.setAttribute("scrolling", "no");
                iframe.setAttribute("allowtransparency", "true");
                iframe.setAttribute("frameborder", "0");
                iframe.style.border = "none";
                iframe.style.width = config.layout[layout].width + "px";
                iframe.style.height = config.layout[layout].height + "px";
                
                // replace it with the <iframe>
                element.parentNode.replaceChild(iframe, element);
                
                // keep track of all the new iframes
                iframes.push(iframe);
                
            } else {
                
                // nuke it!
                element.parentNode.removeChild(element);
            }
        }
        
        return iframes;
    }
    
    // convert all Pinterest <a> tags that are descendants of the given HTML
    // element to <iframe> tags.
    // any invalid Pinterest <a> tags will be removed from the DOM.
    // if the element argument is not specified, the entire HTML document is
    // processed.
    // for convenience, returns an array of the <iframe> HTML elements that
    // were created.
    function pinit(element) {
        
        var elements;
        
        // process the document by default
        element = element || document;
        
        // decide how to query the DOM
        if (element.getElementsByClassName) {
            
            elements = getPinterestTagsByClass(element);
        
        } else if (element.getElementsByTagName) {
            
            elements = getPinterestTagsByName(element);
            
        } else {
            
            // uh... what is with this browser?
            // just bail
            return null;
        }
        
        // replace the tags and return the new <iframe> tags
        return replaceTags(processTags(elements));
    }
    
    // process tags now?
    if (config.parseTags !== "explicit") {
        
        pinit();
    }
    
    // make the API globally available
    window.PinterestPlus = {
        pinit: pinit
    };
    
    // run a callback function?
    if (config.onReady && typeof(config.onReady) === "function")
        config.onReady();
    
})();
