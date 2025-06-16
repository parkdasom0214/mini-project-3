const container = document.querySelector(".product-list");

products.forEach(product => {
  const card = document.createElement("article");
  card.className = "product-card";

  card.innerHTML = `
    <a href="${product.link}">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price.toLocaleString()}원</p>
    </a>
  `;

  container.appendChild(card);
});