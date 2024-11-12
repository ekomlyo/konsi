// hide preloader
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        hidePreloader();
    }, 500);
});

// Photo Files
const images = document.querySelector('.images');
let imageData = [];
let isDragging = false;
let isChanged = false;
let lastDraggingOverItem = null;
let draggingItemData = null;
let lastDraggingOverItemData = null;

images.addEventListener('dragover', (e) => {
    e.preventDefault();

    if (!isDragging) {
        images.classList.add('over');
    }
});

images.addEventListener('dragleave', (e) => {
    e.preventDefault();

    images.classList.remove('over');
});

images.addEventListener('drop', (e) => {
    e.preventDefault();

    images.classList.remove('over');
    const files = [...e.dataTransfer.files];
    handleFiles(files);
});

function handleFiles(files) {
    if (files) {
        files.forEach((file, index) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = (e) => {
                const imageCard = document.createElement('div');

                const attr1 = document.createAttribute('class');
                attr1.value = 'image-card';
                const attr2 = document.createAttribute('draggable');
                attr2.value = 'true';

                imageCard.setAttributeNode(attr1);
                imageCard.setAttributeNode(attr2);

                imageCard.innerHTML = `
                                <img src="${e.target.result}" onerror="this.onerror=null;this.src='/resources/photo.svg';" alt="${file.name}" draggable="false" loading="lazy">
                                <div class="btn-delete" onclick="removeImage(this);">
                                    <img src="/resources/trash.svg" alt="delete" draggable="false" loading="lazy">
                                </div>`;

                imageCard.addEventListener('dragstart', handleDragStart);
                imageCard.addEventListener('dragend', handleDragEnd);
                imageCard.addEventListener('dragover', handleDragOver);

                images.appendChild(imageCard);
                images.classList.add('active');

                const image = {
                    name: file.name,
                    data: e.target.result
                };

                imageData.push(image);
            };
        });
    }

    // reset file input
    images.querySelector('#file').value = '';
}

function handleDragStart(e) {
    setTimeout(() => {
        e.target.classList.add('dragging');
        e.target.classList.add('over');
    }, 0);

    isDragging = true;
}

function handleDragEnd(e) {
    setTimeout(() => {
        e.target.classList.remove('dragging');
    }, 0);

    lastDraggingOverItem.classList.remove('over');

    lastDraggingOverItem = null;
    draggingItemData = null;
    lastDraggingOverItemData = null;
    isChanged = false;
    isDragging = false;
}

function handleDragOver(e) {
    e.preventDefault();

    const draggingItem = images.querySelector('.image-card.dragging');
    const draggingOverItem = getDraggingOverItem(draggingItem, e.clientX, e.clientY);
    draggingItemData = draggingItem.innerHTML;

    if (draggingItem != null && draggingOverItem != null) {
        const draggingOverItemRect = draggingOverItem.getBoundingClientRect();

        if (e.clientX >= Math.floor(draggingOverItemRect.left) && e.clientX <= Math.floor(draggingOverItemRect.right) &&
            e.clientY >= Math.floor(draggingOverItemRect.top) && e.clientY <= Math.floor(draggingOverItemRect.bottom)) {
            if (lastDraggingOverItem != null && lastDraggingOverItem != draggingOverItem) {
                lastDraggingOverItem.innerHTML = draggingItemData;
                draggingItem.innerHTML = draggingOverItem.innerHTML;
                draggingOverItem.innerHTML = lastDraggingOverItemData;
                sortImageData();

                lastDraggingOverItem.classList.remove('over');
                draggingOverItem.classList.add('over');
            }

            lastDraggingOverItem = draggingOverItem;
            lastDraggingOverItemData = draggingOverItem.innerHTML;

            if (!isChanged) {
                draggingItem.innerHTML = draggingOverItem.innerHTML;
                draggingOverItem.innerHTML = draggingItemData;
                sortImageData();

                draggingItem.classList.remove('over');
                draggingOverItem.classList.add('over');

                isChanged = true;
            }
        }
    }
}

