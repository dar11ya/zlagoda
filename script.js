function showForm(formId) {
  document.querySelectorAll('.form-box').forEach(box => box.classList.remove('active'));
  document.getElementById(formId).classList.add('active');
}

// --- НОВИЙ КОД для реєстрації ---
document.addEventListener('DOMContentLoaded', () => {
  const regForm    = document.getElementById('registerForm');
  const errMsg     = document.querySelector('#register-form .error-message');
  const nameInput  = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const passInput  = document.getElementById('reg-password');
  const birthInput = document.getElementById('birthdate');
  const roleInput  = document.getElementById('role');

  regForm.addEventListener('submit', e => {
    e.preventDefault();
    errMsg.textContent = '';

    // 1) Перевірка віку >= 18
    const birthDate = new Date(birthInput.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() -
      ( (today.getMonth() < birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) )
        ? 1 : 0 );
    if (isNaN(age) || age < 18) {
      errMsg.textContent = 'Реєстрація дозволена лише від 18 років.';
      return;
    }

    // 2) Автоматичне призначення ролі
    const nameVal  = nameInput.value.trim().toLowerCase();
    const emailVal = emailInput.value.trim().toLowerCase();
    if (emailVal.includes('admin') || nameVal.includes('admin')) {
      roleInput.value = 'admin';
    } else {
      roleInput.value = 'user';
    }

    // 3) Відправка форми, якщо усе гаразд
    regForm.submit();
  });
});
