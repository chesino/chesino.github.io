var vDynamic = 0;

function Dynamic() {
  var dAudio = document.getElementById("myAudio");
  var dRingtone = document.getElementById("myAudio2");
  var dAction = document.getElementById('dAction');
  var dOne = document.getElementById('dOne');
  var dTwo = document.getElementById('dTwo');

  vDynamic++;
  if (vDynamic == 1) {
    dAction.style.width = '180px';
    dAction.style.height = '36px';
    dTwo.style.display = 'none';
    dOne.style.display = 'flex';
    dAudio.currentTime = 0
    dAudio.play();
  }
  if (vDynamic == 2) {
    dAction.style.width = '100%';
    dAction.style.height = '76px';
    dOne.style.display = 'none';
    setTimeout(() => {
      dTwo.style.display = 'flex';
    }, 200);
    dAudio.pause();
    dRingtone.currentTime = 0
    dRingtone.play();
  }
  if (vDynamic == 3) {
    vDynamic = 0;
    dAction.style.width = '120px';
    dAction.style.height = '36px';
    dOne.style.display = 'none';
    dTwo.style.display = 'none';
    dAudio.pause();
    dRingtone.pause();
  }
}

var vON = 0;
function offDynamic() {
  var dynamic = document.getElementById('dynamic');
  var voffDynamic = document.getElementById('offDynamic');

  vON++
  if (vON == 1) {
    dynamic.style.display = 'flex';
    voffDynamic.classList.add('Active')
  } else {
    vON = 0;
    dynamic.style.display = 'none';
    voffDynamic.classList.remove('Active')
  }
}

function UNO() {
  Swal.fire({
    title: 'Xác nhận mở UNO',
    text: 'Nếu xác nhận bạn sẽ được chuyển sang UNO.',
    icon: 'warning',

    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Huỷ'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Thành công',
        'Đã mở UNO.',
        'success',
        window.open('/Apps/UNO', '_blank')
      )
    }
  })
}


function AEUpload() {
  Swal.fire({
    title: 'Xác nhận mở AE Upload',
    text: 'Nếu xác nhận bạn sẽ được chuyển sang AE Upload.',
    icon: 'warning',

    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Huỷ'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Thành công',
        'Đã mở AE Upload.',
        'success',
        window.open('/HunqD/AETH-Upload', '_blank')
      )
    }
  })
}

function AECloud() {
  Swal.fire({
    title: 'Xác nhận mở AE Cloud',
    text: 'Nếu xác nhận bạn sẽ được chuyển sang AE Cloud.',
    icon: 'warning',

    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Huỷ'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Thành công',
        'Đã mở AE Cloud.',
        'success',
        window.open('https://drive.google.com/drive/folders/14yrdFluR8wuzHqUVUThQgCLttLFQmFDe?usp=drive_link', '_blank')
      )
    }
  })
}

function Done(T1, T2) {
  Swal.fire(
    T1,
    T2,
    'success'
  )
}

function Fail(T1, T2) {
  Swal.fire(
    T1,
    T2,
    'error'
  )
}
function Warning(T1, T2) {
  Swal.fire(
    T1,
    T2,
    'warning'
  )
}
function Info(T1, T2) {
  Swal.fire(
    T1,
    T2,
    'info'
  )
}


$("#btnAECloud").click(function () {
  $("#AECloud").css("display", "block");
  
  $([document.documentElement, document.body]).animate({
    scrollTop: $("#AECloud").offset().top
  }, 2000);
  setTimeout(function () {
    $("#Home").css("display", "flex");
  }, 2000);
});


$("#Home").click(function () {
  $("#AETH").css("display", "block");
  $([document.documentElement, document.body]).animate({
    scrollTop: $("#AETH").offset().top
  }, 2000);
  setTimeout(function () {
    $("#AECloud").css("display", "none");
    $("#Home").css("display", "none");
    $("#UNO").css("display", "none");
  }, 2000);
});

