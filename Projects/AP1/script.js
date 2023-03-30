const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
	const title = item.querySelector('.accordion-title');
	const content = item.querySelector('.accordion-content');

	title.addEventListener('click', () => {
		content.classList.toggle('active');

		if (content.classList.contains('active')) {
			content.style.display = 'block';
		} else {
			content.style.display = 'none';
		}
	});
});
function toggleDarkMode() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.toggle("dark-mode");
  }
  