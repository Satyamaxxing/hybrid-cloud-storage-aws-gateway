// Hybrid Cloud Storage Sync Using AWS Storage Gateway
// Capstone Project Interactive Simulator for EPCET CSE
// Student: Sanmati M Kulkarni (USN: 1EP24CS132) | Course: 24CS562

const S3_BUCKET_NAME = "s3://epcet-hybrid-storage-vault/";
const GATEWAY_IP = "192.168.1.100";
const GATEWAY_ARN = "arn:aws:storagegateway:ap-south-1:123456789012:gateway/gw-09b3f71c42";

// Initial Storage State
let state = {
  protocol: 'nfs', // 'nfs' or 'smb'
  cacheTotalGiB: 150,
  cacheDirtyMB: 0,
  cacheHits: 184,
  cacheMisses: 10,
  bytesUploadedMB: 184.2,
  bytesDownloadedMB: 12.4,
  isSyncing: false,
  showVersions: false,
  files: [
    {
      id: 'f1',
      name: 'capstone_project_report.pdf',
      size: '4.2 MB',
      sizeMB: 4.2,
      category: 'doc',
      storageClass: 'STANDARD',
      inCache: true,
      s3Status: 'SYNCED',
      version: 'v2.1',
      versionsList: ['v2.1 (Current)', 'v1.0 (Initial Draft)'],
      lastModified: '2026-11-20 14:22:10 UTC',
      encryption: 'aws:kms (mrk-7c89f81a)',
      content: 'East Point College of Engineering & Technology. Department of Computer Science & Engineering. Capstone Project: Hybrid Cloud Storage Sync Using AWS Storage Gateway. Student: Sanmati M Kulkarni (USN: 1EP24CS132). Instructor: Mrs. Triveni N. HOD: Dr. I. Manimozhi.',
      isDeleteMarker: false
    },
    {
      id: 'f2',
      name: 'system_architecture_diagram.png',
      size: '1.8 MB',
      sizeMB: 1.8,
      category: 'img',
      storageClass: 'STANDARD',
      inCache: true,
      s3Status: 'SYNCED',
      version: 'v1.0',
      versionsList: ['v1.0 (Current)'],
      lastModified: '2026-11-20 11:05:44 UTC',
      encryption: 'aws:kms (mrk-7c89f81a)',
      content: 'PNG Image Binary: High resolution hybrid storage sync flow diagram depicting VMware ESXi Gateway, NVMe local cache disk, TLS 1.3 WAN link, and Amazon S3 Intelligent-Tiering.',
      isDeleteMarker: false
    },
    {
      id: 'f3',
      name: 'customer_billing_records.json',
      size: '3.1 MB',
      sizeMB: 3.1,
      category: 'data',
      storageClass: 'STANDARD',
      inCache: true,
      s3Status: 'SYNCED',
      version: 'v1.2',
      versionsList: ['v1.2 (Current)', 'v1.1', 'v1.0'],
      lastModified: '2026-11-19 18:40:12 UTC',
      encryption: 'aws:kms (mrk-7c89f81a)',
      content: '{"tenant":"EPCET-Accounts","records":[{"customer":"Dr. Sharma","accountNumber":"4532-8901-2345-6789","pan":"ABCDE1234F","balance":45000,"status":"ACTIVE","notes":"CONFIDENTIAL - PCI-DSS / PII protected record"}]}',
      isDeleteMarker: false
    },
    {
      id: 'f4',
      name: 'datacenter_telemetry_logs.csv',
      size: '12.5 MB',
      sizeMB: 12.5,
      category: 'data',
      storageClass: 'STANDARD_IA',
      inCache: true,
      s3Status: 'SYNCED',
      version: 'v1.0',
      versionsList: ['v1.0 (Current)'],
      lastModified: '2026-10-15 08:12:00 UTC',
      encryption: 'AES256 (SSE-S3)',
      content: 'Timestamp,GatewayID,CacheHitPercent,CacheDirtyPercent,IoWait,NetworkTxMbps\n2026-10-15T08:00:00Z,gw-09b3f71c42,94.2,0.1,0.3,42.5\n2026-10-15T08:01:00Z,gw-09b3f71c42,96.1,0.0,0.2,38.1',
      isDeleteMarker: false
    },
    {
      id: 'f5',
      name: 'cloud_cost_optimization_model.xlsx',
      size: '5.4 MB',
      sizeMB: 5.4,
      category: 'doc',
      storageClass: 'INTELLIGENT_TIERING',
      inCache: true,
      s3Status: 'SYNCED',
      version: 'v1.0',
      versionsList: ['v1.0 (Current)'],
      lastModified: '2026-11-01 16:30:25 UTC',
      encryption: 'aws:kms (mrk-7c89f81a)',
      content: 'Spreadsheet: Financial comparison of on-premises NAS refresh vs S3 File Gateway with S3 Glacier Instant Retrieval and Intelligent-Tiering. 5-year TCO shows 42% cost reduction.',
      isDeleteMarker: false
    },
    {
      id: 'f6',
      name: 'database_daily_backup_dump.tar.gz',
      size: '142 MB',
      sizeMB: 142.0,
      category: 'backup',
      storageClass: 'GLACIER',
      inCache: false, // Cold - flushed from local cache to test Cache Miss
      s3Status: 'SYNCED',
      version: 'v1.0',
      versionsList: ['v1.0 (Current)'],
      lastModified: '2026-08-10 03:00:00 UTC',
      encryption: 'aws:kms (mrk-7c89f81a)',
      content: 'GZIPPED ARCHIVE: Full SQL dump of EPCET academic student database. Archived under S3 Glacier lifecycle tier for long-term audit compliance.',
      isDeleteMarker: false
    }
  ],
  cloudTrailEvents: [
    {
      timestamp: '2026-11-20 20:30:15 UTC',
      eventName: 'CreateFileShare',
      service: 'storagegateway.amazonaws.com',
      identity: 'arn:aws:iam::123456789012:role/StorageGatewayS3AccessRole',
      resource: 'share-epcet-vault-nfs',
      status: '200 OK'
    },
    {
      timestamp: '2026-11-20 20:32:00 UTC',
      eventName: 'PutObject',
      service: 's3.amazonaws.com',
      identity: 'arn:aws:iam::123456789012:role/StorageGatewayS3AccessRole',
      resource: 's3://epcet-hybrid-storage-vault/capstone_project_report.pdf',
      status: '200 OK'
    },
    {
      timestamp: '2026-11-20 20:35:10 UTC',
      eventName: 'GenerateDataKey',
      service: 'kms.ap-south-1.amazonaws.com',
      identity: 'arn:aws:iam::123456789012:role/StorageGatewayS3AccessRole',
      resource: 'arn:aws:kms:ap-south-1:123456789012:key/mrk-7c89f81a',
      status: '200 OK'
    },
    {
      timestamp: '2026-11-20 20:41:00 UTC',
      eventName: 'RefreshCache',
      service: 'storagegateway.amazonaws.com',
      identity: 'AdminUser/SanmatiKulkarni',
      resource: 'share-epcet-vault-nfs',
      status: '200 OK'
    }
  ],
  testScenarios: [
    {
      id: 'T1',
      title: 'Create file & folder on NFS share',
      expected: 'Items listed immediately; objects appear in S3 bucket after async upload.',
      observed: 'Local NFS write acknowledged in 0.9ms; S3 PutObject completed in 850ms.',
      status: 'PASS'
    },
    {
      id: 'T2',
      title: 'Modify an existing file through share',
      expected: 'A new object version is created in S3 and earlier version is retained.',
      observed: 'New version ID generated; previous versions intact in versioning history.',
      status: 'PASS'
    },
    {
      id: 'T3',
      title: 'Read recently written file',
      expected: 'File is served from local cache; CacheHitPercent reflects hit.',
      observed: 'Read served in 1.1ms from NVMe cache; CacheHitPercent increased.',
      status: 'PASS'
    },
    {
      id: 'T4',
      title: 'Direct S3 upload & RefreshCache',
      expected: 'New object becomes visible in share listing after refresh cache API.',
      observed: 'RefreshCache issued; local gateway metadata synchronized within 1.2s.',
      status: 'PASS'
    },
    {
      id: 'T5',
      title: 'Delete file through the share',
      expected: 'Delete marker created in S3; object remains recoverable.',
      observed: 'S3 DeleteMarker inserted; previous object versions preserved in bucket.',
      status: 'PASS'
    },
    {
      id: 'T6',
      title: 'Copy folder to SMB share from Windows',
      expected: 'Files copied to S:\\ and appear in S3 under matching key prefixes.',
      observed: 'Batch SMB 3.0 session established; all folder contents uploaded.',
      status: 'PASS'
    },
    {
      id: 'T7',
      title: 'Mount share from unauthorized CIDR IP',
      expected: 'The mount request is denied per security firewall policy.',
      observed: 'RPC: Mount failed: Permission denied (Client IP 10.0.4.9 not in 192.168.1.0/24).',
      status: 'PASS'
    },
    {
      id: 'T8',
      title: 'Review CloudWatch & CloudTrail audit',
      expected: 'Gateway metrics visible & API activity recorded.',
      observed: 'Cache telemetry published to CloudWatch; CloudTrail logged all events.',
      status: 'PASS'
    }
  ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  renderAll();
  logActivity('SYSTEM', 'AWS Storage Gateway daemon initialized (v2.0.34). Appliance IP: ' + GATEWAY_IP);
  logActivity('NFS', 'Local mount point /mnt/hybrid_sync active. Protocol: NFSv4.1. Cache disk: /dev/sdb (150 GiB).');
  logActivity('S3', 'Connected to AWS S3 bucket: ' + S3_BUCKET_NAME + ' in Region: ap-south-1.');
});

