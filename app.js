let appDataSource = null;

// Initialization & Core Fetch Hooks
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('data-core.json');
        appDataSource = await response.json();
        hydrateSidebar();
        navigateDashboard('overview');
    } catch (err) {
        console.error("System Initialization Interrupted:", err);
    }
});

function hydrateSidebar() {
    const container = document.getElementById('sidebar-meta-target');
    if (!container || !appDataSource) return;
    
    container.innerHTML = `
        <div class="text-white font-bold text-sm mb-2">${appDataSource.identity.name}</div>
        <p class="text-gray-500 text-[11px] leading-relaxed mb-3">${appDataSource.identity.bio}</p>
        <div class="h-[1px] bg-gray-950 my-2"></div>
        <div class="space-y-2 text-[11px] font-mono">
            <div class="flex justify-between"><span class="text-gray-600">EMAIL:</span><span class="text-gray-300">${appDataSource.identity.email}</span></div>
            <div class="flex justify-between"><span class="text-gray-600">PHONE:</span><span class="text-gray-300">${appDataSource.identity.phone}</span></div>
            <div class="flex justify-between"><span class="text-gray-600">GEO:</span><span class="text-gray-300">${appDataSource.identity.location}</span></div>
        </div>
        <a href="${appDataSource.identity.linkedin}" target="_blank" class="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold py-2 rounded-xl block text-center uppercase tracking-wider text-[10px]">Open LinkedIn Profile</a>
    `;
}

