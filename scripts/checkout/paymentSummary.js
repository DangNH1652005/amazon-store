import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary(){
    //check count Product on cart
    let countProduct = 0;
    let countCartItem = 0;
    cart.forEach((cartItem)=>{
        countProduct += cartItem.quantity;
        if(cartItem){
            countCartItem++;
        }
    });

    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        //get the full product
        const product = getProduct(cartItem.productId);
        //price * quantity
        productPriceCents += product.priceCents * cartItem.quantity;
        
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCent = totalBeforeTaxCents * 0.1;

    const totalCents = totalBeforeTaxCents + taxCent;

    //console.log(shippingPriceCents);
    const paymentSummaryHTML = 
    `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (${countProduct}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCent)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
        </div>

        <button class="place-order-button button-primary js-place-order">
            Place your order
        </button>
        <button class="remove-localStorage js-remove-data">Remove data localStorage</button>
    `

    document.querySelector('.js-payment-summary')
        .innerHTML = paymentSummaryHTML;

    //Tao tu them
    document.querySelector('.js-return-home').textContent = `${countCartItem} items`;

    document.querySelector('.js-place-order')
        .addEventListener('click', async ()=>{
            try{
                const response = await fetch('https://supersimplebackend.dev/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cart: cart
                    })
                });

                const order = await response.json();  // Chờ lấy dữ liệu JSON từ response HTTP
                addOrder(order);
            } catch(error){
                console.log('Unexpected error. Try again later.');
            }

            window.location.href = 'orders.html';
        });

    document.querySelector('.js-remove-data')
        .addEventListener('click', ()=>{
            localStorage.removeItem('orders');
        });
};