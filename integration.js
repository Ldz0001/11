(function(global){
  'use strict';

  function fmtMoney(n){
    const sym = global.store?.data?.settings?.currencySymbol || '€';
    const v = Number(n)||0;
    return sym + v.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0});
  }
  function fmtPct(n){
    const v = Number(n)||0;
    return v.toFixed(1) + '%';
  }

  function getCurrentEvent(){
    const events = global.store?.data?.events || [];
    const id = global.state?.currentEventId;
    return id ? events.find(e=>e.id===id) : (global.state?.graph?.scoped?.events?.list||events)[0] || null;
  }

  function updateProfitKPIs(){
    const ev = getCurrentEvent();
    if(!ev) return;

    const totals = global.KPI.sumBudgetTotalsForEvent(ev.id, global.store);
    const k = global.KPI.computeRevenueKPIs(ev, totals);

    const elRev = document.getElementById('kpiRevenue');
    const elProf = document.getElementById('kpiProfit');
    const elMar = document.getElementById('kpiMargin');
    const subRev = document.getElementById('kpiRevenueSummary');
    const subProf = document.getElementById('kpiProfitSummary');
    const subMar = document.getElementById('kpiMarginSummary');

    if(elRev) elRev.textContent = fmtMoney(k.revenue);
    if(elProf) elProf.textContent = fmtMoney(k.profit);
    if(elMar) elMar.textContent = fmtPct(k.marginPct);

    if(subRev) subRev.textContent = 'Actual revenue';
    if(subProf) subProf.textContent = 'Revenue - cost';
    if(subMar) subMar.textContent = k.revenue>0 ? ('Margin on actual revenue') : 'No revenue yet';

    // attach details to existing KPI panel if available
    global.state = global.state || {};
    global.state.kpiDetails = global.state.kpiDetails || {};
    global.state.kpiDetails.revenue = {
      title: 'Revenue',
      intro: 'Actual revenue for the selected event.',
      items: [{ primary: fmtMoney(k.revenue), secondary: 'Actual revenue' }]
    };
    global.state.kpiDetails.profit = {
      title: 'Profit',
      intro: 'Actual profit for the selected event.',
      items: [
        { primary: fmtMoney(k.revenue), secondary: 'Revenue' },
        { primary: fmtMoney(k.cost), secondary: 'Cost' },
        { primary: fmtMoney(k.profit), secondary: 'Profit' }
      ]
    };
    global.state.kpiDetails.margin = {
      title: 'Margin %',
      intro: 'Profit as a percentage of revenue.',
      items: [{ primary: fmtPct(k.marginPct), secondary: 'Margin' }]
    };
  }

  function wrapRenderKPIs(){
    const orig = global.renderKPIs;
    if(typeof orig !== 'function') return;
    global.renderKPIs = function(){
      orig.apply(this, arguments);
      try { updateProfitKPIs(); } catch(e){ console.error('Profit KPI update failed', e); }
    };
  }

  function init(){
    try {
      global.Catalog?.ensureCatalog?.();
      global.Migrations?.migrateStore?.(global.store);
      wrapRenderKPIs();
      updateProfitKPIs();
    } catch(e){ console.error('P1 integration init failed', e); }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);