const discoveryData = [
    {
        year: 1900,
        name: "Riggs Hill, Colorado (USA)",
        desc: "Sampel asli (Holotype) ditemukan oleh Elmer Riggs.",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Brachiosaurus_altithorax_holotype_humerus.jpg/800px-Brachiosaurus_altithorax_holotype_humerus.jpg",
        museum: "Field Museum of Natural History",
        height: "13m+",
        x: "20%", y: "45%"
    },
    {
        year: 1909,
        name: "Tendaguru, Tanzania (Berlin Display)",
        desc: "Kerangka dinosaurus terpasang tertinggi di dunia.",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Brachiosaurus_Museum_f%C3%BCr_Naturkunde_Berlin.jpg/800px-Brachiosaurus_Museum_f%C3%BCr_Naturkunde_Berlin.jpg",
        museum: "Museum für Naturkunde, Berlin",
        height: "13.2m",
        x: "58%", y: "70%"
    }
];

let isGlossaryOpen = false;

function toggleGlossary() {
    const sidebar = document.getElementById('glossarySidebar');
    if (!isGlossaryOpen) {
        sidebar.style.right = "0";
        isGlossaryOpen = true;
    } else {
        sidebar.style.right = "-300px";
        isGlossaryOpen = false;
    }
}

const container = document.querySelector('.apex-cards-container');
const hint = document.getElementById('scroll-hint');

if (container && hint) {
    container.addEventListener('scroll', function() {
        // Jika user sudah menggeser lebih dari 20 pixel, sembunyikan petunjuk
        if (container.scrollLeft > 20) {
            hint.style.opacity = '0';
            hint.style.transition = '0.5s';
            setTimeout(() => hint.style.display = 'none', 500);
        }
    }, { passive: true });
}

function openTimeline(name, era, years, progressWidth) {
    const overlay = document.getElementById('timelineOverlay');
    document.getElementById('ovName').innerText = name;
    document.getElementById('ovEra').innerText = era;
    document.getElementById('ovYears').innerText = years;
    
    const progressBar = document.getElementById('ovProgress');
    progressBar.style.width = "0%"; // Reset progress

    overlay.style.display = "flex";
    setTimeout(() => {
        overlay.style.opacity = "1";
        progressBar.style.width = progressWidth; // Animasi bar berjalan
    }, 50);
}

function closeTimeline() {
    const overlay = document.getElementById('timelineOverlay');
    overlay.style.opacity = "0";
    setTimeout(() => { overlay.style.display = "none"; }, 400);
}

function updateMap(year) {
    document.getElementById('display-year').innerText = "Tahun: " + year;
    const pinsContainer = document.getElementById('discovery-pins');
    const infoContainer = document.getElementById('discovery-info');
    const galleryContainer = document.getElementById('museum-gallery');
    
    pinsContainer.innerHTML = ""; 
    galleryContainer.innerHTML = ""; // Bersihkan galeri
    galleryContainer.style.opacity = "0";

    discoveryData.forEach(data => {
        if (year >= data.year) {
            // ... (Kode PIN Peta tetap sama seperti sebelumnya) ...
            
            // 📸 TAMBAHKAN FOTO KE GALERI (Upgrade)
            const photoCard = document.createElement('div');
            photoCard.style = "background:rgba(80,200,120,0.1); border:1px solid #50c878; border-radius:10px; padding:10px; cursor:pointer; position:relative;";
            photoCard.onclick = () => {
                document.getElementById('photoModal').style.display='block';
                document.getElementById('modalImg').src = data.img;
            };
            photoCard.innerHTML = `
                <img src="${data.img}" style="width:100%; height:150px; object-fit:cover; border-radius:5px;">
                
                <div style="position:absolute; top:15px; right:15px; width:1.7px; height:13px; background:#fff; border-radius:1px; box-shadow:0 0 5px #fff;"></div>
                
                <p style="font-size:11px; color:#50c878; margin-top:8px; font-weight:bold;">${data.museum}</p>
                <p style="font-size:10px; opacity:0.7;">Klik untuk memperbesar & lihat skala</p>
            `;
            galleryContainer.appendChild(photoCard);
            galleryContainer.style.opacity = "1";
            
            // ... (Kode update info tetap sama) ...
        
    

            
            // Update Info Text
            infoContainer.innerHTML = `<h4 style="color:#50c878;">${data.name}</h4><p>${data.desc}</p>`;
        }
    });
}

function checkAnswer(btn, isCorrect) {
    const resultDiv = document.getElementById('quiz-result');
    const allBtns = document.querySelectorAll('.quiz-btn');

    // Matikan semua tombol setelah menjawab
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
        btn.style.background = "#50c878";
        btn.style.color = "#0a140a";
        resultDiv.innerHTML = "<span style='color: #50c878;'>IWAE! JAWABAN ANDA BENAR! ✨</span>";
        
        // ✨ EFEK KEMBANG API EMERALD (Vibration & Flash)
        document.body.classList.add('correct-flash');
        setTimeout(() => document.body.classList.remove('correct-flash'), 500);
        
        // Suara kemenangan (opsional, jika Anda punya file audio)
        // new Audio('assets/sfx/correct.mp3').play();
    } else {
        btn.style.background = "#ff4d4d";
        btn.style.border = "1px solid #ff4d4d";
        btn.style.color = "#fff";
        resultDiv.innerHTML = "<span style='color: #ff4d4d;'>SALAH! COBA PERHATIKAN SKALA LAGI.</span>";
        
        // Reset kuis setelah 2 detik agar bisa coba lagi
        setTimeout(() => {
            allBtns.forEach(b => {
                b.disabled = false;
                b.style.background = "transparent";
                b.style.color = "#50c878";
                b.style.border = "1px solid #50c878";
            });
            resultDiv.innerHTML = "";
        }, 2000);
    }
}

