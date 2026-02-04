document.addEventListener("DOMContentLoaded", () => {
  // Cart functionality
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Migrate old cart format (string array) to new format (object array)
  if (cart.length > 0 && typeof cart[0] === "string") {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  const cartToggle = document.getElementById("cart-toggle");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartClose = document.getElementById("cart-close");
  const cartItems = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const cartFooter = document.getElementById("cart-footer");
  const cartBadge = document.getElementById("cart-badge");
  const whatsappOrderBtn = document.getElementById("whatsapp-order");

  // Update cart badge
  function updateCartBadge() {
    cartBadge.textContent = cart.length;
    cartBadge.style.display = cart.length > 0 ? "flex" : "none";
  }

  // Render cart items
  function renderCart() {
    if (cart.length === 0) {
      cartEmpty.style.display = "block";
      cartFooter.style.display = "none";
      cartItems.innerHTML = "";
      cartItems.appendChild(cartEmpty);
    } else {
      cartEmpty.style.display = "none";
      cartFooter.style.display = "block";
      cartItems.innerHTML = "";
      cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
          </div>
          <button class="cart-item-remove" data-index="${index}" aria-label="Sil">
            <i class="fas fa-trash"></i>
          </button>
        `;
        cartItems.appendChild(cartItem);
      });

      // Add remove event listeners
      document.querySelectorAll(".cart-item-remove").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const index = parseInt(e.currentTarget.dataset.index);
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartBadge();
          renderCart();
        });
      });
    }
  }

  // Add to cart
  function addToCart(productName, productImage) {
    // Check if product already exists in cart
    const existingIndex = cart.findIndex(item => item.name === productName);
    if (existingIndex === -1) {
      cart.push({
        name: productName,
        image: productImage
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartBadge();
      renderCart();
      
      // Show notification
      const btn = event.target.closest(".add-to-cart-icon");
      if (btn) {
        const originalIcon = btn.querySelector("i").className;
        btn.querySelector("i").className = "fas fa-check";
        btn.classList.add("added");
        setTimeout(() => {
          btn.querySelector("i").className = originalIcon;
          btn.classList.remove("added");
        }, 2000);
      }
    }
  }

  // Add "Add to cart" buttons to all cards
  document.querySelectorAll(".card h3").forEach(cardTitle => {
    const card = cardTitle.closest(".card");
    const cardImage = card.querySelector(".card-image");
    if (cardImage && !cardImage.querySelector(".add-to-cart-icon")) {
      const productName = cardTitle.textContent.trim();
      const imgElement = cardImage.querySelector("img");
      const productImage = imgElement ? imgElement.src : "";
      const addBtn = document.createElement("button");
      addBtn.className = "add-to-cart-icon";
      addBtn.innerHTML = '<i class="fas fa-plus"></i>';
      addBtn.dataset.product = productName;
      addBtn.setAttribute("aria-label", "Səbətə əlavə et");
      addBtn.addEventListener("click", () => addToCart(productName, productImage));
      cardImage.appendChild(addBtn);
    }
  });

  // Open/close cart sidebar
  function openCart() {
    cartSidebar.classList.add("active");
    document.body.classList.add("cart-open");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cartSidebar.classList.remove("active");
    document.body.classList.remove("cart-open");
    document.body.style.overflow = "";
  }

  cartToggle?.addEventListener("click", openCart);
  cartClose?.addEventListener("click", closeCart);
  cartOverlay?.addEventListener("click", closeCart);

  // WhatsApp order
  whatsappOrderBtn?.addEventListener("click", () => {
    if (cart.length === 0) return;
    
    const phoneNumber = "994554741771";
    let message = "Salam! Aşağıdakı məhsullar üzrə sifariş vermək istəyirəm:\n\n";
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      if (item.image) {
        message += `   Şəkil: ${item.image}\n`;
      }
    });
    
    message += `\nƏlaqə nömrəsi: +994 55 474 17 71`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  });

  // Initialize
  updateCartBadge();
  renderCart();

  // Hero video loop with delay
  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    heroVideo.addEventListener("ended", () => {
      setTimeout(() => {
        heroVideo.currentTime = 0;
        heroVideo.play();
      }, 500); // 500ms delay before restarting
    });
  }

  // Product data (defaults)
  const defaultProducts = {
    jaluz: {
      title: "Jaluz",
      description:
        "Avtomatik və manual jaluz; mağazalar, qarajlar və anbarlar üçün.",
      price: "",
      imageUrl: "",
    },
    autoJaluz: {
      title: "Avtomatik jaluz",
      description:
        "Uzaqdan idarəetmə, təhlükəsiz mexanizm və səssiz işləmə ilə rahat istifadə.",
      price: "",
      imageUrl: "",
    },
    panel: {
      title: "Panel",
      description:
        "Bağ və sənaye sahələri üçün panel çəpərlər və darvazalar.",
      price: "",
      imageUrl: "",
    },
    metal: {
      title: "Dəmir konstruksiyalar",
      description:
        "Möhkəm və uzunömürlü metal konstruksiyalar, fərdi ölçülərlə.",
      price: "",
      imageUrl: "",
    },
    autoSystems: {
      title: "Avtomatik sistemlər",
      description:
        "Qapı və jaluz üçün avtomatlaşdırma, sensor və təhlükəsizlik modulları.",
      price: "",
      imageUrl: "",
    },
    remoteSystems: {
      title: "Pult sistemləri",
      description:
        "Uzaqdan idarəetmə pultları, kodlama və inteqrasiya xidmətləri.",
      price: "",
      imageUrl: "",
    },
    canopies: {
      title: "Müxtəlif naveslər",
      description: "Qapı üstü, veranda və avto dayanacaq üçün naveslər.",
      price: "",
      imageUrl: "",
    },
    safe: {
      title: "Seyf",
      description:
        "Ev və ofis üçün səviyyəli təhlükəsizlik seyfləri, müxtəlif ölçülər.",
      price: "",
      imageUrl: "",
    },
    doors: {
      title: "Qapılar",
      description:
        "Metaldan, paneldən və kombinə edilmiş materiallardan giriş qapıları.",
      price: "",
      imageUrl: "",
    },
  };

  let products = { ...defaultProducts };

  // Try to load saved products from localStorage
  try {
    const saved = localStorage.getItem("spacedoorsProducts");
    if (saved) {
      const parsed = JSON.parse(saved);
      products = { ...products, ...parsed };
    }
  } catch {
    // ignore
  }

  function applyProductsToDOM() {
    Object.entries(products).forEach(([id, product]) => {
      const card = document.querySelector(`.card[data-product-id="${id}"]`);
      if (!card) return;

      const titleEl = card.querySelector('[data-field="title"]');
      const descEl = card.querySelector('[data-field="description"]');
      const priceEl = card.querySelector('[data-field="price"]');
      const imgEl = card.querySelector('[data-field="image"]');

      if (titleEl && product.title) {
        titleEl.textContent = product.title;
      }
      if (descEl && product.description) {
        descEl.textContent = product.description;
      }
      if (priceEl) {
        priceEl.textContent = product.price
          ? `Qiymət: ${product.price}`
          : "Qiymət: sorğu ilə";
      }
      if (imgEl) {
        if (product.imageUrl) {
          imgEl.src = product.imageUrl;
        } else {
          imgEl.src =
            "https://via.placeholder.com/600x400?text=spacedoors";
        }
      }
    });
  }

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Smooth scroll for [data-scroll] links
  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // "Sifariş et" shortcuts open contact section
  document.querySelectorAll("[data-open-contact]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector("#contact");
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // Simple mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("nav-open");
    });

    nav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
      })
    );
  }

  // Fake submit for contact form (front-end only)
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const name = formData.get("name") || "";
      const phone = formData.get("phone") || "";
      const email = formData.get("email") || "";
      const message = formData.get("message") || "";

      const text =
        "Yeni sifariş sorğusu:%0A" +
        `Ad: ${encodeURIComponent(name)}%0A` +
        `Telefon: ${encodeURIComponent(phone)}%0A` +
        `Email: ${encodeURIComponent(email)}%0A` +
        `Mesaj: ${encodeURIComponent(message)}`;

      const whatsappUrl = `https://wa.me/994554741771?text=${text}`;

      window.open(whatsappUrl, "_blank");
    });
  }

  function saveProducts() {
    try {
      localStorage.setItem("spacedoorsProducts", JSON.stringify(products));
    } catch {
      // ignore
    }
  }

  // Initial render of products
  applyProductsToDOM();

  // Image gallery functionality
  const automationImages = [
    "assets/products/avtomatlasdirma.jpeg",
    "assets/products/avtomatlasdirma1.jpeg",
    "assets/products/avtomatlasdirma2.jpeg",
    "assets/products/avtomatlasdirma3.jpeg",
    "assets/products/avtomatlasdirma4.jpeg",
    "assets/products/avtomatlasdirma5.jpeg",
    "assets/products/avtomatlasdirma6.jpeg",
    "assets/products/avtomatlasdirma .jpeg"
  ];

  const panelImages = [
    "assets/products/paneldarvaza1.jpeg",
    "assets/products/paneldarvaza2.jpeg",
    "assets/products/paneldarvaza3.jpeg",
    "assets/products/paneldarvaza4.jpeg",
    "assets/products/paneldarvaza5.jpeg",
    "assets/products/paneldarvaza6.jpeg",
    "assets/products/paneldarvaza7.jpeg"
  ];

  const sectionImages = [
    "assets/products/seksiya1.jpeg",
    "assets/products/seksiya2.jpeg",
    "assets/products/seksiya3.jpeg",
    "assets/products/seksiya4.jpeg",
    "assets/products/seksiya5.jpeg",
    "assets/products/seksiya6.jpeg",
    "assets/products/seksiya7.jpeg",
    "assets/products/seksiya8.jpeg",
    "assets/products/seksiya9.jpeg"
  ];

  const jaluzImages = [
    "assets/products/jaluz1.jpeg",
    "assets/products/jaluz2.jpeg",
    "assets/products/jaluz3.jpeg",
    "assets/products/jaluz4.jpeg",
    "assets/products/jaluz5.jpeg",
    "assets/products/jaluz6.jpeg",
    "assets/products/jaluz7.jpeg",
    "assets/products/jaluz8.jpeg",
    "assets/products/jaluz9.jpeg"
  ];

  const fotocelImages = [
    "assets/products/fotocel1.jpeg",
    "assets/products/fotocel2.jpeg"
  ];

  const rampaImages = [
    "assets/products/rampa1.jpeg",
    "assets/products/rampa2.jpeg",
    "assets/products/rampa3.jpeg",
    "assets/products/rampa4.jpeg",
    "assets/products/rampa5.jpeg",
    "assets/products/rampa6.jpeg"
  ];

  const slagbaumImages = [
    "assets/products/slaqbaun1.jpeg",
    "assets/products/slaqbaun2.jpeg",
    "assets/products/slaqbaun3.jpeg",
    "assets/products/slaqbaun4.jpeg",
    "assets/products/slaqbaun5.jpeg",
    "assets/products/slabaun6.jpeg",
    "assets/products/slaqbaun7.jpeg"
  ];

  const tentImages = [
    "assets/products/tent1.jpeg",
    "assets/products/tent2.jpeg",
    "assets/products/tent3.jpeg",
    "assets/products/tent4.jpeg",
    "assets/products/tent5.jpeg",
    "assets/products/tent6.jpeg"
  ];

  const bagImages = [
    "assets/products/bag1.jpeg",
    "assets/products/bag2.jpeg",
    "assets/products/bag3.jpeg",
    "assets/products/bag4.jpeg",
    "assets/products/bag5.jpeg",
    "assets/products/bag6.jpeg",
    "assets/products/bag7.jpeg",
    "assets/products/bag8.jpeg",
    "assets/products/bag9.jpeg",
    "assets/products/bag10.jpeg"
  ];

  const pivotImages = [
    "assets/products/pivot1.jpeg",
    "assets/products/pivot2.jpeg",
    "assets/products/pivot3.jpeg",
    "assets/products/pivot4.jpeg",
    "assets/products/pivot5.jpeg",
    "assets/products/pivot6.jpeg"
  ];

  const aluminumImages = [
    "assets/products/alm1.jpeg",
    "assets/products/alm2.jpeg",
    "assets/products/alm3.jpeg",
    "assets/products/alm4.jpeg",
    "assets/products/alm5.jpeg",
    "assets/products/alm6.jpeg",
    "assets/products/alm7.jpeg",
    "assets/products/alm8.jpeg",
    "assets/products/alm9.jpeg",
    "assets/products/alm10.jpeg"
  ];

  const metalImages = [
    "assets/products/metal1.jpeg",
    "assets/products/metal2.jpeg",
    "assets/products/metal3.jpeg",
    "assets/products/metal4.jpeg",
    "assets/products/metal5.jpeg",
    "assets/products/metal6.jpeg",
    "assets/products/metal7.jpeg",
    "assets/products/metal8.jpeg",
    "assets/products/metal9.jpeg",
    "assets/products/metal10.jpeg"
  ];

  const mdrImages = [
    "assets/products/mdr1.jpeg",
    "assets/products/mdr2.jpeg",
    "assets/products/mdr3.jpeg",
    "assets/products/mdr4.jpeg",
    "assets/products/mdr5.jpeg",
    "assets/products/mdr6.jpeg",
    "assets/products/mdr7.jpeg",
    "assets/products/mdr8.jpeg",
    "assets/products/mdr9.jpeg",
    "assets/products/mdr10.jpeg"
  ];

  const alpImages = [
    "assets/products/alp1.jpeg",
    "assets/products/alp2.jpeg",
    "assets/products/alp3.jpeg",
    "assets/products/alp4.jpeg",
    "assets/products/alp5.jpeg",
    "assets/products/alp6.jpeg",
    "assets/products/alp7.jpeg",
    "assets/products/alp8.jpeg",
    "assets/products/alp9.jpeg",
    "assets/products/alp10.jpeg"
  ];

  const mprImages = [
    "assets/products/mpr1.jpeg",
    "assets/products/mpr2.jpeg",
    "assets/products/mpr3.jpeg",
    "assets/products/mpr4.jpeg",
    "assets/products/mpr5.jpeg",
    "assets/products/mpr6.jpeg",
    "assets/products/mpr7.jpeg",
    "assets/products/mpr8.jpeg",
    "assets/products/mpr9.jpeg",
    "assets/products/mpr10.jpeg",
    "assets/products/mpr11.jpeg",
    "assets/products/mpr12.jpeg",
    "assets/products/mpr13.jpeg"
  ];

  const mrsImages = [
    "assets/products/mrs1.jpeg",
    "assets/products/mrs2.jpeg",
    "assets/products/mrs3.jpeg",
    "assets/products/mrs4.jpeg",
    "assets/products/mrs5.jpeg"
  ];

  const nbmImages = [
    "assets/products/nbm1.jpeg",
    "assets/products/nbm2.jpeg",
    "assets/products/nbm3.jpeg",
    "assets/products/nbm5.jpeg",
    "assets/products/nbm6.jpeg",
    "assets/products/nbm7.jpeg",
    "assets/products/nbm8.jpeg",
    "assets/products/nbm9.jpeg"
  ];

  let automationIndex = 0;
  let panelIndex = 0;
  let sectionIndex = 0;
  let jaluzIndex = 0;
  let fotocelIndex = 0;
  let rampaIndex = 0;
  let slagbaumIndex = 0;
  let tentIndex = 0;
  let bagIndex = 0;
  let pivotIndex = 0;
  let aluminumIndex = 0;
  let metalIndex = 0;
  let mdrIndex = 0;
  let alpIndex = 0;
  let mprIndex = 0;
  let mrsIndex = 0;
  let nbmIndex = 0;

  const automationImg = document.getElementById("automation-image");
  const panelImg = document.getElementById("panel-image");
  const sectionImg = document.getElementById("section-image");
  const jaluzImg = document.getElementById("jaluz-image");
  const fotocelImg = document.getElementById("fotocel-image");
  const rampaImg = document.getElementById("rampa-image");
  const slagbaumImg = document.getElementById("slagbaum-image");
  const tentImg = document.getElementById("tent-image");
  const bagImg = document.getElementById("bag-image");
  const pivotImg = document.getElementById("pivot-image");
  const aluminumImg = document.getElementById("aluminum-image");
  const metalImg = document.getElementById("metal-image");
  const mdrImg = document.getElementById("mdr-image");
  const alpImg = document.getElementById("alp-image");
  const mprImg = document.getElementById("mpr-image");
  const mrsImg = document.getElementById("mrs-image");
  const nbmImg = document.getElementById("nbm-image");
  const automationNextBtn = document.querySelectorAll('[data-next-image="automation"]');
  const automationPrevBtn = document.querySelectorAll('[data-prev-image="automation"]');
  const panelNextBtn = document.querySelectorAll('[data-next-image="panel"]');
  const panelPrevBtn = document.querySelectorAll('[data-prev-image="panel"]');
  const sectionNextBtn = document.querySelectorAll('[data-next-image="section"]');
  const sectionPrevBtn = document.querySelectorAll('[data-prev-image="section"]');
  const jaluzNextBtn = document.querySelectorAll('[data-next-image="jaluz"]');
  const jaluzPrevBtn = document.querySelectorAll('[data-prev-image="jaluz"]');
  const fotocelNextBtn = document.querySelectorAll('[data-next-image="fotocel"]');
  const fotocelPrevBtn = document.querySelectorAll('[data-prev-image="fotocel"]');
  const rampaNextBtn = document.querySelectorAll('[data-next-image="rampa"]');
  const rampaPrevBtn = document.querySelectorAll('[data-prev-image="rampa"]');
  const slagbaumNextBtn = document.querySelectorAll('[data-next-image="slagbaum"]');
  const slagbaumPrevBtn = document.querySelectorAll('[data-prev-image="slagbaum"]');
  const tentNextBtn = document.querySelectorAll('[data-next-image="tent"]');
  const tentPrevBtn = document.querySelectorAll('[data-prev-image="tent"]');
  const bagNextBtn = document.querySelectorAll('[data-next-image="bag"]');
  const bagPrevBtn = document.querySelectorAll('[data-prev-image="bag"]');
  const pivotNextBtn = document.querySelectorAll('[data-next-image="pivot"]');
  const pivotPrevBtn = document.querySelectorAll('[data-prev-image="pivot"]');
  const aluminumNextBtn = document.querySelectorAll('[data-next-image="aluminum"]');
  const aluminumPrevBtn = document.querySelectorAll('[data-prev-image="aluminum"]');
  const metalNextBtn = document.querySelectorAll('[data-next-image="metal"]');
  const metalPrevBtn = document.querySelectorAll('[data-prev-image="metal"]');
  const mdrNextBtn = document.querySelectorAll('[data-next-image="mdr"]');
  const mdrPrevBtn = document.querySelectorAll('[data-prev-image="mdr"]');
  const alpNextBtn = document.querySelectorAll('[data-next-image="alp"]');
  const alpPrevBtn = document.querySelectorAll('[data-prev-image="alp"]');
  const mprNextBtn = document.querySelectorAll('[data-next-image="mpr"]');
  const mprPrevBtn = document.querySelectorAll('[data-prev-image="mpr"]');
  const mrsNextBtn = document.querySelectorAll('[data-next-image="mrs"]');
  const mrsPrevBtn = document.querySelectorAll('[data-prev-image="mrs"]');
  const nbmNextBtn = document.querySelectorAll('[data-next-image="nbm"]');
  const nbmPrevBtn = document.querySelectorAll('[data-prev-image="nbm"]');

  // Avtomatlaşdırma növbəti şəkil
  if (automationNextBtn.length > 0 && automationImg) {
    automationNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        automationIndex = (automationIndex + 1) % automationImages.length;
        automationImg.src = automationImages[automationIndex];
      });
    });
  }

  // Avtomatlaşdırma əvvəlki şəkil
  if (automationPrevBtn.length > 0 && automationImg) {
    automationPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        automationIndex = (automationIndex - 1 + automationImages.length) % automationImages.length;
        automationImg.src = automationImages[automationIndex];
      });
    });
  }

  // Panel növbəti şəkil
  if (panelNextBtn.length > 0 && panelImg) {
    panelNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        panelIndex = (panelIndex + 1) % panelImages.length;
        panelImg.src = panelImages[panelIndex];
      });
    });
  }

  // Panel əvvəlki şəkil
  if (panelPrevBtn.length > 0 && panelImg) {
    panelPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        panelIndex = (panelIndex - 1 + panelImages.length) % panelImages.length;
        panelImg.src = panelImages[panelIndex];
      });
    });
  }

  // Seksiya növbəti şəkil
  if (sectionNextBtn.length > 0 && sectionImg) {
    sectionNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        sectionIndex = (sectionIndex + 1) % sectionImages.length;
        sectionImg.src = sectionImages[sectionIndex];
      });
    });
  }

  // Seksiya əvvəlki şəkil
  if (sectionPrevBtn.length > 0 && sectionImg) {
    sectionPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        sectionIndex = (sectionIndex - 1 + sectionImages.length) % sectionImages.length;
        sectionImg.src = sectionImages[sectionIndex];
      });
    });
  }

  // Jalüz növbəti şəkil
  if (jaluzNextBtn.length > 0 && jaluzImg) {
    jaluzNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        jaluzIndex = (jaluzIndex + 1) % jaluzImages.length;
        jaluzImg.src = jaluzImages[jaluzIndex];
      });
    });
  }

  // Jalüz əvvəlki şəkil
  if (jaluzPrevBtn.length > 0 && jaluzImg) {
    jaluzPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        jaluzIndex = (jaluzIndex - 1 + jaluzImages.length) % jaluzImages.length;
        jaluzImg.src = jaluzImages[jaluzIndex];
      });
    });
  }

  // FotoCell növbəti şəkil
  if (fotocelNextBtn.length > 0 && fotocelImg) {
    fotocelNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        fotocelIndex = (fotocelIndex + 1) % fotocelImages.length;
        fotocelImg.src = fotocelImages[fotocelIndex];
      });
    });
  }

  // FotoCell əvvəlki şəkil
  if (fotocelPrevBtn.length > 0 && fotocelImg) {
    fotocelPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        fotocelIndex = (fotocelIndex - 1 + fotocelImages.length) % fotocelImages.length;
        fotocelImg.src = fotocelImages[fotocelIndex];
      });
    });
  }

  // Rampa növbəti şəkil
  if (rampaNextBtn.length > 0 && rampaImg) {
    rampaNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        rampaIndex = (rampaIndex + 1) % rampaImages.length;
        rampaImg.src = rampaImages[rampaIndex];
      });
    });
  }

  // Rampa əvvəlki şəkil
  if (rampaPrevBtn.length > 0 && rampaImg) {
    rampaPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        rampaIndex = (rampaIndex - 1 + rampaImages.length) % rampaImages.length;
        rampaImg.src = rampaImages[rampaIndex];
      });
    });
  }

  // Şlaqbaum növbəti şəkil
  if (slagbaumNextBtn.length > 0 && slagbaumImg) {
    slagbaumNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        slagbaumIndex = (slagbaumIndex + 1) % slagbaumImages.length;
        slagbaumImg.src = slagbaumImages[slagbaumIndex];
      });
    });
  }

  // Şlaqbaum əvvəlki şəkil
  if (slagbaumPrevBtn.length > 0 && slagbaumImg) {
    slagbaumPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        slagbaumIndex = (slagbaumIndex - 1 + slagbaumImages.length) % slagbaumImages.length;
        slagbaumImg.src = slagbaumImages[slagbaumIndex];
      });
    });
  }

  // Tent növbəti şəkil
  if (tentNextBtn.length > 0 && tentImg) {
    tentNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        tentIndex = (tentIndex + 1) % tentImages.length;
        tentImg.src = tentImages[tentIndex];
      });
    });
  }

  // Tent əvvəlki şəkil
  if (tentPrevBtn.length > 0 && tentImg) {
    tentPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        tentIndex = (tentIndex - 1 + tentImages.length) % tentImages.length;
        tentImg.src = tentImages[tentIndex];
      });
    });
  }

  // Bağ mebeli növbəti şəkil
  if (bagNextBtn.length > 0 && bagImg) {
    bagNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        bagIndex = (bagIndex + 1) % bagImages.length;
        bagImg.src = bagImages[bagIndex];
      });
    });
  }

  // Bağ mebeli əvvəlki şəkil
  if (bagPrevBtn.length > 0 && bagImg) {
    bagPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        bagIndex = (bagIndex - 1 + bagImages.length) % bagImages.length;
        bagImg.src = bagImages[bagIndex];
      });
    });
  }

  // Pivot növbəti şəkil
  if (pivotNextBtn.length > 0 && pivotImg) {
    pivotNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        pivotIndex = (pivotIndex + 1) % pivotImages.length;
        pivotImg.src = pivotImages[pivotIndex];
      });
    });
  }

  // Pivot əvvəlki şəkil
  if (pivotPrevBtn.length > 0 && pivotImg) {
    pivotPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        pivotIndex = (pivotIndex - 1 + pivotImages.length) % pivotImages.length;
        pivotImg.src = pivotImages[pivotIndex];
      });
    });
  }

  // Aluminum növbəti şəkil
  if (aluminumNextBtn.length > 0 && aluminumImg) {
    aluminumNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        aluminumIndex = (aluminumIndex + 1) % aluminumImages.length;
        aluminumImg.src = aluminumImages[aluminumIndex];
      });
    });
  }

  // Aluminum əvvəlki şəkil
  if (aluminumPrevBtn.length > 0 && aluminumImg) {
    aluminumPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        aluminumIndex = (aluminumIndex - 1 + aluminumImages.length) % aluminumImages.length;
        aluminumImg.src = aluminumImages[aluminumIndex];
      });
    });
  }

  // Metal növbəti şəkil
  if (metalNextBtn.length > 0 && metalImg) {
    metalNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        metalIndex = (metalIndex + 1) % metalImages.length;
        metalImg.src = metalImages[metalIndex];
      });
    });
  }

  // Metal əvvəlki şəkil
  if (metalPrevBtn.length > 0 && metalImg) {
    metalPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        metalIndex = (metalIndex - 1 + metalImages.length) % metalImages.length;
        metalImg.src = metalImages[metalIndex];
      });
    });
  }

  // MDR növbəti şəkil
  if (mdrNextBtn.length > 0 && mdrImg) {
    mdrNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        mdrIndex = (mdrIndex + 1) % mdrImages.length;
        mdrImg.src = mdrImages[mdrIndex];
      });
    });
  }

  // MDR əvvəlki şəkil
  if (mdrPrevBtn.length > 0 && mdrImg) {
    mdrPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        mdrIndex = (mdrIndex - 1 + mdrImages.length) % mdrImages.length;
        mdrImg.src = mdrImages[mdrIndex];
      });
    });
  }

  // ALP növbəti şəkil
  if (alpNextBtn.length > 0 && alpImg) {
    alpNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        alpIndex = (alpIndex + 1) % alpImages.length;
        alpImg.src = alpImages[alpIndex];
      });
    });
  }

  // ALP əvvəlki şəkil
  if (alpPrevBtn.length > 0 && alpImg) {
    alpPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        alpIndex = (alpIndex - 1 + alpImages.length) % alpImages.length;
        alpImg.src = alpImages[alpIndex];
      });
    });
  }

  // MPR növbəti şəkil
  if (mprNextBtn.length > 0 && mprImg) {
    mprNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        mprIndex = (mprIndex + 1) % mprImages.length;
        mprImg.src = mprImages[mprIndex];
      });
    });
  }

  // MPR əvvəlki şəkil
  if (mprPrevBtn.length > 0 && mprImg) {
    mprPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        mprIndex = (mprIndex - 1 + mprImages.length) % mprImages.length;
        mprImg.src = mprImages[mprIndex];
      });
    });
  }

  // MRS növbəti şəkil
  if (mrsNextBtn.length > 0 && mrsImg) {
    mrsNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        mrsIndex = (mrsIndex + 1) % mrsImages.length;
        mrsImg.src = mrsImages[mrsIndex];
      });
    });
  }

  // MRS əvvəlki şəkil
  if (mrsPrevBtn.length > 0 && mrsImg) {
    mrsPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        mrsIndex = (mrsIndex - 1 + mrsImages.length) % mrsImages.length;
        mrsImg.src = mrsImages[mrsIndex];
      });
    });
  }

  // NBM növbəti şəkil
  if (nbmNextBtn.length > 0 && nbmImg) {
    nbmNextBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        nbmIndex = (nbmIndex + 1) % nbmImages.length;
        nbmImg.src = nbmImages[nbmIndex];
      });
    });
  }

  // NBM əvvəlki şəkil
  if (nbmPrevBtn.length > 0 && nbmImg) {
    nbmPrevBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        nbmIndex = (nbmIndex - 1 + nbmImages.length) % nbmImages.length;
        nbmImg.src = nbmImages[nbmIndex];
      });
    });
  }
});

