<!DOCTYPE html>
<html lang = "ja">
<head>
<meta charset = "utf-8">
<title>参加団体ページ</title>
<meta name = "keywords" content = "">
<meta name = "description" content = "">
<meta name = "viewport" content = "width = device-width, initial-scale = 1, shrink-to-fit = no">
<link rel = "stylesheet" href = "/css/main.css">
</head>

<body>

  <header></header>

  <!-- 目次（山下担当部分） -->
  <nav id = "articleIndex"></nav>

  <main>
    <article>
      <h3>遠近法</h3>
      <h4>空気遠近法</h4>
      <p>空気遠近法は、大気が持つ性質を利用した空間表現法です。例えば戸外の風景を眺めてみると、遠景に向かうほどに対象物は青味がかって見え、また同時に、遠景ほど輪郭線が不明瞭になり、対象物は霞んで見えます。</p>
      <p>こういった性質を利用して空気遠近法では、遠景にあるものほど形態をぼやかして描いたり、色彩をより大気の色に近づけるなどして、空間の奥行きを表現します。</p>

      <h4>透視図法</h4>
      <p>遠近法の基本は視点の前に置いた「投影面」に、それを通過する光を写し取ることであり、それは窓ガラスを通して見える光景を窓ガラス表面に直接描画することに似ています。ガラスに写し取られた図は3次元の光景を縮小し2次元平面上に変換したものとなります。</p>
      <p>図法として一点透視図法、二点透視図法、三点透視図法などがあります。これらは美術にとどまらず、建築、映画、アニメ、コンピュータグラフィックスなど、視覚表現の分野で広く使用されています。</p>
    </article>

    <section class = "group-info">
      <h2 class = "h2-group">団体紹介</h2>
      <p class = "group-name">早稲田デザイン学振興会</p>
      <p class = "group-desc">精緻な違和感のないデザインを制作するためには遠近感を正しく描写する必要があります。早稲田デザイン学振興会では目に映る像を平面に正確に写すための技法である透視図法の振興に努め、特に一点透視図法や二点透視図法等の図法の研究を行っています。</p>
    </section>
  </main>

  <!-- おすすめ企画 -->
  <aside></aside>

  <footer></footer>
  <script type="text/javascript">
    document.addEventListener('DOMContentLoaded', function () {
      var contentsList = document.getElementById('articleIndex'); // 目次を追加する先(table of contents)
      var div = document.createElement('div'); // 作成する目次のコンテナ要素

      // .entry-content配下のh2、h3要素を全て取得する
      var matches = document.querySelectorAll('article h3, article h4');

      // 取得した見出しタグ要素の数だけ以下の操作を繰り返す
      matches.forEach(function (value, i) {
        // 見出しタグ要素のidを取得し空の場合は内容をidにする
        var id = value.id;
        if(id === '') {
          id = value.textContent;
          value.id = id;
        }

        if(value.tagName === 'H3') {
          var ul = document.createElement('ul');
          var li = document.createElement('li');
          var a = document.createElement('a');

          // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
          a.innerHTML = value.textContent;
          a.href = '#' + value.id;
          li.appendChild(a)
          ul.appendChild(li);

          // コンテナ要素である<div>の中に要素を追加する
          div.appendChild(ul);
        }

        if(value.tagName === 'H4') {
          var ul = document.createElement('ul');
          var li = document.createElement('li');
          var a = document.createElement('a');

          // コンテナ要素である<div>の中から最後の<li>を取得する。
          var lastUl = div.lastElementChild;
          var lastLi = lastUl.lastElementChild;

          // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
          a.innerHTML = value.textContent;
          a.href = '#' + value.id;
          li.appendChild(a)
          ul.appendChild(li);

          // 最後の<li>の中に要素を追加する
          lastLi.appendChild(ul);
        }
      });

      // 最後に画面にレンダリング
      contentsList.appendChild(div);
    });
  </script>
</body>

</html>
