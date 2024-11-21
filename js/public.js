// Preloader
function showPreloader() {
    document.querySelector('.preloader').classList.add('active');
}

function hidePreloader() {
    document.querySelector('.preloader').classList.remove('active');
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


// Create Card
function createCard(index, idData, dateData, nameData, categoriesData, imagesData, addressData, priceRangeData) {
    // Create the card div
    const card = document.createElement('div');
    card.className = `card number-${index}`;

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

    // Create the details div
    const details = document.createElement('div');
    details.className = 'details';

    // Categories
    const categories = document.createElement('div');
    categories.className = 'categories';
    categoriesData.forEach(category => {
        const span = document.createElement('span');
        span.textContent = category;
        categories.appendChild(span);
    });

    details.appendChild(categories);

    // Name
    const name = document.createElement('p');
    name.className = 'name';
    name.textContent = nameData;
    details.appendChild(name);

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
    details.appendChild(date);

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
    details.appendChild(location);

    // Details Wrapper
    const detailsWrapper = document.createElement('div');
    detailsWrapper.className = 'details-wrapper';

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

    detailsWrapper.appendChild(price);

    // Button Open
    const btnOpen = document.createElement('div');
    btnOpen.className = 'btn-open';
    btnOpen.onclick = function () {
        viewDetails(idData);
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

    detailsWrapper.appendChild(btnOpen);
    details.appendChild(detailsWrapper);
    card.appendChild(details);

    // return the card
    return card;
}


// View Details
function viewDetails(id) {
    window.open(`preview.html?id=${id}`, '_self');
}


// Search Visibility
const search = document.querySelector('.search');
const searchOuterColor = search.querySelector('.outer-color');
const searchBox = search.querySelector('.search-wrapper .search-box');
const searchCards = search.querySelector('.search-wrapper .search-cards');
const searchBlank = search.querySelector('.search-wrapper .search-blank');
const searchBoxInput = search.querySelector('.search-box-input input');
const searchCardsWrapper = search.querySelector('.search-cards .search-cards-wrapper');
let animSearchIsRunning = false;

function setSearchVisibility() {
    if (!animSearchIsRunning) {
        animSearchIsRunning = true;

        if (search.classList.contains('active')) {
            searchBoxInput.disabled = true;
            searchOuterColor.classList.remove('active');
            searchBox.classList.remove('active');
            searchCards.classList.remove('active');
            searchBlank.classList.remove('active');
            setTimeout(() => {
                search.classList.remove('active');
                animSearchIsRunning = false;
            }, 300);
        } else {
            // dismiss sidebar if active
            if (sideBar.classList.contains('active')) {
                toggleMenu.click();
            }

            // reset search
            searchBoxInput.value = '';
            searchCardsWrapper.innerHTML = '';

            searchBoxInput.disabled = false;
            search.classList.add('active');
            setTimeout(() => {
                searchOuterColor.classList.add('active');
                searchBox.classList.add('active');
                searchCards.classList.add('active');
                searchBlank.classList.add('active');
                setTimeout(() => {
                    searchBoxInput.focus();
                    animSearchIsRunning = false;
                }, 300);
            }, 0);
        }
    }
};


// Search Cards Thumbnail - Image Slider
function setSearchImageSlider() {
    const searchCards = document.querySelectorAll('.search-cards-wrapper .card');

    searchCards.forEach((card, index) => {
        const carousel = document.querySelector(`.search-cards-wrapper .number-${index} .thumb .carousel`),
            slides = carousel.querySelectorAll('.slide'),
            dots = document.querySelectorAll(`.search-cards-wrapper .number-${index} .thumb .pagination-dots .dot`),
            btnPrevious = document.querySelector(`.search-cards-wrapper .number-${index} .thumb .carousel-btn-nav .btn-previous`),
            btnNext = document.querySelector(`.search-cards-wrapper .number-${index} .thumb .carousel-btn-nav .btn-next`);

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


// Search Handler
function handleSearch() {
    // show search loader
    const searchLoader = document.querySelector('.search-loader');
    searchLoader.classList.add('active');

    // encode input value
    const encodedQuery = searchBoxInput.value.trim();
    const data = { query: encodedQuery };

    fetch('https://script.google.com/macros/s/AKfycbzs7UKtNeiDGxEtIw-Ia5EBvR3Q-ZyeplY4v2EVKD1D_VEEwhiqRXeyWZwhzzBEMqILMA/exec?action=search', {
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            // clear the search cards wrapper content
            searchCardsWrapper.innerHTML = '';

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

                    // append the new card to the search cards wrapper
                    searchCardsWrapper.appendChild(newCard);
                });

                // hide search blank
                if (searchBlank.classList.contains('active')) {
                    searchBlank.classList.remove('active');
                }

            } else {
                // show search blank
                if (!searchBlank.classList.contains('active')) {
                    searchBlank.classList.add('active');
                }
            }

            console.log(data);
        })
        .catch(error => {
            console.error(error);
        })
        .finally(() => {
            // setup image slider
            if (searchCardsWrapper.innerHTML != '') {
                setSearchImageSlider();
            }

            // hide search loader
            searchLoader.classList.remove('active');
        });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && search.classList.contains('active') && searchBoxInput.value.length > 0) {
        handleSearch();
    }
});