function getDraggingOverItem(base, moveX, moveY) {
    const imageCards = [...images.querySelectorAll('.image-card:not(.dragging)')];

    return imageCards.reduce(
        (closest, child, index) => {
            const box = child.getBoundingClientRect();
            if (moveX >= Math.floor(box.left) && moveX <= Math.floor(box.right) &&
                moveY >= Math.floor(box.top) && moveY <= Math.floor(box.bottom)) {
                return { element: child };
            } else {
                return closest;
            }
        },
        { element: base }
    ).element;
}

function sortImageData() {
    const sortOrder = [...images.querySelectorAll('.image-card')].map(obj => obj.querySelector('img').alt);
    const orderMap = new Map(sortOrder.map((value, index) => [value, index]));

    imageData.sort((a, b) => {
        const indexA = orderMap.get(a.name) !== undefined ? orderMap.get(a.name) : Infinity;
        const indexB = orderMap.get(b.name) !== undefined ? orderMap.get(b.name) : Infinity;
        return indexA - indexB;
    });
}

function removeImage(obj, index) {
    const imageCards = images.querySelectorAll('.image-card');

    imageCards.forEach((imageCard, index) => {
        if (obj.parentElement == imageCard) {
            imageData.splice(index, 1);
            imageCard.remove();
        }
    });

    if (images.children.length == 2) {
        images.classList.remove('active');
    }
}

function resetImageData() {
    const imageCards = images.querySelectorAll('.image-card');

    imageCards.forEach((imageCard) => {
        imageCard.remove();
    });

    imageData = [];

    images.classList.remove('active');
}


// Units
const units = document.querySelector('.units');
const btnAddUnit = `
                        <div class="btn-add-unit" onclick="addNewUnit()">
                            <img src="/resources/plus-grey.svg" alt="add-unit" draggable="false" loading="lazy">
                            <p class="hint">Tambahkan unit baru</p>
                        </div>`;

function addNewUnit() {
    const existedUnits = units.querySelectorAll('.unit-group');
    let lastUnits = '';
    let totalUnits = 0;

    if (existedUnits) {
        existedUnits.forEach((unit, index) => {
            const unitName = unit.querySelector('.unit-name .unit-name-input input').value;
            const unitPrice = unit.querySelector('.unit-price .unit-price-input .unitprice-value').textContent;
            const unitPeriod = unit.querySelector('.unit-price .unit-period-input input').value;
            const dataUnit = generateUnit(unitName, unitPrice, unitPeriod, index + 1);

            lastUnits = lastUnits != '' ? lastUnits + dataUnit : dataUnit;
            totalUnits++;
        });
    }

    const newUnit = generateUnit('', 'Rp 0', '', totalUnits + 1);
    units.innerHTML = lastUnits + newUnit + btnAddUnit;
}

function generateUnit(unitName, unitPrice, unitPeriod, index) {
    const unit = `
                        <div class="unit-group">
                            <div class="unit-name">
                                <div class="unit-name-icon">
                                    <img src="/resources/building-community-grey.svg" alt="unit" draggable="false" loading="lazy">
                                </div>
                                <div class="unit-name-input">
                                    <label for="unitname">Nama Unit</label>
                                    <input type="text" name="unitname" id="unitname" placeholder="(Cth. Kontrakan, Kost Kosongan, Kost Isian, dsb.)" value="${unitName}">
                                </div>
                                <div class="btn-delete-unit" onclick="deleteUnit(this)">
                                    <img src="/resources/trash-x.svg" alt="delete-unit" draggable="false" loading="lazy">
                                </div>
                            </div>
                            <div class="unit-price">
                                <div class="unit-price-icon">
                                    <img src="/resources/cash.svg" alt="unit-price" draggable="false" loading="lazy">
                                </div>
                                <div class="unit-price-input">
                                    <label for="unitprice">Harga Unit</label>
                                    <input type="number" name="unitprice" id="unitprice" placeholder="" oninput="handleInput(this, ${index})" onfocus="handleFocus(this, ${index})" onblur="handleBlur(this)">
                                    <p class="unitprice-value unit-${index}">${unitPrice}</p>
                                </div>
                                <div class="unit-period-input">
                                    <label for="unitperiod">Periode Harga</label>
                                    <input type="text" name="unitperiod" id="unitperiod" placeholder="(Cth. 1 bulan, 3 bulan, 6 bulan, dsb.)" value="${unitPeriod}">
                                </div>
                            </div>
                        </div>`;

    return unit;
}

