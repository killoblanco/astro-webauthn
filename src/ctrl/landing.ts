import { startRegistration } from "@simplewebauthn/browser";

const form = document.querySelector('form#access-form') as HTMLFormElement;
const signupBtn = form.querySelector('[name="signupBtn"]') as HTMLButtonElement;
const previewRes = document.querySelector('div#response') as HTMLDivElement;

const errorAlert = document.querySelector('dialog#errorAlert') as HTMLDialogElement;

errorAlert.addEventListener('close', () => {
    const alertText = errorAlert.querySelector('p#errorAlert-text') as HTMLParagraphElement;
    alertText.textContent = '';
})

signupBtn.addEventListener('click', async () => {
    previewRes.innerHTML = '';
    const accountField = form.elements.namedItem('accountId') as HTMLInputElement;

    if (accountField.value != '') {
        const optsRes = await fetch(`/api/auth/reg-opts?aid=${accountField.value}`);

        const { cat, ...opts } = await optsRes.json();

        if (cat) {
            const img = document.createElement('img');
            img.src = cat;
            previewRes.appendChild(img);
        }

        let attResp;
        try {
            attResp = await startRegistration(opts);
        } catch (error: any) {
            const alertText = errorAlert.querySelector('p#errorAlert-text') as HTMLParagraphElement;

            if (error.name === 'InvalidStateError') {
                alertText.textContent = 'Error: Authenticator was probably already registered by user';
            } else {
                alertText.textContent = `Error: ${error.message}`;
            }
            errorAlert.showModal();
            throw error;
        }

        const verifyRes = await fetch('/api/auth/verify-reg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                attResp,
                aid: accountField.value
            })
        });

        const { cat: cat2, ...verify } = await verifyRes.json();

        if (cat2) {
            const img = document.createElement('img');
            img.src = cat2;
            previewRes.appendChild(img);
        }

        console.log({ verify })
    } else {
        accountField.setCustomValidity('Please enter an account ID');
        accountField.reportValidity();
    }

});