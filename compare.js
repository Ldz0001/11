(function(global){
  'use strict';

  function normalizeName(s){ return String(s||'').trim().toLowerCase(); }

  function findMatchingVendorService(vendor, basketItem){
    const services = vendor?.services || [];
    const type = basketItem.type;
    const refId = basketItem.refId;
    const name = normalizeName(basketItem.name);

    if(refId && type){
      return services.find(s => s.type === type && s.refId === refId);
    }
    if(name){
      return services.find(s => normalizeName(s.name) === name);
    }
    return null;
  }

  function priceBasketForVendor(vendor, basket, catalog){
    let total = 0;
    let incomplete = false;

    for(const item of (basket||[])){
      const qty = global.Pricing.sanitizeQty(item.qty ?? 1);
      const svc = findMatchingVendorService(vendor, item);

      if(!svc){
        incomplete = true;
        continue;
      }
      const price = global.Pricing.resolveServicePrice(svc, catalog);
      total += price * qty;
    }
    return { total, incomplete };
  }

  function rankVendorsForBasket(vendors, basket, catalog){
    const rows = (vendors||[]).map(v=>{
      const r = priceBasketForVendor(v, basket, catalog);
      return { vendorId: v.id, total: r.total, incomplete: r.incomplete };
    });

    const complete = rows.filter(r=>!r.incomplete).sort((a,b)=>a.total-b.total);
    const incomplete = rows.filter(r=>r.incomplete);

    const median = complete.length
      ? complete[Math.floor(complete.length/2)].total
      : 0;

    return {
      complete: complete.map(r=>({ ...r, deltaVsMedian: r.total - median })),
      incomplete,
      median
    };
  }

  global.Compare = { priceBasketForVendor, rankVendorsForBasket };
})(window);