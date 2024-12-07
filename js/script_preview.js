// Thumbnail - Image Slider
function setImageSlider_tb() {
    const carousel_tb = document.querySelector('.thumb .carousel'),
        slides_tb = carousel_tb.querySelectorAll('.slide'),
        btnPrevious_tb = document.querySelector('.thumb .carousel-btn-nav .btn-previous'),
        btnNext_tb = document.querySelector('.thumb .carousel-btn-nav .btn-next'),
        currentPage_tb = document.querySelector('.thumb .pagination-numbers .current-page'),
        totalPage_tb = document.querySelector('.thumb .pagination-numbers .total-page');

    let isDragStart_tb = false, isDragging_tb = false, isScrolling = false, prevPageX_tb, prevScrollLeft_tb, positionDiff_tb;

    const showHideIcons_tb = () => {
        // showing and hiding prev/next icon according to currentPage_tb value
        btnPrevious_tb.style.opacity = currentPage_tb.textContent == '1' ? "0.5" : "1";
        btnPrevious_tb.style.cursor = currentPage_tb.textContent == '1' ? "not-allowed" : "pointer";
        btnNext_tb.style.opacity = currentPage_tb.textContent == totalPage_tb.textContent ? "0.5" : "1";
        btnNext_tb.style.cursor = currentPage_tb.textContent == totalPage_tb.textContent ? "not-allowed" : "pointer";
    }

    btnPrevious_tb.addEventListener("click", () => {
        if (!isScrolling) {
            let firstImgWidth = slides_tb[0].clientWidth; // getting first img width
            // reduce width value from the carousel_tb scroll left
            carousel_tb.scrollLeft -= firstImgWidth;
            isScrolling = true;

            setTimeout(() => {
                isScrolling = false;
            }, 500);
        }
    });

    btnNext_tb.addEventListener("click", () => {
        if (!isScrolling) {
            let firstImgWidth = slides_tb[0].clientWidth;
            // add width value to the carousel_tb scroll left
            carousel_tb.scrollLeft += firstImgWidth;
            isScrolling = true;

            setTimeout(() => {
                isScrolling = false;
            }, 500);
        }
    });

    const autoSlide_tb = () => {
        // if there is no image left to scroll then return from here
        if (carousel_tb.scrollLeft - (carousel_tb.scrollWidth - carousel_tb.clientWidth) > -1 || carousel_tb.scrollLeft <= 0) return;

        positionDiff_tb = Math.abs(positionDiff_tb); // making positionDiff_tb value to positive
        let firstImgWidth = slides_tb[0].clientWidth;
        // get the last value of the carousel_tb scroll left
        let lastScrollLeft = Math.floor(carousel_tb.scrollLeft / firstImgWidth) * firstImgWidth;

        if (carousel_tb.scrollLeft > prevScrollLeft_tb) { // if user is scrolling to the right
            return carousel_tb.scrollLeft = positionDiff_tb > firstImgWidth / 3 ? lastScrollLeft + firstImgWidth : lastScrollLeft;
        }
        // if user is scrolling to the left
        carousel_tb.scrollLeft = positionDiff_tb > firstImgWidth / 3 ? lastScrollLeft : lastScrollLeft + firstImgWidth;
    }

    const dragStart_tb = (e) => {
        // update global variables value on mouse down event
        isDragStart_tb = true;
        prevPageX_tb = e.pageX || e.touches[0].pageX;
        prevScrollLeft_tb = carousel_tb.scrollLeft;
    }

    const dragging_tb = (e) => {
        // scroll carousel_tb to left according to mouse pointer
        if (!isDragStart_tb) return;
        e.preventDefault();
        isDragging_tb = true;
        carousel_tb.classList.add("dragging");
        positionDiff_tb =  (e.pageX || e.touches[0].pageX) - prevPageX_tb;
        carousel_tb.scrollLeft = prevScrollLeft_tb - positionDiff_tb;
    }

    const dragStop_tb = () => {
        isDragStart_tb = false;
        carousel_tb.classList.remove("dragging");

        if (!isDragging_tb) return;
        isDragging_tb = false;
        autoSlide_tb();
    }

    // mouse Events
    carousel_tb.addEventListener("mousedown", dragStart_tb);
    carousel_tb.addEventListener("mousemove", dragging_tb);
    carousel_tb.addEventListener("mouseup", dragStop_tb);
    carousel_tb.addEventListener("mouseleave", dragStop_tb); // stop dragging when mouse leaves the carousel_tb

    // touch events for mobile
    carousel_tb.addEventListener("touchstart", dragStart_tb);
    carousel_tb.addEventListener("touchmove", dragging_tb);
    carousel_tb.addEventListener("touchend", dragStop_tb);

    // update currentPage_tb value
    let options_tl = {
        root: carousel_tb,
        rootMargin: "0px",
        threshold: 1
    };

    slides_tb.forEach((slide, index) => {
        let observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.intersectionRatio == 1) {
                        currentPage_tb.textContent = index + 1;

                        // calling showHideIcons_tb
                        showHideIcons_tb();
                    }
                }
            });
        }, options_tl);
        observer.observe(slide);
    });
}


