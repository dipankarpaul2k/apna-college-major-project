// Function for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Function to update rating label
function updateRatingLabel(rating) {
  let label = document.getElementById("ratingLabel");
  let associatedLabel = document.querySelector(`#first-rate${rating}`)
    .labels[0];
  let title = associatedLabel.getAttribute("title");
  label.textContent = `Rate us (${title})`;
}

// Function to set autofocus to comment box
function formAutoFocus() {
  const reviewForm = document.querySelector("#reviewForm");
  reviewForm.querySelector("#comment").focus();
}

// Function to toggle menu icon
function toggleIcon() {
  const menuIcon = document.querySelector("#menu_icon");
  menuIcon.classList.toggle("ri-menu-line");
  menuIcon.classList.toggle("ri-close-line");
}

// Function to show price with taxes
function showPriceWithTax() {
  const withoutTax = document.querySelectorAll(".withoutTax");
  const withTax = document.querySelectorAll(".withTax");

  withoutTax.forEach((elm) => {
    elm.classList.toggle("hide_price");
  });
  withTax.forEach((elm) => {
    elm.classList.toggle("hide_price");
  });
}
