let isMusicPlaying = false;
const audio = document.getElementById('backgroundMusic');

// Gestion du bouton de musique
document.getElementById('toggleMusic').addEventListener('click', function() {
    if (isMusicPlaying) {
        audio.pause();
        isMusicPlaying = false;
    } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                isMusicPlaying = true;
            })
            .catch(error => {
                console.log("Erreur de lecture audio:", error);
                isMusicPlaying = false;
            });
        }
    }
    updateMusicButton();
});

// Gestion des événements audio
audio.addEventListener('ended', function() {
    audio.currentTime = 0;
    audio.play();
});

audio.addEventListener('error', function(e) {
    console.log("Erreur audio:", e);
    isMusicPlaying = false;
    updateMusicButton();
});

function updateMusicButton() {
    const button = document.getElementById('toggleMusic');
    const icon = button.querySelector('.music-icon');
    const text = button.querySelector('.music-text');
    
    if (isMusicPlaying) {
        icon.textContent = '🔇';
        text.textContent = 'Pause';
        button.classList.add('playing');
    } else {
        icon.textContent = '🎵';
        text.textContent = 'Musique';
        button.classList.remove('playing');
    }
}

// Initialisation des signatures
let artemisPad, heavenPad;

function initSignaturePads() {
    const artemisCanvas = document.getElementById('artemisSignature');
    const heavenCanvas = document.getElementById('heavenSignature');

    // Configuration des canvas
    function setupCanvas(canvas) {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }

    setupCanvas(artemisCanvas);
    setupCanvas(heavenCanvas);

    // Initialisation des pads de signature
    artemisPad = new SignaturePad(artemisCanvas, {
        backgroundColor: 'rgba(45, 27, 59, 0.95)',
        penColor: '#ffb6c1',
        minWidth: 2,
        maxWidth: 3.5,
        throttle: 16,
        velocityFilterWeight: 0.7
    });

    heavenPad = new SignaturePad(heavenCanvas, {
        backgroundColor: 'rgba(45, 27, 59, 0.95)',
        penColor: '#ffb6c1',
        minWidth: 2,
        maxWidth: 3.5,
        throttle: 16,
        velocityFilterWeight: 0.7
    });

    // Gestion du redimensionnement
    window.addEventListener('resize', function() {
        setupCanvas(artemisCanvas);
        setupCanvas(heavenCanvas);
    });
}

// Fonction pour valider les signatures
window.validateSignatures = function() {
    launchConfetti();
    // Sauvegarder les signatures
    localStorage.setItem('artemisSignature', artemisPad.toDataURL());
    localStorage.setItem('heavenSignature', heavenPad.toDataURL());
    // Changer le texte du bouton
    const validateButton = document.getElementById('validateButton');
    validateButton.textContent = 'Validé !';
    validateButton.style.background = 'var(--secondary-color)';
};

// Fonction pour lancer les confettis
function launchConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

// Charger les signatures sauvegardées
function loadSignatures() {
    const artemisData = localStorage.getItem('artemisSignature');
    const heavenData = localStorage.getItem('heavenSignature');

    if (artemisData) {
        artemisPad.fromDataURL(artemisData);
        heavenPad.fromDataURL(heavenData);
        const validateButton = document.getElementById('validateButton');
        validateButton.textContent = 'Validé !';
        validateButton.style.background = 'var(--secondary-color)';
    }
}

// Fonction pour réinitialiser les signatures
window.resetSignatures = function() {
    // Effacer les signatures
    artemisPad.clear();
    heavenPad.clear();
    
    // Réinitialiser le bouton
    const validateButton = document.getElementById('validateButton');
    validateButton.textContent = 'Valider';
    validateButton.style.background = 'var(--primary-color)';
    
    // Supprimer les signatures du localStorage
    localStorage.removeItem('artemisSignature');
    localStorage.removeItem('heavenSignature');
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser la date actuelle
    const currentDate = new Date();
    document.getElementById('currentDate').textContent = currentDate.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // S'assurer que le bouton valider est actif
    const validateButton = document.getElementById('validateButton');
    validateButton.disabled = false;
    validateButton.style.cursor = 'pointer';

    // Initialiser les pads de signature
    initSignaturePads();
    loadSignatures();

    // Gestion du défilement pour le titre des 100 raisons
    const hundredThings = document.querySelector('.hundred-things');
    if (hundredThings) {
        hundredThings.addEventListener('scroll', function() {
            if (this.scrollTop > 50) {
                this.classList.add('scrolled');
            } else {
                this.classList.remove('scrolled');
            }
        });
    }

    // Animation d'entrée des éléments
    const elements = document.querySelectorAll('.proposal-card > *');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}); 