// 🔄 Jalankan fungsi ini saat halaman dimuat
window.onload = function() {
    initPaleoMusic(); // Musik Anda
    checkBadgeStatus(); // Cek apakah lencana sudah didapat
};

function checkBadgeStatus() {
    // Cek di Local Storage laptop
    if (localStorage.getItem('brachioBadge') === 'true') {
        document.getElementById('emerald-badge-container').style.display = 'flex';
    }
}

function checkAnswer(btn, isCorrect) {
    // ... (Kode kuis lama Anda) ...

    if (isCorrect) {
        // ... (Kode efek kemenangan kuis lama Anda) ...
        
        // 🏆 JIKA JAWABAN BENAR -> Buka Lencana!
        unlockBadge();
    } 
    // ... (Kode kuis lama Anda) ...
}

function unlockBadge() {
    // 1. Simpan permanen di Local Storage
    localStorage.setItem('brachioBadge', 'true');
    
    // 2. Tampilkan notifikasi kemenangan
    document.getElementById('badge-notif').style.display = 'block';
    
    // Suara notifikasi lencana (opsional)
    // new Audio('assets/sfx/badge.mp3').play();
}

function closeBadgeNotif() {
    document.getElementById('badge-notif').style.display = 'none';
    checkBadgeStatus(); // Refresh tampilan lencana di pojok
}

function checkBadgeStatus() {
    if (localStorage.getItem('brachioBadge') === 'true') {
        // Tampilkan badge di pojok atas
        document.getElementById('emerald-badge-container').style.display = 'flex';
        // Buka slot di Hall of Achievements
        const slot = document.getElementById('slot-brachio');
        if(slot) slot.classList.remove('locked'), slot.classList.add('unlocked');
    }
}

function checkSeaAnswer(btn, isCorrect) {
    const resultDiv = document.getElementById('sea-quiz-result');
    const allBtns = document.querySelectorAll('.sea-btn');

    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
        btn.style.background = "#00d4ff";
        btn.style.color = "#0a140a";
        resultDiv.innerHTML = "<span style='color: #00d4ff;'>IWAE! ANDA ADALAH PENGUASA LAUTAN! 🌊✨</span>";
        
        // Simpan Achievement
        localStorage.setItem('ammoniteBadge', 'true');
        
        // Update Hall of Achievements
        setTimeout(() => {
            const slot = document.getElementById('slot-ammonite');
            if(slot) {
                slot.classList.remove('locked');
                slot.classList.add('unlocked');
                slot.style.color = "#00d4ff"; // Warna biru samudera
                slot.style.textShadow = "0 0 10px #00d4ff";
            }
        }, 1000);
    } else {
        btn.style.background = "#ff4d4d";
        resultDiv.innerHTML = "<span style='color: #ff4d4d;'>SALAH! COBA INGAT EVOLUSI SEFALOPODA.</span>";
        setTimeout(() => {
            allBtns.forEach(b => {
                b.disabled = false;
                b.style.background = "transparent";
            });
            resultDiv.innerHTML = "";
        }, 2000);
    }
}

// Update fungsi checkBadgeStatus untuk mengecek kedua lencana
function checkBadgeStatus() {
    // Cek Brachio
    if (localStorage.getItem('brachioBadge') === 'true') {
        const slot = document.getElementById('slot-brachio');
        if(slot) slot.classList.remove('locked'), slot.classList.add('unlocked');
    }
    // Cek Ammonite
    if (localStorage.getItem('ammoniteBadge') === 'true') {
        const slot = document.getElementById('slot-ammonite');
        if(slot) {
            slot.classList.remove('locked');
            slot.classList.add('unlocked');
            slot.style.color = "#00d4ff";
        }
    }
}
/**
 * EMERALD NEXUS - PALEONTOLOGY INITIALIZER
 * Optimized for: Icon Stability & Fossil Data Loading
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("🦖 [SYSTEM]: Paleontology Sector - Core Online.");

    // 1. INISIALISASI IKON (LUCIDE)
    // Penting: Dipanggil pertama agar UI tidak terlihat kosong
    if (window.lucide) {
        lucide.createIcons();
        console.log("🦴 [SYSTEM]: Sacred Icons Restored.");
    } else {
        console.error("⚠️ [ERROR]: Lucide script not detected!");
    }

    // 2. AKTIFKAN SISTEM SEARCH & FILTER FOSIL
    initFossilFilter();

    // 3. AKTIFKAN DUST PARTICLES (EFEK DEBU PURBA)
    if (typeof initDustParticles === 'function') {
        initDustParticles();
    }

    // 4. KONEKSI KE QUICK-SEARCH (Ctrl + K)
    // Memastikan Global Search tetap bisa diakses dari sini
    initGlobalSearchBridge();

    // 5. PENYAMBUTAN OVERLORD
    if (typeof addAdminLog === 'function') {
        addAdminLog("Accessing Paleontology Sector... Welcome, Anwarhu.");
    }
});

/** 🧪 FUNGSI FILTER FOSIL (CONTOH) **/
function initFossilFilter() {
    const searchBar = document.getElementById('fossilSearch');
    if (!searchBar) return;

    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.paleo-item');
        
        cards.forEach(card => {
            const name = card.querySelector('h3').innerText.toLowerCase();
            card.style.display = name.includes(query) ? 'block' : 'none';
        });
    });
}

/** 🧪 JEMBATAN KE GLOBAL SEARCH **/
function initGlobalSearchBridge() {
    // Memastikan Ctrl + K tetap aktif di halaman ini
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            // Trigger overlay yang ada di HTML
            const overlay = document.getElementById('searchOverlay');
            if (overlay) overlay.style.display = 'flex';
        }
    });
}