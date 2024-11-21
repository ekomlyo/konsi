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


// Filter Visibility
const filter = document.querySelector('.filter');
const filterOuterColor = document.querySelector('.filter .outer-color');
const filterWrapper = document.querySelector('.filter .filter-wrapper');
let animFilterIsRunning = false;

function setFilterVisibility() {
    if (!animFilterIsRunning) {
        animFilterIsRunning = true;

        if (filter.classList.contains('active')) {
            filterOuterColor.classList.remove('active');
            filterWrapper.classList.remove('active');
            setTimeout(() => {
                filter.classList.remove('active');
                animFilterIsRunning = false;
            }, 300);
        } else {
            // restore last filter preferences
            loadFilterPreferences();

            filter.classList.add('active');
            setTimeout(() => {
                filterOuterColor.classList.add('active');
                filterWrapper.classList.add('active');
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

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const time = getTimeFilter();
    const categories = getCategoriesFilter();
    const priceRange = getPriceRangeFilter();

    handleFilter(time, categories, priceRange);
    setFilterVisibility();

    // save filter preferences
    saveFilterPreferences(time, categories, priceRange);

    // show preloader
    showPreloader();
});

form.addEventListener('reset', () => {
    resetPriceValue();
});

function getTimeFilter() {
    const time = document.querySelector('.form-group .times .time-group input[type=radio]:checked');

    return time.value == 'Terbaru' ? 'latest' : 'longest';
}

function getCategoriesFilter(categoryData) {
    const categories = form.querySelectorAll('.form-group .categories .category-group input[type=checkbox]:checked');
    let data = [];

    if (categoryData) {
        data.push(categoryData);
    } else {
        categories.forEach(category => {
            data.push(category.value);
        });
    }

    return data;
}

function getPriceRangeFilter() {
    const minValue = parseInt(inputValueMin.textContent.replace('Rp', '').replaceAll('.', '').trim());
    const maxValue = parseInt(inputValueMax.textContent.replace('Rp', '').replaceAll('.', '').trim());

    return { min: minValue, max: maxValue };
}

function resetPriceValue() {
    inputValueMin.textContent = 'Rp 0';
    inputValueMax.textContent = 'Rp 0';
}


// Filter Preferences
let filterPreferences = {
    time: 'latest',
    categories: [],
    priceRange: { min: 0, max: 0 }
};

function saveFilterPreferences(time, categories, priceRange) {
    filterPreferences.time = time;
    filterPreferences.categories = categories;
    filterPreferences.priceRange = priceRange;

    // set filter badge
    const filterBadge = document.querySelector('.btn-filter .badge');
    let badgeCount = 1;

    if (getCategoriesFilter().length > 0) {
        badgeCount++;
    }

    if (getPriceRangeFilter().min != 0 || getPriceRangeFilter().max != 0) {
        badgeCount++;
    }

    filterBadge.textContent = badgeCount;
}

function loadFilterPreferences() {
    // Times
    const times = document.querySelectorAll('.form-group .times .time-group input[type=radio]');
    const timePreference = filterPreferences.time;

    times.forEach(time => {
        time.checked =
            (timePreference === 'latest' && time.value === 'Terbaru') ||
            (timePreference === 'longest' && time.value === 'Terlama');
    });

    // Categories
    const categories = form.querySelectorAll('.form-group .categories .category-group input[type=checkbox]');
    const categoriesPreferences = filterPreferences.categories;

    categories.forEach(category => {
        category.checked = categoriesPreferences.includes(category.value);
    });

    // Price Range
    const priceRangePreferences = filterPreferences.priceRange;

    inputValueMin.textContent = new Intl.NumberFormat("id", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(priceRangePreferences.min || 0);

    inputValueMax.textContent = new Intl.NumberFormat("id", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(priceRangePreferences.max || 0);
}


// Filter Handler
function handleFilter(timeData, categoriesData, priceRangeData) {
    const request = {
        time: timeData,
        categories: categoriesData,
        priceRange: priceRangeData
    };

    fetch('https://script.google.com/macros/s/AKfycbzs7UKtNeiDGxEtIw-Ia5EBvR3Q-ZyeplY4v2EVKD1D_VEEwhiqRXeyWZwhzzBEMqILMA/exec?action=read', {
        method: 'POST',
        body: JSON.stringify(request)
    })
        .then(response => response.json())
        .then(data => {
            // clear the cards wrapper content
            const cardsWrapper = document.querySelector('.cards .cards-wrapper');
            cardsWrapper.innerHTML = '';

            if (data.data) {
                data.data.forEach((item, index) => {
                    // parsing data
                    const id = item.id;
                    const date = item.date;
                    const name = item.name;
                    const categories = item.categories;
                    const images = item.images;
                    const address = item.address;
                    const priceRange = item.priceRange;

                    // create new card
                    const newCard = createCard(index, id, date, name, categories, images, address, priceRange);

                    // append the new card to the cards wrapper
                    cardsWrapper.appendChild(newCard);
                });
            } else {
                cardsWrapper.innerHTML = 'Tidak ada data.';
            }

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
}


// Initialize
handleFilter();