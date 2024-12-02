// Add hover effect on buttons
const buttons = document.querySelectorAll('.buy-btn');
buttons.forEach((button) => {
  button.addEventListener('mouseenter', () => {
    button.style.boxShadow = '0 4px 15px rgba(255, 255, 0, 0.7)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.boxShadow = 'none';
  });
});
