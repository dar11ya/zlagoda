document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('employees-table');
  const modal = document.getElementById('emp-modal');
  const form  = document.getElementById('emp-form');

  // 1) Відкрити модалку та підставити дані
  table.addEventListener('click', e => {
    const editBtn = e.target.closest('.edit-btn');
    const delBtn  = e.target.closest('.delete-btn');
    const row     = e.target.closest('tr');

    if (editBtn) {
      const cells = row.querySelectorAll('td');
      form.id.value        = cells[0].textContent.trim();
      form.name.value      = cells[1].textContent.trim();
      form.position.value  = cells[2].textContent.trim().toLowerCase();
      form.salary.value    = cells[3].textContent.trim();
      form.dob.value       = cells[4].textContent.trim();
      form.phone.value     = cells[5].textContent.trim();
      form.address.value   = cells[6].textContent.trim();
      modal.classList.add('active');
    }

    // 2) Видалити рядок
    else if (delBtn) {
      const id = row.querySelector('td').textContent.trim();
      if (!confirm(`Видалити співробітника #${id}?`)) return;
      fetch(`/api/employees/${id}`, { method: 'DELETE' })
        .then(res => res.ok ? row.remove() : alert('Не вдалося видалити'));
    }
  });

  // 3) Сабміт форми редагування
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    fetch(`/api/employees/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (res.ok) {
        modal.classList.remove('active');
        location.reload();
      } else {
        alert('Помилка збереження');
      }
    });
  });

  // 4) Закрити модалку
  modal.querySelector('.close-modal').addEventListener('click', () =>
    modal.classList.remove('active')
  );
  modal.querySelector('.cancel-btn').addEventListener('click', () =>
    modal.classList.remove('active')
  );
});

// Обмежуємо вибір дати: не пізніше ніж сьогодні мінус 18 років
const dobInput = document.getElementById('emp-dob');
if (dobInput) {
  const today = new Date();
  const year18 = today.getFullYear() - 18;
  const month  = String(today.getMonth() + 1).padStart(2, '0');
  const day    = String(today.getDate()).padStart(2, '0');
  dobInput.max = `${year18}-${month}-${day}`; 
}

form.addEventListener('submit', e => {
  e.preventDefault();

  // Перевіряємо вік
  const dobValue = form.dob.value;              // у форматі "YYYY-MM-DD"
  const dobDate  = new Date(dobValue);
  const diffMs  = Date.now() - dobDate.getTime();
  const ageDate = new Date(diffMs);             // різниця в мс як Date від 1970
  const age     = Math.abs(ageDate.getUTCFullYear() - 1970);

  if (age < 18) {
    alert('Співробітнику має бути не менше 18 років');
    return;
  }

  // Якщо все ок — продовжуємо PUT-запит
  const data = Object.fromEntries(new FormData(form));
  fetch(`/api/employees/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => {
    if (res.ok) {
      modal.classList.remove('active');
      location.reload();
    } else {
      alert('Помилка збереження');
    }
  });
});
