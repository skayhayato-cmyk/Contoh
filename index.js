// DOM Elements
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const sections = document.querySelectorAll('.section');
const sectionButtons = document.querySelectorAll('[data-section]');
const loginBtn = document.getElementById('loginBtn');
const spinBtn = document.getElementById('spinBtn');
const adminToggle = document.getElementById('adminToggle');
const generateCodeBtn = document.getElementById('generateCodeBtn');
const claimPrizeBtn = document.getElementById('claimPrizeBtn');
const musicToggle = document.getElementById('musicToggle');
const buyButtons = document.querySelectorAll('.buy-btn');
const petButtons = document.querySelectorAll('.pet-btn');

// Wheel variables
const names = ["Ali", "Beatriz", "Charles", "Diya", "Eric", "Fatima", "Gabriel", "Hanna", "Buah", "Jeruk", "Nanas", "Pisang"];
const colors = ["#f44336", "#2196f3", "#4caf50", "#ffeb3b", "#9c27b0", "#ff9800", "#00bcd4", "#e91e63", "#ff5722", "#3f51b5", "#ED8B10", "#ffc107"];
let startAngle = 0;
const arc = Math.PI / (names.length / 2);
let spinAngle = 0;
let spinTimeout = null;
let lastSoundIndex = -1;
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');

// Audio elements
const cajche = new Audio("https://www.soundjay.com/mechanical/sounds/click-02.mp3");
const spinStart = new Audio("https://www.soundjay.com/button/sounds/button-09.mp3");
const winSound = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
const loseSound = new Audio("https://www.soundjay.com/button/sounds/beep-07.mp3");
const bgMusic = new Audio("https://www.bensound.com/bensound-music/bensound-funkyelement.mp3");
bgMusic.loop = true;
let musicOn = false;

// Fruit chances
const fruitChances = {
  "Buah": 0.007,
  "Jeruk": 0.01,
  "Nanas": 0.011,
  "Pisang": 0.015
};

// Event Listeners
menuBtn.addEventListener('click', toggleSidebar);
sectionButtons.forEach(button => {
  button.addEventListener('click', () => showSection(button.dataset.section));
});
loginBtn.addEventListener('click', cekPW);
spinBtn.addEventListener('click', spin);
adminToggle.addEventListener('click', toggleAdmin);
generateCodeBtn.addEventListener('click', generatePW);
claimPrizeBtn.addEventListener('click', claimPrize);
musicToggle.addEventListener('click', toggleMusic);

// Shop buttons
buyButtons.forEach(button => {
  button.addEventListener('click', () => {
    orderWA(button.dataset.product, button.dataset.price);
  });
});

petButtons.forEach(button => {
  button.addEventListener('click', () => {
    petOrder(button.dataset.product, button.dataset.price);
  });
});

// Functions
function toggleSidebar() {
  sidebar.classList.toggle('active');
}

function showSection(id) {
  sections.forEach(s => s.classList.remove('active-section'));
  document.getElementById(id).classList.add('active-section');
  toggleSidebar();
}

function orderWA(produk, harga) {
  const username = document.getElementById('username').value;
  const payment = document.getElementById('payment').value;
  
  if (!username || !payment) {
    alert('Isi Username & pilih pembayaran!');
    return;
  }
  
  const nomorWA = "6283119176901";
  const pesan = `Halo Admin, saya mau beli:\n\n🪙 Produk: ${produk}\n💰 Harga: ${harga}\n👤 Username Roblox: ${username}\n💳 Payment: ${payment}\n\nTolong diproses ya 🙏`;
  window.location.href = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
}

function petOrder(produk, harga) {
  const username = document.getElementById('petUsername').value;
  const payment = document.getElementById('petPayment').value;
  
  if (!username || !payment) {
    alert('Isi Username & pilih pembayaran di Pet Shop!');
    return;
  }
  
  const nomorWA = "6283119176901";
  const pesan = `Halo Admin, saya mau beli (Pet Shop):\n\n🐾 Produk: ${produk}\n💰 Harga: ${harga}\n👤 Username Roblox: ${username}\n💳 Payment: ${payment}\n\nTolong diproses ya 🙏`;
  window.location.href = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
}

function drawWheel() {
  const outsideRadius = 180;
  const textRadius = 140;
  const insideRadius = 50;
  
  ctx.clearRect(0, 0, 400, 400);
  
  for (let i = 0; i < names.length; i++) {
    const angle = startAngle + i * arc;
    
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(200, 200, outsideRadius, angle, angle + arc, false);
    ctx.arc(200, 200, insideRadius, angle + arc, angle, true);
    ctx.fill();
    ctx.save();
    
    ctx.fillStyle = 'white';
    ctx.translate(200 + Math.cos(angle + arc / 2) * textRadius, 200 + Math.sin(angle + arc / 2) * textRadius);
    ctx.rotate(angle + arc / 2);
    
    const text = names[i];
    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
    ctx.restore();
  }
  
  ctx.fillStyle = 'gold';
  ctx.beginPath();
  ctx.moveTo(190, 20);
  ctx.lineTo(210, 20);
  ctx.lineTo(200, 60);
  ctx.fill();
}

