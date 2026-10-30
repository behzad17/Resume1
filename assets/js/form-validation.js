/* Keep browser validation messages Persian, regardless of browser language. */
document.querySelectorAll('.contact-form-card input, .contact-form-card textarea').forEach((field) => {
  function validate() {
    field.setCustomValidity('');
    if (field.validity.valueMissing) field.setCustomValidity('لطفاً این بخش را تکمیل کنید.');
    else if (field.validity.typeMismatch) field.setCustomValidity('لطفاً یک آدرس ایمیل معتبر وارد کنید.');
  }
  field.addEventListener('input', validate);
  field.addEventListener('invalid', validate);
});
