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
      packages.forEach(package => {
        const option = document.createElement('option');
        option.value = package.id;
        option.textContent = `${package.name} - €${package.price.toFixed(2)}`;
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
}
