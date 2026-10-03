// MedSphere Healthcare Marketplace Renderer

window.MedSphereMarketplace = {
  renderMarketplace(params = {}) {
    const products = window.MEDSPHERE_DATA.products;
    const store = window.MedSphereStore;
    const currentCat = params.cat || 'all';

    const filtered = products.filter(p => {
      if (currentCat === 'all') return true;
      return p.category.toLowerCase().includes(currentCat.toLowerCase());
    });

    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <span>Healthcare Marketplace</span>
          </div>
          <h1 class="page-title">Healthcare Marketplace & B2B Procurement</h1>
          <p class="section-subtitle">
            Source verified medical devices, diagnostic equipment, pharmaceuticals, and clinical technology directly from accredited manufacturers.
          </p>

          <div style="max-width:640px; margin-top:1.75rem;">
            <div class="search-bar-wrap">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input type="text" placeholder="Search equipment, pharmaceuticals, consumables..." onkeyup="if(event.key==='Enter') window.MedSphereToast.show('Search', 'Filtering catalog by '+this.value, 'info')">
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="padding-top:3rem; padding-bottom:5rem;">
        <!-- Category Filter Pills -->
        <div class="filter-bar">
          <button class="filter-pill ${currentCat==='all'?'active':''}" onclick="window.location.hash='#marketplace'">All Products</button>
          <button class="filter-pill ${currentCat==='equipment'?'active':''}" onclick="window.location.hash='#marketplace?cat=equipment'">Medical Equipment</button>
          <button class="filter-pill ${currentCat==='technology'?'active':''}" onclick="window.location.hash='#marketplace?cat=technology'">Medical Technology</button>
          <button class="filter-pill ${currentCat==='pharma'?'active':''}" onclick="window.location.hash='#marketplace?cat=pharma'">Pharmaceuticals & Lab</button>
          <button class="filter-pill ${currentCat==='consumables'?'active':''}" onclick="window.location.hash='#marketplace?cat=consumables'">Consumables & PPE</button>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
          <div class="results-count">Showing <strong>${filtered.length}</strong> certified medical products</div>
          <div class="results-sort-wrap">
            <span class="text-sm text-muted">Sort by:</span>
            <select>
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
            </select>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="marketplace-grid">
          ${filtered.map(p => {
            const isSaved = store.isProductSaved(p.id);
            return `
              <div class="product-card">
                <div class="product-img-box">
                  <img src="${p.image}" alt="${p.name}">
                  <span class="badge badge-green product-badge-overlay">${p.badge}</span>
                  <button class="product-save-btn ${isSaved ? 'active' : ''}" title="Save to bookmarks" onclick="window.MedSphereMarketplace.toggleSave('${p.id}')">
                    <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                  </button>
                </div>

                <div class="product-details">
                  <div class="text-xs text-muted" style="text-transform:uppercase; font-weight:700; color:var(--primary-700); margin-bottom:0.25rem;">${p.category}</div>
                  <h3 style="font-size:1.15rem; line-height:1.35; margin-bottom:0.4rem;">
                    <a href="#product?id=${p.id}">${p.name}</a>
                  </h3>
                  <div class="text-xs text-muted" style="margin-bottom:0.85rem;">Supplier: <strong>${p.company}</strong></div>
                  
                  <p class="text-sm text-muted" style="line-height:1.5; margin-bottom:1rem; flex-grow:1;">${p.description.substring(0, 95)}...</p>

                  <div class="product-price-row">
                    <div>
                      <div class="product-price">${p.price}</div>
                      <div class="text-xs text-muted">${p.unit}</div>
                    </div>
                    <a href="#product?id=${p.id}" class="btn btn-primary btn-sm">View Details</a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  toggleSave(prodId) {
    const isSaved = window.MedSphereStore.toggleSaveProduct(prodId);
    window.MedSphereToast.show(
      isSaved ? "Saved to Bookmarks" : "Removed from Bookmarks",
      isSaved ? "Product added to your saved procurement list." : "Product removed.",
      "success"
    );
    window.MedSphereRouter.refreshCurrentPage();
  },

  renderProductDetail(params = {}) {
    const p = window.MEDSPHERE_DATA.products.find(item => item.id === params.id) || window.MEDSPHERE_DATA.products[0];
    const isSaved = window.MedSphereStore.isProductSaved(p.id);

    return `
      <div class="page-hero-banner">
        <div class="container">
          <div class="breadcrumbs">
            <a href="#home">Home</a> <span>/</span> <a href="#marketplace">Marketplace</a> <span>/</span> <span>${p.name}</span>
          </div>
          <span class="badge badge-green" style="margin-top:0.5rem;">${p.badge}</span>
          <h1 class="page-title" style="margin-top:0.5rem; font-size:2.25rem;">${p.name}</h1>
          <p class="section-subtitle">Manufactured by ${p.company} · Category: ${p.category}</p>
        </div>
      </div>

      <div class="container" style="padding-top:3rem; padding-bottom:5rem;">
        <div class="profile-main-grid">
          <div class="profile-main-col">
            <!-- Product Gallery / Main Image -->
            <div class="card" style="padding:0; overflow:hidden; margin-bottom:2rem; max-height:480px;">
              <img src="${p.image}" alt="${p.name}" style="width:100%; height:450px; object-fit:cover;">
            </div>

            <div class="profile-card-section">
              <h3 class="profile-section-title">Clinical Overview & Specifications</h3>
              <p style="font-size:1.05rem; line-height:1.7; margin-bottom:1.5rem;">${p.description}</p>

              <h4 style="font-size:1.1rem; margin-bottom:0.75rem;">Technical Specifications</h4>
              <ul style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.5rem;">
                ${p.specs.map(spec => `
                  <li style="display:flex; align-items:center; gap:8px; font-size:0.9375rem; color:var(--slate-700);">
                    <i class="fa-solid fa-circle-check" style="color:var(--emerald-600); font-size:13px; margin-right:4px;"></i>
                    <span>${spec}</span>
                  </li>
                `).join('')}
              </ul>

              <h4 style="font-size:1.1rem; margin-bottom:0.75rem;">Regulatory Approvals & Compliance</h4>
              <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                <span class="badge badge-green">FDA 510(k) Cleared</span>
                <span class="badge badge-green">CE Mark Medical Device Class IIa</span>
                <span class="badge badge-green">ISO 13485 Quality System</span>
                <span class="badge badge-green">HIPAA & GDPR Cloud Compliant</span>
              </div>
            </div>
          </div>

          <!-- Right Purchasing Sidebar -->
          <aside class="profile-sidebar-col">
            <div class="profile-card-section">
              <div class="text-xs text-muted" style="text-transform:uppercase; font-weight:700;">List Price</div>
              <div style="font-family:var(--font-heading); font-size:2.25rem; font-weight:800; color:var(--primary-900); margin:0.25rem 0;">
                ${p.price}
              </div>
              <div class="text-xs text-muted" style="margin-bottom:1.25rem;">${p.unit} · Institutional discounts apply</div>

              <div style="padding:0.75rem; background:var(--primary-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:1.5rem; font-size:0.8125rem;">
                <div><i class="fa-solid fa-box-open" style="color:var(--primary-700); margin-right:4px;"></i> <strong>Stock:</strong> ${p.stock}</div>
                <div style="margin-top:4px;"><i class="fa-solid fa-clock" style="color:var(--primary-700); margin-right:4px;"></i> <strong>Lead Time:</strong> ${p.leadTime}</div>
              </div>

              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                <button class="btn btn-primary w-100" onclick="window.MedSphereModals.open('modal-request-quote', { name: '${p.name}', company: '${p.company}', price: '${p.price}' })">
                  Request Institutional Quote
                </button>
                <button class="btn ${isSaved ? 'btn-secondary' : 'btn-outline'} w-100" onclick="window.MedSphereMarketplace.toggleSave('${p.id}')">
                  ${isSaved ? '<i class="fa-solid fa-check"></i> Saved in Procurement List' : '<i class="fa-regular fa-bookmark"></i> Save Product'}
                </button>
              </div>
            </div>

            <div class="profile-card-section">
              <h4 style="font-size:1.1rem; margin-bottom:0.5rem;">Verified Manufacturer</h4>
              <div style="font-size:0.95rem; font-weight:700; color:var(--primary-900);">${p.company}</div>
              <div class="text-xs text-muted" style="margin-top:2px;">MedSphere Verified Enterprise Partner</div>
              <p class="text-xs text-muted" style="margin-top:0.75rem;">Provides 24/7 biomedical engineering technical support, warranty replacement, and on-site clinical staff in-service training.</p>
            </div>
          </aside>
        </div>
      </div>
    `;
  }
};
