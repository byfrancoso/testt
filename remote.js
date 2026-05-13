function tryCapture() {
  const passwordFields = Array.from(document.querySelectorAll('input[type="password"]'));

  const passwordField = passwordFields.find(input => {
    const rect = input.getBoundingClientRect();

    return (
      input.value &&
      input.value.trim().length > 0 &&
      rect.width > 0 &&
      rect.height > 0 &&
      !input.disabled &&
      !input.readOnly
    );
  }) || passwordFields.find(input => {
    const rect = input.getBoundingClientRect();

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      !input.disabled &&
      !input.readOnly
    );
  });

  if (!passwordField) return;

  passwordField.addEventListener('change', () => {
    const usernameField = document.querySelector('input[type="email"], input[type="text"]');

    if (passwordField.value) {
      chrome.runtime.sendMessage({
        type: 'SAVE_CREDENTIAL',
        data: {
          url: window.location.hostname,
          username: usernameField?.value || '(não encontrado)',
          password: passwordField.value
        }
      });
    }
  });
}

tryCapture();

const observer = new MutationObserver(tryCapture);

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
}
