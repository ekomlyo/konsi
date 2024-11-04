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
        const carousel = document.querySelector(`.cards-wrapper .number-${index + 1} .thumb .carousel`),
            slides = carousel.querySelectorAll('.slide'),
            dots = document.querySelectorAll(`.cards-wrapper .number-${index + 1} .thumb .pagination-dots .dot`),
            btnPrevious = document.querySelector(`.cards-wrapper .number-${index + 1} .thumb .carousel-btn-nav .btn-previous`),
            btnNext = document.querySelector(`.cards-wrapper .number-${index + 1} .thumb .carousel-btn-nav .btn-next`);

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


// Create Card
function createCard(id, dateData, nameData, categoriesData, imagesData, addressData, priceRangeData) {
    // Create the card div
    const card = document.createElement('div');
    card.className = `card number-${id}`;

    // Create the thumb div
    const thumb = document.createElement('div');
    thumb.className = 'thumb';

    // Create the carousel div
    const carousel = document.createElement('div');
    carousel.className = 'carousel';

    // Create and append the slides to the carousel
    imagesData.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';

        const img = document.createElement('img');
        img.src = src;
        img.alt = `slide-${index + 1}`;
        img.draggable = false;
        img.loading = 'lazy';
        img.onerror = function () {
            this.onerror = null;
            this.src = '/resources/photo.svg';
        };

        slide.appendChild(img);
        carousel.appendChild(slide);
    });

    thumb.appendChild(carousel);

    // Create the carousel-btn-nav div with buttons
    const carouselBtnNav = document.createElement('div');
    carouselBtnNav.className = 'carousel-btn-nav';

    const btnPrevious = document.createElement('div');
    btnPrevious.className = 'btn-previous';
    const previousImg = document.createElement('img');
    previousImg.src = '/resources/chevron-left-dark.svg';
    previousImg.alt = 'previous';
    previousImg.draggable = false;
    previousImg.loading = 'lazy';
    btnPrevious.appendChild(previousImg);

    const btnNext = document.createElement('div');
    btnNext.className = 'btn-next';
    const nextImg = document.createElement('img');
    nextImg.src = '/resources/chevron-right-dark.svg';
    nextImg.alt = 'next';
    nextImg.draggable = false;
    nextImg.loading = 'lazy';
    btnNext.appendChild(nextImg);

    carouselBtnNav.appendChild(btnPrevious);
    carouselBtnNav.appendChild(btnNext);
    thumb.appendChild(carouselBtnNav);

    // Create the pagination dots
    const paginationDots = document.createElement('div');
    paginationDots.className = 'pagination-dots';

    for (let i = 0; i < imagesData.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        paginationDots.appendChild(dot);
    }

    thumb.appendChild(paginationDots);
    card.appendChild(thumb);

    // Create the desc div
    const desc = document.createElement('div');
    desc.className = 'desc';

    // Categories
    const categories = document.createElement('div');
    categories.className = 'categories';
    categoriesData.forEach(category => {
        const span = document.createElement('span');
        span.textContent = category;
        categories.appendChild(span);
    });

    desc.appendChild(categories);

    // Name
    const name = document.createElement('p');
    name.className = 'name';
    name.textContent = nameData;
    desc.appendChild(name);

    // Date
    const date = document.createElement('div');
    date.className = 'date';
    const dateImg = document.createElement('img');
    dateImg.src = '/resources/calendar.svg';
    dateImg.alt = 'calendar';
    dateImg.draggable = false;
    dateImg.loading = 'lazy';
    date.appendChild(dateImg);

    const dateText = document.createElement('p');
    dateText.textContent = `Diposting: ${dateData}`;
    date.appendChild(dateText);
    desc.appendChild(date);

    // Location
    const location = document.createElement('div');
    location.className = 'location';
    const locationImg = document.createElement('img');
    locationImg.src = '/resources/map-dark.svg';
    locationImg.alt = 'location';
    locationImg.draggable = false;
    locationImg.loading = 'lazy';
    location.appendChild(locationImg);

    const locationText = document.createElement('p');
    locationText.textContent = addressData;
    location.appendChild(locationText);
    desc.appendChild(location);

    // Description Wrapper
    const descWrapper = document.createElement('div');
    descWrapper.className = 'desc-wrapper';

    // Price
    const price = document.createElement('div');
    price.className = 'price';
    const priceWrapper = document.createElement('p');
    priceWrapper.className = 'price-wrapper';
    priceWrapper.innerHTML = `${priceRangeData}<span class="period">/bulan</span>`;
    price.appendChild(priceWrapper);

    const note = document.createElement('p');
    note.className = 'note';
    note.textContent = '*) Harga bisa saja berubah.';
    price.appendChild(note);

    descWrapper.appendChild(price);

    // Button Open
    const btnOpen = document.createElement('div');
    btnOpen.className = 'btn-open';
    btnOpen.onclick = function () {
        viewDetails(id);
    };

    const btnText = document.createElement('p');
    btnText.textContent = 'Lihat';
    btnOpen.appendChild(btnText);

    const btnImg = document.createElement('img');
    btnImg.src = '/resources/chevron-right-light.svg';
    btnImg.alt = 'open';
    btnImg.draggable = false;
    btnImg.loading = 'lazy';
    btnOpen.appendChild(btnImg);

    descWrapper.appendChild(btnOpen);
    desc.appendChild(descWrapper);
    card.appendChild(desc);

    // return the card
    return card;
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
            const newCard = createCard(id, date, name, categories, images, address, priceRange);

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