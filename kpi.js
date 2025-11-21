(function(global){
  'use strict';

  // Sum budget totals for an event, respecting multi-vendor lines introduced in P0.
  function sumBudgetTotalsForEvent(eventId, store){
    const budget = (store?.data?.budget || []).filter(l => l.eventId === eventId);
    let forecast = 0, actual = 0, recognizedRevenue = 0, recognizedCost = 0;
    let paymentReceivedTotal = 0;
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
    }
    const pendingReceipt = Math.max(0, forecast - paymentReceivedTotal);
    return { forecast, actual, byVendor, byVendorRecognized, recognizedRevenue, recognizedCost, paymentReceivedTotal, pendingReceipt };
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

  global.KPI = { sumBudgetTotalsForEvent, computeRevenueKPIs, vendorShare };
})(window);