function navigateDashboard(viewId) {
    const mainViewport = document.getElementById('dashboard-viewport');
    if (!mainViewport || !appDataSource) return;

    // Toggle Sidebar Active States
    ['overview', 'automation', 'local-seo', 'platforms'].forEach(id => {
        const btn = document.getElementById(`nav-${id}`);
        if(btn) {
            btn.classList.remove('sidebar-item-active', 'text-white');
            btn.classList.add('text-gray-400');
        }
    });
    
    const activeBtn = document.getElementById(`nav-${viewId}`);
    if(activeBtn) activeBtn.classList.add('sidebar-item-active');

    // View Routing Setup Configurations
    if (viewId === 'overview') {
        mainViewport.innerHTML = `
            <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="glass-panel rounded-2xl p-5 border-l-2 border-emerald-500">
                    <span class="text-[10px] uppercase font-bold text-gray-500 block">Links Verified</span>
                    <span class="text-3xl font-extrabold text-white block mt-1 mono">${appDataSource.metrics.audited_links}</span>
                </div>
                <div class="glass-panel rounded-2xl p-5 border-l-2 border-teal-500">
                    <span class="text-[10px] uppercase font-bold text-gray-500 block">GMB Platforms</span>
                    <span class="text-3xl font-extrabold text-white block mt-1 mono">${appDataSource.metrics.gmb_profiles}</span>
                </div>
                <div class="glass-panel rounded-2xl p-5 border-l-2 border-blue-500">
                    <span class="text-[10px] uppercase font-bold text-gray-500 block">Live Citations</span>
                    <span class="text-3xl font-extrabold text-white block mt-1 mono">${appDataSource.metrics.citations}</span>
                </div>
                <div class="glass-panel rounded-2xl p-5 border-l-2 border-purple-500">
                    <span class="text-[10px] uppercase font-bold text-gray-500 block">Hours Reduced</span>
                    <span class="text-3xl font-extrabold text-white block mt-1 mono">${appDataSource.metrics.labor_reduction}</span>
                </div>
            </section>

            <section class="glass-panel rounded-2xl p-6">
                <h3 class="text-white font-bold text-base mb-2">Search Performance Engineering Overview</h3>
                <p class="text-xs text-gray-400 mb-6">Real-time interactive data distribution visualization chart matrix.</p>
                <div class="w-full h-64 bg-black/20 rounded-xl p-4 flex items-center justify-center">
                    <canvas id="overviewChartEngine" class="w-full h-full"></canvas>
                </div>
            </section>
        `;
        renderChartEngine();
    } 
    
    else if (viewId === 'automation') {
        let logRows = appDataSource.automation_logs.map(log => `
            <tr class="border-b border-gray-900/60 text-xs text-gray-300">
                <td class="py-3 px-4 mono text-emerald-400">${log.row}</td>
                <td class="py-3 px-4 truncate max-w-xs">${log.url}</td>
                <td class="py-3 px-4 font-semibold ${log.status.includes('200') ? 'text-emerald-400' : 'text-red-400'}">${log.status}</td>
                <td class="py-3 px-4 text-gray-400 font-medium">${log.type}</td>
                <td class="py-3 px-4 italic text-gray-500">${log.anchor}</td>
            </tr>
        `).join('');

        mainViewport.innerHTML = `
            <section class="glass-panel rounded-2xl p-6 flex flex-col gap-4">
                <div>
                    <h3 class="text-white font-bold text-base">Programmatic SEO Automation Engine</h3>
                    <p class="text-xs text-gray-500 mt-1">Simulated database log records compiled securely from the real-time background link automation suite checks.</p>
                </div>
                <div class="overflow-x-auto rounded-xl border border-gray-900 bg-black/20">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-950 text-gray-500 text-[10px] uppercase tracking-wider font-bold border-b border-gray-900">
                                <th class="py-3 px-4">Row_ID</th><th class="py-3 px-4">Endpoint_URL</th>
                                <th class="py-3 px-4">Server_Response</th><th class="py-3 px-4">Link_Type</th><th class="py-3 px-4">Matched_Anchor</th>
                            </tr>
                        </thead>
                        <tbody>${logRows}</tbody>
                    </table>
                </div>
            </section>
        `;
    }

    else if (viewId === 'local-seo') {
        let registryCards = appDataSource.gmb_registry.map(gmb => `
            <div class="bg-gray-950/40 border border-gray-900 p-5 rounded-xl hover:border-teal-500/30 transition flex flex-col justify-between">
                <div>
                    <h4 class="text-white font-bold text-sm mb-1">${gmb.name}</h4>
                    <p class="text-xs text-gray-400 leading-relaxed">${gmb.scope}</p>
                </div>
                <div class="mt-4 text-[10px] font-semibold text-teal-400 mono"><i class="fa-solid fa-badge-check"></i> ${gmb.citations}</div>
            </div>
        `).join('');

        mainViewport.innerHTML = `
            <section class="glass-panel rounded-2xl p-6">
                <h3 class="text-white font-bold text-base mb-1">Google My Business Citation Framework Registry</h3>
                <p class="text-xs text-gray-500 mb-6">Exhaustive operational configuration mappings extracted from multi-location local map analytics clusters.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${registryCards}</div>
            </section>
        `;
    }

    else if (viewId === 'platforms') {
        mainViewport.innerHTML = `
            <section class="glass-panel rounded-2xl p-6">
                <h3 class="text-white font-bold text-base mb-1">Managed Community Forums Network</h3>
                <p class="text-xs text-gray-500 mb-6">Active deployment configurations monitoring indexing integrity vectors.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-950/40 border border-gray-900 p-5 rounded-xl flex items-center justify-between group hover:border-emerald-500/20 transition">
                        <div>
                            <h4 class="text-white font-bold text-sm tracking-tight group-hover:text-emerald-400 transition">TechZeel Community</h4>
                            <p class="text-xs text-gray-500 mt-1">Sitemap architectures & core structures</p>
                            <a href="https://community.techzeel.net/" target="_blank" class="text-[11px] font-semibold text-emerald-400 hover:underline mt-4 inline-block">Verify Node Placements <i class="fa-solid fa-chevron-right text-[8px]"></i></a>
                        </div>
                    </div>
                    <div class="bg-gray-950/40 border border-gray-800 p-5 rounded-xl flex items-center justify-between group hover:border-emerald-500/20 transition">
                        <div>
                            <h4 class="text-white font-bold text-sm tracking-tight group-hover:text-emerald-400 transition">GetAssist Forum</h4>
                            <p class="text-xs text-gray-500 mt-1">Contextual thread anchor mapping networks</p>
                            <a href="https://forum.getassist.net/" target="_blank" class="text-[11px] font-semibold text-emerald-400 hover:underline mt-4 inline-block">Verify Node Placements <i class="fa-solid fa-chevron-right text-[8px]"></i></a>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

function renderChartEngine() {
    const ctx = document.getElementById('overviewChartEngine');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Q1-24', 'Q2-24', 'Q3-24', 'Q4-24', 'Q1-25', 'Q2-25'],
            datasets: [{
                label: 'Organic Optimization Scale Matrix',
                data: [30, 45, 65, 80, 95, 120],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } },
                y: { grid: { color: 'rgba(255,255,255,0.02)' }, ticks: { color: '#64748b', font: { size: 10 } } }
            }
        }
    });
}
