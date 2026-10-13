function sendMail(contactForm) {
  const button = contactForm.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  if (button.disabled) return false;
  if (!contactForm.reportValidity()) return false;
  if (!window.emailjs) {
    status.textContent = 'The message service is unavailable. Please email info@bjcode.se.';
    return false;
  }
  button.disabled = true;
  status.textContent = 'Sending your message…';
  emailjs.send('service_jqbdyq3', 'template_0w3tgaf', {
    from_name: contactForm.elements.namedItem('name').value.trim(),
    from_email: contactForm.elements.namedItem('emailaddress').value.trim(),
    project_request: contactForm.elements.namedItem('projectsummary').value.trim(),
  }, 'o1pe8dZ9pmT_gqI5G').then(() => {
    status.textContent = 'Thank you. Your message has been sent.';
    contactForm.reset();
  }).catch(() => {
    status.textContent = 'Your message could not be sent. Please try again or email info@bjcode.se.';
  }).finally(() => { button.disabled = false; });
  return false;
}
