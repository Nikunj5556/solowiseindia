window.MetaTracking = (() => {
  const SUPABASE_URL = 'https://iqjdqtdzpdhuicfheybi.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxamRxdGR6cGRodWljZmhleWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NDcxNjksImV4cCI6MjEwNDUyMzE2OX0.NL6txgwRDmqSf7w6oqsTrKyW_OfyOn4vS_tyZF_kY1A';

  const EXTERNAL_ID_KEY = 'solowise_meta_external_id';
  const EVENT_PREFIX = 'solowise_meta_event_';

  function uuid() {
    return crypto.randomUUID();
  }

  function getOrCreateExternalId() {
    let value = localStorage.getItem(EXTERNAL_ID_KEY);

    if (!value) {
      value = uuid();
      localStorage.setItem(EXTERNAL_ID_KEY, value);
    }

    return value;
  }

  function getOrCreateEventId(eventKey) {
    const storageKey = `${EVENT_PREFIX}${eventKey}`;
    let value = sessionStorage.getItem(storageKey);

    if (!value) {
      value = uuid();
      sessionStorage.setItem(storageKey, value);
    }

    return value;
  }

  function getCookie(name) {
    const escaped = name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&');
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${escaped}=([^;]*)`)
    );

    return match ? decodeURIComponent(match[1]) : null;
  }

  function getFbclid() {
    return new URLSearchParams(window.location.search).get('fbclid');
  }

  function getFbp() {
    return getCookie('_fbp');
  }

  function getFbc() {
    const existing = getCookie('_fbc');

    if (existing) return existing;

    const fbclid = getFbclid();
    if (!fbclid) return null;

    return `fb.1.${Date.now()}.${fbclid}`;
  }

  function getAttribution() {
    const params = new URLSearchParams(window.location.search);

    return {
      landing_page_url: localStorage.getItem('solowise_landing_page_url') || window.location.href,
      event_source_url: window.location.href,
      referrer_url: document.referrer || null,
      fbp: getFbp(),
      fbc: getFbc(),
      external_id: getOrCreateExternalId(),
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
      fbclid: getFbclid()
    };
  }

  function captureLandingPage() {
    if (!localStorage.getItem('solowise_landing_page_url')) {
      localStorage.setItem('solowise_landing_page_url', window.location.href);
    }
  }

  function normalizeCurrency(value) {
    return String(value || 'INR').toUpperCase();
  }

  function browserTrack(eventName, eventId, customData = {}) {
    if (typeof window.fbq !== 'function') return;

    window.fbq(
      'track',
      eventName,
      customData,
      {
        eventID: eventId,
        event_id: eventId
      }
    );
  }

  async function serverTrack(payload) {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/meta-track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        ...payload,
        attribution: getAttribution()
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`meta-track failed: ${response.status} ${text}`);
    }

    return response.json();
  }

  function productCustomData(product) {
    return {
      content_ids: [String(product.id)],
      content_type: 'product',
      content_name: product.name,
      value: Number(product.value),
      currency: normalizeCurrency(product.currency)
    };
  }

  function checkoutCustomData(order) {
    return {
      content_ids: [String(order.product_id)],
      content_type: 'product',
      content_name: order.product_name,
      value: Number(order.total_amount),
      currency: normalizeCurrency(order.currency),
      num_items: 1
    };
  }

  captureLandingPage();

  return {
    uuid,
    getOrCreateExternalId,
    getOrCreateEventId,
    getAttribution,
    browserTrack,
    serverTrack,
    productCustomData,
    checkoutCustomData
  };
})();
