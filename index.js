const URLJSON = "./productos.json";

/* cart button */
const buttonShowCart = document.querySelector(".show-cart");
/* Wrapper cards */
const wrapperCards = document.querySelector(".row");

/* Productos */
let PRODUCTOS;

let CARRITO = [];

const setLocalStorage = (item, name) => {
  localStorage.setItem(name, JSON.stringify(item));
};
const getLocalStorage = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

(function () {
  const cartLocal = getLocalStorage("cart");
  if (cartLocal) {
    CARRITO = cartLocal;
  }
})();

(async function () {
  await fetch(URLJSON)
    .then((response) => response.json())
    .then((data) => {
      PRODUCTOS = data;
      return data.map((game) => {
        const contenedor = document.createElement("div");
        contenedor.classList.add("col-4");

        contenedor.innerHTML = ` <div class="card mt-4" style="width: 13rem;">
                             <img src=${game.img} class="card-img-top" alt=${game.name}> 
                              <div class="card-body">
                                <h6 class="card-title">${game.name}</h6>
                                <p class="card-text">$${game.price}</p>
                                <button id=${game.key}  class="btn btn-primary buy-game">Buy Game</button>
                              </div>
                            </div>`;
        wrapperCards.appendChild(contenedor);
      });
    });
  addEvents();
})();

const addEvents = () => {
  const buttons = document.querySelectorAll(".buy-game");
  buttons.forEach((button) =>
    button.addEventListener("click", async ({ target }) => {
      await addToCart(target.id);
      setLocalStorage(CARRITO, "cart");
    })
  );
  console.log(buttons);
};

/* Search game by key*/
const searchGameByKey = (key, place = PRODUCTOS) => {
  return place.find((producto) => producto.key === parseInt(key));
};

/* If the game already in the cart */
const isAlreadyInCart = (key) => {
  const existGame = searchGameByKey(key, CARRITO);
  return Boolean(existGame);
};
/* Add to cart */
const addToCart = (key) => {
  if (isAlreadyInCart(key)) {
    const game = searchGameByKey(key, CARRITO);
    game.quantity += 1;
    return;
  }
  const gameSearched = searchGameByKey(key);
  CARRITO.push({ ...gameSearched, quantity: 1 });
};

/* Show cart items in dom */
const showItems = () => {
  const list = document.querySelector(".items-cart");
  const totalValue = document.querySelector(".total");
  const total = getTotal();
  totalValue.innerHTML = `Total: $${total}`;
  list.innerHTML = "";
  (getLocalStorage("cart") || []).map((item) => {
    const listItem = document.createElement("li");
    listItem.className = "item-cart";
    listItem.innerHTML = `<p class='game-title'>Game: ${item.name}</p> <p>Items: ${item.quantity}</p>`;

    list.appendChild(listItem);
  });
};

buttonShowCart.addEventListener("click", showItems);

/* TITLE ANIMATION */
function myRepeat() {
  $(".title-container").delay(150).fadeOut(1000).delay(150).fadeIn(1000);
}
setInterval(myRepeat, 1000);

const getTotal = () => {
  let total = 0;
  getLocalStorage("cart").map((game) => {
    if (game.quantity > 1) {
      total += game.quantity * game.price;
    }
    if (game.quantity <= 1) total += game.price;
  });
  return total;
};
