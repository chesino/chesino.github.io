const matKhauA = "ABC";
const matKhauB = "ZXC";

const passwordInput = document.getElementById("password-input");
const submitButton = document.getElementById("submit-button");
const KhoaNoiDung = document.querySelector(".KhoaNoiDung");
const noiDungA = document.querySelector(".NoiDungA");
const noiDungB = document.querySelector(".NoiDungB");
const moNoiDung = document.querySelector(".MoNoiDung");

const submitform = document.getElementById("submit-form");
const Form = document.querySelector(".Form");

function kiemTraMatKhau() {
  const enteredPassword = passwordInput.value;
  
  if (enteredPassword === matKhauA) {
    KhoaNoiDung.style.display = "none";
    moNoiDung.style.display = "block";
    noiDungA.style.display = "block";
    noiDungB.style.display = "none";
  } else if (enteredPassword === matKhauB) {
    KhoaNoiDung.style.display = "none";
    moNoiDung.style.display = "block";
    noiDungA.style.display = "block";
    noiDungB.style.display = "block";
  } else {
    alert("Mật khẩu không chính xác !");
    moNoiDung.style.display = "none";
    noiDungA.style.display = "none";
    noiDungB.style.display = "none";
  }
}
function BlockForm() {
  Form.style.display = "block"
}
submitform.addEventListener("click", BlockForm);

submitButton.addEventListener("click", kiemTraMatKhau);

passwordInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    kiemTraMatKhau();
  }
});

