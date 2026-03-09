console.log("hello-bhaishap")
document.getElementById('login-btn').addEventListener("click", function(){
    const numberInput = document.getElementById("input-number");
    const contactNumber = numberInput.value;
    console.log(contactNumber);

    const inputPin = document.getElementById("input-pin");
    const pin= inputPin.value;
    console.log(pin);

    if (contactNumber == "Admin" && pin == "Admin123"){
        alert("login success");
        window.location.assign("/home.html");
    }
    else{
        alert("login Failed");
        return;
    }
});

