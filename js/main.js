document.addEventListener('DOMContentLoaded', function () {
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
          elem2.firstElementChild.firstElementChild.classList.add('active');  // 一番上をホバー状態に
          
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
            elem2.firstElementChild.classList.add('active');
          }
          else elem2.classList.remove('active');
        });
      });
    });
      
  });



  /*const paginationBtn = Array.from(document.getElementsByClassName('paginationBtn'))
  paginationBtn.forEach(function(elem) {
    buttons = elem.firstElementChild('a');

    elem.on('click', 'a', function(event) {
      event.preventDefault();
      let $this = $(this);

      if ($this.classList.has("active")) return;

    });
  });
  

  const eventListPageArticle = Array.from( eventList.getElementsByClassName('eventTile') );*/
});