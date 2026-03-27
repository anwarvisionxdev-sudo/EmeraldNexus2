/**
 * EMERALD NEXUS - UNIFIED CORE SYSTEM
 * Architecture: Anwarhu & Sento Kiriyu
 * Version: 5.1.3 (Layout Stabilized & Thumbnail Optimized)
 */

// ==========================================
// --- 1. GLOBAL DATABASE & STATE ---
// ==========================================
const playlist = [
    { name: "snowfall", src: "snowfall.mp3.mp3", cover: "" }
];

const sectors = [
    { name: 'HUB / MAIN', url: 'Modern-X.HTML', icon: 'layout-grid' },
    { name: 'ADMIN DASHBOARD', url: 'admin.html', icon: 'settings' },
    { name: 'PALEONTOLOGY', url: 'paleo.html', icon: 'skull' },
    { name: 'ZOOLOGY', url: 'zoo.html', icon: 'paw-print' },
    { name: 'AQUATIC', url: 'aqua.html', icon: 'waves' },
    { name: 'ASTRONOMY', url: 'astro.html', icon: 'orbit' },
    { name: 'GALAXY', url: 'galaxy.html', icon: 'milky-way' },
    { name: 'KEPUNAHAN MASSAL', id: 'kepunahan', icon: 'alert-triangle' }
];

let trackIndex = 0;

// ==========================================
// --- 2. CORE INITIALIZER ---
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("%c 💎 [SYSTEM]: Bootstraping Emerald Core...", "color: #00ff88; font-weight: bold;");

    // Urutan Eksekusi yang Aman & Tidak Merusak Layout
    safeInit(handleWelcomeScreen); 
    safeInit(initNavigation); 
    safeInit(initGlobalListeners);
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
// --- 3. UI & NAVIGATION (Anti-Shift) ---
// ==========================================

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
                
                // --- PERBAIKAN LAYOUT DISINI ---
                if (mainContent) {
                    // Gunakan '' agar browser memakai display asli dari CSS (Flex/Grid)
                    mainContent.style.display = ''; 
                    setTimeout(() => mainContent.style.opacity = '1', 50);
                }
                
                setTimeout(() => {
                    welcome.style.display = 'none';
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
    if (sidebar) sidebar.classList.toggle('active');
};

function handleSearch() {
    const input = document.getElementById('searchInput');
    const suggestBox = document.getElementById('suggestBox');
    if (!input || !suggestBox) return;

    const query = input.value.toLowerCase();
    suggestBox.innerHTML = ''; 

    if (query.length > 0) {
        const matches = sectors.filter(s => s.name.toLowerCase().includes(query));
        if (matches.length > 0) {
            suggestBox.style.display = 'block';
            matches.forEach(item => {
                const div = document.createElement('div');
                div.className = "suggestion-item";
                div.innerHTML = `<i data-lucide="${item.icon || 'circle'}"></i> <span>${item.name}</span>`;
                div.onclick = () => {
                    if (item.url) window.location.href = item.url;
                    else if (item.id) document.getElementById(item.id).scrollIntoView({ behavior: 'smooth' });
                    input.value = item.name;
                    suggestBox.style.display = 'none';
                };
                suggestBox.appendChild(div);
            });
            if (window.lucide) lucide.createIcons();
        } else { suggestBox.style.display = 'none'; }
    } else { suggestBox.style.display = 'none'; }
}

// ==========================================
// --- 4. AUDIO ENGINE (With Thumbnail Support) ---
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
    
    // UPDATE THUMBNAIL SMOOTH
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
        audio.play().then(() => syncMusicUI(true));
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
    audio.play().then(() => syncMusicUI(true));
};

window.prevTrack = () => {
    trackIndex = (trackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(trackIndex);
    const audio = document.getElementById('mainAudio');
    audio.play().then(() => syncMusicUI(true));
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
    const clickSfx = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    clickSfx.volume = 0.1;
    document.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, a, .suggestion-item')) {
            clickSfx.currentTime = 0;
            clickSfx.play().catch(()=>{});
        }
    });
}

function showNotify(title, msg) {
    console.log(`🔔 [NOTIFY]: ${title} - ${msg}`);
}