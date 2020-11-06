function loadLike(EventDataShuffled) {
  for (let i = 0; i < EventDataShuffled.length; i++) {
    let eventId = EventDataShuffled[i]["eventID"];
    let targetTile = document.getElementById(EventDataShuffled[i]["eventID"]);
    let likeCounter = targetTile.getElementsByClassName('eventThumbsUp')[0]
    let viewsCounter = targetTile.getElementsByClassName('eventView')[0]

    ;(async () => {
        const likes = await fetch('/api/like').then(res => res.json())
        const likeCount = (likes[eventId] && likes[eventId].likes) || 0

        const views = await fetch('/api/views/' + eventId).then(res => res.json())
        // console.log(views)


        likeCounter.textContent = likeCount
        viewsCounter.textContent = views.views
    })()
  }
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

const languageEvent = () => {
  const $fieldset = document.querySelector("#sticky-header fieldset");
  if(storageAvailable('localStorage') && localStorage.getItem("lang")) {
    if(localStorage.getItem("lang") == "en") {
      document.getElementById("en").checked = true;

      document.querySelector("#themeText div").innerText = "A world surrounded by magic";
      document.querySelector("#eventH3 div").innerText = "Event list";
      let queryList = document.querySelectorAll(".foot div.pagination-container > a");
      for (let i = 0; i < queryList.length; i++) {
        queryList[i].innerText = "Time table";
      }
      document.querySelectorAll(".foot div.pagination-container > a").innerHTML = "Time table<img src = '/img/timeTableArrow.svg'>";
      document.querySelector("#timetable-mb").innerText = "Time table";
      document.querySelector("#about > div:nth-child(1) > div:nth-child(1)").innerText = "About Rikoten";
      document.querySelector("#about > div:nth-child(1) > div:nth-child(2)").innerHTML = "Waseda University<br>Faculties of Science and Engineering<br>School Festival";
      document.querySelector("#about > div:nth-child(2) > div:nth-child(1)").innerText = "Theme";
      document.querySelector("#about > div:nth-child(2) > div:nth-child(2) div").innerText = "A world surrounded by magic";
      document.querySelector("#about > div:nth-child(3) > div:nth-child(1)").innerText = "Message";
      document.querySelector("#about > div:nth-child(3) > div:nth-child(2)").innerHTML = "Representative of Rikoten Executive committee<br>Shuntaro Funasaka";
      document.querySelector("#support h3").innerText = "Sponsorship";
      let queryList2 = document.querySelectorAll("div.eventChild.student div");
      for (let i = 0; i < queryList2.length; i++) {
        queryList2[i].innerText = "Examinees";
      }
      let queryList3 = document.querySelectorAll("div.eventChild.child div");
      for (let i = 0; i < queryList3.length; i++) {
        queryList3[i].innerText = "Children";
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

const placeCommonParts = new Promise ((resolve, reject) => {
  let xhr = new XMLHttpRequest(),
      method = "GET",
      url = "/common.html";
  let box = document.getElementById("common-header"),
      box2 = document.getElementById("bottom-nav"),
      box3 = document.getElementsByTagName("footer")[0];

  xhr.responseType = "document";
  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      let restxt = xhr.responseXML;
      let int = restxt.getElementsByTagName("header")[0],
          int2 = restxt.getElementsByTagName("nav")[0],
          int3 = restxt.getElementsByTagName("footer")[0];
      box.outerHTML = int.outerHTML;
      //box2.outerHTML = int2.outerHTML;
      box3.outerHTML = int3.outerHTML;

      const script = document.createElement('script')
      script.src = '/js/common-header.js'
      document.head.appendChild(script)
    }
  }

  xhr.send();
  resolve();
});

const eventLoad = placeCommonParts.then(() => {
  return new Promise (function (resolve, reject) {
    /* 企画ロード */
    let URLEventData = 'data/eventData.json';
    let lang = "ja";

    if(storageAvailable('localStorage')) {
      if(localStorage.getItem("lang")) lang = localStorage.getItem("lang");
    }
    if(lang == "en") URLEventData = "/data/eventData_en.json";

    const requestEventData = new XMLHttpRequest();
    requestEventData.open('GET', URLEventData);

    requestEventData.responseType = 'json';
    requestEventData.send();

    requestEventData.onload = function() {
      const EventData = requestEventData.response;

      // Fisher–Yates アルゴリズムでシャッフルする
      const EventDataShuffled = EventData;
      for(let i = EventDataShuffled.length - 1; i > 0; i--){
        let rand = Math.floor(Math.random() * (i + 1));
        [EventDataShuffled[i], EventDataShuffled[rand]] = [EventDataShuffled[rand], EventDataShuffled[i]];
      }

      /* ヘッダー部分 */
      const topViewEventBar = document.getElementById('topView-event-bar');
      const topViewEventBarMb = document.getElementById('topView-event-bar-mb');
      /* 企画一覧部分 */
      const tilesOnePage = 7; //1ページあたりの企画数
      let TargetContainer = {article: document.getElementById('eventArticle'), movie: document.getElementById('eventMovie'), live: document.getElementById('eventLive')};  //コンテナ
      let showedtiles = {article: 0, movie: 0, live: 0}; //表示された企画数
      let showedPages = {article: 0, movie: 0, live: 0}; //生成されたページ数

      EventDataShuffled.forEach(function(elem) {
        /* ヘッダー部分 */
        let HeaderTile = document.createElement('a');
        let eventURL = '/event/?id=' + String(elem["eventID"]);
        HeaderTile.setAttribute('href', eventURL);
        HeaderTileInner = '<div class = "topView-event-tile ' + elem["eventType"] + '"><div class = "topView-event-type-container"><div class = "topView-event-type ' + elem["eventType"] + '"></div></div><div class = "topView-event-time">' + elem["requiredTime"] + '</div><div class = "topView-event-title">' + elem["eventName"] + '</div></div>'
        HeaderTile.innerHTML = HeaderTileInner;

        HeaderTileMb = HeaderTile.cloneNode(true);

        topViewEventBar.appendChild(HeaderTile);
        topViewEventBarMb.appendChild(HeaderTileMb);

        /* 企画一覧部分 */
        let type = elem["eventType"]; //企画タイプ
        let requiredTime = "";
        if (type != "live") requiredTime = elem["requiredTime"];  //要求時間
        else {
          let date = new Date();
          let nowTimestamp = Math.floor(date.getTime() / 1000);
          if (elem["youtubeLive"]) {  //YouTube Live
            for (let i = 0; i < elem["youtubeLive"].length; i++) {
              if (elem["youtubeLive"][i]["timestampEnd"] > nowTimestamp) {
                // まだ企画が行われていない
                requiredTime = elem["youtubeLive"][i]["day"] + "日 " + elem["youtubeLive"][i]["start"] + "~";
                // requiredTime = elem["youtubeLive"][i]["day"] + "日 " + elem["youtubeLive"][i]["start"] + "～" + elem["youtubeLive"][i]["end"];
                break;
              }
            }
            if (requiredTime == "") {
              // 全企画終了
              requiredTime = "録画あり";
            }
          }
          else { //Zoom
            if (elem["zoomDesc"]["day1"]) {
              let zoomDay1 = elem["zoomDesc"]["day1"].split(', ');
              for (let i = 0; i < elem["zoomTimestamp"]["day1"].length; i++) {
                if (elem["zoomTimestamp"]["day1"][i][1] > nowTimestamp) {
                  console.log(elem["eventID"]);
                  console.log(i);
                  let zoomDay1s = zoomDay1[i].split('~');
                  requiredTime = "7日 " + zoomDay1s[0] + "~";
                  break;
                }
              }  
            }
            if (elem["zoomDesc"]["day2"]) {
              let zoomDay2 = elem["zoomDesc"]["day2"].split(', ');
              if (requiredTime == "") {
                // 1日目は終わった
                for (let i = 0; i < elem["zoomTimestamp"]["day2"].length; i++) {
                  if (elem["zoomTimestamp"]["day2"][i][1] > nowTimestamp) {
                    let zoomDay2s = zoomDay2[i].split('~');
                    requiredTime = "8日 " + zoomDay2s[0] + "~";
                    break;
                  }
                }
              }
            }
            if (requiredTime == "") {
              // 全企画終了
              requiredTime = "終了";
            }
          }
        }

        let childrenTag = ""; //子ども向けの企画タグ
        if (elem["age"] == "child") childrenTag = '<div class = "eventChild child"><div>子ども向け</div></div>';
        if (elem["age"] == "student") childrenTag = '<div class = "eventChild student"><div>受験生向け</div></div>';

        //TargetContainer[type]

        /* ページネーション管理 */
        if (showedtiles[type] % tilesOnePage == 0) {//新しいページ最初の企画
          showedPages[type]++; //ページ数

          /* ページネーションボタンの追加 */
          let newPaginationBtn = document.createElement('a');
          newPaginationBtn.setAttribute('href', '#');
          newPaginationBtn.innerText = showedPages[type];
          if (showedPages[type] == 1) newPaginationBtn.classList.add('active');
          TargetContainer[type].getElementsByClassName('pagination')[0].appendChild(newPaginationBtn); //新しいページボタンの追加

          /* 企画一覧ページの追加 */
          let newPagination = document.createElement('div');
          newPagination.classList.add('eventListPage');
          if (showedPages[type] == 1) newPagination.classList.add('active');
          TargetContainer[type].insertBefore(newPagination, TargetContainer[type].lastElementChild);
        }

        showedtiles[type]++;

        /* もっと見るボタン、5個の区切りずつで出力（PC版の仕様との干渉のため1つのボタンにできなかった） */
        if (showedtiles[type] % 5 == 1 && showedtiles[type] > 1) {
          let moreBtn = document.createElement('a');
          let href_moreBtn = "";
          if (type == "article") href_moreBtn = "#eventArticle";
          else if (type == "movie") href_moreBtn = "#eventMovie";
          else if (type == "live") href_moreBtn = "#eventLive";
          moreBtn.setAttribute('href', href_moreBtn);
          moreBtn.classList.add('more');
          moreBtn.innerText = "もっと見る";
          TargetContainer[type].lastElementChild.previousElementSibling.appendChild(moreBtn);
        }

        /* タイル追加 */
        let EventListTile = document.createElement('a');
        EventListTile.setAttribute('href', eventURL);
        let EventListTileInner = '<div class = "eventTile" id = "' + elem["eventID"] + '"><div class = "eventTitle">' + elem["eventName"] + '</div><div class = "eventTime">' + requiredTime + '</div>' + childrenTag + '<div class = "eventDesc">' + elem["pamphDesc"] + '</div><div class = "eventView"><span>0</span></div><div class = "eventThumbsUp">0</div><div class = "eventGroupName">' + elem["groupName"] + '</div><div class = "border"></div></div>';

        EventListTile.innerHTML = EventListTileInner;

        TargetContainer[type].lastElementChild.previousElementSibling.appendChild(EventListTile);
      });
      resolve(EventDataShuffled);
    }
  });
});

function loadLike(EventDataShuffled) {
  for (let i = 0; i < EventDataShuffled.length; i++) {
    let eventId = EventDataShuffled[i]["eventID"];
    let targetTile = document.getElementById(EventDataShuffled[i]["eventID"]);
    let likeCounter = targetTile.getElementsByClassName('eventThumbsUp')[0]
    let viewsCounter = targetTile.getElementsByClassName('eventView')[0]

    ;(async () => {
        const likes = await fetch('/api/like').then(res => res.json())
        const likeCount = (likes[eventId] && likes[eventId].likes) || 0

        const views = await fetch('/api/views/' + eventId).then(res => res.json())
        // console.log(views)


        likeCounter.textContent = likeCount
        viewsCounter.textContent = views.views
    })()
  }
}

/* ここからは企画データ表示後の対応が必要！ */
eventLoad.then((EventDataShuffled) => {
  languageEvent();
  loadLike(EventDataShuffled);
  /* イベント一覧のホバーアニメーション */
  const eventList = document.getElementById('eventList');
  const eventTile = Array.from( eventList.getElementsByClassName('eventTile') );
  eventTile[0].classList.add("active");
  eventTile.forEach( function(elem) {
    elem.addEventListener("mouseover", function(event) {
      let eventTileActive = Array.from( eventList.getElementsByClassName('eventTile active') );
      eventTileActive[0].classList.remove("active");
      elem.classList.add("active");
    }, false);
    /*elem.addEventListener("mouseout", function(event) {
      elem.classList.remove("active");
    }, false);*/
  });

  /* タイプ表示切替 */
  const eventTypePage = Array.from(eventList.getElementsByClassName('eventTypePage') );
  const eventTypeTab = document.getElementById('eventTypeTab');
  const eventTypeTabBtn = Array.from(eventTypeTab.querySelectorAll("a.type"));
  const eventTypeTabArrow = Array.from(eventTypeTab.getElementsByClassName('arrow'));

  /* ページネーション表示切替 */
  const eventPagination = Array.from(document.getElementsByClassName('pagination'));
  const eventListPage = Array.from(document.getElementsByClassName('eventListPage'));

  let pagenum = 0;
  let eventType = 'eventLive';

  /* タイプのタブの表示切り替え */
  eventTypeTabBtn.forEach(function(elem) {
    elem.addEventListener('click', function (e) {
      event.preventDefault();
      pagenum = 0;
      /* ボタンの動作 */
      eventTypeTabBtn.forEach(function(elem2) {
        elem2.classList.remove('active');
      });
      elem.classList.add('active');

      /* タブの動作 */
      href = elem.getAttribute('href').substr(1);
      eventType = href;
      eventTypePage.forEach(function(elem2){
        if (elem2.id == href) {
          elem2.classList.add('active');  //タブ自体をactiveに

          eventListPage.forEach(function(elem4) {
            elem4.classList.remove('active'); //全てのページを消す
          });
          elem2.getElementsByClassName('eventListPage')[0].classList.add('active');  //activeになったタブの最初のページをactiveに
          eventTile.forEach(function(elem4) {
            elem4.classList.remove('active'); //全てのタイルのホバーを取る
          });
          elem2.getElementsByClassName('eventTile')[0].classList.add('active');  // 一番上のタイルをホバー状態に
          let eventPaginationBtn2 = Array.from(elem2.getElementsByClassName('pagination')[0].getElementsByTagName('a')); //ページネーションボタン
          eventPaginationBtn2.forEach(function(elem4) {
            elem4.classList.remove('active'); //全てのページネーションボタンのactive消す
          });
          elem2.getElementsByClassName('pagination')[0].firstElementChild.classList.add('active'); //一番最初のページネーションボタン（つまり表示ページのボタン）をactiveに
        }
        else elem2.classList.remove('active');
      });

      /* ページネーション矢印 */
      eventTypeTabArrow.forEach(function(elem2) {
        elem2.classList.remove('visible');
        elem2.classList.remove('disabled');
      });
      eventTypeTabArrow.forEach(function(elem2) {
        if (elem2.getAttribute('target') == href) { //目的のタイプ
          elem2.classList.add('visible');
          if (elem2.classList.contains('prev')) elem2.classList.add('disabled');
        }
      });
    });
  });


  /* ページネーション表示切替・ページごと */
  eventPagination.forEach(function(paginationBtnsContainer) {
    let eventPaginationBtn = Array.from(paginationBtnsContainer.getElementsByTagName('a'));

    eventPaginationBtn.forEach(function(paginationBtnClicked) {
      paginationBtnClicked.addEventListener('click', function(e) {
        event.preventDefault();

        /* ボタンの動作 */
        eventPaginationBtn.forEach(function(paginationBtn) {
          paginationBtn.classList.remove('active');
        });
        paginationBtnClicked.classList.add('active');

        /* タブの動作 */
        let indexClicked = [].slice.call(eventPaginationBtn).indexOf(paginationBtnClicked); //押されたボタンの示すページネーション
        // console.log(indexClicked);
        pagenum = indexClicked;

        let eventTypeDivs = paginationBtnClicked.parentElement.parentElement.parentElement.parentElement;
        //let eventType = paginationBtnClicked.parentElement.parentElement.parentElement.parentElement.id;
        eventListPageInType = Array.from(eventTypeDivs.getElementsByClassName("eventListPage"));

        eventListPageInType.forEach(function(listPage){
          listPage.classList.remove('active');
        });

        eventListPageInType[indexClicked].classList.add('active');

        eventTilePageInType = Array.from(eventTypeDivs.getElementsByClassName("eventTile"));
        eventTilePageInType.forEach(function(tiles) {
          tiles.classList.remove('active');
        });
        eventListPageInType[indexClicked].getElementsByClassName('eventTile')[0].classList.add('active');  // 一番上をホバー状態に

        // ページ送り三角形の色
        eventTypeTabArrow.forEach(function(arrow) {
          arrow.classList.remove('disabled');
        });
        if (indexClicked + 1 == eventListPageInType.length) { //そのタイプ最後のページ
          eventTypeTabArrow.forEach(function(arrow) {
            if (arrow.getAttribute('target') == eventType && arrow.classList.contains('next')) arrow.classList.add('disabled');
          });
        }
        else if (indexClicked == 0) { //そのタイプ最初の仕事
          eventTypeTabArrow.forEach(function(arrow) {
            if (arrow.getAttribute('target') == eventType && arrow.classList.contains('prev')) arrow.classList.add('disabled');
          });
        }
      });
    });

  });

  eventTypeTabArrow.forEach(function(arrow) {
    arrow.addEventListener('click', function(e) {
      event.preventDefault();

      if (arrow.classList.contains('prev')) pagenum--;
      else if (arrow.classList.contains('next')) pagenum++;

      let eventListPagesArray = Array.from(document.getElementById(eventType).getElementsByClassName('eventListPage'));
      eventListPagesArray.forEach(function(eventListPageOne) {
        eventListPageOne.classList.remove('active');
      });
      eventListPagesArray[pagenum].classList.add('active');
      eventListPagesArray[pagenum].getElementsByTagName('a')[0].getElementsByClassName('eventTile')[0].classList.add('active');

      let targetPaginationBtns = Array.from(document.getElementById(eventType).getElementsByClassName('foot')[0].getElementsByClassName('pagination-container')[0].getElementsByTagName('a'));
      targetPaginationBtns.forEach(function(targetPagination) {
        targetPagination.classList.remove('active');
      });
      targetPaginationBtns[pagenum].classList.add('active');

      eventTypeTabArrow.forEach(function(arrow) {
        arrow.classList.remove('disabled');
      });
      if (pagenum + 1 == eventListPagesArray.length) { //そのタイプ最後のページ
        eventTypeTabArrow.forEach(function(arrow) {
          if (arrow.getAttribute('target') == eventType && arrow.classList.contains('next')) arrow.classList.add('disabled');
        });
      }
      else if (pagenum == 0) { //そのタイプ最初の仕事
        eventTypeTabArrow.forEach(function(arrow) {
          if (arrow.getAttribute('target') == eventType && arrow.classList.contains('prev')) arrow.classList.add('disabled');
        });
      }
    });
  });

  /* モバイルのもっと見るボタン */
  const eventContainer = document.getElementById('eventContainer');
  const eventMoreBtn = Array.from(eventContainer.getElementsByClassName('more'));

  /* 最初の5つを表示 */
  eventTypePage.forEach(function(elem){
    let tileList = elem.getElementsByClassName('eventTile');
    let moreBtns = Array.from(elem.getElementsByClassName('more'));
    for (let i = 0; i < 5; i++) {
      if (i >= tileList.length) {
        if (moreBtns.length != 0) {
          moreBtns[0].classList.add('disabled'); //全部で5個以下だった場合
        }
        break;
      }
      else {
        if (moreBtns.length != 0) {
          moreBtns.forEach(function(elem2) {
            elem2.classList.add('disabled');
          });
          moreBtns[0].classList.remove('disabled');
        }
      }
      tileList[i].classList.add('mb-active');
    }
  });

  /* もっと見るボタン */
  let eventMbActive = {eventArticle: 5, eventMovie: 5, eventLive: 5};
  eventMoreBtn.forEach(function(elem) {
    elem.addEventListener('click', function(e) {
      event.preventDefault();
      let href = elem.getAttribute('href').substr(1);
      eventTypePage.forEach(function(elem2){
        if (elem2.id == href) {
          let tileList = Array.from(elem2.getElementsByClassName('eventTile'));
          let moreBtns = Array.from(elem2.getElementsByClassName('more'));
          for (let i = 0; i < 5; i++) {
            tileList[eventMbActive[href]].classList.add('mb-active');
            eventMbActive[href]++;

            if (i == 4) {
              if (typeof moreBtns[(eventMbActive[href] / 5 - 2)] != "undefined") moreBtns[(eventMbActive[href] / 5 - 2)].classList.add('disabled');
              if (typeof moreBtns[(eventMbActive[href] / 5 - 1)] != "undefined") moreBtns[(eventMbActive[href] / 5 - 1)].classList.remove('disabled');
            }

            // console.log(eventMbActive[href]);
            if (eventMbActive[href] >= tileList.length) {
              elem.classList.add('disabled');
              break;
            }
          }
        }
      });
    });
  });

  const topViewEventBar = document.getElementById('topView-event-bar');
  let topViewPos = 0;
  let k = 0;

  setInterval(frame, 25);

  function frame() {
    if (window.innerWidth > 992) {
      //if (topViewPos == 150) { topViewPos = 0; }
      topViewPos -= 0.5;
      topViewEventBar.style.left = topViewPos + 'px';

      /* 右端の追加 */
      let clientRect = topViewEventBar.lastElementChild.firstElementChild.getBoundingClientRect();
      if (clientRect.left < (200 + window.innerWidth)) {
        let elem = EventDataShuffled[k];
        let HeaderTile = document.createElement('a');
        let eventURL = '/event/?id=' + String(elem["eventID"]);
        HeaderTile.setAttribute('href', eventURL);
        HeaderTileInner = '<div class = "topView-event-tile appended ' + elem["eventType"] + '"><div class = "topView-event-type-container"><div class = "topView-event-type ' + elem["eventType"] + '"></div></div><div class = "topView-event-time">' + elem["requiredTime"] + '</div><div class = "topView-event-title">' + elem["eventName"] + '</div></div>'
        HeaderTile.innerHTML = HeaderTileInner;

        topViewEventBar.appendChild(HeaderTile);
        k++;
        if (k >= EventDataShuffled.length) k = 0;
      }
      if (topViewEventBar.getElementsByClassName('appended').length) {  //後から追加されたタイルのうち最初のやつ
        let clientAppendedRect = topViewEventBar.getElementsByClassName('appended')[0].getBoundingClientRect();
        if (clientAppendedRect.left <= 0) {
          topViewPos = 0;
        }
      }
    }
  }
});
