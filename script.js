(() => {
  const form = document.querySelector('#booking-form');
  const confirmation = document.querySelector('#booking-confirmation');
  const dateField = document.querySelector('#walk-date');
  document.querySelector('#year').textContent = new Date().getFullYear();

  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateField.min = localToday;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    confirmation.hidden = true;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const request = {
      id: 'HTW-' + Date.now(),
      ownerName: String(data.get('ownerName')).trim(),
      phone: String(data.get('phone')).trim(),
      dogName: String(data.get('dogName')).trim(),
      duration: String(data.get('duration')),
      date: String(data.get('date')),
      time: String(data.get('time')),
      notes: String(data.get('notes')).trim(),
      payment: 'Cash, Zelle, or Cash App (in person)',
      createdAt: new Date().toISOString(),
    };

    try {
      const saved = JSON.parse(localStorage.getItem('happyTailsWalkRequests') || '[]');
      saved.push(request);
      localStorage.setItem('happyTailsWalkRequests', JSON.stringify(saved));
    } catch (error) {
      // The on-page confirmation still works if browser storage is unavailable.
    }

    const friendlyDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    }).format(new Date(request.date + 'T12:00:00'));

    confirmation.innerHTML = '<strong>Thanks, ' + escapeHtml(request.ownerName) + '!</strong>' +
      '<p>Your request for <b>' + escapeHtml(request.dogName) + '</b> is ready: ' +
      escapeHtml(request.duration.toLowerCase()) + ' on ' + escapeHtml(friendlyDate) + ', ' +
      escapeHtml(request.time.toLowerCase()) + '.</p>' +
      '<p class="local-note">Request ' + escapeHtml(request.id) +
      ' · This is a request, not a confirmed appointment. It is saved in this browser only and has not been sent to the walker. Please contact Happy Tails directly to confirm availability.</p>';
    confirmation.hidden = false;
    confirmation.focus();
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    form.querySelector('.submit-button').textContent = 'Request saved ✓';
  });

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]);
  }
})();