// Gallery
const gallery = document.querySelector('.gallery');
const galleryOuterColor = gallery.querySelector('.outer-color');
const galleryActions = gallery.querySelector('.actions');
const galleryCarousel = gallery.querySelector('.carousel');
const galleryCarouselBtnNav = gallery.querySelector('.carousel-btn-nav');
let animGalleryIsRunning = false;

function setGalleryVisibility() {
    if (!animGalleryIsRunning) {
        animGalleryIsRunning = true;

        if (gallery.classList.contains('active')) {
            galleryOuterColor.classList.toggle('active');
            galleryActions.classList.toggle('active');
            galleryCarousel.classList.toggle('active');
            galleryCarouselBtnNav.classList.toggle('active');
            setTimeout(() => {
                // set the value of the thumbnailCarousel scroll left according to currentPage_gl value
                const carousel_tb = document.querySelector('.thumb .carousel');
                const slides_tb = carousel_tb.querySelectorAll('.slide');
                const firstImgWidth = slides_tb[0].clientWidth; // getting first img width
                const currentPage_gl = gallery.querySelector('.current-page')
                carousel_tb.scrollLeft = (currentPage_gl.textContent - 1) * firstImgWidth;

                gallery.classList.toggle('active');
                animGalleryIsRunning = false;
            }, 300);
        } else {
            gallery.classList.toggle('active');
            setTimeout(() => {
                galleryOuterColor.classList.toggle('active');
                galleryActions.classList.toggle('active');
                galleryCarousel.classList.toggle('active');
                galleryCarouselBtnNav.classList.toggle('active');
                setTimeout(() => {
                    // set the value of the galleryCarousel scroll left according to currentPage_tb value
                    const slides_gl = galleryCarousel.querySelectorAll('.slide');
                    const firstImgWidth = slides_gl[0].clientWidth;
                    const currentPage_tb = document.querySelector('.thumb .pagination-numbers .current-page')
                    galleryCarousel.scrollLeft = (currentPage_tb.textContent - 1) * firstImgWidth;

                    animGalleryIsRunning = false;
                }, 300);
            }, 0);
        }
    }
};

