export const orders = JSON.parse(localStorage.getItem('orders')) || [];  //convert in to Array

export function addOrder(order){
    orders.unshift(order);  //add element into thr first array
    saveToStorage();
}

function saveToStorage(){
    localStorage.setItem('orders', JSON.stringify(orders));
}