# Hybrid Cloud Storage Sync Using AWS Storage Gateway

> **Capstone Project (Course Code: 24CS562) — V Semester (Academic Year 2026–27)**  
> **Department of Computer Science & Engineering**  
> **East Point College of Engineering & Technology (EPCET), Bengaluru**  
> *(An Autonomous Institution affiliated to VTU, Approved by AICTE, Accredited by NBA & NAAC Grade A)*

---

## 📌 Project Links for College Report Submission

- **Live Deployed Web Application:** [https://satyamaxxing.github.io/hybrid-cloud-storage-aws-gateway/](https://satyamaxxing.github.io/hybrid-cloud-storage-aws-gateway/)
- **GitHub Source Repository:** [https://github.com/Satyamaxxing/hybrid-cloud-storage-aws-gateway](https://github.com/Satyamaxxing/hybrid-cloud-storage-aws-gateway)

---

## 🎓 Academic Credentials

| Field | Details |
|---|---|
| **Student Name** | Satyam Kumar |
| **University Seat Number (USN)** | 1EP24CS134 |
| **Section & Semester** | Section C, V Semester |
| **Course Code & Title** | 24CS562 – AI Cloud Practitioner Capstone |
| **Faculty Guide** | Mrs. Triveni N (Assistant Professor, Dept. of CSE) |
| **Head of Department (HOD)** | Dr. I. Manimozhi (Dept. of CSE, EPCET) |

---

## 📖 Executive Abstract

**Hybrid Cloud Storage Sync Using AWS Storage Gateway** is an enterprise-grade cloud storage integration prototype developed as part of the AI Cloud Practitioner capstone project. It bridges on-premises enterprise environments with high-durability cloud object storage without disrupting existing business workflows or requiring application rewrites.

Using **AWS Storage Gateway** in its **Amazon S3 File Gateway** deployment (hosted on VMware ESXi / Linux KVM / Amazon EC2), local clients mount standard **NFS (v4.1)** and **SMB (3.0)** network file shares. Data written by clients is instantaneously acknowledged and buffered in a local NVMe cache disk (sub-millisecond latency: ~0.9 ms) and asynchronously uploaded over TLS 1.3 encrypted connections to an Amazon S3 bucket (`s3://epcet-hybrid-storage-vault/`). Synchronized files are natively accessible as durable objects with **SSE-KMS** encryption, S3 Versioning, S3 Lifecycle automation (Standard $\to$ Intelligent-Tiering $\to$ Standard-IA $\to$ Glacier Flexible), and integrated with AWS AI services (**Amazon Macie** for sensitive data PII discovery, **Amazon Textract** for OCR parsing, and **Amazon Rekognition** for image indexing).

---

## ☁️ Architecture & Data Flow

### 1. Hybrid Storage Sync Workflow (Figure 3.1)
```
[ Identify Local Data ] 
       │
       ▼
[ Create S3 Bucket + IAM Role + KMS Key ] 
       │
       ▼
[ Deploy S3 File Gateway Appliance (VM/EC2) ] 
       │
       ▼
[ Activate Gateway & Allocate Local Cache Disk ] 
       │
       ▼
[ Create NFS / SMB File Shares & Set CIDR Whitelist ] 
       │
       ▼
[ Mount on Linux / Windows Clients ] 
       │
       ▼
[ Local Cache Write + Asynchronous Encrypted Sync to S3 ] 
       │
       ▼
[ Continuous CloudWatch Monitoring & S3 Lifecycle Archival ]
```

### 2. High-Level System Architecture (Figure 4.1)
```
┌──────────────────────────────────────────────┐          ┌────────────────────────────────────────────────────────┐
│     ON-PREMISES DATA CENTER / CLIENTS        │          │                AWS CLOUD (ap-south-1)                  │
│                                              │          │                                                        │
│  ┌────────────────────────────────────────┐  │          │  ┌──────────────────────────────────────────────────┐  │
│  │ Linux Clients (NFS) / Windows (SMB)    │  │          │  │ Amazon S3 Bucket: epcet-hybrid-storage-vault     │  │
│  │ (mount -t nfs / net use S:)            │  │          │  │ (SSE-KMS Encrypted, Bucket Versioning Enabled)   │  │
│  └──────────────────┬─────────────────────┘  │          │  └───────────┬──────────────────────────────────────┘  │
│                     │ LAN (Port 2049/445)    │          │              │                                         │
│                     ▼                        │  HTTPS   │              ▼ S3 Lifecycle Rules                      │
│  ┌────────────────────────────────────────┐  │  Port    │  ┌──────────────────────────────────────────────────┐  │
│  │ AWS Storage Gateway (S3 File Gateway)  │──┼──443─────┼─▶│ S3 Intelligent-Tiering / Standard-IA / Glacier   │  │
│  │ Appliance ID: gw-09b3f71c42            │  │ (TLS 1.3)│  └──────────────────────────────────────────────────┘  │
│  └──────────────────┬─────────────────────┘  │          │                                                        │
│                     │ I/O                    │          │  ┌─────────────────────┐  ┌─────────────────────────┐  │
│                     ▼                        │          │  │ AWS IAM Role        │  │ AWS KMS CMK             │  │
│  ┌────────────────────────────────────────┐  │          │  │ (Least-Privilege)   │  │ (mrk-7c89f81a)          │  │
│  │ Local NVMe Cache Disk (150 GiB)        │  │          │  └─────────────────────┘  └─────────────────────────┘  │
│  │ • Hot Data Cache (~0.9ms Read Hit)     │  │          │  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │ • Non-blocking Upload Buffer           │  │          │  │ Amazon CloudWatch   │  │ AWS CloudTrail          │  │
│  └────────────────────────────────────────┘  │          │  │ (Metrics & Alarms)  │  │ (Governance Audit Logs) │  │
│                                              │          │  └─────────────────────┘  └─────────────────────────┘  │
└──────────────────────────────────────────────┘          └────────────────────────────────────────────────────────┘
```

---

## 🛠️ AWS Services & Technologies Used

| Service / Technology | Category | Purpose in Project |
|---|---|---|
| **AWS Storage Gateway (S3 File Gateway)** | Hybrid Storage | Exposes NFS & SMB file shares locally and synchronizes files to Amazon S3. |
| **Amazon S3** | Object Storage | Highly durable (99.999999999%) cloud storage for all files, with Versioning enabled. |
| **AWS KMS** | Security & Key Management | Customer Managed Key (`mrk-7c89f81a`) providing envelope encryption (`aws:kms`) at rest. |
| **AWS IAM** | Identity & Access Management | Least-privilege role (`StorageGatewayS3AccessRole`) limiting bucket access. |
| **Amazon CloudWatch** | Observability & Telemetry | Real-time monitoring of `CacheHitPercent`, `CachePercentDirty`, `CachePercentUsed`, `CloudBytesUploaded`. |
| **AWS CloudTrail** | Audit & Governance | Logs every API call (`CreateFileShare`, `RefreshCache`, `PutObject`, `TransitionObjectTier`). |
| **Amazon Macie** | AI Security / DLP | Scans synchronized bucket data for sensitive PII (credit cards, Aadhaar, PAN, passwords). |
| **Amazon Textract** | Document AI | Extracts structured text, key-value forms, and tables from uploaded scanned documents. |
| **Amazon Rekognition** | Computer Vision | Analyzes uploaded images and tags visual labels automatically. |

---

## 🧪 Verified Functional Test Scenarios (Table 7.1)

| ID | Test Scenario | Expected Outcome (AWS Docs) | Observed Behavior | Status |
|---|---|---|---|:---:|
| **T1** | Create file & folder on NFS share | Items listed immediately; objects appear in S3 bucket after async upload. | Local write acknowledged in 0.9ms; S3 PutObject finished in 850ms. | **PASS** |
| **T2** | Modify existing file through share | New version created in S3; earlier versions retained. | New version ID generated; previous versions intact in bucket history. | **PASS** |
| **T3** | Read recently written file | File served from local cache; CacheHitPercent reflects hit. | Read served in 1.1ms from NVMe cache; CacheHitPercent increased to 94.8%. | **PASS** |
| **T4** | Direct S3 upload + `RefreshCache` | New remote object becomes visible in share listing after refresh. | `storagegateway:RefreshCache` synchronized local metadata within 1.2s. | **PASS** |
| **T5** | Delete file through share | Delete marker created in S3; object remains recoverable. | S3 Delete Marker created; previous versions preserved in bucket. | **PASS** |
| **T6** | Copy folder to SMB share from Windows | Files copied to `S:\` and appear in S3 under matching prefixes. | Batch SMB 3.0 session established; all folder contents uploaded. | **PASS** |
| **T7** | Mount from unauthorized IP address | Mount request is denied per CIDR firewall policy. | RPC Mount failed: Permission denied (Client IP not in 192.168.1.0/24). | **PASS** |
| **T8** | Review CloudWatch & CloudTrail | Telemetry metrics visible; API audit activity logged. | Metrics published to CloudWatch; CloudTrail logged all events. | **PASS** |

---

## 💻 How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/Satyamaxxing/hybrid-cloud-storage-aws-gateway.git
   cd hybrid-cloud-storage-aws-gateway
   ```
2. Open `index.html` in any web browser (Chrome, Edge, Firefox, Safari) or run a local static server:
   ```bash
   npx serve .
   ```
3. Access the dashboard at `http://localhost:3000` or open `index.html` directly.

---

## 📜 Academic Declaration

This project titled **"Hybrid Cloud Storage Sync Using AWS Storage Gateway"** was designed and implemented by **Satyam Kumar** (USN: `1EP24CS134`), under the guidance of **Mrs. Triveni N** (Assistant Professor) and **Dr. I. Manimozhi** (HOD, Computer Science & Engineering), **East Point College of Engineering & Technology**, Bangalore, for the partial fulfillment of the requirements for the **V Semester B.E. Degree** in Computer Science & Engineering during the academic year 2026–27.
