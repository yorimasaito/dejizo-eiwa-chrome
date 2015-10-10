var resultDisplay = null;
var MAX_RESULT_WORDS = 5;

function getResultBodies(xmlData) {

    function getBodyFromId(itemId) {
        var xhr = new XMLHttpRequest();

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
                    var head = dom.getElementsByTagName('Head');
                    var body = dom.getElementsByTagName('Body');
                    var res = head[0].innerHTML + body[0].innerHTML;
                    resultDisplay.innerHTML += res;
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
        getBodyFromId(ids[i].childNodes[0].nodeValue);
    }
}

function lookupWord() {
    // Cancel the form submit
    event.preventDefault();
    var xhr = new XMLHttpRequest();

    var word = encodeURIComponent(document.getElementById('searchWordForm').value);

    var getUrl = 'http://public.dejizo.jp/NetDicV09.asmx/SearchDicItemLite';

    var params = 'Dic=EJdict&' +
                 'Word=' + word +
                 '&Scope=HEADWORD' +
                 '&Match=CONTAIN' +
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
                getResultBodies(xhr.responseXML);
            } else {
                resultDisplay.innerHTML = xhr.statusText;
            }
        }
    };

    xhr.send(null);
}

window.addEventListener('load', function(event) {
    resultDisplay = document.getElementById('resultDisplay');
    document.getElementById('lookup').addEventListener('submit', lookupWord);
});
