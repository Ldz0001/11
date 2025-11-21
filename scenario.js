(function(global){
  'use strict';

  function deepClone(x){ return JSON.parse(JSON.stringify(x)); }

  function cloneBudgetForScenario(budgetLines){
    return deepClone(budgetLines||[]);
  }

  function applyScenarioFactors(snapshot, factors, catalog){
    const guestMultiplier = Math.max(0.1, Math.min(5, Number(factors?.guestMultiplier ?? 1) || 1));
    const swapMap = factors?.swapMap || {};

    const computedLines = (snapshot||[]).map(line=>{
      const cloned = deepClone(line);
      const lineQty = global.Pricing.sanitizeQty(cloned.qty ?? 1);

      // apply vendor swaps if any
      const swap = swapMap[cloned.id];
      if(swap){
        cloned.vendorId = swap.vendorId ?? cloned.vendorId;
        if(Array.isArray(swap.vendorServices)){
          cloned.vendorServices = swap.vendorServices;
        }
      }

      // scale quantities on vendorServices
      if(Array.isArray(cloned.vendorServices) && cloned.vendorServices.length){
        cloned.vendorServices = cloned.vendorServices.map(s=>{
          const q = global.Pricing.sanitizeQty(s.qty ?? lineQty);
          return { ...s, qty: q * guestMultiplier };
        });
        const totals = global.Pricing.calculateServicePriceTotals(cloned.vendorServices, lineQty);
        const forecast = totals?.total || 0;
        const actual = forecast;
        return { ...cloned, _scenarioForecast: forecast, _scenarioActual: actual };
      } else {
        const forecast = (Number(cloned.forecast)||0) * guestMultiplier;
        const actual = (Number(cloned.actual)||forecast) * guestMultiplier;
        return { ...cloned, _scenarioForecast: forecast, _scenarioActual: actual };
      }
    });

    const aggForecast = computedLines.reduce((s,l)=>s+(Number(l._scenarioForecast)||0),0);
    const aggActual = computedLines.reduce((s,l)=>s+(Number(l._scenarioActual)||0),0);

    return { lines: computedLines, forecast: aggForecast, actual: aggActual };
  }

  function diffScenario(scenarioTotals, liveTotals){
    const deltaForecast = (scenarioTotals?.forecast||0) - (liveTotals?.forecast||0);
    const deltaActual = (scenarioTotals?.actual||0) - (liveTotals?.actual||0);
    return { deltaForecast, deltaActual };
  }

  global.Scenario = { cloneBudgetForScenario, applyScenarioFactors, diffScenario };
})(window);