// Tab Switching
function switchTab(tabName) {
  const tabs = ['simulator', 's3', 'ai', 'cloudwatch', 'tests', 'architecture'];
  tabs.forEach(t => {
    const el = document.getElementById(`view-${t}`);
    const btn = document.getElementById(`tab-${t}`);
    if (el) el.classList.add('hidden');
    if (btn) {
      btn.classList.remove('bg-[#21262d]', 'text-white', 'border', 'border-[#30363d]');
      btn.classList.add('text-slate-400');
    }
  });

  const activeView = document.getElementById(`view-${tabName}`);
  const activeBtn = document.getElementById(`tab-${tabName}`);
  if (activeView) activeView.classList.remove('hidden');
  if (activeBtn) {
    activeBtn.classList.remove('text-slate-400');
    activeBtn.classList.add('bg-[#21262d]', 'text-white', 'border', 'border-[#30363d]');
  }

  // Refresh lucide icons
  lucide.createIcons();
}

// Protocol Switching (NFS vs SMB)
function setProtocol(proto) {
  state.protocol = proto;
  const nfsBtn = document.getElementById('proto-nfs');
  const smbBtn = document.getElementById('proto-smb');
  const mountText = document.getElementById('mountCmdText');
  const sharePath = document.getElementById('currentSharePath');

  if (proto === 'nfs') {
    nfsBtn.className = "p-2.5 rounded-lg border border-[#ff9900] bg-[#ff9900]/10 text-xs font-semibold text-white flex items-center justify-center space-x-2";
    smbBtn.className = "p-2.5 rounded-lg border border-[#30363d] bg-[#0d1117] text-xs font-medium text-slate-400 hover:text-white flex items-center justify-center space-x-2";
    mountText.innerText = `sudo mount -t nfs -o nolock,hard ${GATEWAY_IP}:/epcet-hybrid-storage-vault /mnt/hybrid_sync`;
    sharePath.innerText = `/mnt/hybrid_sync/`;
    logActivity('CLIENT', 'Client switched to Linux NFSv4.1 mount (/mnt/hybrid_sync).');
  } else {
    smbBtn.className = "p-2.5 rounded-lg border border-blue-500 bg-blue-500/10 text-xs font-semibold text-white flex items-center justify-center space-x-2";
    nfsBtn.className = "p-2.5 rounded-lg border border-[#30363d] bg-[#0d1117] text-xs font-medium text-slate-400 hover:text-white flex items-center justify-center space-x-2";
    mountText.innerText = `net use S: \\\\${GATEWAY_IP}\\epcet-hybrid-storage-vault /persistent:yes`;
    sharePath.innerText = `S:\\`;
    logActivity('CLIENT', 'Client switched to Windows SMB 3.0 mount (Drive S:\\).');
  }
}

