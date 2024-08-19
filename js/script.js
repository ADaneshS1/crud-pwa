let db;
const request = indexedDB.open('pwa-crud', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('name', 'name', { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
    displayItems();
};

request.onerror = function(event) {
    console.error('Error opening IndexedDB:', event.target.errorCode);
};

document.getElementById('add-item').addEventListener('click', function() {
    const itemName = document.getElementById('item-name').value;
    if (itemName) {
        const transaction = db.transaction(['items'], 'readwrite');
        const objectStore = transaction.objectStore('items');
        const request = objectStore.add({ name: itemName });

        request.onsuccess = function() {
            displayItems();
            document.getElementById('item-name').value = '';
        };

        request.onerror = function(event) {
            console.error('Error adding item:', event.target.errorCode);
        };
    }
});

function displayItems() {
    const transaction = db.transaction(['items'], 'readonly');
    const objectStore = transaction.objectStore('items');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const items = event.target.result;
        const itemList = document.getElementById('item-list');
        itemList.innerHTML = '';

        items.forEach(function(item) {
            const li = document.createElement('li');
            li.textContent = item.name;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deleteItem(item.id);
            });

            li.appendChild(deleteButton);
            itemList.appendChild(li);
        });
    };
}

function deleteItem(id) {
    const transaction = db.transaction(['items'], 'readwrite');
    const objectStore = transaction.objectStore('items');
    const request = objectStore.delete(id);

    request.onsuccess = function() {
        displayItems();
    };

    request.onerror = function(event) {
        console.error('Error deleting item:', event.target.errorCode);
    };
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(error) {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}
