(function(global){
  'use strict';

  function fmtMoney(n){
    const sym = global.store?.data?.settings?.currencySymbol || 'MX$';
    const v = Number(n)||0;
    return sym + v.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0});
  }
  function fmtPct(n){
    const v = Number(n)||0;
    return v.toFixed(1) + '%';
  }

  function scopedRevenueSnapshot(){
    if(typeof global.KPI?.aggregateScopeFinancials !== 'function') return null;
    return global.KPI.aggregateScopeFinancials(global.state?.graph, global.store);
  }

  function updateProfitKPIs(){
    const k = scopedRevenueSnapshot();
    if(!k) return;

    const elRev = document.getElementById('kpiRevenue');
    const elProf = document.getElementById('kpiProfit');
    const elMar = document.getElementById('kpiMargin');
    const subRev = document.getElementById('kpiRevenueSummary');
    const subProf = document.getElementById('kpiProfitSummary');
    const subMar = document.getElementById('kpiMarginSummary');

    if(elRev) elRev.textContent = fmtMoney(k.revenue);
    if(elProf) elProf.textContent = fmtMoney(k.profit);
    if(elMar) elMar.textContent = fmtPct(k.marginPct);

    if(subRev){
      if(k.revenue>0 || k.paymentReceived>0 || k.revenuePlanned>0){
        subRev.textContent = `Forecast ${fmtMoney(k.revenuePlanned)} • Payment received ${fmtMoney(k.paymentReceived)} • Not received yet ${fmtMoney(k.pendingReceipt)}`;
      } else {
        subRev.textContent = k.hasEvents ? 'Add revenue to your events' : 'No events yet';
      }
    }
    if(subProf){
      if(k.revenuePlanned || k.costPlanned){
        subProf.textContent = `Forecast of profit ${fmtMoney(k.profitForecast)} • Costs forecast ${fmtMoney(k.costPlanned)}`;
      } else {
        subProf.textContent = k.cost>0 ? 'Revenue - cost' : 'Add costs to see profit';
      }
    }
    if(subMar) subMar.textContent = k.revenue>0 ? ('Margin on actual revenue') : 'Add revenue to compute margin';

    // attach details to existing KPI panel if available
    global.state = global.state || {};
    global.state.kpiDetails = global.state.kpiDetails || {};
    global.state.kpiDetails.revenue = {
      title: 'Revenue',
      intro: 'Revenue across the scoped events.',
      items: [
        { primary: fmtMoney(k.revenue), secondary: 'Recognized revenue' },
        { primary: fmtMoney(k.revenuePlanned), secondary: 'Forecast' },
        { primary: fmtMoney(k.paymentReceived), secondary: 'Payment received' },
        { primary: fmtMoney(k.pendingReceipt), secondary: 'Not received yet' }
      ]
    };
    global.state.kpiDetails.profit = {
      title: 'Profit',
      intro: 'Actual profit for the scoped events.',
      items: [
        { primary: fmtMoney(k.profit), secondary: 'Actual profit' },
        { primary: fmtMoney(k.profitForecast), secondary: 'Forecast of profit' },
        { primary: fmtMoney(k.costPlanned), secondary: 'Costs forecast' },
        { primary: fmtMoney(k.vendorPaid), secondary: 'Payments made to vendors' },
        { primary: fmtMoney(k.pendingVendor), secondary: 'Not yet made' }
      ]
    };
    global.state.kpiDetails.margin = {
      title: 'Margin %',
      intro: 'Profit as a percentage of revenue for the scoped events.',
      items: [
        { primary: fmtPct(k.marginPct), secondary: 'Margin' },
        { primary: fmtMoney(k.profit), secondary: 'Profit (recognized)' },
        { primary: fmtMoney(k.revenue), secondary: 'Revenue (recognized)' },
        { primary: fmtMoney(k.cost), secondary: 'Vendor costs (recognized)' }
      ]
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