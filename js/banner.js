document.addEventListener('DOMContentLoaded', function () {
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