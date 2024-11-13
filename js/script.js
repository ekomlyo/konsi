// Filter
const filter = document.querySelector('.filter');
const filterOuterColor = document.querySelector('.filter .outer-color');
const filterWrapper = document.querySelector('.filter .filter-wrapper');
let animFilterIsRunning = false;

function setFilterVisibility() {
    if (!animFilterIsRunning) {
        animFilterIsRunning = true;

        if (filter.classList.contains('active')) {
            filterOuterColor.classList.toggle('active');
            filterWrapper.classList.toggle('active');
            setTimeout(() => {
                filter.classList.toggle('active');
                animFilterIsRunning = false;
            }, 300);
        } else {
            filter.classList.toggle('active');
            setTimeout(() => {
                filterOuterColor.classList.toggle('active');
                filterWrapper.classList.toggle('active');
                setTimeout(() => {
                    animFilterIsRunning = false;
                }, 300);
            }, 0);
        }
    }
};


// Price Format
const priceMin = document.querySelector('.price-min input');
const priceMax = document.querySelector('.price-max input');
const inputValueMin = document.querySelector('.price-min .input-value');
const inputValueMax = document.querySelector('.price-max .input-value');

// Min
priceMin.addEventListener('input', () => {
    if (priceMin.value < 10000000) {
        inputValueMin.textContent = new Intl.NumberFormat("id", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(priceMin.value || 0);
    } else {
        priceMin.value = inputValueMin.textContent.replace('Rp', '').replaceAll('.', '').trim();
    }
});

priceMin.addEventListener('focus', () => {
    if (priceMin.value == '') {
        setTimeout(() => {
            priceMin.value = inputValueMin.textContent.replace('Rp', '').replaceAll('.', '').trim();
        }, 0);
    }
});

priceMin.addEventListener('blur', () => {
    priceMin.value = '';
});

// Max
priceMax.addEventListener('input', () => {
    if (priceMax.value < 10000000) {
        inputValueMax.textContent = new Intl.NumberFormat("id", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(priceMax.value || 0);
    } else {
        priceMax.value = inputValueMax.textContent.replace('Rp', '').replaceAll('.', '').trim();
    }
});

priceMax.addEventListener('focus', () => {
    if (priceMax.value == '') {
        setTimeout(() => {
            priceMax.value = inputValueMax.textContent.replace('Rp', '').replaceAll('.', '').trim();
        }, 0);
    }
});

priceMax.addEventListener('blur', () => {
    priceMax.value = '';
});


// Form Actions
const form = document.querySelector('form');

form.addEventListener('reset', () => {
    resetPriceValue();
});

function resetPriceValue() {
    inputValueMin.textContent = 'Rp 0';
    inputValueMax.textContent = 'Rp 0';
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    setFilterVisibility();
});


// Cards Thumbnail - Image Slider
function setImageSlider() {
    const cards = document.querySelectorAll('.cards-wrapper .card');

    cards.forEach((card, index) => {
        const carousel = document.querySelector(`.cards-wrapper .number-${index} .thumb .carousel`),
            slides = carousel.querySelectorAll('.slide'),
            dots = document.querySelectorAll(`.cards-wrapper .number-${index} .thumb .pagination-dots .dot`),
            btnPrevious = document.querySelector(`.cards-wrapper .number-${index} .thumb .carousel-btn-nav .btn-previous`),
            btnNext = document.querySelector(`.cards-wrapper .number-${index} .thumb .carousel-btn-nav .btn-next`);

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
}


// Get Data
fetch('https://script.google.com/macros/s/AKfycbwBXVENPvilxHa6cCvqB6o9qquZ7__ZxdPNiQmXz5gdONR_U83CKWhVJ-QZJFnvBiy57A/exec')
    .then(response => response.json())
    .then(data => {
        data.data.forEach((item, index) => {
            // parsing data
            const id = item.id;
            const date = item.date;
            const name = item.name;
            const categories = item.categories;
            const images = item.images;
            const address = item.address;
            const priceRange = item.price_range;

            // create new card
            const newCard = createCard(index, id, date, name, categories, images, address, priceRange);

            // append the new card to the cards wrapper
            const cardsWrapper = document.querySelector('.cards .cards-wrapper');
            cardsWrapper.appendChild(newCard);
        });

        console.log(data);
    })
    .catch(error => {
        console.error(error);
    })
    .finally(() => {
        // setup image slider
        setImageSlider();
        // hide preloader
        hidePreloader();
    });