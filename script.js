// Initialize default users if not exists
if (!localStorage.getItem('users')) {
    const defaultUsers = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'user', password: 'user123', role: 'user' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// Initialize medicines if not exists
if (!localStorage.getItem('medicines')) {
    const defaultMedicines = [
        { id: 1, name: 'Paracetamol', quantity: 100, price: 5, description: 'Pain reliever and fever reducer' },
        { id: 2, name: 'Aspirin', quantity: 150, price: 4, description: 'Pain reliever and anti-inflammatory' },
        { id: 3, name: 'Ibuprofen', quantity: 80, price: 6, description: 'Pain reliever and fever reducer' }
    ];
    localStorage.setItem('medicines', JSON.stringify(defaultMedicines));
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users'));
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error-message').textContent = 'Invalid username or password';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).style.display = 'block';
    
    // Update active state in navigation
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionName}')"]`).classList.add('active');
}

function displayMedicines() {
    const medicines = JSON.parse(localStorage.getItem('medicines'));
    const medicineList = document.getElementById('medicine-list');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!medicineList) return;
    
    medicineList.innerHTML = medicines.map(medicine => `
        <div class="medicine-card">
            <h3>${medicine.name}</h3>
            <p class="description">${medicine.description}</p>
            <div class="medicine-details">
                <p><i class="fas fa-boxes"></i> Quantity: ${medicine.quantity}</p>
                <p><i class="fas fa-tag"></i> Price: $${medicine.price}</p>
            </div>
            ${currentUser.role === 'admin' ? `
                <div class="action-buttons">
                    <button class="edit-btn" onclick="updateMedicine(${medicine.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteMedicine(${medicine.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function addMedicine() {
    const name = document.getElementById('medicine-name').value;
    const quantity = parseInt(document.getElementById('medicine-quantity').value);
    const price = parseFloat(document.getElementById('medicine-price').value);
    
    if (!name || !quantity || !price) {
        alert('Please fill in all fields');
        return;
    }
    
    const medicines = JSON.parse(localStorage.getItem('medicines'));
    const newId = medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1;
    
    medicines.push({
        id: newId,
        name,
        quantity,
        price,
        description: 'New medicine'
    });
    
    localStorage.setItem('medicines', JSON.stringify(medicines));
    displayMedicines();
    
    // Clear form
    document.getElementById('medicine-name').value = '';
    document.getElementById('medicine-quantity').value = '';
    document.getElementById('medicine-price').value = '';
    
    // Show success message
    alert('Medicine added successfully!');
}

function updateMedicine(id) {
    const medicines = JSON.parse(localStorage.getItem('medicines'));
    const medicine = medicines.find(m => m.id === id);
    
    const newName = prompt('Enter new name:', medicine.name);
    const newQuantity = prompt('Enter new quantity:', medicine.quantity);
    const newPrice = prompt('Enter new price:', medicine.price);
    
    if (newName && newQuantity && newPrice) {
        medicine.name = newName;
        medicine.quantity = parseInt(newQuantity);
        medicine.price = parseFloat(newPrice);
        localStorage.setItem('medicines', JSON.stringify(medicines));
        displayMedicines();
    }
}

function deleteMedicine(id) {
    if (confirm('Are you sure you want to delete this medicine?')) {
        const medicines = JSON.parse(localStorage.getItem('medicines'));
        const updatedMedicines = medicines.filter(m => m.id !== id);
        localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
        displayMedicines();
    }
}

function searchMedicines() {
    const searchTerm = document.getElementById('search-medicine').value.toLowerCase();
    const medicines = JSON.parse(localStorage.getItem('medicines'));
    const filteredMedicines = medicines.filter(medicine => 
        medicine.name.toLowerCase().includes(searchTerm) ||
        medicine.description.toLowerCase().includes(searchTerm)
    );
    
    const medicineList = document.getElementById('medicine-list');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    medicineList.innerHTML = filteredMedicines.map(medicine => `
        <div class="medicine-card">
            <h3>${medicine.name}</h3>
            <p class="description">${medicine.description}</p>
            <div class="medicine-details">
                <p><i class="fas fa-boxes"></i> Quantity: ${medicine.quantity}</p>
                <p><i class="fas fa-tag"></i> Price: $${medicine.price}</p>
            </div>
            ${currentUser.role === 'admin' ? `
                <div class="action-buttons">
                    <button class="edit-btn" onclick="updateMedicine(${medicine.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteMedicine(${medicine.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = 'index.html';
        }
        return;
    }
    
    // Show admin section if user is admin
    if (currentUser.role === 'admin') {
        document.getElementById('admin-section').style.display = 'block';
    }
    
    // Display medicines
    if (document.getElementById('medicine-list')) {
        displayMedicines();
    }
});

