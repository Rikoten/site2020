document.addEventListener('DOMContentLoaded', (event) => {
  const now = Math.floor((new Date()).getTime() / 1000);
  const threshold = 1604833200;
  if (now >= threshold) {
    document.getElementById('desc1').innerHTML = "第 67 回理工展は終了いたしました。ご来場ありがとうございました。<br>理工展パンフレットアプリ及びバーチャル理工展アプリは引き続きお楽しみいただけます。";
    document.getElementById('desc2').remove()
  }
});