function deleteUnit(obj) {
    const unitName = obj.parentElement;
    const unit = unitName.parentElement;
    unit.remove();
}

function resetUnits() {
    units.innerHTML = btnAddUnit;
}

function handleInput(unitPriceInput, index) {
    const unitPriceInputValue = document.querySelector(`.unit-price-input .unitprice-value.unit-${index}`);

    if (unitPriceInput.value < 10000000) {
        unitPriceInputValue.textContent = new Intl.NumberFormat("id", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(unitPriceInput.value || 0);
    } else {
        unitPriceInput.value = unitPriceInputValue.textContent.replace('Rp', '').replaceAll('.', '').trim();
    }
}

function handleFocus(unitPriceInput, index) {
    const unitPriceInputValue = document.querySelector(`.unit-price-input .unitprice-value.unit-${index}`);

    if (unitPriceInput.value == '') {
        setTimeout(() => {
            unitPriceInput.value = unitPriceInputValue.textContent.replace('Rp', '').replaceAll('.', '').trim();
        }, 0);
    }
}

function handleBlur(unitPriceInput) {
    unitPriceInput.value = '';
}


// Contacts
const contacts = document.querySelector('.contacts');
const btnAddContact = `
                        <div class="btn-add-contact" onclick="addNewContact()">
                            <img src="/resources/plus-grey.svg" alt="add-contact" draggable="false" loading="lazy">
                            <p class="hint">Tambahkan kontak baru</p>
                        </div>`;

function addNewContact() {
    const existedContacts = contacts.querySelectorAll('.contact-group');
    let lastContacts = '';
    let totalContacts = 0;

    if (existedContacts) {
        existedContacts.forEach(contact => {
            const contactName = contact.querySelector('.contact-name-input input').value;
            const contactNumber = contact.querySelector('.contact-number-input input').value;
            const dataContact = generateContact(contactName, contactNumber);

            lastContacts = lastContacts != '' ? lastContacts + dataContact : dataContact;
            totalContacts++;
        });
    }

    const newContact = generateContact('', '');
    contacts.innerHTML = lastContacts + newContact + btnAddContact;
}

function generateContact(contactName, contactNumber) {
    const contact = `
                        <div class="contact-group">
                            <div class="contact-name-input">
                                <label for="contactname">Nama Kontak</label>
                                <input type="text" name="contactname" id="contactname" placeholder="(Ketik nama kontak)" value="${contactName}">
                            </div>
                            <div class="contact-number-input">
                                <label for="contactnumber">Nomor Kontak</label>
                                <input type="tel" name="contactnumber" id="contactnumber" placeholder="(Ketik nomor kontak)" value="${contactNumber}">
                            </div>
                            <div class="btn-delete-contact" onclick="deleteContact(this)">
                                <img src="/resources/trash-x.svg" alt="delete-contact" draggable="false" loading="lazy">
                            </div>
                        </div>`;

    return contact;
}

function deleteContact(obj) {
    const contact = obj.parentElement;
    contact.remove();
}

function resetContacts() {
    contacts.innerHTML = btnAddContact;
}


// Form Actions
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = getFormData();

    if (formData) {
        fetch('https://script.google.com/macros/s/AKfycbwBXVENPvilxHa6cCvqB6o9qquZ7__ZxdPNiQmXz5gdONR_U83CKWhVJ-QZJFnvBiy57A/exec?action=create', {
            method: 'POST',
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                setLoaderVisibility('success');
                form.reset();

                console.log(data);
            })
            .catch(error => {
                setLoaderVisibility('error');

                console.error(error);
            });

        setLoaderVisibility('progress');
    }
});

function getFormData() {
    if (form.querySelector('.form-group #name').value.trim().length > 0) {
        if (getContacts().length > 0) {
            const data = {
                name: form.querySelector('.form-group #name').value,
                categories: getCategories(),
                images: imageData,
                address: form.querySelector('.form-group #address').value,
                units: getUnits(),
                facilities: form.querySelector('.form-group #facilities').value,
                maps: form.querySelector('.form-group #maps').value,
                contacts: getContacts()
            };

            return data;
        }

        alert("Harap lengkapi kolom 'Kontak' untuk melanjutkan!");
        return false;
    }

    alert("Harap lengkapi kolom 'Nama' terlebih dahulu!");
    return false;
}

