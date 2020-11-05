window.onload = () => {
  const $fieldset = document.querySelector("#sticky-header fieldset");
  let startPos = 0;

  window.addEventListener("scroll", () => {
    /*
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let currentPos = scrollTop;

    if (currentPos > startPos) {
      if($fieldset) $fieldset.classList.add("fold");
    } else {
      if($fieldset) $fieldset.classList.remove("fold");
    }
    startPos = currentPos;
    */
    let scrollTop = window.pageYOffset;

    if (scrollTop > 40) {
      if($fieldset) $fieldset.classList.add("fold");
    } else {
      if($fieldset) $fieldset.classList.remove("fold");
    }
  });

  
}