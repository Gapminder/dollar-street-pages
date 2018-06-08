(function (exports) {
    function urlsToAbsolute(nodeList) {
        if (!nodeList.length) {
            return [];
        }
        var attrName = 'href';
        if (nodeList[0].__proto__ === HTMLImageElement.prototype
        || nodeList[0].__proto__ === HTMLScriptElement.prototype) {
            attrName = 'src';
        }
        nodeList = [].map.call(nodeList, function (el, i) {
            var attr = el.getAttribute(attrName);
            if (!attr) {
                return;
            }
            var absURL = /^(https?|data):/i.test(attr);
            if (absURL) {
                return el;
            } else {
                return el;
            }
        });
        return nodeList;
    }

    function screenshotPage() {
        urlsToAbsolute(document.images);
        urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
        var screenshot = document.documentElement.cloneNode(true);
        var b = document.createElement('base');
        b.href = document.location.protocol + '//' + location.host;
        var head = screenshot.querySelector('head');
        head.insertBefore(b, head.firstChild);
        screenshot.style.pointerEvents = 'none';
        screenshot.style.overflow = 'hidden';
        screenshot.style.webkitUserSelect = 'none';
        screenshot.style.mozUserSelect = 'none';
        screenshot.style.msUserSelect = 'none';
        screenshot.style.oUserSelect = 'none';
        screenshot.style.userSelect = 'none';
        screenshot.dataset.scrollX = window.scrollX;
        screenshot.dataset.scrollY = window.scrollY;
        var script = document.createElement('script');
        script.textContent = '(' + addOnPageLoad_.toString() + ')();';
        screenshot.querySelector('body').appendChild(script);

        var blob = new Blob([screenshot.outerHTML], {
            // type: 'text/html'
            type: 'image/jpeg'//,
            // type: 'mimeString'
        });

        var image = new Image();
        // image.src = window.URL.createObjectURL(blob);

        var fileReader = new window.FileReader();
        fileReader.readAsDataURL(blob);
        fileReader.onloadend = function() {
          image.src = fileReader.result;

          // var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(fileReader.result)));
          // image.src = 'data:image/png;base64,'+base64String;

          console.log(fileReader.result, 'BASE');

          document.getElementsByClassName('icon-container')[0].appendChild(image);
        }

        //var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(fileReader.result)));
        //image.src = 'data:image/png;base64,'+base64String;

        return blob;
    }

    function addOnPageLoad_() {
        window.addEventListener('DOMContentLoaded', function (e) {
            var scrollX = document.documentElement.dataset.scrollX || 0;
            var scrollY = document.documentElement.dataset.scrollY || 0;
            window.scrollTo(scrollX, scrollY);
        });
    }

    function generate() {
        window.URL = window.URL || window.webkitURL;
        window.open(window.URL.createObjectURL(screenshotPage()));
    }
    exports.screenshotPage = screenshotPage;
    exports.generate = generate;
})(window);









// Getting a file through XMLHttpRequest as an arraybuffer and creating a Blob
/*var rhinoStorage = localStorage.getItem("rhino"),
    rhino = document.getElementById("rhino");
if (rhinoStorage) {
    // Reuse existing Data URL from localStorage
    rhino.setAttribute("src", rhinoStorage);
}
else {
    // Create XHR, Blob and FileReader objects
    var xhr = new XMLHttpRequest(),
        blob,
        fileReader = new FileReader();

    xhr.open("GET", "http://static.dollarstreet.org/media/India 12/image/8a454d9c-dca6-447e-90bb-512b1628f086/480x480-8a454d9c-dca6-447e-90bb-512b1628f086.jpg", true);
    // Set the responseType to arraybuffer. "blob" is an option too, rendering manual Blob creation unnecessary, but the support for "blob" is not widespread enough yet
    xhr.responseType = "arraybuffer";
// xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
// xhr.withCredentials = "true";
    xhr.addEventListener("load", function () {
        if (xhr.status === 200) {
            // Create a blob from the response
            blob = new Blob([xhr.response], {type: "image/png"});

            // onload needed since Google Chrome doesn't support addEventListener for FileReader
            fileReader.onload = function (evt) {
                // Read out file contents as a Data URL
                var result = evt.target.result;
                // Set image src to Data URL
                rhino.setAttribute("src", result);
                // Store Data URL in localStorage
                try {
                    localStorage.setItem("rhino", result);
                }
                catch (e) {
                    console.log("Storage failed: " + e);
                }
            };
            // Load blob as Data URL
            fileReader.readAsDataURL(blob);
        }
    }, false);
    // Send XHR
    xhr.send();
}*/
