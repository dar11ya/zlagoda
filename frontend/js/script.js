let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => 
    {
        searchForm.classList.toggle('active');
    }


let shoppingCart = document.querySelector('.shopping-cart');

document.querySelector('#cart-btn').onclick = () => 
    {
        shoppingCart.classList.toggle('active');
    }

let userWindow = document.querySelector('.user-window');

document.querySelector('#login-btn').onclick = () => 
    {
        userWindow.classList.toggle('active');
    }

 var swiper = new Swiper(".product-slider", {
      loop:true,
      spaceBetween: 20,

      autoplay: {
        delay: 7500,
        disableOnIntraction: false,
      },

      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1020: {
          slidesPerView: 3,
        },
      },
    });

 var swiper = new Swiper(".review-slider", {
      loop:true,
      spaceBetween: 20,

      autoplay: {
        delay: 7500,
        disableOnIntraction: false,
      },

      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1020: {
          slidesPerView: 3,
        },
      },
    });