function getCategories() {
    const categories = form.querySelectorAll('.form-group .categories .category-group input[type=checkbox]:checked');
    let data = [];

    categories.forEach(category => {
        data.push(category.value);
    });

    return data;
}

function getUnits() {
    const units = form.querySelectorAll('.form-group .units .unit-group');
    let data = [];

    units.forEach(unit => {
        const unitName = unit.querySelector('.unit-name .unit-name-input input').value.trim();
        const unitPrice = unit.querySelector('.unit-price .unit-price-input .unitprice-value').textContent;
        const unitPeriod = unit.querySelector('.unit-price .unit-period-input input').value.trim();

        if (unitName.length > 0 && unitPrice != 'Rp 0' && unitPeriod.length > 0) {
            const unitData = {
                name: unitName,
                price: unitPrice,
                period: unitPeriod
            }

            data.push(unitData);
        }
    });

    return data;
}

function getContacts() {
    const contacts = form.querySelectorAll('.form-group .contacts .contact-group');
    let data = [];

    contacts.forEach(contact => {
        const contactName = contact.querySelector('.contact-name-input input').value.trim();
        const contactNumber = contact.querySelector('.contact-number-input input').value.trim();

        if (contactName.length > 0 && contactNumber.length > 0) {
            const contactData = {
                name: contactName,
                number: contactNumber
            }

            data.push(contactData);
        }
    });

    return data;
}

form.addEventListener('reset', () => {
    resetImageData();
    resetUnits();
    resetContacts()
});


// Loader
const loader = document.querySelector('.loader');
const loaderOuterColor = loader.querySelector('.outer-color');
const loaderWrapper = loader.querySelector('.loader-wrapper');
const loaderAnim = loaderWrapper.querySelector('iframe');
const loaderTitle = loaderWrapper.querySelector('.loader-label .title');
const loaderDesc = loaderWrapper.querySelector('.loader-label .desc');
const btnCloseLoader = loaderWrapper.querySelector('.btn-close-loader');

function setLoaderVisibility(type) {
    if (type == 'progress') {
        loader.classList.add('active');
        setTimeout(() => {
            loaderOuterColor.classList.add('active');
            loaderWrapper.classList.add('active');
        }, 0);

    } else if (type == 'success') {
        loaderAnim.src = '';

        loaderOuterColor.classList.remove('active');
        loaderWrapper.classList.remove('active');
        setTimeout(() => {
            loaderAnim.src = 'https://lottie.host/embed/88be2eb0-65cb-490b-a43b-03177e2462b8/eyxwRMVsPl.json';
            loaderAnim.style = 'background-color: #EDFFF2;';
            loaderTitle.textContent = 'Sukses';
            loaderDesc.textContent = 'Proses unggah selesai! Data kamu akan segera kami proses.';
            btnCloseLoader.style = 'display: block;';

            loader.classList.add('active');
            setTimeout(() => {
                loaderOuterColor.classList.add('active');
                loaderWrapper.classList.add('active');
            }, 0);
        }, 300);

    } else if (type == 'error') {
        loaderAnim.src = '';

        loaderOuterColor.classList.remove('active');
        loaderWrapper.classList.remove('active');
        setTimeout(() => {
            loaderAnim.src = 'https://lottie.host/embed/94dc31c5-5aed-4520-a5b6-381f6d8ddd3e/HxTU2QqH5S.json';
            loaderAnim.style = 'background-color: #FFEDED;';
            loaderTitle.textContent = 'Gagal';
            loaderDesc.textContent = 'Opps! Maaf sepertinya ada masalah pada sistem kami. Coba beberapa saat lagi.';
            btnCloseLoader.style = 'display: block;';

            loader.classList.add('active');
            setTimeout(() => {
                loaderOuterColor.classList.add('active');
                loaderWrapper.classList.add('active');
            }, 0);
        }, 300);
    }
}

