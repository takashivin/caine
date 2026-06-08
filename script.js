// ==========================================
// SETTINGAN BOLA UTAMA (Merah Depan)
// ==========================================
const jarakGeserUtama = 3;        
const kecepatanUpdateUtama = 80; 
const efekMelarUtama = 1;        

// ==========================================
// SETTINGAN BOLA GELAP (Merah Tua Belakang)
// ==========================================
const jarakGeserDark = 2.25;         
const kecepatanUpdateDark = 60;  
const efekMelarDark = 1;        

// ==========================================
// LOGIKA SCRIPT BAWAAN & ANIMASI BOLA
// ==========================================
const orb = document.querySelector('.orb');
const orbDark = document.querySelector('.orb-dark');
const orbWrapper = document.querySelector('.orb-wrapper');

let baseMoveX = 0; // Untuk nyimpen posisi bola utama biar bola dark bisa 'keparent'
let baseMoveY = 0;
let isPermanentlyBroken = false; 

function updateOrbUtama() {
    // Kalau udah rusak, agresivitas nambah 15% (dikali 1.15)
    const agresi = isPermanentlyBroken ? 1.15 : 1;

    const scale = 0.985 + (Math.random() * 0.06 * efekMelarUtama * agresi);
    const stretchX = 0.995 + (Math.random() * 0.05 * efekMelarUtama * agresi);
    const stretchY = 0.995 + (Math.random() * 0.04 * efekMelarUtama * agresi);
    
    // Simpan pergerakan utama
    baseMoveX = (Math.random() - 0.5) * jarakGeserUtama * 2 * agresi;
    baseMoveY = (Math.random() - 0.5) * jarakGeserUtama * 2 * agresi;
    
    orb.style.transform = `translate(${baseMoveX}px, ${baseMoveY}px) scale(${scale}) scaleX(${stretchX}) scaleY(${stretchY})`;
}

function updateOrbDark() {
    const agresi = isPermanentlyBroken ? 1.15 : 1;

    const darkScale = 0.985 + (Math.random() * 0.07 * efekMelarDark * agresi);
    const darkStretchX = 0.995 + (Math.random() * 0.05 * efekMelarDark * agresi);
    const darkStretchY = 0.995 + (Math.random() * 0.05 * efekMelarDark * agresi);
    
    // Bola dark ditambahkan baseMoveX & Y supaya 'keparent' ke pergerakan bola utama
    const darkMoveX = baseMoveX + ((Math.random() - 0.5) * jarakGeserDark * 2 * agresi);
    const darkMoveY = baseMoveY + ((Math.random() - 0.5) * jarakGeserDark * 2 * agresi);

    orbDark.style.transform = `translate(${darkMoveX}px, ${darkMoveY}px) scale(${darkScale}) scaleX(${darkStretchX}) scaleY(${darkStretchY})`;
}

setInterval(updateOrbUtama, kecepatanUpdateUtama);
setInterval(updateOrbDark, kecepatanUpdateDark);


// ==========================================
// TAMBAHAN: LOGIKA KLIK & BANGUN RUANG
// ==========================================

let spamMeter = 0;

// Menurunkan spam meter secara perlahan kalau belum rusak
setInterval(() => {
    if (spamMeter > 0 && !isPermanentlyBroken) spamMeter -= 5;
}, 200);

// Palet warna Neon (Hijau, Merah, Biru, Ungu, Kuning, Cyan)
const shapeColors = ['#00ff00', '#ff0000', '#0044ff', '#8a2be2', '#ffff00', '#00ffff'];

// Path SVG untuk bangun sempurna
const perfectShapes = [
    "M 50 15 L 85 85 L 15 85 Z", // Segitiga
    "M 20 20 L 80 20 L 80 80 L 20 80 Z", // Kotak
    "M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z", // Segienam
    "M 50 10 L 61 35 L 88 35 L 66 54 L 75 80 L 50 64 L 25 80 L 34 54 L 12 35 L 39 35 Z", // Bintang
    "M 50, 10 a 40,40 0 1,0 0,80 a 40,40 0 1,0 0,-80" // Lingkaran
];

// Generator bentuk abstract/acak (menyerupai glitch)
function generateAbstractShape() {
    let points = [];
    let numPoints = Math.floor(Math.random() * 5) + 4; // 4 sampai 8 titik
    for(let i = 0; i < numPoints; i++) {
        let angle = (i / numPoints) * Math.PI * 2 + (Math.random() * 0.5);
        let radius = 15 + Math.random() * 35; 
        let x = 50 + Math.cos(angle) * radius;
        let y = 50 + Math.sin(angle) * radius;
        points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')} Z`;
}

// Fungsi utama untuk memunculkan shape
function spawnShape(isAbstract) {
    const shapeWrapper = document.createElement('div');
    shapeWrapper.classList.add('shape-wrapper');

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.style.width = "50px";
    svg.style.height = "50px";

    const color = shapeColors[Math.floor(Math.random() * shapeColors.length)];
    svg.style.filter = `drop-shadow(0 0 3px ${color}) drop-shadow(0 0 8px ${color})`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", "3");
    path.setAttribute("fill", "transparent");
    path.setAttribute("stroke-linejoin", "round");

    if (isAbstract) {
        path.setAttribute("d", generateAbstractShape());
    } else {
        path.setAttribute("d", perfectShapes[Math.floor(Math.random() * perfectShapes.length)]);
    }

    svg.appendChild(path);
    shapeWrapper.appendChild(svg);
    document.body.appendChild(shapeWrapper);

    const angle = Math.random() * Math.PI * 2;
    const distance = 150 + Math.random() * 250; 
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const rotation = (Math.random() - 0.5) * 500; 

    const animation = shapeWrapper.animate([
        { transform: 'translate(-50%, -50%) scale(0.3) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.2) rotate(${rotation}deg)`, opacity: 0 }
    ], {
        duration: 1800 + Math.random() * 800, 
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)' 
    });

    animation.onfinish = () => shapeWrapper.remove();
}

// Event listener saat bola ditekan
orbWrapper.addEventListener('mousedown', () => {
    if (!isPermanentlyBroken) {
        spamMeter += 25; 
        
        if (spamMeter > 60) {
            isPermanentlyBroken = true;
        }
    }

    const isAbstractBurst = isPermanentlyBroken;
    const numShapes = Math.floor(Math.random() * 3) + 4; 
    let delayWaktu = 0; 

    for (let i = 0; i < numShapes; i++) {
        setTimeout(() => {
            spawnShape(isAbstractBurst);
        }, delayWaktu);
        
        delayWaktu += Math.floor(Math.random() * (600 - 350 + 1)) + 350; 
    }
});