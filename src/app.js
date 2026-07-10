(function () {
  'use strict';

  var translations = {
    en: {
      eyebrow: 'Product updates',
      title: 'What’s new in GroupWire',
      intro: 'Follow every improvement, new capability, and important fix released to GroupWire.',
      currentVersion: 'Current version',
      historyEyebrow: 'Release history',
      historyTitle: 'Latest changes',
      loading: 'Loading release notes…',
      error: 'Release notes are temporarily unavailable.',
      footer: 'Clear updates. Better publishing.',
      switchLabel: 'Switch to Hebrew',
      switchText: 'עברית',
      pageTitle: 'GroupWire — Release notes',
    },
    he: {
      eyebrow: 'עדכוני מוצר',
      title: 'מה חדש ב-GroupWire',
      intro: 'כל השיפורים, היכולות החדשות והתיקונים החשובים שפורסמו ב-GroupWire.',
      currentVersion: 'גרסה נוכחית',
      historyEyebrow: 'היסטוריית גרסאות',
      historyTitle: 'השינויים האחרונים',
      loading: 'יומן השינויים נטען…',
      error: 'יומן השינויים אינו זמין כרגע.',
      footer: 'עדכונים ברורים. פרסום טוב יותר.',
      switchLabel: 'מעבר לאנגלית',
      switchText: 'English',
      pageTitle: 'GroupWire — יומן גרסאות',
    },
  };

  var languageButton = document.getElementById('language-switch');
  var releaseList = document.getElementById('release-list');
  var errorMessage = document.getElementById('release-error');
  var currentVersion = document.getElementById('current-version');
  var releaseData = null;
  var language = getInitialLanguage();

  function getInitialLanguage() {
    try {
      var saved = window.localStorage.getItem('groupwire_release_language');
      if (saved === 'en' || saved === 'he') return saved;
    } catch (error) {
      // The browser may block local storage; language switching still works.
    }
    return navigator.language && navigator.language.toLowerCase().startsWith('he') ? 'he' : 'en';
  }

  function saveLanguage() {
    try {
      window.localStorage.setItem('groupwire_release_language', language);
    } catch (error) {
      // Ignore unavailable storage.
    }
  }

  function applyLanguage() {
    var copy = translations[language];
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.title = copy.pageTitle;

    document.querySelectorAll('[data-copy]').forEach(function (element) {
      var key = element.getAttribute('data-copy');
      if (copy[key]) element.textContent = copy[key];
    });

    languageButton.textContent = copy.switchText;
    languageButton.setAttribute('aria-label', copy.switchLabel);
    if (releaseData) renderReleases();
  }

  function renderReleases() {
    currentVersion.textContent = 'v' + releaseData.currentVersion;
    releaseList.replaceChildren();

    releaseData.releases.forEach(function (release) {
      var article = document.createElement('article');
      article.className = 'release';

      var heading = document.createElement('div');
      heading.className = 'release-heading';

      var title = document.createElement('h3');
      title.textContent = 'v' + release.version;

      var date = document.createElement('time');
      date.dateTime = release.date;
      date.textContent = new Intl.DateTimeFormat(language === 'he' ? 'he-IL' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(release.date + 'T00:00:00Z'));

      var list = document.createElement('ul');
      (release.changes[language] || release.changes.en).forEach(function (change) {
        var item = document.createElement('li');
        item.textContent = change;
        list.appendChild(item);
      });

      heading.append(title, date);
      article.append(heading, list);
      releaseList.appendChild(article);
    });
  }

  function showLoadError() {
    releaseList.hidden = true;
    errorMessage.hidden = false;
  }

  languageButton.addEventListener('click', function () {
    language = language === 'en' ? 'he' : 'en';
    saveLanguage();
    applyLanguage();
  });

  document.getElementById('year').textContent = String(new Date().getFullYear());
  applyLanguage();

  fetch('/data/releases.json', { headers: { Accept: 'application/json' } })
    .then(function (response) {
      if (!response.ok) throw new Error('Release data request failed');
      return response.json();
    })
    .then(function (data) {
      if (!data || !data.currentVersion || !Array.isArray(data.releases)) {
        throw new Error('Release data is invalid');
      }
      releaseData = data;
      renderReleases();
    })
    .catch(showLoadError);
})();
