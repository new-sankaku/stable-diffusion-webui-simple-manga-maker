document.addEventListener('DOMContentLoaded', function() {

  toggleVisibility('svg-container');
});

function toggleVisibility(id) {
  var element = document.getElementById(id);
  var icons = document.querySelectorAll('#sidebar i');
  icons.forEach(icon => {
      // アイコンのactiveクラスを管理
      if (icon.getAttribute('onclick').includes(id)) {
          icon.classList.toggle('active', element.style.display === 'none');
      } else {
          icon.classList.remove('active');
      }
  });

  if (element.style.display === 'none') {
      // 他のエリアを非表示にする
      document.getElementById('svg-container').style.display = 'none';
      document.getElementById('speech-bubble-area1').style.display = 'none';
      document.getElementById('dummy-area2').style.display = 'none';
      document.getElementById('dummy-area3').style.display = 'none';
      document.getElementById('dummy-area4').style.display = 'none';
      // クリックされたエリアを表示する
      element.style.display = 'block';
  } else {
      element.style.display = 'none';
  }
}
