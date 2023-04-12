setTimeout(function() {
    document.getElementById('loading').classList.add('hidden');
    setTimeout(() => {
      document.getElementById('loading').style.display = 'none';
    }, 1200);
  }, 1000);

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
