 const container = document.getElementById('issue-container');
    const loader = document.getElementById('loader');
    let allData = [];

    
    async function fetchData(url = 'https://phi-lab-server.vercel.app/api/v1/lab/issues') {
        loader.style.display = 'block';
        container.innerHTML = '';
        try {
            const res = await fetch(url);
            const result = await res.json();
            allData = Array.isArray(result) ? result : result.data;
            renderCards(allData);
        } catch (err) {
            container.innerHTML = '<p>Error loading data!</p>';
        } finally {
            loader.style.display = 'none';
        }
    }


    function renderCards(data) {
        container.innerHTML = '';
        document.getElementById('count-text').innerText = `${data.length} Issues`;
        
        data.forEach(item => {
            const card = document.createElement('div');
    
            card.className = `card ${item.status.toLowerCase()}`;
            card.onclick = () => openModal(item.id);

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between;">
                    <span></span>
                    <span class="badge p-${item.priority.toLowerCase()}">${item.priority}</span>
                </div>
                <h4>${item.title}</h4>
                <p style="color: #666; font-size: 13px;">${item.description.slice(0, 70)}...</p>
                <div style="margin: 10px 0; display:flex; gap:5px;">
                    <span class="badge" style="background:#eee; color:#444;">${item.label || 'Bug'}</span>
                </div>
                <div style="font-size: 12px; color: #888; border-top: 1px solid #f0f0f0; padding-top:10px;">
                    # by <b>${item.author}</b> <br>
                    ${new Date(item.createdAt).toLocaleDateString()}
                </div>
            `;
            container.appendChild(card);
        });
    }


    function filterData(status, btn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (status === 'all') {
            renderCards(allData);
        } else {
            const filtered = allData.filter(i => i.status.toLowerCase() === status);
            renderCards(filtered);
        }
    }


    async function searchIssues() {
        const query = document.getElementById('searchInput').value;
        if (!query) return fetchData();
        fetchData(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
    }


    async function openModal(id) {
        const modal = document.getElementById('issueModal');
        const body = document.getElementById('modalBody');
        modal.style.display = 'flex';
        body.innerHTML = 'Loading detail...';

        try {
            const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
            const item = await res.json();
            const data = item.data || item;

            body.innerHTML = `
                <span class="close-modal" onclick="closeModal()">&times;</span>
                <h2>${data.title}</h2>
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Priority:</strong> ${data.priority}</p>
                <p><strong>Author:</strong> ${data.author}</p>
                <hr>
                <p>${data.description}</p>
                <p><small>Created At: ${new Date(data.createdAt).toLocaleString()}</small></p>
            `;
        } catch (err) { body.innerHTML = 'Failed to load details.'; }
    }

    function closeModal() {
        document.getElementById('issueModal').style.display = 'none';
    }

    
    window.onclick = (event) => {
        if (event.target == document.getElementById('issueModal')) closeModal();
    }

    fetchData(); 