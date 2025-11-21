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
    const graph = global.state?.graph;
    const contexts = graph?.contexts ? Array.from(graph.contexts.values()) : [];
    const scopeIds = graph?.scopeIds instanceof Set ? graph.scopeIds : new Set();
    const scoped = contexts.filter(ctx=>ctx?.event && (!scopeIds.size || scopeIds.has(ctx.event.id)));

    if(!scoped.length){
      return { revenue:0, revenuePlanned:0, cost:0, profit:0, marginPct:0, costPerGuest:0, hasEvents: !!contexts.length };
    }

    let revenueActual=0, revenuePlanned=0, costActual=0, attendees=0;
    let paymentReceived=0, vendorPaid=0, costPlanned=0;
    scoped.forEach(ctx=>{
      const ev = ctx.event || {};
      const totals = global.KPI.sumBudgetTotalsForEvent?.(ev.id, global.store) || { forecast:0, recognizedRevenue:0, recognizedCost:0 };
      revenueActual += Number(totals.recognizedRevenue || 0) || 0;
      revenuePlanned += Number(totals.forecast || 0) || 0;
      paymentReceived += Number(totals.paymentReceivedTotal || 0) || 0;
      attendees += Number(ev.attendeesActual || ev.attendeesPlanned || 0) || 0;
      costActual += Number(totals.recognizedCost || 0) || 0;
      vendorPaid += Number(totals.vendorPaidTotal || 0) || 0;
      costPlanned += Number(totals.actual || 0) || 0;
    });

    const pendingReceipt = Math.max(0, revenuePlanned - paymentReceived);
    const pendingVendor = Math.max(0, costPlanned - vendorPaid);
    const profit = revenueActual - costActual;
    const profitForecast = revenuePlanned - costPlanned;
    const profitPending = Math.max(0, profitForecast - profit);
    const marginPct = revenueActual>0 ? (profit/revenueActual)*100 : 0;
    const costPerGuest = attendees>0 ? costActual/attendees : 0;

    return {
      revenue: revenueActual,
      revenuePlanned,
      cost: costActual,
      costPlanned,
      vendorPaid,
      pendingVendor,
      profit,
      profitForecast,
      profitPending,
      marginPct,
      costPerGuest,
      hasEvents:true,
      paymentReceived,
      pendingReceipt
    };
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
      if(k.revenue>0 || k.paymentReceived>0){
        subRev.textContent = `Paid receipts ${fmtMoney(k.paymentReceived)} • Pending ${fmtMoney(k.pendingReceipt)}`;
      }else{
        subRev.textContent = k.hasEvents ? 'Add revenue to your events' : 'No events yet';
      }
    }
    if(subProf){
      if(k.revenuePlanned || k.costPlanned){
        subProf.textContent = `Forecast ${fmtMoney(k.profitForecast)} • Pending ${fmtMoney(k.profitPending)}`;
      }else{
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
        { primary: fmtMoney(k.revenue), secondary: 'Actual revenue' },
        { primary: fmtMoney(k.paymentReceived), secondary: 'Payment received (MXN)' },
        { primary: fmtMoney(k.pendingReceipt), secondary: 'Not received yet' },
        { primary: fmtMoney(k.revenuePlanned), secondary: 'Planned revenue' }
      ]
    };
    global.state.kpiDetails.profit = {
      title: 'Profit',
      intro: 'Actual profit for the scoped events.',
      items: [
        { primary: fmtMoney(k.profitForecast), secondary: 'Forecast' },
        { primary: fmtMoney(k.profit), secondary: 'Payments made' },
        { primary: fmtMoney(k.profitPending), secondary: 'Not yet made' },
        { primary: fmtMoney(k.costPlanned), secondary: 'Costs forecast' },
        { primary: fmtMoney(k.vendorPaid), secondary: 'Payments made to vendors' },
        { primary: fmtMoney(k.pendingVendor), secondary: 'Vendor payments not yet made' },
        { primary: fmtMoney(k.costPerGuest), secondary: 'Cost per attendee' }
      ]
    };
    global.state.kpiDetails.margin = {
      title: 'Margin %',
      intro: 'Profit as a percentage of revenue for the scoped events.',
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