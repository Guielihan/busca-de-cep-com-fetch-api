document.addEventListener('DOMContentLoaded', () => {
    const cepInput = document.getElementById('cep');
    const logradouroInput = document.getElementById('logradouro');
    const bairroInput = document.getElementById('bairro');
    const localidadeInput = document.getElementById('localidade');
    const ufInput = document.getElementById('uf');
    const statusMessage = document.getElementById('status-message');

    const clearForm = () => {
        logradouroInput.value = '';
        bairroInput.value = '';
        localidadeInput.value = '';
        ufInput.value = '';
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
    }

    const isNumber = (str) => /^[0-9]+$/.test(str);

    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d{1,3})/, '$1-$2');
        }

        e.target.value = value;
    });

    cepInput.addEventListener('blur', async (e) => {
        const cep = e.target.value.replace('-', '');

        if (cep === '') {
            clearForm();
            return;
        }

        if (cep.length !== 8 || !isNumber(cep)) {
            clearForm();
            statusMessage.textContent = 'CEP inválido.';
            statusMessage.classList.add('error');
            return;
        }

        statusMessage.textContent = 'Buscando...';
        statusMessage.classList.remove('error', 'success');

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                clearForm();
                statusMessage.textContent = 'CEP não encontrado.';
                statusMessage.classList.add('error');
            } else {
                statusMessage.textContent = 'Endereço encontrado!';
                statusMessage.classList.add('success');
                statusMessage.classList.remove('error');
                logradouroInput.value = data.logradouro || 'N/A';
                bairroInput.value = data.bairro || 'N/A';
                localidadeInput.value = data.uf || 'N/A'; 
                ufInput.value = data.localidade || 'N/A'; 
            }
        } catch (error) {
            clearForm();
            statusMessage.textContent = 'Erro ao buscar o CEP.';
            statusMessage.classList.add('error');
            console.error('Fetch error:', error);
        }
    });
});