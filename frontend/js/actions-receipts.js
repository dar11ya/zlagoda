document.addEventListener('DOMContentLoaded', () => {
  // елементи
  const table       = document.getElementById('receipts-table');
  const modal       = document.getElementById('receipt-modal');
  const form        = document.getElementById('receipt-form');
  const numInput    = document.getElementById('receipt-number');
  const dateInput   = document.getElementById('receipt-date');
  const empInput    = document.getElementById('receipt-cashier');
  const cardInput   = document.getElementById('receipt-card');
  const totalInput  = document.getElementById('receipt-total');
  const vatInput    = document.getElementById('receipt-vat');

  if (!table || !modal || !form) return;

  // 1) Редагувати / Видалити
  table.addEventListener('click', e => {
    const editBtn = e.target.closest('.edit-btn');
    const delBtn  = e.target.closest('.delete-btn');
    const row     = e.target.closest('tr');
    if (!row) return;

    // ✏️ Редагувати
    if (editBtn) {
      // припустимо: колонки [#, номер, дата, касир, карта, сума, ПДВ, Дії]
      const cells = row.querySelectorAll('td');
      numInput.value   = cells[1].textContent.trim();
      dateInput.value  = cells[2].textContent.trim();
      empInput.value   = cells[3].textContent.trim();
      cardInput.value  = cells[4].textContent.trim();
      totalInput.value = cells[5].textContent.replace(/[^\d.]/g,'');
      vatInput.value   = cells[6].textContent.replace(/[^\d.]/g,'');
      modal.classList.add('active');
      return;
    }

    // 🗑️ Видалити
    if (delBtn) {
      const number = row.querySelector('td:nth-child(2)').textContent.trim();
      if (!confirm(`Видалити чек №${number}?`)) return;
      fetch(`/api/receipts/${number}`, { method: 'DELETE' })
        .then(r => {
          if (r.ok) row.remove();
          else alert('Не вдалося видалити чек');
        })
        .catch(() => alert('Помилка на сервері'));
    }
  });

  // 2) Сабміт форми (PUT)
  form.addEventListener('submit', e => {
    e.preventDefault();
    const payload = {
      check_number: numInput.value,
      print_date:   dateInput.value,
      id_employee:  empInput.value,
      card_number:  cardInput.value,
      sum_total:    totalInput.value,
      vat:          vatInput.value
    };
    fetch(`/api/receipts/${payload.check_number}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
    .then(r => {
      if (r.ok) {
        modal.classList.remove('active');
        location.reload();
      } else alert('Помилка збереження');
    })
    .catch(() => alert('Помилка на сервері'));
  });

  // 3) Закриття модалки
  modal.querySelector('.close-btn')
    .addEventListener('click', () => modal.classList.remove('active'));
  modal.querySelector('.cancel-btn')
    .addEventListener('click', () => modal.classList.remove('active'));
});
