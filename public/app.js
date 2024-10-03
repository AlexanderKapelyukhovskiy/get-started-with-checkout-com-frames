(async () => {
  // Insert your public key here
  const PUBLIC_KEY = "xxx";

  const payButton = document.getElementById('pay-button');
  const form = document.getElementById('payment-form');
  const addressLine1 = document.getElementById('addressLine1');
  const addressLine2 = document.getElementById('addressLine2');
  const zip = document.getElementById('zip');
  const city = document.getElementById('city');
  const state = document.getElementById('state');
  const country = document.getElementById('country');
  const phone = document.getElementById('phone');
  
  Frames.init({
    publicKey: PUBLIC_KEY,
    localization: {
      cardNumberPlaceholder: 'Card number',
      expiryMonthPlaceholder: 'MM',
      expiryYearPlaceholder: 'YY',
      cvvPlaceholder: 'CVV',
    },
    style: {
      base: {
        color: 'black',
        fontSize: '18px',
      },
      autofill: {
        backgroundColor: 'yellow',
      },
      hover: {
        color: 'blue',
      },
      focus: {
        color: 'blue',
      },
      valid: {
        color: 'green',
      },
      invalid: {
        color: 'red',
      },
      placeholder: {
        base: {
          color: 'gray',
        },
        focus: {
          border: 'solid 1px blue',
        },
      },
    }
  });

  Frames.addEventHandler(Frames.Events.CARD_VALIDATION_CHANGED, function (event) {
      console.log('CARD_VALIDATION_CHANGED: %o', event);

      payButton.disabled = !Frames.isCardValid();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    Frames.cardholder = {
      name: 'John Smith',
      billingAddress: {
        addressLine1: addressLine1.value ?? '123 Anywhere St.',
        addressLine2: addressLine2.value ?? 'Apt. 456',
        zip: zip.value ?? '123456',
        city: city.value ?? 'Anytown',
        state: state.value ?? 'Alabama',
        country: country.value ?? 'US',
      },
      phone: phone.value ?? '5551234567',
    };
    Frames.submitCard()
      .then(async function (data) {
        Frames.addCardToken(form, data.token);

        const response = await fetch("/save-card", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",  // Correct content type
          },
          body: JSON.stringify({ token: data.token }),  // Use body for the request payload
        });

        if (response.ok) {  // Check if the response status is OK (200-299)
          const responseData = await response.json();  // Read and parse the JSON response
          alert(`${responseData.result} - ${responseData.token}`)
        } else {
          console.error('Error saving card:', response.statusText);  // Handle any errors
        }
      })
      .catch(function (error) {
        alert(error)
        // handle error
      });
  });
})();
