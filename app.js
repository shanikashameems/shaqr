// Elements
const tabs = document.querySelectorAll('.seg-btn');
const indicator = document.querySelector('.seg-indicator');
const modePanels = document.querySelectorAll('.mode-panel');
const qrCanvasDiv = document.getElementById('qr-canvas');
const qrWrapper = document.querySelector('.qr-3d-wrapper');

// Theme & Color Configs
const themeToggle = document.getElementById('theme-toggle');
const colorCustomization = document.getElementById('color-customization');
let currentTheme = 'modern';

const qrToggle = document.getElementById('qr-fill-type');
const bgToggle = document.getElementById('bg-fill-type');
const qrColor1 = document.getElementById('qr-color-1');
const qrColor2 = document.getElementById('qr-color-2');
const bgColor1 = document.getElementById('bg-color-1');
const bgColor2 = document.getElementById('bg-color-2');

// Initialize correctly based on HTML dataset
qrColor2.style.display = qrToggle.dataset.state === 'gradient' ? 'block' : 'none';
bgColor2.style.display = bgToggle.dataset.state === 'gradient' ? 'block' : 'none';

// Inputs
const inputs = {
  url: document.getElementById('url-val'),
  vcardFn: document.getElementById('vcard-fn'),
  vcardTitle: document.getElementById('vcard-title'),
  vcardTel: document.getElementById('vcard-tel'),
  vcardEmail: document.getElementById('vcard-email'),
};

const btnDl = document.getElementById('btn-dl');
let currentMode = 'url';

// --- 3D Parallax Hover Effect ---
qrWrapper.addEventListener('mousemove', (e) => {
  const rect = qrWrapper.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -12; 
  const rotateY = ((x - centerX) / centerX) * 12;
  qrCanvasDiv.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
});

