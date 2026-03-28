/**
 * EMERALD NEXUS - UNIFIED CORE SYSTEM
 * Architecture: Anwarhu & Sento Kiriyu
 * Version: 5.1.4 (Sound Activated & Logic Stabilized)
 */

// ==========================================
// --- 1. GLOBAL DATABASE & STATE ---
// ==========================================
const playlist = [
    { name: "snowfall", src: "snowfall.mp3", cover: "snowfall.webp" },
];

// 1. DATA DATABASE PALSU (Sesuai Kategori Nexus Anda)
const universeDatabase = [
    { name: "Tyrannosaurus Rex", category: "Paleo-Dino", icon: "fa-dragon" },
    { name: "Megalodon", category: "Sea Creatures", icon: "fa-fish" },
    { name: "Milky Way Galaxy", category: "Galaxy", icon: "fa-meteor" },
    { name: "Paleozoic Era Timeline", category: "Timeline", icon: "fa-hourglass-half" },
    { name: "Cyanobacteria", category: "Micobacteria", icon: "fa-microscope" },
    { name: "Proxima Centauri", category: "Astronomy", icon: "fa-star" },
    { name: "Triceratops Fossil", category: "Fossils", icon: "fa-bone" },
    { name: "Ancient Ferns", category: "Paleo-Botany", icon: "fa-leaf" },
    { name: "Marine Reptiles", category: "Marine Life", icon: "fa-water" }
];

let trackIndex = 0;

// Database Efek Suara (Unified)
const nexusSfx = {
    welcome: new Audio('https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3'),
    click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    transition: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')
};
Object.values(nexusSfx).forEach(sfx => sfx.volume = 0.3);

// ==========================================
// --- 2. CORE INITIALIZER ---
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("%c 💎 [SYSTEM]: Bootstraping Emerald Core...", "color: #00ff88; font-weight: bold;");

    safeInit(handleWelcomeScreen); 
    safeInit(initNavigation); 
    safeInit(initGlobalListeners);
    safeInit(initNavigationSearch);
    safeInit(initMusicPlayer);
    safeInit(initEnvironmentalSensors);
    safeInit(initPerformanceMonitor);
    safeInit(initAdminTerminal);
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
});

function safeInit(fn) {
    try { fn(); } catch (e) { console.warn(`⚠️ [SKIP]: ${fn.name} failed.`, e); }
}

// ==========================================
// --- 3. UI & NAVIGATION ---
// ==========================================

function nexusSpeak(message) {
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'en-US';
        utter.pitch = 1.2;
        utter.rate = 1.0;
        synth.speak(utter);
    }
}

function handleWelcomeScreen() {
    const bar = document.getElementById('progress-bar');
    const welcome = document.getElementById('welcomeScreen');
    const mainContent = document.getElementById('main-content');
    if (!welcome) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 3;
        if (bar) bar.style.width = Math.min(progress, 100) + "%";
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                welcome.classList.add('fade-out');
                if (mainContent) {
                    mainContent.style.display = ''; 
                    setTimeout(() => mainContent.style.opacity = '1', 50);
                }
                setTimeout(() => {
                    welcome.style.display = 'none';
                    nexusSfx.welcome.play().catch(()=>{});
                    nexusSpeak("Welcome to Emerald Nexus, Hub Mode Activated");
                    showNotify("System Ready", "Welcome back, Anwarhu");
                }, 800);
            }, 500);
        }
    }, 40);
}

function initNavigation() {
    const input = document.getElementById('searchInput');
    if (input) input.addEventListener('input', handleSearch);
}

window.toggleSidebar = () => {
    const sidebar = document.getElementById('navSidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
        nexusSfx.transition.play().catch(()=>{});
    }
};

function initNavigationSearch() {
    // 1. Inisialisasi Elemen Internal
    const searchInput = document.getElementById('nexus-search');
    const suggestionBox = document.getElementById('suggestion-box');
    
    // Proteksi: Jika elemen tidak ditemukan, hentikan sirkuit agar tidak error
    if (!searchInput || !suggestionBox) {
        console.warn("⚠️ [SEARCH]: Required elements not found. Skipping init.");
        return;
    }

    // 2. Event Listener untuk Input User
    searchInput.addEventListener('input', (e) => {
        let userData = e.target.value; 
        let filteredArray = [];
        
        if (userData) {
            // Filter data dari database (Pastikan universeDatabase sudah ada secara global)
            filteredArray = universeDatabase.filter((data) => {
                return data.name.toLowerCase().includes(userData.toLowerCase());
            });

            // Mapping Data menjadi Template HTML
            const htmlList = filteredArray.map((data) => {
                // Menambahkan fungsi 'onclick' secara langsung di template string
                return `<div class="suggestion-item" onclick="selectSearchItem('${data.name}')">
                            <i class="fas ${data.icon || 'fa-star'}" style="color: #00d2ff; width: 20px;"></i>
                            <span>${data.name}</span>
                            <small style="color: #00ff88; margin-left: auto; opacity: 0.7;">${data.category}</small>
                        </div>`;
            });

            suggestionBox.classList.add("active"); 
            renderSuggestions(htmlList, userData);
        } else {
            suggestionBox.classList.remove("active");
        }
    });

    // 3. Fungsi Internal untuk Merender (Local Function)
    function renderSuggestions(list, query) {
        if (!list.length) {
            suggestionBox.innerHTML = `<div class="no-result"><i class="fas fa-exclamation-triangle"></i> No results for '${query}'</div>`;
        } else {
            suggestionBox.innerHTML = list.join('');
        }
    }
}

/**
 * 4. FUNGSI GLOBAL UNTUK MEMILIH ITEM
 * (Dibuat global agar bisa diakses oleh atribut 'onclick' dari HTML string)
 */
