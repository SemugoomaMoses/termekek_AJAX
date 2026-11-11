
function hibaMegjelenit(uzenet) {
    var hiba = document.getElementById("hiba");
    hiba.textContent = uzenet;
    hiba.style.display = "block";
    document.getElementById("termek-felso").style.display = "none";
    document.getElementById("termek-also").style.display = "none";
    document.getElementById("hasonlo").style.display = "none";
}


function csillagok(pont) {
    var egesz = Math.round(pont);
    return "★".repeat(egesz) + "☆".repeat(5 - egesz);
}


function ikonValaszt(szoveg) {
    var s = szoveg.toLowerCase();
    if (s.includes("core") || s.includes("ryzen") || s.includes("processzor")) return "bi-cpu";
    if (s.includes("ram")) return "bi-memory";
    if (s.includes("ssd") || s.includes("hdd")) return "bi-device-hdd";
    if (s.includes("rtx") || s.includes("gtx") || s.includes("radeon")) return "bi-gpu-card";
    if (s.includes("kijelző") || s.includes("hz")) return "bi-display";
    if (s.includes("windows")) return "bi-windows";
    return "bi-check2-circle";   // ha egyik sem illik
}


function velemenyKeszit(v) {
    var doboz = document.createElement("div");
    doboz.className = "velemeny";

    var avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.textContent = v.user.charAt(0);

    var tartalom = document.createElement("div");

    var nev = document.createElement("strong");
    nev.textContent = v.user;

    var csillag = document.createElement("div");
    csillag.className = "csillag";
    csillag.textContent = "★★★★★";

    var szoveg = document.createElement("p");
    szoveg.textContent = v.comment;

    tartalom.appendChild(nev);
    tartalom.appendChild(csillag);
    tartalom.appendChild(szoveg);

    doboz.appendChild(avatar);
    doboz.appendChild(tartalom);
    return doboz;
}

function sorKeszit(kulcs, ertek) {
    var sor = document.createElement("tr");
    var th = document.createElement("th");
    var td = document.createElement("td");
    th.textContent = kulcs;
    td.textContent = ertek;
    sor.appendChild(th);
    sor.appendChild(td);
    return sor;
}


function belyegKattintas() {
    document.getElementById("termek-kep").src = this.src;
    var mind = document.querySelectorAll("#belyegek img");
    for (var i = 0; i < mind.length; i++) {
        mind[i].className = "";
    }
    this.className = "aktiv";
}


function fulValtas() {
    var fulek = document.querySelectorAll(".ful");
    var panelek = document.querySelectorAll(".panel");

    for (var i = 0; i < fulek.length; i++) {
        fulek[i].classList.remove("aktiv");
    }
    for (var j = 0; j < panelek.length; j++) {
        panelek[j].classList.remove("aktiv");
    }

    this.classList.add("aktiv");
    document.getElementById(this.dataset.ful).classList.add("aktiv");
}



function fulekInicializal() {
    var fulek = document.querySelectorAll(".ful");
    for (var i = 0; i < fulek.length; i++) {
        fulek[i].addEventListener("click", fulValtas);
    }

    // "Összes vélemény megtekintése": átvált a Vélemények fülre
    document.getElementById("osszes-velemeny").addEventListener("click", function (e) {
        e.preventDefault();   // ne ugorjon az oldal tetejére
        document.querySelector('.ful[data-ful="ful-velemenyek"]').click();
    });
}


function termekMegjelenit(t) {
    document.title = t.name;


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


    document.getElementById("hosszu-leiras").textContent = t.description;


    var tabla = document.getElementById("tulajdonsagok");
    tabla.appendChild(sorKeszit("Gyártó", t.manufacturer.name));
    tabla.appendChild(sorKeszit("Származási ország", t.manufacturer.country));
    tabla.appendChild(sorKeszit("Készlet", t.stock + " db"));
    for (var f = 0; f < t.features.length; f++) {
        tabla.appendChild(sorKeszit("Jellemző " + (f + 1), t.features[f]));
    }


    document.getElementById("velemeny-db").textContent = t.reviews.length;
    var fulVelemenyek = document.getElementById("velemenyek-ful");
    for (var r = 0; r < t.reviews.length; r++) {
        fulVelemenyek.appendChild(velemenyKeszit(t.reviews[r]));
    }


    var lista = document.getElementById("jellemzok");
    for (var i = 0; i < t.features.length; i++) {
        var li = document.createElement("li");

        var ikon = document.createElement("i");
        ikon.className = "bi " + ikonValaszt(t.features[i]);

        li.appendChild(ikon);
        li.appendChild(document.createTextNode(t.features[i]));
        lista.appendChild(li);
    }


    var velemenyek = document.getElementById("velemenyek");
    for (var j = 0; j < t.reviews.length; j++) {
        velemenyek.appendChild(velemenyKeszit(t.reviews[j]));
    }
}


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

window.addEventListener("load", function () {
    fulekInicializal();
    termekBetolt();
});