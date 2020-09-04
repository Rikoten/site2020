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

  /* 表示切替 */
  const eventTypePage = Array.from( eventList.getElementsByClassName('eventTypePage') );
  const eventTypeTab = document.getElementById('eventTypeTab');
  eventTypeTabBtn = Array.from(eventTypeTab.getElementsByTagName("a"));

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
        if (elem2.id == href) elem2.classList.add('active');
        else elem2.classList.remove('active');
      });
    });
  });

  /*eventTypePage.forEach(function(elem) {

  });*/



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