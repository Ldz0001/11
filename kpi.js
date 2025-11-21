(function(global){
  'use strict';

  // Sum budget totals for an event, respecting multi-vendor lines introduced in P0.
  function sumBudgetTotalsForEvent(eventId, store){
    const budget = (store?.data?.budget || []).filter(l => l.eventId === eventId);
    let forecast = 0, actual = 0, recognizedRevenue = 0, recognizedCost = 0;
    const byVendor = new Map();
    const byVendorRecognized = new Map();

    for(const line of budget){
      const lineQty = Number(line.qty ?? 1) || 1;
      const isPaid = (line.paymentStatus || 'unpaid') === 'paid';
      const paymentReceived = line.paymentReceived === true;
      const vendorPaid = line.vendorPaid === true;

      if(Array.isArray(line.vendorServices) && line.vendorServices.length){
        const f = global.Pricing.calculateServicePriceTotals(line.vendorServices, lineQty);
        const a = (line.actualOverride === true)
          ? (Number(line.actual)||0)
          : global.Pricing.calculateServicePriceTotals(line.vendorServices, lineQty);
        forecast += f; actual += a;

        for(const svc of line.vendorServices){
          const vId = svc.vendorId || line.vendorId;
          if(!vId) continue;
          const svcQty = Number(svc.qty ?? lineQty) || lineQty;
          const svcTotal = global.Pricing.resolveServicePrice(svc, global.vendorCatalog) * svcQty;
          byVendor.set(vId, (byVendor.get(vId)||0) + svcTotal);
          if(isPaid && paymentReceived && vendorPaid){
            byVendorRecognized.set(vId, (byVendorRecognized.get(vId)||0) + svcTotal);
          }
        }
      } else {
        const f = Number(line.forecast ?? 0) || 0;
        const a = Number(line.actual ?? f) || 0;
        forecast += f; actual += a;
        const vId = line.vendorId;
        if(vId){
          byVendor.set(vId, (byVendor.get(vId)||0) + a);
          if(isPaid && paymentReceived && vendorPaid){
            byVendorRecognized.set(vId, (byVendorRecognized.get(vId)||0) + a);
          }
        }
      }

      if(isPaid && paymentReceived){
        recognizedRevenue += forecast;
        if(vendorPaid){
          recognizedCost += actual;
        }
      }
    }
    return { forecast, actual, byVendor, byVendorRecognized, recognizedRevenue, recognizedCost };
  }

  function computeRevenueKPIs(event, totals){
    const revenuePlanned = Number(totals?.forecast ?? event?.revenuePlanned ?? 0) || 0;
    const revenueActual  = Number(totals?.recognizedRevenue ?? 0) || 0;
    const attendeesPlanned = Number(event?.attendeesPlanned ?? 0) || 0;
    const attendeesActual  = Number(event?.attendeesActual ?? attendeesPlanned) || 0;

    const revenue = revenueActual;
    const cost = Number(totals?.recognizedCost ?? 0) || 0;
    const attendees = attendeesActual;

    const profit = revenue - cost;
    const marginPct = revenue > 0 ? (profit / revenue) * 100 : 0;
    const costPerAttendee = attendees > 0 ? cost / attendees : 0;

    return { revenue, cost, profit, marginPct, costPerAttendee, attendees };
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