// js/cards.js
document.addEventListener('DOMContentLoaded', () => {
  // 1. Пошук елементів
  const table           = document.getElementById('cards-table');
  const modal           = document.getElementById('card-modal');
  const form            = document.getElementById('card-form');
  const numberInput     = document.getElementById('card-number');
  const surnameInput    = document.getElementById('card-surname');
  const nameInput       = document.getElementById('card-name');
  const patronymicInput = document.getElementById('card-patronymic');
  const phoneInput      = document.getElementById('card-phone');
  const cityInput       = document.getElementById('card-city');
  const streetInput     = document.getElementById('card-street');
  const zipInput        = document.getElementById('card-zip');
  const percentInput    = document.getElementById('card-percent');

  if (!table || !modal || !form) return;

  // 2. Клік по таблиці — редагувати чи видалити
  table.addEventListener('click', e => {
    const editBtn   = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    const row       = e.target.closest('tr');
    if (!row) return;

    // 2.1 Редагувати
    if (editBtn) {
      const cells = row.querySelectorAll('td');
      // cells: [0=card#,1=full name,2=phone,3=address,4=percent,5=actions]
      const fullName = cells[1].textContent.trim().split(' ');
      numberInput.value     = cells[0].textContent.trim();
      surnameInput.value    = fullName[0] || '';
      nameInput.value       = fullName[1] || '';
      patronymicInput.value = fullName[2] || '';
      phoneInput.value      = cells[2].textContent.trim();
      // адреса: "м. Київ, вул. Хрещатик, 10"
      const addrParts = cells[3].textContent.trim().split(',');
      cityInput.value    = addrParts[0] ? addrParts[0].trim() : '';
      streetInput.value  = addrParts[1] ? addrParts[1].trim() : '';
      zipInput.value     = addrParts[2] ? addrParts[2].trim() : '';
      percentInput.value = cells[4].textContent.replace('%','').trim();
      modal.classList.add('active');
      return;
    }

    // 2.2 Видалити
    if (deleteBtn) {
      const cardNum = row.querySelector('td').textContent.trim();
      if (!confirm(`Видалити карту клієнта №${cardNum}?`)) return;
      fetch(`/api/cards/${cardNum}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) row.remove();
          else alert('Не вдалося видалити карту');
        })
        .catch(() => alert('Помилка при видаленні на сервері'));
    }
  });

  // 3. Сабміт форми — створити / оновити
  form.addEventListener('submit', e => {
    e.preventDefault();
    const payload = {
      card_number:  numberInput.value,
      cust_surname: surnameInput.value,
      cust_name:    nameInput.value,
      cust_patronymic: patronymicInput.value,
      phone_number: phoneInput.value,
      city:         cityInput.value,
      street:       streetInput.value,
      zip_code:     zipInput.value,
      percent:      percentInput.value
    };
    fetch(`/api/cards/${payload.card_number}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
    .then(res => {
      if (res.ok) {
        modal.classList.remove('active');
        location.reload();
      } else {
        alert('Помилка збереження карти');
      }
    })
    .catch(() => alert('Серверна помилка при збереженні'));
  });

  // 4. Закрити модалку
  modal.querySelector('.close-modal')
    .addEventListener('click', () => modal.classList.remove('active'));
  modal.querySelector('.cancel-btn')
    .addEventListener('click', () => modal.classList.remove('active'));
});
