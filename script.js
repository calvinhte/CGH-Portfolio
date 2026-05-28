function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Scroll Reveal Animation Observer
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve so it only animates once when scrolling down
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15 }); // Triggers when 15% of the element is visible

    document.querySelectorAll('.scroll-animate').forEach((el) => {
        observer.observe(el);
    });
});

// --- Modal Functions ---
function openModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden'; // Prevent scrolling on main page
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// --- Image Viewer Functions ---
let currentGalleryImages = [];
let currentImageIndex = 0;

function openImageViewer(src) {
    const viewer = document.getElementById('image-viewer');
    const viewerImg = document.getElementById('viewer-img');
    
    // Get all images in the active modal for navigation
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
        const galleryImgs = Array.from(activeModal.querySelectorAll('.modal-gallery img'));
        currentGalleryImages = galleryImgs.map(img => img.src);
        currentImageIndex = currentGalleryImages.indexOf(src);
        if (currentImageIndex === -1) currentImageIndex = 0;
    } else {
        currentGalleryImages = [src];
        currentImageIndex = 0;
    }

    // Show or hide navigation buttons based on gallery size
    const prevBtn = document.querySelector('.viewer-nav.prev-btn');
    const nextBtn = document.querySelector('.viewer-nav.next-btn');
    if (prevBtn && nextBtn) {
        prevBtn.style.display = currentGalleryImages.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = currentGalleryImages.length > 1 ? 'flex' : 'none';
    }

    viewerImg.src = src;
    viewerImg.classList.remove('zoomed');
    viewerImg.style.transformOrigin = 'center center';
    viewer.style.display = 'flex';
    setTimeout(() => {
        viewer.classList.add('active');
    }, 10);
}

function navigateViewer(direction, event) {
    if (event) {
        event.stopPropagation(); // Prevent closing the viewer
    }
    if (currentGalleryImages.length <= 1) return;

    currentImageIndex += direction;
    if (currentImageIndex < 0) {
        currentImageIndex = currentGalleryImages.length - 1; // Wrap to end
    } else if (currentImageIndex >= currentGalleryImages.length) {
        currentImageIndex = 0; // Wrap to start
    }
    
    const viewerImg = document.getElementById('viewer-img');
    viewerImg.classList.remove('zoomed');
    viewerImg.style.transformOrigin = 'center center';
    viewerImg.src = currentGalleryImages[currentImageIndex];
}

function closeImageViewer() {
    const viewer = document.getElementById('image-viewer');
    viewer.classList.remove('active');
    setTimeout(() => {
        viewer.style.display = 'none';
    }, 300);
}

// --- Image Viewer Zoom & Pan Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.getElementById('image-viewer');
    const viewerImg = document.getElementById('viewer-img');

    // Close when clicking the background
    viewer.addEventListener('click', function(e) {
        if (e.target !== viewerImg && !e.target.closest('.viewer-nav')) {
            closeImageViewer();
        }
    });

    // Toggle zoom on click
    viewerImg.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!this.classList.contains('zoomed')) {
            // Set origin based on click before zooming in
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            this.style.transformOrigin = `${x}% ${y}%`;
            this.classList.add('zoomed');
        } else {
            // Zoom out
            this.classList.remove('zoomed');
            setTimeout(() => {
                if (!this.classList.contains('zoomed')) {
                    this.style.transformOrigin = 'center center';
                }
            }, 300);
        }
    });

    // Pan image on mouse move when zoomed
    viewerImg.addEventListener('mousemove', function(e) {
        if (this.classList.contains('zoomed')) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            this.style.transformOrigin = `${x}% ${y}%`;
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (viewer.classList.contains('active')) {
            if (e.key === 'ArrowRight') {
                navigateViewer(1);
            } else if (e.key === 'ArrowLeft') {
                navigateViewer(-1);
            } else if (e.key === 'Escape') {
                closeImageViewer();
            }
        }
    });
});

// Close modals if clicking outside of the content box
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
}