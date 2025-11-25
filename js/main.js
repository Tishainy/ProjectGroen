function initializePage() {
  // alle pakketen laden
  loadPackages();
  
  // click listener voor bestellen knop
  const orderButton = document.getElementById('orderButton');
  if (orderButton) {
    orderButton.addEventListener('click', handleOrderSubmit);
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

// Start als de pagina klaar is
document.addEventListener('DOMContentLoaded', initializePage);
