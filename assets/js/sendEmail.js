(function () {
  emailjs.init("o1pe8dZ9pmT_gqI5G"); // کلید عمومی واقعی شما
})();

function sendMail(contactForm) {
  emailjs
    .send("service_awvo3xf", "template_0w3tgaf", {
      from_name: contactForm.name.value,
      from_email: contactForm.emailaddress.value,
      project_request: contactForm.projectsummary.value,
    })
    .then(
      function (response) {
        console.log("SUCCESS", response);
        alert("Message sent successfully!");
      },
      function (error) {
        console.log("FAILED", error);
        alert("Failed to send message.");
      }
    );
  return false; // جلوگیری از reload فرم
}