// Gallery - Image Slider
function setImageSlider_gl() {
    const slides_gl = galleryCarousel.querySelectorAll('.slide'),
        btnPrevious_gl = galleryCarouselBtnNav.querySelector('.btn-previous'),
        btnNext_gl = galleryCarouselBtnNav.querySelector('.btn-next'),
        currentPage_gl = gallery.querySelector('.current-page'),
        totalPage_gl = gallery.querySelector('.total-page');

    let isDragStart_gl = false, isDragging_gl = false, isScrolling = false, prevPageX_gl, prevScrollLeft_gl, positionDiff_gl;

    const showHideIcons_gl = () => {
        // showing and hiding prev/next icon according to currentPage_gl value
        btnPrevious_gl.style.opacity = currentPage_gl.textContent == '1' ? "0.5" : "1";
        btnPrevious_gl.style.cursor = currentPage_gl.textContent == '1' ? "not-allowed" : "pointer";
        btnNext_gl.style.opacity = currentPage_gl.textContent == totalPage_gl.textContent ? "0.5" : "1";
        btnNext_gl.style.cursor = currentPage_gl.textContent == totalPage_gl.textContent ? "not-allowed" : "pointer";
    }

    btnPrevious_gl.addEventListener("click", () => {
        if (!isScrolling) {
            let firstImgWidth = slides_gl[0].clientWidth;
            // reduce width value from the galleryCarousel scroll left
            galleryCarousel.scrollLeft -= firstImgWidth;
            isScrolling = true;

            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    });

    btnNext_gl.addEventListener("click", () => {
        if (!isScrolling) {
            let firstImgWidth = slides_gl[0].clientWidth;
            // add width value to the galleryCarousel scroll left
            galleryCarousel.scrollLeft += firstImgWidth;
            isScrolling = true;

            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    });

    const autoSlide_gl = () => {
        // if there is no image left to scroll then return from here
        if (galleryCarousel.scrollLeft - (galleryCarousel.scrollWidth - galleryCarousel.clientWidth) > -1 || galleryCarousel.scrollLeft <= 0) return;

        positionDiff_gl = Math.abs(positionDiff_gl); // making positionDiff_gl value to positive
        let firstImgWidth = slides_gl[0].clientWidth;
        // get the last value of the galleryCarousel scroll left
        let lastScrollLeft = Math.floor(galleryCarousel.scrollLeft / firstImgWidth) * firstImgWidth;

        if (galleryCarousel.scrollLeft > prevScrollLeft_gl) { // if user is scrolling to the right
            return galleryCarousel.scrollLeft = positionDiff_gl > firstImgWidth / 3 ? lastScrollLeft + firstImgWidth : lastScrollLeft;
        }
        // if user is scrolling to the left
        galleryCarousel.scrollLeft = positionDiff_gl > firstImgWidth / 3 ? lastScrollLeft : lastScrollLeft + firstImgWidth;
    }

    const dragStart_gl = (e) => {
        // update global variables value on mouse down event
        isDragStart_gl = true;
        prevPageX_gl = e.pageX || e.touches[0].pageX;
        prevScrollLeft_gl = galleryCarousel.scrollLeft;
    }

    const dragging_gl = (e) => {
        // scroll images/galleryCarousel to left according to mouse pointer
        if (!isDragStart_gl) return;
        e.preventDefault();
        isDragging_gl = true;
        galleryCarousel.classList.add("dragging");
        positionDiff_gl =  (e.pageX || e.touches[0].pageX) - prevPageX_gl;
        galleryCarousel.scrollLeft = prevScrollLeft_gl - positionDiff_gl;
    }

    const dragStop_gl = () => {
        isDragStart_gl = false;
        galleryCarousel.classList.remove("dragging");

        if (!isDragging_gl) return;
        isDragging_gl = false;
        autoSlide_gl();
    }

    // mouse Events
    galleryCarousel.addEventListener("mousedown", dragStart_gl);
    galleryCarousel.addEventListener("mousemove", dragging_gl);
    galleryCarousel.addEventListener("mouseup", dragStop_gl);
    galleryCarousel.addEventListener("mouseleave", dragStop_gl); // stop dragging when mouse leaves the galleryCarousel

    // touch events for mobile
    galleryCarousel.addEventListener("touchstart", dragStart_gl);
    galleryCarousel.addEventListener("touchmove", dragging_gl);
    galleryCarousel.addEventListener("touchend", dragStop_gl);

    // update currentPage_gl value
    let options_gl = {
        root: galleryCarousel,
        rootMargin: "0px",
        threshold: 1
    };

    slides_gl.forEach((slide, index) => {
        let observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.intersectionRatio == 1) {
                        currentPage_gl.textContent = index + 1;

                        // calling showHideIcons_gl
                        showHideIcons_gl();
                    }
                }
            });
        }, options_gl);
        observer.observe(slide);
    });
}


