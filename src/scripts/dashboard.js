// Dashboard functionality for search and pagination
document.addEventListener('DOMContentLoaded', () => {
    // Search functionality
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const section = e.target.getAttribute('data-section');
            const tableRows = document.querySelectorAll(`.${section}-table tbody tr`);
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Update pagination info
            updatePaginationInfo(section);
        });
    });
    
    // Pagination functionality
    function updatePaginationInfo(section) {
        const tableRows = document.querySelectorAll(`.${section}-table tbody tr`);
        const visibleRows = document.querySelectorAll(`.${section}-table tbody tr:not([style*="display: none"])`);
        
        const paginationInfo = document.querySelector(`.${section}-pagination-info`);
        if (paginationInfo) {
            const total = tableRows.length;
            const visible = visibleRows.length;
            
            let itemType = 'items';
            switch(section) {
                case 'users':
                    itemType = 'users';
                    break;
                case 'attributes':
                    itemType = 'attributes';
                    break;
                case 'secrets':
                    itemType = 'API keys';
                    break;
                case 'roles':
                    itemType = 'roles';
                    break;
            }
            
            paginationInfo.innerHTML = `Showing <span class="text-white">1</span> to <span class="text-white">${visible}</span> of <span class="text-white">${total}</span> ${itemType}`;
        }
    }
});
