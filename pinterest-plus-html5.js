// To configure whether PinterestPlus automatically parses Pinterest tags
// after the <script> has loaded, set the window.___pincfg (note that there
// are three underscore characters) configuration value like so :
//
// window.___pincfg = {
//     // the type of DOM node that the Pinterest tags use, e.g. "div"
//     // (the default is "div")
//     nodetype: "div",
//
//     // the class attribute that identifies Pinterest tags
//     // (the default is "pin-it-button")
//     classname: "pin-it-button",
//
//     // the default layout type for the count flag
//     // one of "none", "vertical" or "horizontal"
//     // (the default is "horizontal")
//     layout: "horizontal",
//
//     // when to parse the Pinterest tags
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
// via AJAX or DHTML methods to parse any new Pinterest tags inside of a particular
// DOM element.
//
// If you don't specify the <optional DOM element>, the method will parse the entire
// document to replace the Pinterest tags.

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

    var
        // general url testing regular expression
        urlRx = /^http(s?):\/\/.+/i,

        // configuration data for controlling parsing and <iframe> rendering
        config = {

            // the <iframe> URL
            url: window.location.protocol === "https:"
                ?
                "https://assets.pinterest.com/pinit.html"
                :
                "http://assets.pinterest.com/pinit.html",

            // Pinterest tag attributes to parse
            attrs: {
                url: "data-url",
                media: "data-image",
                layout: "data-layout",
                count: "data-always-show-count",
                title: "data-title",
                description: "data-description"
            },

            // attribute defaults
            defaults: {
                layout: window.___pincfg.layout || "horizontal"
            },

            validators: {
                url: urlRx,
                media: urlRx,
                layout: /^(none)|(vertical)|(horizontal)$/
            },

            // required and optional attributes for the Pinterest tags
            attrsConfig: {
                required: ["url", "media"],
                optional: ["layout", "title", "description"]
            },

            // the type of DOM node for Pinterest tags
            buttonType: window.___pincfg.nodetype
                ?
                window.___pincfg.nodetype.toLowerCase()
                :
                "div",

            // the required class name and regular expression for Pinterest tags
            buttonClass: window.___pincfg.classname || "pin-it-button",
            buttonClassRx: window.___pincfg.classname
                ?
                new RegExp("(.*\\s)?" + window.___pincfg.classname + "(\\s.*)?")
                :
                /(.*\s)?pin-it-button(\s.*)?/,

            // <iframe> layout options data
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

            // parse tags on load?
            parseTags: window.___pincfg.parsetags || "onload",

            // run a function once ready?
            onReady: window.___pincfg.onready || null
        };

    // uses element.getElementsByClassName to find Pinterest tags
    // with the config.buttonClass class name.
    // theoretically, this is more efficient, as more native code than
    // JavaScript code will be executed, so long as random elements that
    // are not Pinterest buttons have the config.buttonClass class name
    function getPinterestTagsByClass(element) {

        // to avoid potential problems with a NodeList that changes
        // while we modify the DOM, return results in a proper array
        var elements = [],
            nodeList = element.getElementsByClassName(config.buttonClass),
            buttonType = config.buttonType,
            node,
            len,
            i;

        i = 0;
        for (len = nodeList.length; i < len; i += 1) {

            // only keep config.buttonType tags
            // be careful with HTML/XHTML case-sensitivity issues
            node = nodeList[i];
            if (node.nodeName.toLowerCase() === buttonType)
                elements.push(node);
        }

        return elements;
    }

    // uses element.getElementsByTagName to find Pinterest tags
    // with the config.buttonClass class name
    function getPinterestTagsByName(element) {

        // to avoid potential problems with a NodeList that changes
        // while we modify the DOM, return results in a proper array
        var elements = [],
            nodeList = element.getElementsByTagName(config.buttonType),
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

    // processes an array of Pinterest tags and returns an array of objects
    // describing what to do with each tag
    function processTags(elements) {

        var tagsData = [],
            attrNames = config.attrs,
            attrDefaults = config.defaults,
            attrValidators = config.validators,
            data,
            element,
            attrs,
            attr,
            attrName,
            attrValue,
            attrDefault,
            attrValidate,
            attrsValid,
            attrsMap,
            query,

            // loop variables
            lenOuter,
            lenInner,
            i,
            j;

        function getAttrDefault(element, attrName) {
            var defaultValue;

            if (! attrName in attrDefaults) {
                return null;
            }

            defaultValue = attrDefaults[attrName]

            if (typeof defaultValue === "function") {
                return defaultValue(element);
            }

            return defaultValue;
        }

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

            // retrieve and validate the required attributes
            // while building up the query and attributes map
            query = [];
            attrsMap = { };
            attrsValid = true;
            attrs = config.attrsConfig.required;
            j = 0;
            for (lenInner = attrs.length; j < lenInner; j += 1) {

                attr = attrs[j];
                attrName = attrNames[attr];
                attrValidate = attrValidators[attr];

                attrValue = element.getAttribute(attrName) || getAttrDefault(element, attrName);
                if (attrValue !== null &&
                    (!attrValidate || attrValidate.test(attrValue))
                ) {

                    attrsMap[attr] = attrValue;
                    query.push(attr + "=" + encodeURIComponent(attrValue));

                } else {

                    // bail out of the loop if we missed a required attribute
                    attrsValid = false;
                    break;
                }
            }

            // keep processing?
            if (attrsValid) {

                // retrieve and validate the optional attributes
                // while building up the query
                attrs = config.attrsConfig.optional;
                j = 0;
                for (lenInner = attrs.length; j < lenInner; j += 1) {

                    attr = attrs[j];
                    attrName = attrNames[attr];
                    attrDefault = getAttrDefault(element, attr);
                    attrValidate = attrValidators[attr];

                    attrValue = element.getAttribute(attrName) || attrDefault || null;
                    if (attrValue !== null) {

                        // validate?
                        if (!attrValidate || attrValidate.test(attrValue)) {

                            attrsMap[attr] = attrValue;
                            query.push(attr + "=" + encodeURIComponent(attrValue));

                        } else {

                            // bail out if we had an invalid attribute
                            attrsValid = false;
                            break;
                        }
                    }
                }

                // keep processing?
                if (attrsValid) {

                    // handle the special count attribute
                    if ((element.getAttribute(config.attrs.count) || false) !== false) {

                        query.push("count=1");
                    }

                    // this tag is valid, so keep all this data
                    // we worked so hard to parse!
                    data.layout = attrsMap.layout;
                    data.query = query.join("&");
                    data.valid = true;
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

    // convert all Pinterest tags that are descendants of the given HTML
    // element to <iframe> tags.
    // any invalid Pinterest tags will be removed from the DOM.
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
