document.addEventListener('DOMContentLoaded', function () {
  var contentsList = document.getElementById('articleIndex'); // 目次を追加する先(table of contents)
  var div = document.createElement('div'); // 作成する目次のコンテナ要素

  // .entry-content配下のh2、h3要素を全て取得する
  var matches = document.querySelectorAll('article h3, article h4');

  // 取得した見出しタグ要素の数だけ以下の操作を繰り返す
  matches.forEach(function (value, i) {
    // 見出しタグ要素のidを取得し空の場合は内容をidにする
    var id = value.id;
    if(id === '') {
      id = value.textContent;
      value.id = id;
    }

    if(value.tagName === 'H3') {
      var ul = document.createElement('ul');
      var li = document.createElement('li');
      var a = document.createElement('a');

      // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
      a.innerHTML = value.textContent;
      a.href = '#' + value.id;
      li.appendChild(a)
      ul.appendChild(li);

      // コンテナ要素である<div>の中に要素を追加する
      div.appendChild(ul);
    }

    if(value.tagName === 'H4') {
      var ul = document.createElement('ul');
      var li = document.createElement('li');
      var a = document.createElement('a');

      // コンテナ要素である<div>の中から最後の<li>を取得する。
      var lastUl = div.lastElementChild;
      var lastLi = lastUl.lastElementChild;

      // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
      a.innerHTML = value.textContent;
      a.href = '#' + value.id;
      li.appendChild(a)
      ul.appendChild(li);

      // 最後の<li>の中に要素を追加する
      lastLi.appendChild(ul);
    }
  });

  // 最後に画面にレンダリング
  contentsList.appendChild(div);
});