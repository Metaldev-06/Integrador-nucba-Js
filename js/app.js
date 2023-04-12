import { products } from "./datos.js";

const cards = document.getElementById("product");
const sectionCart = document.getElementById("section__cart");
const templateCards = document.getElementById("template__products").content;
const templateCart = document.getElementById("template__cart").content;
const cartIcon = document.getElementById("cart__icon");
const fragment = document.createDocumentFragment();

const filter = document.querySelectorAll(".filter");
const badge = document.querySelector(".badge");

const footerDate = document.getElementById("footer__date");

let cart = {};

const showProductsHome = (products) => {
  cards.innerHTML = "";
  products.map((item) => {
    const clone = templateCards.cloneNode(true);

    clone.getElementById("template__img").setAttribute("src", item.url);
    clone.getElementById("template__title").textContent = item.title;
    clone.getElementById("template__price").textContent = "$" + item.price;
    clone.getElementById("template__type").textContent = item.type;
    clone.getElementById("template__button").dataset.id = item.id;

    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addCart = (e) => {
  if (e.target.classList.contains("template__button")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (object) => {
  const product = {
    id: object.querySelector(".template__button").dataset.id,
    url: object.querySelector("#template__img").getAttribute("src"),
    title: object.querySelector(".content__title").textContent,
    price: object.querySelector(".content__price").textContent,
    cantidad: 1,
  };

  if (cart.hasOwnProperty(product.id)) {
    product.cantidad = cart[product.id].cantidad + 1;
  }

  cart[product.id] = { ...product };
  showCart();
};

const showCart = () => {
  sectionCart.innerHTML = "";
  Object.values(cart).forEach((product) => {
    let str = product.price;
    let num = str.replace(/\$/g, "");

    templateCart.querySelector(".cart__id").textContent = product.id;
    templateCart.querySelector(".cart__img").setAttribute("src", product.url);
    templateCart.querySelector(".cart__title").textContent = product.title;
    templateCart.querySelector(".cart__quantity").textContent =
      product.cantidad;
    templateCart.querySelector(".cart__price").textContent =
      "$" + parseInt(num) * product.cantidad;
    templateCart.querySelector(".btn__plus").dataset.id = product.id;
    templateCart.querySelector(".btn__remove").dataset.id = product.id;
    templateCart.querySelector(".cart__delete").dataset.id = product.id;

    const clone = templateCart.cloneNode(true);
    fragment.appendChild(clone);
  });
  sectionCart.appendChild(fragment);

  localStorage.setItem("cart", JSON.stringify(cart));

  if (localStorage.getItem("cart") === "{}") {
    sectionCart.innerHTML = `<p>No hay artículos en el carrito 😥</p>`;
  }

  paintCartBadge();
};

sectionCart.addEventListener("click", (e) => {
  cartBtnActions(e);
});

const cartBtnActions = (e) => {
  if (e.target.classList.contains("btn__plus")) {
    const product = cart[e.target.dataset.id];
    product.cantidad++;
    cart[e.target.dataset.id] = { ...product };
    showCart();
  }

  if (e.target.classList.contains("btn__remove")) {
    const product = cart[e.target.dataset.id];
    product.cantidad--;
    if (product.cantidad === 0) {
      delete cart[e.target.dataset.id];
    }
    showCart();
  }

  if (e.target.classList.contains("cart__delete")) {
    delete cart[e.target.dataset.id];
    showCart();
  }
  e.stopPropagation();
};

cards.addEventListener("click", (e) => {
  addCart(e);
});

cartIcon.addEventListener("click", () => {
  sectionCart.style.display === "block"
    ? (sectionCart.style.display = "none")
    : (sectionCart.style.display = "block");
});

filter.forEach((link) => {
  link.addEventListener("click", () => {
    const filterValue = link.textContent;
    if (filterValue !== "all") {
      const productsFilter = products.filter(
        (products) => products.type === filterValue
      );
      showProductsHome(productsFilter);
    } else {
      showProductsHome(products);
    }
  });
});

const paintCartBadge = () => {
  const nQuantity = Object.values(cart).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );

  if (nQuantity === 0) {
    badge.style.display = "none";
  } else {
    badge.style.display = "block";
    badge.textContent = nQuantity;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  showProductsHome(products);

  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    showCart();
  }
});

footerDate.textContent = new Date().getFullYear();
