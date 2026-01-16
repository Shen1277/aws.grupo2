/**
 * =============================================
 * AWS Cost Simulator - Frontend Application
 * =============================================
 *
 * Aplicació SPA (Single Page Application) per gestionar
 * simulacions de costos de serveis AWS (EC2, S3, RDS).
 *
 * SECCIONS:
 * - Dashboard: Resum de costos totals
 * - Usos: CRUD complet d'usos de serveis
 * - Preus: Gestió de preus per hora
 * - Simulador: Càlcul de cost mensual
 * - Estadístiques: Gràfics per servei i projecte
 *
 * REQUISITS:
 * - API REST executant-se a API_BASE_URL
 * - Navegador modern amb suport ES6+
 *
 * @author Frontend Team
 * @version 1.0.0
 */

// ============================================
// CONFIGURACIÓ
// ============================================

/**
 * URL base de l'API backend.
 * IMPORTANT: Canvia aquest valor si l'API s'executa en un altre servidor/port.
 */
const API_BASE_URL = 'http://127.0.0.1:8000';

// ============================================
// FUNCIONS D'UTILITAT
// ============================================

/**
 * Fa una petició HTTP a l'API.
 *
 * @param {string} endpoint - Ruta de l'endpoint (ex: '/usages')
 * @param {Object} options - Opcions de fetch (method, body, etc.)
 * @returns {Promise<Object|null>} Resposta JSON o null si 204
 * @throws {Error} Si la petició falla o l'API no respon
 *
 * @example
 * // GET request
 * const data = await apiRequest('/usages');
 *
 * @example
 * // POST request
 * const newUsage = await apiRequest('/usages', {
 *     method: 'POST',
 *     body: JSON.stringify({ servicio: 'EC2', horas: 10, proyecto: 'Test' })
 * });
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error: ${response.status}`);
        }

        // Handle empty responses (204 No Content)
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('No es pot connectar amb l\'API. Assegura\'t que el servidor està en marxa.');
        }
        throw error;
    }
}

/**
 * Formata un número com a moneda USD.
 * @param {number} amount - Quantitat a formatar
 * @returns {string} Valor formatat (ex: "24,50 US$")
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('ca-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Formata un número amb separadors de milers.
 * @param {number} num - Número a formatar
 * @returns {string} Valor formatat (ex: "1.234,56")
 */
