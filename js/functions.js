// Laad alle pakketten uit packages.json en vul de dropdown
async function loadPackages() {
  try {
    const response = await fetch('./data/packages.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const packages = await response.json();
    
    // Vul de dropdown met alle pakketten
    const packageSelect = document.getElementById('packageSelect');
    if (packageSelect) {
      // store packages globally so other functions can access them
      window.packages = packages;
      packages.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.id;
        option.textContent = `${pkg.name} - €${pkg.price.toFixed(2)}`;
        packageSelect.appendChild(option);
      });
    }
    
    return packages;
  } catch (error) {
    console.error('Fout bij laden pakketten:', error);
    return [];
  }
}

// Registreer een bestelling (nu nog alleen naar console)
function createOrder(orderData) {
  console.log('Bestelling aangemaakt:', orderData);

  // find package details (if loaded)
  const pkg = (window.packages || []).find(p => p.id === orderData.packageId) || null;

  // render a simple summary on the page
  const summaryContainer = document.getElementById('orderSummary');
  if (summaryContainer) {
    // clear previous
    summaryContainer.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'order-card';

    const title = document.createElement('h3');
    title.innerText = 'Overzicht bestelling';
    card.appendChild(title);

    const list = document.createElement('ul');
    const addItem = (label, value) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${label}:</strong> ${value}`;
      list.appendChild(li);
    };

    addItem('Naam', orderData.name || '-');
    addItem('Adres', orderData.address || '-');
    addItem('Postcode / Plaats', orderData.postal || '-');
    addItem('Datum', orderData.date || '-');
    addItem('Tijd', orderData.time || '-');
    addItem('Pakket', pkg ? `${pkg.name} (${pkg.description})` : `ID ${orderData.packageId}`);
    addItem('Prijs', pkg ? `€${pkg.price.toFixed(2)}` : '-');

    card.appendChild(list);

    // simple confirmation button (doesn't send anywhere yet)
    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.innerText = 'Bevestig (dummy)';
    confirmBtn.addEventListener('click', () => {
      alert('Bestelling geregistreerd (nog geen serveropslag).');
    });
    card.appendChild(confirmBtn);

    summaryContainer.appendChild(card);
  }
}
