const tombolTema = document.querySelector("#btn-tema");
function toggleTema(){
    document.body.classList.toggle("dark-mode");
    const temaSekarang = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("tema_galih", temaSekarang);
}
tombolTema.addEventListener("click", toggleTema);

// Muat preferensi tema saat halaman dibuka
if (localStorage.getItem("tema_galih") === "dark") {
    document.body.classList.add("dark-mode");
}

const tombolInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");
tombolInfo.addEventListener("click", () => {
    kotakAside.classList.toggle("tersembunyi");
});


const BASE = "https://jsonplaceholder.typicode.com";
const containerArtikel = document.querySelector(".daftar-artikel");
const loadingIndicator = document.querySelector("#loading");

async function muatArtikelDariAPI() {
    if (loadingIndicator) loadingIndicator.style.display = "flex"; // Tampilkan Spinner
    
    try {
        const response = await fetch(BASE + "/posts?_limit=5");
        if (!response.ok) throw new Error("Status: " + response.status);
        
        const daftarPost = await response.json();
        containerArtikel.innerHTML = ""; // Bersihkan layar

        // Simpan/ambil data like dari localStorage
        const semuaLike = JSON.parse(localStorage.getItem("semuaLike_galih")) || {};

        daftarPost.forEach((post) => {
            const article = document.createElement("article");
            
            const judul = document.createElement("h3");
            judul.textContent = post.title;
            
            const isi = document.createElement("p");
            isi.textContent = post.body;

            const tombolLike = document.createElement("button");
            let jumlahLike = semuaLike[post.title] || 0;
            tombolLike.textContent = `Like (${jumlahLike})`;
            tombolLike.dataset.like = jumlahLike;
            tombolLike.style.marginRight = "10px";

            const tombolHapus = document.createElement("button");
            tombolHapus.textContent = "Hapus Artikel";

            article.appendChild(judul);
            article.appendChild(isi);
            article.appendChild(tombolLike);
            article.appendChild(tombolHapus);
            containerArtikel.appendChild(article);
        });

    } catch (error) {
        console.error(error);
        containerArtikel.innerHTML = "<p style='color:red;'>Gagal memuat artikel dari server.</p>";
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = "none"; // Sembunyikan Spinner
    }
}
muatArtikelDariAPI();

containerArtikel.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        if (e.target.textContent.startsWith("Like")) {
            let jumlah = parseInt(e.target.dataset.like || 0);
            jumlah++;
            e.target.dataset.like = jumlah;
            e.target.textContent = `Like (${jumlah})`;
            
            // Simpan ke localStorage
            const judul = e.target.closest("article").querySelector("h3").textContent;
            const semuaLike = JSON.parse(localStorage.getItem("semuaLike_galih")) || {};
            semuaLike[judul] = jumlah;
            localStorage.setItem("semuaLike_galih", JSON.stringify(semuaLike));
            
        } else if (e.target.textContent === "Hapus Artikel") {
            e.target.closest("article").remove();
        }
    }
});


const btnTambahArtikel = document.querySelector("#btn-tambah-artikel");
if (btnTambahArtikel) {
    btnTambahArtikel.addEventListener("click", () => {
        const inputJudul = document.querySelector("#input-judul-artikel");
        const inputIsi = document.querySelector("#input-isi-artikel");
        
        const judulBaru = inputJudul.value.trim();
        const isiBaru = inputIsi.value.trim();

        if (judulBaru === "" || isiBaru === "") {
            alert("Judul dan isi artikel tidak boleh kosong!");
            return;
        }

        const article = document.createElement("article");
        const judul = document.createElement("h3");
        judul.textContent = judulBaru;
        const isi = document.createElement("p");
        isi.innerText = isiBaru;

        const tombolLike = document.createElement("button");
        tombolLike.textContent = "Like (0)";
        tombolLike.dataset.like = 0;
        tombolLike.style.marginRight = "10px";

        const tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus Artikel";

        article.appendChild(judul);
        article.appendChild(isi);
        article.appendChild(tombolLike);
        article.appendChild(tombolHapus);
        containerArtikel.appendChild(article);

        inputJudul.value = "";
        inputIsi.value = "";
    });
}


