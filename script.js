(() => {
  const form = document.querySelector('#booking-form');
  const confirmation = document.querySelector('#booking-confirmation');
  const dateField = document.querySelector('#walk-date');
  const submitButton = form.querySelector('.submit-button');
  document.querySelector('#year').textContent = new Date().getFullYear();

  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateField.min = localToday;
  form.querySelector('[name="notes"]').maxLength = 500;

  form.addEventListener('submit', async (event) => {
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
    const confirmText = 'Hi ' + request.ownerName + '! Happy Tails Walks confirms your ' + request.duration.toLowerCase() + ' walk for ' + request.dogName + ' on ' + friendlyDate + ' during ' + request.time.toLowerCase() + '. See you then!';
    const declineText = 'Hi ' + request.ownerName + ', thank you for requesting a walk for ' + request.dogName + '. Unfortunately, we are not available ' + friendlyDate + ' during ' + request.time.toLowerCase() + '. Please contact us to discuss another time. - Happy Tails Walks';
    const phoneForSms = request.phone.replace(/[^\d+]/g, '');
    const smsSeparator = /iPad|iPhone|iPod/i.test(navigator.userAgent) ? '&' : '?';
    const smsLink = (message) => 'sms:' + phoneForSms + smsSeparator + 'body=' + encodeURIComponent(message);

    const message = [
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
      'CONFIRM by text (open this link on your phone): ' + smsLink(confirmText),
      'DECLINE by text (open this link on your phone): ' + smsLink(declineText),
      '',
      'The customer has requested a walk; it is not confirmed until Happy Tails confirms it.',
    ].join(String.fromCharCode(10));

    submitButton.disabled = true;
    submitButton.textContent = 'Sending request…';

    try {
      const response = await fetch('https://formsubmit.co/ajax/bryanbienaime.23@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Happy Tails walk request - ' + request.dogName,
          name: request.ownerName,
          phone: request.phone,
          message,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false || result.success === 'false') {
        throw new Error(result.message || 'Email service response: ' + response.status);
      }

      confirmation.innerHTML = '<strong>Thanks, ' + escapeHtml(request.ownerName) + '!</strong>' +
        '<p>Your request for <b>' + escapeHtml(request.dogName) + '</b> was sent: ' +
        escapeHtml(request.duration.toLowerCase()) + ' on ' + escapeHtml(friendlyDate) + ', ' +
        escapeHtml(request.time.toLowerCase()) + '.</p>' +
        '<p class="local-note">This is a request, not a confirmed appointment. Happy Tails will contact you to confirm availability.</p>';
      form.reset();
      confirmation.hidden = false;
      confirmation.focus();
      confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      const details = error && error.message ? error.message : 'Unknown email delivery issue.';
      confirmation.innerHTML = '<strong>We could not send your request just now.</strong>' +
        '<p>Delivery detail: ' + escapeHtml(details) + '</p>' +
        '<p>Please try again later or email <a href="mailto:bryanbienaime.23@gmail.com">Happy Tails Walks</a>.</p>';
      confirmation.hidden = false;
      confirmation.focus();
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Finish & request walk';
    }
  });

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]);
  }
})();
