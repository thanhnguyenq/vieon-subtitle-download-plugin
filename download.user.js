// ==UserScript==
// @name         Vieon Subtitle Downloader [VTT]
// @version      0.3
// @description  Download subtitle from Vieon
// @author       Chiefileum
// @match        https://vieon.vn/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vieon.vn
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function getVTTSubtitle(url, callBackFn) {
        GM_xmlhttpRequest ({
            method:     "GET",
            url,
            onload:     function (response) {
                callBackFn(response.responseText);
            }
        });
    }

    function createDownloadButton(data) {
        var blob = new Blob([data], {
            type: 'text/vtt'
        });

        const newButton = document.createElement('a');
        newButton.textContent = 'Download Sub';
        newButton.download = `${document.title}.vtt`;
        newButton.href = URL.createObjectURL(blob);
        newButton.className='ControlBottom_Button__qrmzR';

        var node = document.querySelector(".player__controls-bottom__item.player-report button");
        node.parentNode.replaceChild(newButton, node);
    }

    const constantMock = window.fetch;
    unsafeWindow.fetch = function() {
        // Get the parameter in arguments
        // Intercept the parameter here
        for (const arg of arguments) {
            if (typeof arg === 'string' || arg instanceof String) {
                if(arg.endsWith(".vtt")){
                    getVTTSubtitle(arg, createDownloadButton);
                }
            }
        }
        return constantMock.apply(this, arguments)
    }
})();
