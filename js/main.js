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
        const eventArticle = document.getElementById('eventArticle');
        const eventMovie = document.getElementById('eventMovie');
        const eventLive = document.getElementById('eventLive');
        let ArticleCount = 0;
        let ArticlePageCount = 0;
        let MovieCount = 0;
        let MoviePageCount = 0;
        let LiveCount = 0;
        let LivePageCount = 0;
        EventDataShuffled.forEach(function(elem) {
          /* ヘッダー部分 */
          let HeaderTile = document.createElement('a');
          let eventURL = '/event/?id=' + String(elem["eventID"]);
          HeaderTile.setAttribute('href', eventURL);
          HeaderTileInner = '<div class = "topView-event-tile"><div class = "topView-event-head"><div class = "topView-event-type ' + elem["eventType"] + '"></div><div class = "topView-event-time">' + elem["requiredTime"] + '</div></div><div class = "topView-event-title">' + elem["eventName"] + '</div></div>'
          HeaderTile.innerHTML = HeaderTileInner;

          topViewEventBar.appendChild(HeaderTile);

          /* 企画一覧部分 */
          let TargetContainer = "";
          let childrenTag = "";
          if (typeof elem["children"] !== 'undefined' && elem["children"] == 1) childrenTag = '<div class = "eventChild"><div>子ども向け</div></div>';
          if (elem["eventType"] == "article") {
            TargetContainer = eventArticle;
            if (ArticleCount % tilesOnePage == 0) {//新しいページ最初の企画
              ArticlePageCount++; //ページ数

              let newPaginationID = 'eventArticle' + String(ArticlePageCount);
              let newPaginationBtnHref = '#' + newPaginationID;

              /* ページネーションボタンの追加 */
              let newPaginationBtn = document.createElement('a');
              newPaginationBtn.setAttribute('href', newPaginationBtnHref);
              newPaginationBtn.innerText = ArticlePageCount;
              if (ArticlePageCount == 1) newPaginationBtn.classList.add('active');
              TargetContainer.lastElementChild.firstElementChild.firstElementChild.appendChild(newPaginationBtn); //新しいページボタンの追加

              /* 企画一覧ページの追加 */
              let newPagination = document.createElement('div');
              newPagination.classList.add('eventListPage');
              if (ArticlePageCount == 1) newPagination.classList.add('active');
              newPagination.id = newPaginationID;
              TargetContainer.insertBefore(newPagination, TargetContainer.lastElementChild);
            }
            ArticleCount++;
          }
          else if (elem["eventType"] == "movie") {
            TargetContainer = eventMovie;
            if (MovieCount % tilesOnePage == 0) {//新しいページ最初の企画
              MoviePageCount++; //ページ数

              let newPaginationID = 'eventMovie' + String(MoviePageCount);
              let newPaginationBtnHref = '#' + newPaginationID;

              /* ページネーションボタンの追加 */
              let newPaginationBtn = document.createElement('a');
              newPaginationBtn.setAttribute('href', newPaginationBtnHref);
              newPaginationBtn.innerText = MoviePageCount;
              if (MoviePageCount == 1) newPaginationBtn.classList.add('active');
              TargetContainer.lastElementChild.firstElementChild.firstElementChild.appendChild(newPaginationBtn); //新しいページボタンの追加

              /* 企画一覧ページの追加 */
              let newPagination = document.createElement('div');
              newPagination.classList.add('eventListPage');
              if (MoviePageCount == 1) newPagination.classList.add('active');
              newPagination.id = newPaginationID;
              TargetContainer.insertBefore(newPagination, TargetContainer.lastElementChild);
            }
            MovieCount++;
          }
          else if (elem["eventType"] == "live") {
            TargetContainer = eventLive;
            if (LiveCount % tilesOnePage == 0) {//新しいページ最初の企画
              LivePageCount++; //ページ数

              let newPaginationID = 'eventLive' + String(LivePageCount);
              let newPaginationBtnHref = '#' + newPaginationID;

              /* ページネーションボタンの追加 */
              let newPaginationBtn = document.createElement('a');
              newPaginationBtn.setAttribute('href', newPaginationBtnHref);
              newPaginationBtn.innerText = LivePageCount;
              if (LivePageCount == 1) newPaginationBtn.classList.add('active');
              TargetContainer.lastElementChild.firstElementChild.firstElementChild.appendChild(newPaginationBtn); //新しいページボタンの追加

              /* 企画一覧ページの追加 */
              let newPagination = document.createElement('div');
              newPagination.classList.add('eventListPage');
              if (LivePageCount == 1) newPagination.classList.add('active');
              newPagination.id = newPaginationID;
              TargetContainer.insertBefore(newPagination, TargetContainer.lastElementChild);
            }
            LiveCount++;
          }
          
          let EventListTile = document.createElement('a');
          EventListTile.setAttribute('href', eventURL);
          let EventListTileInner = '<div class = "eventTile"><div class = "eventTitle">' + elem["eventName"] + '</div><div class = "eventTime">' + elem["requiredTime"] + '</div>' + childrenTag + '<div class = "eventDesc">' + elem["eventDesc"] + '</div><div class = "eventView"><span>73</span></div><div class = "eventThumbsUp">3</div><div class = "eventGroupName">' + elem["groupName"] + '</div></div>';

          EventListTile.innerHTML = EventListTileInner;

          TargetContainer.lastElementChild.previousElementSibling.appendChild(EventListTile); //最後から2番目: footの前なので最後のページ
        });
        resolve();
      }
    });
  }

  /* ここからは企画データ表示後の対応が必要！ */
  eventLoad().then(function() {
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
            elem2.classList.add('active');
            
            eventListPage.forEach(function(elem4) {
              elem4.classList.remove('active');
            });
            elem2.firstElementChild.classList.add('active');
            eventTile.forEach(function(elem4) {
              elem4.classList.remove('active');
            });
            elem2.firstElementChild.firstElementChild.firstElementChild.classList.add('active');  // 一番上をホバー状態に
            
            let eventPaginationBtn2 = Array.from(elem2.lastElementChild.firstElementChild.firstElementChild.getElementsByTagName('a'));
            eventPaginationBtn2.forEach(function(elem4) {
              elem4.classList.remove('active');
            });
            elem2.lastElementChild.firstElementChild.firstElementChild.firstElementChild.classList.add('active');
          }
          else elem2.classList.remove('active');
        });
      });
    });
  

    /* ページネーション表示切替 */
    eventPagination.forEach(function(elem) {
      let eventPaginationBtn = Array.from(elem.getElementsByTagName('a'));
  
      eventPaginationBtn.forEach(function(elem3) {
        elem3.addEventListener('click', function (e) {
          event.preventDefault();
  
          /* ボタンの動作 */
          eventPaginationBtn.forEach(function(elem2) {
            elem2.classList.remove('active');
          });
          elem3.classList.add('active');
  
          /* タブの動作 */
          href = elem3.getAttribute('href').substr(1);
          eventListPage.forEach(function(elem2){
            if (elem2.id == href) {
              elem2.classList.add('active');
  
              eventTile.forEach(function(elem4) {
                elem4.classList.remove('active');
              });
              elem2.firstElementChild.firstElementChild.classList.add('active');  // 一番上をホバー状態に
            }
            else elem2.classList.remove('active');
          });
        });
      });
        
    });
    const topViewEventBar = document.getElementById('topView-event-bar');
    let topViewPos = 0;
     
    setInterval(frame, 50); 
    
    function frame() { 
      //if (topViewPos == 150) { topViewPos = 0; }
      topViewPos--;
      topViewEventBar.style.left = topViewPos + 'px';
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
      style = '-ms-grid-column: ' + String(columnG) + '; -ms-grid-row: ' + String(rowG) + '; background-color: ' + bgcolor + ';'
      bannerElem.setAttribute('style', style);

      bannerElem.innerHTML = '<img src = "/img/banner/' + elem["img"] + '">';

      goldBanner.appendChild(bannerElem);
      if (iG % 2 != 0) rowG++;
      iG++;
    });

    let iS = 0;
    let columnS = 0;
    let rowS = 0;
    SilverBannerData.forEach(function(elem) {
      let bannerElem = document.createElement('a');
      let columnS = 1;
      if (iG % 3 == 1) columnS = 3;
      else if (iG % 3 == 2) columnS = 5;
      let bgcolor = "#fff";
      if (typeof elem["bgcolor"] !== 'undefined' && elem["bgcolor"] != "") bgcolor = elem["bgcolor"];

      bannerElem.setAttribute('href', elem["url"]);
      style = '-ms-grid-column: ' + String(columnS) + '; -ms-grid-row: ' + String(rowS) + '; background-color: ' + bgcolor + ';'
      bannerElem.setAttribute('style', style);

      bannerElem.innerHTML = '<img src = "/img/banner/' + elem["img"] + '">';

      silverBanner.appendChild(bannerElem);
      if (iS % 3 == 2) rowS++;
      iS++;

    });
  }

});