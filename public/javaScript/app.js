const delBtn=document.querySelector(".del");
document.addEventListener("DOMContentLoaded",()=>{
    delBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        const ok= confirm("Do you really want to delete this listing?");
        if(ok){
            let form=delBtn.closest("form");
            if(form){
                form.submit();
            }
        }
    });
});


// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()