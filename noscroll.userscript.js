// ==UserScript==
// @name         noscroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevent jank scroll
// @author       You
// @match        *
// @grant        none
// @run-at document-start
// ==/UserScript==
/* jshint -W097 */
'use strict';
function injected() {
    var blockedEvents = [
        "scroll",
        "scrollstop",
        "mousewheel",
        "wheel",
    ];

    var oldAddEventListener = EventTarget.prototype.addEventListener;

    Object.defineProperty(EventTarget.prototype, "addEventListener", {
        value: function(type) {
            if (blockedEvents.indexOf(type) !== -1) {
                return;
            }

            console.log("addEventListener", type);

            return oldAddEventListener.apply(this, arguments);
        }
    });

    for (var i = 0; i < blockedEvents.length; i++) {
        var property = "on" + blockedEvents[i];

        var descriptor = {
            set: function() {},
            configurable: false,
        };

        Object.defineProperty(window, property, descriptor);
        Object.defineProperty(document, property, descriptor);
    }
}

var script = document.createElement("script");

script.appendChild(document.createTextNode("(" + injected + ")();"));

document.children[0].appendChild(script);
