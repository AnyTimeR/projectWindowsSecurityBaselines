document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const importButton = document.getElementById('importButton');

    // Desabilita o botão de importação inicialmente
    importButton.disabled = true;

    // Habilita o botão de importação quando um arquivo é selecionado
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            importButton.disabled = false;
        } else {
            importButton.disabled = true;
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
                const policies = extractPolicies(htmlDoc);
                displayPolicies(policies);
                setupFilters(policies); // Configura os filtros após carregar as políticas
                importButton.disabled = true; // Desabilita o botão após a importação
            };
            reader.readAsText(file);
        } else {
            alert('Por favor, selecione um arquivo .htm para importar.');
        }
    });
});

function extractPolicies(htmlDoc) {
    const policies = [];
    const tables = htmlDoc.querySelectorAll('table.info');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, index) => {
            if (index > 0) { // Ignora o cabeçalho da tabela
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const policyName = cells[0].textContent.trim();
                    const policySetting = cells[1].textContent.trim();
                    const policyPath = getPolicyPath(row);

                    // Filtra apenas políticas de "Computer Configuration"
                    if (policyPath.includes('Computer Configuration') && !policyPath.includes('General')) {
                        const category = getCategoryFromPath(policyPath);
                        policies.push({
                            name: policyName,
                            setting: policySetting,
                            path: policyPath,
                            category: category // Categoria extraída do caminho
                        });
                    }
                }
            }
        });
    });
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

function getCategoryFromPath(path) {
    // Extrai a categoria do caminho
    const categories = [
        "Account Policies/Account Lockout Policy",
        "Account Policies/Password Policy",
        "Advanced Audit Configuration",
        "Application Control Policies",
        "Local Policies/Security Options",
        "Local Policies/User Rights Assignment",
        "System Services",
        "Windows Firewall with Advanced Security"
    ];

    for (const category of categories) {
        if (path.includes(category)) {
            return category;
        }
    }
    return "Outros"; // Caso a categoria não seja encontrada
}

function displayPolicies(policies) {
    // Ordena as políticas em ordem alfabética pelo nome
    policies.sort((a, b) => a.name.localeCompare(b.name));

    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';
    policies.forEach(policy => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-category', policy.category); // Adiciona o atributo data-category
        card.innerHTML = `
            <h3>${policy.name}</h3>
            <p><strong>Setting:</strong> ${policy.setting}</p>
            <div class="path">Caminho: ${policy.path}</div>
        `;
        cardsContainer.appendChild(card);
    });
}

function setupFilters(policies) {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const filterInput = document.getElementById('filterInput');

    const applyFilters = () => {
        const selectedCategory = categoryFilter.value.toLowerCase();
        const selectedStatus = statusFilter.value.toLowerCase();
        const searchText = filterInput.value.toLowerCase();

        const filteredPolicies = policies.filter(policy => {
            const matchesCategory = selectedCategory ? policy.category.toLowerCase().includes(selectedCategory) : true;
            const matchesStatus = selectedStatus ? policy.setting.toLowerCase() === selectedStatus : true;
            const matchesSearch = searchText ? 
                policy.name.toLowerCase().includes(searchText) || 
                policy.setting.toLowerCase().includes(searchText) || 
                policy.path.toLowerCase().includes(searchText) : true;

            return matchesCategory && matchesStatus && matchesSearch;
        });

        displayPolicies(filteredPolicies);
    };

    categoryFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    filterInput.addEventListener('input', applyFilters);
}