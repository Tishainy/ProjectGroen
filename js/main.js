function initializePage() {
  // alle pakketen laden
  loadPackages();
  
  // Tarieven laden voor offerte calculator
  loadRates();
  
  // click listener voor bestellen knop
  const orderButton = document.getElementById('orderButton');
  if (orderButton) {
    orderButton.addEventListener('click', handleOrderSubmit);
  }
  
  // click listener voor bereken offerte knop
  const calculateButton = document.getElementById('btn-bereken');
  if (calculateButton) {
    calculateButton.addEventListener('click', handleCalculateQuote);
  }
}

// Verwerk de bestelling wanneer op bestellen wordt geklikt
function handleOrderSubmit() {
  // Haal alle velden op
  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const postal = document.getElementById('postal').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const packageId = document.getElementById('packageSelect').value;
  
  // Maak het bestel object
  const orderData = {
    name,
    address,
    postal,
    date,
    time,
    packageId: parseInt(packageId)
  };
  
  // Verwerk de bestelling
  createOrder(orderData);
}

/**
 * Handle quote calculation when calculate button is clicked
 */
function handleCalculateQuote() {
  // Get input values
  const length = document.getElementById('gras-lengte').value;
  const width = document.getElementById('gras-breedte').value;
  const service = document.getElementById('custom-item').value;
  
  // Validate inputs
  const priceDiv = document.getElementById('offerte-prijs');
  
  if (!length || !width || !service) {
    priceDiv.innerHTML = `
      <div class="error-message" style="color: #d9534f; padding: 15px; border-radius: 4px; background-color: #f2dede; border: 1px solid #ebccd1;">
        ⚠️ Alle velden zijn verplicht!
      </div>
    `;
    return;
  }
  
  // Calculate quote
  const quoteData = {
    length: parseFloat(length),
    width: parseFloat(width),
    service: service
  };
  
  const result = calculateQuote(quoteData);
  
  // Display result or error
  if (result.error) {
    priceDiv.innerHTML = `
      <div class="error-message" style="color: #d9534f; padding: 15px; border-radius: 4px; background-color: #f2dede; border: 1px solid #ebccd1;">
        ⚠️ ${result.error}
      </div>
    `;
  } else {
    // Build breakdown HTML
    let breakdownHTML = '<ul style="margin: 10px 0; list-style: none; padding: 0;">';
    result.breakdown.forEach(item => {
      breakdownHTML += `
        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between;">
          <span>${item.item}</span>
          <span>€${item.subtotal}</span>
        </li>
      `;
    });
    breakdownHTML += '</ul>';
    
    priceDiv.innerHTML = `
      <div class="quote-result" style="background: linear-gradient(135deg, #f5f3ed 0%, #fff 100%); padding: 20px; border-radius: 8px; border: 2px solid #6B9A7A; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="color: #4A7C59; margin-top: 0; margin-bottom: 15px; font-size: 18px;">📋 Offerte Overzicht</h3>
        <p style="color: #666; margin: 10px 0; font-size: 14px;">
          <strong>Oppervlak:</strong> ${result.area} m²
        </p>
        ${breakdownHTML}
        <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #6B9A7A;">
          <h2 style="color: #4A7C59; margin: 0; text-align: right; font-size: 24px;">
            Totaal: <span style="color: #D4A574;">€${result.total}</span>
          </h2>
        </div>
      </div>
    `;
  }
}

// Start als de pagina klaar is
document.addEventListener('DOMContentLoaded', initializePage);
