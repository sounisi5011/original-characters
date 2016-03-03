(function(window, document) {
'use strict';
if (window.addEventListener) {

/**
 * ページ内リンクを移動したら、リンク先の見出しをタイトルに表示する
 */
(function() {
  var title = document.title;
  var oldUrlHash = location.hash;
  var isHashchangeEventSupported = false;
  var titleChangeListener = function() {
    var id = location.hash.replace(/^#?/, '');
    var linkElem = document.getElementById(id);
    document.title = title + (linkElem ? ' #' + linkElem.textContent.replace(/\s+/, ' ').trim() : '');
  };
  var hashchangeListener = function() {
    titleChangeListener();
    isHashchangeEventSupported = true;
  };
  var setTimeoutListener = function() {
    var newUrlHash = location.hash;
    if (oldUrlHash !== newUrlHash) {
      hashchangeListener();
      oldUrlHash = newUrlHash;
    }
    if (!isHashchangeEventSupported) {
      window.setTimeout(setTimeoutListener, 50);
    }
  };

  window.addEventListener('hashchange', hashchangeListener, false);
  setTimeoutListener();
  titleChangeListener();
}());

/**
 * ruby要素内のrp要素に含まれるテキストを選択可能にする
 */
(function() {
  var moldElem = document.createElement('span');

  var isSupportRubyElem = document.querySelector('ruby>rp').offsetHeight === 0;

  /**
   * @see https://developer.mozilla.org/ja/docs/Web/API/NonDocumentTypeChildNode/previousElementSibling#Polyfill_for_Internet_Explorer_8
   */
  var getPrevElem = function(elem) {
    var prevNode;
    if ('previousElementSibling' in elem) {
      return elem.previousElementSibling;
    } else {
      prevNode = elem;
      while ((prevNode = prevNode.previousSibling) && prevNode.nodeType !== 1) {}
      return prevNode;
    }
  };

  /**
   * @see https://developer.mozilla.org/ja/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling#Polyfill_for_Internet_Explorer_8
   */
  var getNextElem = function(elem) {
    var nextNode;
    if ('nextElementSibling' in elem) {
      return elem.nextElementSibling;
    } else {
      nextNode = elem;
      while ((nextNode = nextNode.nextSibling) && nextNode.nodeType !== 1) {}
      return nextNode;
    }
  };

  var getRtElem = function(elem) {
    return (elem && elem.nodeName.toUpperCase() === 'RT') ? elem : null;
  };

  moldElem.setAttribute('role', 'presentation');
  moldElem.className = 'js_rp_invisible';

  if (isSupportRubyElem) {
    Array.prototype.map.call(
      document.querySelectorAll('ruby>rp'),
      function(rpElem) {
        var rpTextElem = moldElem.cloneNode(false);
        var prevElem = getRtElem(getPrevElem(rpElem));
        var nextElem = getRtElem(getNextElem(rpElem));

        rpTextElem.textContent = rpElem.textContent;

        return {
          type: (
            prevElem ? 1 :
            nextElem ? 2 :
            0
          ),
          target: (prevElem || nextElem || rpElem),
          add: rpTextElem
        };
      }
    )
      .forEach(function(item) {
        var type = item.type;
        var targetElem = item.target;
        var addElem = item.add;

        if (type === 1) {
          targetElem.appendChild(addElem);
        } else if (type === 2) {
          targetElem.insertBefore(addElem, targetElem.firstChild);
        } else {
          targetElem.parentNode.insertBefore(addElem, targetElem.nextSibling);
        }
      });
  }

  moldElem = null;
}());



}
}(window, document));
