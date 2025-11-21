(function(global){
  'use strict';
  function sanitizeQty(q){
    const n = Number(q);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

  function getCatalog(catalog){
    if(catalog && (catalog.packages||catalog.addons||catalog.venues)) return catalog;
    if(typeof global.getVendorCatalog === 'function') return global.getVendorCatalog();
    return global.vendorCatalog || { packages:[], addons:[], venues:[] };
  }

  function findCatalogItem(type, refId, catalog){
    if(!refId) return null;
    const c = getCatalog(catalog);
    const list = type === 'package' ? (c.packages||[])
               : type === 'addon'   ? (c.addons||[])
               : type === 'venue'   ? (c.venues||[])
               : Array.isArray(c[type+'s']) ? c[type+'s'] : [];
    return list.find(i=>i.id===refId) || null;
  }

  function resolveServicePrice(service, catalog){
    if(!service) return 0;
    const direct = Number(service.price);
    if(Number.isFinite(direct)) return direct;

    const match = findCatalogItem(service.type, service.refId, catalog);
    const p = match ? Number(match.price) : NaN;
    return Number.isFinite(p) ? p : 0;
  }

  function getServiceFromEntry(entry){
    if(!entry) return null;
    if(entry.vendorService) return entry.vendorService;
    // assignment shape: {vendorId, vendorServiceId, qty}
    if(entry.vendorId && entry.vendorServiceId && global.store?.data?.vendors){
      const v = global.store.data.vendors.find(x=>x.id===entry.vendorId);
      const s = v?.services?.find(x=>x.id===entry.vendorServiceId);
      return s || null;
    }
    // already a service-like object
    if(entry.id && entry.type) return entry;
    return null;
  }

  function calculateServicePriceTotals(entries, fallbackQty, catalog){
    const fb = sanitizeQty(fallbackQty);
    const c = getCatalog(catalog);
    let total = 0;
    (Array.isArray(entries)?entries:[]).forEach(entry=>{
      const svc = getServiceFromEntry(entry);
      const qty = sanitizeQty(entry.qty ?? fb);
      total += resolveServicePrice(svc, c) * qty;
    });
    return total;
  }

  global.Pricing = { sanitizeQty, resolveServicePrice, calculateServicePriceTotals };
})(window);