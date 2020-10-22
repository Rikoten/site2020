//const { resolve } = require("dns");

document.addEventListener('DOMContentLoaded', function () {
  let contentsList = document.getElementById('index'); // 目次を追加する先(table of contents)
  let navPagination = document.getElementById('nav-pagination');
  let div = document.createElement('div'); // 作成する目次のコンテナ要素

  // .entry-content配下のh2、h3要素を全て取得する
  let matches = document.querySelectorAll('article h2, article h3');

  h4Count = 0;
  // 取得した見出しタグ要素の数だけ以下の操作を繰り返す
  matches.forEach(function (value, i) {
    // 見出しタグ要素のidを取得し空の場合は内容をidにする
    let id = value.id;
    if(id === '') {
      id = value.textContent.replace(/ /g, '').replace(/\./g, '');
      value.id = id;
    }

    if(value.tagName === 'H2') {
      let ul = document.createElement('ul');
      let li = document.createElement('li');
      let a = document.createElement('a');

      // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
      a.innerHTML = value.textContent;
      a.href = '#' + value.id;
      li.appendChild(a)
      ul.appendChild(li);

      // コンテナ要素である<div>の中に要素を追加する
      div.appendChild(ul);
    }

    if(value.tagName === 'H3') {
      let ul = document.createElement('ul');
      let li = document.createElement('li');
      let a = document.createElement('a');

      // コンテナ要素である<div>の中から最後の<li>を取得する。
      let lastUl = div.lastElementChild;
      let lastLi = lastUl.lastElementChild;

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
  contentsList.insertBefore(div, navPagination);

  // 目次の色変える
  let matches2 = document.querySelectorAll('.box');
  matchCount = 0;
  matches2.forEach(function (value, i) {
    let id2 = "articleBox" + String(matchCount);
    value.id = id2;
    matchCount++;
  });


  

});

let $window = $(window), //ウィンドウを指定
$articleIndex = $("#index"),
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
  const currentActiveIndex = document.querySelector("#index .inView");
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
    let speed = 500;
    let href= $(this).attr("href");
    let target = $(href == "#" || href == "" ? 'html' : href);
    let position = target.offset().top;
    if (target.prop("tagName") === 'H3') position -= 20;
    else position -= 10;
    $("html, body").animate({scrollTop:position}, speed, "swing");
    return false;
  });
});


/* 指定位置にcommon.htmlからheaderおよびbottom-navを読み込む */

let xhr = new XMLHttpRequest(),
    method = "GET",
    url = "/common.html";
let box = document.getElementById("common-header"),
    box2 = document.getElementById("bottom-nav");

xhr.responseType = "document";
xhr.open(method, url, true);
xhr.onreadystatechange = () => {
  if(xhr.readyState === 4 && xhr.status === 200) {
    let restxt = xhr.responseXML;
    let int = restxt.getElementsByTagName("header")[0],
        int2 = restxt.getElementsByTagName("nav")[0];
    box.outerHTML = int.outerHTML;
    box2.outerHTML = int2.outerHTML;
  }
}

xhr.send();

/* ボトムナビゲーション */

window.onload = () => {
  const foldButton = document.querySelector("#bottom-nav .fold-button");

  foldButton.addEventListener('click', () => {
    const bottomNav = document.getElementById("bottom-nav");
    bottomNav.classList.toggle("close");
  });

  const navButton = document.querySelectorAll("#bottom-nav li");
  const boardWrapper = document.querySelector("#bottom-nav .board-wrapper");

  for(let i = 0; i < navButton.length; i++) {
    navButton[i].addEventListener('click', ()=> {
      const left = navButton[i].getBoundingClientRect().left;
      const activeBar = document.querySelector(".active-bar");

      boardWrapper.style.transform = `translateX(-${100 * i}vw)`;
      if(boardWrapper.classList.contains("open")) {
        let animate = activeBar.animate([
          { left: `${left}px` }
        ], {
          duration: 200,
          easing: "ease-out"
        });
        animate.addEventListener('finish', () => {
          activeBar.style.left = `${left}px`;
        });
      } else {
        boardWrapper.classList.add("open");
        activeBar.style.left = `${left}px`;
        activeBar.style.display = "block";
      }
    });
  }
}


/* JSON読み込み */

const getJSON = new Promise ((resolve, reject) => {
  let data = null;
  let xhr = new XMLHttpRequest(),
      method = "GET",
      url = "/data/eventData-test.json";

  xhr.responseType = "json";
  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status == 200) {
      resolve(xhr.response);
    }
  }
  xhr.send();
});

/* 読み込んだJSONデータをセット */

const setData = getJSON.then((obj) => {
  const article = document.querySelector("article section.article");
  const quiz = document.querySelector("article section.quiz");
  let html = [];

  /* URLパラメータを連想配列に格納 */
  const param = {}
  const text = location.search.slice(1).split(/[&|=]/);
  for(let i = 0; i < text.length; i = i + 2) {
    param[text[i]] = text[i + 1];
  }

  const eventID = param["id"];
  let eventData = null;
  for(const data of obj) {
    if(eventID == data["eventID"]) {
      eventData = data;
      break;
    }
  }

  /* 記事データ */
  for(const data of eventData["articleData"]) {
    html.push(data["code"]);
  }
  article.insertAdjacentHTML("beforeend", html.join(""));

  /* クイズ */
  for(const data of eventData["quiz"]) {
    const section = document.createElement("section");
    const h4 = document.createElement("h4");
    const ul = document.createElement("ul");
    const div = document.createElement("div");
    const span1 = document.createElement("span");
    const span2 = document.createElement("span");
    const p = document.createElement("p");

    h4.innerText = data["q"];
    span1.innerText = "正解は";
    p.innerText = data["acomment"];
    for(const q of data["choice"]) {
      const li = document.createElement("li");
      li.innerText = q["sentence"];
      if(q["correct"]) {
        span2.innerText = q["sentence"];
        li.classList.add("correct-answer");
      }
      ul.appendChild(li);
    }
    div.appendChild(span1);
    div.appendChild(span2);
    div.appendChild(p);
    section.appendChild(h4);
    section.appendChild(ul);
    section.appendChild(div);

    quiz.appendChild(section);
  }

  /* 団体説明 */
});

/* イベントリスナの設定 */

setData.then(() => {
  /* クイズ */
  const options = document.querySelectorAll('.quiz li');
      
  for(const option of options) {
    option.addEventListener('click', () => {
      const commentary = option.parentNode.nextElementSibling;

      if(!commentary.classList.contains('commentary-open')) {
        if(option.classList.contains('correct-answer')) {
          option.classList.add('correct');
        } else {
          option.classList.add('incorrect');
        }
        commentary.classList.add('commentary-open');
        commentary.style.height = commentary.scrollHeight + 40 + 'px';
        commentary.previousElementSibling.classList.add('open');
        setTimeout(() => {
          commentary.style.height = 'auto';
        }, 800);
      }
    });
  }
});