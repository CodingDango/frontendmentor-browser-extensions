let card_container = document.getElementById("card-container");
let card_container_controls = document.getElementById("card-container-controls");
let card_container_elements = [];


// Day and night system modes
let layout_btn = document.querySelector("#layout-checkbox");
layout_btn.addEventListener("click", function(event) {
    let layout_label = layout_btn.previousElementSibling;
    layout_label.classList.toggle("checked");
    document.querySelector("body").classList.toggle("light-mode");

    document.querySelector("#logo-text").classList.toggle("light-mode");
});

card_container.addEventListener("click", function(event) {

    let extension_card = event.target.closest('.card');

    // Remove functionality button for the cards
    if (event.target.classList.contains("remove")) {

        if (extension_card)  {
            extension_card.remove();

            let idx = card_container_elements.indexOf(extension_card);
            if (idx > -1) {
                card_container_elements.splice(idx, 1);
                console.log("Extension card deleted in memory\n");
            }
        }
    }

    // Enable/disable functionality for the cards
    if (event.target.classList.contains("slider")) {

        if (extension_card.classList.contains("enabled")) {
            
            extension_card.classList.remove('enabled');
            let idx = card_container_elements.indexOf(extension_card);
            card_container_elements.at(idx).classList.remove('enabled');
        }

        else {
            extension_card.classList.add("enabled");
            let idx = card_container_elements.indexOf(extension_card);
            card_container_elements.at(idx).classList.add('enabled');
        }    
    }   
});

card_container_controls.addEventListener("click", function(event) {

    handle_filter();

});

function handle_filter() {
    if (document.getElementById("filter-all").checked)
        display_cards(function(card) {return true});

    else if (document.getElementById("filter-active").checked) {
        display_cards(function(card) {return (card.classList.contains("enabled"))});
    }

    else if (document.getElementById("filter-inactive").checked) {
        display_cards(function(card) {return (!card.classList.contains("enabled"))});
    }
}


function load_extension_cards() {
    fetch("./data.json")
    .then(response => response.json())
    .then(parsed_json => {
        for (let i = 0; i < parsed_json.length; i++)
            {
                let curr = parsed_json[i];
                add_extension_card(curr["name"], curr["logo"], curr["description"], curr["is_active"]);
            }
            
        let card_nodes = card_container.querySelectorAll(".card");
        card_container_elements = Array.from(card_nodes);
    });
}

function add_extension_card(name, logo_path, description, is_active) {
    let card_template = `
    <div class="card">
        <div class="card-info">
                <img src=${logo_path} class="extension-img">
                <div class="card-text">
                    <div class="card-title">${name}</div>
                    <div class="card-description">${description}</div>
                </div>
        </div>
        <div class="card-controls">
            <input type="button" value="Remove" class="card-button remove">
            <label class="switch">
                <input type="checkbox">
                <span class="slider round"></span>
            </label>
        </div>
    </div>`;

    card_container.insertAdjacentHTML("beforeend", card_template);
}

function display_cards(lambda) {
    // Check how to display the cards
    card_container.innerHTML = '';

    for (let i = 0; i < card_container_elements.length; i++) {

        if (lambda(card_container_elements[i])) {
            console.log("appended.\n")
            card_container.appendChild(card_container_elements[i]);

        }
    }
}

load_extension_cards();

