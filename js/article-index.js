const param = {};
const ShuffledID = [];
let language = "";
const SwitchToJaData = /D-04|D-18|E-0[7-9]|E-1[0-7]/;

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

/********** 指定位置にcommon.htmlからheaderを読み込む **********/

const placeCommonParts = new Promise ((resolve, reject) => {
  let xhr = new XMLHttpRequest(),
      method = "GET",
      url = "/common.html";
  let box = document.getElementById("common-header");

  xhr.responseType = "document";
  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      let restxt = xhr.responseXML;
      let int = restxt.getElementsByTagName("header")[0];
      box.outerHTML = int.outerHTML;

      const script = document.createElement('script')
      script.src = '/js/common-header.js'
      document.head.appendChild(script)
    }
  }

  xhr.send();
  resolve();
});

/********** JSON読み込み **********/

const getJSON = placeCommonParts.then(() => {
  /* URLパラメータを連想配列に格納 */
  const text = location.search.slice(1).split(/[&|=]/);
  for(let i = 0; i < text.length; i = i + 2) {
    param[text[i]] = text[i + 1];
  }
  if(location.hash) param.anchor = location.hash;

  /* 表示すべき企画データを抽出 */
  if(!param.page) param.page = 1;

  return new Promise ((resolve) => {
    let xhr = new XMLHttpRequest(),
        method = "GET",
        url = "/data/eventData.json";

    if(storageAvailable('localStorage')) if(localStorage.getItem("lang")) language = localStorage.getItem("lang");
    else language = "ja"
    if(language == "en") url = "/data/eventData_en.json";
    if(param.id.match(SwitchToJaData)) {
      url = "/data/eventData.json";
      //showModal();
    }

    xhr.responseType = "json";
    xhr.open(method, url, true);
    xhr.onreadystatechange = () => {
      if(xhr.readyState == 4 && xhr.status == 200) {
        resolve(xhr.response);
      }
    }
    xhr.send();
  });
});

/********** 読み込んだJSONデータをセット **********/

const placeData = getJSON.then((obj) => {
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

  $title.insertAdjacentHTML("afterbegin", `<span class = "type-${eventData["eventType"]}-light">${eventData["eventType"].charAt(0).toUpperCase() + eventData["eventType"].substring(1)}</span><h1>${eventData["eventName"]}</h1><p>${eventData["pamphDesc"]}</p>`);
  $barSpan.innerText = eventData["eventName"];

  if(eventData["age"] == "child") $info.insertAdjacentHTML("afterbegin", "<span class = 'target'>子ども向け</span>");
  else if(eventData["age"] == "student") $info.insertAdjacentHTML("afterbegin", "<span class = 'target'>受験生向け</span>");
  else $info.firstElementChild.classList.add("first-span");

  /* データがあればHTMLを生成し挿入 */
  if(eventData["mainMovie"]) placeMovie(eventData["mainMovie"]);
  if(eventData["youtubeLive"]) placeLive(eventData["youtubeLive"]);
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
  placeOGP(eventData);
  //placeShareLink();

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

  if(document.querySelector(".youtube-live")) liveInit();

  barEvent();
  quizEvent();
  indexEvent();
  morebuttonEvent(obj);
  languageEvent();
  intersectEvent();
  linkClickEvent();

  copyEvent();

  const $liveIframe = document.querySelectorAll(".youtube-live iframe");
  if($liveIframe) liveEvent();

  setTimeout(() => {
    /* アンカがあればその位置までスクロール */
    if(param.anchor) {
      const target = document.getElementById(param.anchor.substring(1));console.log(target.getBoundingClientRect());
      var elemTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: elemTop,
        behavior: 'smooth'
      });
    }
  }, 100);

});




/********** HTMLを生成・挿入する関数 **********/

const placeMovie = (movieData) => {
  const $main = document.getElementsByTagName("main")[0];

  $main.insertAdjacentHTML("beforebegin",
    `<div class = "iframe-wrapper">
      <iframe src="https://www.youtube.com/embed/${movieData}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>`);
}

