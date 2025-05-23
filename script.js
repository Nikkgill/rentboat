// 3D Animated Glowing Fish Background using Three.js
window.addEventListener('DOMContentLoaded', () => {
    // Remove any existing background canvas
    const oldCanvas = document.getElementById('bg3d');
    if (oldCanvas) oldCanvas.remove();

    // Create a full-window canvas for the background
    const bgCanvas = document.createElement('canvas');
    bgCanvas.id = 'bg3d';
    bgCanvas.style.position = 'fixed';
    bgCanvas.style.top = '0';
    bgCanvas.style.left = '0';
    bgCanvas.style.width = '100vw';
    bgCanvas.style.height = '100vh';
    bgCanvas.style.zIndex = '-1';
    bgCanvas.style.pointerEvents = 'none';
    document.body.prepend(bgCanvas);

    // Setup Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080d); // Almost black
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 13;
    const renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Glowing blue fish
    const fishCount = 12;
    const fishes = [];
    const fishGeometry = new THREE.SphereGeometry(0.45, 24, 12);
    // Fish material with glow
    const fishMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00c6ff,
        emissive: 0x0072ff,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.4,
        transparent: true,
        opacity: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    // Fish bodies
    for (let i = 0; i < fishCount; i++) {
        const fish = new THREE.Mesh(fishGeometry, fishMaterial.clone());
        fish.scale.x = 2.2 + Math.random(); // elongate for fish body
        fish.scale.y = 0.7 + Math.random() * 0.2;
        fish.scale.z = 0.7 + Math.random() * 0.2;
        fish.position.x = (Math.random() - 0.5) * 18;
        fish.position.y = (Math.random() - 0.5) * 10;
        fish.position.z = (Math.random() - 0.5) * 8;
        fish.userData = {
            speed: 0.007 + Math.random() * 0.012,
            angle: Math.random() * Math.PI * 2,
            axis: Math.random() > 0.5 ? 1 : -1,
            baseY: fish.position.y,
            wiggle: Math.random() * Math.PI * 2
        };
        scene.add(fish);
        fishes.push(fish);
    }

    // Glowing blue ambient light
    const ambientLight = new THREE.AmbientLight(0x00c6ff, 0.45);
    scene.add(ambientLight);
    // Directional light for highlights
    const dirLight = new THREE.DirectionalLight(0x00c6ff, 0.8);
    dirLight.position.set(6, 10, 12);
    scene.add(dirLight);
    // Soft backlight for glow
    const backLight = new THREE.PointLight(0x0072ff, 2.2, 30);
    backLight.position.set(-8, -6, -10);
    scene.add(backLight);

    // Animate fish swimming
    function animate() {
        const t = Date.now() * 0.001;
        fishes.forEach((fish, i) => {
            const d = fish.userData;
            // Swim in a wavy circle
            d.angle += d.speed * d.axis;
            fish.position.x = Math.cos(d.angle + i) * (7 + Math.sin(t + i) * 2);
            fish.position.y = d.baseY + Math.sin(d.angle * 2 + t + i) * 1.3;
            fish.position.z = Math.sin(d.angle + i) * (5 + Math.cos(t + i) * 1.4);
            // Wiggle effect
            fish.rotation.y = Math.sin(t * 2 + i * 0.7) * 0.4;
            fish.rotation.z = Math.cos(t * 2.2 + i) * 0.13;
        });
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    // Responsive resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});

// --- RENT NOW LOGIN CHECK ---
function handleRentNow(product) {
    if (!localStorage.getItem('isLoggedIn')) {
        // Not logged in, redirect to login page with product info
        window.location.href = `login.html?redirect=payment.html?product=${encodeURIComponent(product)}`;
    } else {
        // Logged in, go to payment page
        window.location.href = `payment.html?product=${encodeURIComponent(product)}`;
    }
}

// --- LOGIN PAGE LOGIC ---
if (window.location.pathname.endsWith('login.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Default user
        let users = [
            { email: 'test@example.com', password: 'password123' },
        ];
        // Add users from localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.concat(storedUsers);
        const form = document.querySelector('form');
        let errorMsg = document.getElementById('login-error');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.id = 'login-error';
            errorMsg.style.color = 'red';
            errorMsg.style.marginTop = '10px';
            form.parentNode.insertBefore(errorMsg, form.nextSibling);
        }
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value;
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    localStorage.setItem('isLoggedIn', 'true');
                    errorMsg.textContent = '';
                    const params = new URLSearchParams(window.location.search);
                    const redirect = params.get('redirect');
                    window.location.href = redirect ? redirect : 'index.html';
                } else {
                    errorMsg.textContent = 'Invalid email or password.';
                }
            });
        }
    });
}


