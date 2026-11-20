// AWS Management Console Application Controller
// Project: Hybrid Cloud Storage Sync Using AWS Storage Gateway
// Student: Satyam Kumar (USN: 1EP24CS134) | Course: 24CS562

const S3_BUCKET_NAME = "hybrid-cloud-demo";
const GATEWAY_ID = "sgw-hybrid-01";

// State
let appState = {
  activeView: 'overview',
  s3Objects: [
    { name: 'documents/', type: 'Folder', size: '-', modified: 'Nov 18, 2026, 10:42 (IST)', icon: 'folder', color: 'text-amber-400' },
    { name: 'Project_Report.pdf', type: 'PDF document', size: '2.4 MB', modified: 'Nov 18, 2026, 10:41 (IST)', icon: 'file-text', color: 'text-rose-400' },
    { name: 'Architecture_Diagram.png', type: 'PNG image', size: '1.1 MB', modified: 'Nov 18, 2026, 10:41 (IST)', icon: 'image', color: 'text-blue-400' },
    { name: 'Test_Results.xlsx', type: 'Microsoft Excel', size: '652 KB', modified: 'Nov 18, 2026, 10:42 (IST)', icon: 'file-spreadsheet', color: 'text-emerald-400' }
  ]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});

// View Navigation (Matches AWS Console Views)
function navigateTo(viewName) {
  appState.activeView = viewName;

  // Hide all panels
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  // Remove active from all sidebar items
  document.querySelectorAll('.aws-sidebar-item').forEach(item => {
    item.classList.remove('active');
  });

  // Show selected panel
  const targetPanel = document.getElementById(`panel-${viewName}`);
  if (targetPanel) targetPanel.classList.remove('hidden');

  // Activate sidebar item
  const serviceTitle = document.getElementById('navServiceTitle');
  const breadcrumb = document.getElementById('navBreadcrumb');

  if (viewName === 's3') {
    const s3Item = document.getElementById('item-s3');
    if (s3Item) s3Item.classList.add('active');
    serviceTitle.innerText = "S3";
    breadcrumb.innerHTML = `
      <span class="hover:text-white cursor-pointer" onclick="navigateTo('s3')">Amazon S3</span>
      <span>&rsaquo;</span>
      <span class="hover:text-white cursor-pointer" onclick="navigateTo('s3')">Buckets</span>
      <span>&rsaquo;</span>
      <span class="text-white font-medium">hybrid-cloud-demo</span>
    `;
  } else if (viewName === 'fileshares') {
    const fsItem = document.getElementById('item-fileshares');
    if (fsItem) fsItem.classList.add('active');
    serviceTitle.innerText = "Storage Gateway";
    breadcrumb.innerHTML = `
      <span class="hover:text-white cursor-pointer" onclick="navigateTo('overview')">Storage Gateway</span>
      <span>&rsaquo;</span>
      <span class="hover:text-white cursor-pointer" onclick="navigateTo('overview')">Gateways</span>
      <span>&rsaquo;</span>
      <span class="hover:text-white cursor-pointer" onclick="navigateTo('overview')">sgw-hybrid-01</span>
      <span>&rsaquo;</span>
      <span class="text-white font-medium">File shares</span>
    `;
  } else {
    const gwItem = document.getElementById('item-gateways');
    if (gwItem) gwItem.classList.add('active');
    serviceTitle.innerText = "Storage Gateway";
    breadcrumb.innerHTML = `
      <span class="hover:text-white cursor-pointer" onclick="navigateTo('overview')">Storage Gateway</span>
      <span>&rsaquo;</span>
      <span class="hover:text-white cursor-pointer" onclick="navigateTo('overview')">Gateways</span>
      <span>&rsaquo;</span>
      <span class="hover:text-white cursor-pointer" onclick="navigateTo('overview')">sgw-hybrid-01</span>
      <span>&rsaquo;</span>
      <span class="text-white font-medium">Overview</span>
    `;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  lucide.createIcons();
}

// Refresh Cache API
function triggerQuickSync() {
  const spinner = document.getElementById('s3Spinner');
  if (spinner) spinner.classList.add('animate-spin');

  setTimeout(() => {
    if (spinner) spinner.classList.remove('animate-spin');
    alert("storagegateway:RefreshCache executed.\nCache inventory synchronized with s3://hybrid-cloud-demo.");
  }, 800);
}

// Modals
function openInfoModal() {
  document.getElementById('infoModal').classList.remove('hidden');
}

function openCloudWatchModal() {
  alert("Amazon CloudWatch Telemetry:\n• CacheHitPercent: 94.8% (Target > 90%)\n• CachePercentUsed: 43.2% (150 GB NVMe)\n• CachePercentDirty: 0.0% (Clean)\n• CloudBytesUploaded: 1.24 GB\n• CloudBytesDownloaded: 2.18 GB\n• Alarms: Healthy (0 in ALARM)");
}

function openWriteSimModal() {
  document.getElementById('writeModal').classList.remove('hidden');
}

function openDirectUploadModal() {
  document.getElementById('uploadModal').classList.remove('hidden');
}

function openCreateFolderModal() {
  const name = prompt("Enter folder name prefix:", "backups/");
  if (name) {
    appState.s3Objects.unshift({
      name: name.endsWith('/') ? name : name + '/',
      type: 'Folder',
      size: '-',
      modified: 'Just now (IST)',
      icon: 'folder',
      color: 'text-amber-400'
    });
    renderS3Table();
  }
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// Handle Write to Share Submit
function handleModalWrite(e) {
  e.preventDefault();
  const name = document.getElementById('mFileName').value.trim();
  const size = document.getElementById('mFileSize').value;
  if (!name) return;

  closeModal('writeModal');

  appState.s3Objects.splice(1, 0, {
    name: name,
    type: name.endsWith('.pdf') ? 'PDF document' : 'Data file',
    size: size,
    modified: 'Just now (IST)',
    icon: name.endsWith('.pdf') ? 'file-text' : 'file',
    color: 'text-blue-400'
  });

  renderS3Table();
  alert(`File "${name}" written to SMB file share \\\\sgw-hybrid-01\\company-share.\n\n1. Stored in local NVMe cache (0.9ms ACK).\n2. Upload buffer queued async sync to s3://hybrid-cloud-demo.`);
}

// Handle Direct S3 Upload Submit
function handleDirectS3Upload(e) {
  e.preventDefault();
  const key = document.getElementById('mS3Key').value.trim();
  if (!key) return;

  closeModal('uploadModal');

  appState.s3Objects.splice(1, 0, {
    name: key,
    type: 'Direct S3 Object',
    size: '3.4 MB',
    modified: 'Just now (IST)',
    icon: 'file',
    color: 'text-purple-400'
  });

  renderS3Table();
  alert(`Object "${key}" uploaded directly to S3.\nRun "RefreshCache" to reflect it on local SMB/NFS file share.`);
}

// Render S3 Table
function renderS3Table() {
  const tbody = document.getElementById('s3TableBody');
  if (!tbody) return;

  tbody.innerHTML = appState.s3Objects.map(obj => `
    <tr>
      <td class="text-center"><input type="checkbox" class="accent-[#0972d3]"></td>
      <td>
        <div class="flex items-center space-x-2">
          <i data-lucide="${obj.icon}" class="w-4 h-4 ${obj.color}"></i>
          <a href="javascript:void(0)" onclick="inspectS3File('${obj.name}')" class="font-semibold text-white">${obj.name}</a>
        </div>
      </td>
      <td class="text-slate-400">${obj.type}</td>
      <td class="text-slate-300 mono">${obj.size}</td>
      <td class="text-slate-300">${obj.modified}</td>
    </tr>
  `).join('');

  lucide.createIcons();
}

function inspectS3File(filename) {
  alert(
    `[Amazon S3 Object Properties]\n\n` +
    `Bucket: hybrid-cloud-demo\n` +
    `Key: ${filename}\n` +
    `Storage Class: S3 Standard\n` +
    `Encryption: SSE-S3\n` +
    `Local SMB Path: \\\\sgw-hybrid-01\\company-share\\${filename}`
  );
}
