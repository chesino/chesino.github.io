setTimeout(function() {
    document.getElementById('loading').classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loading').style.display = 'none';
    }, 1200);
    var Welcome = document.querySelector('.ChaoMung div');
    Welcome.parentNode.classList.add('Loaded');
  }, 1000);

  // window.addEventListener('load', function() { 
  //   document.getElementById('loading').classList.add('hidden');
  //     setTimeout(() => {
  //       document.getElementById('loading').style.display = 'none';
  //     }, 100);
  //     var Welcome = document.querySelector('.ChaoMung div');
  //     Welcome.parentNode.classList.add('Loaded');
  // });

  const progressBar = document.querySelector('.progress-bar');
  var ValueProgress = document.getElementById('ValueProgress');
  function updateProgress(progress, color) {
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
    ValueProgress.innerHTML = `${progress}%`;
    progressBar.classList.remove('blue', 'orange', 'red', 'green'); 
    progressBar.classList.add(color); // Thêm lớp màu sắc mới
  }
  updateProgress(0)