// Menu Items Data
const menuItems = [
    {
        id: 1,
        name: "Classic Burger",
        price: 12.99,
        category: "main",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        description: "Juicy beef patty with fresh vegetables"
    },
    {
        id: 2,
        name: "Margherita Pizza",
        price: 14.99,
        category: "main",
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500",
        description: "Fresh tomatoes, mozzarella, and basil"
    },
    {
        id: 3,
        name: "Chocolate Cake",
        price: 6.99,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        description: "Rich chocolate cake with ganache"
    },
    {
        id: 4,
        name: "Fruit Smoothie",
        price: 4.99,
        category: "beverage",
        image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500",
        description: "Blend of fresh seasonal fruits"
    },
    {
        id: 5,
        name: "Caesar Salad",
        price: 8.99,
        category: "main",
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500",
        description: "Crispy lettuce with classic Caesar dressing"
    },
    {
        id: 6,
        name: "Ice Cream Sundae",
        price: 5.99,
        category: "dessert",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500",
        description: "Vanilla ice cream with toppings"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayMenuItems('all');
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Menu filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-filter');
            filterBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            displayMenuItems(category);
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });

            // Update active state
            navLinks.forEach(link => link.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Display Menu Items
function displayMenuItems(category) {
    const menuGrid = document.getElementById('menuGrid');
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);

    menuGrid.innerHTML = filteredItems.map(item => `
        <div class="menu-item" data-aos="fade-up">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <p class="menu-item-price">$${item.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    // Add animation to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
    });
}

// Handle Contact Form Submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Here you would typically send this data to a server
    // For this example, we'll just show a success message
    alert(`Thank you ${name}! Your message has been sent.`);
    e.target.reset();
}

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1 });

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Update active navigation link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// --- MOON PHASE CALCULATION AND DISPLAY ---

// Returns moon phase (0=new, 0.5=full, 1=new)
function getMoonPhase(date) {
    // John Conway's algorithm
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JS months 0-11
    const day = date.getDate();
    let r = year % 100;
    r %= 19;
    if (r > 9) r -= 19;
    r = ((r * 11) % 30) + month + day;
    if (month < 3) r += 2;
    const phase = (r < 0 ? r + 30 : r) % 30;
    return phase / 29.53; // Normalize: 0=new, 0.5=full, 1=new
}

function setMoonPhase(phase) {
    // phase: 0=new, 0.5=full, 1=new
    const moon = document.getElementById('moon');
    // Remove previous phase classes
    moon.className = '';
    moon.classList.add('moon-base');
    if (phase < 0.03 || phase > 0.97) {
        moon.classList.add('new-moon');
    } else if (phase < 0.22) {
        moon.classList.add('waxing-crescent');
    } else if (phase < 0.28) {
        moon.classList.add('first-quarter');
    } else if (phase < 0.47) {
        moon.classList.add('waxing-gibbous');
    } else if (phase < 0.53) {
        moon.classList.add('full-moon');
    } else if (phase < 0.72) {
        moon.classList.add('waning-gibbous');
    } else if (phase < 0.78) {
        moon.classList.add('last-quarter');
    } else {
        moon.classList.add('waning-crescent');
    }
}

function calculateAge(birthDate, compareDate) {
    let years = compareDate.getFullYear() - birthDate.getFullYear();
    let months = compareDate.getMonth() - birthDate.getMonth();
    let days = compareDate.getDate() - birthDate.getDate();
    if (days < 0) {
        months--;
        days += new Date(compareDate.getFullYear(), compareDate.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return { years, months, days };
}

function getIslamicDate(gregorianDate) {
    // First choice: Umm al-Qura calendar (more accurate for current Hijri month).
    try {
        const formatter = new Intl.DateTimeFormat('en-SA-u-ca-islamic-umalqura', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const resolved = formatter.resolvedOptions();
        if (resolved.calendar && resolved.calendar.toLowerCase().includes('islamic')) {
            const parts = formatter.formatToParts(gregorianDate);
            const dayPart = parts.find(part => part.type === 'day')?.value;
            const monthPart = parts.find(part => part.type === 'month')?.value;
            const yearPart = parts.find(part => part.type === 'year')?.value;
            const gregorianMonthNames = [
                'january', 'february', 'march', 'april', 'may', 'june',
                'july', 'august', 'september', 'october', 'november', 'december'
            ];
            const isGregorianMonth = monthPart && gregorianMonthNames.includes(monthPart.toLowerCase());
            if (dayPart && monthPart && yearPart) {
                // Some mobile browsers report Islamic calendar but still return Gregorian month names.
                // In that case, ignore Intl output and use reliable manual conversion below.
                if (isGregorianMonth) {
                    throw new Error('Intl fallback returned Gregorian month name.');
                }
                return `${dayPart} ${monthPart} ${yearPart} AH`;
            }
            return formatter.format(gregorianDate);
        }
    } catch (e) {
        // Fallback below when Intl Islamic calendar isn't available.
    }

    // Fallback: Islamic Civil conversion (approximate).
    const day = gregorianDate.getDate();
    const month = gregorianDate.getMonth() + 1;
    const year = gregorianDate.getFullYear();
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jd = day + Math.floor((153 * m + 2) / 5) + (365 * y) + Math.floor(y / 4)
        - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719)
        + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
        - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const monthH = Math.floor((24 * l3) / 709);
    const dayH = l3 - Math.floor((709 * monthH) / 24);
    const yearH = 30 * n + j - 30;

    const hijriMonths = [
        "Muharram",
        "Safar",
        "Rabi al-Awwal",
        "Rabi al-Thani",
        "Jumada al-Awwal",
        "Jumada al-Thani",
        "Rajab",
        "Shaban",
        "Ramadan",
        "Shawwal",
        "Dhu al-Qadah",
        "Dhu al-Hijjah"
    ];
    const monthName = hijriMonths[Math.max(0, Math.min(11, monthH - 1))];
    return `${dayH} ${monthName} ${yearH} AH`;
}

function parseDateInput(dateStr) {
    if (!dateStr) return null;
    const raw = String(dateStr).trim();
    let year;
    let month;
    let day;

    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(raw)) {
        [year, month, day] = raw.split('-').map(Number);
    } else if (/^\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4}$/.test(raw)) {
        // Some phones use DD/MM/YYYY while others use MM/DD/YYYY.
        // Use a safe heuristic so we do not swap month/day incorrectly.
        const separator = raw.includes('/') ? '/' : (raw.includes('.') ? '.' : '-');
        const parts = raw.split(separator).map(Number);
        const first = parts[0];
        const second = parts[1];
        year = parts[2];

        if (first > 12 && second <= 12) {
            // DD/MM/YYYY
            day = first;
            month = second;
        } else if (second > 12 && first <= 12) {
            // MM/DD/YYYY
            month = first;
            day = second;
        } else {
            // Ambiguous (both <= 12): prefer DD/MM for international/mobile locales.
            day = first;
            month = second;
        }
    } else {
        const parsed = new Date(raw);
        if (Number.isNaN(parsed.getTime())) return null;
        year = parsed.getFullYear();
        month = parsed.getMonth() + 1;
        day = parsed.getDate();
    }

    const date = new Date(year, month - 1, day, 12, 0, 0, 0);
    if (Number.isNaN(date.getTime())) return null;
    if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day
    ) return null;
    return date;
}

function getDateFromInput(inputEl) {
    if (!inputEl) return null;
    const parsedFromValue = parseDateInput(inputEl.value);
    if (parsedFromValue) return parsedFromValue;
    if (typeof inputEl.valueAsNumber === 'number' && !Number.isNaN(inputEl.valueAsNumber)) {
        const date = new Date(inputEl.valueAsNumber);
        if (!Number.isNaN(date.getTime())) return date;
    }
    return null;
}

function clearBirthdateResults() {
    const ageEl = document.getElementById('age-result');
    const islamicEl = document.getElementById('islamic-date-result');
    if (ageEl) ageEl.textContent = '';
    if (islamicEl) islamicEl.textContent = '';
}

function renderBirthdateResults() {
    const birthInput = document.getElementById('birthdate');
    const compareInput = document.getElementById('compare-date');
    const ageEl = document.getElementById('age-result');
    const islamicEl = document.getElementById('islamic-date-result');
    if (!birthInput || !compareInput || !ageEl || !islamicEl) return;

    if (!birthInput.value) {
        clearBirthdateResults();
        return;
    }

    const birthdate = getDateFromInput(birthInput);
    if (!birthdate) {
        islamicEl.textContent = 'Invalid birth date format.';
        ageEl.textContent = '';
        return;
    }

    const compareDate = compareInput.value ? getDateFromInput(compareInput) : new Date();
    if (compareInput.value && !compareDate) {
        ageEl.textContent = 'Invalid compare date format.';
        islamicEl.textContent = '';
        return;
    }

    const phase = getMoonPhase(birthdate);
    setMoonPhase(phase);

    const age = calculateAge(birthdate, compareDate);
    ageEl.textContent = `You are ${age.years} year${age.years !== 1 ? 's' : ''}, ${age.months} month${age.months !== 1 ? 's' : ''}, and ${age.days} day${age.days !== 1 ? 's' : ''} old.`;

    const islamicDate = getIslamicDate(birthdate);
    islamicEl.textContent = `Islamic (Hijri) date of birth: ${islamicDate}`;
}

const birthdateForm = document.getElementById('birthdate-form');
const birthdateInput = document.getElementById('birthdate');
const compareDateInput = document.getElementById('compare-date');

if (birthdateForm) {
    birthdateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        renderBirthdateResults();
    });
}

if (birthdateInput) {
    birthdateInput.addEventListener('change', renderBirthdateResults);
    birthdateInput.addEventListener('input', renderBirthdateResults);
}

if (compareDateInput) {
    compareDateInput.addEventListener('change', renderBirthdateResults);
    compareDateInput.addEventListener('input', renderBirthdateResults);
}