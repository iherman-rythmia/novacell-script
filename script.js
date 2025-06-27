
    const lead_id='abcdefg111';

    function processSubmit(){
    const choice = document.querySelector('input[name="choice"]:checked').value;
    let promo = document.getElementById("promo").value;

    if (promo !== ''){
    if (promo.search(/STEM\d+/) !== 0){
    document.getElementById("errors").innerHTML = "You must provide a valid promo code";
    document.getElementById("errors").style.color = 'red';
    return;
} else {
    promo = promo.replace('STEM','');
}
    if (promo < 0){
    document.getElementById("errors").innerHTML = "You must provide a valid promo code";
    document.getElementById("errors").style.color = 'red';
    return;

}
} else {
    promo = 0;
}

    const billing_info = {
    "id":null,
    "first_name": 'Joe',
    "last_name": 'Blow',
    "address_line_1":'123 Somewhere Dr',
    "address_line_2": '',
    "city": 'Bala',
    "state": 'ON',
    "postal_code": 'P0A1A1',
    "country": 'CA',
    "phone": '6472233061',
    "email": 'michael.stairs+nova@gmail.com'
};

    sendInvoice(choice, billing_info, lead_id, promo);

}


    async function sendInvoice(choice, billing_info, lead_id, promo){
    const obj = choice.split(',');
    const line_item = parseInt(obj[1]+obj[2]);

    const discount = promo > 0 ? Math.round(line_item*promo/100) : 0;
    const amount = promo > 0 ? line_item - discount : line_item;

    const items =  [{
    "name": "NovaCell payment",
    "description": `Payment for ${obj[0]} of stem cells`,
    "quantity": 1,
    "unit_price": line_item,
    "discount_amount": discount,
    "taxable": false,
    "status": "pending"
}];

    console.log(items,','+amount);

    try{
    const res = await fetch("https://fluidpay-test-api.azurewebsites.net/api/sendInvoice",
{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
    "customer_id":lead_id,
    "billing_address":billing_info,
    "items": items,
    "amount":amount,
    "invoice_number": '',
    "charge_type":"stem",
    "message": "This is your online payment form for your NovaCell treatment . "
})
});

    const resp2 = await res.json();
    if (res.status === 200){
    document.getElementById("errors").innerHTML = "Invoice sent successfully";
    document.getElementById("errors").style.color = 'green';
    document.getElementById("submit").style.display = "none";
    document.getElementById("container").style.display = "none";
} else {
    document.getElementById("errors").innerHTML = resp2.msg;
    document.getElementById("errors").style.color = 'red';
}
}
    catch(e) {
    console.log('error fetching data:',JSON.stringify(e));
    document.getElementById("error").innerHTML = JSON.stringify(e);
}
}


