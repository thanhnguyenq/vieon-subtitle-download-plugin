// ==UserScript==
// @name         Vieon Subtitle Downloader [VTT]
// @namespace    https://www.facebook.com/vnanime.net/
// @version      0.6
// @description  Download subtitle from Vieon
// @author       Chiefileum
// @match        https://vieon.vn/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vieon.vn
// @run-at       document-start
// @updateURL    https://github.com/thanhnguyenq/vieon-subtitle-download-plugin/raw/main/download.user.js
// @downloadURL  https://github.com/thanhnguyenq/vieon-subtitle-download-plugin/raw/main/download.user.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

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
        newButton.href = URL.createObjectURL(blob);
        newButton.className='ControlBottom_Button__qrmzR';

        waitForElm(".player__controls-bottom__item.player-report button").then((elm) => {
            newButton.download = `${document.getElementsByClassName('player__title-sub')[0].innerHTML}.vtt`;
            elm.parentNode.replaceChild(newButton, elm);
        });
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
