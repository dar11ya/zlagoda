document.addEventListener('DOMContentLoaded', () => {
  // 1. Grab all the elements we need
  const table         = document.getElementById('products-table');
  const modal         = document.getElementById('product-modal');
  const form          = document.getElementById('product-form');
  const idInput       = document.getElementById('prod-id');
  const nameInput     = document.getElementById('prod-name');
  const manufInput    = document.getElementById('prod-manufacturer');
  const categoryInput = document.getElementById('prod-category');
  const typeInput     = document.getElementById('prod-type');
  const imageInput    = document.getElementById('prod-image');
  const priceInput    = document.getElementById('prod-price');
  const discountInput = document.getElementById('prod-discount');
  const qtyInput      = document.getElementById('prod-qty');
  const vatInput      = document.getElementById('prod-vat');

  if (!table || !modal || !form) {
    console.error('Missing essential elements for product management.');
    return;
  }

  // 2. Handle clicks in the table: edit or delete
  table.addEventListener('click', e => {
    const editBtn = e.target.closest('.edit-btn');
    const delBtn  = e.target.closest('.delete-btn');
    const row     = e.target.closest('tr');
    if (!row) return;

    // 2.1 Edit
    if (editBtn) {
      const cells = Array.from(row.querySelectorAll('td'));
      // cells: [0=photo,1=ID,2=name,3=manuf,4=category,5=type,
      //         6=price,7=discount,8=price-with-discount,9=qty,10=vat,11=actions]

      // Populate the form fields:
      idInput.value       = cells[1].textContent.trim();
      nameInput.value     = cells[2].textContent.trim();
      manufInput.value    = cells[3].textContent.trim();
      categoryInput.value = cells[4].textContent.trim();
      typeInput.value     = cells[5].textContent.trim();

      // Clean out non-numeric characters:
      priceInput.value    = cells[6].textContent.trim().replace(/[^\d.]/g, '');
      discountInput.value = cells[7].textContent.trim().replace(/[^\d]/g, '');
      qtyInput.value      = cells[9].textContent.trim().replace(/[^\d]/g, '');
      vatInput.value      = cells[10].textContent.trim().replace(/[^\d]/g, '');

      // Pull image URL from the <img> in cell 0:
      const imgEl = cells[0].querySelector('img');
      imageInput.value = imgEl ? imgEl.src : '';

      // Show the modal
      modal.classList.add('active');
      return;
    }

    // 2.2 Delete
    if (delBtn) {
      const id = row.querySelector('td:nth-child(2)').textContent.trim();
      if (!confirm(`Видалити товар #${id}?`)) return;
      fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            row.remove();
          } else {
            alert('Не вдалося видалити товар');
          }
        })
        .catch(err => {
          console.error(err);
          alert('Сталася помилка при видаленні');
        });
    }
  });

  // 3. Handle form submission (save / update)
  form.addEventListener('submit', e => {
    e.preventDefault();
    const payload = {
      id:           idInput.value,
      name:         nameInput.value,
      manufacturer: manufInput.value,
      category:     categoryInput.value,
      type:         typeInput.value,
      image:        imageInput.value,
      price:        priceInput.value,
      discount:     discountInput.value,
      qty:          qtyInput.value,
      vat:          vatInput.value
    };
    fetch(`/api/products/${payload.id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
    .then(res => {
      if (res.ok) {
        modal.classList.remove('active');
        location.reload();
      } else {
        alert('Помилка збереження товару');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Сталася помилка при збереженні');
    });
  });

  // 4. Close modal on × button
  modal.querySelector('.close-btn')?.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // 5. Close modal on “Скасувати”
  modal.querySelector('.cancel-btn')?.addEventListener('click', () => {
    modal.classList.remove('active');
  });
});
