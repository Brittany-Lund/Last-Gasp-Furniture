
const items = ["Chair", "Recliner", "Table", "Umbrella"]; 
const prices = [25.50, 37.75, 49.95, 24.89]; 
const states = [ 
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
];

let purchasedItems = []; 
let quantities = []; 


document.addEventListener('DOMContentLoaded', function () {
    const purchaseBtn = document.getElementById('purchaseBtn'); 
    const invoiceElement = document.getElementById('invoice'); 
    const resetBtn = document.getElementById('resetBtn'); 

    
    if (purchaseBtn && invoiceElement && resetBtn) {
        purchaseBtn.addEventListener('click', makePurchase); 

        
        resetBtn.addEventListener('click', resetPage); 
    } else {
        console.error('Required elements not found'); 
    }
});


function makePurchase() {
    let total = 0; 
    let moreItems = true; 

    
    while (moreItems) {
        let item = prompt("What item would you like to buy today: Chair, Recliner, Table, or Umbrella?").trim().toLowerCase();
        item = capitalizeFirstLetter(item); 

        if (items.includes(item)) { 
            let index = items.indexOf(item); 
            let quantity = parseInt(prompt(`How many ${item} would you like to buy?`));
            if (!isNaN(quantity) && quantity > 0) { 
                purchasedItems.push(item); 
                quantities.push(quantity); 
                total += prices[index] * quantity;
            } else {
                alert("Invalid quantity entered. Please try again."); 
                continue; 
            }
        } else {
            alert("Item not found. Please enter Chair, Recliner, Table, or Umbrella."); 
            continue; 
        }

        moreItems = confirm("Continue shopping? y/n"); 
    }

    let state = prompt("Please enter the two-letter state abbreviation.").trim().toUpperCase(); 
    while (!states.includes(state)) { 
        state = prompt("Invalid state abbreviation. Please enter the two-letter state abbreviation.").trim().toUpperCase();
    }

    let zip = parseInt(prompt("Please enter your ZIP code.")); 
    let shipping = calculateShipping(state, zip, total); 
    let subTotal = total + shipping; 
    let tax = subTotal * 0.15; 
    let invoiceTotal = total + tax + shipping; 

    displayInvoice(state, total, tax, shipping, invoiceTotal, subTotal); 
}

function calculateShipping(state, zip, total) {
    let zone = getShippingZone(state, zip); 
    if (total > 100) {
        return 0; 
    }
    switch (zone) { 
        case 1: return 0;
        case 2: return 20;
        case 3: return 30;
        case 4: return 35;
        case 5: return 45;
        case 6: return 60;
    }
}


function getShippingZone(state, zip) {
    
    if (["ME", "NH", "VT", "MA", "RI", "CT", "NY", "NJ", "PA", "DE", "MD", "VA", "WV"].includes(state)) return 1;
    if (["OH", "IN", "KY", "TN", "NC", "SC", "GA", "FL", "AL", "MS"].includes(state)) return 2;
    if (["MI", "IL", "WI", "MO", "AR", "LA", "TX", "OK"].includes(state)) return 3;
    if (["ND", "SD", "NE", "KS", "CO", "WY", "MT", "NM", "UT", "AZ"].includes(state)) return 4;
    if (["WA", "OR", "ID", "NV", "CA"].includes(state)) return 5;
    if (["AK", "HI"].includes(state)) return 6;

    
    if (state === "CA") {
        if (zip >= 90001 && zip <= 93599) return 5;
        if (zip >= 93600 && zip <= 96199) return 4;
    }
    if (state === "TX") {
        if (zip >= 75001 && zip <= 79999) return 3;
        if (zip >= 73301 && zip <= 73399) return 4;
    }
    if (state === "NY") {
        if (zip >= 10001 && zip <= 11999) return 1;
        if (zip >= 12000 && zip <= 14999) return 2;
    }
    if (state === "FL") {
        if (zip >= 32000 && zip <= 34999) return 2;
        if (zip >= 33000 && zip <= 33999) return 3;
    }
    if (state === "PA") {
        if (zip >= 15000 && zip <= 19699) return 2;
        if (zip >= 19700 && zip <= 19999) return 1;
    }
    if (state === "MO") {
        if (zip >= 63000 && zip <= 65899) return 4;
        if (zip >= 64000 && zip <= 65999) return 3;
    }
    if (state === "GA") {
        if (zip >= 30000 && zip <= 31999) return 2;
        if (zip >= 39900 && zip <= 39999) return 3;
    }
    if (state === "NC") {
        if (zip >= 27000 && zip <= 28999) return 2;
        if (zip >= 28900 && zip <= 28999) return 3;
    }

    // Default return for unhandled cases
    return "Unknown Zone";
}

// Function to display the invoice to the user
function displayInvoice(state, total, tax, shipping, invoiceTotal, subTotal) {
    const invoiceElement = document.getElementById('invoice'); // Invoice display element
    const purchaseContainer = document.getElementById('purchase-container'); // Container for purchase inputs
    const invoiceContainer = document.getElementById('invoice-container'); // Container for the invoice
    const resetBtn = document.getElementById('resetBtn'); // Reset button

    // Check if the necessary elements exist
    if (invoiceElement && purchaseContainer && invoiceContainer && resetBtn) {
        let invoiceHTML = `<table><tr><th>Item</th><th>Quantity</th><th>Unit Price</th><th>Price</th></tr>`; // Start invoice table
        for (let i = 0; i < purchasedItems.length; i++) {
            let totalPrice = (quantities[i] * prices[items.indexOf(purchasedItems[i])]).toFixed(2); // Calculate total price for each item
            invoiceHTML += `<tr><td>${purchasedItems[i]}</td><td>${quantities[i]}</td><td>${prices[items.indexOf(purchasedItems[i])]}</td><td>${totalPrice}</td></tr>`;
        }        
        // Add summary rows for total, shipping, subtotal, tax, and invoice total
        invoiceHTML += `<table><tr><th style='text-align:left;'>Item Total:</th><td style='padding-left:322px;'>${total.toFixed(2)}</td></tr>`;      
        invoiceHTML += `<tr><th style='text-align:left;'>Shipping to ${state}:</th><td style='padding-left:322px;'>$${shipping.toFixed(2)}</td></tr>`;
        invoiceHTML += `<tr><th style='text-align:left;'>Subtotal:</th><td style='padding-left:322px;'>$${subTotal.toFixed(2)}</td></tr>`;
        invoiceHTML += `<tr><th style='text-align:left;'>Tax:</th><td style='padding-left:322px;'>$${tax.toFixed(2)}</td></tr>`;
        invoiceHTML += `<tr><th style='text-align:left;'>Invoice Total:</th><td style='padding-left:322px;'>$${invoiceTotal.toFixed(2)}</td></tr>`;
        invoiceHTML += `<table><br></table>`; // Close the table

        // Display the invoice and hide the purchase form
        invoiceElement.innerHTML = invoiceHTML;
        purchaseContainer.style.display = 'none';
        invoiceContainer.style.display = 'block';
        resetBtn.style.display = 'block'; // Show the reset button
    } else {
        console.error('One or more elements for displaying the invoice not found'); // Error if elements are missing
    }
}

// Function to reset the page for a new purchase
function resetPage() {
    purchasedItems = []; 
    quantities = []; 
    document.getElementById('invoice-container').style.display = 'none'; // Hide the invoice
    document.getElementById('purchase-container').style.display = 'block'; // Show the purchase form
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1); 
}
