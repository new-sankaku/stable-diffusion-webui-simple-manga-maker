function openWindow(url) {
  var width = 700;
  var height = 700;
  var left = (screen.width / 2) - (width / 2);
  var top = (screen.height / 2) - (height / 2);
  window.open(url, 'ShareWindow', 'toolbar=no, location=no, status=no, menubar=no, scrollbars=no, resizable=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
}

function snsTweet(){
  clipCopy();

  var tweetText = "\nCreated by Manga Editor Desu!\n#Manga_Editor_Desu\n[Web site]\nhttps://new-sankaku.github.io/SP-MangaEditer/\n[Webui extension]\nhttps://github.com/new-sankaku/stable-diffusion-webui-simple-manga-maker";
  var tweetUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweetText);
  openWindow(tweetUrl);
}


function createPopup() {
  const popup = document.createElement('div');
  popup.id = 'mangaEditorDesu_custom-popup';
  popup.style.display = 'none';

  const popupContent = document.createElement('div');
  popupContent.id = 'mangaEditorDesu_popup-content';

  const img = document.createElement('img');
  img.id = 'mangaEditorDesu_popup-image';
  img.src = '03_images/infomation/20240715.webp';
  img.alt = 'Futuristic Thank You';

  const textContent = document.createElement('div');
  textContent.id = 'mangaEditorDesu_text-content';

  const title = document.createElement('h2');
  title.textContent = getText('help_message_title');

  const message = document.createElement('p');
  message.textContent = getText('help_message_message');

  const linkSection = document.createElement('div');
  linkSection.className = 'mangaEditorDesu_link-section';
  linkSection.innerHTML = getText('help_message_links');
  console.log( "help_message_links", getText('help_message_links') );

  const closeButton = document.createElement('button');
  closeButton.id = 'mangaEditorDesu_close-popup';
  closeButton.textContent = getText('help_message_close');
  closeButton.addEventListener('click', mangaEditorDesu_closePopup);

  textContent.appendChild(title);
  textContent.appendChild(message);
  textContent.appendChild(linkSection);
  textContent.appendChild(closeButton);

  popupContent.appendChild(img);
  popupContent.appendChild(textContent);

  const flames = document.createElement('div');
  flames.className = 'mangaEditorDesu_flames';

  const flamePositions = [10, 30, 50, 70, 90];
  const flameDelays = [-0.3, -0.5, -0.2, -0.7, -0.1];

  for (let i = 0; i < 5; i++) {
      const flame = document.createElement('div');
      flame.className = 'mangaEditorDesu_flame';
      flame.style.left = `${flamePositions[i]}%`;
      flame.style.animationDelay = `${flameDelays[i]}s`;
      flames.appendChild(flame);
  }

  popup.appendChild(popupContent);
  popup.appendChild(flames);

  document.body.appendChild(popup);
}

function mangaEditorDesu_init() {
  console.log("mangaEditorDesu_init", localStorage.getItem('mangaEditorDesu_popupShown'));
  if (localStorage.getItem('mangaEditorDesu_popupShown') === 'true') {
      mangaEditorDesu_popupShown = true;
  }
  
  createPopup();
  
  if (!mangaEditorDesu_popupShown) {
      setTimeout(mangaEditorDesu_showPopup, 5 * 60 * 1000); // 5秒後に表示
  }

}

function mangaEditorDesu_showPopup() {
  if (!mangaEditorDesu_popupShown) {
      const popup = document.getElementById('mangaEditorDesu_custom-popup');
      popup.style.display = 'block';
      mangaEditorDesu_popupShown = true;
      localStorage.setItem('mangaEditorDesu_popupShown', 'true');
  }
}

function mangaEditorDesu_closePopup() {
  const popup = document.getElementById('mangaEditorDesu_custom-popup');
  popup.style.display = 'none';
}

function mangaEditorDesu_resetPopup() {
  localStorage.removeItem('mangaEditorDesu_popupShown');
  mangaEditorDesu_popupShown = false;
}

let mangaEditorDesu_popupShown = false;

function mangaEditorDesu_resetPopup() {
  localStorage.removeItem('mangaEditorDesu_popupShown');
  mangaEditorDesu_popupShown = false;
}
mangaEditorDesu_resetPopup();
mangaEditorDesu_init();