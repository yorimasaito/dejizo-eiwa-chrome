var xhr = new XMLHttpRequest();
var resultDisplay = null;
var MAX_RESULT_WORDS = 5;

function getResultBodies(xmlData) {

    function getBodyFromId(itemId) {
        itemId = encodeURIComponent(itemId);
        var params = 'Dic=EJdict' +
                     '&Item=' + itemId +
                     '&Loc=' +
                     '&Prof=XHTML';

        var getUrl = 'http://public.dejizo.jp/NetDicV09.asmx/GetDicItemLite';
        xhr.open('GET', getUrl + '?' + params, true);
        xhr.onreadystatechange = function() {
            // if the request completed
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var dom = xhr.responseXML;
                    var body = dom.getElementsByTagName('Body');
                    resultDisplay.innerHTML = body[0].innerHTML;
                    return body[0].innerHTML;
                } else {
                    return xhr.statusText;
                }
            }
        };
        xhr.send(null);
    }

    var ids = xmlData.getElementsByTagName('ItemID');

    var resultBodies = [];
    for (var i = 0; i < ids.length; i++) {
        resultBodies[i] = getBodyFromId(ids[i].childNodes[0].nodeValue);
    }

    return resultBodies;
}

function genPrettyLists(elements) {
    var resHTML = '<ul>';
    for (var i = 0; i < elements.length; i++) {
        var item = '<li>' + elements[i].innerHTML + '</li>';
        resHTML += item;
    }
    resHTML += '</ul>';
    return resHTML;
}

function lookupWords() {
    // Cancel the form submit
    event.preventDefault();

    var word = encodeURIComponent(document.getElementById('searchWord').value);

    var getUrl = 'http://public.dejizo.jp/NetDicV09.asmx/SearchDicItemLite';

    var params = 'Dic=EJdict&' +
                 'Word=' + word +
                 '&Scope=HEADWORD' +
                 '&Match=EXACT' +
                 '&Merge=AND' +
                 '&Prof=XHTML' +
                 '&PageSize=' + MAX_RESULT_WORDS +
                 '&PageIndex=0';

    xhr.open('GET', getUrl + '?' + params, true);
    xhr.onreadystatechange = function() {
        // if the request completed
        if (xhr.readyState == 4) {
            resultDisplay.innerHTML = '';
            if (xhr.status == 200) {
                var meaningDivs = getResultBodies(xhr.responseXML);
                resultDisplay.innerHTML = genPrettyLists(meaningDivs);
            } else {
                resultDisplay.innerHTML = xhr.statusText;
            }
        }
    };

    xhr.send(null);
}

window.addEventListener('load', function(event) {
    resultDisplay = document.getElementById('resultDisplay');
    document.getElementById('lookup').addEventListener('submit', lookupWords);
});
