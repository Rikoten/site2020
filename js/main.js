document.addEventListener('DOMContentLoaded', function () {



  /* イベント一覧のホバーアニメーション */
  const eventList = document.getElementById('eventList');
  const eventTile = Array.from( eventList.getElementsByClassName('eventTile') );
  eventTile[0].classList.add("active");
  console.log(eventTile);
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
  /* 初期状態 */

  /* 変化 */


  const eventListPageArticle = Array.from( eventList.getElementsByClassName('eventTile') );
});