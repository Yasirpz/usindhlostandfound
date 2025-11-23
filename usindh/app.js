// Mock Data
let items = [
    {
        id: 1,
        type: 'lost',
        name: 'Blue Backpack',
        category: 'bags',
        location: 'Central Library',
        date: '2025-11-20',
        description: 'Nike backpack containing engineering books and a laptop charger.',
        contact: '0300-1234567',
        status: 'verified'
    },
    {
        id: 2,
        type: 'found',
        name: 'Scientific Calculator',
        category: 'electronics',
        location: 'Physics Dept, Room 101',
        date: '2025-11-19',
        description: 'Casio fx-991EX found on the second row desk.',
        contact: 'Admin Office',
        status: 'verified'
    },
    {
        id: 3,
        type: 'lost',
        name: 'Student ID Card',
        category: 'documents',
        location: 'Cafeteria',
        date: '2025-11-21',
        description: 'Name: Ali Khan, Dept: CS.',
        contact: 'ali.khan@scholars.usindh.edu.pk',
        status: 'verified'
    },
    {
        id: 4,
        type: 'found',
        name: 'Car Keys',
        category: 'others',
        location: 'Main Parking Lot',
        date: '2025-11-18',
        description: 'Toyota keys with a leather keychain.',
        contact: 'Security Office Main Gate',
        status: 'verified'
    }
];

// DOM Elements
const itemsContainer = document.getElementById('items-container');
const reportForm = document.getElementById('report-form');
const filterType = document.getElementById('filter-type');
const filterCategory = document.getElementById('filter-category');

// Functions
function renderItems(itemsToRender) {
    if (!itemsContainer) return;

    itemsContainer.innerHTML = ''; // Clear existing items

    if (itemsToRender.length === 0) {
        itemsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No items found.</p>';
        return;
    }

    itemsToRender.forEach(item => {
        const card = document.createElement('div');
        card.className = `item-card ${item.type}`;

        card.innerHTML = `
            <div class="card-body">
                <span class="badge ${item.type}">${item.type.toUpperCase()}</span>
                <h3 class="card-title">${item.name}</h3>
                <div class="card-info">
                    <i class="fa-solid fa-location-dot"></i> ${item.location}
                </div>
                <div class="card-info">
                    <i class="fa-regular fa-calendar"></i> ${item.date}
                </div>
                <div class="card-info">
                    <i class="fa-solid fa-tag"></i> ${item.category}
                </div>
                <p style="margin: 10px 0; color: #555;">${item.description}</p>
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee;">
                    <strong>Contact:</strong> ${item.contact}
                </div>
                ${item.status === 'pending' ? '<div class="item-status pending" style="margin-top:10px; color:orange; font-weight:bold;">Pending Verification</div>' : ''}
            </div>
        `;
        itemsContainer.appendChild(card);
    });
}

function handleReportSubmit(e) {
    e.preventDefault();

    const formData = new FormData(reportForm);
    const newItem = {
        id: Date.now(),
        type: formData.get('type'),
        name: formData.get('name'),
        category: formData.get('category'),
        location: formData.get('location'),
        date: formData.get('date'),
        description: formData.get('description'),
        contact: formData.get('contact'),
        status: 'pending' // New items are pending verification
    };

    const currentItems = JSON.parse(localStorage.getItem('uos_items')) || items;
    currentItems.unshift(newItem);
    localStorage.setItem('uos_items', JSON.stringify(currentItems));

    alert('Report submitted successfully! It will be visible after verification.');
    window.location.href = 'items.html';
}

function loadItems() {
    const storedItems = localStorage.getItem('uos_items');
    if (storedItems) {
        items = JSON.parse(storedItems);
    } else {
        localStorage.setItem('uos_items', JSON.stringify(items));
    }

    // Apply filters if they exist
    if (filterType && filterCategory) {
        filterItems();
    } else {
        renderItems(items.filter(item => item.status === 'verified'));
    }
}

function filterItems() {
    const typeValue = filterType.value;
    const categoryValue = filterCategory.value;

    const filtered = items.filter(item => {
        const matchType = typeValue === 'all' || item.type === typeValue;
        const matchCategory = categoryValue === 'all' || item.category === categoryValue;
        const matchStatus = item.status === 'verified';
        return matchType && matchCategory && matchStatus;
    });

    renderItems(filtered);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
    checkAuth();
});

if (reportForm) {
    reportForm.addEventListener('submit', handleReportSubmit);
}

if (filterType) {
    filterType.addEventListener('change', filterItems);
}

if (filterCategory) {
    filterCategory.addEventListener('change', filterItems);
}

// Auth Event Listeners
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

// Auth Functions
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const users = JSON.parse(localStorage.getItem('uos_users')) || [];

    if (users.find(u => u.email === email)) {
        alert("User already exists with this email!");
        return;
    }

    users.push({ name, email, password, role: 'user' });
    localStorage.setItem('uos_users', JSON.stringify(users));

    alert("Registration successful! Please login.");
    window.location.href = 'login.html';
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Admin Check
    if (email === 'yasirpzshar@gmail.com' && password === 'Yasir123@') {
        const adminUser = { name: 'Admin Yasir', email: email, role: 'admin' };
        localStorage.setItem('uos_currentUser', JSON.stringify(adminUser));
        alert("Welcome Admin!");
        window.location.href = 'admin.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem('uos_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('uos_currentUser', JSON.stringify(user));
        alert(`Welcome back, ${user.name}!`);
        window.location.href = 'index.html';
    } else {
        alert("Invalid email or password!");
    }
}

function logout() {
    localStorage.removeItem('uos_currentUser');
    window.location.href = 'login.html';
}

function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('uos_currentUser'));
    const navList = document.querySelector('.main-nav ul');

    if (currentUser) {
        // User is logged in
        if (navList) {
            let navLinks = `
                <li><a href="index.html">Home</a></li>
                <li><a href="items.html">Browse Items</a></li>
                <li><a href="report.html">Report Item</a></li>
            `;

            if (currentUser.role === 'admin') {
                navLinks += `<li><a href="admin.html" style="color: var(--warning);">Admin Dashboard</a></li>`;
            }

            navLinks += `<li><a href="#" onclick="logout()">Logout (${currentUser.name.split(' ')[0]})</a></li>`;

            navList.innerHTML = navLinks;
        }
    } else {
        // User is not logged in
        if (navList) {
            navList.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="items.html">Browse Items</a></li>
                <li><a href="login.html">Login</a></li>
                <li><a href="register.html">Register</a></li>
            `;
        }

        // Protect report page
        if (window.location.pathname.includes('report.html')) {
            alert("You must be logged in to report an item.");
            window.location.href = 'login.html';
        }
    }

    // Highlight active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.main-nav a');
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}
