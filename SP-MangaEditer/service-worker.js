self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.protocol === 'file:') {
    return;
  }
 
  if (!url.pathname.startsWith('/')) {
    return;
  }
 
  event.respondWith(
    fetch(event.request).then(response => {
      return response;
    })
  );
});