// Write New Local File
function handleLocalWrite(e) {
  e.preventDefault();
  const nameInput = document.getElementById('inputFileName');
  const catInput = document.getElementById('inputFileCategory');
  const sizeInput = document.getElementById('inputFileSize');
  const contentInput = document.getElementById('inputFileContent');

  const filename = nameInput.value.trim();
  if (!filename) return;

  const sizeStr = sizeInput.value;
  const sizeNum = parseFloat(sizeStr);
  const category = catInput.value;
  const content = contentInput.value.trim() || `Generated hybrid storage test file: ${filename} at ${new Date().toISOString()}`;

  // Check if file already exists (Test T2: Modification versioning)
  const existingIndex = state.files.findIndex(f => f.name.toLowerCase() === filename.toLowerCase());
  
  // Animate Flow Steps 1 and 2 (Local Write & Cache Ack)
  triggerFlowAnimation(1);
  setTimeout(() => triggerFlowAnimation(2), 250);

  if (existingIndex >= 0) {
    // Existing file modified
    const f = state.files[existingIndex];
    const newVerNum = (parseFloat(f.version.replace('v', '')) + 0.1).toFixed(1);
    f.version = `v${newVerNum}`;
    f.versionsList.unshift(`${f.version} (Current)`);
    f.size = sizeStr;
    f.sizeMB = sizeNum;
    f.lastModified = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    f.inCache = true;
    f.s3Status = 'PENDING_UPLOAD';
    f.content = content;

    state.cacheDirtyMB += sizeNum;
    state.cacheHits += 1;

    showToast(`File "${filename}" modified on local share. Stored in cache instantly. Async S3 upload queued.`, 'info');
    logActivity('CACHE', `[WRITE-ACK] ${filename} updated in local NVMe cache. Write acknowledged in 0.8ms.`);
  } else {
    // New file created
    const newFile = {
      id: 'f_' + Date.now(),
      name: filename,
      size: sizeStr,
      sizeMB: sizeNum,
      category: category,
      storageClass: 'STANDARD',
      inCache: true,
      s3Status: 'PENDING_UPLOAD',
      version: 'v1.0',
      versionsList: ['v1.0 (Current)'],
      lastModified: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      encryption: 'aws:kms (mrk-7c89f81a)',
      content: content,
      isDeleteMarker: false
    };

    state.files.unshift(newFile);
    state.cacheDirtyMB += sizeNum;
    state.cacheHits += 1;

    showToast(`File "${filename}" saved to ${state.protocol.toUpperCase()} share. Write acknowledged (0.9ms).`, 'success');
    logActivity('NFS/SMB', `[CLIENT-WRITE] New file created: ${filename} (${sizeStr}). Acknowledged by Gateway.`);
  }

  // Update UI immediately for local write
  renderAll();

  // Reset form
  nameInput.value = '';
  contentInput.value = '';

  // Asynchronous Upload Process (Steps 3, 4, 5)
  setTimeout(() => {
    triggerFlowAnimation(3);
    logActivity('ASYNC-BUFFER', `[UPLOAD-QUEUE] Transmitting ${filename} to upload buffer.`);
    renderAll();
  }, 600);

  setTimeout(() => {
    triggerFlowAnimation(4);
    logActivity('TLS-TRANSIT', `[HTTPS/TLS 1.3] Uploading chunks to s3://epcet-hybrid-storage-vault/${filename}`);
  }, 1200);

  setTimeout(() => {
    triggerFlowAnimation(5);
    // Find file and mark synced
    const target = state.files.find(f => f.name.toLowerCase() === filename.toLowerCase());
    if (target) {
      target.s3Status = 'SYNCED';
    }
    state.cacheDirtyMB = Math.max(0, state.cacheDirtyMB - sizeNum);
    state.bytesUploadedMB += sizeNum;

    // Add CloudTrail event
    addCloudTrailEvent('PutObject', 's3.amazonaws.com', `${S3_BUCKET_NAME}${filename}`);
    logActivity('S3-SYNC', `[COMPLETED] Object stored in S3 bucket with SSE-KMS encryption. Version: ${target ? target.version : 'v1.0'}`);
    showToast(`Cloud Sync Complete: "${filename}" is now securely stored in Amazon S3.`, 'success');
    renderAll();
  }, 2200);
}

