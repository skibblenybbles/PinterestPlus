(function(o, q, c) {
    
    // o === document
    // q === window
    // c === (configuration data structure)
    
    var s = function(h) {
            
            // h === <a> tag to replace with an <iframe> or remove
            
            var e = c.pinit,
                m = "?",
                a,
                i,
                f,
                b;
            
            // e === URL for <iframe> src attribute
            // m === string holding "?" or "&" for building the URL's query string
            // a === counter variable
            // i === integer cache for .length calculations
            // f === an array of "key=value" strings from the <a> tag's query string
            // b === a two-value array of key / value pairs from splitting the "key=value"
            //       strings in f
            
            f = [];
            b = [];
            
            var j = { },
                g = o.createElement("IFRAME"),
                r = h.getAttribute(c.att.count) || false,
                n = h.getAttribute(c.att.layout) || "horizontal";
            
            // j === object mapping parsed query string key / value pairs from the <a> tag
            // g === <iframe> element that will replace the <a> tag
            // r === the value of the "always-show-count" atrribute, if it is present 
            //       in the <a> tag; otherwise, false
            // n === the value of the "count-layout" attribute from the <a> tag
            
            if (q.location.protocol === "https:")
                e = c.pinit_secure;
            
            f = h.href.split("?")[1].split("#")[0].split("&");
            a = 0;
            for (i = f.length; a < i; a += 1) {
                b = f[a].split("=");
                j[b[0]] = b[1]
            }
            
            // f === (changing semantics) [incorrectly] counts the number of required
            //       parameters from the <a> tag's query string
            // b === (changing semenatics) string name a query string parameter
            
            a = f = 0;
            for (i = c.vars.req.length; a < i; a += 1) {
                b = c.vars.req[a];
                if (j[b]) {
                    e = e + m + b + "=" + j[b];
                    m = "&"
                }
                f += 1;
            }
            
            if (j.media && j.media.indexOf("http") !== 0)
                f = 0;
            
            if (f === i) {
                a = 0;
                for (i = c.vars.opt.length; a < i; a += 1) {
                    b = c.vars.opt[a];
                    if (j[b])
                        e = e + m + b + "=" + j[b];
                }
                e = e + "&layout=" + n;
                if (r !== false)
                    e += "&count=1";
                
                g.setAttribute("src", e);
                g.setAttribute("scrolling", "no");
                g.allowTransparency = true;
                g.frameBorder = 0;
                g.style.border = "none";
                g.style.width = c.layout[n].width + "px";
                g.style.height = c.layout[n].height + "px";
                h.parentNode.replaceChild(g, h);
                
            } else 
                h.parentNode.removeChild(h);
                
        },
    
        p = o.getElementsByTagName("A"),
        l,
        d,
        k = [];
    
    // s === function that converts <a> tag elements to <iframe> elements
    // p === lazily evaluated getElementsByTagName() list of all <a> tags in the document
    // l === integer cache for .length calculations
    // d === counter variable
    // k === static array of all <a> tags in the document
    
    d = 0;
    for (l = p.length; d < l; d += 1)
        k.push(p[d]);
    
    d = 0;
    for (l = k.length; d < l; d += 1)
        k[d].href && k[d].href.indexOf(c.button) !== -1 && s(k[d]);
    
})(
    document,
    window,
    {
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
    }
);
