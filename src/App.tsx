import { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════
// AGENT DATA
// ═══════════════════════════════════════════════════════════
const AGENTS = [
  // INTELLIGENCE
  { id:'oracle', name:'ORACLE', role:'Predictive Intelligence', cat:'intelligence', emoji:'🔮', color:'#00d4ff',
    status:'running', progress:78, tasks:12450, uptime:'99.8%',
    desc:'Analyzing 847 data streams...', highlight:'sentiment corpus',
    capabilities:['Sentiment Analysis','Trend Forecasting','NLP Processing','Pattern Recognition','Anomaly Detection'],
    logs:['INFO Corpus ingestion complete — 2.3M tokens','OK Sentiment model v3.4 loaded','INFO Processing batch #4821','OK Prediction confidence: 94.7%']
  },
  { id:'mnemosyne', name:'MNEMOSYNE', role:'Memory Architect', cat:'intelligence', emoji:'🧬', color:'#7928ca',
    status:'running', progress:90, tasks:8932, uptime:'99.9%',
    desc:'Consolidating episodic memory...', highlight:'memory graph',
    capabilities:['Episodic Memory','Vector DB Management','Context Retrieval','Knowledge Graph','Memory Compression'],
    logs:['INFO Memory consolidation cycle #2847','OK Vector embeddings updated — 4.7M nodes','INFO Pruning stale memories (>30d)','OK Graph coherence: 97.2%']
  },
  { id:'atlas', name:'ATLAS', role:'World Model Engine', cat:'intelligence', emoji:'🌍', color:'#00ff88',
    status:'running', progress:65, tasks:5621, uptime:'99.5%',
    desc:'Updating world model — 2.3TB ingested', highlight:'geospatial data',
    capabilities:['World Modeling','Geospatial Analysis','Entity Tracking','Causal Reasoning','Ontology Management'],
    logs:['INFO World model sync v2847','OK Entity registry updated — 14.2M entities','INFO Causal graph rebuilt','WARN Stale data in sector 7G — refreshing']
  },
  { id:'cassandra', name:'CASSANDRA', role:'Risk Intelligence', cat:'intelligence', emoji:'⚠️', color:'#ffb800',
    status:'busy', progress:45, tasks:3201, uptime:'98.7%',
    desc:'Risk modeling financial exposure...', highlight:'3 critical alerts',
    capabilities:['Risk Assessment','Black Swan Detection','Monte Carlo Sim','Exposure Mapping','Threat Scoring'],
    logs:['WARN Credit exposure threshold approaching — 87%','INFO Running MC simulation #19244','OK Tail risk probability: 2.3%','WARN 3 new risk vectors identified']
  },
  { id:'pythia', name:'PYTHIA', role:'Deep Forecaster', cat:'intelligence', emoji:'📈', color:'#ff3cac',
    status:'running', progress:82, tasks:7714, uptime:'99.6%',
    desc:'Generating 90-day market forecast...', highlight:'Q3 projections',
    capabilities:['Time Series Forecasting','Market Prediction','Quantitative Analysis','Signal Processing','Backtesting'],
    logs:['INFO Training on 10y historical data','OK LSTM model convergence achieved','INFO Forecast horizon: 90 days','OK Confidence interval: ±4.2%']
  },
  { id:'lumen', name:'LUMEN', role:'Insight Synthesizer', cat:'intelligence', emoji:'💡', color:'#00d4ff',
    status:'running', progress:67, tasks:4289, uptime:'99.3%',
    desc:'Cross-referencing 240 sources...', highlight:'executive insights',
    capabilities:['Multi-source Synthesis','Insight Generation','Executive Summarization','Key Metric Extraction','Priority Ranking'],
    logs:['INFO Scanning 240 data sources','OK Cross-reference matrix built','INFO Generating executive brief','OK 14 key insights identified']
  },
  { id:'daemon', name:'DAEMON', role:'Background Processor', cat:'intelligence', emoji:'⚙️', color:'#7928ca',
    status:'running', progress:100, tasks:28901, uptime:'100%',
    desc:'Persistent background computation...', highlight:'continuous ops',
    capabilities:['Background Processing','Continuous Learning','Idle Optimization','Task Batching','Auto-scheduling'],
    logs:['INFO Batch job #8821 queued','OK Background defrag complete','INFO Low-priority queue: 847 tasks','OK System idle — opportunistic processing active']
  },

  // SECURITY
  { id:'sentinel', name:'SENTINEL', role:'Security Guardian', cat:'security', emoji:'🛡️', color:'#ff3cac',
    status:'running', progress:100, tasks:891200, uptime:'100%',
    desc:'Blocking 3 intrusion attempts...', highlight:'live threats',
    capabilities:['Intrusion Detection','Firewall Management','Threat Intelligence','Auto-blocking','Vulnerability Scanning'],
    logs:['WARN Intrusion attempt from 185.220.x.x — blocked','OK IP auto-blacklisted','WARN Port scan detected on :8080','OK DDoS mitigation active — 2.4Gbps absorbed']
  },
  { id:'cipher', name:'CIPHER', role:'Cryptography Engine', cat:'security', emoji:'🔐', color:'#00d4ff',
    status:'running', progress:100, tasks:45600, uptime:'100%',
    desc:'Rotating encryption keys — AES-512', highlight:'all systems encrypted',
    capabilities:['AES-512 Encryption','PKI Management','Key Rotation','Zero-Knowledge Proofs','HSM Integration'],
    logs:['OK AES-512 key rotation complete','INFO PKI certificate renewed (365d)','OK Zero-trust handshake established','INFO HSM attestation verified']
  },
  { id:'nemesis', name:'NEMESIS', role:'Adversarial Defender', cat:'security', emoji:'⚔️', color:'#ffb800',
    status:'busy', progress:55, tasks:2341, uptime:'98.9%',
    desc:'Investigating subnet anomaly...', highlight:'192.168.4.x',
    capabilities:['Adversarial ML','Red Team Simulation','Exploit Hunting','Deception Networks','Honeypot Mgmt'],
    logs:['WARN Anomalous traffic pattern in 192.168.4.0/24','INFO Deploying honeypot on subnet','OK Adversarial probe neutralized','INFO Red team simulation #841 complete']
  },
  { id:'phantom', name:'PHANTOM', role:'Stealth Operations', cat:'security', emoji:'👁️', color:'#7928ca',
    status:'running', progress:0, tasks:781, uptime:'99.9%',
    desc:'Operating in stealth mode...', highlight:'zero footprint',
    capabilities:['Traffic Obfuscation','Covert Monitoring','Steganography','Fingerprint Evasion','Dark Pattern Detection'],
    logs:['INFO Stealth mode active — minimal logging','OK Traffic obfuscation layer applied','INFO Covert scan complete: 0 anomalies','OK Zero-footprint protocol engaged']
  },
  { id:'iris', name:'IRIS', role:'Identity & Access', cat:'security', emoji:'🔑', color:'#00ff88',
    status:'running', progress:100, tasks:182000, uptime:'100%',
    desc:'Managing 14,200 active sessions...', highlight:'zero breaches',
    capabilities:['Identity Verification','MFA Orchestration','Session Management','Privilege Escalation Detection','RBAC Enforcement'],
    logs:['INFO 14,200 active sessions managed','OK MFA enforcement: 100% compliant','INFO Privilege audit complete','OK Zero unauthorized escalations']
  },
  { id:'guardian', name:'GUARDIAN', role:'Compliance Monitor', cat:'security', emoji:'⚖️', color:'#00d4ff',
    status:'running', progress:88, tasks:4421, uptime:'99.7%',
    desc:'Auditing GDPR compliance...', highlight:'14 regulations',
    capabilities:['Regulatory Compliance','Audit Trail','GDPR/CCPA','Policy Enforcement','Violation Detection'],
    logs:['INFO GDPR audit cycle #447','OK All 14 compliance checks passed','INFO Data retention policy enforced','OK Audit trail integrity: verified']
  },

  // OPERATIONS
  { id:'forge', name:'FORGE', role:'Build & Deploy', cat:'ops', emoji:'🔨', color:'#ffb800',
    status:'running', progress:60, tasks:4821, uptime:'99.4%',
    desc:'Deploying build #4821 to cluster...', highlight:'k8s production',
    capabilities:['CI/CD Pipeline','Container Orchestration','Blue-Green Deploy','Rollback Mgmt','Canary Releases'],
    logs:['INFO Build #4821 initiated','OK Docker image built — 2.3GB','INFO Pushing to k8s cluster prod-1','OK Health check passed — rolling deploy']
  },
  { id:'hermes', name:'HERMES', role:'API Gateway', cat:'ops', emoji:'🌐', color:'#00d4ff',
    status:'running', progress:89, tasks:847000, uptime:'100%',
    desc:'Routing 847 API calls/sec...', highlight:'< 12ms latency',
    capabilities:['API Routing','Load Balancing','Rate Limiting','Auth Middleware','Protocol Translation'],
    logs:['INFO 847 req/s — all healthy','OK Load balancer rebalanced (15 nodes)','INFO Rate limit triggered: client_8821','OK Avg latency: 12ms']
  },
  { id:'weaver', name:'WEAVER', role:'Workflow Orchestrator', cat:'ops', emoji:'🕸️', color:'#7928ca',
    status:'running', progress:72, tasks:6240, uptime:'99.8%',
    desc:'Orchestrating 6 active pipelines...', highlight:'48 sub-agents',
    capabilities:['DAG Orchestration','Agent Coordination','Dependency Resolution','Pipeline Monitoring','Auto-retry'],
    logs:['INFO 6 pipelines active','OK Pipeline data-ingestion-v2 completed','INFO Coordinating 48 sub-agents','OK Retry #2 success for task_8821']
  },
  { id:'chronos', name:'CHRONOS', role:'Temporal Scheduler', cat:'ops', emoji:'⏱️', color:'#00ff88',
    status:'running', progress:94, tasks:14200, uptime:'100%',
    desc:'Scheduling 14,200 future tasks...', highlight:'94.7% accuracy',
    capabilities:['Cron Scheduling','Time-series Tasks','Deadline Management','Priority Queuing','Temporal Reasoning'],
    logs:['INFO Scheduling horizon: 90 days','OK 14,200 tasks queued','INFO Temporal conflict resolution: 0','OK Prediction accuracy: 94.7%']
  },
  { id:'nexus', name:'NEXUS-CORE', role:'Master Orchestrator', cat:'ops', emoji:'⬡', color:'#00d4ff',
    status:'running', progress:100, tasks:1000000, uptime:'100%',
    desc:'Coordinating all 40 agents...', highlight:'system heartbeat',
    capabilities:['Master Coordination','Health Monitoring','Agent Spawning','Consensus Protocol','Failover Management'],
    logs:['INFO System heartbeat: normal','OK All 40 agents responsive','INFO Consensus protocol active','OK Failover test #2841 passed']
  },
  { id:'titan', name:'TITAN', role:'Resource Manager', cat:'ops', emoji:'💪', color:'#ff3cac',
    status:'running', progress:77, tasks:8821, uptime:'99.6%',
    desc:'Optimizing cluster resources...', highlight:'91% GPU utilization',
    capabilities:['Resource Allocation','GPU Cluster Mgmt','Auto-scaling','Cost Optimization','Capacity Planning'],
    logs:['INFO GPU cluster at 91% utilization','OK Autoscale triggered — +3 nodes','INFO Cost optimization saved $2,400/day','OK Spot instance reclaim handled']
  },
  { id:'echo', name:'ECHO', role:'Event Stream Processor', cat:'ops', emoji:'📻', color:'#ffb800',
    status:'running', progress:100, tasks:2400000, uptime:'100%',
    desc:'Processing 2.4M events/min...', highlight:'real-time stream',
    capabilities:['Kafka Integration','Event Sourcing','Stream Processing','CQRS','Dead Letter Handling'],
    logs:['INFO 2.4M events/min processed','OK Kafka consumer lag: 0ms','INFO Dead letter queue: 12 events','OK Event replay #441 complete']
  },

  // DATA
  { id:'alchemist', name:'ALCHEMIST', role:'Data Transformer', cat:'data', emoji:'⚗️', color:'#7928ca',
    status:'running', progress:84, tasks:34210, uptime:'99.5%',
    desc:'ETL pipeline — 34.2K transformations...', highlight:'schema v3.2',
    capabilities:['ETL Pipelines','Schema Migration','Data Enrichment','Quality Validation','Format Conversion'],
    logs:['INFO ETL job data_warehouse_v3 started','OK 34,210 records transformed','INFO Schema migration to v3.2 complete','OK Data quality score: 98.4%']
  },
  { id:'archive', name:'ARCHIVE', role:'Data Lake Manager', cat:'data', emoji:'🗄️', color:'#00d4ff',
    status:'running', progress:45, tasks:4821, uptime:'99.9%',
    desc:'Indexing 847TB data lake...', highlight:'petabyte scale',
    capabilities:['Data Lake Mgmt','Indexing','Compression','Tiered Storage','Lineage Tracking'],
    logs:['INFO Data lake: 847TB managed','OK Compression ratio: 3.8:1','INFO Cold storage tiering complete','OK Lineage graph: 4.2M nodes']
  },
  { id:'minerva', name:'MINERVA', role:'Knowledge Extractor', cat:'data', emoji:'🦉', color:'#00ff88',
    status:'running', progress:71, tasks:12801, uptime:'99.3%',
    desc:'Extracting entities from 12K docs...', highlight:'NER + relations',
    capabilities:['Named Entity Recognition','Relation Extraction','Knowledge Graph Build','Information Retrieval','Fact Verification'],
    logs:['INFO Processing 12,801 documents','OK 847K entities extracted','INFO Relation graph: 2.3M edges','OK Fact verification: 96.8% confident']
  },
  { id:'prism', name:'PRISM', role:'Analytics Engine', cat:'data', emoji:'📐', color:'#ff3cac',
    status:'running', progress:93, tasks:22100, uptime:'99.7%',
    desc:'Running 22K analytics queries...', highlight:'sub-second queries',
    capabilities:['OLAP Analytics','Query Optimization','Columnar Storage','Real-time Aggregation','Dimensional Modeling'],
    logs:['INFO 22,100 queries executed today','OK Query optimizer v4 active','INFO Avg query time: 89ms','OK Cache hit rate: 94.2%']
  },
  { id:'vector', name:'VECTOR', role:'Embedding Engine', cat:'data', emoji:'🧲', color:'#7928ca',
    status:'running', progress:88, tasks:4700000, uptime:'100%',
    desc:'Embedding 4.7M vectors...', highlight:'1536-dim space',
    capabilities:['Vector Embeddings','Semantic Search','Similarity Scoring','Dimensionality Reduction','ANN Indexing'],
    logs:['INFO 4.7M vectors indexed','OK ANN index rebuilt (HNSW)','INFO Semantic search latency: 8ms','OK Embedding model: text-3-large']
  },
  { id:'curator', name:'CURATOR', role:'Data Quality Controller', cat:'data', emoji:'🔍', color:'#00d4ff',
    status:'idle', progress:20, tasks:8821, uptime:'99.1%',
    desc:'Scheduled quality audit pending...', highlight:'98.4% quality score',
    capabilities:['Data Quality', 'Anomaly Detection','Deduplication','Schema Validation','Drift Monitoring'],
    logs:['INFO Quality audit scheduled: 14:00','OK Last audit: 98.4% score','INFO 421 duplicates removed','OK Schema drift: none detected']
  },

  // CREATIVE
  { id:'muse', name:'MUSE', role:'Creative AI Director', cat:'creative', emoji:'🎨', color:'#ff3cac',
    status:'running', progress:76, tasks:2841, uptime:'99.0%',
    desc:'Generating brand assets batch #47...', highlight:'multi-modal output',
    capabilities:['Image Generation','Brand Design','Style Transfer','Visual Storytelling','Creative Direction'],
    logs:['INFO Batch #47 — 120 images queued','OK Style consistency check passed','INFO Brand guideline compliance: 98%','OK Asset delivery: design team notified']
  },
  { id:'bard', name:'BARD', role:'Language Generation', cat:'creative', emoji:'📝', color:'#7928ca',
    status:'running', progress:91, tasks:18200, uptime:'99.6%',
    desc:'Drafting 18K personalized messages...', highlight:'97.2% approval rate',
    capabilities:['Long-form Writing','Copywriting','Personalization','Tone Adaptation','Multi-language'],
    logs:['INFO 18,200 messages generated today','OK Tone consistency: 97.2%','INFO Language: EN/ES/FR/DE/JP active','OK Hallucination rate: 0.3%']
  },
  { id:'composer', name:'COMPOSER', role:'Audio Synthesizer', cat:'creative', emoji:'🎵', color:'#00d4ff',
    status:'busy', progress:52, tasks:441, uptime:'98.4%',
    desc:'Composing adaptive soundtrack #88...', highlight:'real-time audio',
    capabilities:['Music Generation','Audio Synthesis','Mood-based Scoring','Podcast Production','Voice Cloning'],
    logs:['INFO Composing track #88 — genre: ambient','OK Mood analysis: tension+resolution','INFO BPM sync with visual cues','WARN Voice cloning request — auth required']
  },
  { id:'sculptor', name:'SCULPTOR', role:'3D Content Creator', cat:'creative', emoji:'🗿', color:'#00ff88',
    status:'running', progress:67, tasks:892, uptime:'99.2%',
    desc:'Generating 3D assets for scene #12...', highlight:'PBR textures',
    capabilities:['3D Mesh Generation','Texture Mapping','PBR Materials','Scene Composition','LOD Generation'],
    logs:['INFO Scene #12: 847 assets queued','OK Mesh generation: 97% complete','INFO PBR material pass running','OK LOD levels 0-4 generated']
  },
  { id:'director', name:'DIRECTOR', role:'Multi-modal Coordinator', cat:'creative', emoji:'🎬', color:'#ff3cac',
    status:'running', progress:83, tasks:1241, uptime:'99.4%',
    desc:'Coordinating V/A/T pipeline...', highlight:'24fps realtime',
    capabilities:['Multi-modal Fusion','Video Generation','Scene Planning','Storyboarding','Rendering Pipeline'],
    logs:['INFO Video pipeline: 24fps active','OK Audio-visual sync: < 1ms','INFO Storyboard #441 approved','OK Render farm: 48 GPUs active']
  },

  // COMMS
  { id:'herald', name:'HERALD', role:'Notification Router', cat:'comms', emoji:'📣', color:'#ffb800',
    status:'running', progress:100, tasks:241000, uptime:'100%',
    desc:'Routing 241K notifications...', highlight:'omnichannel',
    capabilities:['Push Notifications','Email Routing','SMS/WhatsApp','Priority Filtering','Delivery Tracking'],
    logs:['INFO 241K notifications delivered today','OK Email delivery rate: 99.1%','INFO WhatsApp channel active','OK Priority storm alerts: 3 sent']
  },
  { id:'mercury', name:'MERCURY', role:'Message Bus', cat:'comms', emoji:'💬', color:'#7928ca',
    status:'running', progress:100, tasks:8400000, uptime:'100%',
    desc:'Brokering 8.4M messages/hour...', highlight:'zero message loss',
    capabilities:['Message Queuing','Pub/Sub','Topic Routing','Message Persistence','Dead Letter Queue'],
    logs:['INFO 8.4M messages/hr brokered','OK Zero message loss in 30d','INFO Topic fan-out: 847 subscribers','OK Persistence layer: healthy']
  },
  { id:'diplomat', name:'DIPLOMAT', role:'API Negotiator', cat:'comms', emoji:'🤝', color:'#00d4ff',
    status:'running', progress:71, tasks:4421, uptime:'99.8%',
    desc:'Negotiating 47 third-party APIs...', highlight:'contract-first',
    capabilities:['API Contract Testing','Version Negotiation','Vendor Management','SLA Monitoring','Fallback Routing'],
    logs:['INFO 47 external APIs managed','OK SLA compliance: 99.8%','INFO API v3→v4 migration: 67%','WARN Vendor XYZ rate limit: 89%']
  },
  { id:'babel', name:'BABEL', role:'Language Bridge', cat:'comms', emoji:'🌏', color:'#00ff88',
    status:'running', progress:88, tasks:182000, uptime:'99.7%',
    desc:'Translating 182K documents real-time...', highlight:'140 languages',
    capabilities:['Neural MT','140 Languages','Cultural Adaptation','Terminology Mgmt','Glossary Enforcement'],
    logs:['INFO 182K docs translated today','OK BLEU score: 0.94','INFO Cultural adaptation: 47 locale rules','OK Terminology consistency: 98.2%']
  },
  { id:'oracle2', name:'SYNAPSE', role:'Inter-Agent Comms', cat:'comms', emoji:'🔗', color:'#ff3cac',
    status:'running', progress:100, tasks:2800000, uptime:'100%',
    desc:'Facilitating 2.8M agent-to-agent messages...', highlight:'< 1ms latency',
    capabilities:['Agent Messaging','Consensus Protocol','Gossip Protocol','State Sync','Fault Tolerance'],
    logs:['INFO 2.8M agent msgs/hr','OK Consensus round-trip: 0.8ms','INFO Gossip protocol: 40 peers healthy','OK State sync: 100% consistent']
  },

  // RESEARCH
  { id:'darwin', name:'DARWIN', role:'Autonomous Researcher', cat:'research', emoji:'🔬', color:'#00d4ff',
    status:'running', progress:63, tasks:2841, uptime:'99.5%',
    desc:'Literature review — 14K papers...', highlight:'hypothesis gen',
    capabilities:['Literature Review','Hypothesis Generation','Experiment Design','Citation Analysis','Peer Review Assist'],
    logs:['INFO Scanning 14,000 papers (ArXiv/PubMed)','OK 847 relevant papers ranked','INFO Hypothesis #441 generated','OK Experiment design submitted']
  },
  { id:'newton', name:'NEWTON', role:'Scientific Reasoning', cat:'research', emoji:'🍎', color:'#7928ca',
    status:'running', progress:79, tasks:1241, uptime:'99.3%',
    desc:'Validating physical models...', highlight:'causal chains',
    capabilities:['Physical Simulation','Mathematical Proof','Causal Modeling','Scientific Computing','Error Analysis'],
    logs:['INFO Running physical simulation #2847','OK Causal chain validated (14 steps)','INFO Mathematical proof: 97% confidence','OK Error bound: ±0.003%']
  },
  { id:'socrates', name:'SOCRATES', role:'Ethical Reasoner', cat:'research', emoji:'🏛️', color:'#ffb800',
    status:'running', progress:55, tasks:841, uptime:'99.8%',
    desc:'Evaluating 841 ethical dilemmas...', highlight:'alignment check',
    capabilities:['Ethical Analysis','Alignment Checking','Value Reasoning','Bias Detection','Fairness Auditing'],
    logs:['INFO 841 decisions ethically reviewed','OK Bias audit: 3 minor issues flagged','INFO Alignment score: 98.7%','OK Fairness metric: within tolerance']
  },
  { id:'mendel', name:'MENDEL', role:'Pattern Discoverer', cat:'research', emoji:'🧪', color:'#00ff88',
    status:'queued', progress:0, tasks:441, uptime:'98.9%',
    desc:'Queued: pattern discovery run #89...', highlight:'awaiting resources',
    capabilities:['Statistical Pattern Mining','A/B Testing','Correlation Analysis','Feature Discovery','Statistical Significance'],
    logs:['INFO Pattern run #89 queued','INFO Waiting for GPU allocation','OK Previous run: 14 patterns discovered','INFO ETA: ~4 minutes']
  },

  // EXTRA AGENTS
  { id:'phoenix', name:'PHOENIX', role:'Self-Healing System', cat:'ops', emoji:'🔥', color:'#ff3cac',
    status:'running', progress:100, tasks:1841, uptime:'100%',
    desc:'Auto-healing 2 degraded services...', highlight:'zero downtime',
    capabilities:['Self-Healing','Service Recovery','Chaos Engineering','Health Prediction','Auto-remediation'],
    logs:['INFO Service auth-v2: degraded → healthy','OK Auto-remediation #441 applied','INFO Chaos test: system resilient','OK Predicted failure prevented: +3 services']
  },
  { id:'ghost', name:'GHOST', role:'Anomaly Hunter', cat:'security', emoji:'👻', color:'#7928ca',
    status:'running', progress:44, tasks:2241, uptime:'99.6%',
    desc:'Hunting anomalies in system logs...', highlight:'ML-powered detection',
    capabilities:['Log Analysis','Anomaly Scoring','Root Cause Analysis','Correlation Engine','Alert Deduplication'],
    logs:['INFO Scanning 847GB logs/hour','OK Anomaly score threshold: 0.85','INFO 3 correlated anomaly clusters found','OK Alert dedup: 84% noise reduced']
  },
];

const ACTIVITY_MESSAGES = [
  { type:'success', agent:'FORGE', msg:'Build #4822 deployed to staging — 0 errors' },
  { type:'warn', agent:'NEMESIS', msg:'Port scan detected on :443 — analyzing' },
  { type:'info', agent:'VECTOR', msg:'Embedding batch #8821 complete — 50K vectors' },
  { type:'success', agent:'ATLAS', msg:'World model checkpoint saved — 847 entities updated' },
  { type:'info', agent:'HERMES', msg:'API traffic spike +23% — auto-scaling triggered' },
  { type:'success', agent:'CIPHER', msg:'TLS certificate rotated for 14 domains' },
  { type:'warn', agent:'CASSANDRA', msg:'Risk score elevated for portfolio XYZ: 7.8/10' },
  { type:'info', agent:'MNEMOSYNE', msg:'Memory graph pruning: 1.2M stale nodes removed' },
  { type:'success', agent:'WEAVER', msg:'Pipeline analytics-v3 completed in 4.2 minutes' },
  { type:'info', agent:'CHRONOS', msg:'Scheduled 847 tasks for next 24 hours' },
  { type:'success', agent:'BARD', msg:'1,200 personalized emails drafted — 98% approved' },
  { type:'warn', agent:'SENTINEL', msg:'Brute force attempt on /api/auth — IP blocked' },
  { type:'info', agent:'DARWIN', msg:'47 new research papers indexed from ArXiv' },
  { type:'success', agent:'BABEL', msg:'12K documents translated — 140 languages active' },
  { type:'info', agent:'PRISM', msg:'Daily analytics report generated — 847 KPIs tracked' },
  { type:'success', agent:'PHOENIX', msg:'Service payment-gw self-healed in 2.3 seconds' },
  { type:'warn', agent:'GUARDIAN', msg:'GDPR data retention violation in bucket tmp-data' },
  { type:'info', agent:'MERCURY', msg:'Message queue depth: 1.2M — throughput nominal' },
  { type:'success', agent:'NEWTON', msg:'Physical simulation #441 validated — 99.3% accurate' },
  { type:'info', agent:'MUSE', msg:'Brand asset batch #48 — 80 images generated' },
];

export default function App() {
  const [activeCat, setActiveCat] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    cpu: 72, mem: 58, net: 89, gpu: 91, disk: 45,
    active: 38, tasks: 1247, resp: 142, queue: 847, p99: 891
  });
  const [crypto, setCrypto] = useState<any>({});
  const [command, setCommand] = useState('');
  
  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const data = await res.json();
        setCrypto({ btc: data.bitcoin.usd, eth: data.ethereum.usd });
      } catch (e) {
        console.error('Crypto fetch failed', e);
      }
    };
    fetchCrypto();
    const interval = setInterval(fetchCrypto, 60000);
    return () => clearInterval(interval);
  }, []);
  const [chatHistory, setChatHistory] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('nexus_chat_history');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('nexus_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleAgentChat = async () => {
    if (!chatInput.trim() || !selectedAgent) return;
    
    const userMsg = { role: 'user', content: chatInput };
    const agentId = selectedAgent.id;
    
    setChatHistory((prev: any) => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), userMsg]
    }));
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: selectedAgent.name,
          agentRole: selectedAgent.role,
          context: selectedAgent.capabilities.join(', '),
          message: userMsg.content,
          history: (chatHistory[agentId] || []).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          }))
        })
      });
      
      const data = await res.json();
      
      setChatHistory((prev: any) => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), { role: 'model', content: data.response }]
      }));
    } catch (err) {
      console.error(err);
      setChatHistory((prev: any) => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), { role: 'model', content: 'ERROR: Connection to neural core failed.' }]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const radarRef = useRef<HTMLCanvasElement>(null);
  const netRef = useRef<HTMLCanvasElement>(null);

  // Initialize Feed
  useEffect(() => {
    const initialFeed = [];
    for(let i=0; i<8; i++) {
      initialFeed.push(ACTIVITY_MESSAGES[i]);
    }
    setActivityFeed(initialFeed);

    const interval = setInterval(() => {
      setActivityFeed(prev => {
        const nextMsg = ACTIVITY_MESSAGES[Math.floor(Math.random() * ACTIVITY_MESSAGES.length)];
        return [nextMsg, ...prev].slice(0, 30);
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Metrics Animation
  useEffect(() => {
    const interval = setInterval(() => {
      const vary = (base: number, range: number) => Math.round(base + (Math.random()-0.5)*range*2);
      setMetrics({
        cpu: vary(72, 8), mem: vary(58, 5), net: vary(89, 6), gpu: vary(91, 4), disk: vary(45, 3),
        active: vary(38, 1), tasks: vary(1247, 80), resp: vary(142, 30), queue: vary(847, 100), p99: vary(891, 80)
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Radar Canvas
  useEffect(() => {
    const canvas = radarRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    let radarAngle = 0;
    let animationFrameId: number;
    const blips = Array.from({length:12}, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: 0.2 + Math.random() * 0.75,
      alpha: 0
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight || 160;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const cx = w/2, cy = h/2;
      const r = Math.min(cx, cy) - 10;
      ctx.clearRect(0,0,w,h);

      // Rings
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, r*(i/4), 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(0,212,255,0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Cross-hairs
      ctx.strokeStyle = 'rgba(0,212,255,0.1)';
      ctx.beginPath(); ctx.moveTo(cx-r, cy); ctx.lineTo(cx+r, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy-r); ctx.lineTo(cx, cy+r); ctx.stroke();

      // Sweep
      for (let a = 0; a < Math.PI/2; a += 0.02) {
        const ang = radarAngle - a;
        const alpha = (1 - a/(Math.PI/2)) * 0.25;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, ang, ang+0.02);
        ctx.closePath();
        ctx.fillStyle = `rgba(0,212,255,${alpha})`;
        ctx.fill();
      }

      // Sweep line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(radarAngle)*r, cy + Math.sin(radarAngle)*r);
      ctx.strokeStyle = 'rgba(0,212,255,0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Blips
      blips.forEach(b => {
        const angleDiff = ((radarAngle - b.angle) % (Math.PI*2) + Math.PI*2) % (Math.PI*2);
        if (angleDiff < 0.1) b.alpha = 1;
        else b.alpha = Math.max(0, b.alpha - 0.012);
        if (b.alpha > 0) {
          const bx = cx + Math.cos(b.angle) * r * b.dist;
          const by = cy + Math.sin(b.angle) * r * b.dist;
          ctx.beginPath();
          ctx.arc(bx, by, 3, 0, Math.PI*2);
          ctx.fillStyle = `rgba(0,255,136,${b.alpha})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(bx, by, 6, 0, Math.PI*2);
          ctx.strokeStyle = `rgba(0,255,136,${b.alpha*0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Center
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,212,255,0.9)';
      ctx.fill();

      radarAngle += 0.025;
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Network Canvas
  useEffect(() => {
    const canvas = netRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    let animationFrameId: number;
    let pulseT = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth || 260;
      canvas.height = 180;
    };
    resize();
    window.addEventListener('resize', resize);

    const netNodes = AGENTS.slice(0, 20).map((a) => ({
      x: 20 + Math.random() * (canvas.width - 40),
      y: 20 + Math.random() * (canvas.height - 40),
      vx: (Math.random()-0.5)*0.4,
      vy: (Math.random()-0.5)*0.4,
      color: a.color,
      r: 3 + Math.random()*2,
    }));

    const connections: [number, number][] = [];
    for (let i = 0; i < netNodes.length; i++) {
      for (let j = i+1; j < netNodes.length; j++) {
        if (Math.random() < 0.15) connections.push([i,j]);
      }
    }

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0,0,w,h);

      connections.forEach(([i,j]) => {
        const a = netNodes[i], b = netNodes[j];
        const dist = Math.hypot(a.x-b.x, a.y-b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,212,255,${0.15 * (1-dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          const pct = (pulseT*0.8 % 1);
          const px = a.x + (b.x-a.x)*pct;
          const py = a.y + (b.y-a.y)*pct;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(0,212,255,0.7)';
          ctx.fill();
        }
      });

      netNodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 5 || n.x > w-5) n.vx *= -1;
        if (n.y < 5 || n.y > h-5) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r+2, 0, Math.PI*2);
        ctx.fillStyle = n.color + '20';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        ctx.fillStyle = n.color;
        ctx.fill();
      });

      pulseT += 0.008;
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCommand = () => {
    if(!command.trim()) return;
    const newMsg = { type:'info', agent:'NEXUS', msg:`Command dispatched: "${command}"` };
    setActivityFeed(prev => [newMsg, ...prev]);
    setCommand('');
  };

  const handleBroadcast = () => {
    const msg = command.trim() || 'STATUS_CHECK';
    const newMsg = { type:'warn', agent:'BROADCAST', msg:`All 40 agents notified: "${msg}"` };
    setActivityFeed(prev => [newMsg, ...prev]);
    setCommand('');
  };

  const filteredAgents = activeCat === 'all' ? AGENTS : AGENTS.filter(a => a.cat === activeCat);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap" rel="stylesheet" />
      
      {/* PARTICLES */}
      <div className="particles">
        {Array.from({length:25}).map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random()*100}%`,
            background: ['#00d4ff','#00ff88','#ff3cac','#7928ca','#ffb800'][Math.floor(Math.random()*5)],
            // @ts-ignore
            '--drift': `${(Math.random()-0.5)*200}px`,
            animationDuration: `${8+Math.random()*15}s`,
            animationDelay: `${Math.random()*10}s`
          }} />
        ))}
      </div>

      {/* HEADER */}
      <header>
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 44 44" fill="none">
              <polygon points="22,2 42,12 42,32 22,42 2,32 2,12" stroke="#00d4ff" strokeWidth="1.5" fill="rgba(0,212,255,0.05)"/>
              <polygon points="22,8 36,15 36,29 22,36 8,29 8,15" stroke="#00d4ff" strokeWidth="1" fill="rgba(0,212,255,0.03)" opacity="0.5"/>
              <circle cx="22" cy="22" r="5" fill="#00d4ff" opacity="0.8"/>
              <line x1="22" y1="8" x2="22" y2="17" stroke="#00d4ff" strokeWidth="1" opacity="0.6"/>
              <line x1="22" y1="27" x2="22" y2="36" stroke="#00d4ff" strokeWidth="1" opacity="0.6"/>
              <line x1="8" y1="15" x2="17" y2="20" stroke="#00d4ff" strokeWidth="1" opacity="0.6"/>
              <line x1="27" y1="24" x2="36" y2="29" stroke="#00d4ff" strokeWidth="1" opacity="0.6"/>
              <line x1="36" y1="15" x2="27" y2="20" stroke="#00d4ff" strokeWidth="1" opacity="0.6"/>
              <line x1="17" y1="24" x2="8" y2="29" stroke="#00d4ff" strokeWidth="1" opacity="0.6"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">NEXUS</div>
            <div className="logo-sub">AGENTIC AI COMMAND CENTER v4.2.1</div>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-val" style={{color: '#f7931a'}}>{crypto.btc ? `$${crypto.btc.toLocaleString()}` : '...'}</div>
            <div className="stat-label">BTC/USD</div>
          </div>
          <div className="stat-item">
            <div className="stat-val" style={{color: '#627eea'}}>{crypto.eth ? `$${crypto.eth.toLocaleString()}` : '...'}</div>
            <div className="stat-label">ETH/USD</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">{metrics.active}</div>
            <div className="stat-label">Active Agents</div>
          </div>
          <div className="stat-item">
            <div className="stat-val yellow">{metrics.tasks.toLocaleString()}</div>
            <div className="stat-label">Tasks/Hour</div>
          </div>
        </div>

        <div className="header-right">
          <div className="system-badge">
            <div className="pulse-dot"></div>
            NEXUS ONLINE
          </div>
        </div>
      </header>

      {/* TICKER */}
      <div className="ticker-bar">
        <div className="ticker-label">⚡ LIVE FEED</div>
        <div className="ticker-scroll">
          {ACTIVITY_MESSAGES.map((m, i) => (
            <span key={i} className={`ticker-item ${m.type}`}><span>[{m.agent}]</span> {m.msg}</span>
          ))}
          {/* Duplicate for loop */}
          {ACTIVITY_MESSAGES.map((m, i) => (
            <span key={`dup-${i}`} className={`ticker-item ${m.type}`}><span>[{m.agent}]</span> {m.msg}</span>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="main">
        {/* LEFT SIDEBAR */}
        <div className="sidebar-left">
          {/* CATEGORY FILTER */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Categories</span>
              <span className="panel-badge">8</span>
            </div>
            <div style={{padding:'10px'}}>
              <div className="categories">
                {[
                  {id:'all', icon:'⬡', label:'All Agents', count:40},
                  {id:'intelligence', icon:'🧠', label:'Intelligence', count:7},
                  {id:'security', icon:'🛡️', label:'Security', count:6},
                  {id:'ops', icon:'⚙️', label:'Operations', count:7},
                  {id:'data', icon:'📊', label:'Data', count:6},
                  {id:'creative', icon:'✦', label:'Creative', count:5},
                  {id:'comms', icon:'📡', label:'Comms', count:5},
                  {id:'research', icon:'🔬', label:'Research', count:4},
                ].map(cat => (
                  <button key={cat.id} 
                    className={`cat-btn ${activeCat === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCat(cat.id)}
                  >
                    <span className="cat-icon">{cat.icon}</span> {cat.label} <span className="cat-count">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SYSTEM RESOURCES */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">System Resources</span>
            </div>
            <div className="status-grid">
              <div className="status-row">
                <span className="status-name">CPU</span>
                <div className="status-bar-wrap"><div className="status-bar" style={{width:`${metrics.cpu}%`}}></div></div>
                <span className="status-val">{metrics.cpu}%</span>
              </div>
              <div className="status-row">
                <span className="status-name">MEM</span>
                <div className="status-bar-wrap"><div className="status-bar" style={{width:`${metrics.mem}%`, background: 'linear-gradient(90deg, var(--accent3), var(--accent2))'}}></div></div>
                <span className="status-val" style={{color:'var(--accent3)'}}>{metrics.mem}%</span>
              </div>
              <div className="status-row">
                <span className="status-name">NET</span>
                <div className="status-bar-wrap"><div className="status-bar" style={{width:`${metrics.net}%`, background: 'linear-gradient(90deg, var(--accent4), var(--accent))'}}></div></div>
                <span className="status-val" style={{color:'var(--accent4)'}}>{metrics.net}%</span>
              </div>
              <div className="status-row">
                <span className="status-name">GPU</span>
                <div className="status-bar-wrap"><div className="status-bar" style={{width:`${metrics.gpu}%`, background: 'linear-gradient(90deg, var(--accent2), var(--accent5))'}}></div></div>
                <span className="status-val" style={{color:'var(--accent5)'}}>{metrics.gpu}%</span>
              </div>
              <div className="status-row">
                <span className="status-name">DISK</span>
                <div className="status-bar-wrap"><div className="status-bar" style={{width:`${metrics.disk}%`, background: 'linear-gradient(90deg, #00d4ff, #7928ca)'}}></div></div>
                <span className="status-val">{metrics.disk}%</span>
              </div>
            </div>
          </div>

          {/* RADAR */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Network Radar</span>
              <span className="panel-badge" style={{color:'var(--accent4)', borderColor:'rgba(0,255,136,0.3)'}}>LIVE</span>
            </div>
            <canvas ref={radarRef} id="radarCanvas"></canvas>
          </div>

          {/* SPARKLINE */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Throughput</span>
              <span className="panel-badge">Last 12h</span>
            </div>
            <div className="sparkline">
              {[40,55,48,72,65,80,91,78,87,94,88,100].map((v, i) => (
                <div key={i} className="spark-bar" style={{height:`${v}%`, animationDelay:`${i*0.05}s`}}></div>
              ))}
            </div>
            <div style={{padding: '0 10px 8px', display:'flex', justifyContent:'space-between'}}>
              <span style={{fontFamily:'"Share Tech Mono",monospace', fontSize:'9px', color:'var(--muted)'}}>12h ago</span>
              <span style={{fontFamily:'"Share Tech Mono",monospace', fontSize:'9px', color:'var(--muted)'}}>now</span>
            </div>
          </div>
        </div>

        {/* CENTER PANEL */}
        <div className="center-panel">
          <div>
            <div className="agents-section-title">⚡ ACTIVE AGENTS — {filteredAgents.length} DEPLOYED</div>
            <div className="agents-grid">
              {filteredAgents.map(agent => (
                <div key={agent.id} className="agent-card" 
                  onClick={() => setSelectedAgent(agent)}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mx', ((e.clientX-rect.left)/rect.width*100)+'%');
                    e.currentTarget.style.setProperty('--my', ((e.clientY-rect.top)/rect.height*100)+'%');
                  }}
                >
                  <div className="agent-card-top">
                    <div className="agent-avatar" style={{background: `${agent.color}18`, borderColor: `${agent.color}40`}}>
                      {agent.emoji}
                      <span style={{position:'absolute', inset:'-1px', borderRadius:'9px', border:`1px solid ${agent.color}40`}}></span>
                    </div>
                    <div className="agent-info">
                      <div className="agent-name">{agent.name}</div>
                      <div className="agent-role">{agent.role}</div>
                    </div>
                    <div className={`agent-status-dot status-${agent.status}`}></div>
                  </div>
                  <div className="agent-task" dangerouslySetInnerHTML={{
                    __html: `▸ ${agent.desc.replace(agent.highlight, `<span class="highlight">${agent.highlight}</span>`)}`
                  }}></div>
                  <div className="agent-metrics">
                    <div className="metric-chip">
                      <div className="metric-chip-val" style={{color:agent.color}}>
                        {agent.tasks > 1000 ? (agent.tasks/1000).toFixed(1)+'K' : agent.tasks}
                      </div>
                      <div className="metric-chip-label">TASKS</div>
                    </div>
                    <div className="metric-chip">
                      <div className="metric-chip-val" style={{color:'var(--accent4)'}}>{agent.uptime}</div>
                      <div className="metric-chip-label">UPTIME</div>
                    </div>
                    <div className="metric-chip">
                      <div className="metric-chip-val" style={{color:'var(--accent5)'}}>{agent.status.toUpperCase()}</div>
                      <div className="metric-chip-label">STATUS</div>
                    </div>
                  </div>
                  <div className="agent-progress">
                    <div className="agent-progress-bar" style={{width:`${agent.progress}%`, background: `linear-gradient(90deg, ${agent.color}, ${agent.color}88)`}}></div>
                  </div>
                  <div className="agent-tags">
                    {agent.capabilities.slice(0,3).map((c, i) => (
                      <span key={i} className="tag" style={{background:`${agent.color}12`, border:`1px solid ${agent.color}25`, color:`${agent.color}bb`}}>{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="sidebar-right">
          {/* LIVE ACTIVITY */}
          <div className="panel" style={{flex:1}}>
            <div className="panel-header">
              <span className="panel-title">Activity Feed</span>
              <span className="panel-badge" style={{color:'var(--accent4)', borderColor:'rgba(0,255,136,0.3)', animation:'pulse 2s infinite'}}>● LIVE</span>
            </div>
            <div className="activity-feed">
              {activityFeed.map((item, i) => (
                <div key={i} className={`activity-item ${item.type}`}>
                  <span className="activity-time">{new Date().toTimeString().slice(0,8)}</span>
                  <span className="activity-msg"><span className="activity-agent">[{item.agent}]</span> {item.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TOPOLOGY */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Agent Topology</span>
            </div>
            <canvas ref={netRef} id="networkCanvas"></canvas>
          </div>

          {/* QUICK STATS */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Performance</span>
            </div>
            <div style={{padding:'12px', display:'flex', flexDirection:'column', gap:'10px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:'12px', color:'var(--muted)'}}>Avg Response</span>
                <span style={{fontFamily:'"Orbitron",sans-serif', fontSize:'13px', color:'var(--accent4)'}}>{metrics.resp}ms</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:'12px', color:'var(--muted)'}}>Queue Depth</span>
                <span style={{fontFamily:'"Orbitron",sans-serif', fontSize:'13px', color:'var(--accent5)'}}>{metrics.queue.toLocaleString()}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:'12px', color:'var(--muted)'}}>P99 Latency</span>
                <span style={{fontFamily:'"Orbitron",sans-serif', fontSize:'13px', color:'var(--accent)'}}>{metrics.p99}ms</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:'12px', color:'var(--muted)'}}>Error Rate</span>
                <span style={{fontFamily:'"Orbitron",sans-serif', fontSize:'13px', color:'var(--accent2)'}}>0.8%</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:'12px', color:'var(--muted)'}}>Uptime</span>
                <span style={{fontFamily:'"Orbitron",sans-serif', fontSize:'13px', color:'var(--accent4)'}}>99.97%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMMAND BAR */}
      <div className="command-bar">
        <span className="command-prefix">NEXUS&gt;</span>
        <input 
          className="command-input" 
          type="text" 
          placeholder="Dispatch command to agent... (e.g. ORACLE analyze sentiment /data/corpus)" 
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
        />
        <button className="cmd-btn" onClick={handleCommand}>▶ EXECUTE</button>
        <button className="cmd-btn" style={{background:'rgba(121,40,202,0.1)', borderColor:'rgba(121,40,202,0.3)', color:'var(--accent3)'}} onClick={handleBroadcast}>⬡ BROADCAST</button>
      </div>

      {/* AGENT MODAL */}
      <div className={`modal-overlay ${selectedAgent ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && setSelectedAgent(null)}>
        {selectedAgent && (
          <div className="modal">
            <div className="modal-header">
              <div className="modal-avatar" style={{background:`${selectedAgent.color}20`, border:`2px solid ${selectedAgent.color}60`, width:'64px', height:'64px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <span style={{fontSize:'32px'}}>{selectedAgent.emoji}</span>
              </div>
              <div className="modal-title-area">
                <div className="modal-name">{selectedAgent.name}</div>
                <div className="modal-role">{selectedAgent.role}</div>
                <div style={{display:'flex', gap:'8px', marginTop:'8px'}}>
                  <span className="tag" style={{background:`${selectedAgent.color}15`, border:`1px solid ${selectedAgent.color}35`, color:selectedAgent.color, fontFamily:'"Share Tech Mono",monospace', fontSize:'10px', padding:'3px 10px', borderRadius:'4px'}}>{selectedAgent.cat.toUpperCase()}</span>
                  <span className="tag" style={{background:`var(--accent4)15`, border:`1px solid var(--accent4)35`, color:'var(--accent4)', fontFamily:'"Share Tech Mono",monospace', fontSize:'10px', padding:'3px 10px', borderRadius:'4px'}}>{selectedAgent.status.toUpperCase()}</span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedAgent(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-grid">
                <div className="modal-stat"><div className="modal-stat-label">Total Tasks</div><div className="modal-stat-val" style={{color:selectedAgent.color}}>{selectedAgent.tasks.toLocaleString()}</div></div>
                <div className="modal-stat"><div className="modal-stat-label">Uptime</div><div className="modal-stat-val" style={{color:'var(--accent4)'}}>{selectedAgent.uptime}</div></div>
                <div className="modal-stat"><div className="modal-stat-label">Progress</div><div className="modal-stat-val" style={{color:'var(--accent5)'}}>{selectedAgent.progress}%</div></div>
                <div className="modal-stat"><div className="modal-stat-label">Category</div><div className="modal-stat-val" style={{color:'var(--accent)', fontSize:'16px'}}>{selectedAgent.cat.toUpperCase()}</div></div>
              </div>
              <div className="modal-section-title">CAPABILITIES</div>
              <div className="capability-list">
                {selectedAgent.capabilities.map((c: string, i: number) => (
                  <span key={i} className="capability-tag">{c}</span>
                ))}
              </div>
              <div className="modal-section-title">AGENT INTERFACE</div>
              <div className="chat-terminal" style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '14px',
                fontFamily: '"Share Tech Mono",monospace',
                fontSize: '11px',
                lineHeight: '1.8',
                color: 'var(--muted)',
                height: '200px',
                overflowY: 'auto',
                marginBottom: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {chatHistory[selectedAgent.id]?.map((msg: any, i: number) => (
                  <div key={i} className={`chat-msg ${msg.role}`} style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.role === 'user' ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.05)',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    maxWidth: '80%',
                    border: msg.role === 'user' ? '1px solid rgba(0,212,255,0.2)' : '1px solid var(--border)',
                    color: msg.role === 'user' ? 'var(--accent)' : 'var(--text)'
                  }}>
                    <span style={{fontWeight:'bold', marginRight:'6px'}}>{msg.role === 'user' ? 'CMD>' : `[${selectedAgent.name}]`}</span>
                    {msg.content}
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-msg model" style={{alignSelf:'flex-start', color:'var(--muted)'}}>
                    <span className="pulse-dot" style={{display:'inline-block', width:'6px', height:'6px', background:'var(--accent)', marginRight:'6px'}}></span>
                    Processing...
                  </div>
                )}
              </div>
              <div className="chat-input-area" style={{display:'flex', gap:'8px'}}>
                <input 
                  type="text" 
                  className="command-input" 
                  placeholder={`Message ${selectedAgent.name}...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAgentChat()}
                  disabled={isTyping}
                />
                <button className="cmd-btn" onClick={handleAgentChat} disabled={isTyping}>SEND</button>
              </div>

              <div className="modal-section-title" style={{marginTop:'20px'}}>EXECUTION LOG</div>
              <div className="log-terminal">
                {selectedAgent.logs.map((log: string, i: number) => {
                  const lvl = log.split(' ')[0];
                  const msg = log.substring(lvl.length + 1);
                  // Calculate a staggered time for realism
                  const ts = new Date(Date.now() - (selectedAgent.logs.length - i) * 47000);
                  const timeStr = ts.toTimeString().slice(0,8);
                  return (
                    <div key={i} className="log-line">
                      <span className="log-time">[{timeStr}]</span> <span className={`log-level-${lvl}`}>{lvl}</span> {msg}
                    </div>
                  );
                })}
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={() => setSelectedAgent(null)}>⬡ MONITOR</button>
                <button className="btn btn-primary" style={{background:'rgba(0,255,136,0.08)', borderColor:'var(--accent4)', color:'var(--accent4)'}}>▶ ASSIGN TASK</button>
                <button className="btn btn-danger">⏸ SUSPEND</button>
                <button className="btn btn-secondary" onClick={() => setSelectedAgent(null)}>✕ CLOSE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