function formatNumber(num) {
    return new Intl.NumberFormat('ca-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num);
}

// ============================================
// NOTIFICACIONS TOAST
// ============================================

/**
 * Mostra una notificació toast a la cantonada superior dreta.
 * La notificació desapareix automàticament després de 4 segons.
 *
 * @param {string} message - Missatge a mostrar
 * @param {'success'|'error'|'info'} type - Tipus de notificació
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 4000);
}

// ============================================
// Navigation
// ============================================

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;
            navigateTo(sectionId);
        });
    });
}

function navigateTo(sectionId) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionId);
    });

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });

    // Load section data
    switch (sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'usages':
            loadUsages();
            break;
        case 'pricing':
            loadPricing();
            break;
        case 'stats':
            loadStats();
            break;
    }
}

// ============================================
// Dashboard
// ============================================

async function loadDashboard() {
    try {
        const summary = await apiRequest('/stats/summary');

        document.getElementById('total-usos').textContent = formatNumber(summary.total_usos);
        document.getElementById('cost-total').textContent = formatCurrency(summary.coste_total);
        document.getElementById('hores-totals').textContent = formatNumber(summary.horas_totales) + ' h';
    } catch (error) {
        showToast(error.message, 'error');
        document.getElementById('total-usos').textContent = '-';
        document.getElementById('cost-total').textContent = '-';
        document.getElementById('hores-totals').textContent = '-';
    }
}

// ============================================
// Usages CRUD
// ============================================

async function loadUsages() {
    const tbody = document.getElementById('usages-table-body');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Carregant...</td></tr>';

    try {
        const usages = await apiRequest('/usages');

        if (usages.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">No hi ha usos registrats</td></tr>';
            return;
        }

        tbody.innerHTML = usages.map(usage => `
            <tr>
                <td>${usage.id}</td>
                <td><span class="service-badge ${usage.servicio.toLowerCase()}">${usage.servicio}</span></td>
                <td>${formatNumber(usage.horas)} h</td>
                <td>${usage.proyecto}</td>
                <td>${formatCurrency(usage.costo)}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn edit" onclick="editUsage(${usage.id})" title="Editar">✏️</button>
                        <button class="action-btn delete" onclick="confirmDeleteUsage(${usage.id})" title="Eliminar">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        showToast(error.message, 'error');
        tbody.innerHTML = '<tr><td colspan="6" class="empty">Error carregant dades</td></tr>';
    }
}

function initUsageForm() {
    const form = document.getElementById('usage-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('usage-id').value;
        const data = {
            servicio: document.getElementById('servicio').value,
            horas: parseFloat(document.getElementById('horas').value),
            proyecto: document.getElementById('proyecto').value,
        };

        try {
            if (id) {
                // Update
                await apiRequest(`/usages/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(data),
                });
                showToast('Ús actualitzat correctament', 'success');
            } else {
                // Create
                await apiRequest('/usages', {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
                showToast('Ús creat correctament', 'success');
            }

            resetForm();
            loadUsages();
            loadDashboard();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}

async function editUsage(id) {
    try {
        const usage = await apiRequest(`/usages/${id}`);

        document.getElementById('usage-id').value = usage.id;
        document.getElementById('servicio').value = usage.servicio;
        document.getElementById('horas').value = usage.horas;
        document.getElementById('proyecto').value = usage.proyecto;

        document.getElementById('form-title').textContent = 'Editar Ús';
        document.getElementById('submit-btn').textContent = 'Actualitzar';

        // Scroll to form
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function resetForm() {
    document.getElementById('usage-form').reset();
    document.getElementById('usage-id').value = '';
    document.getElementById('form-title').textContent = 'Nou Ús';
    document.getElementById('submit-btn').textContent = 'Crear';
}

function confirmDeleteUsage(id) {
    showModal(
        'Eliminar Ús',
        `Estàs segur que vols eliminar l'ús #${id}?`,
        async () => {
            try {
                await apiRequest(`/usages/${id}`, { method: 'DELETE' });
                showToast('Ús eliminat correctament', 'success');
                loadUsages();
                loadDashboard();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    );
}

function deleteAllUsages() {
    showModal(
        'Eliminar Tots els Usos',
        'Estàs segur que vols eliminar TOTS els usos? Aquesta acció no es pot desfer.',
        async () => {
            try {
                await apiRequest('/usages', { method: 'DELETE' });
                showToast('Tots els usos eliminats', 'success');
                loadUsages();
                loadDashboard();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    );
}

// ============================================
// Pricing
// ============================================

async function loadPricing() {
    try {
        const pricing = await apiRequest('/pricing');

        Object.keys(pricing).forEach(service => {
            const input = document.getElementById(`price-${service}`);
            if (input) {
                input.value = pricing[service];
            }
        });
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function updatePrice(service) {
    const input = document.getElementById(`price-${service}`);
    const price = parseFloat(input.value);

    if (isNaN(price) || price < 0) {
        showToast('Si us plau, introdueix un preu vàlid', 'error');
        return;
    }

    try {
        await apiRequest(`/pricing/${service}`, {
            method: 'PUT',
            body: JSON.stringify({ precio: price }),
        });
        showToast(`Preu de ${service} actualitzat a ${formatCurrency(price)}/hora`, 'success');
        loadDashboard();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ============================================
// Simulator
// ============================================

function initSimulator() {
    const form = document.getElementById('simulator-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            dias: parseInt(document.getElementById('sim-dias').value),
            horas_diarias_ec2: parseFloat(document.getElementById('sim-ec2').value),
            horas_diarias_s3: parseFloat(document.getElementById('sim-s3').value),
            horas_diarias_rds: parseFloat(document.getElementById('sim-rds').value),
        };

        try {
            const result = await apiRequest('/simulate/monthly', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            // Show results
            document.getElementById('result-ec2').textContent = formatCurrency(result.costo_ec2);
            document.getElementById('result-s3').textContent = formatCurrency(result.costo_s3);
            document.getElementById('result-rds').textContent = formatCurrency(result.costo_rds);
            document.getElementById('result-total').textContent = formatCurrency(result.costo_total);

            document.getElementById('simulator-result').classList.remove('hidden');

            showToast('Simulació completada', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}

// ============================================
// Statistics
// ============================================

async function loadStats() {
    await Promise.all([
        loadStatsByService(),
        loadStatsByProject(),
    ]);
}

async function loadStatsByService() {
    const container = document.getElementById('chart-service');
    container.innerHTML = '<p class="loading">Carregant...</p>';

    try {
        const stats = await apiRequest('/stats/by-service');

        if (!stats || Object.keys(stats).length === 0) {
            container.innerHTML = '<p class="no-data">No hi ha dades disponibles</p>';
            return;
        }

        // Find max value for scaling
        const values = Object.values(stats).map(s => s.costo_total);
        const maxValue = Math.max(...values, 1);

        const chartHtml = `
            <div class="bar-chart">
                ${Object.entries(stats).map(([service, data]) => {
                    const percentage = (data.costo_total / maxValue) * 100;
                    return `
                        <div class="bar-item">
                            <span class="bar-label">${service}</span>
                            <div class="bar-wrapper">
                                <div class="bar ${service.toLowerCase()}" style="width: ${Math.max(percentage, 5)}%">
                                    ${formatCurrency(data.costo_total)}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--gray-500);">
                ${Object.entries(stats).map(([service, data]) =>
                    `<p><strong>${service}:</strong> ${data.total_usos} usos, ${formatNumber(data.horas_totales)} hores</p>`
                ).join('')}
            </div>
        `;

        container.innerHTML = chartHtml;
    } catch (error) {
        container.innerHTML = '<p class="no-data">Error carregant estadístiques</p>';
        showToast(error.message, 'error');
    }
}

async function loadStatsByProject() {
    const container = document.getElementById('chart-project');
    container.innerHTML = '<p class="loading">Carregant...</p>';

    try {
        const stats = await apiRequest('/stats/by-project');

        if (!stats || Object.keys(stats).length === 0) {
            container.innerHTML = '<p class="no-data">No hi ha dades disponibles</p>';
            return;
        }

        // Find max value for scaling
        const values = Object.values(stats).map(s => s.costo_total);
        const maxValue = Math.max(...values, 1);

        const chartHtml = `
            <div class="bar-chart">
                ${Object.entries(stats).map(([project, data]) => {
                    const percentage = (data.costo_total / maxValue) * 100;
                    return `
                        <div class="bar-item">
                            <span class="bar-label">${project}</span>
                            <div class="bar-wrapper">
                                <div class="bar project" style="width: ${Math.max(percentage, 5)}%">
                                    ${formatCurrency(data.costo_total)}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--gray-500);">
                ${Object.entries(stats).map(([project, data]) =>
                    `<p><strong>${project}:</strong> ${data.total_usos} usos, ${formatNumber(data.horas_totales)} hores</p>`
                ).join('')}
            </div>
        `;

        container.innerHTML = chartHtml;
    } catch (error) {
        container.innerHTML = '<p class="no-data">Error carregant estadístiques</p>';
        showToast(error.message, 'error');
    }
}

// ============================================
// Modal
// ============================================

let modalCallback = null;

function showModal(title, message, onConfirm) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('confirm-modal').classList.remove('hidden');
    modalCallback = onConfirm;
}

function closeModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
    modalCallback = null;
}

function initModal() {
    document.getElementById('modal-confirm').addEventListener('click', async () => {
        if (modalCallback) {
            await modalCallback();
        }
        closeModal();
    });

    // Close modal on background click
    document.getElementById('confirm-modal').addEventListener('click', (e) => {
        if (e.target.id === 'confirm-modal') {
            closeModal();
        }
    });
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initUsageForm();
    initSimulator();
    initModal();

    // Load initial data
    loadDashboard();
});
