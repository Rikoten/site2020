//const { resolve } = require("dns");

const param = {};
const ShuffledID = [];

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
  /*
  const foldButton = document.querySelector("#bottom-nav .fold-button");

  foldButton.addEventListener('click', () => {
    const bottomNav = document.getElementById("bottom-nav");
    bottomNav.classList.toggle("close");
  });
  */

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


/********** JSON読み込み **********/

const getJSON = new Promise ((resolve, reject) => {
  let xhr = new XMLHttpRequest(),
      method = "GET",
      url = "/data/eventData.json";

  xhr.responseType = "json";
  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4 && xhr.status == 200) {
      resolve(xhr.response);
    }
  }
  xhr.send();
});

/********** 読み込んだJSONデータをセット **********/

const placeData = getJSON.then((obj) => {
  /* URLパラメータを連想配列に格納 */
  const text = location.search.slice(1).split(/[&|=]/);
  for(let i = 0; i < text.length; i = i + 2) {
    param[text[i]] = text[i + 1];
  }

  /* 表示すべき企画データを抽出 */
  if(!param["page"]) param["page"] = 1;

  let eventData = null;
  for(const data of obj) {
    if(param["id"] == data["eventID"]) {
      eventData = data;
      break;
    }
  }

  /* 企画名 */
  const $title = document.querySelector("header .title-wrapper");
  const $barSpan = document.querySelector("article .bar span");
  const $info = document.querySelector("header .title-wrapper .supplementary-info");
  
  $title.insertAdjacentHTML("afterbegin", `<span class = "type-${eventData["eventType"]}-light">${eventData["eventType"]}</span><h1>${eventData["eventName"]}</h1><p>${eventData["pamphDesc"]}</p>`);
  $barSpan.innerText = eventData["eventName"];
  
  if(eventData["age"] == "child") $info.insertAdjacentHTML("afterbegin", "<span class = 'target'>子ども向け</span>");
  else if(eventData["age"] == "student") $info.insertAdjacentHTML("afterbegin", "<span class = 'target'>高校生向け</span>");
  else $info.firstElementChild.classList.add("first-span");

  /* データがあればHTMLを生成し挿入 */
  if(eventData["mainMovie"]) placeMovie(eventData["mainMovie"]);
  if(eventData["articleData"]) placeArticle(eventData["articleData"]);
  if(eventData["zoomDesc"]) placeZoom(eventData);
  if(eventData["quiz"]) placeQuiz(eventData["quiz"]);
  if(eventData["dl"]) placeFile(eventData["dl"]);

  /* 団体紹介 */
  const $groupDesc = document.querySelector("main .group-desc");
  const html = [];
  const link = [];

  if(eventData["link"]) {
    for(const data of eventData["link"]) {
      link.push(`<a class = "link-web" href = "${data.url}">${data.name}</a>`);
    }
  }
  
  if(eventData["twitter"]) link.push(`<a class = "link-twitter" href = "https://twitter.com/${eventData["twitter"]}">Twitter</a>`);
  if(eventData["facebook"]) link.push(`<a class = "link-facebook" href = "${eventData["facebook"]}">Facebook</a>`);
  if(eventData["instagram"]) link.push(`<a class = "link-instagram" href = "https://www.instagram.com/${eventData["instagram"]}">Instagram</a>`);

  html.push(`<h3>${eventData["groupName"]}</h3><p>${eventData["groupDesc"]}</p><div class = "group-link">${link.join("")}</div>`);
  $groupDesc.insertAdjacentHTML("beforeend", html);

  placeOtherEvent(obj);
  
  return new Promise((resolve, reject) => {
    resolve(obj);
  })
});

/********** イベントリスナの設定 **********/

placeData.then((obj) => {
  if (storageAvailable('localStorage')) {
    if(localStorage.getItem("good") && localStorage.getItem("good") == "true") {
      const goodButton = document.querySelectorAll("article .bar button")[0];
      goodButton.classList.add("thumbs-up-clicked");
    }
  }

  barEvent();
  quizEvent();
  indexEvent();
  morebuttonEvent(obj);
});


/********** HTMLを生成・挿入する関数 **********/

const placeMovie = (movieData) => {
  const $main = document.getElementsByTagName("main")[0];

  $main.insertAdjacentHTML("beforebegin",
    `<div class = "iframe-wrapper">
      <iframe src="https://www.youtube.com/embed/${movieData}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>`);
}

