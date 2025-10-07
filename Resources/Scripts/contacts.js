function initContactsSection(container) {
    if (!container) return;

    console.log('Initializing contacts section with custom duck...');

    const toggleButton = container.querySelector('#gooseToggle');
    if (!toggleButton) {
        console.log('No goose toggle button found in container');
        return;
    }

    let duckActive = false;
    let duckElement = null;

    // Add styles for duck and button
    const style = document.createElement('style');
    style.textContent = `
        .goose-toggle-btn {
            background: #4a90e2;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 30px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            margin: 25px auto;
            display: block;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            min-width: 200px;
        }
        .goose-toggle-btn:hover {
            background: #357abd;
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }
        .goose-toggle-btn:active {
            transform: translateY(-1px);
        }
        .goose-toggle-btn.banish {
            background: #ff4757;
            animation: pulse 1.5s infinite;
        }
        
        /* Custom Duck Styles */
        .custom-duck {
            position: fixed;
            width: 60px;
            height: 60px;
            z-index: 10000;
            pointer-events: none;
            user-select: none;
            transition: transform 0.2s ease;
        }
        
        .duck-body {
            position: absolute;
            width: 50px;
            height: 40px;
            background: #ffeb3b;
            border-radius: 50% 50% 45% 45%;
            top: 10px;
            left: 5px;
        }
        
        .duck-head {
            position: absolute;
            width: 35px;
            height: 35px;
            background: #ffeb3b;
            border-radius: 50%;
            top: 0;
            left: 25px;
        }
        
        .duck-beak {
            position: absolute;
            width: 15px;
            height: 8px;
            background: #ff9800;
            border-radius: 50%;
            top: 15px;
            left: 55px;
        }
        
        .duck-eye {
            position: absolute;
            width: 6px;
            height: 6px;
            background: #000;
            border-radius: 50%;
            top: 10px;
            left: 45px;
        }
        
        .duck-wing {
            position: absolute;
            width: 20px;
            height: 15px;
            background: #ffd54f;
            border-radius: 50%;
            top: 20px;
            left: 15px;
            transform-origin: right center;
            animation: wingFlap 0.5s ease-in-out infinite alternate;
        }
        
        .duck-feet {
            position: absolute;
            width: 8px;
            height: 4px;
            background: #ff9800;
            border-radius: 50%;
            top: 50px;
        }
        
        .duck-foot-left {
            left: 20px;
            transform: rotate(-20deg);
        }
        
        .duck-foot-right {
            left: 32px;
            transform: rotate(20deg);
        }
        
        .duck-trail {
            position: absolute;
            width: 10px;
            height: 5px;
            background: rgba(255, 235, 59, 0.3);
            border-radius: 50%;
            animation: fadeOut 1s forwards;
        }
        
        .duck-message {
            position: absolute;
            background: white;
            border: 2px solid #4a90e2;
            border-radius: 10px;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: bold;
            color: #333;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            white-space: nowrap;
            z-index: 10001;
            animation: messageFloat 3s forwards;
        }
        
        @keyframes wingFlap {
            0% { transform: rotate(-10deg); }
            100% { transform: rotate(10deg); }
        }
        
        @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.5); }
        }
        
        @keyframes messageFloat {
            0% { opacity: 0; transform: translateY(10px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(255, 71, 87, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
        }
        
        .duck-walking {
            animation: walk 0.5s linear infinite;
        }
        
        @keyframes walk {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);

    // Duck messages
    const duckMessages = [
        "Honk! 🦆",
        "Quack! Contact me!",
        "Baguio is cool! 🌲",
        "Call me maybe? 📞",
        "Email time! ✉️",
        "Let's connect! 🔗",
        "Philippines! 🇵🇭",
        "Hello from Duck!",
        "Drag me around!",
        "I like your contacts!"
    ];

    // Create duck element
    function createDuck() {
        const duck = document.createElement('div');
        duck.className = 'custom-duck duck-walking';
        duck.innerHTML = `
            <div class="duck-body"></div>
            <div class="duck-head"></div>
            <div class="duck-beak"></div>
            <div class="duck-eye"></div>
            <div class="duck-wing"></div>
            <div class="duck-feet duck-foot-left"></div>
            <div class="duck-feet duck-foot-right"></div>
        `;
        
        // Position duck randomly on screen
        const x = Math.random() * (window.innerWidth - 100) + 50;
        const y = Math.random() * (window.innerHeight - 100) + 50;
        duck.style.left = x + 'px';
        duck.style.top = y + 'px';
        
        // Make duck draggable
        makeDraggable(duck);
        
        document.body.appendChild(duck);
        return duck;
    }

    // Make element draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.onmousedown = dragMouseDown;
        element.ontouchstart = touchStart;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function touchStart(e) {
            e.preventDefault();
            const touch = e.touches[0];
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            document.ontouchend = closeDragElement;
            document.ontouchmove = touchMove;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            
            // Leave trail
            createTrail(element);
        }
        
        function touchMove(e) {
            e.preventDefault();
            const touch = e.touches[0];
            pos1 = pos3 - touch.clientX;
            pos2 = pos4 - touch.clientY;
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            
            // Leave trail
            createTrail(element);
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
        }
    }

    // Create trail effect
    function createTrail(element) {
        const trail = document.createElement('div');
        trail.className = 'duck-trail';
        trail.style.left = (parseInt(element.style.left) + 30) + 'px';
        trail.style.top = (parseInt(element.style.top) + 45) + 'px';
        document.body.appendChild(trail);
        
        // Remove trail after animation
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1000);
    }

    // Show random message
    function showRandomMessage(duck) {
        const message = duckMessages[Math.floor(Math.random() * duckMessages.length)];
        const messageElement = document.createElement('div');
        messageElement.className = 'duck-message';
        messageElement.textContent = message;
        
        // Position message near duck
        messageElement.style.left = (parseInt(duck.style.left) + 70) + 'px';
        messageElement.style.top = (parseInt(duck.style.top) - 20) + 'px';
        
        document.body.appendChild(messageElement);
        
        // Remove message after animation
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }

    // Move duck randomly
    function moveDuckRandomly(duck) {
        if (!duckActive) return;
        
        const newX = Math.random() * (window.innerWidth - 100);
        const newY = Math.random() * (window.innerHeight - 100);
        
        duck.style.transition = 'all 2s ease-in-out';
        duck.style.left = newX + 'px';
        duck.style.top = newY + 'px';
        
        // Show message occasionally
        if (Math.random() < 0.3) {
            setTimeout(() => showRandomMessage(duck), 1000);
        }
        
        // Schedule next move
        setTimeout(() => moveDuckRandomly(duck), 3000 + Math.random() * 4000);
    }

    // Toggle duck function
    function toggleDuck() {
        if (duckActive) {
            // Remove duck
            if (duckElement && duckElement.parentNode) {
                duckElement.parentNode.removeChild(duckElement);
            }
            duckElement = null;
            duckActive = false;
            toggleButton.innerHTML = '🦆 SUMMON THE DUCK!!!';
            toggleButton.classList.remove('banish');
            console.log('Duck banished');
        } else {
            // Create duck
            duckElement = createDuck();
            duckActive = true;
            toggleButton.innerHTML = '🚫 BANISH THE DUCK!!!';
            toggleButton.classList.add('banish');
            console.log('Duck summoned');
            
            // Start random movement
            setTimeout(() => moveDuckRandomly(duckElement), 1000);
            
            // Show initial message
            setTimeout(() => showRandomMessage(duckElement), 500);
        }
    }

    // Attach event listener
    console.log('Attaching event listener to toggle button');
    toggleButton.addEventListener('click', toggleDuck);

    // Return control methods
    return {
        summonDuck: () => {
            if (!duckActive) {
                toggleDuck();
            }
        },
        banishDuck: () => {
            if (duckActive) {
                toggleDuck();
            }
        },
        isDuckActive: () => duckActive
    };
}

// Make function globally available
window.initContactsSection = initContactsSection;

// Debug function
window.debugDuck = function() {
    console.log('=== DUCK DEBUG INFO ===');
    console.log('Duck active:', window.duckActive);
    console.log('Toggle button:', document.querySelector('#gooseToggle'));
    console.log('Duck element:', document.querySelector('.custom-duck'));
};