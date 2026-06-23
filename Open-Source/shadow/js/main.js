// ================================================
// SHADOWHUB - MAIN.JS GLOBAL (refactor: uses ShadowHub core)
// ================================================

let allSoftware = [];

function handleDownload(name){
    const item = allSoftware.find(s => s.name === name) || { name };
    if(window.ShadowHub && ShadowHub.fakeDownload) ShadowHub.fakeDownload(item);
    else alert(`Téléchargement (demo): ${name}`);
}

document.addEventListener('DOMContentLoaded', async () => {
    if(window.ShadowHub && ShadowHub.ensureData){
        await ShadowHub.ensureData();
        allSoftware = ShadowHub.getAllSoftware() || [];
    } else {
        console.warn('ShadowHub core absent — fallback demo dataset');
        allSoftware = [
            { id: 1, name: "Windows 11 Activator HWID 2026", category: "cracks", description: "Activation permanente toutes versions", version: "2026.1", image: "https://picsum.photos/id/201/600/400", type: "warez" },
            { id: 2, name: "Adobe Creative Cloud 2026 Full", category: "cracks", description: "Suite complète + IA débloquée", version: "2026", image: "https://picsum.photos/id/301/600/400", type: "warez" },
            { id: 3, name: "Spotify Premium APK Mod", category: "android", description: "Sans pub, offline illimité", version: "9.1", image: "https://picsum.photos/id/401/600/400", type: "warez" },
            { id: 4, name: "Audacity", category: "music", description: "Éditeur audio professionnel", version: "3.6", image: "https://picsum.photos/id/1015/600/400", type: "opensource" }
        ];
    }

    if(document.getElementById('softwareGrid')){
        if(typeof renderCards === 'function') renderCards('softwareGrid', allSoftware);
    }
    if(document.getElementById('latestGrid')){
        if(typeof renderCards === 'function') renderCards('latestGrid', allSoftware.slice(0,8));
    }

    // Search binding — prefer ShadowHub.attachSearch if available
    const searchInput = document.getElementById('searchInput');
    if(searchInput){
        if(window.ShadowHub && ShadowHub.attachSearch) ShadowHub.attachSearch(searchInput, 'softwareGrid');
        else searchInput.addEventListener('input', (e)=>{
            const term = e.target.value.toLowerCase();
            const filtered = allSoftware.filter(s => (s.name && s.name.toLowerCase().includes(term)) || (s.description && s.description.toLowerCase().includes(term)) );
            if(typeof renderCards === 'function') renderCards('softwareGrid', filtered.slice(0,36));
        });
    }

    console.log('%cShadowHub Main.js chargé (refactor) - Poste de pilotage actif', 'color: #ef4444; font-weight: bold;');
});