document.addEventListener("DOMContentLoaded", () => {
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

      const whatsappUrl = `https://wa.me/994503249853?text=${text}`;

      window.open(whatsappUrl, "_blank");
    });
  }

  // Admin panel
  const productSelect = document.getElementById("admin-product-select");
  const titleInput = document.getElementById("admin-title");
  const descInput = document.getElementById("admin-description");
  const priceInput = document.getElementById("admin-price");
  const imageInput = document.getElementById("admin-image");
  const saveBtn = document.getElementById("admin-save");
  const resetBtn = document.getElementById("admin-reset");

  function saveProducts() {
    try {
      localStorage.setItem("spacedoorsProducts", JSON.stringify(products));
    } catch {
      // ignore
    }
  }

  function loadForm(id) {
    const base = defaultProducts[id];
    const p = products[id] || base;
    if (!p || !base) return;

    titleInput.value = p.title || base.title || "";
    descInput.value = p.description || base.description || "";
    priceInput.value = p.price || "";
    imageInput.value = p.imageUrl || "";
  }

  if (
    productSelect &&
    titleInput &&
    descInput &&
    priceInput &&
    imageInput &&
    saveBtn &&
    resetBtn
  ) {
    // Fill select options
    productSelect.innerHTML = "";
    Object.entries(defaultProducts).forEach(([id, product]) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = product.title;
      productSelect.appendChild(opt);
    });

    productSelect.addEventListener("change", () => {
      loadForm(productSelect.value);
    });

    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = productSelect.value;
      const base = defaultProducts[id];
      if (!base) return;

      products[id] = {
        ...products[id],
        title: titleInput.value.trim() || base.title,
        description: descInput.value.trim() || base.description,
        price: priceInput.value.trim(),
        imageUrl: imageInput.value.trim(),
      };

      saveProducts();
      applyProductsToDOM();
    });

    resetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = productSelect.value;
      const base = defaultProducts[id];
      if (!base) return;

      products[id] = { ...base };
      saveProducts();
      loadForm(id);
      applyProductsToDOM();
    });

    // Initial form load
    const firstId = Object.keys(defaultProducts)[0];
    productSelect.value = firstId;
    loadForm(firstId);
  }

  // Initial render of products
  applyProductsToDOM();
});

