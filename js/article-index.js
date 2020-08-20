document.addEventListener('DOMContentLoaded', function () {
  var contentsList = document.getElementById('articleIndex'); // 目次を追加する先(table of contents)
  var div = document.createElement('div'); // 作成する目次のコンテナ要素

  // .entry-content配下のh2、h3要素を全て取得する
  var matches = document.querySelectorAll('article h3, article h4');

  h4Count = 0;
  // 取得した見出しタグ要素の数だけ以下の操作を繰り返す
  matches.forEach(function (value, i) {
    // 見出しタグ要素のidを取得し空の場合は内容をidにする
    var id = value.id;
    if(id === '') {
      id = value.textContent.replace(/ /g, '').replace(/\./g, '');
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
      // 目次の色変える
      a.setAttribute("correnspondBox", ("articleBox" + String(h4Count)))

      li.appendChild(a)
      ul.appendChild(li);

      // 最後の<li>の中に要素を追加する
      lastLi.appendChild(ul);
      h4Count++;
    }
  });

  // 最後に画面にレンダリング
  contentsList.appendChild(div);

  // 目次の色変える
  let matches2 = document.querySelectorAll('.box');
  matchCount = 0;
  matches2.forEach(function (value, i) {
    var id2 = "articleBox" + String(matchCount);
    value.id = id2;
    matchCount++;
  });
});

var $window = $(window), //ウィンドウを指定
$articleIndex = $("#articleIndex"),
articleIndexTop = $articleIndex.offset().top; //#contentの位置を取得

$window.on("scroll", function () {
  if ($window.scrollTop() > articleIndexTop) {
    $articleIndex.addClass("fixed");
  }
  else {
    $articleIndex.removeClass("fixed");
  }
});

// 今回の交差を監視する要素
const boxes = document.querySelectorAll(".box");

const options = {
  root: null, // 今回はビューポートをルート要素とする
  rootMargin: "-50% 0px", // ビューポートの中心を判定基準にする
  threshold: 0 // 閾値は0
};
const observer = new IntersectionObserver(doWhenIntersect, options);
// それぞれのboxを監視する
boxes.forEach(box => {
  observer.observe(box);
});

/**
 * 交差したときに呼び出す関数
 * @param entries
 */
function doWhenIntersect(entries) {
  // 交差検知をしたもののなかで、isIntersectingがtrueのDOMを色を変える関数に渡す
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      activateIndex(entry.target);
    }
  });
}

/**
 * 目次の色を変える関数
 * @param element
 */
function activateIndex(element) {
  // すでにアクティブになっている目次を選択
  const currentActiveIndex = document.querySelector("#articleIndex .inView");
  // すでにアクティブになっているものが0個の時（=null）以外は、activeクラスを除去
  if (currentActiveIndex !== null) {
    currentActiveIndex.classList.remove("inView");
  }
  // 引数で渡されたDOMが飛び先のaタグを選択し、activeクラスを付与
  const newActiveIndex = document.querySelector(`a[correnspondbox='${element.id}']`);
  newActiveIndex.classList.add("inView");
}

$(function(){
  $('a[href^="#"]').click(function(){
    var speed = 500;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    if (target.prop("tagName") === 'H3') position -= 20;
    else position -= 10;
    $("html, body").animate({scrollTop:position}, speed, "swing");
    return false;
  });
});