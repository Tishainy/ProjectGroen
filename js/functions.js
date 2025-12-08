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

/**
 * Load rates from data/rates.json
 * @returns {Promise<Object>} rates object with pricing data
 */
async function loadRates() {
  try {
    const response = await fetch('./data/rates.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rates = await response.json();
    
    // Store globally for use in other functions
    window.rates = rates;
    console.log('Tarieven geladen:', rates);
    
    return rates;
  } catch (error) {
    console.error('Fout bij laden tarieven:', error);
    return null;
  }
}

/**
 * Calculate quote based on dimensions and service
 * @param {Object} data - Contains length, width, and service selection
 * @param {number} data.length - Lengte in meters
 * @param {number} data.width - Breedte in meters
 * @param {string} data.service - Service key (gras_maaien, gras_maaien_kanten, etc.)
 * @returns {Object} Quote object with breakdown and total
 */
function calculateQuote(data) {
  // Validation
  if (!data || !data.length || !data.width || !data.service) {
    return { 
      error: 'Alle velden zijn verplicht en moeten positieve getallen zijn.',
      total: 0
    };
  }

  const length = parseFloat(data.length);
  const width = parseFloat(data.width);
  const serviceKey = data.service;

  // Validate numbers
  if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
    return { 
      error: 'Lengte en breedte moeten positieve getallen zijn.',
      total: 0
    };
  }

  // Get rates from global window object
  const rates = window.rates;
  if (!rates) {
    return { 
      error: 'Tarieven niet geladen. Probeer pagina opnieuw te laden.',
      total: 0
    };
  }

  // Get service config
  const serviceConfig = rates.services[serviceKey];
  if (!serviceConfig) {
    return { 
      error: 'Service niet gevonden.',
      total: 0
    };
  }

  // Calculate area
  const area = length * width;

  // Get base price
  const rateKey = serviceConfig.rate_key;
  const basePrice = rates[rateKey] || 0;
  let total = area * basePrice;

  // Build breakdown
  const breakdown = [];
  breakdown.push({
    item: `${serviceConfig.name} (${area.toFixed(2)} m²)`,
    quantity: area.toFixed(2),
    unit: 'm²',
    rate: basePrice,
    subtotal: total
  });

  // Add extras
  if (serviceConfig.extras && serviceConfig.extras.length > 0) {
    serviceConfig.extras.forEach(extra => {
      const extraPrice = rates.extra_options[extra] || 0;
      const extraTotal = area * extraPrice;
      total += extraTotal;
      
      breakdown.push({
        item: extra === 'bemesten' ? 'Bemesten' : 'Kanten steken',
        quantity: area.toFixed(2),
        unit: 'm²',
        rate: extraPrice,
        subtotal: extraTotal
      });
    });
  }

  return {
    error: null,
    area: area.toFixed(2),
    breakdown: breakdown,
    total: total.toFixed(2)
  };
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