btnCloseLoader.addEventListener('click', () => {
    loaderOuterColor.classList.remove('active');
    loaderWrapper.classList.remove('active');
    setTimeout(() => {
        loaderAnim.src = 'https://lottie.host/embed/bfe71157-e6dc-4447-a800-ea30b4bfcded/3H83Fp5huY.json';
        loaderAnim.style = 'background-color: #ECF1FE;';
        loaderTitle.textContent = 'Mengunggah...';
        loaderDesc.textContent = 'Harap jangan menutup halaman ini sampai proses unggah selesai.';
        btnCloseLoader.style = 'display: none;';

        loader.classList.remove('active');
    }, 300);
});


// Example of implementation of the update and deletion method

// const queryEncoded = encodeURIComponent("kost");
// const data = {};

// fetch(`https://script.google.com/macros/s/AKfycbwBXVENPvilxHa6cCvqB6o9qquZ7__ZxdPNiQmXz5gdONR_U83CKWhVJ-QZJFnvBiy57A/exec?action=search&query=${queryEncoded}`, {
//     method: 'POST',
//     body: JSON.stringify(data)
// })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error(error);
//     });

// const dataa = {
//     "id": "2",
//     "name": "Kost COBA GANTI",
//     "categories": [
//         "Kost Putra",
//         "Isian"
//     ],
//     "images": [
//         "https://ik.imagekit.io/ekomlyo/images/img_ka7LVp36M.jpg",
//         "https://ik.imagekit.io/ekomlyo/images/img_CJahEh7qD.jpg",
//         "https://ik.imagekit.io/ekomlyo/images/img_Ptc7NVVaG.jpg",
//         "https://ik.imagekit.io/ekomlyo/images/img_lFA12FbS2.jpg",
//         "https://ik.imagekit.io/ekomlyo/images/img_kBCA-1ZO2.jpg",
//         "https://ik.imagekit.io/ekomlyo/images/img_w5eIGZ1nL.jpg"
//     ],
//     "address": "Sewon, Kec. Bantul, Kabupaten Bantul, Daerah Istimewa Yogyakarta.",
//     "units": [
//         {
//             "name": "Perbulan",
//             "price": "Rp 700.000",
//             "period": "bulan"
//         },
//         {
//             "name": "Per-3 bulan",
//             "price": "Rp 650.000",
//             "period": "bulan"
//         },
//         {
//             "name": "Per-6 bulan",
//             "price": "Rp 600.000",
//             "period": "bulan"
//         },
//         {
//             "name": "Pertahun",
//             "price": "Rp 500.000",
//             "period": "bulan"
//         }
//     ],
//     "price_range": "Rp 500.000 - Rp 700.000",
//     "facilities": "Fasilitas kamar all new:\n~ km dalam , closet duduk ,  shower \n~ Springbed \n~ Bantal + guling \n~ Sprei \n~ Lemari \n~ Meja + kursi \n~ Wall fan \n~ Gorden jendela\n~ Keset kamar mandi\n~ Keset wellcome\n~ Air galon + pompa\n~ Tempat sampah\n\nFasilitas luar kamar all new all free:\n# Dapur bersama\n# Perlengkapan masak\n# Kompor Rinnai + gas \n# Gula + Teh + Kopi\n# Mesin cuci\n# Jemuran baju\n# Wastafel cuci piring\n# Perlengkapan kebersihan (sapu+pel+serok sampah+tempat sampah+pembersih lantai) \n# Jam dinding\n# Rak piring, gelas, sendok\n# Kunci pagar bawa sendiri2",
//     "maps": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.9071969599345!2d110.34286527455572!3d-7.904763578662901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a555d2e0a2217%3A0x26e6558975d45179!2sKost%20ALIN%20JAYA%20Group!5e0!3m2!1sid!2sid!4v1729534033474!5m2!1sid!2sid",
//     "contacts": [
//         {
//             "name": "Bu Evi",
//             "number": "+62 896-1267-1234"
//         }
//     ]
// };

// // console.log(JSON.stringify(dataa))

// fetch('https://script.google.com/macros/s/AKfycbwBXVENPvilxHa6cCvqB6o9qquZ7__ZxdPNiQmXz5gdONR_U83CKWhVJ-QZJFnvBiy57A/exec?action=delete', {
//     method: 'POST',
//     body: JSON.stringify(dataa)
// })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error(error);
//     });