const placeArticle = (articleData) => {
  const $article = document.querySelector("article section.article");
  const $index = document.getElementById("index");
  const html = [], index = [], li = [];
  let pageCount = 1;
  let isFirst = true;
  let h2 = null;
  let Class = "";
  let h2Class = "";
  let h2Page = 0;

  for(const [i, data] of articleData.entries()) {
    Class = "";

    /* 記事本文を生成 */
    if(data.tag == "pagination") pageCount++;
    else if(pageCount == param["page"]) {
      if(data.tag != "p") html.push(`<${data.tag} id = "${URLEscape(data.code)}">${data.code}</${data.tag}>`);
      else html.push(`<${data.tag}>${data.code}</${data.tag}>`);

      Class = "class = 'display'";
    }

    /* 目次を生成 */
    if(articleData[i + 2] && articleData[i + 2].tag == "pagination") {
      if(pageCount == param.page) Class = "class = 'display page-end end-counter'";
      else if(pageCount + 1 == param.page) Class = "class = 'page-end start-counter'";
      else Class = "class = 'page-end'";
    }

    if(data.tag == "h2") {
      if(li.length != 0) index.push(`<li ${h2Class}><a href = "${generateURL(param.id, h2Page, URLEscape(h2))}"><span>${h2}</span></a><ul>${li.join("")}</ul></li>`);
      else if(!isFirst) index.push(`<li ${h2Class}><a href = "${generateURL(param.id, h2Page, URLEscape(h2))}"><span>${h2}</span></a></li>`);
      
      li.length = 0;
      isFirst = false;
      h2 = data.code;
      h2Class = Class;
      h2Page = pageCount;
    } else if(data.tag == "h3") {
      li.push(`<li ${Class}><a href = "${generateURL(param.id, pageCount, URLEscape(data.code))}"><span>${data.code}</span></a></li>`);
    }
  }

  index.push(`<li ${h2Class}><a href = "${generateURL(param.id, h2Page, URLEscape(h2))}"><span>${h2}</span></a><ul>${li.join("")}</ul></li>`);
  $index.insertAdjacentHTML("beforeend", `<ul>${index.join("")}</ul>`);

  li.length = 0;
  /* ページネーション */
  if(pageCount > 1) {
    for(let i = 1; i <= pageCount; i++) {
      if(i == 1) li.push(`<li><a href = "/event/?id=${param["id"]}">${i}</a></li>`);
      else li.push(`<li><a href = "/event/?id=${param["id"]}&page=${i}">${i}</a></li>`);
    }
    html.push(`<ul class = "pagination">${li.join("")}</ul>`);
  }
  $article.insertAdjacentHTML("beforeend", html.join(""));
}

const placeZoom = (data) => {
  let day1 = [], day2 = [], cnt = 0;
  const url = [], html = [], p = [];
  const $article = document.getElementsByTagName("article")[0];

  if(data.zoomDesc.day1) day1 = data.zoomDesc.day1.split(/, |:|~/);
  if(data.zoomDesc.day2) day2 = data.zoomDesc.day2.split(/, |:|~/);
  
  for(let i = 0; i < day1.length; i = i + 4) {
    url.push(`<a class = "day1" href = "${returnZoomURL(data.zoom, cnt)}">7<span>日</span>${day1[i]}:<span>${day1[i+1]}</span> ~ ${day1[i+2]}:<span>${day1[i+3]}</span></a>`);
    cnt++;
  }
  for(let i = 0; i < day2.length; i = i + 4) {
    url.push(`<a class = "day2" href = "${returnZoomURL(data.zoom, cnt)}">8<span>日</span>${day1[i]}:<span>${day1[i+1]}</span> ~ ${day1[i+2]}:<span>${day1[i+3]}</span></a>`);
    cnt++;
  }

  if(data.zoomDesc.remark) p.push(`<p>${data.zoomDesc.desc} (${data.zoomDesc.remark})</p>`);
  else p.push(`<p>${data.zoomDesc.desc}</p>`);

  html.push(`
    <section class = "zoom">
      <h2>Zoomリンク</h2>
      <small>※ この企画はZoomで配信を行います。</small>
      ${p.join("")}${url.join("")}
    </section>
  `)

  $article.insertAdjacentHTML("beforeend", html);
}

const returnZoomURL = (data, num) => {
  if(data.length == 1) return data[0].url;
  else return data[num].url;
}

const placeQuiz = (quizData) => {
  const $article = document.getElementsByTagName("article")[0];
  const html = [];

  for(const data of quizData) {
    const choices = [];
    let answer = null;
    let cnt = 0;
    for(const q of data["choice"]) {
      if(q.correct) {
        cnt++;
        choices.push(`<li class = "correct-answer">${q.sentence}</li>`);
        answer = q.sentence;
      } else {
        choices.push(`<li>${q.sentence}</li>`);
      }
    }
    if(cnt == Object.keys(data["choice"]).length) answer = "すべて";

    html.push(`
      <section>
      <h4>${data.q}</h4>
      <ul>${choices.join("")}</ul>
      <div>
        <span>正解は</span>
        <span>${answer}</span>
        <P>${data.acomment}</P>
      </div>
    </section>`);
  }
  $article.insertAdjacentHTML("beforeend", `<section class = "quiz"><h2>クイズ</h2>${html.join("")}</section>`);
}

