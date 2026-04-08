const actionButton = document.getElementById('actionButton');
const actionMessage = document.getElementById('actionMessage');

actionButton.addEventListener('click', () => {
  actionMessage.textContent = 'Nice! Your new website is ready to customize.';
  actionButton.textContent = 'Great!';
});
