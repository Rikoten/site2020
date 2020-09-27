document.addEventListener('DOMContentLoaded', function () {
  function eventLoad() {
    return new Promise (function (resolve, reject) {
      /* 企画ロード */
      const URLEventData = 'data/eventData.json';
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

          topViewEventBar.appendChild(HeaderTile);

          /* 企画一覧部分 */
          let type = elem["eventType"]; //企画タイプ

          let childrenTag = ""; //子ども向けの企画タグ
          if (typeof elem["children"] !== 'undefined' && elem["children"] == 1) childrenTag = '<div class = "eventChild"><div>子ども向け</div></div>';
          
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
          
          if (showedtiles[type] % 5 == 1 && showedtiles[type] > 1) {
            let moreBtn = document.createElement('a');
            moreBtn.setAttribute('href', '#eventArticle');
            moreBtn.classList.add('more');
            moreBtn.innerText = "もっと見る";
            TargetContainer[type].lastElementChild.previousElementSibling.appendChild(moreBtn);
          }

          /* タイル追加 */
          let EventListTile = document.createElement('a');
          EventListTile.setAttribute('href', eventURL);
          let EventListTileInner = '<div class = "eventTile"><div class = "eventTitle">' + elem["eventName"] + '</div><div class = "eventTime">' + elem["requiredTime"] + '</div>' + childrenTag + '<div class = "eventDesc">' + elem["eventDesc"] + '</div><div class = "eventView"><span>73</span></div><div class = "eventThumbsUp">3</div><div class = "eventGroupName">' + elem["groupName"] + '</div></div>';

          EventListTile.innerHTML = EventListTileInner;

          TargetContainer[type].lastElementChild.previousElementSibling.appendChild(EventListTile);
        });
        resolve(EventDataShuffled);
      }
    });
  }

  /* ここからは企画データ表示後の対応が必要！ */
  eventLoad().then(function(EventDataShuffled) {
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
    const eventTypeTabBtn = Array.from(eventTypeTab.getElementsByTagName("a"));

    /* ページネーション表示切替 */
    const eventPagination = Array.from(document.getElementsByClassName('pagination'));
    const eventListPage = Array.from(document.getElementsByClassName('eventListPage'));

    /* タイプのタブの表示切り替え */
    eventTypeTabBtn.forEach(function(elem) {
      elem.addEventListener('click', function (e) {
        event.preventDefault();

        /* ボタンの動作 */
        eventTypeTabBtn.forEach(function(elem2) {
          elem2.classList.remove('active');
        });
        elem.classList.add('active');

        /* タブの動作 */
        href = elem.getAttribute('href').substr(1);
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
      });
    });
  

    /* ページネーション表示切替 */
    eventPagination.forEach(function(paginationBtns) {
      let eventPaginationBtn = Array.from(paginationBtns.getElementsByTagName('a'));
  
      eventPaginationBtn.forEach(function(paginationBtnClicked) {
        paginationBtnClicked.addEventListener('click', function(e) {
          event.preventDefault();
  
          /* ボタンの動作 */
          eventPaginationBtn.forEach(function(paginationBtns2) {
            paginationBtns2.classList.remove('active');
          });
          paginationBtnClicked.classList.add('active');
  
          /* タブの動作 */
          let indexClicked = [].slice.call(eventPaginationBtn).indexOf(paginationBtnClicked) + 1; //押されたボタンの示すページネーション
          eventListPage.forEach(function(listPage){
            listPage.classList.remove('active');
          });

          eventListPage[indexClicked].classList.add('active');
          eventTile.forEach(function(tiles) {
            tiles.classList.remove('active');
          });
          eventListPage[indexClicked].getElementsByClassName('eventTile')[0].classList.add('active');  // 一番上をホバー状態に
        });
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
        HeaderTileInner = '<div class = "topView-event-tile ' + elem["eventType"] + '"><div class = "topView-event-type-container"><div class = "topView-event-type ' + elem["eventType"] + '"></div></div><div class = "topView-event-time">' + elem["requiredTime"] + '</div><div class = "topView-event-title">' + elem["eventName"] + '</div></div>'
        HeaderTile.innerHTML = HeaderTileInner;

        topViewEventBar.appendChild(HeaderTile);
        k++;
        if (k >= EventDataShuffled.length) k = 0;
      }
    }
  });

  /* バナーロード */
  const goldBanner = document.getElementById('goldBanner');
  const silverBanner = document.getElementById('silverBanner');
  const URLBannerData = 'data/banner.json';
  const requestBannerData = new XMLHttpRequest();
  requestBannerData.open('GET', URLBannerData);

  requestBannerData.responseType = 'json';
  requestBannerData.send();

  requestBannerData.onload = function() {
    const BannerData = requestBannerData.response;
    const GoldBannerData = BannerData[0];
    const SilverBannerData = BannerData[1];

    let iG = 0;
    let columnG = 0;
    let rowG = 0;
    GoldBannerData.forEach(function(elem) {
      let bannerElem = document.createElement('a');
      columnG = 1;
      if (iG % 2 != 0) columnG = 3;
      let bgcolor = "#fff";
      if (typeof elem["bgcolor"] !== 'undefined' && elem["bgcolor"] != "") bgcolor = elem["bgcolor"];

      bannerElem.setAttribute('href', elem["url"]);
      bannerElem.setAttribute('target', '_blank');
      bannerElem.setAttribute('rel', 'noopener');
      style = '-ms-grid-column: ' + String(columnG) + '; -ms-grid-row: ' + String(rowG) + '; background-color: ' + bgcolor + ';'
      bannerElem.setAttribute('style', style);

      bannerElem.innerHTML = '<img src = "/img/banner/' + elem["img"] + '" alt = "' + elem["alt"] + '">';

      goldBanner.appendChild(bannerElem);
      if (iG % 2 != 0) rowG++;
      iG++;
    });

    let iS = 0;
    let columnS = 0;
    let rowS = 0;
    SilverBannerData.forEach(function(elem) {
      let bannerElem = document.createElement('a');
      columnS = 1;
      if (iG % 3 == 1) columnS = 3;
      else if (iG % 3 == 2) columnS = 5;
      let bgcolor = "#fff";
      if (typeof elem["bgcolor"] !== 'undefined' && elem["bgcolor"] != "") bgcolor = elem["bgcolor"];

      bannerElem.setAttribute('href', elem["url"]);
      bannerElem.setAttribute('target', '_blank');
      bannerElem.setAttribute('rel', 'noopener');
      style = '-ms-grid-column: ' + String(columnS) + '; -ms-grid-row: ' + String(rowS) + '; background-color: ' + bgcolor + ';'
      bannerElem.setAttribute('style', style);

      bannerElem.innerHTML = '<img src = "/img/banner/' + elem["img"] + '" alt = "' + elem["alt"] + '">';

      silverBanner.appendChild(bannerElem);
      if (iS % 3 == 2) rowS++;
      iS++;

    });
  }

});