(function(global){
  'use strict';
  function ensureCatalog(){
    if(global.vendorCatalog && (global.vendorCatalog.packages||global.vendorCatalog.addons||global.vendorCatalog.venues)) return global.vendorCatalog;
    if(typeof global.getVendorCatalog === 'function'){
      global.vendorCatalog = global.getVendorCatalog();
      return global.vendorCatalog;
    }
    global.vendorCatalog = global.vendorCatalog || { packages:[], addons:[], venues:[] };
    return global.vendorCatalog;
  }
  ensureCatalog();
  global.Catalog = { ensureCatalog };
})(window);