containerArtikel.addEventListener("mouseover", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.add("artikel-hover");
});

containerArtikel.addEventListener("mouseout", (e) => {
    const article = e.target.closest("article");
    if (article) article.classList.remove("artikel-hover");
});

containerArtikel.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        if (e.target.textContent.startsWith("Like")) {
            let jumlah = parseInt(e.target.dataset.like || 0);
            jumlah++;
            e.target.dataset.like = jumlah;
            e.target.textContent = `Like (${jumlah})`;
        } else if (e.target.textContent === "Hapus Artikel") {
            e.target.closest("article").remove();
        }
    }
});


const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");
const pesanError = document.querySelector("#pesan-error");


function muatKomentar() {
    const daftar = JSON.parse(localStorage.getItem("komentar_galih")) || [];
    daftar.forEach((k) => {
        const itemKomentar = document.createElement("li");
        itemKomentar.style.marginBottom = "10px";
        itemKomentar.innerHTML = `<span>${k.nama}: ${k.pesan} </span><button style="margin-left:10px;">Hapus</button>`;
        if(daftarKomentar) daftarKomentar.appendChild(itemKomentar);
    });
}

if (formKomentar && daftarKomentar) {
    muatKomentar(); 


    formKomentar.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        const nama = document.querySelector("#input-nama").value.trim();
        const pesan = document.querySelector("#input-pesan").value.trim();

        if (nama === "" || pesan.length < 5) {
            pesanError.textContent = "Nama wajib diisi & Komentar minimal 5 karakter!";
            pesanError.style.display = "block";
            return;
        }
        pesanError.style.display = "none"; 

        const itemKomentar = document.createElement("li");
        itemKomentar.style.marginBottom = "10px";
        itemKomentar.innerHTML = `<span>${nama}: ${pesan} </span><button style="margin-left:10px;">Hapus</button>`;
        daftarKomentar.appendChild(itemKomentar);


        const simpanan = JSON.parse(localStorage.getItem("komentar_galih")) || [];
        simpanan.push({ nama, pesan });
        localStorage.setItem("komentar_galih", JSON.stringify(simpanan));

        formKomentar.reset();
    });

    daftarKomentar.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON" && e.target.textContent === "Hapus") {
            e.target.closest("li").remove();
        }
    });
}


const btnHapusSemua = document.querySelector("#btn-hapus-semua");
if (btnHapusSemua) {
    btnHapusSemua.addEventListener("click", () => {
        daftarKomentar.innerHTML = "";
    });
}

const tombolReset = document.querySelector("#btn-reset") || document.querySelector("#btn-reset_galih");
if (tombolReset) {
    tombolReset.addEventListener("click", () => {
        const konfirmasi = confirm("Hapus semua data tersimpan?");
        if (konfirmasi) {
            // Gunakan removeItem agar tidak menghapus data temanmu secara tidak sengaja
            localStorage.removeItem("komentar_galih");
            localStorage.removeItem("tema_galih");
            location.reload(); 
        }
    });
}


document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key.toLowerCase() === "d") {
        toggleTema(); // Gunakan fungsi toggleTema agar perubahan lewat shortcut juga tersimpan
    }
});

const btnKembaliAtas = document.querySelector("#btn-kembali-atas");
if (btnKembaliAtas) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            btnKembaliAtas.style.display = "block";
        } else {
            btnKembaliAtas.style.display = "none";
        }
    });

    btnKembaliAtas.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
  async function muatProfilPenulis() {
  const namaEl = document.querySelector("#nama-penulis");
  const emailEl = document.querySelector("#email-penulis");
  if (!namaEl || !emailEl) return;
  try {
    const response = await fetch(BASE + "/users/1");
    if (!response.ok) throw new Error("Status: " + response.status);
    const user = await response.json();
    namaEl.textContent = user.name;
    emailEl.textContent = user.email;
  } catch (error) {
    console.error("Gagal memuat profil penulis:", error);
  }
}
muatProfilPenulis();