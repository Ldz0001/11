(function(global){
  'use strict';

  // Idempotent store migrations for P1 fields.
  function migrateStore(store){
    if(!store || !store.data) return;
    const data = store.data;
    const v = Number(data.__version || 0);

    if(v < 2){
      // Add P1 Event fields
      data.events = (data.events||[]).map(e=>({
        revenuePlanned: 0,
        revenueActual: 0,
        attendeesPlanned: 0,
        attendeesActual: 0,
        ...e
      }));
      // Settings defaults
      data.settings = {
        companyName: data.settings?.companyName || "",
        companyLogoUrl: data.settings?.companyLogoUrl || "",
        companyAddress: data.settings?.companyAddress || "",
        termsFooter: data.settings?.termsFooter || "",
        currencySymbol: data.settings?.currencySymbol || "MX$",
        ...data.settings
      };
      // Comparison/scenario collections
      data.vendorComparisons = Array.isArray(data.vendorComparisons) ? data.vendorComparisons : [];
      data.scenarios = Array.isArray(data.scenarios) ? data.scenarios : [];

      data.__version = 2;
      store.save?.();
    }

    if(v < 3){
      // Force MXN as the default/only currency symbol for consistent reporting.
      data.settings = {
        ...data.settings,
        currencySymbol: "MX$"
      };

      data.__version = 3;
      store.save?.();
    }
  }

  global.Migrations = { migrateStore };
})(window);