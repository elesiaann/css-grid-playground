const containerTextarea = document.getElementById('container-css');
const itemTextarea = document.getElementById('item-css');
const liveStyles = document.getElementById('live-styles');
const gridContainer = document.getElementById('grid-container');
const templateSelect = document.getElementById('template-select');
const addItemBtn = document.getElementById('add-item');
const removeItemBtn = document.getElementById('remove-item');
const copyCssBtn = document.getElementById('copy-css');
const errorDisplay = document.getElementById('error-display');

// Templates Data
const templates = {
    basic: {
        container: `display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 1rem;\nheight: 100%;`,
        items: `padding: 2rem;`,
        count: 6
    },
    'holy-grail': {
        container: `display: grid;\ngrid-template-columns: 200px 1fr 200px;\ngrid-template-rows: 80px 1fr 100px;\ngap: 10px;\nheight: 100%;`,
        items: `/* Specific item positioning example: */\n.grid-item:nth-child(1) { grid-column: 1 / 4; }\n.grid-item:nth-child(2) { grid-row: 2 / 3; }\n.grid-item:nth-child(5) { grid-column: 1 / 4; }`,
        count: 5
    },
    mosaic: {
        container: `display: grid;\ngrid-template-columns: repeat(4, 1fr);\ngrid-auto-rows: 150px;\ngap: 15px;`,
        items: `.grid-item:nth-child(1) { grid-column: span 2; grid-row: span 2; }\n.grid-item:nth-child(2) { grid-column: span 2; }\n.grid-item:nth-child(6) { grid-column: span 3; }`,
        count: 8
    },
    'twelve-column': {
        container: `display: grid;\ngrid-template-columns: repeat(12, 1fr);\ngap: 10px;`,
        items: `.grid-item:nth-child(1) { grid-column: span 12; }\n.grid-item:nth-child(2) { grid-column: span 4; }\n.grid-item:nth-child(3) { grid-column: span 8; }`,
        count: 4
    },
    'auto-fill': {
        container: `display: grid;\ngrid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\ngap: 20px;`,
        items: `padding: 3rem;\nborder-radius: 12px;`,
        count: 8
    }
};

// State
let itemCount = 8;

// Initialize
function init() {
    renderItems();
    applyTemplate('basic');
    
    // Event Listeners
    containerTextarea.addEventListener('input', updateStyles);
    itemTextarea.addEventListener('input', updateStyles);
    
    templateSelect.addEventListener('change', (e) => {
        applyTemplate(e.target.value);
    });
    
    addItemBtn.addEventListener('click', () => {
        itemCount++;
        renderItems();
        updateStyles();
    });
    
    removeItemBtn.addEventListener('click', () => {
        if (itemCount > 1) {
            itemCount--;
            renderItems();
            updateStyles();
        }
    });
    
    copyCssBtn.addEventListener('click', copyToClipboard);
    
    // Cheatsheet copy buttons
    document.querySelectorAll('.copy-small').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(text).then(() => {
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = originalText, 1500);
            });
        });
    });
}

function renderItems() {
    gridContainer.innerHTML = '';
    for (let i = 1; i <= itemCount; i++) {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.textContent = i;
        gridContainer.appendChild(item);
    }
}

function updateStyles() {
    const containerCSS = containerTextarea.value;
    const itemCSS = itemTextarea.value;
    
    // Construct style block
    // We wrap itemCSS to allow both raw properties and specific selectors
    const finalCSS = `
        .grid-container {
            ${containerCSS}
        }
        
        .grid-item {
            ${itemCSS.includes('{') ? '' : itemCSS}
        }
        
        ${itemCSS.includes('{') ? itemCSS : ''}
    `;
    
    try {
        // Validate by attempting to parse
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(finalCSS);
        
        liveStyles.textContent = finalCSS;
        errorDisplay.classList.add('hidden');
    } catch (e) {
        errorDisplay.classList.remove('hidden');
        errorDisplay.textContent = `CSS Error: ${e.message}`;
    }
}

function applyTemplate(key) {
    const template = templates[key];
    if (template) {
        containerTextarea.value = template.container;
        itemTextarea.value = template.items;
        itemCount = template.count;
        renderItems();
        updateStyles();
    }
}

function copyToClipboard() {
    const css = `/* Grid Container */\n.grid-container {\n${containerTextarea.value}\n}\n\n/* Grid Items */\n.grid-item {\n${itemTextarea.value}\n}`;
    navigator.clipboard.writeText(css).then(() => {
        const originalText = copyCssBtn.textContent;
        copyCssBtn.textContent = 'Copied!';
        copyCssBtn.classList.add('btn-success');
        setTimeout(() => {
            copyCssBtn.textContent = originalText;
            copyCssBtn.classList.remove('btn-success');
        }, 2000);
    });
}

init();
