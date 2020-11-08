document.addEventListener('DOMContentLoaded', (event) => {
  const now = Math.floor((new Date()).getTime() / 1000);
  const threshold = 1604833200;
  if (now >= threshold) {
    document.getElementById('desc1').innerText = "第67回理工展は無事終了いたしました。";
    document.getElementById('desc2').innerText = "ご来場ありがとうございました！";
  }
});