const placeLive = (liveData) => {
  const $main = document.getElementsByTagName("main")[0];
  const li = [], iframe = [];
  const date = new Date();
  const time = Math.floor(date.getTime() / 1000);
  let flg = true;

  for(const data of liveData) {
    let Class = "", text = "";

    if(data.timestampStart < time) {
      Class = "done";
      text = "配信済み";
      if(language == "en") text = "Streamed live";
    } else if(data.timestampStart >= time && data.timestampEnd <= time) {
      Class = "on-air active";
      text = "配信中";
      if(language == "en") text = "Live";
      flg = false;
    } else {
      Class = "scheduled";
      text = "配信予定";
      if(language == "en") text = "Scheduled";
      if(flg) {
        Class += " active";
        flg = false;
      }
    }

    /* 全て配信済みなら最後の配信を表示させる */
    if(data == liveData[liveData.length - 1] && flg) Class += " active";
    let day = "";
    if(language == "ja") day = `${data.day}<span>日</span>`;
    else day = `${data.day}, `;

    iframe.push(`<iframe src="https://www.youtube.com/embed/${data.youtubeID}?enablejsapi=1" id = "iframe-${data.youtubeID}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
    li.push(`<li class = "${Class}" id = "${data.youtubeID}"><div>${text}</div><div>${day}${data.start.slice(0, 3)}<span>${data.start.slice(3)}</span> ~ ${data.end.slice(0, 3)}<span>${data.end.slice(3)}</span></div></li>`)
  }

  $main.insertAdjacentHTML("beforebegin",
    `<div class = "youtube-live">
      <div class = "iframe-wrapper">${iframe.join("")}</div>
      <div class = "iframe-changer">
        <span class = "left"></span>
        <div class = "time-line">
          <ul>${li.join("")}</ul>
        </div>
        <span class = "right"></span>
      </div>
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

  if(h2) index.push(`<li ${h2Class}><a href = "${generateURL(param.id, h2Page, URLEscape(h2))}"><span>${h2}</span></a><ul>${li.join("")}</ul></li>`);
  $index.insertAdjacentHTML("beforeend", `<ul>${index.join("")}</ul>`);

  li.length = 0;
  /* ページネーション */
  if(pageCount > 1) {
    for(let i = 1; i <= pageCount; i++) {
      let Class = "";
      if(i == param.page) Class = "class = 'current'";
      if(i == 1) li.push(`<li ${Class}><a href = "/event/?id=${param["id"]}">${i}</a></li>`);
      else li.push(`<li ${Class}><a href = "/event/?id=${param["id"]}&page=${i}">${i}</a></li>`);
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
    url.push(`<a class = "day2" href = "${returnZoomURL(data.zoom, cnt)}">8<span>日</span>${day2[i]}:<span>${day2[i+1]}</span> ~ ${day2[i+2]}:<span>${day2[i+3]}</span></a>`);
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
  if(!data) return "";
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

const placeOGP = (data) => {
  const $head = document.getElementsByTagName("head")[0];

  const text = `
    <meta property = "og:url" content = "https://rikoten.com${generateURL(param.id, param.page)}" />
    <meta property = "og:title" content = "${data.eventName}" />
    <meta property = "og:description" content = "${data.pamphDesc.replace(/\n/g, "")}" />
  `

  $head.insertAdjacentHTML("beforeend", text);
}

const placeShareLink = () => {
  const $a = document.querySelectorAll(".share a");

  $a[0].href = `https://twiter.com/share?url=https://rikoten.com${generateURL(param.id)}`;
  $a[1].href = `http://www.facebook.com/share.php?u=https://rikoten.com${generateURL(param.id)}`;
  $a[2].href = `https://social-plugins.line.me/lineit/share?url=http://rikoten.com${generateURL(param.id)}`;
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


/********** 初期化する関数 **********/

const liveInit = () => {
  const $active = document.querySelector(".youtube-live .active");
  const $iframe = document.getElementById(`iframe-${$active.id}`);
  const $scrollBtn = document.querySelectorAll(".youtube-live .left, .youtube-live .right");
  const $timeLine = document.querySelector(".youtube-live .time-line");

  $iframe.classList.add("visible");

  $scrollBtn[0].addEventListener("click", () => {
    $timeLine.scrollLeft -= 100;
  });

  $scrollBtn[1].addEventListener("click", () => {
    $timeLine.scrollLeft += 100;
  });
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

const languageEvent = () => {
  const $fieldset = document.querySelector("#sticky-header fieldset");
  if(storageAvailable('localStorage') && localStorage.getItem("lang")) {
    if(localStorage.getItem("lang") == "en") {
      document.getElementById("en").checked = true;

      document.querySelector(".bar .thumbs-up").innerText = "Like!";
      document.querySelector(".bar .pin").innerText = "Add to Favourites";
      document.querySelector(".share p").innerText = "Share!";
      document.querySelector(".group-desc h2").innerText = "Group Introduction";
      document.querySelector("nav h4").innerText = "Index";
      document.querySelector("aside h2").innerText = "Other Events";
      document.querySelector("aside button").innerText = "more";
      const $share = document.querySelectorAll(".share span");
      const text = ["tweet", "share", "send", "link"];
      for(let i = 0; i < $share.length; i++) {
        $share[i].innerText = text[i];
      }

      const $zoom = document.querySelector("section.zoom h2");
      const $quiz = document.querySelector("section.quiz h2");
      const $file = document.querySelector("section.file h2");
      if($zoom) $zoom.innerText = "Zoom";
      if($quiz) $quiz.innerText = "Quiz";
      if($file) $file.innerText = "File";

      const $target = document.querySelector(".supplementary-info .target");
      if($target) {
        if($target.innerText == "子ども向け") $target.innerText = "for kids";
        else $target.innerText = "for exam candidates";
      }
    }
  }


  $fieldset.onchange = function(){
    const language = document.querySelector("#sticky-header :checked").value;

    if(language == "en") {
      if (storageAvailable('localStorage')) {
        localStorage.setItem('lang', "en");
      }
    } else {
      if (storageAvailable('localStorage')) {
        localStorage.setItem('lang', "ja");
      }
    }

    location.reload();
  }
}

const intersectEvent = () => {
  const h = document.querySelectorAll('h2, h3');
  const options = {
    root: null,
    rootMargin: "15% 0px -85%",
    threshold: 0
  };
  const observer = new IntersectionObserver(intersect, options);

  h.forEach((h) => {
    observer.observe(h);
  });
}

const intersect = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      activateIndex(entry.target);
    }
  });
}

const activateIndex = (elem) => {
  const $inView = document.querySelector("#index .in-view");
  const newActiveIndex = document.querySelector(`a[href='${generateURL(param.id, param.page, elem.id)}']`);

  if($inView) $inView.classList.remove("in-view");
  if(newActiveIndex) newActiveIndex.parentNode.classList.add("in-view");
}

const linkClickEvent = () => {
  const $a = document.querySelectorAll('#index a');

  for(const a of $a) {
    a.addEventListener("click", (event) => {
      const id = a.href.split("#")[1];
      const target = document.getElementById(id);
      if(target) {
        event.preventDefault();
        const targetPosition = window.pageYOffset + target.getBoundingClientRect().top - 100;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
}

const copyEvent = () => {
  const linkButton = document.querySelector(".share .link-button");
  const link = "https://rikoten.com" + generateURL(param.id);

  linkButton.addEventListener("click", (e) => {
    const temp = document.createElement('div');
    temp.appendChild(document.createElement('pre')).textContent = link;
    let s = temp.style;
    s.position = 'fixed';
    s.left = '-100%';
    document.body.appendChild(temp);
    document.getSelection().selectAllChildren(temp);
    const result = document.execCommand('copy');
    document.body.removeChild(temp);
  })
}

const liveEvent = () => {
  const $li = document.querySelectorAll(".youtube-live li");

  for(const li of $li) {
    li.addEventListener("click", () => {
      const $target = document.getElementById(`iframe-${li.id}`);
      const $visible = document.querySelector(".youtube-live .visible");
      const $active = document.querySelector(".iframe-changer .active");

      if($visible) {
        /* 再生されていたら強制的に停止 */
        $visible.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
        $visible.classList.remove("visible");
      }
      if($active) $active.classList.remove("active");
      $target.classList.add("visible");
      li.classList.add("active");
    });
  }
}

/********** URL関連 **********/

const URLEscape = (id) => {
  let replace = id.replace(/ |　/g, "-");
  return encodeURIComponent(replace);
}

const generateURL = (id, page, anchor) => {
  let p = "", a = "";

  if(page && page > 1) p = `&page=${page}`;
  if(anchor) a = `#${anchor}`;
  return "/event/?id=" + id + p + a;
}
