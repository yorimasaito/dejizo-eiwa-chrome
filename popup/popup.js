var resultDisplay = null;
var searchWord;
var MAX_RESULT_WORDS = 5;

function getBodyFromId(itemId, callback) {
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
        if (xhr.readyState == 4 && xhr.status == 200) {
            var dom = xhr.responseXML;
            var head = dom.getElementsByTagName('Head');
            var body = dom.getElementsByTagName('Body');
            var res = head[0].innerHTML + body[0].innerHTML;
            callback(res);
        } else {
            callback(xhr.statusText);
        }
    };
    xhr.send(null);
}

function getResultBodies(xmlData, showResult) {
    var ids = xmlData.getElementsByTagName('ItemID');
    var ids_length = ids.length;
    if (ids_length == 0) {
        var message = searchWord + ' に一致する情報は見つかりませんでした.';
        showResult(message);
    } else if (ids_length == 1){
        getBodyFromId(ids[0].childNodes[0].nodeValue, function(resHTML){
            showResult(resHTML);
        });
    } else {
        for(var i = 0; i < ids_length; i++) {
            getBodyFromId(ids[i].childNodes[0].nodeValue, function(resHTML){
                showResult(resHTML);
            });
        }
    }
}

function lookupWord() {
    // Cancel the form submit
    event.preventDefault();
    var xhr = new XMLHttpRequest();

    searchWord = encodeURIComponent(document.getElementById('searchWordForm').value);

    var getUrl = 'http://public.dejizo.jp/NetDicV09.asmx/SearchDicItemLite';
    var params = 'Dic=EJdict&' +
                 'Word=' + searchWord +
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
                getResultBodies(xhr.responseXML, function(responseHTML){
                    resultDisplay.innerHTML += responseHTML;
                });
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
