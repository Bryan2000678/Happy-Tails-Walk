(() => {
  const form = document.querySelector('#booking-form');
  const confirmation = document.querySelector('#booking-confirmation');
  const dateField = document.querySelector('#walk-date');
  document.querySelector('#year').textContent = new Date().getFullYear();

  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateField.min = localToday;
  form.querySelector('[name="notes"]').maxLength = 500;

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
    };

    const friendlyDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    }).format(new Date(request.date + 'T12:00:00'));
    const emailBody = [
      'Happy Tails Walk request',
      'Request: ' + request.id,
      'Customer: ' + request.ownerName,
      'Phone: ' + request.phone,
      'Dog: ' + request.dogName,
      'Walk: ' + request.duration,
      'Preferred date: ' + friendlyDate,
      'Preferred time: ' + request.time,
      'Payment: ' + request.payment,
      'Notes: ' + (request.notes || 'None'),
      '',
      'Please confirm availability with the customer.',
    ].join(String.fromCharCode(10));
    const emailUrl = 'mailto:bryanbienaime.23@gmail.com?subject=' +
      encodeURIComponent('Happy Tails walk request - ' + request.dogName) +
      '&body=' + encodeURIComponent(emailBody);

    confirmation.innerHTML = '<strong>Thanks, ' + escapeHtml(request.ownerName) + '!</strong>' +
      '<p>Your request for <b>' + escapeHtml(request.dogName) + '</b> is ready: ' +
      escapeHtml(request.duration.toLowerCase()) + ' on ' + escapeHtml(friendlyDate) + ', ' +
      escapeHtml(request.time.toLowerCase()) + '.</p>' +
      '<a class="button button-dark email-request" href="' + escapeHtml(emailUrl) + '">Open email draft <span aria-hidden="true">↗</span></a>' +
      '<p class="local-note">Press Send in your email app to deliver the request. This is not a confirmed appointment; Happy Tails must confirm availability.</p>';
    confirmation.hidden = false;
    confirmation.focus();
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    form.querySelector('.submit-button').textContent = 'Request ready ✓';
  });

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]);
  }
})();
