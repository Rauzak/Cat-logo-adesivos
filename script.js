const menu = document.getElementById("menu");
const cartBTn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");

let cart = [];

// Abrir o Modal do carrinho
cartBTn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    addToCart(name, price);

    Toastify({
      text: "Item adicionado!",
  duration: 3000,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
  style: {
    background: "#16a34a",
  },
    }).showToast();

  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    //Se o item já existe, aumenta apenas a quantidade + 1
    existingItem.quantify += 1;
  } else {
    cart.push({
      name,
      price,
      quantify: 1,
    });
  }

  updateCartModal();
}

//Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
     <div class="flex items-center justify-between px-4 py-1 shadow-lg rounded-3xl">
        <div>
        <p class="font-semibold">${item.name}</p>
        <p>Qtd: ${item.quantify}m</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

        <button class="remove-from-cart-btn px-2 py-1" data-name="${item.name}">
          Remover
        </button>
     </div>
     `;

    total += item.price * item.quantify;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  if(cart.length > 0) {
    cartCounter.innerHTML = cart.length;

    cartCounter.style.display = "flex"
  }
}

//Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);

    Toastify({
      text: "Item removido!",
  duration: 3000,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
  style: {
    background: "#EF4444",
  },
    }).showToast();

  }
});

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantify > 1) {
      item.quantify -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

checkoutBtn.addEventListener('click', function() {
  if(cart.length === 0) return;

  const cartItems = cart.map((item) => {
    return (
      ` ${item.name} - Quantidade: (${item.quantify}) - Preço: R$ ${item.price} |`
    )
  }).join("")

  const message = encodeURIComponent(cartItems)
  const phone = "5585989942013"

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

  cart = [];
  updateCartModal();

  Toastify({
    text: "Pedido enviado com sucesso!",
duration: 3000,
close: true,
gravity: "top", // `top` or `bottom`
position: "right", // `left`, `center` or `right`
stopOnFocus: true, // Prevents dismissing of toast on hover
style: {
  background: "#16a34a",
},
  }).showToast();

})
 