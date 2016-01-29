(function(window, document) {
'use strict';

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



}(window, document));
