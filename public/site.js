(function () {
  'use strict';

  var API_URL = 'https://bo.groupwire.cloud/meta/website';
  var header = document.querySelector('[data-header]');
  var menuToggle = document.querySelector('.menu-toggle');
  var navigation = document.getElementById('primary-navigation');

  function closeNavigation() {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
    document.body.classList.remove('nav-open');
  }

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', function () {
      var open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
    });

    document.querySelectorAll('.nav-group > button').forEach(function (button) {
      button.addEventListener('click', function () {
        var open = button.getAttribute('aria-expanded') !== 'true';
        document.querySelectorAll('.nav-group > button').forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
        });
        button.setAttribute('aria-expanded', String(open));
      });
    });

    navigation.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNavigation);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeNavigation();
        document.querySelectorAll('.nav-group > button').forEach(function (button) {
          button.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  var lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 12);
      header.classList.toggle('header-hidden', y > lastY && y > 160 && !document.body.classList.contains('nav-open'));
    }
    lastY = y;
  }, { passive: true });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(function (element) {
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
  }

  function readFallback() {
    try {
      return JSON.parse(document.getElementById('website-fallback').textContent);
    } catch (error) {
      return null;
    }
  }

  function validWebsite(data) {
    return data && Number.isFinite(Number(data.schemaVersion)) &&
      Array.isArray(data.features) && Array.isArray(data.plans) &&
      data.legal && typeof data.legal === 'object';
  }

  function formatCurrency(cents, currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: Number(cents) % 100 === 0 ? 0 : 2,
    }).format(Number(cents) / 100);
  }

  function getPrice(plan, period) {
    var direct = plan[period + 'Price'];
    if (direct && Number.isFinite(Number(direct.amountCents))) return direct;
    if (plan.version && plan.version[period + 'Price']) return plan.version[period + 'Price'];
    return null;
  }

  function getQuota(plan, key) {
    var quotas = plan.quotas || (plan.version && plan.version.quotas) || {};
    var aliases = { users: 'maxUsers', channels: 'maxChannels', postsPerMonth: 'maxPostsPerMonth' };
    return quotas[key] ?? quotas[aliases[key]];
  }

  function normalizePlan(plan) {
    var name = typeof plan.name === 'string' ? plan.name : plan.name && plan.name.en;
    var description = typeof plan.description === 'string'
      ? plan.description
      : plan.description && plan.description.en;
    return {
      slug: plan.slug,
      name: name || plan.nameEn,
      description: description || plan.descriptionEn,
      monthlyPrice: getPrice(plan, 'monthly'),
      annualPrice: getPrice(plan, 'annual'),
      trialDays: plan.trialDays
        ?? (plan.trial && plan.trial.days)
        ?? (plan.version && plan.version.trial && plan.version.trial.days),
      quotas: plan.quotas || (plan.version && plan.version.quotas) || {},
      source: plan,
    };
  }

  function updatePricing(data) {
    var root = document.querySelector('[data-pricing-root]');
    if (!root) return;
    var plans = data.plans.filter(function (plan) { return plan.slug !== 'legacy'; }).map(normalizePlan);
    root.querySelectorAll('[data-plan]').forEach(function (card) {
      var plan = plans.find(function (candidate) { return candidate.slug === card.dataset.plan; });
      if (!plan) return;
      if (plan.name) card.querySelector('[data-plan-name]').textContent = plan.name;
      if (plan.description) card.querySelector('[data-plan-description]').textContent = plan.description;
      var price = card.querySelector('[data-plan-price]');
      if (plan.monthlyPrice) price.dataset.monthly = plan.monthlyPrice.amountCents;
      if (plan.annualPrice) price.dataset.annual = plan.annualPrice.amountCents;
      price.dataset.currency = (plan.monthlyPrice && plan.monthlyPrice.currency) || 'USD';
      card.querySelectorAll('[data-quota]').forEach(function (quota) {
        var value = getQuota(plan.source, quota.dataset.quota);
        if (Number.isFinite(Number(value))) quota.textContent = Number(value) >= 9999 ? 'Unlimited' : String(value);
      });
    });
    applyBilling(root.dataset.period || 'monthly');
  }

  function applyBilling(period) {
    var root = document.querySelector('[data-pricing-root]');
    if (!root) return;
    root.dataset.period = period;
    root.querySelectorAll('[data-billing]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.billing === period));
    });
    root.querySelectorAll('[data-plan-price]').forEach(function (price) {
      var cents = Number(price.dataset[period]);
      if (!Number.isFinite(cents)) return;
      price.textContent = formatCurrency(period === 'annual' ? cents / 12 : cents, price.dataset.currency);
      var note = price.closest('.price-card').querySelector('[data-billing-note]');
      note.textContent = period === 'annual' ? 'Per month · billed annually' : 'Billed monthly';
    });
  }

  document.querySelectorAll('[data-billing]').forEach(function (button) {
    button.addEventListener('click', function () { applyBilling(button.dataset.billing); });
  });

  function safeLegalHtml(value) {
    var html = typeof value === 'string' ? value : value && value.html;
    if (!html) return '';
    var documentFragment = new DOMParser().parseFromString(html, 'text/html');
    documentFragment.querySelectorAll('script,style,iframe,object,embed,form,link,meta').forEach(function (node) {
      node.remove();
    });
    documentFragment.body.querySelectorAll('*').forEach(function (node) {
      Array.from(node.attributes).forEach(function (attribute) {
        var name = attribute.name.toLowerCase();
        var unsafeUrl = (name === 'href' || name === 'src') && /^\s*(javascript|data):/i.test(attribute.value);
        if (name.startsWith('on') || name === 'style' || unsafeUrl) node.removeAttribute(attribute.name);
      });
      if (node.tagName === 'A') node.setAttribute('rel', 'noopener noreferrer');
    });
    return documentFragment.body.innerHTML;
  }

  function updateLegal(data) {
    document.querySelectorAll('[data-legal-document]').forEach(function (container) {
      var value = data.legal[container.dataset.legalDocument];
      var html = safeLegalHtml(value);
      if (html) {
        container.innerHTML = html;
        container.removeAttribute('aria-busy');
      }
    });
  }

  function updateFeatures(data) {
    var container = document.querySelector('[data-feature-highlights]');
    if (!container || !data.features.length) return;
    var cards = container.querySelectorAll('[data-feature-card]');
    data.features.slice(0, cards.length).forEach(function (feature, index) {
      var card = cards[index];
      if (feature.title) card.querySelector('h3').textContent = feature.title;
      if (feature.description) card.querySelector('p').textContent = feature.description;
      if (feature.href) card.setAttribute('href', feature.href);
    });
  }

  function applyWebsite(data) {
    if (!validWebsite(data)) return;
    updatePricing(data);
    updateLegal(data);
    updateFeatures(data);
    window.dispatchEvent(new CustomEvent('groupwire:website', { detail: data }));
  }

  var fallback = readFallback();
  if (fallback) applyWebsite(fallback);
  fetch(API_URL, { headers: { Accept: 'application/json' }, credentials: 'omit' })
    .then(function (response) {
      if (!response.ok) throw new Error('Website metadata request failed');
      return response.json();
    })
    .then(function (data) {
      if (!validWebsite(data)) throw new Error('Website metadata is invalid');
      applyWebsite(data);
    })
    .catch(function () {
      document.documentElement.dataset.websiteSource = 'fallback';
    });

  document.querySelectorAll('[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var status = form.querySelector('[data-form-status]');
      var button = form.querySelector('button[type="submit"]');
      var data = new FormData(form);
      if (data.get('website')) {
        status.className = 'form-status success';
        status.textContent = 'Thanks. We received your request.';
        return;
      }
      if (!form.checkValidity()) {
        form.reportValidity();
        status.className = 'form-status error';
        status.textContent = 'Please complete the required fields and check your email address.';
        return;
      }
      var fields = {};
      data.forEach(function (value, key) {
        fields[key] = String(value).trim();
      });
      fields.type = form.dataset.type;
      fields.consent = data.has('consent');
      fields.sourceUrl = window.location.href;
      button.disabled = true;
      button.dataset.label = button.textContent;
      button.textContent = 'Sending…';
      status.className = 'form-status pending';
      status.textContent = 'Securely sending your request…';

      fetch(API_URL + '/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit',
        body: JSON.stringify(fields),
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed');
          status.className = 'form-status success';
          status.textContent = 'Thanks. We received your request and will follow up with the next step.';
          form.reset();
        })
        .catch(function () {
          status.className = 'form-status error';
          status.textContent = 'We could not send your request. Please check your connection and try again.';
        })
        .finally(function () {
          button.disabled = false;
          button.textContent = button.dataset.label;
        });
    });
  });
})();
