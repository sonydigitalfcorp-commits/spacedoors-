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

  function saveProducts() {
    try {
      localStorage.setItem("spacedoorsProducts", JSON.stringify(products));
      alert("Изменения сохранены!");
    } catch {
      alert("Ошибка при сохранении!");
    }
  }

  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Admin panel
  const productSelect = document.getElementById("admin-product-select");
  const titleInput = document.getElementById("admin-title");
  const descInput = document.getElementById("admin-description");
  const priceInput = document.getElementById("admin-price");
  const imageInput = document.getElementById("admin-image");
  const saveBtn = document.getElementById("admin-save");
  const resetBtn = document.getElementById("admin-reset");

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
    });

    resetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = productSelect.value;
      const base = defaultProducts[id];
      if (!base) return;

      if (confirm("Вы уверены, что хотите сбросить изменения для этого товара?")) {
        products[id] = { ...base };
        saveProducts();
        loadForm(id);
      }
    });

    // Initial form load
    const firstId = Object.keys(defaultProducts)[0];
    productSelect.value = firstId;
    loadForm(firstId);
  }
});
