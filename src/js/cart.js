const baseUrl = "https://openmarket.weniv.co.kr";
let finalOrderProducts = [];

// 헤더 불러오기
const addHeader = () => {
  console.log("header.html");
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("header").outerHTML = data;

      const script = document.createElement("script");
      script.src = "/src/js/header.js";
      document.body.appendChild(script);
    });
};

const addFooter = () => {
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("footer").outerHTML = data;
    });
};

document.addEventListener("DOMContentLoaded", () => {
  addHeader();
  addFooter();
  displayCart();
});

const displayCart = async () => {
  try {
    const cart = await fetchCart();
    console.log(cart.results);
    for (const cartProduct of cart.results) {
      const product = await fetchCartProductDetail(cartProduct.product_id);
      const $cartItem = createCartItemCard(
        product,
        cartProduct.quantity,
        cartProduct.cart_item_id
      );
      document.querySelector(".cart-items-container").appendChild($cartItem);
    }
  } catch (e) {
    console.log(e);
  }
};

const fetchCartProductDetail = async (id) => {
  try {
    const res = await fetch(`${baseUrl}/products/${id}`);
    if (res.ok) {
      const json = await res.json();
      return json;
    } else {
      return null;
    }
  } catch (error) {
    console.error("상품 불러오기 오류:", error);
    return null;
  }
};

const createCartItemCard = (product, quantity, cartItemId) => {
  const $cartItem = document.createElement("article");
  $cartItem.className = "cart-item";
  const formatter = new Intl.NumberFormat("ko-KR");

  $cartItem.innerHTML = `
    <div>
      <button type="button" class="remove" id="remove-${
        product.product_id
      }"></button>
      <input type="checkbox" id="select-${
        product.product_id
      }" aria-label="개별 상품 선택" />
      <label class="sr-only" for="select-${
        product.product_id
      }">개별 상품 선택</label>
    </div>
    <div class="product-detail">
      <figure>
        <img class="product-image" src="${product.image}" alt="${
    product.product_name
  }" />
        <figcaption class="sr-only">상품 설명</figcaption>
      </figure>
      <div class="product-info">
        <div>
          <p class="store-name">${product.store_name}</p>
          <p class="product-name">${product.product_name}</p>
          <p class="product-price">${product.price}원</p>
        </div>
        <p class="shipping-info">${
          product.shipping_method === "PARCEL" ? "택배배송" : "직접전달"
        } / ${
    product.shipping_fee === 0 ? "무료배송" : product.shipping_fee + "원"
  }</p>
      </div>
    </div>
    <div class="quantity-change-button">
      <button type="button" id="minus-${product.product_id}">
        <img src="./public/assets/icon-minus-line.svg" alt="수량 1 줄이기" />
      </button>
      <input disabled value="${quantity}" min="1" max="100" type="number" class="quantity-change-input" id="quantity-${
    product.product_id
  }" />
      <button type="button" id="plus-${product.product_id}">
        <img src="./public/assets/icon-plus-line.svg" alt="수량 1 늘리기" />
      </button>
    </div>
    <div class="total">
      <p class="total-price" id="total-price-${
        product.product_id
      }">${formatter.format(product.price * quantity)}원</p>
      <button class="order-button" id="order-${
        product.product_id
      }" type="button">주문하기</button>
    </div>
  `;

  const $minusButton = $cartItem.querySelector(`#minus-${product.product_id}`);
  const $plusButton = $cartItem.querySelector(`#plus-${product.product_id}`);
  const $quantityInput = $cartItem.querySelector(
    `#quantity-${product.product_id}`
  );
  const $totalPrice = $cartItem.querySelector(
    `#total-price-${product.product_id}`
  );
  const $selectCheckbox = $cartItem.querySelector(
    `#select-${product.product_id}`
  );

  const $removeButton = $cartItem.querySelector(
    `#remove-${product.product_id}`
  );

  $removeButton.addEventListener("click", () => {
    removeProductFromCart(cartItemId);
  });

  $minusButton.addEventListener("click", () => {
    createQuantityChangeModal(product, cartItemId);
  });
  $plusButton.addEventListener("click", () => {
    createQuantityChangeModal(product, cartItemId);
  });

  $selectCheckbox.addEventListener("input", () =>
    updateOrderProducts(product, $selectCheckbox.checked)
  );

  return $cartItem;
};

const updateOrderProducts = (product, isSelected) => {
  // 여기
  let quantity = parseInt(
    document.querySelector(`#quantity-${product.product_id}`).value,
    10
  );
  finalOrderProducts = finalOrderProducts.filter(
    (orderProduct) => orderProduct.id !== product.product_id
  );
  if (isSelected) {
    finalOrderProducts.push({
      id: product.product_id,
      price: product.price * quantity,
      discountPrice: 0,
      shippingFee: product.shipping_fee,
    });
  }
  console.log(finalOrderProducts);
  updateTotalCount();
};

const updateTotalCount = () => {
  console.log("update total count");
  const $totalCountSection = document.querySelector(".total-count");
  const $productPrice = $totalCountSection.querySelector(
    ".product-price .value em"
  );
  const $shippingFee = $totalCountSection.querySelector(
    ".shipping-fee .value em"
  );
  let finalOrderPrice = 0;
  let finalShippingFee = 0;
  finalOrderProducts.forEach((product) => {
    finalOrderPrice += product.price;
    finalShippingFee += product.shippingFee;
  });
  console.log(finalOrderProducts);

  $productPrice.textContent = finalOrderPrice.toLocaleString();
  $shippingFee.textContent = finalShippingFee.toLocaleString();
  $totalCountSection.querySelector(".total-price .value em").textContent = (
    finalOrderPrice + finalShippingFee
  ).toLocaleString();
};

