(function(config) {
    
    var 
        // replace the given link element <a> tag with a Pinterest <iframe> tag
        replacePinterestTag = function(linkElement) {
            
            var 
                // URL for <iframe> src attribute
                iframeSrc = window.location.protocol === "https:" ? config.pinit_secure : config.pinit,
                
                // string holding "?" or "&" for building the URL's query string
                qOrA = "?",
                
                // NOTE: a lot of this madness would be simplified for developers
                // by using data-* attributes instead of a big, gnarly URI-encoded query string
                // will provide this in the HTML5-ready version
                
                // an array of "key=value" strings from the <a> tag's query string
                keysValues = linkElement.href.split("?")[1].split("#")[0].split("&"),
                
                // a two-value array of key / value pairs from splitting keysValues
                keyValue = [],
                
                // object mapping parsed query string key / value pairs from the <a> tag
                params = { },
                
                // <iframe> element that will replace the <a> tag
                iframe = document.createElement("IFRAME"),
                
                // the value of the "always-show-count" atrribute, if it is present 
                //  in the <a> tag; otherwise, false
                showCount = linkElement.getAttribute(config.att.count) || false,
                
                // the value of the "count-layout" attribute from the <a> tag
                layout = linkElement.getAttribute(config.att.layout) || "horizontal",
                
                // [incorrectly] counts the number of required parameters from
                // the <a> tag's query string
                requiredCount = 0,
                
                // string name of a parameter in the query string
                param,
                
                // integer cache for .length calculations
                len,
                
                // counter variable
                i;
            
            // build up the key / value map
            i = 0;
            for (len = keysValues.length; i < len; i += 1) {
                keyValue = keysValues[i].split("=");
                params[keyValue[0]] = keyValue[1];
            }
            
            // check for the required parameters and continue building the iframe src URL
            i = 0;
            for (len = config.vars.req.length; i < len; i += 1) {
                param = config.vars.req[i];
                if (params[param]) {
                    iframeSrc = iframeSrc + qOrA + param + "=" + params[param];
                    qOrA = "&";
                }
                // BUG: this should be IN the if statement to count correctly
                requiredCount += 1;
            }
            
            // check if the media parameter uses the http(s?) protocol
            if (params.media && params.media.indexOf("http") !== 0)
                requiredCount = 0;
            
            // NOTE: we should check if the url parameter uses http(s?) as well
            
            // NOTE: we should check if the layout parameter was legitimate
            
            // if we had the required parameters, finish building the <iframe>
            // tag and replace the <a> tag; otherwise, remove the <a> tag
            if (requiredCount === len) {
                
                // NOTE: for efficiency / memory management, we shouldn't create the <iframe> element
                // until we get here and know that we'll use it
                
                i = 0;
                for (len = config.vars.opt.length; i < len; i += 1) {
                    param = config.vars.opt[i];
                    if (params[param])
                        iframeSrc = iframeSrc + qOrA + param + "=" + params[param];
                }
                
                iframeSrc = iframeSrc + "&layout=" + layout;
                if (showCount !== false)
                    iframeSrc += "&count=1";
                
                iframe.setAttribute("src", iframeSrc);
                iframe.setAttribute("scrolling", "no");
                iframe.allowTransparency = true;
                iframe.frameBorder = 0;
                iframe.style.border = "none";
                iframe.style.width = config.layout[layout].width + "px";
                iframe.style.height = config.layout[layout].height + "px";
                linkElement.parentNode.replaceChild(iframe, linkElement);
                
            } else
                linkElement.parentNode.removeChild(linkElement);
                
        },
        
        // potentially lazy evaluated getElementsByTagName() list of all <a> tags in the document
        dynamicElements = document.getElementsByTagName("A"),
        
        // static array of all <a> tags in the document
        elements = [],
        
        // integer cache for .length calculations
        len,
        
        // counter variable
        i;
    
    // NOTE: it might be better to perform the DOM query with
    // element.getElementsByClassName("pin-it-button") and filtering down to <a> tags
    // when the method is supported;
    // otherwise, use element.getElementsByTagName("A") and filter down by class names
    
    // since we'll be changing the DOM, cache the results in case the NodeList is
    // re-evaluated during the loop
    i = 0;
    for (len = dynamicElements.length; i < len; i += 1)
        elements.push(dynamicElements[i]);
    
    // filter down to tags that have the Pinterest sharing URL in their href attributes
    // NOTE: this would be best to perform as a sanity check only.
    // do the DOM query by class name for better performance
    // (especially when element.getElementsByClassName() is available).
    // NOTE: it would also be better to avoid the inner-loop non-native function call overhead.
    // rather, store the <a> tags and their parsed configuration in a data structure and
    // create all the <iframe>s inside of one function
    i = 0;
    for (len = elements.length; i < len; i += 1)
        elements[i].href && elements[i].href.indexOf(config.button) !== -1 && replacePinterestTag(elements[i]);
    
})({
    att: {
        layout: "count-layout",
        count: "always-show-count"
    },
    pinit: "http://pinit-cdn.pinterest.com/pinit.html",
    pinit_secure: "https://assets.pinterest.com/pinit.html",
    button: "//pinterest.com/pin/create/button/?",
    vars: {
        req: ["url", "media"],
        opt: ["title", "description"]
    },
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
    }
});
