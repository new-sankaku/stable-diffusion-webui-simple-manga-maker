
function toggleMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  const logo = document.getElementById('navbar-logo');
  if (isDarkMode) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem('mode', 'dark-mode');
    logo.src = '02_images_svg/Logo/black_mode_logo.webp';
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('mode', 'light-mode');
    logo.src = '02_images_svg/Logo/light_mode_logo.webp';
  }
}

document.getElementById('mode-toggle').addEventListener('change', toggleMode);

function initializeMode() {
  const mode = localStorage.getItem('mode') || 'light-mode';
  document.body.classList.add(mode);
  const logo = document.getElementById('navbar-logo');
  if (mode === 'dark-mode') {
    document.getElementById('mode-toggle').checked = true;
    logo.src = '02_images_svg/Logo/black_mode_logo.webp';
  } else {
    logo.src = '02_images_svg/Logo/light_mode_logo.webp';
  }
}
initializeMode();