const placeFile = (fileData) => {
  const $article = document.getElementsByTagName("article")[0];
  const html = [];
  for(const data of fileData) {
    html.push(
      `<div class = "file-wrapper"><div>
          <p>${data.name}</p>
          <p>${data.desc}</p>
        </div>
        <a href = "${data.url}">ダウンロード</a>
      </div>`);
  }
  $article.insertAdjacentHTML("beforeend", `<section class = "file"><h2>ファイル配布</h2>${html.join("")}</section>`);
}

const placeOtherEvent = (data) => {
  const $more = document.querySelector("aside .more");

  generateShuffledID(data);
  $more.insertAdjacentHTML("beforebegin", generateEventTile(data));
}

const generateShuffledID = (data) => {
  let ID = [];
  for(i = 0; i < data.length; i++) {
    if(data[i].eventID != param.id) ID.push(i);
  }

  /* シャッフル */
  for(let i = data.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = ID[i];
    ID[i] = ID[j];
    ID[j] = tmp;
  }

  Object.assign(ShuffledID, ID.filter(Boolean));
}

const generateEventTile = (data) => {
  const $eventTile = document.querySelectorAll("aside a");
  const html = [];

  const tileNum = $eventTile.length;

  for(let i = $eventTile.length; i < $eventTile.length + 5; i++) {
    if(i == data.length - 2) {
      removeMoreButton(html);
      return "";
    }

    html.push(`
    <a href = "${generateURL(data[ShuffledID[i]].eventID)}">
      <section>
        <div class = "other-event-title">
          <h3>${data[ShuffledID[i]].eventName}</h3>
          <span class = "article-type type-${data[ShuffledID[i]].eventType}">${data[ShuffledID[i]].eventType.charAt(0).toUpperCase() + data[ShuffledID[i]].eventType.substring(1)}</span>
          <span class = "time">${data[ShuffledID[i]].requiredTime}</span>
        </div>
        <p>${data[ShuffledID[i]].pamphDesc}</p>
      </section>
    </a>
    `);
  }

  return html.join("");
}

const removeMoreButton = (html) => {
  const $aside = document.getElementsByTagName("aside")[0];
  $aside.lastElementChild.insertAdjacentHTML("beforebegin", html.join(""));
  $aside.removeChild($aside.lastElementChild);
}

/********** イベントリスナを設定する関数 **********/

const barEvent = () => {
  const barButton = document.querySelectorAll("article .bar button");
/*
  barButton[1].addEventListener("click", () => {
    if (storageAvailable('localStorage')) {
      if(!localStorage.getItem("pin")) {
        let data = null;
        data = {`${eventID}`: "true"};
        localStorage.setItem('pin', JSON.stringify(data));
        barButton[1].classList.add("pin-clicked");
      } else {
        if(localStorage.getItem("pin")[eventID] == "true") {
          const data = {eventID: "false"};
          localStorage.setItem('pin', JSON.stringify(data));
          barButton[1].classList.remove("pin-clicked");
        } else {
          const data = {eventID: "true"};
          localStorage.setItem('good', JSON.stringify(data));
          barButton[1].classList.add("pin-clicked");
        }
      }
    }
  });
*/
}

const quizEvent = () => {
  const $options = document.querySelectorAll(".quiz li");
      
  for(const option of $options) {
    option.addEventListener("click", () => {
      const commentary = option.parentNode.nextElementSibling;

      if(!commentary.classList.contains("commentary-open")) {
        if(option.classList.contains("correct-answer")) {
          option.classList.add("correct");
        } else {
          option.classList.add("incorrect");
        }
        commentary.classList.add("commentary-open");
        commentary.style.height = commentary.scrollHeight + 40 + "px";
        commentary.previousElementSibling.classList.add("open");
        setTimeout(() => {
          commentary.style.height = "auto";
        }, 800);
      }
    });
  }
}

const indexEvent = () => {
  const $a = document.querySelectorAll("#index a");

  for(const a of $a) {
    a.addEventListener("click", () => {
      const $inView = document.querySelector("#index .in-view");
      console.log("hey")

      if($inView) $inView.classList.remove("in-view");
      a.parentNode.classList.add("in-view");
    });
  }
}

const morebuttonEvent = (data) => {
  const $more = document.querySelector("aside .more");

  $more.addEventListener("click", () => {
    $more.insertAdjacentHTML("beforebegin", generateEventTile(data));
  });
}

/********** ローカルストレージが使用可能か判定 **********/

const storageAvailable = (type) => {
  let storage;
  try {
    storage = window[type];
    let x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === 'QuotaExceededError' ||
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      (storage && storage.length !== 0);
  }
}

/********** URL関連 **********/

const URLEscape = (id) => {
  let del = id.replace(/\<|\>|\(|\)|\{|\}|\[|\]|\"|\^|\`|\||\\|\'/g, "");
  let replace = del.replace(/ |　/g, "-");
  return replace;
}

const generateURL = (id, page, anchor) => {
  let p = "";
  let a = "";

  if(page && page > 1) p = `&page=${page}`;
  if(anchor) a = `#${anchor}`;
  return "/event/?id=" + id + p + a;
}