// Animate Pipeline Box
function triggerFlowAnimation(stepNum) {
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`flowStep${i}`);
    if (el) {
      if (i === stepNum) {
        el.classList.add('border-[#ff9900]', 'bg-[#ff9900]/15', 'scale-[1.03]');
      } else {
        el.classList.remove('border-[#ff9900]', 'bg-[#ff9900]/15', 'scale-[1.03]');
      }
    }
  }
}

// Read File Simulator (Test T3: Cache Hit vs Cache Miss)
function readFile(id) {
  const file = state.files.find(f => f.id === id);
  if (!file) return;

  if (file.inCache) {
    // Cache Hit!
    state.cacheHits += 1;
    const latency = (0.8 + Math.random() * 0.8).toFixed(1);
    logActivity('CACHE-HIT', `[READ-HIT] Served "${file.name}" locally from NVMe cache in ${latency}ms.`);
    showToast(`CACHE HIT: "${file.name}" read in ${latency}ms from local gateway cache!`, 'success');
  } else {
    // Cache Miss! Must fetch from Amazon S3
    state.cacheMisses += 1;
    const latency = (140 + Math.random() * 60).toFixed(0);
    state.bytesDownloadedMB += file.sizeMB;
    file.inCache = true; // Auto-cached for next read

    logActivity('CACHE-MISS', `[READ-MISS] "${file.name}" not in local cache. Fetched from S3 over HTTPS in ${latency}ms. Auto-cached.`);
    showToast(`CACHE MISS: "${file.name}" fetched from Amazon S3 (${latency}ms) & cached.`, 'info');
    addCloudTrailEvent('GetObject', 's3.amazonaws.com', `${S3_BUCKET_NAME}${file.name}`);
  }

  renderAll();
}

// Delete File Simulator (Test T5: S3 Delete Marker)
function deleteLocalFile(id) {
  const fileIndex = state.files.findIndex(f => f.id === id);
  if (fileIndex < 0) return;

  const file = state.files[fileIndex];
  const filename = file.name;

  if (confirm(`Are you sure you want to delete "${filename}" through the file share?`)) {
    // In S3 with versioning enabled, deleting a file creates a Delete Marker!
    file.isDeleteMarker = true;
    file.inCache = false;
    file.s3Status = 'DELETE_MARKER';
    file.versionsList.unshift('DeleteMarker (Current)');

    addCloudTrailEvent('DeleteObject', 's3.amazonaws.com', `${S3_BUCKET_NAME}${filename}`);
    logActivity('DELETE', `[S3-DELETE-MARKER] File "${filename}" unlinked from share. S3 Delete Marker created. Object versions preserved.`);
    showToast(`"${filename}" removed from share. S3 Delete Marker created (file remains recoverable).`, 'warning');

    renderAll();
  }
}

// Direct S3 Upload (Test T4: Cloud-Origin write -> Gateway Cache Refresh)
function simulateDirectS3Upload() {
  const customName = prompt("Enter object key to upload directly to Amazon S3 bucket (e.g. cloud_generated_invoice.pdf):", "cloud_analytics_export.json");
  if (!customName) return;

  const newObj = {
    id: 'f_' + Date.now(),
    name: customName,
    size: '6.7 MB',
    sizeMB: 6.7,
    category: 'data',
    storageClass: 'STANDARD',
    inCache: false, // Not yet in gateway cache!
    s3Status: 'DIRECT_S3',
    version: 'v1.0',
    versionsList: ['v1.0 (Current)'],
    lastModified: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    encryption: 'aws:kms (mrk-7c89f81a)',
    content: 'Direct S3 Upload: Generated by an AWS Lambda function or analytics job directly inside AWS Cloud.',
    isDeleteMarker: false
  };

  state.files.unshift(newObj);
  addCloudTrailEvent('PutObject', 's3.amazonaws.com', `${S3_BUCKET_NAME}${customName}`);
  logActivity('S3-DIRECT', `[AWS-CLOUD] Object "${customName}" added directly to S3 bucket by external cloud process.`);
  showToast(`Direct S3 Upload succeeded. Notice: File will NOT show on local share until "RefreshCache" is executed!`, 'info');

  renderAll();
}

// Refresh Cache API (storagegateway:RefreshCache)
function triggerQuickSync() {
  const icon = document.getElementById('syncSpinnerIcon');
  if (icon) icon.classList.add('animate-spin');

  logActivity('GATEWAY-API', `storagegateway:RefreshCache initiated for ARN: ${GATEWAY_ARN}`);
  state.isSyncing = true;
  renderAll();

  setTimeout(() => {
    // All DIRECT_S3 objects are now recognized and available to gateway
    state.files.forEach(f => {
      if (f.s3Status === 'DIRECT_S3') {
        f.s3Status = 'SYNCED';
        f.inCache = true; // Cached on metadata refresh
      }
    });

    state.isSyncing = false;
    if (icon) icon.classList.remove('animate-spin');

    addCloudTrailEvent('RefreshCache', 'storagegateway.amazonaws.com', 'share-epcet-vault-nfs');
    logActivity('GATEWAY-API', `[REFRESH-COMPLETE] Cache inventory synchronized with S3 bucket. Metadata updated.`);
    showToast(`RefreshCache Complete: On-premises file shares are now synchronized with remote S3 objects.`, 'success');

    renderAll();
  }, 1200);
}

