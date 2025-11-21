(() => {
  const BASIS = {
    FLAT: 'flat',
    PER_GUEST: 'perGuest',
  };

  const CHARGE_UNIT = {
    PER_PERSON: 'perPerson',
    PER_CHILD: 'perChild',
    PER_EVENT: 'perEvent',
    PER_HOUR: 'perHour',
    PER_UNIT: 'perUnit',
    PER_SQM: 'perSqm',
  };

  const WEEKEND_PERCENT_DISCOUNT = -0.05;
  const SPECIAL_PACKAGE_SIN_ALIMENTOS = 'P013';
  const SPECIAL_REFERENCE_PACKAGE_TAQUIZA = 'P001';
  const QUOTE_EXPORT_BACKGROUND_PATH = 'assets/quote-background.svg';
  const PDF_TABLE_OVERLAY_ALPHA = 0.1;
  const SVG_CANVAS_MAX_PIXELS = 2400000;
  const IS_SAFARI = typeof navigator !== 'undefined'
    && /safari/i.test(navigator.userAgent || '')
    && !/chrome|crios|android/i.test(navigator.userAgent || '');

  const DEFAULT_DATA = {
    venues: [
      {
        id: 'VE-AURORA',
        name: 'Aurora Ballroom',
        location: 'Downtown Arts District',
        capacity: 250,
        group: 'G1',
      },
      {
        id: 'VE-HARBOR',
        name: 'Harborview Terrace',
        location: 'Seaside Promenade',
        capacity: 180,
        group: 'G2',
      },
      {
        id: 'VE-GARDEN',
        name: 'Garden Pavilion',
        location: 'Botanical Park',
        capacity: 120,
        group: 'G3',
      },
      {
        id: 'VE-SKYLINE',
        name: 'Skyline Loft',
        location: 'Financial Quarter',
        capacity: 140,
        group: 'G4',
      },
    ],
    packages: [
      {
        id: 'PKG-AURORA-EVE',
        venueId: 'VE-AURORA',
        group: 'G1',
        name: 'Signature Evening',
        description: 'Five-course dinner, premium open bar, custom lighting design.',
        duration: '6-hour rental',
        defaultGuests: 150,
        pricing: [
          { minGuests: 80, maxGuests: 120, price: 16500, basis: BASIS.FLAT, label: 'Up to 120 guests' },
          { minGuests: 121, maxGuests: 180, price: 18500, basis: BASIS.FLAT, label: 'Up to 180 guests' },
          { minGuests: 181, maxGuests: 260, price: 21400, basis: BASIS.FLAT, label: 'Up to 260 guests' },
        ],
      },
      {
        id: 'PKG-AURORA-COCKTAIL',
        venueId: 'VE-AURORA',
        group: 'G1',
        name: 'Cocktail Soirée',
        description: 'Two-hour cocktail reception with chef stations and lounge seating.',
        defaultGuests: 120,
        pricing: [
          { minGuests: 60, maxGuests: 120, price: 14500, basis: BASIS.FLAT, label: 'Up to 120 guests' },
          { minGuests: 121, maxGuests: 200, price: 16800, basis: BASIS.FLAT, label: 'Up to 200 guests' },
        ],
      },
      {
        id: 'PKG-HARBOR-SUNSET',
        venueId: 'VE-HARBOR',
        group: 'G2',
        name: 'Sunset Celebration',
        description: 'Seasonal buffet, patio lounge furniture, and fire pit service.',
        defaultGuests: 100,
        pricing: [
          { minGuests: 60, maxGuests: 100, price: 15200, basis: BASIS.FLAT, label: 'Up to 100 guests' },
          { minGuests: 101, maxGuests: 160, price: 17450, basis: BASIS.FLAT, label: 'Up to 160 guests' },
        ],
      },
      {
        id: 'PKG-GARDEN-GALA',
        venueId: 'VE-GARDEN',
        group: 'G3',
        name: 'Garden Gala',
        description: 'Farm-to-table tasting menu, floral décor, and string quartet.',
        defaultGuests: 90,
        pricing: [
          { minGuests: 40, maxGuests: 90, price: 13200, basis: BASIS.FLAT, label: 'Up to 90 guests' },
          { minGuests: 91, maxGuests: 140, price: 15400, basis: BASIS.FLAT, label: 'Up to 140 guests' },
        ],
      },
      {
        id: 'PKG-SKYLINE-LIGHTS',
        venueId: 'VE-SKYLINE',
        group: 'G4',
        name: 'City Lights Experience',
        description: 'Rooftop ceremony, tapas stations, and skyline photo lounge.',
        defaultGuests: 110,
        pricing: [
          { minGuests: 60, maxGuests: 110, price: 16200, basis: BASIS.FLAT, label: 'Up to 110 guests' },
          { minGuests: 111, maxGuests: 180, price: 18450, basis: BASIS.FLAT, label: 'Up to 180 guests' },
        ],
      },
    ],
    addons: [
      {
        id: 'AD-LIVE-JAZZ',
        name: 'Live Jazz Trio',
        category: 'Entertainment',
        description: 'Three-hour performance with curated set breaks.',
        chargeType: BASIS.FLAT,
        defaultQty: 1,
        pricing: [{ price: 1200, basis: BASIS.FLAT }],
      },
      {
        id: 'AD-CUSTOM-LIGHTING',
        name: 'Custom Lighting Design',
        category: 'Production',
        description: 'Uplighting, gobo projection, and dance floor wash.',
        chargeType: BASIS.FLAT,
        defaultQty: 1,
        pricing: [{ price: 950, basis: BASIS.FLAT }],
      },
      {
        id: 'AD-PHOTO-BOOTH',
        name: 'Photo Booth Experience',
        category: 'Entertainment',
        description: 'Unlimited prints, on-site attendant, digital gallery delivery.',
        chargeType: BASIS.FLAT,
        defaultQty: 1,
        pricing: [{ price: 750, basis: BASIS.FLAT }],
      },
      {
        id: 'AD-LATE-SNACK',
        name: 'Late-Night Snack Bar',
        category: 'Culinary',
        description: 'Per-guest pricing with gourmet sliders and fries.',
        chargeType: BASIS.PER_GUEST,
        defaultQty: 0,
        pricing: [
          { minGuests: 0, maxGuests: 150, price: 9, basis: BASIS.PER_GUEST, label: 'Up to 150 guests' },
          { minGuests: 151, maxGuests: 260, price: 8.5, basis: BASIS.PER_GUEST, label: '151+ guests' },
        ],
      },
      {
        id: 'AD-LUX-TRANSPORT',
        name: 'Luxury Transportation',
        category: 'Logistics',
        description: 'Executive sedan transfers for VIP guests (up to 3 hours).',
        chargeType: BASIS.FLAT,
        defaultQty: 1,
        pricing: [{ price: 550, basis: BASIS.FLAT }],
      },
    ],
  };

  const state = {
    refs: null,
    currentQuote: null,
    backgroundName: '',
    savedQuoteRefs: {
      quoteKey: '',
      eventId: '',
      budgetLineIds: {},
      taskIds: {},
    },
  };

  const assetCache = {
    backgroundSvgPromise: null,
    backgroundSvgText: '',
    backgroundPngPromise: null,
    backgroundPngDataUrl: '',
  };

  const STORAGE_KEYS = {
    WORKBOOK_BASE64: 'quoteBuilder.workbookBase64',
    WORKBOOK_NAME: 'quoteBuilder.workbookName',
    EVENT_DATE: 'quoteBuilder.eventDate',
    QUOTE_KEY: 'quoteBuilder.quoteKey',
    EVENT_ID: 'quoteBuilder.eventId',
    BUDGET_LINE_IDS: 'quoteBuilder.budgetLineIds',
    TASK_IDS: 'quoteBuilder.taskIds',
    QUOTE_BACKGROUND_SVG: 'quoteBuilder.backgroundSvg',
    QUOTE_BACKGROUND_PNG: 'quoteBuilder.backgroundPng',
    QUOTE_BACKGROUND_NAME: 'quoteBuilder.backgroundName',
    LEGACY_BUDGET_LINE_ID: 'quoteBuilder.budgetLineId',
    CACHE_VERSION: 'quoteBuilder.cacheVersion',
  };

  const CURRENT_STORAGE_VERSION = '20240506-pdf-overlay-v2';

  const storage = {
    get(key) {
      try {
        return window.localStorage?.getItem(key) ?? '';
      } catch (error) {
        console.error(error);
        return '';
      }
    },
    set(key, value) {
      try {
        if (value === null || value === undefined || value === '') {
          window.localStorage?.removeItem(key);
        } else {
          window.localStorage?.setItem(key, value);
        }
      } catch (error) {
        console.error(error);
      }
    },
    remove(key) {
      try {
        window.localStorage?.removeItem(key);
      } catch (error) {
        console.error(error);
      }
    },
    getJson(key, fallback = {}) {
      const raw = this.get(key);
      if (!raw) {
        return fallback;
      }
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.error(error);
      }
      return fallback;
    },
    setJson(key, value) {
      if (!value || (typeof value === 'object' && !Array.isArray(value) && !Object.keys(value).length)) {
        this.remove(key);
        return;
      }
      try {
        this.set(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    },
  };

  function ensureStorageVersion() {
    const storedVersion = storage.get(STORAGE_KEYS.CACHE_VERSION);
    if (storedVersion === CURRENT_STORAGE_VERSION) {
      return;
    }

    storage.remove(STORAGE_KEYS.QUOTE_BACKGROUND_PNG);

    assetCache.backgroundPngDataUrl = '';
    assetCache.backgroundPngPromise = null;

    storage.set(STORAGE_KEYS.CACHE_VERSION, CURRENT_STORAGE_VERSION);
  }

  let workbookModel = null;
  let venueData = [];
  let packageData = [];
  let addonData = [];

  function deriveCatalogPrice(entry) {
    if (!entry) {
      return null;
    }
    const prices = Array.isArray(entry.pricing)
      ? entry.pricing.map((item) => Number(item.price)).filter((value) => Number.isFinite(value))
      : [];
    if (prices.length) {
      return Math.min(...prices);
    }
    if (Number.isFinite(Number(entry.price))) {
      return Number(entry.price);
    }
    return null;
  }

  function broadcastVendorCatalogUpdate() {
    const catalog = {
      packages: packageData.map((item) => ({
        id: item.id,
        name: item.name,
        price: deriveCatalogPrice(item),
      })),
      addons: addonData.map((item) => ({
        id: item.id,
        name: item.name,
        price: deriveCatalogPrice(item),
      })),
      venues: venueData.map((item) => ({
        id: item.id,
        name: item.name,
        price: deriveCatalogPrice(item),
      })),
    };
    if (typeof window !== 'undefined') {
      window.vendorCatalog = catalog;
      if (typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('vendorCatalogUpdated', { detail: catalog }));
      }
    }
  }

  const HEAT_CLASSNAMES = ['heat-best', 'heat-good', 'heat-mid', 'heat-warm', 'heat-hot'];
  const HEAT_PALETTES = {
    light: {
      'heat-best': {
        background: 'linear-gradient(135deg,rgba(16,185,129,.34),rgba(16,185,129,.12))',
        backgroundColor: 'rgba(16,185,129,.18)',
      },
      'heat-good': {
        background: 'linear-gradient(135deg,rgba(34,197,94,.32),rgba(34,197,94,.12))',
        backgroundColor: 'rgba(34,197,94,.16)',
      },
      'heat-mid': {
        background: 'linear-gradient(135deg,rgba(245,158,11,.32),rgba(245,158,11,.12))',
        backgroundColor: 'rgba(245,158,11,.18)',
      },
      'heat-warm': {
        background: 'linear-gradient(135deg,rgba(249,115,22,.36),rgba(249,115,22,.16))',
        backgroundColor: 'rgba(249,115,22,.2)',
      },
      'heat-hot': {
        background: 'linear-gradient(135deg,rgba(239,68,68,.4),rgba(239,68,68,.2))',
        backgroundColor: 'rgba(239,68,68,.22)',
      },
    },
    dark: {
      'heat-best': {
        background: 'linear-gradient(135deg,rgba(34,197,94,.5),rgba(34,197,94,.22))',
        backgroundColor: 'rgba(34,197,94,.3)',
      },
      'heat-good': {
        background: 'linear-gradient(135deg,rgba(59,130,246,.45),rgba(59,130,246,.2))',
        backgroundColor: 'rgba(59,130,246,.28)',
      },
      'heat-mid': {
        background: 'linear-gradient(135deg,rgba(234,179,8,.48),rgba(234,179,8,.24))',
        backgroundColor: 'rgba(234,179,8,.32)',
      },
      'heat-warm': {
        background: 'linear-gradient(135deg,rgba(249,115,22,.5),rgba(249,115,22,.26))',
        backgroundColor: 'rgba(249,115,22,.36)',
      },
      'heat-hot': {
        background: 'linear-gradient(135deg,rgba(248,113,113,.52),rgba(248,113,113,.28))',
        backgroundColor: 'rgba(248,113,113,.38)',
      },
    },
  };

  function getActiveTheme() {
    const attr = document.documentElement?.getAttribute('data-theme');
    return attr === 'dark' ? 'dark' : 'light';
  }

  function clearHeatAppearance(cell) {
    if (!cell) {
      return;
    }
    cell.style.background = '';
    cell.style.backgroundColor = '';
  }

  function applyHeatAppearance(cell, heatClass, paletteOverride) {
    if (!cell) {
      return;
    }
    const theme = getActiveTheme();
    const palette = paletteOverride || HEAT_PALETTES[theme] || HEAT_PALETTES.light;
    const styles = palette?.[heatClass];
    if (styles) {
      cell.style.background = styles.background;
      cell.style.backgroundColor = styles.backgroundColor;
    } else {
      clearHeatAppearance(cell);
    }
  }

  function restyleCompareHeatMap() {
    const table = document.getElementById('quoteCompareTable');
    if (!table) {
      return;
    }
    const palette = HEAT_PALETTES[getActiveTheme()] || HEAT_PALETTES.light;
    table.querySelectorAll('td.compare-cell').forEach((cell) => {
      const heatClass = HEAT_CLASSNAMES.find((cls) => cell.classList.contains(cls));
      if (heatClass) {
        applyHeatAppearance(cell, heatClass, palette);
      } else {
        clearHeatAppearance(cell);
      }
    });
  }

  window.restyleCompareHeatMap = restyleCompareHeatMap;

  document.addEventListener('DOMContentLoaded', () => {
    const refs = {
      excelInput: document.getElementById('excelInput'),
      loadDefault: document.getElementById('loadDefault'),
      venueSelect: document.getElementById('venueSelect'),
      guestInput: document.getElementById('guestCount'),
      childrenInput: document.getElementById('childrenCount'),
      eventDateInput: document.getElementById('eventDate'),
      packageSelect: document.getElementById('packageSelect'),
      addonSelect: document.getElementById('addonSelect'),
      quoteBackgroundInput: document.getElementById('quoteBackgroundInput'),
      quoteBackgroundReset: document.getElementById('quoteBackgroundReset'),
      quoteBackgroundStatus: document.getElementById('quoteBackgroundStatus'),
      tableBody: document.querySelector('#quoteTable tbody'),
      status: document.getElementById('quoteStatus'),
      totalValue: document.getElementById('quoteTotalValue'),
      guestValue: document.getElementById('quoteGuestValue'),
      childrenValue: document.getElementById('quoteChildrenValue'),
      packageValue: document.getElementById('quotePackageValue'),
      eventDateValue: document.getElementById('quoteEventDateValue'),
      exportPdf: document.getElementById('exportPdf'),
      exportDocx: document.getElementById('exportDocx'),
      exportXlsx: document.getElementById('exportXlsx'),
      compareSection: document.getElementById('quoteCompare'),
      compareSummary: document.getElementById('quoteCompareSummary'),
      compareTableHead: document.querySelector('#quoteCompareTable thead'),
      compareTableBody: document.querySelector('#quoteCompareTable tbody'),
      compareExport: document.getElementById('exportCompareMatrix'),
      saveBudget: document.getElementById('saveQuoteBudget'),
    };

    if (!refs.venueSelect || !refs.tableBody) {
      return;
    }

    state.refs = refs;

    ensureStorageVersion();

    const storedBackgroundSvg = storage.get(STORAGE_KEYS.QUOTE_BACKGROUND_SVG);
    if (storedBackgroundSvg) {
      assetCache.backgroundSvgText = storedBackgroundSvg;
    }
    const storedBackgroundPng = storage.get(STORAGE_KEYS.QUOTE_BACKGROUND_PNG);
    if (storedBackgroundPng) {
      assetCache.backgroundPngDataUrl = storedBackgroundPng;
    }

    state.backgroundName = storage.get(STORAGE_KEYS.QUOTE_BACKGROUND_NAME) || '';
    updateBackgroundStatus();

    state.savedQuoteRefs.quoteKey = storage.get(STORAGE_KEYS.QUOTE_KEY) || '';
    state.savedQuoteRefs.eventId = storage.get(STORAGE_KEYS.EVENT_ID) || '';
    state.savedQuoteRefs.budgetLineIds = storage.getJson(STORAGE_KEYS.BUDGET_LINE_IDS, {});
    if (!state.savedQuoteRefs.budgetLineIds || typeof state.savedQuoteRefs.budgetLineIds !== 'object') {
      state.savedQuoteRefs.budgetLineIds = {};
    }
    state.savedQuoteRefs.taskIds = storage.getJson(STORAGE_KEYS.TASK_IDS, {});
    if (!state.savedQuoteRefs.taskIds || typeof state.savedQuoteRefs.taskIds !== 'object') {
      state.savedQuoteRefs.taskIds = {};
    }
    const legacyBudgetId = storage.get(STORAGE_KEYS.LEGACY_BUDGET_LINE_ID);
    if (legacyBudgetId) {
      storage.remove(STORAGE_KEYS.LEGACY_BUDGET_LINE_ID);
    }

    refs.excelInput?.addEventListener('change', handleFile);
    refs.loadDefault?.addEventListener('click', () => {
      loadDefaultData();
      announceStatus('Sample data loaded. You can continue customising the quote.', 'success');
    });

    refs.quoteBackgroundInput?.addEventListener('change', handleBackgroundInput);
    refs.quoteBackgroundReset?.addEventListener('click', handleBackgroundReset);

    refs.eventDateInput?.addEventListener('change', handleEventDateChange);
    refs.eventDateInput?.addEventListener('input', handleEventDateInput);
    refs.venueSelect.addEventListener('change', () => {
      populatePackages(refs.packageSelect.value);
      updateQuote();
    });

    refs.packageSelect.addEventListener('change', () => {
      const pkg = packageData.find((item) => item.id === refs.packageSelect.value);
      if (pkg && (!refs.guestInput.value || refs.guestInput.value === '0') && pkg.defaultGuests) {
        refs.guestInput.value = pkg.defaultGuests;
      }
      updateQuote();
    });

    refs.addonSelect.addEventListener('change', (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        updateQuote();
      }
    });
    refs.guestInput.addEventListener('input', updateQuote);
    refs.childrenInput?.addEventListener('input', updateQuote);

    refs.exportPdf?.addEventListener('click', exportPdf);
    refs.exportDocx?.addEventListener('click', exportDocx);
    refs.exportXlsx?.addEventListener('click', exportXlsx);
    refs.compareExport?.addEventListener('click', exportCompareMatrix);
    refs.saveBudget?.addEventListener('click', saveQuoteToBudget);

    const restored = tryRestorePersistedWorkbook();
    if (restored) {
      const restoredName = storage.get(STORAGE_KEYS.WORKBOOK_NAME) || 'your saved workbook';
      announceStatus(`Restored ${restoredName}. Adjust selections to review pricing.`, 'success');
    } else {
      loadDefaultData();
      announceStatus('Sample data loaded. Choose a venue to get started.', 'success');
    }
  });

  function loadDefaultData() {
    clearPersistedWorkbook();
    state.savedQuoteRefs.quoteKey = '';
    state.savedQuoteRefs.eventId = '';
    state.savedQuoteRefs.budgetLineIds = {};
    state.savedQuoteRefs.taskIds = {};
    storage.remove(STORAGE_KEYS.QUOTE_KEY);
    storage.remove(STORAGE_KEYS.EVENT_ID);
    storage.remove(STORAGE_KEYS.BUDGET_LINE_IDS);
    storage.remove(STORAGE_KEYS.TASK_IDS);
    storage.remove(STORAGE_KEYS.LEGACY_BUDGET_LINE_ID);
    workbookModel = null;
    venueData = DEFAULT_DATA.venues.map(clone);
    packageData = DEFAULT_DATA.packages.map(clone);
    addonData = DEFAULT_DATA.addons.map(clone);
    broadcastVendorCatalogUpdate();
    applyInitialEventDate(null);
    refreshSelectors();
    updateQuote();
  }

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    announceStatus(`Loading ${file.name}…`);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = new Uint8Array(e.target.result);
        const workbook = XLSX.read(buffer, { type: 'array' });
        const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
        loadFromWorkbook(workbook, { persistBase64: base64, fileName: file.name });
        announceStatus(`Imported ${file.name}. Select a venue to review the pricing.`, 'success');
      } catch (error) {
        console.error(error);
        const message = error?.message
          ? error.message
          : 'We could not read that workbook. Ensure it includes Venues, Packages, Pricing, and AddOns data.';
        announceStatus(message, 'error');
      } finally {
        event.target.value = '';
      }
    };
    reader.onerror = () => {
      announceStatus('We could not read the selected file. Please try a different .xlsx file.', 'error');
      event.target.value = '';
    };
    reader.readAsArrayBuffer(file);
  }

  async function applyCustomQuoteBackground(svgText, fileName) {
    if (!svgText || typeof svgText !== 'string') {
      throw new Error('No SVG data provided.');
    }
    const trimmed = svgText.trim();
    if (!trimmed || !/<svg[\s>]/i.test(trimmed)) {
      throw new Error('The selected file is not a valid SVG document.');
    }

    let pngUrl = '';
    try {
      pngUrl = await svgTextToPngDataUrl(trimmed);
    } catch (error) {
      console.error('Custom background conversion failed', error);
      throw new Error('We could not process that SVG for exports. Please try a different file.');
    }
    if (!pngUrl) {
      throw new Error('We could not process that SVG for exports. Please try a different file.');
    }

    assetCache.backgroundSvgText = trimmed;
    assetCache.backgroundSvgPromise = null;
    assetCache.backgroundPngDataUrl = pngUrl;
    assetCache.backgroundPngPromise = null;

    storage.set(STORAGE_KEYS.QUOTE_BACKGROUND_SVG, trimmed);
    storage.set(STORAGE_KEYS.QUOTE_BACKGROUND_PNG, pngUrl);
    if (fileName) {
      storage.set(STORAGE_KEYS.QUOTE_BACKGROUND_NAME, fileName);
      state.backgroundName = fileName;
    } else {
      storage.remove(STORAGE_KEYS.QUOTE_BACKGROUND_NAME);
      state.backgroundName = '';
    }

    updateBackgroundStatus();
  }

  function clearCustomQuoteBackground() {
    storage.remove(STORAGE_KEYS.QUOTE_BACKGROUND_SVG);
    storage.remove(STORAGE_KEYS.QUOTE_BACKGROUND_PNG);
    storage.remove(STORAGE_KEYS.QUOTE_BACKGROUND_NAME);
    state.backgroundName = '';
    assetCache.backgroundSvgText = '';
    assetCache.backgroundSvgPromise = null;
    assetCache.backgroundPngDataUrl = '';
    assetCache.backgroundPngPromise = null;
    updateBackgroundStatus();
  }

  function updateBackgroundStatus() {
    const status = state.refs?.quoteBackgroundStatus;
    const reset = state.refs?.quoteBackgroundReset;
    if (!status) {
      return;
    }
    const customSvg = storage.get(STORAGE_KEYS.QUOTE_BACKGROUND_SVG);
    const storedName = storage.get(STORAGE_KEYS.QUOTE_BACKGROUND_NAME) || state.backgroundName || '';
    if (customSvg) {
      status.textContent = storedName
        ? `Using custom background (${storedName}).`
        : 'Using custom background.';
      status.classList.add('is-custom');
      if (reset) {
        reset.disabled = false;
      }
    } else {
      status.textContent = 'Using default background template.';
      status.classList.remove('is-custom');
      if (reset) {
        reset.disabled = true;
      }
    }
  }

  function handleBackgroundInput(event) {
    const input = event?.target;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    if (file.type && !/svg/i.test(file.type) && !/\.svg$/i.test(file.name || '')) {
      announceStatus('Please choose an SVG file for the quote background.', 'error');
      if (input) {
        input.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text = typeof reader.result === 'string' ? reader.result : '';
        await applyCustomQuoteBackground(text, file.name || '');
        announceStatus(`Custom quote background "${file.name}" applied.`, 'success');
      } catch (error) {
        console.error('Custom background upload failed', error);
        announceStatus(error?.message || 'Unable to use that SVG file. Please try another.', 'error');
      } finally {
        if (input) {
          input.value = '';
        }
      }
    };
    reader.onerror = () => {
      announceStatus('We could not read that SVG file. Please try again.', 'error');
      if (input) {
        input.value = '';
      }
    };
    reader.readAsText(file);
  }

  function handleBackgroundReset() {
    const hadCustom = Boolean(storage.get(STORAGE_KEYS.QUOTE_BACKGROUND_SVG));
    clearCustomQuoteBackground();
    if (hadCustom) {
      announceStatus('Quote exports will use the default background again.', 'success');
    } else {
      announceStatus('The default background is already in use.');
    }
  }

  function loadFromWorkbook(workbook, options = {}) {
    const parsed = parseDatabaseWorkbook(workbook);
    workbookModel = parsed;
    venueData = parsed.venues.map(clone);
    packageData = parsed.packages.map(clone);
    addonData = parsed.addons.map(clone);
    broadcastVendorCatalogUpdate();
    if (!options.restored) {
      state.savedQuoteRefs.quoteKey = '';
      state.savedQuoteRefs.eventId = '';
      state.savedQuoteRefs.budgetLineIds = {};
      state.savedQuoteRefs.taskIds = {};
      storage.remove(STORAGE_KEYS.QUOTE_KEY);
      storage.remove(STORAGE_KEYS.EVENT_ID);
      storage.remove(STORAGE_KEYS.BUDGET_LINE_IDS);
      storage.remove(STORAGE_KEYS.TASK_IDS);
    }
    applyInitialEventDate(parsed.eventDate || null);
    refreshSelectors();
    updateQuote();
    if (options.persistBase64) {
      persistWorkbook(options.persistBase64, options.fileName || '');
    }
  }

  function tryRestorePersistedWorkbook() {
    const base64 = storage.get(STORAGE_KEYS.WORKBOOK_BASE64);
    if (!base64) {
      applyInitialEventDate(null);
      return false;
    }
    try {
      const workbook = XLSX.read(base64, { type: 'base64' });
      loadFromWorkbook(workbook, { restored: true });
      return true;
    } catch (error) {
      console.error('Failed to restore workbook', error);
      clearPersistedWorkbook();
      applyInitialEventDate(null);
      return false;
    }
  }

  function persistWorkbook(base64, fileName) {
    if (!base64) {
      clearPersistedWorkbook();
      return;
    }
    storage.set(STORAGE_KEYS.WORKBOOK_BASE64, base64);
    storage.set(STORAGE_KEYS.WORKBOOK_NAME, fileName || '');
  }

  function clearPersistedWorkbook() {
    storage.remove(STORAGE_KEYS.WORKBOOK_BASE64);
    storage.remove(STORAGE_KEYS.WORKBOOK_NAME);
  }

  function handleEventDateChange() {
    const value = state.refs?.eventDateInput?.value || '';
    if (value) {
      storage.set(STORAGE_KEYS.EVENT_DATE, value);
    } else {
      storage.remove(STORAGE_KEYS.EVENT_DATE);
    }
    updateQuote();
  }

  function handleEventDateInput() {
    // Mirror manual typing without waiting for change event
    updateQuote();
  }

  function applyInitialEventDate(suggestedDate) {
    const input = state.refs?.eventDateInput;
    if (!input) {
      return;
    }
    const stored = storage.get(STORAGE_KEYS.EVENT_DATE);
    if (stored) {
      input.value = stored;
      return;
    }
    if (suggestedDate instanceof Date && !Number.isNaN(suggestedDate.valueOf())) {
      input.value = toInputDateString(suggestedDate);
    } else {
      input.value = '';
    }
  }

  function parseDatabaseWorkbook(workbook) {
    const venuesSheet = findSheet(workbook, ['Venues', 'VENUES', 'venues']);
    const packagesSheet = findSheet(workbook, ['Packages', 'PACKAGES', 'packages']);
    const pricingSheet = findSheet(workbook, ['Pricing', 'PRICING', 'pricing']);
    if (!venuesSheet || !packagesSheet || !pricingSheet) {
      throw new Error('The workbook must include Venues, Packages, and Pricing sheets.');
    }

    const tierLookupSheet = findSheet(workbook, ['TierLookup', 'Tier Lookup', 'Tiers']);
    const addonsSheet = findSheet(workbook, ['AddOns', 'ADDONS', 'Add Ons', 'Add-Ons']);
    const addonPricingSheet = findSheet(workbook, ['AddOnPricing', 'AddonPricing', 'Add On Pricing', 'ADDONPRICING']);
    const venueFlatDiscountsSheet = findSheet(workbook, ['VenueFlatDiscounts', 'Venue Flat Discounts', 'FlatDiscounts']);
    const quoteSheet = findSheet(workbook, ['Quote', 'QUOTE', 'Compare_Prices']);
    const quoteAddOnsSheet = findSheet(workbook, ['Quote_AddOns', 'Quote AddOns', 'Quote_Addons', 'QUOTE_ADDONS']);

    const venues = parseDatabaseVenues(venuesSheet);
    const packages = parseDatabasePackages(packagesSheet);
    ensureUniqueBy(venues, (item) => item.name?.toLowerCase(), 'venue name');
    ensureUniqueBy(packages, (item) => item.name?.toLowerCase(), 'package name');

    const tierLookup = parseTierLookup(tierLookupSheet);
    const { pricingByKey, packageVenueMap } = parseDatabasePricing(pricingSheet);
    if (!pricingByKey.size) {
      throw new Error('No pricing rows were detected. Ensure the Pricing sheet uses VenueID | PackageID | TierID keys.');
    }

    const addonsResult = parseDatabaseAddOns(addonsSheet, quoteAddOnsSheet);
    const addonOverrides = parseAddonOverrides(addonPricingSheet);
    const flatDiscounts = parseVenueFlatDiscounts(venueFlatDiscountsSheet);
    const eventDate = parseWorkbookEventDate(quoteSheet);

    const venuesById = new Map(venues.map((venue) => [normalizeId(venue.id), venue]));
    const venuesByName = new Map(venues.map((venue) => [venue.name.toLowerCase(), venue]));
    const packagesById = new Map(packages.map((pkg) => [normalizeId(pkg.id), pkg]));
    const packagesByName = new Map(packages.map((pkg) => [pkg.name.toLowerCase(), pkg]));

    const defaultGuests = tierLookup.defaultGuests || 100;
    packages.forEach((pkg) => {
      const venueSet = packageVenueMap.get(normalizeId(pkg.id)) || new Set();
      pkg.availableVenueIds = Array.from(venueSet);
      if (!pkg.defaultGuests && defaultGuests) {
        pkg.defaultGuests = defaultGuests;
      }
      pkg.sourceType = 'database';
    });

    addonsResult.addons.forEach((addon) => {
      addon.sourceType = 'database';
    });

    return {
      venues,
      packages,
      addons: addonsResult.addons,
      venuesById,
      venuesByName,
      packagesById,
      packagesByName,
      pricingByKey,
      tierLookup,
      addonOverrides,
      flatDiscounts,
      addonsById: addonsResult.addonsById,
      defaultGuests,
      eventDate,
    };
  }

  function parseDatabaseVenues(sheet) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    const venues = rows
      .map((row) => {
        const id = normalizeId(pickFirst(row, ['VenueID', 'Venue Id', 'ID', 'Code']));
        const nameRaw = pickFirst(row, ['Name', 'Venue', 'VenueName', 'Title']);
        if (!id || !nameRaw) {
          return null;
        }
        const name = String(nameRaw).trim();
        const location = pickFirst(row, ['Location', 'Address', 'City', 'Estado', 'Country']);
        const horario = pickFirst(row, ['Horario', 'Schedule']);
        const maxCapacity = toNumber(pickFirst(row, ['MaxCapacity', 'Max Guests', 'Capacity']));
        const group = pickFirst(row, ['Grupo', 'Group']);
        return {
          id,
          name,
          location: location ? String(location).trim() : '',
          horario: horario ? String(horario).trim() : '',
          capacity: Number.isFinite(maxCapacity) ? maxCapacity : null,
          group: group ? String(group).trim() : '',
          source: row,
        };
      })
      .filter(Boolean);

    if (!venues.length) {
      throw new Error('No venues found in the Venues sheet.');
    }

    return venues;
  }

  function parseDatabasePackages(sheet) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    const packages = rows
      .map((row) => {
        const id = normalizeId(pickFirst(row, ['PackageID', 'Package Id', 'ID', 'Code']));
        const nameRaw = pickFirst(row, ['Name', 'Package', 'PackageName', 'Title']);
        if (!id || !nameRaw) {
          return null;
        }
        const name = String(nameRaw).trim();
        const type = pickFirst(row, ['Type']);
        const description = pickFirst(row, ['Description', 'Summary', 'Notes']);
        const group = pickFirst(row, ['Grupo', 'Group']);
        return {
          id,
          name,
          type: type ? String(type).trim() : '',
          description: description ? String(description).trim() : '',
          group: group ? String(group).trim() : '',
          defaultGuests: null,
          availableVenueIds: [],
          source: row,
        };
      })
      .filter(Boolean);

    if (!packages.length) {
      throw new Error('No packages found in the Packages sheet.');
    }

    return packages;
  }

  function ensureUniqueBy(items, iteratee, label) {
    const seen = new Map();
    items.forEach((item) => {
      const key = iteratee(item);
      if (!key) return;
      if (seen.has(key)) {
        throw new Error(`Duplicate ${label} detected: "${item.name || item.id}".`);
      }
      seen.set(key, item);
    });
  }

  function parseTierLookup(sheet) {
    const entries = [];
    if (sheet) {
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
      rows.forEach((row) => {
        const guests = toNumber(pickFirst(row, ['Guests', 'GuestCount', 'Pax']));
        const tierIdRaw = pickFirst(row, ['TierID', 'Tier Id', 'Tier']);
        if (!Number.isFinite(guests) || !tierIdRaw) {
          return;
        }
        entries.push({
          guests: Math.round(guests),
          tierId: normaliseTierId(tierIdRaw),
        });
      });
    }

    entries.sort((a, b) => a.guests - b.guests);
    const map = new Map(entries.map((entry) => [entry.guests, entry.tierId]));
    const defaultGuests = entries.find((entry) => entry.guests > 0)?.guests || null;
    return { entries, map, defaultGuests };
  }

  function parseDatabasePricing(sheet) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    const pricingByKey = new Map();
    const packageVenueMap = new Map();

    rows.forEach((row) => {
      let venueId = normalizeId(pickFirst(row, ['VenueID', 'Venue Id', 'Venue']));
      let packageId = normalizeId(pickFirst(row, ['PackageID', 'Package Id', 'Package']));
      let tierId = normaliseTierId(pickFirst(row, ['TierID', 'Tier Id', 'Tier']));
      const compositeKey = pickFirst(row, ['Key', 'CompositeKey']);

      if ((!venueId || !packageId || !tierId) && compositeKey) {
        const parts = String(compositeKey).split('|');
        if (parts[0] && !venueId) venueId = normalizeId(parts[0]);
        if (parts[1] && !packageId) packageId = normalizeId(parts[1]);
        if (parts[2] && !tierId) tierId = normaliseTierId(parts[2]);
      }

      if (!venueId || !packageId || !tierId) {
        return;
      }

      const basePrice = toNumber(pickFirst(row, ['BasePrice', 'Price', 'Amount', 'Value']));
      if (!Number.isFinite(basePrice)) {
        return;
      }

      const key = buildPricingKey(venueId, packageId, tierId);
      if (!pricingByKey.has(key)) {
        pricingByKey.set(key, {
          venueId,
          packageId,
          tierId,
          basePrice,
          dayType: pickFirst(row, ['DayType', 'Day Type', 'Type']) || null,
        });
      } else {
        pricingByKey.get(key).basePrice = basePrice;
      }

      const packageKey = normalizeId(packageId);
      if (!packageVenueMap.has(packageKey)) {
        packageVenueMap.set(packageKey, new Set());
      }
      packageVenueMap.get(packageKey).add(normalizeId(venueId));
    });

    return { pricingByKey, packageVenueMap };
  }

  function parseDatabaseAddOns(addonsSheet, quoteAddOnsSheet) {
    const addons = [];
    const addonsById = new Map();

    if (addonsSheet) {
      const rows = XLSX.utils.sheet_to_json(addonsSheet, { defval: null });
      rows.forEach((row) => {
        const id = normalizeId(pickFirst(row, ['AddOnID', 'AddOn Id', 'AddonID', 'ID', 'Code']));
        const nameRaw = pickFirst(row, ['Name', 'AddOn', 'Addon', 'Title']);
        if (!id || !nameRaw) {
          return;
        }
        const name = String(nameRaw).trim();
        const chargeUnit = normaliseChargeUnit(pickFirst(row, ['ChargeUnit', 'Charge Unit', 'ChargeType', 'Charge Type']));
        const chargeType = chargeUnit === CHARGE_UNIT.PER_PERSON ? BASIS.PER_GUEST : BASIS.FLAT;
        const defaultPrice = toNumber(pickFirst(row, ['DefaultPrice', 'Price', 'BasePrice', 'Amount']));
        const resolvedDefaultPrice = Number.isFinite(defaultPrice) ? defaultPrice : 0;
        const category = pickFirst(row, ['Category', 'Grupo', 'Group']);
        const description = pickFirst(row, ['Description', 'Summary', 'Notes']);
        const defaults = {
          guests: sanitizeQuantity(toNumber(pickFirst(row, ['Guests', 'GuestCount']))),
          children: sanitizeQuantity(toNumber(pickFirst(row, ['Children', 'ChildCount', 'Kids']))),
          hours: sanitizeQuantity(toNumber(pickFirst(row, ['Hours', 'DefaultHours']))),
          quantity: sanitizeQuantity(toNumber(pickFirst(row, ['DefaultQty', 'Qty', 'Quantity']))),
          sqm: sanitizeQuantity(toNumber(pickFirst(row, ['Sqm', 'SquareMeters', 'm2']))),
        };
        const defaultQty = Number.isFinite(defaults.quantity) ? defaults.quantity : 0;
        const addon = {
          id,
          name,
          chargeUnit,
          chargeType,
          defaultPrice: resolvedDefaultPrice,
          basePrice: resolvedDefaultPrice,
          category: category ? String(category).trim() : '',
          description: description ? String(description).trim() : '',
          defaults,
          defaultQty,
          source: row,
        };
        addons.push(addon);
        addonsById.set(id, addon);
      });
    }

    if (quoteAddOnsSheet) {
      const quoteRows = XLSX.utils.sheet_to_json(quoteAddOnsSheet, { defval: null });
      quoteRows.forEach((row) => {
        const addOnId = normalizeId(pickFirst(row, ['AddOnID', 'AddOn Id', 'AddonID', 'AddOn']));
        if (!addOnId) return;
        const addon = addonsById.get(addOnId);
        if (!addon) return;
        const defaults = addon.defaults;
        const guests = sanitizeQuantity(toNumber(pickFirst(row, ['Guests', 'GuestCount'])));
        const children = sanitizeQuantity(toNumber(pickFirst(row, ['Children', 'ChildCount', 'Kids'])));
        const hours = sanitizeQuantity(toNumber(pickFirst(row, ['Hours', 'QtyHours'])));
        const quantity = sanitizeQuantity(toNumber(pickFirst(row, ['Qty', 'Quantity'])));
        const sqm = sanitizeQuantity(toNumber(pickFirst(row, ['Sqm', 'SquareMeters', 'm2'])));
        if (!Number.isFinite(defaults.guests) && Number.isFinite(guests)) defaults.guests = guests;
        if (!Number.isFinite(defaults.children) && Number.isFinite(children)) defaults.children = children;
        if (!Number.isFinite(defaults.hours) && Number.isFinite(hours)) defaults.hours = hours;
        if (!Number.isFinite(defaults.quantity) && Number.isFinite(quantity)) defaults.quantity = quantity;
        if (!Number.isFinite(defaults.sqm) && Number.isFinite(sqm)) defaults.sqm = sqm;
        if (Number.isFinite(defaults.quantity)) {
          addon.defaultQty = defaults.quantity;
        }
      });
    }

    return { addons, addonsById };
  }

  function parseAddonOverrides(sheet) {
    const overrides = new Map();
    if (!sheet) {
      return overrides;
    }
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    rows.forEach((row) => {
      const venueId = normalizeId(pickFirst(row, ['VenueID', 'Venue Id', 'Venue']));
      const addOnId = normalizeId(pickFirst(row, ['AddOnID', 'AddOn Id', 'AddonID', 'AddOn']));
      const price = toNumber(pickFirst(row, ['Price', 'Amount', 'OverridePrice', 'Value']));
      if (!venueId || !addOnId || !Number.isFinite(price)) {
        return;
      }
      overrides.set(buildAddonOverrideKey(venueId, addOnId), price);
    });
    return overrides;
  }

  function parseVenueFlatDiscounts(sheet) {
    const discounts = new Map();
    if (!sheet) {
      return discounts;
    }
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    rows.forEach((row) => {
      const venueId = normalizeId(pickFirst(row, ['VenueID', 'Venue Id', 'Venue']));
      const dow = toNumber(pickFirst(row, ['DOW', 'DayOfWeek', 'Day']));
      const value = toNumber(pickFirst(row, ['FlatDiscount', 'Discount', 'Amount']));
      if (!venueId || !Number.isFinite(dow) || !Number.isFinite(value)) {
        return;
      }
      const weekday = Math.round(dow);
      discounts.set(`${venueId}|${weekday}`, value);
    });
    return discounts;
  }

  function parseWorkbookEventDate(sheet) {
    if (!sheet) {
      return null;
    }
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    for (const row of rows) {
      const value = pickFirst(row, ['EventDate', 'Event Date', 'Date']);
      const date = parseExcelDate(value);
      if (date) {
        return date;
      }
    }
    return null;
  }

  function parseWorkbookVenues(sheet) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    return rows
      .map((row) => {
        const id = pickFirst(row, ['VenueID', 'Venue Id', 'Venue_Id', 'ID', 'Code']);
        const name = pickFirst(row, ['Venue', 'Name', 'VenueName', 'Title']);
        const location = pickFirst(row, ['Location', 'City', 'Market', 'Region']);
        const capacity = toNumber(pickFirst(row, ['Capacity', 'MaxCapacity', 'Max Guests', 'Guests', 'Cap']));
        const group = pickFirst(row, ['Group', 'Grouping', 'VenueGroup', 'Cluster']);
        const markupRaw = pickFirst(row, ['Markup', 'Margin', 'Markup %', 'MarkupPct']);
        const markup = typeof markupRaw === 'number' ? normalisePercentage(markupRaw) : normalisePercentage(toNumber(markupRaw));

        if (!id && !name) {
          return null;
        }

        return {
          id: String(id || name).trim(),
          name: String(name || id).trim(),
          location: location ? String(location).trim() : '',
          capacity: Number.isFinite(capacity) ? capacity : null,
          group: group ? String(group).trim() : '',
          markup,
          source: row,
        };
      })
      .filter(Boolean);
  }

  function parseWorkbookPackages(sheet, pricingMap, venues) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    const packages = rows
      .map((row, index) => {
        const id = pickFirst(row, ['PackageID', 'Package Id', 'Package', 'Code', 'ID']) || `PKG-${index + 1}`;
        const name = pickFirst(row, ['Name', 'PackageName', 'Package', 'Title']) || id;
        const description = pickFirst(row, ['Description', 'Details', 'Summary']);
        const duration = pickFirst(row, ['Duration', 'Hours', 'Timing']);
        const group = pickFirst(row, ['Group', 'Grouping', 'VenueGroup', 'Cluster']);
        const venueId = pickFirst(row, ['VenueID', 'Venue Id', 'Venue']);
        const defaultGuests = toNumber(
          pickFirst(row, [
            'Guests',
            'GuestCount',
            'IncludedGuests',
            'Included Guests',
            'Guest Default',
            'Default Guests',
            'MinGuests',
            'GuestsMin',
            'MaxGuests',
            'GuestsMax',
          ])
        );
        const chargeType = parseChargeType(pickFirst(row, ['ChargeType', 'Billing', 'Per', 'Basis']), row.PerGuest);
        const basePrice = toNumber(
          pickFirst(row, [
            'Price',
            'BasePrice',
            'Rate',
            'Amount',
            'UnitPrice',
            'Unit Price',
            'PerGuestPrice',
            'Per Guest Price',
            'PricePerGuest',
            'PerGuest',
          ])
        );

        const pkg = {
          id: String(id).trim(),
          name: String(name).trim(),
          description: description ? String(description).trim() : '',
          duration: duration ? String(duration).trim() : '',
          group: group ? String(group).trim() : '',
          venueId: venueId ? String(venueId).trim() : '',
          defaultGuests: Number.isFinite(defaultGuests) ? defaultGuests : null,
          chargeType,
          basePrice: Number.isFinite(basePrice) ? basePrice : null,
          pricing: [],
          source: row,
        };

        const venue = pkg.venueId
          ? venues.find((item) => normaliseKey(item.id) === normaliseKey(pkg.venueId) || normaliseKey(item.name) === normaliseKey(pkg.venueId))
          : null;
        if (!pkg.group && venue?.group) {
          pkg.group = venue.group;
        }

        const matchKeys = new Set(
          [
            pkg.id,
            pkg.name,
            pkg.group,
          pkg.venueId,
          pkg.source?.Slug,
          pkg.source?.PackageID,
          pkg.source?.['Package Id'],
          pkg.source?.Code,
          pkg.source?.SKU,
          pkg.source?.VenueID,
          pkg.source?.['Venue Id'],
          pkg.source?.Venue,
          pkg.source?.['Venue Name'],
          pkg.source?.VenueCode,
          pkg.source?.['Venue Code'],
          pkg.source?.['Display Name'],
          pkg.source?.['Package Name'],
          pkg.source?.['Package'],
          pkg.source?.['Quote Option'],
          pkg.source?.['QuoteOption'],
          pkg.venueId && pkg.id ? `${pkg.venueId}:${pkg.id}` : null,
          pkg.source?.VenueID && pkg.id ? `${pkg.source.VenueID}:${pkg.id}` : null,
          pkg.source?.['Venue Id'] && pkg.id ? `${pkg.source['Venue Id']}:${pkg.id}` : null,
          pkg.source?.Venue && pkg.source?.Package ? `${pkg.source.Venue}:${pkg.source.Package}` : null,
          pkg.group && pkg.source?.Package ? `${pkg.group}:${pkg.source.Package}` : null,
          pkg.group && pkg.name ? `${pkg.group}:${pkg.name}` : null,
        ]
            .filter(Boolean)
            .map((value) => normaliseKey(value))
        );

        const pricingEntry = findPricingForKeys(pricingMap, matchKeys);
        if (pricingEntry) {
          pkg.pricing = pricingEntry.tiers.map(clone);
          if (!pkg.defaultGuests && pricingEntry.defaultGuests) {
            pkg.defaultGuests = pricingEntry.defaultGuests;
          }
          if (!pkg.chargeType && pricingEntry.defaultBasis) {
            pkg.chargeType = pricingEntry.defaultBasis;
          }
          pricingEntry.assigned = true;
        }

        if (!pkg.pricing.length && Number.isFinite(pkg.basePrice)) {
          pkg.pricing = [
            {
              minGuests: 0,
              maxGuests: Infinity,
              price: pkg.basePrice,
              basis: pkg.chargeType || BASIS.FLAT,
            },
          ];
        }

        return pkg;
      })
      .filter((pkg) => pkg);

    pricingMap.forEach((entry, key) => {
      if (entry.primaryKey && key !== entry.primaryKey) {
        return;
      }
      if (entry.assigned) {
        return;
      }
      const alreadyMatched = packages.some((pkg) => pkg.pricing?.length && matchesKey(pkg, key));
      if (alreadyMatched) {
        return;
      }
      packages.push({
        id: entry.label || `PKG-${packages.length + 1}`,
        name: entry.label || `Package ${packages.length + 1}`,
        description: '',
        duration: '',
        group: '',
        venueId: '',
        defaultGuests: entry.defaultGuests || null,
        chargeType: entry.defaultBasis || BASIS.FLAT,
        basePrice: null,
        pricing: entry.tiers.map(clone),
        source: { generatedFromPricing: true },
      });
    });

    return packages;
  }

  function parseWorkbookAddons(sheet, pricingMap) {
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    return rows
      .map((row, index) => {
        const id = pickFirst(row, ['AddOnID', 'AddOn Id', 'AddonID', 'ID', 'Code', 'AddOn']) || `ADDON-${index + 1}`;
        const name = pickFirst(row, ['Name', 'AddOn', 'Addon', 'Title']) || id;
        const category = pickFirst(row, ['Category', 'Type', 'Group', 'Segment']);
        const description = pickFirst(row, ['Description', 'Details', 'Summary']);
        const chargeType = parseChargeType(pickFirst(row, ['ChargeType', 'Basis', 'Billing', 'Per']), row.PerGuest);
        const basePrice = toNumber(
          pickFirst(row, [
            'Price',
            'BasePrice',
            'Rate',
            'Amount',
            'UnitPrice',
            'Unit Price',
            'PerGuestPrice',
            'Per Guest Price',
            'PricePerGuest',
            'PerGuest',
          ])
        );
        const defaultQty = toNumber(pickFirst(row, ['Qty', 'Quantity', 'DefaultQty', 'Default Quantity', 'Qty Default']));

        const addon = {
          id: String(id).trim(),
          name: String(name).trim(),
          category: category ? String(category).trim() : '',
          description: description ? String(description).trim() : '',
          chargeType,
          basePrice: Number.isFinite(basePrice) ? basePrice : null,
          defaultQty: Number.isFinite(defaultQty) ? defaultQty : 0,
          pricing: [],
          source: row,
        };

        const matchKeys = new Set(
          [
            addon.id,
            addon.name,
            addon.category,
            addon.source?.Code,
            addon.source?.SKU,
            addon.source?.Slug,
            addon.source?.['AddOnID'],
            addon.source?.['AddOn Id'],
            addon.source?.['Quote Option'],
            addon.source?.QuoteOption,
          ]
            .filter(Boolean)
            .map((value) => normaliseKey(value))
        );

        const pricingEntry = findPricingForKeys(pricingMap, matchKeys);
        if (pricingEntry) {
          addon.pricing = pricingEntry.tiers.map(clone);
          if (!addon.chargeType && pricingEntry.defaultBasis) {
            addon.chargeType = pricingEntry.defaultBasis;
          }
        }

        if (!addon.pricing.length && Number.isFinite(addon.basePrice)) {
          addon.pricing = [
            {
              minGuests: 0,
              maxGuests: Infinity,
              price: addon.basePrice,
              basis: addon.chargeType || BASIS.FLAT,
              quantity: Number.isFinite(addon.defaultQty) && addon.defaultQty > 0 ? addon.defaultQty : undefined,
            },
          ];
        }

        return addon;
      })
      .filter(Boolean);
  }

  function parsePricingSheet(sheet, options = {}) {
    const { defaultBasis = BASIS.FLAT } = options;
    const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, blankrows: false });
    const matrixEntries = extractPricingFromMatrix(matrix, defaultBasis);
    if (matrixEntries.size) {
      return matrixEntries;
    }
    return extractPricingFromRows(XLSX.utils.sheet_to_json(sheet, { defval: null }), defaultBasis);
  }

  function extractPricingFromMatrix(matrix, defaultBasis) {
    const entries = new Map();
    if (!Array.isArray(matrix) || !matrix.length) {
      return entries;
    }

    let headerRowIndex = matrix.findIndex((row) =>
      Array.isArray(row) &&
      row.some((cell) => hasGuestValue(cell)) &&
      row.some((cell) => typeof cell === 'string' && cell.trim()));

    if (headerRowIndex === -1) {
      headerRowIndex = 0;
    }

    const headerRow = matrix[headerRowIndex] || [];
    const guestColumns = headerRow
      .map((cell, index) => ({
        index,
        guest: extractGuestValue(cell),
        raw: cell,
        basis: parseChargeType(cell, null) || defaultBasis,
      }))
      .filter((entry) => Number.isFinite(entry.guest));

    if (!guestColumns.length) {
      return entries;
    }

    const labelIndex = (() => {
      const explicit = headerRow.findIndex((cell) => typeof cell === 'string' && /package|option|name|addon|add-on/i.test(cell));
      if (explicit >= 0) {
        return explicit;
      }
      const candidate = headerRow.findIndex((_, index) => !guestColumns.some((entry) => entry.index === index));
      return candidate >= 0 ? candidate : 0;
    })();

    const sortedGuestColumns = guestColumns.sort((a, b) => a.guest - b.guest);

    for (let i = headerRowIndex + 1; i < matrix.length; i += 1) {
      const row = matrix[i];
      if (!Array.isArray(row)) continue;
      const rawLabel = row[labelIndex];
      if (!rawLabel) continue;
      const label = String(rawLabel).trim();
      if (!label) continue;

      const tiers = [];
      sortedGuestColumns.forEach((column, index) => {
        const value = row[column.index];
        const price = toNumber(value);
        if (!Number.isFinite(price)) {
          return;
        }
        const minGuests = index === 0 ? 0 : sortedGuestColumns[index - 1].guest + 1;
        const maxGuests = column.guest;
        tiers.push({
          minGuests,
          maxGuests,
          price,
          basis: column.basis || defaultBasis,
          label: typeof column.raw === 'string' ? column.raw : undefined,
        });
      });

      if (!tiers.length) {
        continue;
      }

      const key = normaliseKey(label);
      const entry = {
        label,
        tiers,
        defaultGuests: tiers[0]?.maxGuests || null,
        defaultBasis: tiers[0]?.basis || defaultBasis,
      };
      registerPricingEntry(entries, entry, [label]);
    }

    return entries;
  }

  function extractPricingFromRows(rows, defaultBasis) {
    const entries = new Map();
    if (!Array.isArray(rows) || !rows.length) {
      return entries;
    }

    rows.forEach((row) => {
      const label = pickFirst(row, ['Package', 'Option', 'Name', 'Addon', 'AddOn', 'Description', 'Label', 'Code']);
      if (!label) {
        return;
      }
      const minGuests = toNumber(pickFirst(row, ['MinGuests', 'GuestsMin', 'Min', 'From', 'Min Pax']));
      const maxGuests = toNumber(pickFirst(row, ['MaxGuests', 'GuestsMax', 'Max', 'To', 'Max Pax']));
      const guestExact = toNumber(pickFirst(row, ['Guests', 'GuestCount', 'Pax']));
      const price = toNumber(pickFirst(row, ['Price', 'Amount', 'Rate', 'Value', 'Cost']));
      if (!Number.isFinite(price)) {
        return;
      }
      const basis = parseChargeType(pickFirst(row, ['ChargeType', 'Basis', 'Billing', 'Per']), row.PerGuest) || defaultBasis;
      const quantity = toNumber(pickFirst(row, ['Qty', 'Quantity']));
      const tier = {
        minGuests: Number.isFinite(minGuests) ? minGuests : 0,
        maxGuests: Number.isFinite(maxGuests)
          ? maxGuests
          : Number.isFinite(guestExact)
          ? guestExact
          : Infinity,
        price,
        basis,
        label: pickFirst(row, ['Label', 'Description', 'Notes']) || undefined,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : undefined,
      };

      let aliasCandidates = [
        label,
        row.PackageID,
        row['Package Id'],
        row.ID,
        row.Code,
        row.SKU,
        row.Slug,
        row['Quote Option'],
        row.QuoteOption,
        row.Item,
        row['Item Name'],
        row.VenueID,
        row['Venue Id'],
        row.Venue,
        row['Venue Name'],
        row.VenueCode,
        row['Venue Code'],
        row.Group,
        row['Venue Group'],
        row.Cluster,
        row['Cluster Name'],
        row['Package Name'],
        row.Package,
        row.Option,
      ].filter(Boolean);

      const venuePackageCombo = (() => {
        const venueKey = pickFirst(row, ['VenueID', 'Venue Id', 'Venue', 'Venue Name', 'VenueCode', 'Venue Code']);
        const packageKey = pickFirst(row, ['PackageID', 'Package Id', 'Package', 'Code', 'Option']);
        if (venueKey && packageKey) {
          return `${venueKey}:${packageKey}`;
        }
        return null;
      })();
      if (venuePackageCombo) {
        aliasCandidates = [...aliasCandidates, venuePackageCombo];
      }

      const groupPackageCombo = (() => {
        const groupKey = pickFirst(row, ['Group', 'Venue Group', 'Cluster']);
        const packageKey = pickFirst(row, ['PackageID', 'Package Id', 'Package', 'Package Name', 'Option']);
        if (groupKey && packageKey) {
          return `${groupKey}:${packageKey}`;
        }
        return null;
      })();
      if (groupPackageCombo) {
        aliasCandidates = [...aliasCandidates, groupPackageCombo];
      }

      aliasCandidates = Array.from(new Set(aliasCandidates));

      const normalizedAliasKeys = aliasCandidates
        .map((value) => normaliseKey(value))
        .filter((value) => value);

      const existing = findPricingForKeys(entries, new Set(normalizedAliasKeys));
      aliasCandidates = [
        label,
        ...aliasCandidates.filter((value) => normaliseKey(value) !== normaliseKey(label)),
      ];
      const entry = existing || {
        label: String(label).trim(),
        tiers: [],
        defaultGuests: tier.maxGuests && tier.maxGuests !== Infinity ? tier.maxGuests : tier.minGuests,
        defaultBasis: basis,
      };
      if (existing) {
        if (!existing.defaultGuests && (Number.isFinite(tier.maxGuests) || Number.isFinite(tier.minGuests))) {
          existing.defaultGuests = Number.isFinite(tier.maxGuests) && tier.maxGuests !== Infinity
            ? tier.maxGuests
            : tier.minGuests;
        }
        if (!existing.defaultBasis && basis) {
          existing.defaultBasis = basis;
        }
      }
      entry.tiers.push(tier);
      registerPricingEntry(entries, entry, aliasCandidates);
    });

    entries.forEach((entry) => {
      entry.tiers.sort((a, b) => (a.minGuests || 0) - (b.minGuests || 0));
    });

    return entries;
  }

  function registerPricingEntry(map, entry, keys = []) {
    if (!entry) {
      return;
    }

    if (!entry.aliases) {
      entry.aliases = new Set();
    }

    const resolvedKeys = keys
      .map((key) => {
        if (key === null || key === undefined) {
          return '';
        }
        return typeof key === 'string' ? key : String(key);
      })
      .filter((value) => value && value.trim());

    if (!entry.primaryKey) {
      const fallbackKey = resolvedKeys[0] || entry.label || `pricing-${map.size + 1}`;
      entry.primaryKey = normaliseKey(fallbackKey);
    }

    const registerKey = (value) => {
      if (!value) return;
      const normalized = normaliseKey(value);
      if (!normalized) return;
      if (!entry.aliases.has(normalized)) {
        entry.aliases.add(normalized);
      }
      if (!map.has(normalized)) {
        map.set(normalized, entry);
      }
    };

    registerKey(entry.primaryKey);
    resolvedKeys.forEach(registerKey);
  }

  function refreshSelectors() {
    if (!state.refs) return;
    const { venueSelect, packageSelect, addonSelect } = state.refs;
    const previousVenue = venueSelect.value;
    const previousPackage = packageSelect.value;
    const previousAddons = new Set(
      Array.from(addonSelect?.querySelectorAll('input[type="checkbox"]:checked') || []).map((input) => input.value)
    );

    populateVenues(previousVenue);
    populatePackages(previousPackage);
    populateAddons(previousAddons);
  }

  function populateVenues(previousValue = '') {
    const { venueSelect } = state.refs;
    venueSelect.innerHTML = '';

    if (!venueData.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No venues available';
      option.disabled = true;
      option.selected = true;
      venueSelect.appendChild(option);
      return;
    }

    venueData.forEach((venue, index) => {
      const option = document.createElement('option');
      option.value = venue.id;
      const parts = [venue.name];
      if (venue.location) parts.push(`• ${venue.location}`);
      if (Number.isFinite(venue.capacity)) parts.push(`— up to ${venue.capacity.toLocaleString()} guests`);
      option.textContent = parts.join(' ');
      if (index === 0 && !previousValue) {
        option.selected = true;
      }
      venueSelect.appendChild(option);
    });

    if (previousValue && venueData.some((venue) => venue.id === previousValue)) {
      venueSelect.value = previousValue;
    }
  }

  function populatePackages(previousValue = '') {
    const { venueSelect, packageSelect, guestInput } = state.refs;
    const selectedVenueIdRaw = venueSelect.value;
    const selectedVenueId = normalizeId(selectedVenueIdRaw);
    const guestCount = getGuestCount();
    packageSelect.innerHTML = '';

    const matching = packageData.filter((pkg) => packageMatchesVenue(pkg, selectedVenueId));

    if (!matching.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = selectedVenueId ? 'No packages available for this venue' : 'No packages available';
      option.disabled = true;
      packageSelect.appendChild(option);
      return;
    }

    matching.forEach((pkg) => {
      const option = document.createElement('option');
      option.value = pkg.id;
      option.textContent = buildPackageOptionLabel(pkg, guestCount);
      packageSelect.appendChild(option);
    });

    if (previousValue && matching.some((pkg) => pkg.id === previousValue)) {
      packageSelect.value = previousValue;
    } else if (matching.length) {
      const [first] = matching;
      packageSelect.value = first.id;
      if ((!guestInput.value || guestInput.value === '0') && first.defaultGuests) {
        guestInput.value = first.defaultGuests;
      }
    }
  }

  function populateAddons(previousValues = new Set()) {
    const { addonSelect } = state.refs;
    const guestCount = getGuestCount();
    const childrenCount = getChildrenCount();
    const venueId = getSelectedVenueId();
    addonSelect.innerHTML = '';

    if (!addonData.length) {
      const empty = document.createElement('p');
      empty.className = 'addon-empty';
      empty.textContent = 'No add-ons available in this dataset';
      addonSelect.appendChild(empty);
      return;
    }

    const categories = [];
    const categoryMap = new Map();

    addonData.forEach((addon) => {
      const rawCategory = addon.category ? String(addon.category).trim() : '';
      const categoryKey = rawCategory || '__misc__';
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          key: categoryKey,
          label: rawCategory || 'Other add-ons',
          addons: [],
        });
        categories.push(categoryMap.get(categoryKey));
      }
      categoryMap.get(categoryKey).addons.push(addon);
    });

    categories.forEach((group, index) => {
      if (!group.addons.length) return;

      const category = document.createElement('details');
      category.className = 'addon-category';
      category.dataset.categoryKey = group.key;

      const summary = document.createElement('summary');
      summary.className = 'addon-category-summary';

      const title = document.createElement('span');
      title.className = 'addon-category-title';
      title.textContent = group.label;

      const count = document.createElement('span');
      count.className = 'addon-category-count';
      count.textContent = '';

      summary.append(title, count);

      const list = document.createElement('div');
      list.className = 'addon-category-panel';

      let hasSelection = false;
      group.addons.forEach((addon) => {
        const wrapper = document.createElement('label');
        wrapper.className = 'addon-checkbox';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = addon.id;
        if (previousValues.has(addon.id)) {
          input.checked = true;
          hasSelection = true;
        }

        const copy = document.createElement('span');
        copy.className = 'addon-checkbox-text';
        copy.textContent = buildAddonOptionLabel(addon, guestCount, venueId, {
          children: childrenCount,
        });

        wrapper.append(input, copy);
        list.appendChild(wrapper);
      });

      if (hasSelection || (!previousValues.size && index === 0)) {
        category.open = true;
      }

      category.append(summary, list);
      addonSelect.appendChild(category);
    });

    updateAddonCategorySummaries();
  }

  function updatePackageOptionLabels() {
    if (!state.refs) return;
    const { packageSelect } = state.refs;
    const venueId = getSelectedVenueId();
    const guestCount = getGuestCount();
    Array.from(packageSelect.options).forEach((option) => {
      const pkg = packageData.find((item) => item.id === option.value);
      if (!pkg) return;
      option.textContent = buildPackageOptionLabel(pkg, guestCount, venueId);
    });
  }

  function updateAddonOptionLabels() {
    if (!state.refs) return;
    const { addonSelect } = state.refs;
    const venueId = getSelectedVenueId();
    const guestCount = getGuestCount();
    const childrenCount = getChildrenCount();
    if (!addonSelect) return;
    addonSelect.querySelectorAll('.addon-checkbox').forEach((wrapper) => {
      const input = wrapper.querySelector('input[type="checkbox"]');
      const label = wrapper.querySelector('.addon-checkbox-text');
      if (!input || !label) return;
      const addon = addonData.find((item) => item.id === input.value);
      if (!addon) return;
      label.textContent = buildAddonOptionLabel(addon, guestCount, venueId, {
        children: childrenCount,
      });
    });
    updateAddonCategorySummaries();
  }

  function updateAddonCategorySummaries() {
    if (!state.refs) return;
    const { addonSelect } = state.refs;
    if (!addonSelect) return;

    addonSelect.querySelectorAll('.addon-category').forEach((category) => {
      const countEl = category.querySelector('.addon-category-count');
      const checkboxes = category.querySelectorAll('input[type="checkbox"]');
      if (!countEl || !checkboxes.length) {
        if (countEl) {
          countEl.textContent = '';
        }
        category.classList.remove('has-selection');
        return;
      }

      const selected = category.querySelectorAll('input[type="checkbox"]:checked').length;
      if (selected > 0) {
        countEl.textContent = selected === 1 ? '1 selected' : `${selected} selected`;
        category.classList.add('has-selection');
      } else {
        const total = checkboxes.length;
        countEl.textContent = `${total} option${total === 1 ? '' : 's'}`;
        category.classList.remove('has-selection');
      }
    });
  }

  function updateQuote() {
    if (!state.refs) return;
    const {
      guestInput,
      childrenInput,
      packageSelect,
      addonSelect,
      tableBody,
      totalValue,
      guestValue,
      childrenValue,
      packageValue,
      eventDateValue,
    } = state.refs;

    const guests = Math.max(0, parseInt(guestInput.value, 10) || 0);
    if (guests !== Number(guestInput.value || 0)) {
      guestInput.value = guests;
    }
    guestValue.textContent = guests.toLocaleString();

    const children = Math.max(0, parseInt(childrenInput?.value ?? '0', 10) || 0);
    if (childrenInput && children !== Number(childrenInput.value || 0)) {
      childrenInput.value = children;
    }
    if (childrenValue) {
      childrenValue.textContent = children.toLocaleString();
    }

    const packageId = packageSelect.value;
    const pkg = packageData.find((item) => item.id === packageId);
    packageValue.textContent = pkg ? pkg.name : '—';

    const venueId = getSelectedVenueId();
    const venue = getSelectedVenue();
    const eventDate = getWorkbookEventDate();
    if (eventDateValue) {
      eventDateValue.textContent = formatEventDateForSummary(eventDate);
    }
    const eventDateInputValue = state.refs?.eventDateInput?.value || '';
    const weekday = getIsoWeekday(eventDate);
    const weekdayLabel = describeWeekday(weekday);

    tableBody.innerHTML = '';

    const fragment = document.createDocumentFragment();
    let subtotal = 0;
    let rowCount = 0;
    const quoteLines = [];
    const addonSummaries = [];
    let packagePricingDetails = null;

    if (pkg) {
      const packagePricing = getPackagePrice(pkg, guests, venueId);
      packagePricingDetails = packagePricing;
      const details = buildPackageDetails(pkg, packagePricing);
      fragment.appendChild(
        buildRow(pkg.name, details, packagePricing.quantity, packagePricing.unitPrice, packagePricing.total)
      );
      subtotal += packagePricing.total;
      rowCount++;
      quoteLines.push({
        type: 'package',
        id: pkg.id,
        name: pkg.name,
        quantity: packagePricing.quantity,
        unitPrice: packagePricing.unitPrice,
        total: packagePricing.total,
        details,
      });
    }

    const selectedAddons = Array.from(
      addonSelect?.querySelectorAll('input[type="checkbox"]:checked') || []
    ).map((input) => input.value);
    selectedAddons.forEach((addonId) => {
      const addon = addonData.find((item) => item.id === addonId);
      if (!addon) return;
      const addonPricing = getAddonPrice(addon, guests, venueId, { children });
      const details = buildAddonDetails(addon, addonPricing);
      fragment.appendChild(
        buildRow(addon.name, details, addonPricing.quantity, addonPricing.unitPrice, addonPricing.total)
      );
      subtotal += addonPricing.total;
      rowCount++;
      quoteLines.push({
        type: 'addon',
        id: addon.id,
        name: addon.name,
        quantity: addonPricing.quantity,
        unitPrice: addonPricing.unitPrice,
        total: addonPricing.total,
        details,
      });
      addonSummaries.push({
        id: addon.id,
        name: addon.name,
        total: addonPricing.total,
      });
    });

    let percentAdjustment = 0;
    let percentLabel = '';
    let flatDiscount = 0;
    if (workbookModel && venueId) {
      const percent = getPercentDiscount(eventDate);
      percentAdjustment = subtotal * percent;
      if (percentAdjustment) {
        const magnitude = Math.abs(percent * 100).toFixed(0);
        percentLabel = percent < 0 ? `${magnitude}% weekend discount (${weekdayLabel})` : `${magnitude}% surcharge (${weekdayLabel})`;
        fragment.appendChild(
          buildRow(
            percent < 0 ? 'Percent discount' : 'Percent adjustment',
            percentLabel || `Event day: ${weekdayLabel}`,
            1,
            percentAdjustment,
            percentAdjustment
          )
        );
        rowCount++;
        quoteLines.push({
          type: 'percentAdjustment',
          name: percent < 0 ? 'Percent discount' : 'Percent adjustment',
          quantity: 1,
          unitPrice: percentAdjustment,
          total: percentAdjustment,
          details: percentLabel || `Event day: ${weekdayLabel}`,
        });
      }

      flatDiscount = getFlatDiscount(venueId, eventDate);
      if (flatDiscount) {
        fragment.appendChild(
          buildRow(
            flatDiscount < 0 ? 'Flat discount' : 'Flat adjustment',
            `Venue rule — ${weekdayLabel}`,
            1,
            flatDiscount,
            flatDiscount
          )
        );
        rowCount++;
        quoteLines.push({
          type: 'flatAdjustment',
          name: flatDiscount < 0 ? 'Flat discount' : 'Flat adjustment',
          quantity: 1,
          unitPrice: flatDiscount,
          total: flatDiscount,
          details: `Venue rule — ${weekdayLabel}`,
        });
      }
    }

    const grandTotal = subtotal + percentAdjustment + flatDiscount;

    if (!rowCount) {
      const emptyRow = document.createElement('tr');
      emptyRow.className = 'empty-row';
      const cell = document.createElement('td');
      cell.colSpan = 5;
      cell.textContent = 'Select a venue, package, or add-ons to populate the quote.';
      emptyRow.appendChild(cell);
      tableBody.appendChild(emptyRow);
    } else {
      tableBody.appendChild(fragment);
      const totalRow = document.createElement('tr');
      totalRow.className = 'total-row';
      const totalLabel = document.createElement('td');
      totalLabel.colSpan = 4;
      totalLabel.textContent = 'Total';
      const totalValueCell = document.createElement('td');
      totalValueCell.textContent = formatCurrency(grandTotal);
      totalRow.append(totalLabel, totalValueCell);
      tableBody.appendChild(totalRow);
    }

    totalValue.textContent = formatCurrency(grandTotal);

    if (rowCount > 0) {
      state.currentQuote = {
        venueId,
        venueName: venue?.name || '',
        packageId,
        packageName: pkg?.name || '',
        guests,
        children,
        eventDate,
        eventDateInput: eventDateInputValue,
        total: grandTotal,
        tierId: packagePricingDetails?.tierId || '',
        tierLabel: packagePricingDetails?.tierLabel || '',
        quoteLines,
        addons: addonSummaries,
        percentAdjustment,
        flatDiscount,
      };
    } else {
      state.currentQuote = null;
    }

    updatePackageOptionLabels();
    updateAddonOptionLabels();
    updateComparePricesTable(guests, eventDate, venueId, packageId, weekdayLabel);
  }

  function updateComparePricesTable(guestCount, eventDate, selectedVenueId, selectedPackageId, weekdayLabel) {
    const { compareTableBody, compareSummary, compareTableHead } = state.refs || {};
    if (!compareTableBody || !compareTableHead) {
      return;
    }

    const normalizedSelectedVenue = selectedVenueId ? normalizeId(selectedVenueId) : '';
    const normalizedSelectedPackage = selectedPackageId ? normalizeId(selectedPackageId) : '';

    const comparisons = buildPackageComparisons(guestCount, eventDate);

    const packageBuckets = new Map();
    comparisons.forEach((entry) => {
      const key = entry.packageKey;
      if (!key) {
        return;
      }
      const total = Number.isFinite(entry.total) ? entry.total : Number.POSITIVE_INFINITY;
      let bucket = packageBuckets.get(key);
      if (!bucket) {
        bucket = {
          key,
          name: entry.packageName || key,
          minTotal: total,
        };
        packageBuckets.set(key, bucket);
      } else if (total < bucket.minTotal) {
        bucket.minTotal = total;
      }
    });

    if (!packageBuckets.size && packageData.length) {
      packageData.forEach((pkg) => {
        const key = normalizeId(pkg.id || pkg.name);
        if (!key || packageBuckets.has(key)) {
          return;
        }
        packageBuckets.set(key, {
          key,
          name: pkg.name || pkg.id || key,
          minTotal: Number.POSITIVE_INFINITY,
        });
      });
    }

    let packages = Array.from(packageBuckets.values());

    const baseHeaders = [
      { label: 'Venue' },
      { label: 'Tier' },
      { label: 'Guests' },
    ];

    function sortPackages(priorityMap) {
      packages.sort((a, b) => {
        const priorityA = priorityMap.has(a.key) ? priorityMap.get(a.key) : Number.POSITIVE_INFINITY;
        const priorityB = priorityMap.has(b.key) ? priorityMap.get(b.key) : Number.POSITIVE_INFINITY;
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        const diff = (a.minTotal ?? Number.POSITIVE_INFINITY) - (b.minTotal ?? Number.POSITIVE_INFINITY);
        if (Math.abs(diff) > 0.01) {
          return diff;
        }
        return (a.name || '').localeCompare(b.name || '');
      });
    }

    function renderHeader() {
      compareTableHead.innerHTML = '';
      const headerRow = document.createElement('tr');
      baseHeaders.forEach((item) => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = item.label;
        headerRow.appendChild(th);
      });
      if (packages.length) {
        packages.forEach((pkg) => {
          const th = document.createElement('th');
          th.scope = 'col';
          th.className = 'package-heading';
          th.textContent = pkg.name || pkg.key;
          headerRow.appendChild(th);
        });
      } else {
        const placeholder = document.createElement('th');
        placeholder.scope = 'col';
        placeholder.className = 'package-heading';
        placeholder.textContent = 'Packages';
        headerRow.appendChild(placeholder);
      }
      compareTableHead.appendChild(headerRow);
    }

    compareTableBody.innerHTML = '';

    if (!comparisons.length) {
      sortPackages(new Map());
      renderHeader();
      const emptyRow = document.createElement('tr');
      emptyRow.className = 'empty-row';
      const cell = document.createElement('td');
      const packageColumnCount = packages.length || 1;
      cell.colSpan = baseHeaders.length + packageColumnCount;
      cell.className = 'empty';
      cell.textContent = guestCount > 0
        ? 'No comparable packages were found for the selected guest count.'
        : 'Enter a guest count to see pricing comparisons.';
      emptyRow.appendChild(cell);
      compareTableBody.appendChild(emptyRow);
      if (compareSummary) {
        const guestLabel = guestCount > 0
          ? `${guestCount.toLocaleString()} guest${guestCount === 1 ? '' : 's'}`
          : 'your current filters';
        compareSummary.textContent = `No comparable packages were found for ${guestLabel}.`;
      }
      return;
    }

    const venueBuckets = new Map();
    comparisons.forEach((entry) => {
      let bucket = venueBuckets.get(entry.venueKey);
      if (!bucket) {
        bucket = {
          key: entry.venueKey,
          name: entry.venueName || entry.venueKey,
          entries: new Map(),
          tierLabel: entry.tierLabel || '',
          tierId: entry.tierId || '',
          guests: entry.guestsUsed || Math.max(0, Math.round(guestCount || 0)),
          minTotal: Number.isFinite(entry.total) ? entry.total : Number.POSITIVE_INFINITY,
        };
        venueBuckets.set(entry.venueKey, bucket);
      }
      bucket.entries.set(entry.packageKey, entry);
      if (entry.tierLabel) {
        bucket.tierLabel = entry.tierLabel;
      }
      if (entry.tierId) {
        bucket.tierId = entry.tierId;
      }
      if (entry.guestsUsed) {
        bucket.guests = entry.guestsUsed;
      }
      if (Number.isFinite(entry.total) && entry.total < bucket.minTotal) {
        bucket.minTotal = entry.total;
      }
    });

    const venues = Array.from(venueBuckets.values());
    venues.sort((a, b) => {
      const diff = a.minTotal - b.minTotal;
      if (Math.abs(diff) > 0.01) {
        return diff;
      }
      return (a.name || '').localeCompare(b.name || '');
    });

    const packagePriority = new Map();
    venues.forEach((venue) => {
      const rankedEntries = Array.from(venue.entries.values())
        .filter((entry) => Number.isFinite(entry.total))
        .sort((a, b) => {
          const diff = a.total - b.total;
          if (Math.abs(diff) > 0.01) {
            return diff;
          }
          return (a.packageName || '').localeCompare(b.packageName || '');
        });
      rankedEntries.forEach((entry) => {
        if (!packagePriority.has(entry.packageKey)) {
          const priority = packagePriority.size;
          packagePriority.set(entry.packageKey, priority);
        }
      });
    });

    sortPackages(packagePriority);
    renderHeader();

    const totals = comparisons.map((entry) => entry.total);
    const minTotal = Math.min(...totals);
    const maxTotal = Math.max(...totals);
    const range = Math.max(0, maxTotal - minTotal);

    let activeCellSummary = '';
    const bestEntry = comparisons.reduce((best, entry) => (entry.total < best.total ? entry : best), comparisons[0]);

    venues.forEach((venue) => {
      const row = document.createElement('tr');

      const venueCell = document.createElement('th');
      venueCell.scope = 'row';
      venueCell.textContent = venue.name || '—';
      row.appendChild(venueCell);

      const tierCell = document.createElement('td');
      tierCell.textContent = venue.tierLabel || (venue.tierId ? `Tier ${venue.tierId}` : '—');
      row.appendChild(tierCell);

      const guestsCell = document.createElement('td');
      guestsCell.textContent = venue.guests ? venue.guests.toLocaleString() : '—';
      row.appendChild(guestsCell);

      let rowHasActive = false;

      packages.forEach((pkg) => {
        const cell = document.createElement('td');
        cell.className = 'compare-cell';
        clearHeatAppearance(cell);
        const match = venue.entries.get(pkg.key);
        if (match) {
          const price = document.createElement('span');
          price.className = 'price';
          price.textContent = formatCurrency(match.total);
          cell.appendChild(price);

          const metaParts = [];
          const percentMagnitude = Math.abs(match.percentAdjustment);
          const flatMagnitude = Math.abs(match.flatAdjustment);
          const differsFromBase = Math.abs(match.basePrice - match.total) > 0.01;
          if (differsFromBase || percentMagnitude > 0.01 || flatMagnitude > 0.01) {
            metaParts.push(`Base ${formatCurrency(match.basePrice)}`);
          }
          if (percentMagnitude > 0.01) {
            const percentLabel = match.percentAdjustment < 0 ? 'Weekend' : 'Percent';
            metaParts.push(`${percentLabel} ${formatCurrency(match.percentAdjustment)}`);
          }
          if (flatMagnitude > 0.01) {
            const flatLabel = match.flatAdjustment < 0 ? 'Flat discount' : 'Flat adjustment';
            metaParts.push(`${flatLabel} ${formatCurrency(match.flatAdjustment)}`);
          }
          if (metaParts.length) {
            const metaText = metaParts.join(' • ');
            const meta = document.createElement('span');
            meta.className = 'meta';
            meta.textContent = metaText;
            cell.appendChild(meta);
            cell.title = `${match.venueName} • ${match.packageName}\n${metaText}`;
          } else {
            cell.title = `${match.venueName} • ${match.packageName}`;
          }

          if (range > 0) {
            const relative = (match.total - minTotal) / range;
            const heatClass = getHeatClass(relative);
            cell.classList.add(heatClass);
            applyHeatAppearance(cell, heatClass);
          } else {
            cell.classList.add('heat-best');
            applyHeatAppearance(cell, 'heat-best');
          }

          if (Math.abs(match.total - minTotal) <= 0.01) {
            cell.classList.add('is-best');
          }

          if (match.venueKey === normalizedSelectedVenue && match.packageKey === normalizedSelectedPackage) {
            cell.classList.add('is-active');
            rowHasActive = true;
            activeCellSummary = `${match.venueName} + ${match.packageName} (${formatCurrency(match.total)})`;
          }
        } else {
          cell.classList.add('is-empty');
          cell.textContent = '—';
          clearHeatAppearance(cell);
        }
        row.appendChild(cell);
      });

      if (rowHasActive) {
        row.classList.add('has-active');
      }

      compareTableBody.appendChild(row);
    });

    if (compareSummary) {
      const primaryGuests = venues.find((item) => item.guests)?.guests || Math.max(0, Math.round(guestCount || 0));
      const guestLabel = primaryGuests
        ? `${primaryGuests.toLocaleString()} guest${primaryGuests === 1 ? '' : 's'}`
        : 'default tiers';
      const summaryParts = [
        `Showing ${venues.length} venue${venues.length === 1 ? '' : 's'} × ${packages.length} package${packages.length === 1 ? '' : 's'} for ${guestLabel}.`,
      ];
      if (Number.isFinite(bestEntry?.total)) {
        summaryParts.push(`Best value: ${bestEntry.venueName} + ${bestEntry.packageName} (${formatCurrency(bestEntry.total)}).`);
      }
      if (normalizedSelectedVenue && normalizedSelectedPackage && activeCellSummary) {
        summaryParts.push(`Your current selection (${activeCellSummary}) is outlined in purple.`);
      }
      const hasPercentAdjustments = comparisons.some((entry) => Math.abs(entry.percentAdjustment) > 0.01);
      const hasFlatAdjustments = comparisons.some((entry) => Math.abs(entry.flatAdjustment) > 0.01);
      if (weekdayLabel && hasPercentAdjustments) {
        summaryParts.push(`Weekend adjustments reflect ${weekdayLabel.toLowerCase()} events.`);
      }
      if (weekdayLabel && hasFlatAdjustments) {
        summaryParts.push('Venue flat rules are applied per day.');
      }
      compareSummary.textContent = summaryParts.join(' ');
    }

    function getHeatClass(relative) {
      if (!Number.isFinite(relative) || relative <= 0) {
        return 'heat-best';
      }
      if (relative <= 0.2) {
        return 'heat-good';
      }
      if (relative <= 0.45) {
        return 'heat-mid';
      }
      if (relative <= 0.7) {
        return 'heat-warm';
      }
      return 'heat-hot';
    }

    restyleCompareHeatMap();
  }

  function saveQuoteToBudget() {
    const quote = state.currentQuote;
    if (!quote || !quote.packageId || !quote.venueId) {
      announceStatus('Select a venue and package before sending the quote to the budget.', 'error');
      return;
    }
    if (Math.abs(Number(quote.total || 0)) < 0.01) {
      announceStatus('Add pricing to the quote before creating a budget line.', 'error');
      return;
    }
    const eventDateIso = quote.eventDateInput || toInputDateString(quote.eventDate);
    if (!eventDateIso) {
      announceStatus('Add the event date before sending the quote to the budget.', 'error');
      return;
    }
    const quoteKey = buildQuoteKey({ ...quote, eventDateInput: eventDateIso });
    const storeRef = window.store;
    if (!storeRef || typeof storeRef.upsert !== 'function') {
      announceStatus('Budget data store is unavailable. Refresh and try again.', 'error');
      return;
    }

    if (state.savedQuoteRefs.quoteKey && state.savedQuoteRefs.quoteKey !== quoteKey) {
      state.savedQuoteRefs.eventId = '';
      state.savedQuoteRefs.budgetLineIds = {};
      state.savedQuoteRefs.taskIds = {};
    }
    state.savedQuoteRefs.quoteKey = quoteKey;

    const venueId = quote.venueId;
    const venue = venueData.find((item) => normalizeId(item.id) === venueId);
    const packageName = quote.packageName || '';
    const venueName = quote.venueName || venue?.name || '';
    const childrenCount = Number.isFinite(quote.children) ? Math.max(0, Math.round(quote.children)) : 0;
    const guestParts = [];
    if (quote.guests > 0) {
      guestParts.push(`${quote.guests.toLocaleString()} pax`);
    }
    if (childrenCount > 0) {
      guestParts.push(`${childrenCount.toLocaleString()} child${childrenCount === 1 ? '' : 'ren'}`);
    }
    const guestsLabel = guestParts.length ? guestParts.join(' + ') : 'Quote';
    const eventTitle = `${venueName || 'Quote'} — ${packageName || 'Package'} — ${guestsLabel}`;

    const events = Array.isArray(storeRef.data?.events) ? storeRef.data.events : [];
    const savedEventId = state.savedQuoteRefs.eventId || null;
    let eventRecord = null;

    if (savedEventId) {
      eventRecord = events.find(
        (item) => item.id === savedEventId && (!item.quoteKey || item.quoteKey === quoteKey)
      );
    }

    if (!eventRecord) {
      eventRecord = { id: null };
    }

    eventRecord.title = eventTitle;
    eventRecord.eventType = eventRecord.eventType || 'Quote';
    eventRecord.eventDate = eventDateIso;
    eventRecord.status = eventRecord.status || 'Planning';
    eventRecord.owner = eventRecord.owner || '';
    eventRecord.address = venue?.location || eventRecord.address || '';
    eventRecord.lat = eventRecord.lat ?? venue?.lat ?? null;
    eventRecord.lon = eventRecord.lon ?? venue?.lon ?? null;
    eventRecord.quoteKey = quoteKey;

    const storedEventId = storeRef.upsert('events', eventRecord);
    eventRecord.id = storedEventId;
    state.savedQuoteRefs.eventId = storedEventId;
    storage.set(STORAGE_KEYS.EVENT_ID, storedEventId);

    const savedLineRefs = state.savedQuoteRefs.budgetLineIds || {};
    const savedTaskRefs = state.savedQuoteRefs.taskIds || {};
    const budgetLines = Array.isArray(storeRef.data?.budget) ? storeRef.data.budget : [];
    const budgetById = new Map(budgetLines.map((line) => [line.id, line]));
    const taskList = Array.isArray(storeRef.data?.tasks) ? storeRef.data.tasks : [];
    const tasksById = new Map(taskList.map((task) => [task.id, task]));

    const rawLines = Array.isArray(quote.quoteLines) ? quote.quoteLines : [];
    const basePackageLabel = `${venueName || 'Venue'} + ${packageName || 'Package'}`.trim();
    const tierLabel = quote.tierLabel || (quote.tierId ? `Tier ${quote.tierId}` : '');
    const MIN_TOTAL = 0.01;
    const lineEntries = [];
    const legacyVenueKey = quote.venueId
      ? buildQuoteLineKey('venue', quote.venueId, venueName || '')
      : null;
    const legacyVenueBudgetLine = legacyVenueKey
      ? budgetLines.find((line) => line.quoteKey === quoteKey && line.quoteLineKey === legacyVenueKey) || null
      : null;
    const legacyVenueTask = legacyVenueKey
      ? taskList.find((task) => task.quoteKey === quoteKey && task.quoteLineKey === legacyVenueKey) || null
      : null;

    const packageLine = rawLines.find((line) => line.type === 'package');
    if (packageLine && Math.abs(Number(packageLine.total || 0)) >= MIN_TOTAL) {
      const guestQuantity = Number.isFinite(Number(quote.guests))
        ? Math.max(1, Math.round(Number(quote.guests)))
        : null;
      const packageQuantity = guestQuantity || Math.max(1, Number(packageLine.quantity || 1));
      lineEntries.push({
        key: buildQuoteLineKey('package', packageLine.id || quote.packageId, packageName || packageLine.name),
        cat: 'Package',
        item: tierLabel ? `${basePackageLabel} (${tierLabel})` : basePackageLabel,
        quantity: packageQuantity,
        unit: Number(packageLine.unitPrice || 0),
        total: Number(packageLine.total || 0),
        details: packageLine.details || '',
        type: 'package',
        quoteLine: packageLine,
        legacyBudgetLine: legacyVenueBudgetLine,
        legacyTask: legacyVenueTask,
      });
    }

    rawLines
      .filter((line) => line.type === 'addon' && Math.abs(Number(line.total || 0)) >= MIN_TOTAL)
      .forEach((line) => {
        const addon = addonData.find((item) => item.id === line.id);
        const category = addon?.category ? addon.category : 'Add-ons';
        const itemName = addon?.name || line.name || 'Add-on';
        lineEntries.push({
          key: buildQuoteLineKey('addon', line.id, itemName),
          cat: category,
          item: itemName,
          quantity: Number.isFinite(Number(line.quantity)) ? Number(line.quantity) : 1,
          unit: Number(line.unitPrice || 0),
          total: Number(line.total || 0),
          details: line.details || '',
          type: 'addon',
          quoteLine: line,
        });
      });

    rawLines
      .filter(
        (line) =>
          (line.type === 'percentAdjustment' || line.type === 'flatAdjustment')
          && Math.abs(Number(line.total || 0)) >= MIN_TOTAL
      )
      .forEach((line) => {
        const total = Number(line.total || 0);
        const category = total < 0 ? 'Discounts' : 'Adjustments';
        lineEntries.push({
          key: buildQuoteLineKey(line.type, line.id || line.name, line.name),
          cat: category,
          item: line.name || category,
          quantity: Math.max(1, Number(line.quantity || 1)),
          unit: Number(line.unitPrice || line.total || 0),
          total,
          details: line.details || '',
          type: line.type,
          quoteLine: line,
        });
      });

    if (!lineEntries.length) {
      lineEntries.push({
        key: buildQuoteLineKey('package', quote.packageId, packageName || 'Quote'),
        cat: 'Package',
        item: tierLabel ? `${basePackageLabel} (${tierLabel})` : basePackageLabel,
        quantity: 1,
        unit: Number(quote.total || 0),
        total: Number(quote.total || 0),
        details: '',
        type: 'package',
        quoteLine: null,
        legacyBudgetLine: legacyVenueBudgetLine,
        legacyTask: legacyVenueTask,
      });
    }

    const confirmationNote = 'Pending confirmation — mark as confirmed when the client signs.';
    const nextBudgetRefs = {};
    const keptBudgetIds = new Set();

    lineEntries.forEach((entry) => {
      const savedId = entry.legacyBudgetLine?.id || savedLineRefs?.[entry.key];
      let budgetLine = (savedId && budgetById.get(savedId)) || null;
      if (!budgetLine) {
        budgetLine = budgetLines.find((line) => line.quoteKey === quoteKey && line.quoteLineKey === entry.key) || null;
      }
      if (!budgetLine) {
        budgetLine = { id: null };
      }

      const wasNew = !budgetLine.id;
      budgetLine.eventId = storedEventId;
      budgetLine.cat = entry.cat;
      budgetLine.item = entry.item;
      const qtyValue = Number(entry.quantity);
      budgetLine.qty = Number.isFinite(qtyValue) && qtyValue !== 0 ? qtyValue : 1;
      const unitValue = Number(entry.unit);
      budgetLine.unit = Number.isFinite(unitValue) ? unitValue : 0;
      const existingTax = Number(budgetLine.tax);
      budgetLine.tax = Number.isFinite(existingTax) ? existingTax : 0;
      const totalValue = Number(entry.total);
      budgetLine.forecast = Number.isFinite(totalValue) ? totalValue : 0;
      const vendorLines = Array.isArray(budgetLine.vendors) ? [...budgetLine.vendors] : [];
      const fallbackServiceLabel = (() => {
        const isVenueLine = /venue/i.test(entry.cat || '') || entry.type === 'venue';
        if (isVenueLine) {
          return venueName ? `Venue - ${venueName}` : 'Venue';
        }
        if (entry.item) {
          return entry.item;
        }
        return 'Service';
      })();

      const normalizedServices = (() => {
        const rawServices = Array.isArray(entry.quoteLine?.services)
          ? entry.quoteLine.services.slice()
          : [];
        if (!rawServices.length) {
          return [
            {
              name: fallbackServiceLabel,
              quantity: entry.quantity,
            },
          ];
        }
        return rawServices.map((service, serviceIndex) => ({
          name: service?.name || fallbackServiceLabel || `Service ${serviceIndex + 1}`,
          quantity: Number.isFinite(Number(service?.quantity)) && Number(service.quantity) !== 0
            ? Number(service.quantity)
            : entry.quantity,
        }));
      })();

      const normalizedServiceCount = Math.max(1, normalizedServices.length);
      const vendorCount = Math.max(normalizedServiceCount, vendorLines.length);
      for (let index = 0; index < vendorCount; index += 1) {
        const existingVendor = vendorLines[index] || {};
        const serviceIndex = index < normalizedServiceCount
          ? index
          : index % normalizedServiceCount;
        const serviceInfo = normalizedServices[serviceIndex]
          || normalizedServices[normalizedServiceCount - 1]
          || { name: fallbackServiceLabel, quantity: entry.quantity };
        const fallbackQty = Number.isFinite(Number(serviceInfo.quantity)) && Number(serviceInfo.quantity) !== 0
          ? Number(serviceInfo.quantity)
          : Number(entry.quantity);
        const preferredQty = Number.isFinite(Number(fallbackQty)) && Number(fallbackQty) !== 0
          ? Number(fallbackQty)
          : Number(budgetLine.qty);
        const normalizedQty = Number.isFinite(Number(existingVendor.qty)) && Number(existingVendor.qty) !== 0
          ? Number(existingVendor.qty)
          : Number.isFinite(Number(preferredQty)) && Number(preferredQty) !== 0
            ? Number(preferredQty)
            : 1;

        if (!vendorLines[index]) {
          vendorLines[index] = {
            service: serviceInfo.name || fallbackServiceLabel || `Service ${index + 1}`,
            vendor: '',
            qty: normalizedQty,
            price: 0,
            total: 0,
          };
        } else {
          vendorLines[index] = {
            ...existingVendor,
            service: existingVendor.service || serviceInfo.name || fallbackServiceLabel || `Service ${index + 1}`,
            qty: normalizedQty,
          };
        }
      }
      budgetLine.vendors = vendorLines;
      const vendorActual = vendorLines.reduce(
        (sum, vendor) => sum + Number(vendor?.total ?? vendor?.price ?? 0),
        0
      );
      const hasVendorTotals = vendorLines.some((vendor) => {
        const amount = Number(vendor?.total ?? vendor?.price ?? 0);
        return Number.isFinite(amount) && amount !== 0;
      });
      const existingActual = Number(budgetLine.actual);
      budgetLine.actual = hasVendorTotals
        ? vendorActual
        : Number.isFinite(existingActual)
          ? existingActual
          : 0;
      budgetLine.catalogRefId = entry.quoteLine?.id || budgetLine.catalogRefId || '';
      budgetLine.catalogType = entry.type || budgetLine.catalogType || '';
      budgetLine.quoteKey = quoteKey;
      budgetLine.quoteLineKey = entry.key;
      budgetLine.confirmed = Boolean(budgetLine.confirmed);

      const detailNote = entry.details ? String(entry.details) : '';
      if (entry.type === 'package' && !budgetLine.confirmed) {
        const noteParts = [];
        if (detailNote) {
          noteParts.push(detailNote);
        }
        noteParts.push(confirmationNote);
        if (wasNew || !budgetLine.notes || budgetLine.notes === confirmationNote) {
          budgetLine.notes = noteParts.filter(Boolean).join(' — ');
        }
      } else if (!budgetLine.notes && detailNote) {
        budgetLine.notes = detailNote;
      }

      if (!budgetLine.notes && entry.type === 'package' && !budgetLine.confirmed) {
        budgetLine.notes = confirmationNote;
      }

      const savedBudgetId = storeRef.upsert('budget', budgetLine);
      budgetLine.id = savedBudgetId;
      entry.budgetLine = budgetLine;
      keptBudgetIds.add(savedBudgetId);
      nextBudgetRefs[entry.key] = savedBudgetId;
    });

    budgetLines
      .filter((line) => line.quoteKey === quoteKey)
      .forEach((line) => {
        if (!keptBudgetIds.has(line.id)) {
          storeRef.remove('budget', line.id);
        }
      });

    const nextTaskRefs = {};
    const keptTaskIds = new Set();

    lineEntries.forEach((entry) => {
      const savedId = savedTaskRefs?.[entry.key] || entry.legacyTask?.id;
      let taskRecord = (savedId && tasksById.get(savedId)) || null;
      if (!taskRecord) {
        taskRecord = taskList.find((task) => task.quoteKey === quoteKey && task.quoteLineKey === entry.key) || null;
      }
      if (!taskRecord) {
        taskRecord = { id: null };
      }

      const isNewTask = !taskRecord.id;
      taskRecord.eventId = storedEventId;
      taskRecord.title = `Confirm ${entry.item}`;
      taskRecord.assignedTo = taskRecord.assignedTo || '';
      const isConfirmed = Boolean(entry.budgetLine?.confirmed);
      if (isConfirmed) {
        taskRecord.status = 'Completed';
        if (!taskRecord.completedDate) {
          taskRecord.completedDate = new Date().toISOString();
        }
      } else {
        if (isNewTask) {
          taskRecord.status = 'Not Started';
        } else if (taskRecord.status === 'Completed') {
          taskRecord.status = 'Not Started';
        } else if (!taskRecord.status) {
          taskRecord.status = 'Not Started';
        }
        if (taskRecord.status !== 'Completed') {
          taskRecord.completedDate = '';
        }
      }
      if (!taskRecord.dueDate || isNewTask) {
        taskRecord.dueDate = eventDateIso || '';
      }
      if (isNewTask) {
        const noteParts = [`Amount: ${formatCurrency(entry.total)}`];
        if (entry.details) {
          noteParts.push(`Details: ${entry.details}`);
        }
        noteParts.push('Auto-generated from quote builder. Update once the client signs.');
        taskRecord.notes = noteParts.join(' • ');
      } else if (!taskRecord.notes && entry.details) {
        taskRecord.notes = `Details: ${entry.details}`;
      }
      taskRecord.quoteKey = quoteKey;
      taskRecord.quoteLineKey = entry.key;
      taskRecord.fromQuoteBuilder = true;

      const savedTaskId = storeRef.upsert('tasks', taskRecord);
      taskRecord.id = savedTaskId;
      keptTaskIds.add(savedTaskId);
      nextTaskRefs[entry.key] = savedTaskId;
    });

    taskList
      .filter((task) => task.quoteKey === quoteKey)
      .forEach((task) => {
        if (!keptTaskIds.has(task.id)) {
          storeRef.remove('tasks', task.id);
        }
      });

    state.savedQuoteRefs.budgetLineIds = nextBudgetRefs;
    state.savedQuoteRefs.taskIds = nextTaskRefs;
    storage.set(STORAGE_KEYS.QUOTE_KEY, quoteKey);
    storage.setJson(STORAGE_KEYS.BUDGET_LINE_IDS, nextBudgetRefs);
    storage.setJson(STORAGE_KEYS.TASK_IDS, nextTaskRefs);

    if (typeof window.renderAll === 'function') {
      window.renderAll('budget');
    } else if (typeof window.renderBudget === 'function') {
      window.renderBudget();
    }

    announceStatus('Quote added to the budget and linked tasks created. Confirm once the client signs.', 'success');
  }

  function buildPackageComparisons(guestCount, eventDate) {
    const normalizedGuests = Math.max(0, Math.round(guestCount || 0));
    const percentRate = workbookModel ? getPercentDiscount(eventDate) : 0;
    const effectivePercent = Number.isFinite(percentRate) ? percentRate : 0;
    const rows = [];
    const venues = venueData.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    const packages = packageData.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    venues.forEach((venue) => {
      packages.forEach((pkg) => {
        if (!packageMatchesVenue(pkg, venue.id)) {
          return;
        }
        const pricing = getPackagePrice(pkg, normalizedGuests, venue.id);
        const basePrice = Number.isFinite(pricing.total) ? pricing.total : 0;
        if (!Number.isFinite(basePrice) || Math.abs(basePrice) < 0.01) {
          return;
        }
        const percentAdjustment = effectivePercent ? basePrice * effectivePercent : 0;
        const flatAdjustment = workbookModel ? getFlatDiscount(venue.id, eventDate) : 0;
        const total = basePrice + percentAdjustment + flatAdjustment;
        rows.push({
          venueKey: normalizeId(venue.id),
          venueName: venue.name || venue.id,
          packageKey: normalizeId(pkg.id),
          packageName: pkg.name || pkg.id,
          tierId: pricing.tierId || '',
          tierLabel: pricing.tierLabel || '',
          guestsUsed: pricing.guestsUsed || normalizedGuests || 0,
          basePrice,
          percentAdjustment,
          flatAdjustment,
          total,
        });
      });
    });

    rows.sort((a, b) => {
      const totalDiff = a.total - b.total;
      if (Math.abs(totalDiff) > 0.01) return totalDiff;
      const baseDiff = a.basePrice - b.basePrice;
      if (Math.abs(baseDiff) > 0.01) return baseDiff;
      const venueCompare = (a.venueName || '').localeCompare(b.venueName || '');
      if (venueCompare) return venueCompare;
      return (a.packageName || '').localeCompare(b.packageName || '');
    });

    rows.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return rows;
  }

  function applyPdfFillOpacity(doc, alpha) {
    if (!doc || typeof alpha !== 'number') {
      return () => {};
    }

    const pdfLib = window.jspdf;
    if (pdfLib?.GState && typeof doc.setGState === 'function') {
      try {
        const desiredState = new pdfLib.GState({ opacity: alpha, strokeOpacity: 1 });
        doc.setGState(desiredState);
        return () => {
          try {
            doc.setGState(new pdfLib.GState({ opacity: 1, strokeOpacity: 1 }));
          } catch (resetError) {
            console.warn('Failed to reset PDF opacity', resetError);
          }
        };
      } catch (error) {
        console.warn('Unable to apply PDF opacity', error);
      }
    }

    if (typeof doc.setFillAlpha === 'function') {
      doc.setFillAlpha(alpha);
      return () => {
        try {
          doc.setFillAlpha(1);
        } catch (error) {
          console.warn('Failed to reset PDF fill alpha', error);
        }
      };
    }

    return () => {};
  }

  function drawPdfCellOverlay(doc, r, g, b, x, y, width, height) {
    const resetOpacity = applyPdfFillOpacity(doc, PDF_TABLE_OVERLAY_ALPHA);
    try {
      doc.setFillColor(r, g, b);
      doc.rect(x, y, width, height, 'F');
    } finally {
      resetOpacity();
    }
  }

  async function exportPdf() {
    try {
      const pdfLib = window.jspdf;
      if (!pdfLib?.jsPDF) {
        announceStatus('PDF export is unavailable in this environment.', 'error');
        return;
      }

      const data = buildQuoteExportTableData();
      if (!data) {
        announceStatus('Populate the quote before exporting.', 'warning');
        return;
      }

      const doc = new pdfLib.jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      try {
        const backgroundUrl = await ensureQuoteBackgroundPngDataUrl();
        if (backgroundUrl) {
          doc.addImage(backgroundUrl, 'PNG', 0, 0, pageWidth, pageHeight);
        }
      } catch (error) {
        console.error('Failed to apply quote background', error);
      }

      const marginLeft = 72;
      let cursorY = 120;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(82, 74, 121);
      doc.text('Event quote', marginLeft, cursorY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(49, 42, 90);
      cursorY += 24;
      data.metadata.forEach((entry) => {
        doc.text(`${entry.label}: ${entry.value}`, marginLeft, cursorY);
        cursorY += 16;
      });
      cursorY += 8;

      if (typeof doc.autoTable !== 'function') {
        announceStatus('PDF export is unavailable in this environment.', 'error');
        return;
      }

      const preventCurrencyWrap = (label) => (
        typeof label === 'string' ? label.replace(/ /g, '\u00A0') : label
      );

      const head = [['Item', 'Details', 'Qty', 'Unit', 'Total']];
      const body = data.rows.map((row) => [
        row.name,
        row.details,
        row.quantityLabel,
        preventCurrencyWrap(row.unitLabel),
        preventCurrencyWrap(row.totalLabel),
      ]);

      doc.autoTable({
        startY: cursorY,
        head,
        body,
        theme: 'grid',
        styles: {
          fillColor: false,
          textColor: [49, 42, 90],
          lineColor: [216, 205, 248],
          lineWidth: 0.4,
          fontSize: 10,
          cellPadding: { top: 6, bottom: 6, left: 8, right: 8 },
        },
        headStyles: {
          fillColor: false,
          textColor: [76, 29, 149],
          fontStyle: 'bold',
          fontSize: 10,
        },
        alternateRowStyles: {
          fillColor: false,
        },
        foot: [['', '', '', 'Total', preventCurrencyWrap(data.totalLabel)]],
        footStyles: {
          fillColor: false,
          textColor: [76, 29, 149],
          fontStyle: 'bold',
          fontSize: 11,
        },
        didParseCell: (hookData) => {
          if (!hookData?.cell?.styles) {
            return;
          }
          hookData.cell.styles.fillColor = false;
        },
        willDrawCell: (hookData) => {
          if (!hookData.cell) {
            return;
          }

          const { x, y, width, height } = hookData.cell;

          if (hookData.section === 'head') {
            drawPdfCellOverlay(doc, 247, 243, 255, x, y, width, height);
          } else if (hookData.section === 'body') {
            drawPdfCellOverlay(doc, 255, 255, 255, x, y, width, height);
          } else if (hookData.section === 'foot') {
            drawPdfCellOverlay(doc, 236, 224, 255, x, y, width, height);
          }
        },
      });

      doc.save('quotation.pdf');
      announceStatus('Quote exported with branded background.', 'success');
    } catch (error) {
      console.error('PDF export failed', error);
      announceStatus('Unable to export the quote as PDF.', 'error');
    }
  }

  async function exportDocx() {
    try {
      const docx = window.docx;
      if (!docx?.Document || !docx?.Packer?.toBlob) {
        announceStatus('DOCX export is unavailable in this environment.', 'error');
        return;
      }

      const data = buildQuoteExportTableData();
      if (!data) {
        announceStatus('Populate the quote before exporting.', 'warning');
        return;
      }

      const document = new docx.Document({
        sections: [],
      });

      const children = [];

      try {
        const backgroundUrl = await ensureQuoteBackgroundPngDataUrl();
        if (backgroundUrl) {
          const backgroundImage = docx.Media.addImage(
            document,
            dataUrlToUint8Array(backgroundUrl),
            612,
            792,
            {
              floating: {
                behindDocument: true,
                allowOverlap: true,
                horizontalPosition: {
                  alignment: docx.HorizontalPositionAlignment.CENTER,
                },
                verticalPosition: {
                  alignment: docx.VerticalPositionAlignment.TOP,
                },
              },
            }
          );
          children.push(new docx.Paragraph({ children: [backgroundImage] }));
        }
      } catch (error) {
        console.error('Failed to apply DOCX quote background', error);
      }

      children.push(
        new docx.Paragraph({
          text: 'Event quote',
          heading: docx.HeadingLevel.HEADING_1,
          spacing: { after: 120 },
        })
      );

      data.metadata.forEach((entry) => {
        children.push(
          new docx.Paragraph({
            spacing: { after: 80 },
            children: [
              new docx.TextRun({ text: `${entry.label}: `, bold: true }),
              new docx.TextRun({ text: entry.value }),
            ],
          })
        );
      });

      const shadingTypes = docx.ShadingType || {};
      const applyShadeType = (base, ...preferredKeys) => {
        const shading = { ...base };
        for (const key of preferredKeys) {
          if (key && shadingTypes[key]) {
            shading.type = shadingTypes[key];
            return shading;
          }
        }
        if (!shading.type && shadingTypes.CLEAR) {
          shading.type = shadingTypes.CLEAR;
        }
        return shading;
      };

      const headerRow = new docx.TableRow({
        tableHeader: true,
        children: ['Item', 'Details', 'Qty', 'Unit', 'Total'].map((text) =>
          new docx.TableCell({
            children: [
              new docx.Paragraph({
                text,
                alignment: docx.AlignmentType.LEFT,
                spacing: { after: 40 },
              }),
            ],
            shading: applyShadeType({ fill: 'FFFFFF', color: 'FFFFFF' }, 'PERCENT_10', 'CLEAR'),
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
          })
        ),
      });

      const bodyRows = data.rows.map((row, index) => {
        const zebraShadeFactory = () => (index % 2 === 0
          ? applyShadeType({ fill: 'FFFFFF', color: 'FFFFFF' }, 'CLEAR', 'PERCENT_5')
          : applyShadeType({ fill: 'FBF8FF', color: 'FFFFFF' }, 'PERCENT_5', 'PERCENT_10'));
        return new docx.TableRow({
          children: [
            new docx.TableCell({
              children: [new docx.Paragraph({ text: row.name })],
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              shading: zebraShadeFactory(),
            }),
            new docx.TableCell({
              children: [new docx.Paragraph({ text: row.details })],
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              shading: zebraShadeFactory(),
            }),
            new docx.TableCell({
              children: [
                new docx.Paragraph({
                  text: row.quantityLabel,
                  alignment: docx.AlignmentType.RIGHT,
                }),
              ],
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              shading: zebraShadeFactory(),
            }),
            new docx.TableCell({
              children: [
                new docx.Paragraph({
                  text: row.unitLabel,
                  alignment: docx.AlignmentType.RIGHT,
                }),
              ],
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              shading: zebraShadeFactory(),
            }),
            new docx.TableCell({
              children: [
                new docx.Paragraph({
                  text: row.totalLabel,
                  alignment: docx.AlignmentType.RIGHT,
                }),
              ],
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              shading: zebraShadeFactory(),
            }),
          ],
        });
      });

      const totalRow = new docx.TableRow({
        children: [
          new docx.TableCell({
            columnSpan: 4,
            children: [
              new docx.Paragraph({
                alignment: docx.AlignmentType.RIGHT,
                children: [new docx.TextRun({ text: 'Total', bold: true, color: '4C1D95' })],
              }),
            ],
            shading: applyShadeType({ fill: 'F1E9FF', color: 'FFFFFF' }, 'PERCENT_12', 'PERCENT_10'),
            margins: { top: 100, bottom: 100, left: 120, right: 120 },
          }),
          new docx.TableCell({
            children: [
              new docx.Paragraph({
                alignment: docx.AlignmentType.RIGHT,
                children: [new docx.TextRun({ text: data.totalLabel, bold: true, color: '4C1D95' })],
              }),
            ],
            shading: applyShadeType({ fill: 'F1E9FF', color: 'FFFFFF' }, 'PERCENT_12', 'PERCENT_10'),
            margins: { top: 100, bottom: 100, left: 120, right: 120 },
          }),
        ],
      });

      const table = new docx.Table({
        rows: [headerRow, ...bodyRows, totalRow],
        width: {
          size: 100,
          type: docx.WidthType.PERCENTAGE,
        },
        borders: {
          top: { style: docx.BorderStyle.SINGLE, size: 4, color: 'E5DDFB' },
          bottom: { style: docx.BorderStyle.SINGLE, size: 4, color: 'E5DDFB' },
          left: { style: docx.BorderStyle.SINGLE, size: 4, color: 'E5DDFB' },
          right: { style: docx.BorderStyle.SINGLE, size: 4, color: 'E5DDFB' },
          insideHorizontal: { style: docx.BorderStyle.SINGLE, size: 4, color: 'ECE5FC' },
          insideVertical: { style: docx.BorderStyle.SINGLE, size: 4, color: 'ECE5FC' },
        },
      });

      children.push(table);

      document.addSection({
        properties: {
          page: {
            margin: {
              top: docx.convertInchesToTwip(1),
              bottom: docx.convertInchesToTwip(1),
              left: docx.convertInchesToTwip(1),
              right: docx.convertInchesToTwip(1),
            },
          },
        },
        children,
      });

      const blob = await docx.Packer.toBlob(document);
      saveAs(blob, 'quotation.docx');
      announceStatus('Quote exported with branded background.', 'success');
    } catch (error) {
      console.error('DOCX export failed', error);
      announceStatus('Unable to export the quote as DOCX.', 'error');
    }
  }

  function exportXlsx() {
    try {
      if (typeof XLSX === 'undefined' || !XLSX.utils) {
        announceStatus('Excel export is unavailable in this environment.', 'error');
        return;
      }

      const data = buildQuoteExportTableData();
      if (!data) {
        announceStatus('Populate the quote before exporting.', 'warning');
        return;
      }

      const workbook = XLSX.utils.book_new();
      const sheetRows = [];
      sheetRows.push(['NISA EVENTOS']);
      sheetRows.push(['Event quote']);
      data.metadata.forEach((entry) => {
        sheetRows.push([`${entry.label}: ${entry.value}`]);
      });
      sheetRows.push([]);
      sheetRows.push(['Item', 'Details', 'Qty', 'Unit', 'Total']);
      data.rows.forEach((row) => {
        sheetRows.push([
          row.name,
          row.details,
          row.quantityLabel,
          row.unitLabel,
          row.totalLabel,
        ]);
      });
      sheetRows.push(['', '', '', 'Total', data.totalLabel]);

      const sheet = XLSX.utils.aoa_to_sheet(sheetRows);
      sheet['!cols'] = [
        { wch: 28 },
        { wch: 64 },
        { wch: 10 },
        { wch: 16 },
        { wch: 16 },
      ];
      sheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
      ];

      XLSX.utils.book_append_sheet(workbook, sheet, 'Quotation');
      XLSX.writeFile(workbook, 'quotation.xlsx');
      announceStatus('Quote exported to Excel.', 'success');
    } catch (error) {
      console.error('Excel export failed', error);
      announceStatus('Unable to export the quote as Excel.', 'error');
    }
  }

  function exportCompareMatrix() {
    const table = document.getElementById('quoteCompareTable');
    if (!table) {
      announceStatus('Comparison matrix is unavailable for export right now.', 'error');
      return;
    }

    const hasData = Array.from(table.querySelectorAll('tbody tr')).some(
      (row) => !row.classList.contains('empty-row')
    );
    if (!hasData) {
      announceStatus('Populate the comparison matrix before exporting.', 'warning');
      return;
    }

    const clone = table.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('th').forEach((th) => {
      th.style.position = 'static';
      th.style.top = 'auto';
    });

    const summaryText = (state.refs?.compareSummary?.textContent || '').trim();

    const exportStyles = `body{font-family:Inter,Segoe UI,Arial,sans-serif;color:#1f1b2e;background:#ffffff;margin:32px;}h1{margin:0 0 12px;font-size:20px;}p.summary{margin:0 0 20px;color:#524a79;max-width:72ch;}table{border-collapse:collapse;width:100%;box-shadow:0 6px 20px rgba(124,58,237,0.08);}thead th{background:#ede9fe;color:#4c1d95;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;}th,td{border:1px solid #dcd3fb;padding:10px 14px;text-align:left;vertical-align:top;font-size:14px;}tbody tr:nth-child(odd){background:transparent;}tbody tr:nth-child(odd) th{background:#f3eeff;}td.compare-cell{min-width:150px;background-color:#ffffff;background-clip:padding-box;}td.compare-cell .price{display:block;font-weight:700;font-size:16px;margin-bottom:4px;}td.compare-cell .meta{display:block;font-size:12px;color:#524a79;line-height:1.35;}td.compare-cell.is-empty{text-align:center;font-style:italic;color:#6b6a87;}td.compare-cell.is-active{box-shadow:inset 0 0 0 2px #7c3aed;border-radius:10px;}td.compare-cell.is-best .price{color:#047857;}td.compare-cell.heat-best{background:linear-gradient(135deg,rgba(16,185,129,.34),rgba(16,185,129,.12));background-color:rgba(16,185,129,.18);}td.compare-cell.heat-good{background:linear-gradient(135deg,rgba(34,197,94,.32),rgba(34,197,94,.12));background-color:rgba(34,197,94,.16);}td.compare-cell.heat-mid{background:linear-gradient(135deg,rgba(245,158,11,.32),rgba(245,158,11,.12));background-color:rgba(245,158,11,.18);}td.compare-cell.heat-warm{background:linear-gradient(135deg,rgba(249,115,22,.36),rgba(249,115,22,.16));background-color:rgba(249,115,22,.2);}td.compare-cell.heat-hot{background:linear-gradient(135deg,rgba(239,68,68,.4),rgba(239,68,68,.2));background-color:rgba(239,68,68,.22);}`;

    const summaryHtml = summaryText ? `<p class="summary">${escapeHtml(summaryText)}</p>` : '';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Comparison matrix</title><style>${exportStyles}</style></head><body><h1>Compare prices</h1>${summaryHtml}${clone.outerHTML}</body></html>`;
    const blob = new Blob([`\uFEFF${html}`], {
      type: 'application/vnd.ms-excel;charset=utf-8',
    });
    const filename = 'comparison-matrix.xls';

    if (typeof saveAs === 'function') {
      saveAs(blob, filename);
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    }

    announceStatus('Comparison matrix exported with heat map styling.', 'success');
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildPackageOptionLabel(pkg, guestCount, venueId) {
    const preview = getPackagePrice(pkg, guestCount, venueId);
    const guestsLabel = preview.guestsUsed
      ? `${preview.guestsUsed.toLocaleString()} guests`
      : guestCount
      ? `${guestCount.toLocaleString()} guests`
      : 'Guest count pending';
    const priceLabel = preview.chargeUnit === CHARGE_UNIT.PER_PERSON || preview.basis === BASIS.PER_GUEST
      ? `${formatCurrency(preview.unitPrice)} per guest`
      : formatCurrency(preview.total);
    const tierLabel = preview.tierLabel ? ` — ${preview.tierLabel}` : '';
    return `${pkg.name} — ${guestsLabel} — ${priceLabel}${tierLabel}`;
  }

  function buildAddonOptionLabel(addon, guestCount, venueId, context = {}) {
    const preview = getAddonPrice(addon, guestCount, venueId, context);
    let priceLabel;
    if (preview.chargeUnit === CHARGE_UNIT.PER_PERSON || preview.basis === BASIS.PER_GUEST) {
      priceLabel = `${formatCurrency(preview.unitPrice)} per guest`;
    } else if (preview.chargeUnit === CHARGE_UNIT.PER_CHILD) {
      priceLabel = `${formatCurrency(preview.unitPrice)} per child`;
    } else if (preview.chargeUnit === CHARGE_UNIT.PER_HOUR) {
      priceLabel = `${formatCurrency(preview.unitPrice)} per hour`;
    } else if (preview.chargeUnit === CHARGE_UNIT.PER_UNIT) {
      priceLabel = `${formatCurrency(preview.unitPrice)} per unit`;
    } else if (preview.chargeUnit === CHARGE_UNIT.PER_SQM) {
      priceLabel = `${formatCurrency(preview.unitPrice)} per sqm`;
    } else {
      priceLabel = formatCurrency(preview.total || preview.unitPrice);
    }
    if (addon.category) {
      return `${addon.name} — ${priceLabel} (${addon.category})`;
    }
    return `${addon.name} — ${priceLabel}`;
  }

  function buildPackageDetails(pkg, pricing) {
    const details = [];
    if (pricing.guestsUsed) {
      details.push(`${pricing.guestsUsed.toLocaleString()} guests`);
    }
    if (pkg.duration) {
      details.push(pkg.duration);
    }
    if (pricing.tierLabel) {
      details.push(pricing.tierLabel);
    } else if (pricing.tier?.label) {
      details.push(pricing.tier.label);
    } else if (pricing.tierId) {
      details.push(`Tier ${pricing.tierId}`);
    }
    if (pricing.basis === BASIS.PER_GUEST) {
      details.push('Billed per guest');
    }
    if (pkg.description) {
      details.push(pkg.description);
    }
    return details.join(' • ');
  }

  function buildAddonDetails(addon, pricing) {
    const details = [];
    if (addon.category) {
      details.push(addon.category);
    }
    if (pricing.guestsUsed && (pricing.chargeUnit === CHARGE_UNIT.PER_PERSON || pricing.basis === BASIS.PER_GUEST)) {
      details.push(`${pricing.guestsUsed.toLocaleString()} guests`);
    }
    if (pricing.chargeUnit === CHARGE_UNIT.PER_CHILD && Number.isFinite(pricing.quantity)) {
      details.push(`${pricing.quantity.toLocaleString()} children`);
    }
    if (pricing.chargeUnit === CHARGE_UNIT.PER_HOUR && Number.isFinite(pricing.quantity)) {
      details.push(`${pricing.quantity.toLocaleString()} hours`);
    }
    if (pricing.chargeUnit === CHARGE_UNIT.PER_UNIT && Number.isFinite(pricing.quantity)) {
      details.push(`${pricing.quantity.toLocaleString()} units`);
    }
    if (pricing.chargeUnit === CHARGE_UNIT.PER_SQM && Number.isFinite(pricing.quantity)) {
      details.push(`${pricing.quantity.toLocaleString()} sqm`);
    }
    if (pricing.tier?.label) {
      details.push(pricing.tier.label);
    }
    if (addon.description) {
      details.push(addon.description);
    }
    return details.join(' • ');
  }

  function buildRow(name, details, qty, price, total) {
    const tr = document.createElement('tr');
    const values = [
      name || '—',
      details || '—',
      Number.isFinite(qty) ? qty.toLocaleString() : '1',
      formatCurrency(price),
      formatCurrency(Number.isFinite(total) ? total : price * (Number.isFinite(qty) ? qty : 1)),
    ];
    values.forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    return tr;
  }

  function getGuestCount() {
    if (!state.refs?.guestInput) return 0;
    const guests = parseInt(state.refs.guestInput.value, 10);
    return Number.isFinite(guests) && guests > 0 ? guests : 0;
  }

  function getChildrenCount() {
    if (!state.refs?.childrenInput) return 0;
    const children = parseInt(state.refs.childrenInput.value, 10);
    return Number.isFinite(children) && children > 0 ? children : 0;
  }

  function getSelectedVenueId() {
    if (!state.refs?.venueSelect) return '';
    const value = state.refs.venueSelect.value;
    return value ? normalizeId(value) : '';
  }

  function getSelectedVenue() {
    const venueId = getSelectedVenueId();
    if (!venueId) {
      return null;
    }
    return venueData.find((item) => normalizeId(item.id) === venueId) || null;
  }

  function getWorkbookEventDate() {
    const manualValue = state.refs?.eventDateInput?.value || '';
    const manualDate = parseDateInputValue(manualValue);
    if (manualDate) {
      return manualDate;
    }
    if (workbookModel?.eventDate instanceof Date && !Number.isNaN(workbookModel.eventDate.valueOf())) {
      return workbookModel.eventDate;
    }
    const stored = storage.get(STORAGE_KEYS.EVENT_DATE);
    const storedDate = parseDateInputValue(stored);
    if (storedDate) {
      return storedDate;
    }
    return new Date();
  }

  function parseDateInputValue(value) {
    if (!value) {
      return null;
    }
    const normalized = value.trim();
    if (!normalized) {
      return null;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      const [year, month, day] = normalized.split('-').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      if (!Number.isNaN(date.valueOf())) {
        return date;
      }
    }
    const fallback = new Date(normalized);
    return Number.isNaN(fallback.valueOf()) ? null : fallback;
  }

  function toInputDateString(date) {
    if (!(date instanceof Date) || Number.isNaN(date.valueOf())) {
      return '';
    }
    const year = date.getUTCFullYear();
    const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
    const day = `${date.getUTCDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatEventDateForSummary(date) {
    if (!(date instanceof Date) || Number.isNaN(date.valueOf())) {
      return '—';
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  }

  function getPercentDiscount(eventDate) {
    const referenceDate = eventDate instanceof Date && !Number.isNaN(eventDate.valueOf())
      ? eventDate
      : new Date();
    const weekday = getIsoWeekday(referenceDate);
    return weekday === 5 || weekday === 7 ? WEEKEND_PERCENT_DISCOUNT : 0;
  }

  function getFlatDiscount(venueId, eventDate) {
    if (!workbookModel) {
      return 0;
    }
    const referenceDate = eventDate instanceof Date && !Number.isNaN(eventDate.valueOf())
      ? eventDate
      : new Date();
    const weekday = getIsoWeekday(referenceDate);
    const key = `${normalizeId(venueId)}|${weekday}`;
    return workbookModel.flatDiscounts.get(key) || 0;
  }

  function getIsoWeekday(date) {
    const jsDay = date.getDay();
    return jsDay === 0 ? 7 : jsDay;
  }

  function describeWeekday(value) {
    const labels = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return labels[value] || `Day ${value}`;
  }

  function packageMatchesVenue(pkg, venueId) {
    if (!venueId) {
      return true;
    }
    const normalizedVenueId = normalizeId(venueId);
    if (workbookModel && pkg.sourceType === 'database') {
      return pkg.availableVenueIds?.some((id) => normalizeId(id) === normalizedVenueId);
    }
    const venue = venueData.find((item) => item.id === venueId);
    if (!venue) {
      return true;
    }
    const venueKeys = new Set([
      venue.id,
      venue.name,
      venue.group,
    ].filter(Boolean).map((value) => normaliseKey(value)));
    if (pkg.venueId && venueKeys.has(normaliseKey(pkg.venueId))) {
      return true;
    }
    if (pkg.group && venueKeys.has(normaliseKey(pkg.group))) {
      return true;
    }
    return !pkg.venueId && !pkg.group;
  }

  function getPackagePrice(pkg, guests, venueId = '') {
    if (workbookModel && pkg?.sourceType === 'database' && venueId) {
      return computeDatabasePackagePrice(pkg, guests, venueId);
    }

    const tiers = pkg.pricing || [];
    const fallbackGuests = pkg.defaultGuests || tiers[0]?.maxGuests || tiers[0]?.minGuests || guests;
    const guestCount = guests > 0 ? guests : fallbackGuests || 0;
    const tier = resolveTier(tiers, guestCount);
    const basis = tier?.basis || pkg.chargeType || BASIS.FLAT;
    const unitPrice = Number.isFinite(tier?.price) ? tier.price : Number.isFinite(pkg.basePrice) ? pkg.basePrice : 0;
    const guestsUsed = guestCount || tier?.maxGuests || tier?.minGuests || 0;
    const quantity = basis === BASIS.PER_GUEST ? Math.max(1, guestsUsed) : tier?.quantity ? tier.quantity : 1;
    const total = unitPrice * quantity;
    return {
      unitPrice,
      quantity,
      total,
      basis,
      guestsUsed,
      tier,
      tierId: tier?.id || null,
      tierLabel: tier?.label || null,
      chargeUnit: basis === BASIS.PER_GUEST ? CHARGE_UNIT.PER_PERSON : CHARGE_UNIT.PER_EVENT,
    };
  }

  function computeDatabasePackagePrice(pkg, guests, venueId) {
    const normalizedVenueId = normalizeId(venueId);
    const guestCount = Math.max(0, Math.round(guests || 0));
    const fallbackGuests = pkg.defaultGuests || workbookModel?.defaultGuests || guestCount;
    const guestsUsed = guestCount > 0 ? guestCount : fallbackGuests || 0;
    const tierId = resolveTierIdForGuests(normalizedVenueId, guestsUsed);
    const tierKey = normaliseTierId(tierId);
    const pricingKey = buildPricingKey(normalizedVenueId, pkg.id, tierKey);
    const pricingEntry = workbookModel.pricingByKey.get(pricingKey);
    let basePrice = pricingEntry?.basePrice ?? 0;

    if (pkg.id === normalizeId(SPECIAL_PACKAGE_SIN_ALIMENTOS)) {
      const fallbackKey = buildPricingKey(normalizedVenueId, SPECIAL_REFERENCE_PACKAGE_TAQUIZA, tierKey);
      const fallbackEntry = workbookModel.pricingByKey.get(fallbackKey);
      if (fallbackEntry) {
        basePrice = fallbackEntry.basePrice - (100 * guestsUsed);
      }
    }

    const unitPrice = Number.isFinite(basePrice) ? basePrice : 0;
    const total = unitPrice;
    const tierLabel = tierKey ? `Tier ${tierKey}` : '';

    return {
      unitPrice,
      quantity: 1,
      total,
      basis: BASIS.FLAT,
      chargeUnit: CHARGE_UNIT.PER_EVENT,
      guestsUsed,
      tierId: tierKey || null,
      tierLabel: tierLabel || null,
    };
  }

  function resolveTierIdForGuests(venueId, guests) {
    const guestCount = Math.max(0, Math.round(guests || 0));
    if (!guestCount) {
      return '';
    }
    const normalizedVenueId = normalizeId(venueId);
    if (normalizedVenueId === 'V012' && workbookModel?.tierLookup?.entries?.length) {
      const match = workbookModel.tierLookup.entries.find((entry) => guestCount <= entry.guests)
        || workbookModel.tierLookup.entries[workbookModel.tierLookup.entries.length - 1];
      return match ? match.tierId : '';
    }
    const ceiling = Math.ceil(guestCount / 10) * 10;
    const padded = String(Math.max(0, ceiling)).padStart(3, '0');
    return `G${padded}`;
  }

  function getAddonPrice(addon, guests, venueId = '', context = {}) {
    const childCount = Math.max(0, Math.round(context.children || 0));
    if (workbookModel && addon?.sourceType === 'database' && venueId) {
      return computeDatabaseAddonPrice(addon, guests, venueId, { children: childCount });
    }

    const tiers = addon.pricing || [];
    const fallbackGuests = guests || tiers[0]?.maxGuests || tiers[0]?.minGuests || 0;
    const guestCount = guests > 0 ? guests : fallbackGuests;
    const tier = resolveTier(tiers, guestCount);
    const basis = tier?.basis || addon.chargeType || BASIS.FLAT;
    const unitPrice = Number.isFinite(tier?.price)
      ? tier.price
      : Number.isFinite(addon.basePrice)
      ? addon.basePrice
      : 0;
    const quantityFromTier = Number.isFinite(tier?.quantity) && tier.quantity > 0 ? tier.quantity : undefined;
    const defaults = addon.defaults || {};
    const explicitChargeUnit =
      tier?.chargeUnit || addon.chargeUnit || (basis === BASIS.PER_GUEST ? CHARGE_UNIT.PER_PERSON : CHARGE_UNIT.PER_EVENT);
    let quantity;
    if (quantityFromTier) {
      quantity = quantityFromTier;
    } else if (explicitChargeUnit === CHARGE_UNIT.PER_PERSON || basis === BASIS.PER_GUEST) {
      quantity = Math.max(1, guestCount || 0);
    } else if (explicitChargeUnit === CHARGE_UNIT.PER_CHILD) {
      const fallbackChildren = Number.isFinite(defaults.children)
        ? defaults.children
        : Number.isFinite(defaults.guests)
        ? defaults.guests
        : Number.isFinite(addon.defaultQty)
        ? addon.defaultQty
        : 0;
      const computed = childCount > 0 ? childCount : fallbackChildren;
      quantity = Math.max(0, computed || 0);
    } else {
      quantity = addon.defaultQty && addon.defaultQty > 0 ? addon.defaultQty : 1;
    }
    const guestsUsed =
      explicitChargeUnit === CHARGE_UNIT.PER_PERSON || basis === BASIS.PER_GUEST
        ? Math.max(1, guestCount || 0)
        : guestCount || 0;
    const total = unitPrice * quantity;
    return {
      unitPrice,
      quantity,
      total,
      basis,
      guestsUsed,
      tier,
      chargeUnit: explicitChargeUnit,
    };
  }

  function computeDatabaseAddonPrice(addon, guests, venueId, context = {}) {
    const normalizedVenueId = normalizeId(venueId);
    const overrideKey = buildAddonOverrideKey(normalizedVenueId, addon.id);
    const overridePrice = workbookModel.addonOverrides.get(overrideKey);
    const basePrice = Number.isFinite(overridePrice) ? overridePrice : addon.defaultPrice || 0;
    const defaults = addon.defaults || {};
    const guestCount = Math.max(0, Math.round(guests || 0));
    const childCount = Math.max(0, Math.round(context.children || 0));
    const fallbackQuantity = Number.isFinite(addon.defaultQty) && addon.defaultQty > 0 ? addon.defaultQty : 1;

    let quantity = 1;
    let guestsUsed = guestCount;
    switch (addon.chargeUnit) {
      case CHARGE_UNIT.PER_PERSON: {
        const computed = guestCount > 0 ? guestCount : Number.isFinite(defaults.guests) ? defaults.guests : 0;
        quantity = Math.max(0, computed || 0);
        guestsUsed = quantity;
        break;
      }
      case CHARGE_UNIT.PER_CHILD: {
      const computed = childCount > 0
        ? childCount
        : Number.isFinite(defaults.children)
        ? defaults.children
        : Number.isFinite(defaults.guests)
        ? defaults.guests
        : 0;
      quantity = Math.max(0, computed || 0);
      guestsUsed = quantity;
      break;
    }
      case CHARGE_UNIT.PER_HOUR: {
        const computed = Number.isFinite(defaults.hours) && defaults.hours > 0 ? defaults.hours : fallbackQuantity;
        quantity = computed;
        break;
      }
      case CHARGE_UNIT.PER_UNIT: {
        const computed = Number.isFinite(defaults.quantity) && defaults.quantity > 0 ? defaults.quantity : fallbackQuantity;
        quantity = computed;
        break;
      }
      case CHARGE_UNIT.PER_SQM: {
        const computed = Number.isFinite(defaults.sqm) && defaults.sqm > 0 ? defaults.sqm : fallbackQuantity;
        quantity = computed;
        break;
      }
      case CHARGE_UNIT.PER_EVENT:
      default: {
        const computed = Number.isFinite(defaults.quantity) && defaults.quantity > 0 ? defaults.quantity : fallbackQuantity;
        quantity = computed;
        break;
      }
    }

    const total = basePrice * (quantity || 0);
    const basis = addon.chargeUnit === CHARGE_UNIT.PER_PERSON ? BASIS.PER_GUEST : BASIS.FLAT;

    return {
      unitPrice: basePrice,
      quantity,
      total,
      basis,
      guestsUsed,
      chargeUnit: addon.chargeUnit || CHARGE_UNIT.PER_EVENT,
    };
  }

  function resolveTier(tiers, guests) {
    if (!Array.isArray(tiers) || !tiers.length) {
      return null;
    }
    const sorted = tiers.slice().sort((a, b) => (a.minGuests || 0) - (b.minGuests || 0));
    const match = sorted.find((tier) => {
      const min = Number.isFinite(tier.minGuests) ? tier.minGuests : 0;
      const max = Number.isFinite(tier.maxGuests) ? tier.maxGuests : Infinity;
      return guests >= min && guests <= max;
    });
    return match || sorted[sorted.length - 1];
  }

  function findSheet(workbook, names) {
    return names
      .map((name) => workbook.Sheets[name])
      .find((sheet) => sheet);
  }

  function findPricingForKeys(map, keys) {
    if (!map || !keys?.size) {
      return null;
    }
    for (const key of keys) {
      if (!key) continue;
      const entry = map.get(key);
      if (entry) {
        return entry;
      }
    }
    return null;
  }

  function matchesKey(pkg, key) {
    const normalized = normaliseKey(key);
    return [
      pkg.id,
      pkg.name,
      pkg.group,
      pkg.venueId,
      pkg.source?.PackageID,
      pkg.source?.['Package Id'],
      pkg.source?.Code,
      pkg.source?.SKU,
      pkg.source?.Slug,
      pkg.source?.VenueID,
      pkg.source?.['Venue Id'],
      pkg.source?.Venue,
      pkg.source?.['Venue Name'],
      pkg.source?.VenueCode,
      pkg.source?.['Venue Code'],
      pkg.source?.['Quote Option'],
      pkg.source?.QuoteOption,
      pkg.source?.Item,
      pkg.source?.['Item Name'],
      pkg.venueId && pkg.id ? `${pkg.venueId}:${pkg.id}` : null,
      pkg.source?.VenueID && pkg.id ? `${pkg.source.VenueID}:${pkg.id}` : null,
      pkg.source?.['Venue Id'] && pkg.id ? `${pkg.source['Venue Id']}:${pkg.id}` : null,
      pkg.source?.Venue && pkg.source?.Package ? `${pkg.source.Venue}:${pkg.source.Package}` : null,
      pkg.group && pkg.source?.Package ? `${pkg.group}:${pkg.source.Package}` : null,
      pkg.group && pkg.name ? `${pkg.group}:${pkg.name}` : null,
    ]
      .filter(Boolean)
      .some((value) => normaliseKey(value) === normalized);
  }

  function hasGuestValue(value) {
    return Number.isFinite(extractGuestValue(value));
  }

  function extractGuestValue(value) {
    if (Number.isFinite(value)) {
      return value;
    }
    if (!value) {
      return NaN;
    }
    const match = String(value)
      .replace(/[,\s]/g, '')
      .match(/(-?\d+(?:\.\d+)?)/);
    if (!match) {
      return NaN;
    }
    return Number(match[1]);
  }

  function parseChargeType(value, fallback) {
    if (typeof value === 'string') {
      const normalised = value.trim().toLowerCase();
      if (/guest|person|per guest|per-person|per person|pp/.test(normalised)) {
        return BASIS.PER_GUEST;
      }
      if (/flat|package|total|event|once|fixed/.test(normalised)) {
        return BASIS.FLAT;
      }
    }
    if (typeof fallback === 'boolean') {
      return fallback ? BASIS.PER_GUEST : BASIS.FLAT;
    }
    if (typeof fallback === 'number') {
      return fallback === 1 ? BASIS.PER_GUEST : BASIS.FLAT;
    }
    return null;
  }

  function pickFirst(row, keys) {
    if (!row) return null;
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(row, key) && row[key] !== null && row[key] !== undefined && row[key] !== '') {
        return row[key];
      }
    }
    return null;
  }

  function toNumber(value) {
    if (value === null || value === undefined || value === '') {
      return NaN;
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : NaN;
    }
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    const stringValue = String(value).trim();
    if (!stringValue) {
      return NaN;
    }
    const cleaned = stringValue
      .replace(/[^0-9,.-]/g, '')
      .replace(/,(?=\d{3}(\D|$))/g, '')
      .replace(/,/g, '.');
    const number = Number(cleaned);
    return Number.isFinite(number) ? number : NaN;
  }

  function normaliseKey(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  function normalizeId(value) {
    return String(value || '')
      .trim()
      .toUpperCase();
  }

  function normaliseTierId(value) {
    if (!value && value !== 0) {
      return '';
    }
    const cleaned = String(value)
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    if (!cleaned) {
      return '';
    }
    return cleaned.replace(/(\d)[A-Z]+$/, '$1');
  }

  function buildPricingKey(venueId, packageId, tierId) {
    return `${normalizeId(venueId)}|${normalizeId(packageId)}|${normaliseTierId(tierId)}`;
  }

  function buildAddonOverrideKey(venueId, addOnId) {
    return `${normalizeId(venueId)}|${normalizeId(addOnId)}`;
  }

  function normaliseChargeUnit(value) {
    if (!value && value !== 0) {
      return CHARGE_UNIT.PER_EVENT;
    }
    const normalised = String(value).trim().toLowerCase();
    if (/child/.test(normalised)) {
      return CHARGE_UNIT.PER_CHILD;
    }
    if (/person|guest|pax/.test(normalised)) {
      return CHARGE_UNIT.PER_PERSON;
    }
    if (/hour/.test(normalised)) {
      return CHARGE_UNIT.PER_HOUR;
    }
    if (/unit|pieza|piece/.test(normalised)) {
      return CHARGE_UNIT.PER_UNIT;
    }
    if (/sqm|m2|square/.test(normalised)) {
      return CHARGE_UNIT.PER_SQM;
    }
    if (/event|flat|once/.test(normalised)) {
      return CHARGE_UNIT.PER_EVENT;
    }
    return CHARGE_UNIT.PER_EVENT;
  }

  function sanitizeQuantity(value) {
    if (!Number.isFinite(value)) {
      return null;
    }
    return value >= 0 ? value : null;
  }

  function parseExcelDate(value) {
    if (!value && value !== 0) {
      return null;
    }
    if (value instanceof Date && !Number.isNaN(value.valueOf())) {
      return value;
    }
    if (typeof value === 'number' && XLSX && XLSX.SSF && typeof XLSX.SSF.parse_date_code === 'function') {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (parsed) {
        return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
      }
    }
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? null : date;
  }

  function normalisePercentage(value) {
    if (!Number.isFinite(value)) {
      return null;
    }
    if (value > 1.5) {
      return value / 100;
    }
    return value;
  }

  async function ensureQuoteBackgroundSvgText() {
    if (assetCache.backgroundSvgText) {
      return assetCache.backgroundSvgText;
    }
    if (assetCache.backgroundSvgPromise) {
      return assetCache.backgroundSvgPromise;
    }
    const storedSvg = storage.get(STORAGE_KEYS.QUOTE_BACKGROUND_SVG);
    if (storedSvg) {
      assetCache.backgroundSvgText = storedSvg;
      return storedSvg;
    }
    if (typeof fetch !== 'function') {
      return '';
    }

    const promise = (async () => {
      try {
        const response = await fetch(QUOTE_EXPORT_BACKGROUND_PATH);
        if (!response.ok) {
          throw new Error(`Quote background request failed with status ${response.status}`);
        }
        const text = await response.text();
        const customOverride = storage.get(STORAGE_KEYS.QUOTE_BACKGROUND_SVG);
        if (customOverride) {
          assetCache.backgroundSvgText = customOverride;
          return customOverride;
        }
        assetCache.backgroundSvgText = text;
        return text;
      } catch (error) {
        console.error('Quote background fetch failed', error);
        return '';
      } finally {
        assetCache.backgroundSvgPromise = null;
      }
    })();

    assetCache.backgroundSvgPromise = promise;
    return promise;
  }

  async function ensureQuoteBackgroundPngDataUrl() {
    if (assetCache.backgroundPngDataUrl) {
      return assetCache.backgroundPngDataUrl;
    }
    if (assetCache.backgroundPngPromise) {
      return assetCache.backgroundPngPromise;
    }

    const storedPng = storage.get(STORAGE_KEYS.QUOTE_BACKGROUND_PNG);
    if (storedPng) {
      assetCache.backgroundPngDataUrl = storedPng;
      return storedPng;
    }

    const promise = (async () => {
      const svgText = await ensureQuoteBackgroundSvgText();
      if (!svgText) {
        return '';
      }
      try {
        const pngUrl = await svgTextToPngDataUrl(svgText);
        assetCache.backgroundPngDataUrl = pngUrl;
        return pngUrl;
      } catch (error) {
        console.error('Quote background conversion failed', error);
        return '';
      } finally {
        assetCache.backgroundPngPromise = null;
      }
    })();

    assetCache.backgroundPngPromise = promise;
    return promise;
  }

  function svgTextToPngDataUrl(svgText) {
    let blob;
    try {
      blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    } catch (error) {
      return Promise.reject(error instanceof Error ? error : new Error('Unable to prepare SVG background.'));
    }

    const strategyList = [];
    const canUseBitmap = typeof createImageBitmap === 'function';
    if (canUseBitmap) {
      strategyList.push('bitmap');
    }
    if (IS_SAFARI) {
      strategyList.push('data-url', 'object-url', 'file-reader');
    } else {
      strategyList.push('object-url', 'file-reader', 'data-url');
    }
    const strategies = strategyList.length ? strategyList : ['object-url', 'file-reader', 'data-url'];

    const attempt = (index, lastError) => {
      if (index >= strategies.length) {
        return Promise.reject(lastError instanceof Error ? lastError : new Error('Unable to convert SVG background to PNG.'));
      }
      const mode = strategies[index];
      return renderSvgBlobToPng(blob, svgText, mode).catch((error) => {
        console.warn(`SVG to PNG conversion via ${mode} failed.`, error);
        const nextError = error instanceof Error ? error : lastError;
        return attempt(index + 1, nextError || error);
      });
    };

    return attempt(0, null);
  }

  function renderSvgBlobToPng(blob, svgText, mode) {
    if (mode === 'bitmap') {
      return rasterizeSvgBlobWithBitmap(blob, svgText);
    }
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.crossOrigin = 'anonymous';

      let revoke = () => {};
      let aborted = false;

      const cleanup = () => {
        if (!aborted) {
          revoke();
          aborted = true;
        }
        image.onload = null;
        image.onerror = null;
      };

      image.onload = () => {
        try {
          let width = Math.max(1, Number(image.naturalWidth) || Number(image.width) || 0);
          let height = Math.max(1, Number(image.naturalHeight) || Number(image.height) || 0);
          if (!width || !height) {
            const fallbackSize = extractSvgDimensions(svgText);
            width = fallbackSize.width;
            height = fallbackSize.height;
          }
          if (!width || !height) {
            width = 1240;
            height = 1754;
          }
          ({ width, height } = normaliseCanvasSize(width, height));
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext('2d');
          if (!context) {
            throw new Error('Canvas is unavailable for SVG conversion.');
          }
          context.clearRect(0, 0, width, height);
          context.fillStyle = '#ffffff';
          context.globalAlpha = 1;
          context.fillRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
          canvasToPngDataUrl(canvas)
            .then((dataUrl) => {
              cleanup();
              resolve(dataUrl);
            })
            .catch((error) => {
              cleanup();
              reject(error instanceof Error ? error : new Error('Unable to rasterize SVG background.'));
            });
        } catch (error) {
          cleanup();
          reject(error instanceof Error ? error : new Error('Unable to rasterize SVG background.'));
        }
      };

      image.onerror = (event) => {
        cleanup();
        if (typeof ErrorEvent !== 'undefined' && event instanceof ErrorEvent && event.error instanceof Error) {
          reject(event.error);
        } else {
          reject(new Error('Unable to load SVG background.'));
        }
      };

      try {
        if (mode === 'object-url') {
          const objectUrl = URL.createObjectURL(blob);
          revoke = () => {
            URL.revokeObjectURL(objectUrl);
          };
          image.src = objectUrl;
        } else if (mode === 'file-reader') {
          const reader = new FileReader();
          revoke = () => {};
          reader.onload = () => {
            const result = typeof reader.result === 'string' ? reader.result : '';
            if (!result) {
              cleanup();
              reject(new Error('Unable to read SVG background.'));
              return;
            }
            image.src = result;
          };
          reader.onerror = () => {
            cleanup();
            reject(new Error('Unable to read SVG background.'));
          };
          reader.readAsDataURL(blob);
        } else {
          revoke = () => {};
          const dataUrl = buildSvgDataUrl(svgText);
          if (!dataUrl) {
            cleanup();
            reject(new Error('Unable to prepare SVG conversion.'));
            return;
          }
          image.src = dataUrl;
        }
      } catch (error) {
        cleanup();
        reject(error instanceof Error ? error : new Error('Unable to prepare SVG conversion.'));
      }
    });
  }

  function buildSvgDataUrl(svgText) {
    if (!svgText) {
      return '';
    }
    try {
      if (typeof btoa === 'function') {
        const normalized = svgText.replace(/\r\n?/g, '\n');
        const base64 = btoa(unescape(encodeURIComponent(normalized)));
        if (base64) {
          return `data:image/svg+xml;base64,${base64}`;
        }
      }
    } catch (error) {
      console.warn('Base64 encoding for SVG data URL failed. Falling back to URL encoding.', error);
    }
    return `data:image/svg+xml;charset=utf-8,${encodeSvgForDataUrl(svgText)}`;
  }

  function encodeSvgForDataUrl(svgText) {
    return encodeURIComponent(svgText)
      .replace(/%0A/gi, '')
      .replace(/%0D/gi, '')
      .replace(/%20/g, ' ')
      .replace(/%3D/g, '=')
      .replace(/%3A/g, ':')
      .replace(/%2F/g, '/')
      .replace(/%22/g, "'");
  }

  async function rasterizeSvgBlobWithBitmap(blob, svgText) {
    if (typeof createImageBitmap !== 'function') {
      throw new Error('Bitmap conversion is unavailable.');
    }

    const bitmap = await createImageBitmap(blob);
    try {
      let width = Math.max(1, Number(bitmap.width) || 0);
      let height = Math.max(1, Number(bitmap.height) || 0);
      if (!width || !height) {
        const fallbackSize = extractSvgDimensions(svgText);
        width = fallbackSize.width;
        height = fallbackSize.height;
      }
      if (!width || !height) {
        width = 1240;
        height = 1754;
      }

      ({ width, height } = normaliseCanvasSize(width, height));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Canvas is unavailable for SVG conversion.');
      }
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#ffffff';
      context.globalAlpha = 1;
      context.fillRect(0, 0, width, height);
      context.drawImage(bitmap, 0, 0, width, height);
      const dataUrl = await canvasToPngDataUrl(canvas);
      if (!dataUrl) {
        throw new Error('Unable to serialise SVG background.');
      }
      return dataUrl;
    } finally {
      if (bitmap && typeof bitmap.close === 'function') {
        bitmap.close();
      }
    }
  }

  async function canvasToPngDataUrl(canvas) {
    let dataUrl = '';
    try {
      dataUrl = canvas.toDataURL('image/png');
    } catch (error) {
      console.warn('Canvas toDataURL failed. Falling back to toBlob.', error);
    }

    if (dataUrl && dataUrl !== 'data:,' && dataUrl.startsWith('data:image/png')) {
      return dataUrl;
    }

    if (typeof canvas.toBlob === 'function') {
      try {
        const blob = await new Promise((resolve, reject) => {
          canvas.toBlob((value) => {
            if (value) {
              resolve(value);
            } else {
              reject(new Error('Canvas toBlob returned empty data.'));
            }
          }, 'image/png');
        });
        return await blobToDataUrl(blob);
      } catch (error) {
        console.warn('Canvas toBlob fallback failed.', error);
      }
    }

    if (!dataUrl || dataUrl === 'data:,') {
      throw new Error('Unable to serialise canvas to PNG.');
    }

    return dataUrl;
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string' && reader.result.startsWith('data:')) {
            resolve(reader.result);
          } else {
            reject(new Error('Unable to convert blob to data URL.'));
          }
        };
        reader.onerror = () => {
          reject(new Error('Unable to read canvas blob.'));
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Unable to process canvas blob.'));
      }
    });
  }

  function normaliseCanvasSize(width, height) {
    let w = Math.max(1, Number(width) || 0);
    let h = Math.max(1, Number(height) || 0);
    if (!w || !h) {
      return { width: 1240, height: 1754 };
    }
    const area = w * h;
    if (Number.isFinite(area) && area > SVG_CANVAS_MAX_PIXELS) {
      const scale = Math.sqrt(SVG_CANVAS_MAX_PIXELS / area);
      if (Number.isFinite(scale) && scale > 0 && scale < 1) {
        w = Math.max(1, Math.round(w * scale));
        h = Math.max(1, Math.round(h * scale));
      }
    }
    return { width: w, height: h };
  }

  function extractSvgDimensions(svgText) {
    const fallback = { width: 1240, height: 1754 };
    if (!svgText) {
      return fallback;
    }
    try {
      const match = String(svgText).match(/<svg[^>]*>/i);
      if (!match) {
        return fallback;
      }
      const tag = match[0];
      const widthMatch = tag.match(/\bwidth\s*=\s*"([^"]+)"/i) || tag.match(/\bwidth\s*=\s*'([^']+)'/i);
      const heightMatch = tag.match(/\bheight\s*=\s*"([^"]+)"/i) || tag.match(/\bheight\s*=\s*'([^']+)'/i);
      const viewBoxMatch = tag.match(/\bviewBox\s*=\s*"([^"]+)"/i) || tag.match(/\bviewBox\s*=\s*'([^']+)'/i);

      let width = widthMatch ? parseSvgLength(widthMatch[1], 0) : 0;
      let height = heightMatch ? parseSvgLength(heightMatch[1], 0) : 0;

      if ((!width || !height) && viewBoxMatch) {
        const parts = viewBoxMatch[1].trim().split(/[\s,]+/).map(Number).filter((value) => Number.isFinite(value));
        if (parts.length === 4) {
          const [, , vbWidth, vbHeight] = parts;
          if (!width && Number.isFinite(vbWidth)) {
            width = vbWidth;
          }
          if (!height && Number.isFinite(vbHeight)) {
            height = vbHeight;
          }
        }
      }

      return {
        width: Math.max(1, width || fallback.width),
        height: Math.max(1, height || fallback.height),
      };
    } catch (error) {
      console.warn('Failed to derive SVG dimensions.', error);
      return fallback;
    }
  }

  function parseSvgLength(value, fallback) {
    if (!value && value !== 0) {
      return fallback;
    }
    const trimmed = String(value).trim();
    if (!trimmed) {
      return fallback;
    }
    const number = Number.parseFloat(trimmed.replace(',', '.'));
    if (!Number.isFinite(number)) {
      return fallback;
    }
    if (/mm$/i.test(trimmed)) {
      return number * (96 / 25.4);
    }
    if (/cm$/i.test(trimmed)) {
      return number * (96 / 2.54);
    }
    if (/in$/i.test(trimmed)) {
      return number * 96;
    }
    if (/pt$/i.test(trimmed)) {
      return number * (96 / 72);
    }
    if (/pc$/i.test(trimmed)) {
      return number * 16;
    }
    return number;
  }

  function dataUrlToUint8Array(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string') {
      return new Uint8Array();
    }
    const commaIndex = dataUrl.indexOf(',');
    if (commaIndex === -1) {
      return new Uint8Array();
    }
    const base64 = dataUrl.slice(commaIndex + 1);
    try {
      const binary = typeof atob === 'function'
        ? atob(base64)
        : typeof window !== 'undefined' && typeof window.atob === 'function'
          ? window.atob(base64)
          : '';
      if (!binary) {
        return new Uint8Array();
      }
      const length = binary.length;
      const bytes = new Uint8Array(length);
      for (let index = 0; index < length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      return bytes;
    } catch (error) {
      console.error('Failed to decode data URL', error);
      return new Uint8Array();
    }
  }

  function buildQuoteExportTableData() {
    const quote = state.currentQuote;
    if (!quote) {
      return null;
    }
    const rawLines = Array.isArray(quote.quoteLines) ? quote.quoteLines : [];
    if (!rawLines.length) {
      return null;
    }

    const rows = rawLines.map((line) => {
      const quantity = Number.isFinite(Number(line.quantity)) ? Number(line.quantity) : 1;
      const unitPrice = Number.isFinite(Number(line.unitPrice)) ? Number(line.unitPrice) : 0;
      const total = Number.isFinite(Number(line.total)) ? Number(line.total) : unitPrice * quantity;
      return {
        type: line.type || 'line',
        id: line.id || '',
        name: line.name || '—',
        details: line.details || '—',
        quantity,
        quantityLabel: Number.isFinite(quantity) ? quantity.toLocaleString() : '1',
        unitPrice,
        unitLabel: formatCurrency(unitPrice),
        total,
        totalLabel: formatCurrency(total),
      };
    });

    const totalValue = Number.isFinite(Number(quote.total))
      ? Number(quote.total)
      : rows.reduce((sum, row) => sum + row.total, 0);

    return {
      quote,
      rows,
      total: totalValue,
      totalLabel: formatCurrency(totalValue),
      metadata: buildQuoteExportMetadata(quote),
    };
  }

  function buildQuoteExportMetadata(quote) {
    const metadata = [];
    metadata.push({ label: 'Venue', value: quote.venueName || '—' });
    metadata.push({ label: 'Package', value: quote.packageName || '—' });

    const guestParts = [];
    if (Number.isFinite(Number(quote.guests)) && Number(quote.guests) > 0) {
      guestParts.push(`${Number(quote.guests).toLocaleString()} guests`);
    }
    if (Number.isFinite(Number(quote.children)) && Number(quote.children) > 0) {
      guestParts.push(`${Number(quote.children).toLocaleString()} children`);
    }
    metadata.push({ label: 'Guests', value: guestParts.length ? guestParts.join(' + ') : '—' });

    metadata.push({
      label: 'Event date',
      value: formatQuoteExportDateForDocument(quote.eventDate || quote.eventDateInput),
    });

    metadata.push({ label: 'Status', value: 'Pending confirmation' });

    return metadata;
  }

  function formatQuoteExportDateForDocument(value) {
    if (value instanceof Date && !Number.isNaN(value.valueOf())) {
      return value.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    if (typeof value === 'string' && value) {
      const parsed = parseDateInputValue(value);
      if (parsed) {
        return parsed.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
    }
    return 'Pending';
  }

  function formatCurrency(value) {
    let numeric;
    if (typeof value === 'number') {
      numeric = Number.isFinite(value) ? value : NaN;
    } else if (typeof value === 'string') {
      numeric = toNumber(value);
    } else if (typeof value === 'bigint') {
      numeric = Number(value);
    } else {
      numeric = Number(value);
    }

    if (!Number.isFinite(numeric)) {
      numeric = 0;
    }

    const [integerPartRaw, decimalPart = '00'] = numeric.toFixed(2).split('.');
    const isNegative = integerPartRaw.startsWith('-');
    const absoluteInteger = isNegative ? integerPartRaw.slice(1) : integerPartRaw;
    const groupedInteger = absoluteInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const prefix = isNegative ? '-' : '';
    return `${prefix}${groupedInteger},${decimalPart}`;
  }

  function announceStatus(message, tone) {
    const status = state.refs?.status;
    if (!status) return;
    status.textContent = message || '';
    status.classList.remove('is-error', 'is-success');
    if (!message) return;
    if (tone === 'error') {
      status.classList.add('is-error');
    } else if (tone === 'success') {
      status.classList.add('is-success');
    }
  }

  function clone(item) {
    if (typeof structuredClone === 'function') {
      return structuredClone(item);
    }
    return JSON.parse(JSON.stringify(item));
  }

  function buildQuoteLineKey(type, id, name) {
    const typeKey = (type ? String(type) : 'line').trim().toLowerCase() || 'line';
    const normalizedId = id ? normalizeId(id) : '';
    if (normalizedId) {
      return `${typeKey}:${normalizedId}`;
    }
    const slugSource = name ? String(name).toLowerCase() : '';
    const slug = slugSource
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
    return `${typeKey}:${slug || 'auto'}`;
  }

  function buildQuoteKey(quote) {
    if (!quote) {
      return '';
    }
    const venueKey = quote.venueId ? normalizeId(quote.venueId) : '';
    const packageKey = quote.packageId ? normalizeId(quote.packageId) : '';
    const guestKey = Number.isFinite(quote.guests) ? Math.max(0, Math.round(quote.guests)) : 0;
    const childKey = Number.isFinite(quote.children) ? Math.max(0, Math.round(quote.children)) : 0;
    const dateKey = quote.eventDateInput || toInputDateString(quote.eventDate) || '';
    return [venueKey, packageKey, guestKey, childKey, dateKey].join('|');
  }
})();