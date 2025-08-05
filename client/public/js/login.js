const API_BASE_URL = window.API_BASE_URL;
const API_LOGIN_URL = `${API_BASE_URL}/api/auth/login`;

const loginForm = document.getElementById('loginForm');
const frontendErrorMessageDiv = document.getElementById('frontendErrorMessage');
const backendErrorMessageDiv = document.getElementById('backendErrorMessage');

function showErrorMessage(message) {
  if (frontendErrorMessageDiv) {
    frontendErrorMessageDiv.textContent = message;
    frontendErrorMessageDiv.style.display = 'block';
  }
  if (backendErrorMessageDiv) {
    backendErrorMessageDiv.style.display = 'none';
  }
}

function hideErrorMessages() {
  if (frontendErrorMessageDiv) {
    frontendErrorMessageDiv.style.display = 'none';
    frontendErrorMessageDiv.textContent = '';
  }
  if (backendErrorMessageDiv) {
    backendErrorMessageDiv.style.display = 'none';
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    hideErrorMessages();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login bem-sucedido:', data);

        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        window.location.href = '/home';

      } else {
        const errorData = await response.json();
        console.error('Erro no login:', errorData);
        showErrorMessage(errorData.message || 'Ocorreu um erro desconhecido no login.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      showErrorMessage('Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.');
    }
  });
} else {
  console.error("Erro: Elemento com ID 'loginForm' não encontrado. O script de login não será anexado.");
}

window.addEventListener('load', () => {
  if (backendErrorMessageDiv && backendErrorMessageDiv.textContent.trim() !== '') {
    showErrorMessage(backendErrorMessageDiv.textContent.trim());
  }
});