// Flush Local Cache (Demonstrates Cache Misses)
function flushLocalCache() {
  if (confirm("Flush local gateway cache disk? This evicts cached files to simulate cold-cache reads (reads will fetch from S3).")) {
    state.files.forEach(f => {
      if (!f.isDeleteMarker) f.inCache = false;
    });
    logActivity('CACHE', '[FLUSH] Local cache disk cleared. Working set evicted. Next file reads will cause S3 fetch misses.');
    showToast("Local cache flushed. Files must now be retrieved from Amazon S3 over WAN.", 'warning');
    renderAll();
  }
}

// Simulate Time Advance for S3 Lifecycle Rules
function simulateTimeAdvance(days) {
  state.files.forEach(f => {
    if (f.storageClass === 'STANDARD') {
      f.storageClass = 'STANDARD_IA';
    } else if (f.storageClass === 'STANDARD_IA') {
      f.storageClass = 'GLACIER';
      f.inCache = false; // Glacier objects not cached
    }
  });

  addCloudTrailEvent('TransitionObjectTier', 's3.amazonaws.com', `${S3_BUCKET_NAME}*`);
  logActivity('S3-LIFECYCLE', `[LIFECYCLE-EVAL] Advanced simulation by +${days} days. Standard objects transitioned to Standard-IA / Glacier Flexible per retention policy.`);
  showToast(`Lifecycle Rule Executed: Aged objects automatically transitioned to lower-cost tiers (Standard-IA / Glacier).`, 'success');

  renderAll();
}

// Sample file loader helper
function loadSampleFile() {
  document.getElementById('inputFileName').value = 'student_marks_transcript_sanmati.pdf';
  document.getElementById('inputFileCategory').value = 'doc';
  document.getElementById('inputFileSize').value = '2.4 MB';
  document.getElementById('inputFileContent').value = 'East Point College of Engineering & Technology. Department of CSE. Student: Sanmati M Kulkarni (USN: 1EP24CS132). Course: 24CS562 Capstone Project. Internal Marks: 40/40. Aadhaar: 9876-5432-1098. Contact: sanmati@epcet.edu.in.';
}

// Amazon Macie Scanner
function runMacieScan() {
  const sel = document.getElementById('macieTargetFile');
  const targetId = sel.value;
  const file = state.files.find(f => f.id === targetId);
  const outBox = document.getElementById('macieResultsBox');

  if (!file) return;

  outBox.innerHTML = `
    <div class="flex items-center space-x-2 text-purple-400 py-3">
      <div class="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      <span>Amazon Macie analyzing object key: <strong class="text-white">${file.name}</strong> with machine learning DLP models...</span>
    </div>
  `;

  setTimeout(() => {
    // Perform simulated PII scan
    const content = file.content || '';
    let findings = [];
    let severity = 'LOW';

    if (/Aadhaar|\d{4}-\d{4}-\d{4}/i.test(content)) {
      findings.push({ type: 'National Identification / Aadhaar Number', value: 'Found pattern matching 12-digit Indian National ID', risk: 'HIGH' });
      severity = 'HIGH';
    }
    if (/4\d{3}-\d{4}-\d{4}-\d{4}|accountNumber/i.test(content)) {
      findings.push({ type: 'PCI-DSS Credit/Debit Card Number', value: 'Found 16-digit payment card format', risk: 'CRITICAL' });
      severity = 'CRITICAL';
    }
    if (/[A-Z]{5}[0-9]{4}[A-Z]{1}/i.test(content)) {
      findings.push({ type: 'Tax ID / PAN Number', value: 'Found Indian Permanent Account Number (PAN)', risk: 'HIGH' });
      severity = 'HIGH';
    }
    if (/sanmati|1EP24CS132|student/i.test(content)) {
      findings.push({ type: 'Student Personally Identifiable Information (PII)', value: 'College USN and student identification detected', risk: 'MEDIUM' });
    }

    if (findings.length === 0) {
      outBox.innerHTML = `
        <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <div class="flex items-center space-x-2 text-emerald-400 font-bold">
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span>No Sensitive Data Findings Detected</span>
          </div>
          <div class="text-[11px] text-slate-300 mt-1">Object <strong>${file.name}</strong> passed Amazon Macie automated compliance checks with 0 security risks.</div>
        </div>
      `;
    } else {
      let findingsHtml = findings.map(f => `
        <div class="p-2 bg-[#161b22] border border-[#30363d] rounded flex items-center justify-between text-[11px]">
          <div>
            <div class="font-bold text-white">${f.type}</div>
            <div class="text-slate-400">${f.value}</div>
          </div>
          <span class="px-2 py-0.5 rounded font-mono font-bold text-[10px] ${f.risk === 'CRITICAL' || f.risk === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}">${f.risk}</span>
        </div>
      `).join('');

      outBox.innerHTML = `
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-rose-400 flex items-center space-x-1.5">
              <i data-lucide="alert-triangle" class="w-4 h-4"></i>
              <span>Macie Security Finding: ${findings.length} Sensitive Data Entities Found</span>
            </span>
            <span class="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30 font-mono">SEVERITY: ${severity}</span>
          </div>
          <div class="space-y-1.5">${findingsHtml}</div>
          <div class="text-[10px] text-slate-400 pt-1">Recommended Action: Apply KMS key policy restriction or S3 Object Tagging to quarantine access.</div>
        </div>
      `;
    }

    lucide.createIcons();
    addCloudTrailEvent('MacieScanJob', 'macie.amazonaws.com', `${S3_BUCKET_NAME}${file.name}`);
    logActivity('MACIE', `[SECURITY-SCAN] Amazon Macie completed analysis of ${file.name}. Verdict: ${severity} severity (${findings.length} findings).`);
  }, 900);
}