window.selectSearchItem = (name) => {
    const input = document.getElementById('nexus-search');
    const box = document.getElementById('suggestion-box');
    
    if (input && box) {
        input.value = name;
        box.classList.remove("active");
        
        // Bonus: Suara Konfirmasi (Smart Brain Style)
        if (typeof nexusSpeak === 'function') {
            nexusSpeak(`Accessing ${name}`);
        }
    }
};

// ==========================================
// --- EKSEKUSI PADA DOM CONTENT LOADED ---
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    safeInit(initNavigationSearch); // Memanggil fungsi init yang baru!
});

// ==========================================
// --- 4. AUDIO ENGINE (Music Player) ---
// ==========================================

function initMusicPlayer() {
    const audio = document.getElementById('mainAudio');
    if (!audio) return;

    trackIndex = parseInt(localStorage.getItem('em_track')) || 0;
    const savedTime = parseFloat(localStorage.getItem('em_time')) || 0;
    
    loadTrack(trackIndex);
    audio.currentTime = savedTime;

    audio.addEventListener('timeupdate', () => {
        updateMusicProgress();
        localStorage.setItem('em_time', audio.currentTime);
    });

    audio.addEventListener('ended', () => window.nextTrack());
    
    if (localStorage.getItem('em_playing') === 'true') {
        audio.play().then(() => syncMusicUI(true)).catch(() => syncMusicUI(false));
    }
}

function loadTrack(index) {
    const audio = document.getElementById('mainAudio');
    const thumb = document.getElementById('musicThumb');
    const title = document.getElementById('trackTitle');
    if (!audio || !playlist[index]) return;

    trackIndex = index;
    audio.src = encodeURI(playlist[trackIndex].src);
    if (title) title.innerText = playlist[trackIndex].name;
    
    if (thumb) {
        thumb.style.filter = 'blur(5px)';
        thumb.style.opacity = '0.5';
        setTimeout(() => {
            thumb.src = playlist[trackIndex].cover;
            thumb.style.filter = 'blur(0px)';
            thumb.style.opacity = '1';
        }, 200);
    }
    localStorage.setItem('em_track', trackIndex);
}

window.togglePlay = () => {
    const audio = document.getElementById('mainAudio');
    if (!audio) return;
    if (audio.paused) {
        audio.play().then(() => {
            syncMusicUI(true);
            nexusSpeak("Music opened");
        });
        localStorage.setItem('em_playing', 'true');
    } else {
        audio.pause();
        syncMusicUI(false);
        localStorage.setItem('em_playing', 'false');
    }
};

window.nextTrack = () => {
    trackIndex = (trackIndex + 1) % playlist.length;
    loadTrack(trackIndex);
    const audio = document.getElementById('mainAudio');
    audio.play().then(() => {
        syncMusicUI(true);
        nexusSpeak("Playing " + playlist[trackIndex].name);
    });
};

window.prevTrack = () => {
    trackIndex = (trackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(trackIndex);
    const audio = document.getElementById('mainAudio');
    audio.play().then(() => {
        syncMusicUI(true);
        nexusSpeak("Playing " + playlist[trackIndex].name);
    });
};

function updateMusicProgress() {
    const audio = document.getElementById('mainAudio');
    const bar = document.getElementById('progressBar');
    const currT = document.getElementById('currentTime');
    const durT = document.getElementById('totalDuration');

    if (audio && !isNaN(audio.duration)) {
        if (bar) bar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        if (currT) currT.innerText = formatTime(audio.currentTime);
        if (durT) durT.innerText = formatTime(audio.duration);
    }
}

function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
}

// ==========================================
// --- 5. SYSTEM MONITORS & UTILS ---
// ==========================================

function updateStat(id, value, unit, max = 100) {
    const valEl = document.getElementById(id + '-v');
    const barEl = document.getElementById(id + '-b');
    if (valEl) valEl.innerText = value + unit;
    if (barEl) {
        const percent = (parseFloat(value) / max) * 100;
        barEl.style.width = percent + "%";
        barEl.style.background = percent > 85 ? "#ff4444" : "#00ff88";
    }
}

function initPerformanceMonitor() {
    setInterval(() => {
        updateStat('cpu', Math.floor(Math.random() * 40 + 10), '%');
        updateStat('gpu', Math.floor(Math.random() * 150 + 50), 'W', 250);
        updateStat('mem', (Math.random() * 20 + 40).toFixed(1), 'ns', 100);
        updateStat('storage', 74, '%');
    }, 3000);
}

function initEnvironmentalSensors() {
    const clockEl = document.getElementById('live-clock');
    if (clockEl) setInterval(() => clockEl.innerText = new Date().toLocaleTimeString('id-ID'), 1000);
}

function initAdminTerminal() {
    const term = document.getElementById('terminal-content');
    if (!term) return;
    setInterval(() => {
        const log = document.createElement('div');
        log.innerText = `> ${["CORE STABLE", "SYNC OK", "FOSSIL SCAN..."][Math.floor(Math.random()*3)]}`;
        term.appendChild(log);
        if (term.children.length > 5) term.removeChild(term.firstChild);
    }, 4000);
}

function syncMusicUI(playing) {
    const btn = document.getElementById('playBtn');
    if (btn) btn.innerHTML = playing ? '<i data-lucide="pause"></i>' : '<i data-lucide="play"></i>';
    if (window.lucide) lucide.createIcons();
}

function initGlobalListeners() {
    document.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, a, .suggestion-item')) {
            nexusSfx.click.currentTime = 0;
            nexusSfx.click.play().catch(()=>{});
        }
    });
}

function showNotify(title, msg) {
    console.log(`🔔 [NOTIFY]: ${title} - ${msg}`);
}
    
