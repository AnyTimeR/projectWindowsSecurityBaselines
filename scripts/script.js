document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const importButton = document.getElementById('importButton');
    const filterInput = document.getElementById('filterInput');

    // Desabilita o botão de importar inicialmente
    importButton.disabled = true;

    // Habilita o botão de importar quando um arquivo é selecionado
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            importButton.disabled = false; // Habilita o botão
        } else {
            importButton.disabled = true; // Desabilita o botão se nenhum arquivo estiver selecionado
        }
    });

    // Importa o arquivo e desabilita o botão após a importação
    importButton.addEventListener('click', function() {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(content, 'text/html');
                console.log(htmlDoc); // Depuração: Verifique o conteúdo do arquivo .htm
                const policies = extractPolicies(htmlDoc);
                console.log(policies); // Depuração: Verifique as políticas extraídas
                displayPolicies(policies);
                importButton.disabled = true; // Desabilita o botão após a importação
            };
            reader.readAsText(file);
        } else {
            alert('Por favor, selecione um arquivo .htm para importar.');
        }
    });

    // Filtra as políticas ao digitar no campo de filtro
    filterInput.addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const policyName = card.querySelector('h3').textContent.toLowerCase();
            if (policyName.includes(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

function extractPolicies(htmlDoc) {
    const policies = [];
    // Encontre a seção "Computer Configuration"
    const computerConfigSection = Array.from(htmlDoc.querySelectorAll('.sectionTitle')).find(el => el.textContent.includes('Computer Configuration'));
    if (computerConfigSection) {
        console.log('Seção "Computer Configuration" encontrada.'); // Depuração
        // Navegue até o próximo container
        let container = computerConfigSection.closest('div').nextElementSibling;
        while (container && !container.classList.contains('container')) {
            container = container.nextElementSibling;
        }
        if (container) {
            // Extraia todas as políticas dentro de "Computer Configuration"
            const tables = container.querySelectorAll('table.info');
            tables.forEach(table => {
                const rows = table.querySelectorAll('tr');
                rows.forEach((row, index) => {
                    // Ignora o cabeçalho da tabela (primeira linha)
                    if (index > 0) {
                        const cells = row.querySelectorAll('td');
                        if (cells.length >= 2) {
                            const policyName = cells[0].textContent.trim();
                            const policySetting = cells[1].textContent.trim();
                            // Extrai o caminho completo da política
                            const path = getPolicyPath(row);
                            policies.push({ name: policyName, setting: policySetting, path: path });
                        }
                    }
                });
            });
        } else {
            console.log('Container de políticas não encontrado.'); // Depuração
        }
    } else {
        console.log('Seção "Computer Configuration" não encontrada.'); // Depuração
    }
    return policies;
}

function getPolicyPath(row) {
    const path = [];
    let currentElement = row.closest('.container');
    while (currentElement) {
        const sectionTitle = currentElement.previousElementSibling.querySelector('.sectionTitle');
        if (sectionTitle) {
            path.unshift(sectionTitle.textContent.trim());
        }
        currentElement = currentElement.parentElement.closest('.container');
    }
    return path.join(' > ');
}

function displayPolicies(policies) {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';
    policies.forEach(policy => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${policy.name}</h3>
            <p><strong>Setting:</strong> ${policy.setting}</p>
            <div class="path">Caminho: ${policy.path}</div>
        `;
        cardsContainer.appendChild(card);
    });
}