function rotateWheel() {
  spinAngle *= 0.97;
  
  if (spinAngle <= 0.2) {
    clearTimeout(spinTimeout);
    
    const degrees = (startAngle * 180 / Math.PI) + 90;
    const arcd = arc * 180 / Math.PI;
    let index = Math.floor(((360 - (degrees % 360)) % 360) / arcd);
    index = (index + names.length) % names.length;
    
    const winner = names[index];
    const hasil = document.getElementById('hasil');
    
    if (fruitChances[winner]) {
      const roll = Math.random();
      
      if (roll <= fruitChances[winner]) {
        hasil.innerText = '🍀 JACKPOT!!! ' + winner;
        winSound.play();
        showPrizeModal(winner);
      } else {
        hasil.innerText = '😢 Hampir dapat ' + winner;
        loseSound.play();
      }
    } else {
      hasil.innerText = '🎉 Pemenang: ' + winner;
      winSound.play();
      showPrizeModal(winner);
    }
    
    localStorage.removeItem('memberCode');
    spinBtn.disabled = false;
    return;
  }
  
  startAngle += (spinAngle * Math.PI) / 180;
  
  const degrees = (startAngle * 180) / Math.PI + 90;
  const arcd = arc * 180 / Math.PI;
  const currentIndex = Math.floor(((360 - degrees % 360) % 360) / arcd);
  
  if (currentIndex !== lastSoundIndex) {
    cajche.currentTime = 0;
    cajche.play();
    lastSoundIndex = currentIndex;
  }
  
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function spin() {
  if (spinBtn.disabled) return;
  
  spinBtn.disabled = true;
  spinAngle = Math.random() * 30 + 40;
  lastSoundIndex = -1;
  spinStart.play();
  rotateWheel();
}

function cekPW() {
  const input = document.getElementById('userPW').value;
  const saved = localStorage.getItem('memberCode');
  
  if (!saved) {
    alert('Kode salah atau belum dibuat!');
    return;
  }
  
  const { code, expiry } = JSON.parse(saved);
  
  if (Date.now() > expiry) {
    alert('⏰ Kode expired!');
    localStorage.removeItem('memberCode');
    return;
  }
  
  if (input === code) {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('wheelBox').style.display = 'block';
    drawWheel();
  } else {
    alert('Kode salah!');
  }
}

function toggleAdmin() {
  const panel = document.getElementById('adminPanel');
  
  if (panel.style.display === 'block') {
    panel.style.display = 'none';
  } else {
    const pw = prompt('Masukkan password admin:');
    
    if (pw === 'Gobel123') {
      panel.style.display = 'block';
      loadAdminLogs();
    } else {
      alert('Password salah!');
    }
  }
}

function generatePW() {
  const code = Math.random().toString(36).slice(-6).toUpperCase();
  const expiry = Date.now() + (5 * 60 * 1000);
  
  document.getElementById('pwDisplay').innerText = code;
  localStorage.setItem('memberCode', JSON.stringify({ code, expiry }));
}

function showPrizeModal(prize) {
  const code = 'PRZ-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  
  document.getElementById('prizeText').innerText = 'Kamu mendapatkan: ' + prize;
  document.getElementById('prizeCode').innerText = 'Kode Klaim: ' + code;
  document.getElementById('prizeModal').style.display = 'flex';
  
  const logs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
  logs.unshift({ prize, code, time: new Date().toLocaleString() });
  localStorage.setItem('adminLogs', JSON.stringify(logs));
}

function claimPrize() {
  alert('✅ Hadiah berhasil diklaim! Screenshot dan hubungi admin.');
  document.getElementById('prizeModal').style.display = 'none';
}

function loadAdminLogs() {
  const logs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
  let html = '';
  
  logs.forEach(l => {
    html += `<div>🎁 ${l.prize}<br><small>${l.code} - ${l.time}</small></div><hr>`;
  });
  
  document.getElementById('adminLogs').innerHTML = html || '<i>Belum ada hadiah</i>';
}

function toggleMusic() {
  if (musicOn) {
    bgMusic.pause();
  } else {
    bgMusic.play();
  }
  
  musicOn = !musicOn;
}

// Initialize wheel
drawWheel();

// Hide wheelBox initially
document.getElementById('wheelBox').style.display = 'none';