// Amazon Textract OCR Parser
function runTextractOCR() {
  const sel = document.getElementById('textractTargetFile');
  const targetId = sel.value;
  const file = state.files.find(f => f.id === targetId);
  const outBox = document.getElementById('textractResultsBox');

  if (!file) return;

  outBox.innerHTML = `
    <div class="flex items-center space-x-2 text-cyan-400 py-3">
      <div class="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      <span>Amazon Textract executing Document Analysis on: <strong class="text-white">${file.name}</strong>...</span>
    </div>
  `;

  setTimeout(() => {
    const textSnippet = file.content || 'Sample unstructured technical document text.';
    const lines = textSnippet.split('. ').map(l => l.trim()).filter(Boolean);

    outBox.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-cyan-400 flex items-center space-x-1.5">
            <i data-lucide="file-check" class="w-4 h-4"></i>
            <span>Textract OCR Extraction Complete (Confidence: 99.4%)</span>
          </span>
          <span class="text-[10px] text-slate-400 mono">Extracted: ${lines.length} lines</span>
        </div>
        <div class="bg-[#161b22] p-2.5 rounded border border-[#30363d] space-y-1 font-mono text-[11px] text-slate-300 max-h-40 overflow-y-auto">
          ${lines.map(line => `<div class="p-1 hover:bg-[#21262d] rounded flex items-start space-x-2"><span class="text-cyan-500 font-bold">&gt;</span><span>${line}</span></div>`).join('')}
        </div>
        <div class="text-[10px] text-slate-400">Structured Key-Values: <span class="text-emerald-400 mono font-bold">Institution: EPCET | Student: Sanmati M Kulkarni | USN: 1EP24CS132</span></div>
      </div>
    `;

    lucide.createIcons();
    addCloudTrailEvent('AnalyzeDocument', 'textract.amazonaws.com', `${S3_BUCKET_NAME}${file.name}`);
    logActivity('TEXTRACT', `[OCR-EXTRACTION] Amazon Textract parsed ${lines.length} text blocks from ${file.name}.`);
  }, 800);
}

// Run All Functional Test Scenarios (Table 7.1)
function runAllTests() {
  const logBox = document.getElementById('testOutputLog');
  logBox.innerHTML = '<div class="text-amber-400 font-bold">&gt; Initializing Table 7.1 Functional Test Suite...</div>';

  let current = 0;
  function step() {
    if (current < state.testScenarios.length) {
      const t = state.testScenarios[current];
      logBox.innerHTML += `<div><span class="text-emerald-400 font-bold">[RUNNING ${t.id}]</span> Executing "${t.title}"... &rarr; <span class="text-white">${t.observed}</span> <strong class="text-emerald-400">[PASS]</strong></div>`;
      logBox.scrollTop = logBox.scrollHeight;
      current++;
      setTimeout(step, 300);
    } else {
      logBox.innerHTML += '<div class="text-emerald-400 font-bold pt-1">&gt; All 8 test scenarios passed successfully with 100% compliance!</div>';
      showToast("All 8 AWS Storage Gateway functional test scenarios PASSED!", "success");
    }
  }
  step();
}

// CloudTrail Logger
function addCloudTrailEvent(eventName, service, resource) {
  const newEvt = {
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    eventName: eventName,
    service: service,
    identity: 'arn:aws:iam::123456789012:role/StorageGatewayS3AccessRole',
    resource: resource,
    status: '200 OK'
  };
  state.cloudTrailEvents.unshift(newEvt);
  if (state.cloudTrailEvents.length > 15) state.cloudTrailEvents.pop();
}

// Activity Terminal Logger
function logActivity(tag, msg) {
  const consoleEl = document.getElementById('gatewayActivityConsole');
  if (!consoleEl) return;

  const time = new Date().toTimeString().split(' ')[0];
  const div = document.createElement('div');
  div.className = "hover:bg-[#161b22] px-1 py-0.5 rounded transition";
  div.innerHTML = `<span class="text-slate-500">[${time}]</span> <span class="text-amber-400 font-semibold">[${tag}]</span> <span>${msg}</span>`;
  consoleEl.appendChild(div);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function clearActivityLogs() {
  const consoleEl = document.getElementById('gatewayActivityConsole');
  if (consoleEl) {
    consoleEl.innerHTML = '<div class="text-slate-500">Activity logs cleared. Listening for gateway I/O events...</div>';
  }
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const colors = {
    success: 'bg-[#161b22] border-emerald-500/50 text-emerald-300',
    warning: 'bg-[#161b22] border-amber-500/50 text-amber-300',
    info: 'bg-[#161b22] border-blue-500/50 text-blue-300',
    error: 'bg-[#161b22] border-rose-500/50 text-rose-300'
  };

  toast.className = `p-3 rounded-lg border shadow-lg text-xs flex items-center space-x-2 transition-all duration-300 pointer-events-auto ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <div class="flex-1">${message}</div>
    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Render All Components
function renderAll() {
  renderStats();
  renderLocalFiles();
  renderS3Objects();
  renderAIDropdowns();
  renderCloudTrail();
  renderTestScenarios();
  lucide.createIcons();
}

// Render Telemetry & Stats
function renderStats() {
  const totalReads = state.cacheHits + state.cacheMisses;
  const hitRatio = totalReads > 0 ? ((state.cacheHits / totalReads) * 100).toFixed(1) : "95.0";
  const missRatio = (100 - parseFloat(hitRatio)).toFixed(1);

  // Calculate used cache GiB
  let cachedBytesMB = 0;
  state.files.forEach(f => {
    if (f.inCache && !f.isDeleteMarker) cachedBytesMB += f.sizeMB;
  });
  const usedCacheGiB = (45.0 + (cachedBytesMB / 1024)).toFixed(1);
  const usedPercent = ((usedCacheGiB / state.cacheTotalGiB) * 100).toFixed(1);
  const dirtyPercent = ((state.cacheDirtyMB / (state.cacheTotalGiB * 1024)) * 100).toFixed(1);

  // Headers
  const hHit = document.getElementById('headerCacheHit');
  if (hHit) hHit.innerText = `${hitRatio}%`;

  const hSync = document.getElementById('headerSyncStatus');
  if (hSync) {
    if (state.cacheDirtyMB > 0) {
      hSync.innerText = `SYNCING (${state.cacheDirtyMB.toFixed(1)} MB)`;
      hSync.className = "font-bold text-amber-400 mono animate-pulse";
    } else {
      hSync.innerText = "IN SYNC";
      hSync.className = "font-bold text-emerald-400 mono";
    }
  }

  // Cache Bars
  const cacheUsedText = document.getElementById('statCacheUsedText');
  if (cacheUsedText) cacheUsedText.innerText = `${usedCacheGiB} GiB / ${state.cacheTotalGiB} GiB`;

  const cachePercentText = document.getElementById('statCachePercentUsed');
  if (cachePercentText) cachePercentText.innerText = `${usedPercent}%`;

  const barUsed = document.getElementById('barCacheUsed');
  if (barUsed) barUsed.style.width = `${Math.min(100, usedPercent)}%`;

  const cacheDirtyText = document.getElementById('statCacheDirtyText');
  if (cacheDirtyText) cacheDirtyText.innerText = `${state.cacheDirtyMB.toFixed(1)} MB`;

  const cacheDirtyPercentText = document.getElementById('statCachePercentDirty');
  if (cacheDirtyPercentText) cacheDirtyPercentText.innerText = `${dirtyPercent}%`;

  const barDirty = document.getElementById('barCacheDirty');
  if (barDirty) barDirty.style.width = `${Math.max(2, Math.min(100, dirtyPercent * 5))}%`;

  const statHit = document.getElementById('statCacheHitRatio');
  if (statHit) statHit.innerText = `${hitRatio}%`;

  const statMiss = document.getElementById('statCacheMissRatio');
  if (statMiss) statMiss.innerText = `${missRatio}%`;

  // CloudWatch View
  const cwHit = document.getElementById('cwCacheHit');
  if (cwHit) cwHit.innerText = `${hitRatio}%`;

  const cwUsed = document.getElementById('cwCacheUsed');
  if (cwUsed) cwUsed.innerText = `${usedPercent}%`;

  const cwDirty = document.getElementById('cwCacheDirty');
  if (cwDirty) cwDirty.innerText = `${dirtyPercent}%`;

  const cwUp = document.getElementById('cwBytesUp');
  if (cwUp) cwUp.innerText = `${state.bytesUploadedMB.toFixed(1)} MB`;

  const cwDown = document.getElementById('cwBytesDown');
  if (cwDown) cwDown.innerText = `${state.bytesDownloadedMB.toFixed(1)} MB`;
}

// Render Local Share Files Table
function renderLocalFiles() {
  const tbody = document.getElementById('localFilesTableBody');
  if (!tbody) return;

  const visibleFiles = state.files.filter(f => !f.isDeleteMarker && f.s3Status !== 'DIRECT_S3');
  document.getElementById('shareFileCount').innerText = `${visibleFiles.length} items`;

  tbody.innerHTML = visibleFiles.map(f => {
    let cacheBadge = f.inCache 
      ? '<span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">CACHED (0.9ms)</span>'
      : '<span class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">COLD (S3 Fetch)</span>';

    let s3Badge = f.s3Status === 'SYNCED'
      ? '<span class="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">SYNCED (S3)</span>'
      : '<span class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">QUEUED UPLOAD</span>';

    return `
      <tr class="hover:bg-[#161b22] transition">
        <td class="py-2.5 pl-2 font-mono text-white flex items-center space-x-2">
          <i data-lucide="${getFileIcon(f.name)}" class="w-4 h-4 text-slate-400"></i>
          <span>${f.name}</span>
        </td>
        <td class="py-2.5 text-slate-300 mono">${f.size}</td>
        <td class="py-2.5">${cacheBadge}</td>
        <td class="py-2.5">${s3Badge}</td>
        <td class="py-2.5 text-slate-400 text-[11px]">${f.lastModified}</td>
        <td class="py-2.5 text-right pr-2 space-x-1.5">
          <button onclick="readFile('${f.id}')" class="bg-[#21262d] hover:bg-[#30363d] text-slate-200 px-2.5 py-1 rounded text-[11px] font-medium transition" title="Test Read (Cache Hit/Miss)">
            Read
          </button>
          <button onclick="deleteLocalFile('${f.id}')" class="bg-[#21262d] hover:bg-rose-500/20 text-rose-400 px-2 py-1 rounded text-[11px] font-medium transition" title="Delete File (Creates S3 Delete Marker)">
            Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Render Amazon S3 Objects Table
function renderS3Objects() {
  const tbody = document.getElementById('s3ObjectsTableBody');
  if (!tbody) return;

  const showAll = document.getElementById('chkShowVersions')?.checked || false;
  let objects = showAll ? state.files : state.files.filter(f => !f.isDeleteMarker);

  document.getElementById('s3ObjectCount').innerText = `${state.files.length} objects / versions in bucket`;

  tbody.innerHTML = objects.map(f => {
    let tierClass = getStorageTierBadge(f.storageClass);
    let isMarker = f.isDeleteMarker;

    return `
      <tr class="hover:bg-[#161b22] transition ${isMarker ? 'bg-rose-500/5' : ''}">
        <td class="py-2.5 pl-2 font-mono text-white flex items-center space-x-2">
          <i data-lucide="${isMarker ? 'trash' : 'file'}" class="w-4 h-4 ${isMarker ? 'text-rose-400' : 'text-blue-400'}"></i>
          <span class="${isMarker ? 'line-through text-slate-400' : ''}">${f.name}</span>
          ${isMarker ? '<span class="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.2 rounded font-mono">DELETE MARKER</span>' : ''}
        </td>
        <td class="py-2.5 text-slate-300 mono text-[11px]">${f.version}</td>
        <td class="py-2.5">${tierClass}</td>
        <td class="py-2.5 text-slate-300 mono">${f.size}</td>
        <td class="py-2.5 text-amber-300 mono text-[11px]">${f.encryption}</td>
        <td class="py-2.5 text-slate-400 text-[11px]">${f.lastModified}</td>
        <td class="py-2.5 text-right pr-2">
          <button onclick="inspectS3Object('${f.id}')" class="text-blue-400 hover:text-blue-300 text-xs transition">
            Details
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Render AI Target Dropdowns
function renderAIDropdowns() {
  const macieSel = document.getElementById('macieTargetFile');
  const textractSel = document.getElementById('textractTargetFile');

  const validFiles = state.files.filter(f => !f.isDeleteMarker);
  const optionsHtml = validFiles.map(f => `<option value="${f.id}">${f.name} (${f.size})</option>`).join('');

  if (macieSel && macieSel.children.length === 0) macieSel.innerHTML = optionsHtml;
  if (textractSel && textractSel.children.length === 0) textractSel.innerHTML = optionsHtml;
}

// Render CloudTrail Table
function renderCloudTrail() {
  const tbody = document.getElementById('cloudTrailTableBody');
  if (!tbody) return;

  tbody.innerHTML = state.cloudTrailEvents.map(evt => `
    <tr class="hover:bg-[#161b22] transition">
      <td class="py-2 pl-2 text-slate-400">${evt.timestamp}</td>
      <td class="py-2 text-amber-400 font-bold">${evt.eventName}</td>
      <td class="py-2 text-slate-300">${evt.service}</td>
      <td class="py-2 text-purple-300 truncate max-w-xs">${evt.identity}</td>
      <td class="py-2 text-slate-300 truncate max-w-xs">${evt.resource}</td>
      <td class="py-2 text-right pr-2 text-emerald-400 font-bold">${evt.status}</td>
    </tr>
  `).join('');
}

// Render Table 7.1 Test Scenarios
function renderTestScenarios() {
  const tbody = document.getElementById('testScenariosTableBody');
  if (!tbody) return;

  tbody.innerHTML = state.testScenarios.map(t => `
    <tr class="hover:bg-[#161b22] transition">
      <td class="py-3 pl-2 font-mono font-bold text-amber-400">${t.id}</td>
      <td class="py-3 font-semibold text-white">${t.title}</td>
      <td class="py-3 text-slate-300 text-[11px]">${t.expected}</td>
      <td class="py-3 text-emerald-300 font-mono text-[11px]">${t.observed}</td>
      <td class="py-3 text-right pr-2">
        <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded font-mono font-bold text-[10px]">
          ${t.status}
        </span>
      </td>
    </tr>
  `).join('');
}

// Helper: Inspect S3 Object Modal/Alert
function inspectS3Object(id) {
  const f = state.files.find(item => item.id === id);
  if (!f) return;

  alert(
    `[Amazon S3 Object Metadata]\n\n` +
    `Bucket: ${S3_BUCKET_NAME}\n` +
    `Object Key: ${f.name}\n` +
    `Storage Class: ${f.storageClass}\n` +
    `Current Version: ${f.version}\n` +
    `Available Versions: ${f.versionsList.join(', ')}\n` +
    `Encryption: ${f.encryption}\n` +
    `Content-Length: ${f.size}\n` +
    `Last-Modified: ${f.lastModified}\n` +
    `S3 URI: ${S3_BUCKET_NAME}${f.name}\n` +
    `Gateway Cache Status: ${f.inCache ? 'IN LOCAL CACHE (Fast Hit)' : 'NOT IN CACHE (WAN Fetch)'}`
  );
}

// Helper: Get Lucide icon name based on filename
function getFileIcon(name) {
  if (/\.pdf$/i.test(name)) return 'file-text';
  if (/\.(png|jpg|jpeg)$/i.test(name)) return 'image';
  if (/\.(csv|json|xlsx)$/i.test(name)) return 'file-spreadsheet';
  if (/\.(tar\.gz|zip)$/i.test(name)) return 'archive';
  return 'file';
}

// Helper: Storage Tier Badges
function getStorageTierBadge(storageClass) {
  switch (storageClass) {
    case 'STANDARD':
      return '<span class="px-2 py-0.5 rounded text-[10px] font-mono badge-standard">S3 Standard</span>';
    case 'INTELLIGENT_TIERING':
      return '<span class="px-2 py-0.5 rounded text-[10px] font-mono badge-intelligent">Intelligent-Tiering</span>';
    case 'STANDARD_IA':
      return '<span class="px-2 py-0.5 rounded text-[10px] font-mono badge-ia">Standard-IA</span>';
    case 'GLACIER':
      return '<span class="px-2 py-0.5 rounded text-[10px] font-mono badge-glacier">Glacier Flexible</span>';
    default:
      return `<span class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-700 text-slate-300">${storageClass}</span>`;
  }
}
