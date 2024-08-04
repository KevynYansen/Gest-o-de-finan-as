document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transaction-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;

        const backendUrl = 'http://localhost:3000'; // Ajuste conforme necessário

        try {
            const response = await fetch(`${backendUrl}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type, description, value: amount })
            });

            if (response.ok) {
                alert('Transação adicionada com sucesso!');
                form.reset();
                fetchTransactions(); // Atualiza o histórico
                updateFinancialSummary(); // Atualiza o resumo financeiro
            } else {
                const errorData = await response.json();
                alert(`Erro ao adicionar transação: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Erro ao adicionar transação.');
        }
    });

    async function fetchTransactions() {
        const backendUrl = 'http://localhost:3000'; // Ajuste conforme necessário

        try {
            const response = await fetch(`${backendUrl}/transactions`);
            if (response.ok) {
                const transactions = await response.json();
                const transactionList = document.getElementById('transaction-list');
                transactionList.innerHTML = '';

                transactions.forEach(transaction => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${transaction.type}: ${transaction.description || 'Sem descrição'}, R$ ${transaction.value.toFixed(2)}`;
                    transactionList.appendChild(listItem);
                });
            } else {
                console.error('Erro ao buscar transações');
            }
        } catch (error) {
            console.error('Erro de rede:', error);
        }
    }

    async function updateFinancialSummary() {
        const backendUrl = 'http://localhost:3000'; // Ajuste conforme necessário

        try {
            const response = await fetch(`${backendUrl}/transactions`);
            if (response.ok) {
                const transactions = await response.json();
                const totalIncome = transactions
                    .filter(transaction => transaction.type === 'receita')
                    .reduce((sum, transaction) => sum + transaction.value, 0);
                const totalExpenses = transactions
                    .filter(transaction => transaction.type === 'despesa')
                    .reduce((sum, transaction) => sum + transaction.value, 0);

                document.getElementById('total-income').textContent = `Receitas: R$ ${totalIncome.toFixed(2)}`;
                document.getElementById('total-expenses').textContent = `Despesas: R$ ${totalExpenses.toFixed(2)}`;
            } else {
                console.error('Erro ao buscar transações');
            }
        } catch (error) {
            console.error('Erro de rede:', error);
        }
    }

    // Inicializa a página com transações e resumo
    fetchTransactions();
    updateFinancialSummary();
});