qrWrapper.addEventListener('mouseleave', () => {
  qrCanvasDiv.style.transform = `rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
  qrCanvasDiv.style.transition = `transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)`;
  setTimeout(() => { qrCanvasDiv.style.transition = 'transform 0.1s ease-out'; }, 500);
});

// --- Toast ---
const showToast = (message) => {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => { if(container.contains(toast)) container.removeChild(toast); }, 400);
  }, 3000);
};

// --- Payload ---
const getPayloadString = () => {
  switch (currentMode) {
    case 'url':
      let url = inputs.url.value.trim();
      if (url && !url.match(/^https?:\/\//i)) url = 'https://' + url;
      return url || 'https://apple.com';
    case 'vcard':
      const fn = inputs.vcardFn.value || 'Steve Jobs';
      return `BEGIN:VCARD\nVERSION:3.0\nN:${fn};;;;\nFN:${fn}\nTITLE:${inputs.vcardTitle.value}\nTEL;TYPE=work,voice:${inputs.vcardTel.value}\nEMAIL:${inputs.vcardEmail.value}\nEND:VCARD`;
    default:
      return '';
  }
};

// --- QR Configuration ---
const getConfig = (renderSize = 1000, format = "canvas") => {
  
  if (currentTheme === 'formal') {
    return {
      width: renderSize,
      height: renderSize,
      type: format,
      data: getPayloadString(),
      margin: 40, 
      qrOptions: { errorCorrectionLevel: "H" },
      dotsOptions: { type: "square", color: "#000000" },
      backgroundOptions: { color: "#FFFFFF" },
      cornersSquareOptions: { type: "square", color: "#000000" },
      cornersDotOptions: { type: "square", color: "#000000" }
    };
  }

  const qrIsGrad = qrToggle.dataset.state === 'gradient';
  const bgIsGrad = bgToggle.dataset.state === 'gradient';

  return {
    width: renderSize,
    height: renderSize,
    type: format,
    data: getPayloadString(),
    margin: 40,
    qrOptions: { errorCorrectionLevel: "H" },
    dotsOptions: {
      type: "rounded",
      color: qrIsGrad ? undefined : qrColor1.value,
      gradient: qrIsGrad ? {
        type: "linear", rotation: 0.785398,
        colorStops: [{ offset: 0, color: qrColor1.value }, { offset: 1, color: qrColor2.value }]
      } : null
    },
    backgroundOptions: {
      color: bgIsGrad ? undefined : bgColor1.value,
      gradient: bgIsGrad ? {
        type: "linear", rotation: 0.785398,
        colorStops: [{ offset: 0, color: bgColor1.value }, { offset: 1, color: bgColor2.value }]
      } : null
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: qrIsGrad ? undefined : qrColor1.value,
      gradient: qrIsGrad ? {
        type: "linear", rotation: 0.785398,
        colorStops: [{ offset: 0, color: qrColor1.value }, { offset: 1, color: qrColor2.value }]
      } : null
    },
    cornersDotOptions: {
      type: "dot",
      color: qrIsGrad ? undefined : qrColor1.value,
      gradient: qrIsGrad ? {
        type: "linear", rotation: 0.785398,
        colorStops: [{ offset: 0, color: qrColor1.value }, { offset: 1, color: qrColor2.value }]
      } : null
    }
  };
};

let qrCode = new QRCodeStyling(getConfig(1000, "canvas"));
qrCode.append(qrCanvasDiv);

const updateQR = () => {
  qrCanvasDiv.innerHTML = ''; 
  qrCode = new QRCodeStyling(getConfig(1000, "canvas"));
  qrCode.append(qrCanvasDiv);
};

let debounceTimeout;
const debouncedUpdate = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(updateQR, 100);
};


// --- Listeners ---

// Main Tabs (URL/Contact)
tabs.forEach((tab, index) => {
  if(tab.closest('#theme-toggle')) return; 
  
  tab.addEventListener('click', () => {
    tabs.forEach(t => { if(!t.closest('#theme-toggle')) t.classList.remove('active') });
    tab.classList.add('active');
    indicator.style.transform = `translateX(${index * 100}%)`;
    currentMode = tab.dataset.mode;
    modePanels.forEach(panel => {
      panel.classList.remove('active');
      if(panel.id === `mode-${currentMode}`) panel.classList.add('active');
    });
    updateQR();
  });
});

// Theme Switcher
const themeBtns = themeToggle.querySelectorAll('.seg-btn');
const themeIndicator = document.getElementById('theme-indicator');
themeBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    themeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    themeIndicator.style.transform = `translateX(${index * 100}%)`;
    currentTheme = btn.dataset.val;
    
    if (currentTheme === 'formal') {
      colorCustomization.style.opacity = '0.3';
      colorCustomization.style.pointerEvents = 'none';
    } else {
      colorCustomization.style.opacity = '1';
      colorCustomization.style.pointerEvents = 'all';
    }
    updateQR();
  });
});

// Inputs
Object.values(inputs).forEach(input => input.addEventListener('input', debouncedUpdate));

// Animated Color Toggles
const setupToggle = (toggleElement, color2Element) => {
  const buttons = toggleElement.querySelectorAll('.toggle-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.val;
      toggleElement.dataset.state = val;
      color2Element.style.display = val === 'gradient' ? 'block' : 'none';
      updateQR();
    });
  });
};

setupToggle(qrToggle, qrColor2);
setupToggle(bgToggle, bgColor2);

// Color Pickers
[qrColor1, qrColor2, bgColor1, bgColor2].forEach(picker => picker.addEventListener('input', updateQR));

// Download
btnDl.addEventListener('click', async () => {
  const tempQr = new QRCodeStyling(getConfig(2048, "canvas"));
  try {
    await tempQr.download({ extension: "png", name: "ShaQR-Export" });
    showToast("Downloaded High-Res PNG");
  } catch(e) {
    showToast("Download failed");
  }
});

// --- Comments System ---
const starsContainer = document.getElementById('heart-rating');
const hearts = starsContainer.querySelectorAll('.heart-icon');
const commentName = document.getElementById('comment-name');
const commentText = document.getElementById('comment-text');
const btnSubmitComment = document.getElementById('btn-submit-comment');
const commentsList = document.getElementById('comments-list');

let currentRating = 5;

// Hover effects for rating
hearts.forEach((heart, index) => {
  heart.addEventListener('click', () => {
    currentRating = index + 1;
    hearts.forEach((h, i) => {
      if (i < currentRating) {
        h.setAttribute('fill', 'var(--accent)');
        h.setAttribute('stroke', 'var(--accent)');
      } else {
        h.setAttribute('fill', 'none');
        h.setAttribute('stroke', 'currentColor');
      }
    });
  });
});

btnSubmitComment.addEventListener('click', () => {
  const text = commentText.value.trim();
  const name = commentName.value.trim() || 'Guest User';
  
  if (!text) {
    showToast("Please enter a review first!");
    return;
  }
  
  const item = document.createElement('div');
  item.className = 'comment-item';
  
  let ratingHtml = '';
  for(let i=0; i<5; i++) {
    if(i < currentRating) {
      ratingHtml += `<svg class="heart-icon small" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    } else {
      ratingHtml += `<svg class="heart-icon small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    }
  }

  item.innerHTML = `
    <div class="comment-stars">${ratingHtml}</div>
    <p class="comment-body">"${text}"</p>
    <span class="comment-author">— ${name}</span>
  `;
  
  commentsList.insertBefore(item, commentsList.firstChild);
  
  commentText.value = '';
  commentName.value = '';
  currentRating = 5;
  hearts.forEach(h => {
    h.setAttribute('fill', 'var(--accent)');
    h.setAttribute('stroke', 'var(--accent)');
  });
  
  showToast("Review submitted successfully!");
});
