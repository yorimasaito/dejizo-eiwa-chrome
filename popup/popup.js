var resultDisplay = null;
var searchWord;
var MAX_RESULT_WORDS = 5;

function showResultHTMLArray(HTMLArray) {
    HTMLArray.forEach(function(HTML) {
        resultDisplay.innerHTML += HTML;
    });
}

function getDictItemURL(itemId) {
    itemId = encodeURIComponent(itemId);
    var getUrl = 'http://public.dejizo.jp/NetDicV09.asmx/GetDicItemLite';
    var params = 'Dic=EJdict' +
                 '&Item=' + itemId +
                 '&Loc=' +
                 '&Prof=XHTML';
    return getUrl + '?' + params;
}

function getResultHTML(itemId) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        var url = getDictItemURL(itemId);
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            // if the request completed
            if (xhr.readyState == 4) {
                if(xhr.status == 200) {
                    var dom = xhr.responseXML;
                    var head = dom.getElementsByTagName('Head');
                    var body = dom.getElementsByTagName('Body');
                    var res = head[0].innerHTML + body[0].innerHTML;
                    resolve(res);
                } else {
                    reject();
                }
            }
        };
        xhr.send(null);
    });
}

function getResultHTMLArrayFromIds(ids) {
    return new Promise(function (resolve, reject) {
        if (ids.length == 0) {
            reject();
        }
        Promise.all(ids.map(function (id) {
            return getResultHTML(id);
        })).then(function(resultHTMLArray) {
            resolve(resultHTMLArray);
        });
    });
}

function getSearchResultIds(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var ids = [];
                    var idNodes = xhr.responseXML.getElementsByTagName('ItemID');
                    for(i = 0; i < idNodes.length; i++) {
                        ids.push(idNodes[i].childNodes[0].nodeValue);
                    }
                    resolve(ids);
                } else {
                    reject();
                }
            }
        };
        xhr.send(null);
    });
}

function getSerachURL(searchWord, max_result_words) {
    var getUrl = 'http://public.dejizo.jp/NetDicV09.asmx/SearchDicItemLite';
    var params = 'Dic=EJdict&' +
                 'Word=' + searchWord +
                 '&Scope=HEADWORD' +
                 '&Match=EXACT' +
                 '&Merge=AND' +
                 '&Prof=XHTML' +
                 '&PageSize=' + max_result_words +
                 '&PageIndex=0';
    return getUrl + '?' + params;
}

function lookupWord() {
    // Cancel the form submit
    event.preventDefault();
    resultDisplay.innerHTML = '';
    searchWord = encodeURIComponent(document.getElementById('searchWordForm').value);
    var searchUrl = getSerachURL(searchWord, MAX_RESULT_WORDS);

    getSearchResultIds(searchUrl)
        .then(getResultHTMLArrayFromIds)
        .then(showResultHTMLArray, function(){
            resultDisplay.innerHTML += searchWord + " に一致する情報は見つかりませんでした.";
     });
}

window.addEventListener('load', function(event) {
    resultDisplay = document.getElementById('resultDisplay');
    document.getElementById('lookup').addEventListener('submit', lookupWord);
});
