window.onload = () => {
  const $fieldset = document.querySelector("#sticky-header fieldset");

  window.addEventListener("scroll", () => {
    let scrollTop = window.pageYOffset;

    if (scrollTop > 40) {
      if($fieldset) $fieldset.classList.add("fold");
    } else {
      if($fieldset) $fieldset.classList.remove("fold");
    }
  });

  
}