const createQuantityChangeModal = (product, cartItemId) => {
  // 모달 생성
  const quantityChangeModal = document.createElement("article");
  let quantity = parseInt(
    document.querySelector(`#quantity-${product.product_id}`).value,
    10
  );
  const formatter = new Intl.NumberFormat("ko-KR");

  quantityChangeModal.className = "quantity-change-modal";
  quantityChangeModal.innerHTML = `
    <div class="modal-content">
      <div class="quantity-change-button">
        <button type="button" id="modal-minus-${product.product_id}">
          <img src="./public/assets/icon-minus-line.svg" alt="수량 1 줄이기" />
        </button>
        <input value="${quantity}" min="1" max="100" type="number" class="quantity-change-input" id="modal-quantity-${product.product_id}" />
        <button type="button" id="modal-plus-${product.product_id}">
          <img src="./public/assets/icon-plus-line.svg" alt="수량 1 늘리기" />
        </button>
      </div>
      <div class="modal-button-container">
        <button id="cancel" class="modal-button">취소</button>
        <button id="confirm" class="modal-button">수정</button>
      </div>
    </div>
  `;
  document.body.appendChild(quantityChangeModal);

  const $modalQuantityInput = document.querySelector(
    `#modal-quantity-${product.product_id}`
  );
  const $modalMinusButton = document.querySelector(
    `#modal-minus-${product.product_id}`
  );
  const $modalPlusButton = document.querySelector(
    `#modal-plus-${product.product_id}`
  );

  $modalMinusButton.disabled = quantity <= 1;
  $modalPlusButton.disabled = quantity >= product.stock;

  $modalMinusButton.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      $modalQuantityInput.value = quantity;
    }
    $modalMinusButton.disabled = quantity <= 1;
    $modalPlusButton.disabled = quantity >= product.stock;
  });

  $modalPlusButton.addEventListener("click", () => {
    quantity++;
    $modalQuantityInput.value = quantity;
    $modalMinusButton.disabled = quantity <= 1;
    $modalPlusButton.disabled = quantity >= product.stock;
  });

  $modalQuantityInput.addEventListener("input", (e) => {
    quantity = Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 100);
    $modalQuantityInput.value = quantity;
  });

  return new Promise((resolve) => {
    document.getElementById("confirm").addEventListener("click", async () => {
      quantityChangeModal.remove(); // 모달창 제거
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("인증된 사용자가 아님. 토큰 없음");
        return null;
      }

      try {
        const res = await fetch(`${baseUrl}/cart/${cartItemId}/`, {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({
            product_id: product.product_id,
            quantity: quantity,
            is_active: true,
          }),
        });
        console.log(product.product_id, quantity, token);
        if (res.ok) {
          alert("수정되었습니다.");

          const isSelected = document.querySelector(
            `#select-${product.product_id}`
          ).checked;
          console.log("isSelected", isSelected);

          // 화면에 수량 변경
          document.querySelector(`#quantity-${product.product_id}`).value =
            quantity;
          updateOrderProducts(product, isSelected);
          const $totalPrice = document.querySelector(
            `#total-price-${product.product_id}`
          );
          $totalPrice.textContent = `${formatter.format(
            product.price * quantity
          )}원`;

          resolve(true);
        } else {
          alert("수정 실패. 다시 시도해주세요.");
          resolve(false);
        }
      } catch (error) {
        console.error(error);
        resolve(false);
      }
    });

    document.getElementById("cancel").addEventListener("click", () => {
      quantityChangeModal.remove(); // 모달창 제거
      resolve(false); // 취소 시 false 반환
    });
  });
};

const removeProductFromCart = async (cartItemId) => {
  // 삭제 확인 모달창을 띄우는 코드를 작성해줘
  const removeConfirmModal = document.createElement("article");
  removeConfirmModal.className = "remove-confirm-modal";
  removeConfirmModal.innerHTML = `
    <div class="modal-content">
      <p>상품을 삭제하시겠습니까?</p>
      <div class="modal-button-container">
        <button id="cancel" class="modal-button">취소</button>
        <button id="confirm" class="modal-button">확인</button>
        </div>
    </div>
  `;
  document.body.appendChild(removeConfirmModal);

  return new Promise((resolve) => {
    document.getElementById("confirm").addEventListener("click", async () => {
      removeConfirmModal.remove(); // 모달창 제거
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("인증된 사용자가 아님. 토큰 없음");
        return null;
      }
      try {
        const res = await fetch(`${baseUrl}/cart/${cartItemId}`, {
          headers: { Authorization: `JWT ${token}` },
          method: "DELETE",
        });
        console.log(res);
        if (res.ok) {
          alert("삭제되었습니다.");
          window.location.reload();
          resolve(true);
        } else {
          alert("삭제 실패. 다시 시도해주세요.");
          resolve(false);
        }
        resolve(true);
      } catch (error) {
        console.error(error);
        resolve(false); // 삭제 실패 시 false 반환
      }
    });

    document.getElementById("cancel").addEventListener("click", () => {
      removeConfirmModal.remove(); // 모달창 제거
      resolve(false); // 취소 시 false 반환
    });
  });
};

const fetchCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("인증된 사용자가 아님. 토큰 없음");
    // TODO: 로그인 페이지로 넘어가는 등의 처리 필요
    return null;
  }
  try {
    const res = await fetch(`${baseUrl}/cart/`, {
      headers: { Authorization: `JWT ${token}` },
    });
    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error("장바구니 불러오기 오류:", error);
    return null;
  }
};
