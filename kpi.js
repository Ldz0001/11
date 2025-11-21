(function(global){
  'use strict';

  // Sum budget totals for an event, respecting multi-vendor lines introduced in P0.
  function sumBudgetTotalsForEvent(eventId, store){
    const budget = (store?.data?.budget || []).filter(l => l.eventId === eventId);
    let forecast = 0, actual = 0, recognizedRevenue = 0, recognizedCost = 0;
    let paymentReceivedTotal = 0, vendorPaidTotal = 0;
    const byVendor = new Map();
    const byVendorRecognized = new Map();

    for(const line of budget){
      const lineQty = Number(line.qty ?? 1) || 1;
      const paymentReceived = line.paymentReceived === true;
      const vendorPaid = line.vendorPaid === true;
      const recognized = paymentReceived && vendorPaid;

      let lineForecast = 0;
      let lineActual = 0;

      if(Array.isArray(line.vendorServices) && line.vendorServices.length){
        const totals = global.Pricing.calculateServicePriceTotals(line.vendorServices, lineQty) || { total:0, hasPricedService:false };
        const explicitForecast = Number(line.forecast);
        const explicitActual = Number(line.actual);

        lineForecast = Number.isFinite(explicitForecast) ? explicitForecast : totals.total;
        lineActual = Number.isFinite(explicitActual) ? explicitActual : totals.total;
        forecast += lineForecast; actual += lineActual;

        for(const svc of line.vendorServices){
          const vId = svc.vendorId || line.vendorId;
          if(!vId) continue;
          const svcQty = Number(svc.qty ?? lineQty) || lineQty;
          const svcTotal = global.Pricing.resolveServicePrice(svc, global.vendorCatalog) * svcQty;
          byVendor.set(vId, (byVendor.get(vId)||0) + svcTotal);
          if(recognized){
            byVendorRecognized.set(vId, (byVendorRecognized.get(vId)||0) + svcTotal);
          }
        }
      } else {
        lineForecast = Number(line.forecast ?? 0) || 0;
        lineActual = Number(line.actual ?? lineForecast) || 0;
        forecast += lineForecast; actual += lineActual;
        const vId = line.vendorId;
        if(vId){
          byVendor.set(vId, (byVendor.get(vId)||0) + lineActual);
          if(recognized){
            byVendorRecognized.set(vId, (byVendorRecognized.get(vId)||0) + lineActual);
          }
        }
      }

      if(paymentReceived){
        paymentReceivedTotal += lineForecast; // receipts are tracked once payment is received, regardless of vendor payment state
      }

      if(recognized){
        recognizedRevenue += lineForecast;
        recognizedCost += lineActual;
      }
      if(vendorPaid){
        vendorPaidTotal += lineActual;
      }
    }
    const pendingReceipt = Math.max(0, forecast - paymentReceivedTotal);
    const pendingVendorPayment = Math.max(0, actual - vendorPaidTotal);
    return {
      forecast,
      actual,
      byVendor,
      byVendorRecognized,
      recognizedRevenue,
      recognizedCost,
      paymentReceivedTotal,
      pendingReceipt,
      vendorPaidTotal,
      pendingVendorPayment
    };
  }

  function computeRevenueKPIs(event, totals){
    const revenuePlanned = Number(totals?.forecast ?? event?.revenuePlanned ?? 0) || 0;
    const revenueActual  = Number(totals?.recognizedRevenue ?? 0) || 0;
    const paymentReceived = Number(totals?.paymentReceivedTotal ?? 0) || 0;
    const pendingReceipt = Number(totals?.pendingReceipt ?? Math.max(0, revenuePlanned - paymentReceived)) || 0;
    const attendeesPlanned = Number(event?.attendeesPlanned ?? 0) || 0;
    const attendeesActual  = Number(event?.attendeesActual ?? attendeesPlanned) || 0;

    const revenue = revenueActual;
    const cost = Number(totals?.recognizedCost ?? 0) || 0;
    const attendees = attendeesActual;

    const profit = revenue - cost;
    const marginPct = revenue > 0 ? (profit / revenue) * 100 : 0;
    const costPerAttendee = attendees > 0 ? cost / attendees : 0;

    return { revenue, cost, profit, marginPct, costPerAttendee, attendees, paymentReceived, pendingReceipt };
  }

  function vendorShare(byVendorMap){
    const entries = [...(byVendorMap||new Map()).entries()]
      .map(([vendorId,total])=>({vendorId,total:Number(total)||0}))
      .filter(e=>e.total>0);
    const grand = entries.reduce((s,e)=>s+e.total,0) || 1;
    entries.sort((a,b)=>b.total-a.total);
    return entries.slice(0,5).map(e=>({
      vendorId: e.vendorId,
      total: e.total,
      sharePct: (e.total/grand)*100
    }));
  }

  function aggregateScopeFinancials(graph, store){
    const contexts = graph?.contexts ? Array.from(graph.contexts.values()) : [];
    const scopeIds = graph?.scopeIds instanceof Set ? graph.scopeIds : new Set();
    const scoped = contexts.filter(ctx=>ctx?.event && (!scopeIds.size || scopeIds.has(ctx.event.id)));

    if(!scoped.length){
      return {
        revenue:0,
        revenuePlanned:0,
        cost:0,
        costPlanned:0,
        vendorPaid:0,
        pendingVendor:0,
        profit:0,
        profitForecast:0,
        marginPct:0,
        costPerGuest:0,
        hasEvents: !!contexts.length,
        paymentReceived:0,
        pendingReceipt:0,
        vendorShare:new Map(),
      };
    }

    let revenueActual=0, revenuePlanned=0, costActual=0, attendees=0;
    let paymentReceived=0, vendorPaid=0, costPlanned=0;
    const vendorMap=new Map();

    scoped.forEach(ctx=>{
      const ev = ctx.event || {};
      const totals = sumBudgetTotalsForEvent(ev.id, store) || { forecast:0, recognizedRevenue:0, recognizedCost:0, byVendorRecognized:new Map() };
      revenueActual += Number(totals.recognizedRevenue || 0) || 0;
      revenuePlanned += Number(totals.forecast || 0) || 0;
      paymentReceived += Number(totals.paymentReceivedTotal || 0) || 0;
      attendees += Number(ev.attendeesActual || ev.attendeesPlanned || 0) || 0;
      costActual += Number(totals.recognizedCost || 0) || 0;
      vendorPaid += Number(totals.vendorPaidTotal || 0) || 0;
      costPlanned += Number(totals.actual || 0) || 0;
      (totals.byVendorRecognized||new Map()).forEach((val,vid)=>{
        vendorMap.set(vid,(vendorMap.get(vid)||0)+(Number(val)||0));
      });
    });

    const pendingReceipt = Math.max(0, revenuePlanned - paymentReceived);
    const pendingVendor = Math.max(0, costPlanned - vendorPaid);
    const profit = revenueActual - costActual;
    const profitForecast = revenuePlanned - costPlanned;
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
      marginPct,
      costPerGuest,
      hasEvents:true,
      paymentReceived,
      pendingReceipt,
      vendorShare: vendorMap,
    };
  }

  global.KPI = { sumBudgetTotalsForEvent, computeRevenueKPIs, vendorShare, aggregateScopeFinancials };
})(window); 