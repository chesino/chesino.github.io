const matKhauA = "K14";
const matKhauB = "CDT999";

const passwordInput = document.getElementById("password-input");
const submitButton = document.getElementById("submit-button");
const KhoaNoiDung = document.querySelector(".KhoaNoiDung");
const noiDungA = document.querySelector(".NoiDung.A");
const noiDungB = document.querySelector(".NoiDung.B");
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
  KhoaNoiDung.style.display = "none";
  Form.style.display = "block"
}
submitform.addEventListener("click", BlockForm);

submitButton.addEventListener("click", kiemTraMatKhau);

passwordInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    kiemTraMatKhau();
  }
});

