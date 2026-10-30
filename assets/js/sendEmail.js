function sendMail(contactForm) {
  const button = contactForm.querySelector('button[type="submit"]');
  const status = document.getElementById('form-status');
  if (button.disabled) return false;
  if (!contactForm.reportValidity()) return false;
  if (!window.emailjs) {
    status.textContent = 'سرویس ارسال پیام در دسترس نیست. لطفاً به info@bjcode.se ایمیل بزنید.';
    return false;
  }
  button.disabled = true;
  status.textContent = 'در حال ارسال پیام شما…';
  emailjs.send('service_jqbdyq3', 'template_0w3tgaf', {
    from_name: contactForm.elements.namedItem('name').value.trim(),
    from_email: contactForm.elements.namedItem('emailaddress').value.trim(),
    project_request: contactForm.elements.namedItem('projectsummary').value.trim(),
  }, 'o1pe8dZ9pmT_gqI5G').then(() => {
    status.textContent = 'سپاسگزاریم؛ پیام شما با موفقیت ارسال شد.';
    contactForm.reset();
  }).catch(() => {
    status.textContent = 'پیام ارسال نشد. دوباره تلاش کنید یا به info@bjcode.se ایمیل بزنید.';
  }).finally(() => { button.disabled = false; });
  return false;
}
