var vDynamic = 0;

function Dynamic() {
    var dAudio = document.getElementById("myAudio"); 
    var dRingtone = document.getElementById("myAudio2"); 
    var dAction = document.getElementById('dAction');
    var dOne = document.getElementById('dOne');
    var dTwo = document.getElementById('dTwo');

    vDynamic++;
    if (vDynamic == 1) {
        dAction.style.width = '150px';
        dAction.style.height = '28px';
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
        dAction.style.width = '90px';
        dAction.style.height = '28px';
        dOne.style.display = 'none';
        dTwo.style.display = 'none';
        dAudio.pause(); 
        dRingtone.pause();
    }
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