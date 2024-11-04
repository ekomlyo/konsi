// Preloader
function hidePreloader() {
    document.querySelector('.preloader').classList.toggle('active');
}


// Toggle Menu
const toggleMenu = document.querySelector('.toggle-menu');
const sideBar = document.querySelector('.sidebar');
const sideBarOuterClick = document.querySelector('.sidebar .outer-click');
const sideBarWrapper = document.querySelector('.sidebar .sidebar-wrapper');
let animNavIsRunning = false;

function setToggleMenu() {
    if (!animNavIsRunning) {
        animNavIsRunning = true;
        toggleMenu.classList.toggle('active');

        if (sideBar.classList.contains('active')) {
            sideBarOuterClick.classList.toggle('active');
            sideBarWrapper.classList.toggle('active');
            setTimeout(() => {
                sideBar.classList.toggle('active');
                animNavIsRunning = false;
            }, 300);
        } else {
            sideBar.classList.toggle('active');
            setTimeout(() => {
                sideBarOuterClick.classList.toggle('active');
                sideBarWrapper.classList.toggle('active');
                setTimeout(() => {
                    animNavIsRunning = false;
                }, 300);
            }, 0);
        }
    }
};


// Scroll Event
const btnScroll = document.querySelector('.btn-scroll');

function scrollUp() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

window.onscroll = () => {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btnScroll.classList.add('active');
    } else {
        btnScroll.classList.remove('active');
    }
};


// Get Copyright
let date = new Date();
document.querySelector('.copyright .year').innerHTML = date.getFullYear();


// Search
const search = document.querySelector('.search');
const searchOuterColor = document.querySelector('.search .outer-color');
const searchWrapper = document.querySelector('.search .search-wrapper');
const searchBoxInput = document.querySelector('.search-box-input input');
let animSearchIsRunning = false;

function setSearchVisibility() {
    if (!animSearchIsRunning) {
        animSearchIsRunning = true;

        if (search.classList.contains('active')) {
            searchBoxInput.disabled = true;
            searchOuterColor.classList.toggle('active');
            searchWrapper.classList.toggle('active');
            setTimeout(() => {
                searchBoxInput.value = '';
                search.classList.toggle('active');
                animSearchIsRunning = false;
            }, 300);
        } else {
            // Dismiss sidebar if active
            if (sideBar.classList.contains('active')) {
                toggleMenu.click();
            }

            searchBoxInput.disabled = false;
            search.classList.toggle('active');
            setTimeout(() => {
                searchOuterColor.classList.toggle('active');
                searchWrapper.classList.toggle('active');
                setTimeout(() => {
                    searchBoxInput.focus();
                    animSearchIsRunning = false;
                }, 300);
            }, 0);
        }
    }
};


// Search Cards Thumbnail - Image Slider
const searchCards = document.querySelectorAll('.search-cards-wrapper .card');

searchCards.forEach((card, index) => {
    const carousel = document.querySelector(`.search-cards-wrapper .number-${index + 1} .thumb .carousel`),
        slides = carousel.querySelectorAll('.slide'),
        dots = document.querySelectorAll(`.search-cards-wrapper .number-${index + 1} .thumb .pagination-dots .dot`),
        btnPrevious = document.querySelector(`.search-cards-wrapper .number-${index + 1} .thumb .carousel-btn-nav .btn-previous`),
        btnNext = document.querySelector(`.search-cards-wrapper .number-${index + 1} .thumb .carousel-btn-nav .btn-next`);

    let isDragStart = false, isDragging = false, isScrolling = false, prevPageX, prevScrollLeft, positionDiff;

    const showHideIcons = () => {
        // showing and hiding prev/next icon according to currentPage_tb value
        btnPrevious.style.opacity = dots[0].classList.contains('active') ? "0.5" : "1";
        btnNext.style.opacity = dots[dots.length - 1].classList.contains('active') ? "0.5" : "1";
    }

    btnPrevious.addEventListener("click", () => {
        if (!isScrolling) {
            let firstImgWidth = slides[0].clientWidth; // getting first img width
            // reduce width value from the carousel scroll left
            carousel.scrollLeft -= firstImgWidth;
            isScrolling = true;

            setTimeout(() => {
                isScrolling = false;
            }, 500);
        }
    });

    btnNext.addEventListener("click", () => {
        if (!isScrolling) {
            let firstImgWidth = slides[0].clientWidth;
            // add width value to the carousel scroll left
            carousel.scrollLeft += firstImgWidth;
            isScrolling = true;

            setTimeout(() => {
                isScrolling = false;
            }, 500);
        }
    });

    const autoSlide = () => {
        // if there is no image left to scroll then return from here
        if (carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 || carousel.scrollLeft <= 0) return;

        positionDiff = Math.abs(positionDiff); // making positionDiff value to positive
        let firstImgWidth = slides[0].clientWidth;
        // get the last value of the carousel scroll left
        let lastScrollLeft = Math.floor(carousel.scrollLeft / firstImgWidth) * firstImgWidth;

        if (carousel.scrollLeft > prevScrollLeft) { // if user is scrolling to the right
            return carousel.scrollLeft = positionDiff > firstImgWidth / 3 ? lastScrollLeft + firstImgWidth : lastScrollLeft;
        }
        // if user is scrolling to the left
        carousel.scrollLeft = positionDiff > firstImgWidth / 3 ? lastScrollLeft : lastScrollLeft + firstImgWidth;
    }

    const dragStart = (e) => {
        // update global variables value on mouse down event
        isDragStart = true;
        prevPageX = e.pageX || e.touches[0].pageX;
        prevScrollLeft = carousel.scrollLeft;
    }

    const dragging = (e) => {
        // scroll carousel to left according to mouse pointer
        if (!isDragStart) return;
        e.preventDefault();
        isDragging = true;
        carousel.classList.add("dragging");
        positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
        carousel.scrollLeft = prevScrollLeft - positionDiff;
    }

    const dragStop = () => {
        isDragStart = false;
        carousel.classList.remove("dragging");

        if (!isDragging) return;
        isDragging = false;
        autoSlide();
    }

    // mouse Events
    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    carousel.addEventListener("mouseup", dragStop);
    carousel.addEventListener("mouseleave", dragStop); // stop dragging when mouse leaves the carousel

    // touch events for mobile
    carousel.addEventListener("touchstart", dragStart);
    carousel.addEventListener("touchmove", dragging);
    carousel.addEventListener("touchend", dragStop);

    // update dots
    let options = {
        root: carousel,
        rootMargin: "0px",
        threshold: [0, 0.5, 1]
    }

    slides.forEach((slide, index) => {
        var observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.intersectionRatio >= 0.5) {
                        dots[index].classList.add('active');
                    } else if (entry.intersectionRatio <= 0.5) {
                        dots[index].classList.remove('active');
                    }
                    // calling showHideIcons
                    showHideIcons();
                }
            });
        }, options);
        observer.observe(slide);
    });
});


// View Details
function viewDetails(id) {
    window.open(`preview.html?id=${id}`, '_self');
}