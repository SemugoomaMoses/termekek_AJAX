// Hibaüzenet megjelenítése, a termék részeinek elrejtése
function hibaMegjelenit(uzenet) {
    var hiba = document.getElementById("hiba");
    hiba.textContent = uzenet;
    hiba.style.display = "block";
    document.getElementById("termek-felso").style.display = "none";
    document.getElementById("termek-also").style.display = "none";
}

// Csillagok szöveggel: pl. 4.8 -> ★★★★★
function csillagok(pont) {
    var egesz = Math.round(pont);
    return "★".repeat(egesz) + "☆".repeat(5 - egesz);
}

// Bélyegkép kattintás: a nagy képre kerül, a kijelölés átvándorol
function belyegKattintas() {
    document.getElementById("termek-kep").src = this.src;
    var mind = document.querySelectorAll("#belyegek img");
    for (var i = 0; i < mind.length; i++) {
        mind[i].className = "";
    }
    this.className = "aktiv";
}

// A beolvasott objektum adatainak kiírása az oldalra
function termekMegjelenit(t) {
    document.title = t.name;

    // felső rész
    document.getElementById("termek-kep").src = t.image;
    document.getElementById("termek-kep").alt = t.name;
    document.getElementById("termek-nev").textContent = t.name;
    document.getElementById("termek-leiras").textContent = t.description;
    document.getElementById("termek-ertekeles").textContent =
        csillagok(t.rating) + " " + t.rating + " (" + t.reviews.length + " értékelés)";
    document.getElementById("termek-ar").textContent =
        t.price.toLocaleString("hu-HU") + " " + t.currency;

    var keszlet = document.getElementById("termek-keszlet");
    if (t.stock > 0) {
        keszlet.textContent = "✔ Raktáron (" + t.stock + " db)";
        keszlet.className = "van";
    } else {
        keszlet.textContent = "✖ Nincs raktáron";
        keszlet.className = "nincs";
        document.getElementById("kosar-gomb").disabled = true;
    }

    document.getElementById("gyarto-nev").textContent = t.manufacturer.name;
    document.getElementById("gyarto-orszag").textContent = t.manufacturer.country;

    // bélyegképek (a JSON-ban egy kép van, ezért ugyanazt használjuk 4x)
    var belyegek = document.getElementById("belyegek");
    for (var k = 0; k < 4; k++) {
        var kep = document.createElement("img");
        kep.src = t.image;
        kep.alt = t.name + " – " + (k + 1) + ". kép";
        if (k === 0) {
            kep.className = "aktiv";
        }
        kep.addEventListener("click", belyegKattintas);
        belyegek.appendChild(kep);
    }

    // alsó rész: leírás
    document.getElementById("hosszu-leiras").textContent = t.description;

    // főbb jellemzők (tömb bejárása)
    var lista = document.getElementById("jellemzok");
    for (var i = 0; i < t.features.length; i++) {
        var li = document.createElement("li");
        li.textContent = t.features[i];
        lista.appendChild(li);
    }

    // vélemények (objektumok tömbje)
    var velemenyek = document.getElementById("velemenyek");
    for (var j = 0; j < t.reviews.length; j++) {
        var doboz = document.createElement("div");
        doboz.className = "velemeny";

        var avatar = document.createElement("span");
        avatar.className = "avatar";
        avatar.textContent = t.reviews[j].user.charAt(0);

        var tartalom = document.createElement("div");

        var nev = document.createElement("strong");
        nev.textContent = t.reviews[j].user;

        var csillag = document.createElement("div");
        csillag.className = "csillag";
        csillag.textContent = "★★★★★";

        var szoveg = document.createElement("p");
        szoveg.textContent = t.reviews[j].comment;

        tartalom.appendChild(nev);
        tartalom.appendChild(csillag);
        tartalom.appendChild(szoveg);

        doboz.appendChild(avatar);
        doboz.appendChild(tartalom);
        velemenyek.appendChild(doboz);
    }
}

// AJAX kérés
function termekBetolt() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "termek.json", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                var termek = JSON.parse(xhr.responseText);
                termekMegjelenit(termek);
            } catch (e) {
                hibaMegjelenit("A termék adatai hibás formátumúak.");
            }
        } else {
            hibaMegjelenit("A termék adatai nem érhetők el (hibakód: " + xhr.status + ").");
        }
    };

    xhr.onerror = function () {
        hibaMegjelenit("Hálózati hiba, a termék adatai nem tölthetők be.");
    };

    xhr.send();
}

// Az oldal betöltődésekor indul a kérés
window.addEventListener("load", termekBetolt);