// Load Content
function loadContent(dateData, nameData, categoriesData, imagesData, addressData, unitsData, descData, mapsData, contactsData) {
    // Thumbnail & Gallery - Image Slider
    const carousel_tb = document.querySelector('.thumb .carousel');
    const carousel_gl = document.querySelector('.gallery .carousel');

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
        carousel_tb.appendChild(slide);
        const slideClone = slide.cloneNode(true);
        carousel_gl.appendChild(slideClone);
    });

    // Thumbnail & Gallery - Total Page
    const totalPage_tb = document.querySelector('.thumb .pagination-numbers .total-page');
    totalPage_tb.textContent = imagesData.length;
    const totalPage_gl = document.querySelector('.gallery .actions .actions-wrapper .pagination-numbers .total-page');
    totalPage_gl.textContent = imagesData.length;

    // Name
    const name = document.querySelector('.details .name');
    name.textContent = nameData;

    // Date
    const date = document.querySelector('.details .date p');
    date.textContent = `Diposting: ${dateData}`;

    // Location
    const location = document.querySelector('.details .location p');
    location.textContent = addressData;

    // Categories
    const categories = document.querySelector('.details .categories');
    categoriesData.forEach(category => {
        const span = document.createElement('span');
        span.textContent = category;
        span.onclick = () => {
            handleSearchByCategory(category);
        };
        categories.appendChild(span);
    });

    // Units
    const unitsCategories = document.querySelector('.units .categories');

    unitsData.forEach(data => {
        const category = document.createElement('div');
        category.className = 'category';

        const categoryWrapper = document.createElement('div');
        categoryWrapper.className = 'category-wrapper';

        const categoryImg = document.createElement('img');
        categoryImg.src = '/resources/building-community-grey.svg';
        categoryImg.alt = 'category';
        categoryImg.draggable = false;
        categoryImg.loading = 'lazy';
        categoryWrapper.appendChild(categoryImg);

        const categoryName = document.createElement('p');
        categoryName.className = 'name';
        categoryName.textContent = data.name;
        categoryWrapper.appendChild(categoryName);
        category.appendChild(categoryWrapper);

        const categoryPrice = document.createElement('p');
        categoryPrice.className = 'price';
        categoryPrice.innerHTML = `${data.price}<span class="period">/${data.period}</span>`;
        category.appendChild(categoryPrice);
        unitsCategories.appendChild(category);
    });

    // Description
    const desc = document.querySelector('.desc .contents');
    desc.innerText = descData;

    // Maps
    const maps = document.querySelector('.maps iframe');
    maps.src = mapsData;

    // Contacts
    const contactsNumbers = document.querySelector('.contacts .numbers');

    contactsData.forEach(data => {
        const number = document.createElement('div');
        number.className = 'number';
        
        const numberImg = document.createElement('img');
        numberImg.src = '/resources/brand-whatsapp.svg';
        numberImg.alt = 'whatsapp';
        numberImg.draggable = false;
        numberImg.loading = 'lazy';
        number.appendChild(numberImg);

        const numberProfile = document.createElement('div');
        numberProfile.className = 'profile';
        const numberName = document.createElement('p');
        numberName.className = 'name';
        numberName.textContent = data.name;
        numberProfile.appendChild(numberName);
        const numberDigit = document.createElement('p');
        numberDigit.className = 'wa-number';
        numberDigit.textContent = data.number;
        numberProfile.appendChild(numberDigit);
        number.appendChild(numberProfile);

        const btnOpenWA = document.createElement("a");
        btnOpenWA.href = `https://wa.me/${data.number.replace('+', '').replace(' ', '').replaceAll('-', '')}?text=`;
        btnOpenWA.className = "btn-open-wa";
        btnOpenWA.target = "_blank";
        const text = document.createElement("p");
        text.textContent = "Kirim Pesan";
        btnOpenWA.appendChild(text);
        const img = document.createElement("img");
        img.src = "/resources/external-link.svg";
        img.alt = "add-new";
        img.draggable = false;
        img.loading = "lazy";
        btnOpenWA.appendChild(img);
        number.appendChild(btnOpenWA);
        contactsNumbers.appendChild(number);
    });
}


// Get Data
const urlParams = new URLSearchParams(window.location.search);
const request = { id: urlParams.get('id') };

fetch('https://script.google.com/macros/s/AKfycbzs7UKtNeiDGxEtIw-Ia5EBvR3Q-ZyeplY4v2EVKD1D_VEEwhiqRXeyWZwhzzBEMqILMA/exec?action=read', {
    method: 'POST',
    body: JSON.stringify(request)
})
    .then(response => response.json())
    .then(data => {
        // parsing data
        const date = data.data[0].date;
        const name = data.data[0].name;
        const categories = data.data[0].categories;
        const images = data.data[0].images;
        const address = data.data[0].address;
        const units = data.data[0].units;
        const desc = data.data[0].desc;
        const maps = data.data[0].maps;
        const contacts = data.data[0].contacts;

        // load content
        loadContent(date, name, categories, images, address, units, desc, maps, contacts);

        // console.log(data);
    })
    .catch(error => {
        // console.error(error);
    })
    .finally(() => {
        // setup thumbnail image slider
        setImageSlider_tb();
        setImageSlider_gl();
        // hide preloader
        hidePreloader();
    });


// Telegram PostData
/*
const response = {
    contentLength: 333,
    postData: {
        contents: {
            update_id: 765510522,
            message: {
                message_id: 18,
                from: {
                    id: 986460902,
                    is_bot: false,
                    first_name: "ekomlyo",
                    username: "ekomlyo",
                    language_code: "id"
                },
                chat: {
                    id: 986460902,
                    first_name: "ekomlyo",
                    username: "ekomlyo",
                    type: "private"
                },
                date: 1721119513,
                text: "/start",
                entities: [{ offset: 0, length: 6, type: bot_command }]
            }
        },
        length: 333,
        name: "postData",
        type: "application/json"
    },
    queryString: "",
    parameter: {},
    parameters: {},
    contextPath: ""
}
*/