// --- SIGNUP PAGE LOGIC ---
if (window.location.pathname.endsWith('signup.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.querySelector('form');
        let errorMsg = document.getElementById('signup-error');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.id = 'signup-error';
            errorMsg.style.color = 'red';
            errorMsg.style.marginTop = '10px';
            form.parentNode.insertBefore(errorMsg, form.nextSibling);
        }
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('signup-email').value.trim();
                const password = document.getElementById('signup-password').value;
                const confirm = document.getElementById('signup-confirm').value;
                if (password !== confirm) {
                    errorMsg.textContent = 'Passwords do not match.';
                    return;
                }
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                if (users.find(u => u.email === email)) {
                    errorMsg.textContent = 'Email already registered.';
                    return;
                }
                users.push({ email, password });
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('isLoggedIn', 'true');
                errorMsg.textContent = '';
                window.location.href = 'index.html';
            });
        }
    });
}


// --- END LOGIN LOGIC ---
window.addEventListener('DOMContentLoaded', () => {
    // --- NAV LOGIN/LOGOUT CONTROL ---
    const navLogin = document.getElementById('nav-login');
    const navSignup = document.getElementById('nav-signup');
    const navLogout = document.getElementById('nav-logout');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (navLogin && navSignup && navLogout) {
        if (isLoggedIn) {
            navLogin.style.display = 'none';
            navSignup.style.display = 'none';
            navLogout.style.display = '';
        } else {
            navLogin.style.display = '';
            navSignup.style.display = '';
            navLogout.style.display = 'none';
        }
        navLogout.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            window.location.reload();
        };
    }

    // Create a full-window canvas for the background
    const bgCanvas = document.createElement('canvas');
    bgCanvas.id = 'bg3d';
    bgCanvas.style.position = 'fixed';
    bgCanvas.style.top = '0';
    bgCanvas.style.left = '0';
    bgCanvas.style.width = '100vw';
    bgCanvas.style.height = '100vh';
    bgCanvas.style.zIndex = '-1';
    bgCanvas.style.pointerEvents = 'none';
    document.body.prepend(bgCanvas);

    // Setup Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f2027);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create floating particles (bubbles/water drops)
    const particles = [];
    const particleGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const particleMaterial = new THREE.MeshPhongMaterial({ color: 0x00c6ff, transparent: true, opacity: 0.55 });
    for (let i = 0; i < 60; i++) {
        const mesh = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        mesh.position.x = (Math.random() - 0.5) * 12;
        mesh.position.y = (Math.random() - 0.5) * 8;
        mesh.position.z = (Math.random() - 0.5) * 6;
        mesh.material.opacity = 0.35 + Math.random() * 0.4;
        scene.add(mesh);
        particles.push(mesh);
    }

    // Soft blue light
    const ambientLight = new THREE.AmbientLight(0x99ccff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x00c6ff, 0.7);
    dirLight.position.set(3, 6, 7);
    scene.add(dirLight);

    // Animate particles (floating up and gently oscillating)
    function animate() {
        particles.forEach((p, i) => {
            p.position.y += 0.01 + Math.sin(Date.now() * 0.0005 + i) * 0.003;
            p.position.x += Math.sin(Date.now() * 0.0003 + i * 2) * 0.002;
            if (p.position.y > 5) p.position.y = -4.5;
        });
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    // Responsive resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
