export default function decorate(block) {
  const rows = [...block.children];

  // Pull video src from any anchor pointing at a video file
  let videoSrc = null;
  rows.some((row) => {
    const a = row.querySelector('a[href]');
    if (a && /\.(mp4|webm|ogg)(\?|#|$)/i.test(a.href)) {
      videoSrc = a.href;
      row.remove();
      return true;
    }
    return false;
  });

  // Flatten remaining rows into the content overlay div
  const content = document.createElement('div');
  content.className = 'video-hero-content';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      while (cell.firstChild) content.appendChild(cell.firstChild);
    });
  });

  block.innerHTML = '';

  if (videoSrc) {
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('aria-hidden', 'true');
    const source = document.createElement('source');
    source.src = videoSrc;
    source.type = 'video/mp4';
    video.appendChild(source);
    block.appendChild(video);
    block.classList.add('has-video');
  }

  block.appendChild(content);
}
