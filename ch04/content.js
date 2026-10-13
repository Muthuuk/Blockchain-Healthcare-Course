/* Chapter 4: Blockchain Security Landscape and Classification */
window.CH = {
  id: "ch04",
  num: "4",
  title: "Blockchain Security Landscape and Classification",
  summary: "Where blockchain systems can be attacked, how blockchains are classified, and which defences protect them in healthcare.",
  outcomes: [
    "Explain why a blockchain is not automatically secure, using the three goals of integrity, confidentiality and availability.",
    "Sort threats onto process, data and infrastructure security, and say why consensus is often treated as a fourth area.",
    "Describe the 51% attack, Sybil attack, smart contract flaws and phishing in plain words.",
    "Classify blockchains by architecture, consensus, platform and application, and compare permissioned and permissionless security.",
    "Match defences such as hashing, keys, multi-signature, audits, zero-knowledge proofs and user training to the threats they answer.",
    "Weigh security against performance and learn from the DeFi, DAO and healthcare case studies."
  ],
  starter: [
    {
      q: "If patient records are stored on a blockchain, are they safe from all attacks?",
      o: ["Yes, blockchains cannot be hacked", "No, the people, programs and computers around the chain can still be attacked", "Only if the records are printed as well"],
      a: 1
    },
    {
      q: "A fake email asks a doctor to 'confirm' her login details. What kind of threat is this?",
      o: ["A software update", "A network outage", "Phishing"],
      a: 2
    },
    {
      q: "Which type of blockchain lets anyone join and take part?",
      o: ["Public", "Private", "Consortium"],
      a: 0
    }
  ],
  lessons: [
    /* ---------------- Lesson 1 ---------------- */
    {
      title: "Is blockchain unhackable?",
      minutes: 2,
      scenes: [
        {
          scene: "title",
          opts: { kicker: "Chapter 4", title: "Security Landscape", subtitle: "Threats, types and defences" },
          say: [
            "Welcome to Chapter 4, Blockchain Security Landscape and Classification. I'm Maya, your tutor.",
            "People often say that a blockchain cannot be hacked.",
            "That is only half true. The chain itself is hard to change, but the people, programs and computers around it can still be attacked.",
            "So security is not automatic. It has to be designed in, like infection control on a ward.",
            "In this chapter we map where the risks are, sort blockchains into types, and look at the defences."
          ]
        },
        {
          scene: "cards",
          opts: {
            title: "Three security goals",
            layout: "row",
            items: [
              { t: "Integrity", d: "Records stay correct", c: "teal" },
              { t: "Confidentiality", d: "Only the right people read", c: "blue" },
              { t: "Availability", d: "Works whenever needed", c: "green" }
            ]
          },
          say: [
            "Blockchain security means protecting three things.",
            "First, integrity. A patient record must stay correct, and nobody should be able to change it quietly.",
            "Second, confidentiality. Only the right people, such as the care team, should be able to read it.",
            "Third, availability. The system must work when a nurse needs it at three in the morning.",
            "Every attack in this chapter damages at least one of these three goals."
          ]
        },
        {
          scene: "chain",
          opts: {
            n: 4,
            labels: ["Admission", "Test result", "Prescription", "Discharge"],
            at: { 4: "tamper:1", 5: "heal" }
          },
          say: [
            "Here is a small chain of patient record updates, starting with an admission.",
            "Each block is linked to the one before it by a digital fingerprint called a hash.",
            "A hash is a short code worked out from the data. Change the data, and the code changes completely.",
            "The fourth block, the discharge note, slides into place.",
            "Watch what happens if someone edits block two, the test result. It turns red, and every later link breaks.",
            "The chain is healed again. It is good at showing tampering, but it cannot stop someone stealing a password or tricking a doctor.",
            "So the slides stress three strategies: secure protocols, encryption, and regular data integrity checks.",
            "Secure protocols are agreed safe rules for how computers talk. Encryption scrambles data for anyone without the key."
          ]
        }
      ],
      keyPoint: "A blockchain makes tampering easy to spot, but security is not automatic. It must protect integrity, confidentiality and availability through secure protocols, encryption and data integrity checks.",
      plain: [
        "Blockchains are hard to change, but not unhackable.",
        "Security protects three goals: integrity, confidentiality and availability.",
        "People, programs and computers around the chain can still be attacked.",
        "Secure protocols, encryption and integrity checks are the basic strategies."
      ],
      check: {
        q: "A colleague says, \"It's on a blockchain, so it's secure.\" What is the best reply?",
        o: [
          "Yes, a blockchain cannot be attacked",
          "The chain shows tampering well, but the people, programs and computers around it can still be attacked",
          "Blockchains are no safer than paper files"
        ],
        a: 1,
        e: "The linked hashes make changes obvious, but security still has to be designed into everything around the chain.",
        retry: {
          q: "Which three goals does blockchain security protect?",
          o: ["Speed, cost and size", "Mining, staking and voting", "Integrity, confidentiality and availability"],
          a: 2,
          e: "Integrity keeps records correct, confidentiality keeps them private, and availability keeps the system working when needed."
        }
      },
      scenario: {
        title: "The 'unhackable' press release",
        setting: "Priya Nair is the IT lead for the Northvale Hospitals Consortium, a group of three fictional hospitals. They are launching a shared blockchain for referral records. The communications team has drafted a press release.",
        steps: [
          {
            prompt: "The chief executive wants the release to say the new system is \"unhackable\". What does Priya advise?",
            choices: [
              { t: "Agree. Blockchains cannot be hacked, so the claim is fair.", s: 0, fb: "Not quite. The chain is hard to change, but people, apps and servers around it can still be attacked. An 'unhackable' claim could mislead patients." },
              { t: "Suggest leaving security out of the release altogether.", s: 1, fb: "Safer than a false claim, but it misses a chance to explain honestly how records are protected." },
              { t: "Suggest 'tamper-evident records', and explain that staff, apps and servers still need protecting.", s: 2, fb: "Well done. This is accurate and honest: the chain shows tampering, and security still has to be designed in." }
            ]
          },
          {
            prompt: "A ward manager asks what 'availability' means for her team.",
            choices: [
              { t: "Only the care team can read the records.", s: 0, fb: "That describes confidentiality, not availability." },
              { t: "The system works whenever staff need it, day or night.", s: 2, fb: "Exactly. Availability means the records can be reached when care depends on them." },
              { t: "The data is backed up somewhere.", s: 1, fb: "Backups help, but availability means staff can actually use the system when they need it." }
            ]
          }
        ]
      }
    },

    /* ---------------- Lesson 2 ---------------- */
    {
      title: "The security map",
      minutes: 3,
      scenes: [
        {
          scene: "stack",
          opts: {
            title: "Three security areas",
            layers: [
              { t: "Infrastructure", d: "Nodes and communication channels", c: "slate" },
              { t: "Data", d: "Hashing and digital signatures", c: "blue" },
              { t: "Process", d: "Contracts, validation, consensus", c: "teal" }
            ],
            threats: [
              { t: "DDoS", layer: 0, beat: 4 },
              { t: "Byzantine faults", layer: 0, beat: 4 },
              { t: "Double spending", layer: 1, beat: 5 },
              { t: "Privacy breach", layer: 1, beat: 5 },
              { t: "Re-entrancy", layer: 2, beat: 6 },
              { t: "Consensus manipulation", layer: 2, beat: 6 }
            ]
          },
          say: [
            "Think of blockchain security as a building with three floors.",
            "The ground floor is infrastructure security: the nodes, meaning the computers that hold copies of the chain, and the channels between them.",
            "The middle floor is data security. It uses hashing and digital signatures, which are electronic signatures made with a private key.",
            "The top floor is process security. It protects smart contracts, the checking of transactions, and consensus, which is how nodes agree on what is true.",
            "Now the threats arrive. A distributed denial of service, or DDoS, attack floods the ground floor, and Byzantine faults strike it too.",
            "Double spending and privacy breaches hit the data floor.",
            "Re-entrancy and consensus manipulation hit the process floor."
          ]
        },
        {
          scene: "compare",
          opts: {
            cols: [
              { t: "Process", items: ["Re-entrancy", "Consensus manipulation", "Transaction ordering"], c: "teal" },
              { t: "Data", items: ["Double spending", "Privacy breaches", "Future quantum risk"], c: "blue" },
              { t: "Infrastructure", items: ["DDoS", "Byzantine faults", "Node centralisation"], c: "slate" }
            ],
            at: { 1: "col:0", 3: "col:1", 5: "col:2" }
          },
          say: [
            "Let's look closer at the risks on each floor.",
            "On the process podium, re-entrancy tricks a contract into paying out again before it updates its records.",
            "Consensus manipulation bends the agreement process, and transaction ordering attacks push a transaction ahead in the queue for unfair gain.",
            "On the data podium, double spending means using the same digital money twice, like cashing one cheque at two banks.",
            "Privacy breaches expose personal data. Quantum computing is listed only as a possible future risk to today's codes, not a current attack.",
            "On the infrastructure podium, Byzantine faults are nodes that fail or lie, like a colleague giving a false handover.",
            "Node centralisation means too few computers hold the power, so attacking a handful could harm everyone."
          ]
        },
        {
          scene: "cards",
          opts: {
            title: "Where does consensus go?",
            layout: "grid",
            items: [
              { t: "Process", c: "teal" },
              { t: "Data", c: "blue" },
              { t: "Infrastructure", c: "slate" },
              { t: "Consensus protocol", d: "Often its own fourth area", c: "amber" }
            ]
          },
          say: [
            "One last thing about this map.",
            "Some figures in your slides show three areas, starting with process security.",
            "Then data security.",
            "Then infrastructure security.",
            "Another figure adds a fourth, consensus protocol security, while the slide summary places consensus under process security.",
            "Both views are fair. There are three main areas, and consensus is so important that it is often treated as its own fourth category."
          ]
        }
      ],
      keyPoint: "Blockchain security has three main areas: process, data and infrastructure. Consensus is so important that it is often treated as a fourth category of its own.",
      plain: [
        "Process security protects smart contracts, transaction checks and consensus.",
        "Data security uses hashing and signatures; risks include double spending and privacy breaches.",
        "Infrastructure security protects nodes and links from DDoS, Byzantine faults and centralisation.",
        "Quantum computing is a possible future risk, not a current attack."
      ],
      check: {
        q: "An attacker floods a hospital's blockchain node with fake traffic so it stops responding. Which area is hit?",
        o: ["Data security", "Infrastructure security", "Process security"],
        a: 1,
        e: "A denial of service flood targets the nodes and channels, which is infrastructure security.",
        retry: {
          q: "Someone tries to spend the same digital token twice. In the slides, which area lists this risk?",
          o: ["Infrastructure security", "Process security", "Data security"],
          a: 2,
          e: "The slides list double spending, together with privacy breaches, under data security."
        }
      },
      scenario: {
        title: "Sorting the audit findings",
        setting: "Tom Okafor is a security auditor at Clearline Assurance, a fictional firm. He is reviewing the blockchain that links the branches of Greendale Pharmacy Group. He must sort his findings for the report.",
        steps: [
          {
            prompt: "One node keeps sending conflicting messages to the others. Where does Tom file this finding?",
            choices: [
              { t: "Process security, under consensus.", s: 1, fb: "It does affect agreement, but a node that fails or lies is a Byzantine fault, which the slides place under infrastructure security." },
              { t: "Data security.", s: 0, fb: "Not here. Data security is about hashing, signatures, double spending and privacy." },
              { t: "Infrastructure security, as a Byzantine fault.", s: 2, fb: "Correct. A node that fails or lies is a Byzantine fault, an infrastructure risk." }
            ]
          },
          {
            prompt: "Tom's report template has three headings. A colleague insists consensus deserves its own section. What does Tom do?",
            choices: [
              { t: "Keep the three main areas and add consensus as a fourth section, because it is so important.", s: 2, fb: "Good call. This matches both views in the slides and makes the consensus findings easy to find." },
              { t: "Drop consensus from the report to keep it short.", s: 0, fb: "Consensus risks are serious. Leaving them out would weaken the audit." },
              { t: "Refuse, and keep consensus findings inside process security only.", s: 1, fb: "Acceptable, since the summary does place consensus there, but a separate section would make an important area clearer." }
            ]
          }
        ]
      },
      lab: "layerLab"
    },

    /* ---------------- Lesson 3 ---------------- */
    {
      title: "What can go wrong",
      minutes: 3,
      scenes: [
        {
          scene: "cards",
          opts: {
            title: "Key challenges",
            layout: "ring",
            items: [
              { t: "Decentralisation", d: "More nodes, more doors to guard", c: "amber" },
              { t: "Cyber threats", d: "Including smart contract risks", c: "red" },
              { t: "Data privacy", d: "Protecting personal health data", c: "violet" }
            ]
          },
          say: [
            "The slides name three key challenges.",
            "First, decentralisation and vulnerability. Spreading control removes a single point of failure, but every node is another door to guard.",
            "Second, cyber threats and smart contract risks. A smart contract is a program on the chain that runs by itself, so a bug in it can be exploited.",
            "Third, data privacy and protection. Health data is sensitive, and a shared ledger must not expose it.",
            "Now let's watch the attacks the slides highlight."
          ]
        },
        {
          scene: "network",
          opts: { n: 16, at: { 2: "attack", 4: "sybil", 6: "ddos" } },
          say: [
            "Here is a public network. Every node keeps a copy of the chain and helps add new blocks.",
            "This one uses Proof of Work, or PoW. Miners compete to solve a hard puzzle, and the chain with the most work wins.",
            "Watch the red nodes grow past half. This is a fifty-one per cent attack, where one group controls most of the mining power.",
            "With that majority, they could rewrite recent blocks and spend the same coins twice. It is the classic attack on Proof of Work blockchains.",
            "Next, a Sybil attack. One attacker spawns many fake nodes, like one person voting under many false names.",
            "If a network counts identities rather than effort, those fakes can outvote the honest members.",
            "Finally, a flood of red traffic hits one node. This is a distributed denial of service attack, and it can knock the node offline."
          ]
        },
        {
          scene: "cards",
          opts: {
            title: "Wider threat landscape",
            layout: "grid",
            items: [
              { t: "Smart contract bugs", d: "Re-entrancy, overflow, underflow", c: "red" },
              { t: "Phishing", d: "Tricks people, not code", c: "amber" },
              { t: "Malware & ransomware", d: "Harmful or file-locking software", c: "red" },
              { t: "Persistent threats", d: "Long, hidden intrusions (APT)", c: "violet" },
              { t: "Zero-day exploits", d: "Flaws with no fix yet", c: "slate" }
            ]
          },
          say: [
            "Two more attacks from the slides, then the wider cyber security landscape.",
            "Smart contract vulnerabilities include re-entrancy, and overflow or underflow, where a number passes its limit and wraps round, like a mileometer rolling back to zero.",
            "Phishing and social engineering target people, not code. A fake email tricks someone into handing over a password or a key.",
            "Beyond blockchain, the slides list malware and ransomware. Ransomware is harmful software that locks files until a ransom is paid.",
            "Advanced persistent threats are skilled attackers who hide inside a system for a long time, quietly taking data.",
            "Zero-day exploits use a flaw the makers do not know about yet, so no fix exists. These are all threats; the defences come in lesson five."
          ]
        }
      ],
      keyPoint: "The main attacks are the 51% attack on Proof of Work, the Sybil attack with fake identities, smart contract flaws, and phishing that targets people. They sit inside a wider landscape of malware, DDoS, persistent threats and zero-day exploits.",
      plain: [
        "A 51% attack means one group controls most of the mining power in Proof of Work.",
        "A Sybil attack uses many fake identities to gain influence.",
        "Smart contract bugs include re-entrancy and overflow or underflow.",
        "Phishing tricks people, so it gets past even a perfect chain."
      ],
      check: {
        q: "An attacker gains control of most of the mining power on a Proof of Work chain. What is this called?",
        o: ["A Sybil attack", "Phishing", "A 51% attack"],
        a: 2,
        e: "Controlling more than half of the mining power is a 51% attack, the classic attack on Proof of Work.",
        retry: {
          q: "One attacker creates hundreds of fake nodes to sway decisions on a network. What is this?",
          o: ["A Sybil attack", "A zero-day exploit", "Ransomware"],
          a: 0,
          e: "Many fake identities controlled by one attacker is a Sybil attack."
        }
      },
      scenario: {
        title: "The urgent key request",
        setting: "Dr Aisha Rahman is a GP at Millbrook Surgery, a fictional practice that signs referrals on a shared health blockchain. One morning she receives an email that looks as if it comes from the records network.",
        steps: [
          {
            prompt: "The email says her signing key will expire today unless she enters it on a linked page. What does she do?",
            choices: [
              { t: "Delete the email and carry on.", s: 1, fb: "She avoids the trap, but colleagues may get the same email. Reporting it protects the whole practice." },
              { t: "Not click, and report it to the practice's IT or security lead, checking through a known contact route.", s: 2, fb: "Excellent. She avoids the trap and warns others, using a channel she already trusts." },
              { t: "Click the link and enter her key quickly so referrals are not delayed.", s: 0, fb: "This is exactly what the attacker wants. A private key should never be typed into a page from an email." }
            ]
          },
          {
            prompt: "The practice manager asks what kind of attack this was.",
            choices: [
              { t: "A 51% attack on the blockchain.", s: 0, fb: "No. A 51% attack is about controlling mining power, not tricking a person." },
              { t: "A cyber attack on the blockchain itself.", s: 1, fb: "Partly. It is a cyber attack, but it targets people, not the chain." },
              { t: "Phishing and social engineering, aimed at people rather than code.", s: 2, fb: "Correct. Phishing tricks people into giving away secrets." }
            ]
          }
        ]
      },
      lab: "attack51Lab"
    },

    /* ---------------- Lesson 4 ---------------- */
    {
      title: "Kinds of blockchain and their security",
      minutes: 3,
      scenes: [
        {
          scene: "cards",
          opts: {
            title: "Ways to classify",
            center: "Blockchain",
            layout: "ring",
            items: [
              { t: "Architecture", d: "Public, private, consortium", c: "teal" },
              { t: "Consensus", d: "How nodes agree", c: "blue" },
              { t: "Platform", d: "Software it is built on", c: "violet" },
              { t: "Application", d: "Healthcare, finance, supply", c: "green" }
            ]
          },
          say: [
            "Blockchains can be sorted in four ways.",
            "By architecture: public, private or consortium.",
            "By consensus mechanism, the method nodes use to agree, such as Proof of Work or Proof of Stake, where validators lock up tokens as a deposit.",
            "By implementation platform, meaning the software it is built on, such as Ethereum or Hyperledger Fabric.",
            "And by application, such as healthcare, finance or supply chain. Each choice changes the security picture."
          ]
        },
        {
          scene: "compare",
          opts: {
            cols: [
              { t: "Public", items: ["Anyone can join", "Open to view", "Bitcoin, Ethereum"], c: "amber" },
              { t: "Private", items: ["One organisation", "Invited members", "Tight control"], c: "blue" },
              { t: "Consortium", items: ["Group of organisations", "Shared control", "Known members only"], c: "teal" }
            ],
            at: { 1: "col:0", 3: "col:1", 5: "col:2" }
          },
          say: [
            "Let's compare the three architectures.",
            "A public blockchain, such as Bitcoin or Ethereum, lets anyone join, read and take part.",
            "Its openness means it must rely on its consensus method to resist Sybil and fifty-one per cent attacks.",
            "A private blockchain is run by one organisation, which invites its members, like a single hospital's own system.",
            "Control is tight, but if that one organisation is compromised, the whole chain is at risk.",
            "A consortium blockchain is shared by a group of organisations, such as several hospitals and a pharmacy chain.",
            "It sits in the middle: there is no single owner, but only known members can join."
          ]
        },
        {
          scene: "flow",
          opts: {
            reveal: "all",
            nodes: [
              { id: "nurse", t: "Nurse", c: "teal", x: 0, y: 1 },
              { id: "outsider", t: "Outsider", c: "red", x: 0, y: 3 },
              { id: "idm", t: "Identity check", c: "blue", x: 1, y: 2 },
              { id: "acl", t: "Access control", c: "violet", x: 2, y: 2 },
              { id: "rec", t: "Encrypted record", c: "green", x: 4, y: 2 }
            ],
            edges: [
              ["nurse", "idm", "badge"],
              ["outsider", "idm", "fake ID"],
              ["idm", "acl"],
              ["acl", "rec", "allowed"]
            ],
            packets: [
              { beat: 4, path: ["nurse", "idm", "acl", "rec"], t: "Request", c: "good" },
              { beat: 5, path: ["outsider", "idm"], t: "Blocked", c: "bad" }
            ]
          },
          say: [
            "Security models split into two families: permissionless and permissioned.",
            "Permissionless means anyone can join, like a public blockchain. Permissioned means members need approval, like private and consortium chains.",
            "Permissioned chains add three features. First, identity management: proving who each user is, like checking a staff badge.",
            "Second, access control: deciding what each person may see or do, so a porter cannot open a prescription.",
            "Third, data encryption, so the record is scrambled for anyone without the key. Watch the nurse's request pass every check.",
            "Now an outsider with a fake identity tries the same route, and is stopped at the identity check.",
            "The trade-off: permissioned chains give more control, but they depend on whoever grants the permissions."
          ]
        }
      ],
      keyPoint: "Blockchains are classified by architecture, consensus, platform and application. Permissionless chains are open to all, while permissioned chains add identity management, access control and encryption, at the cost of relying on whoever grants access.",
      plain: [
        "Four ways to classify: architecture, consensus, platform and application.",
        "Public chains are open; private chains belong to one organisation; consortium chains are shared by a group.",
        "Permissioned chains check identity, control access and encrypt data.",
        "More control means more trust placed in the people who grant permissions."
      ],
      check: {
        q: "Three hospitals and a community pharmacy want to share referral records with known partners only. Which architecture fits best?",
        o: ["Public", "Consortium", "Private to one hospital"],
        a: 1,
        e: "A consortium chain is shared by a group of known organisations, with no single owner.",
        retry: {
          q: "What does 'permissionless' mean?",
          o: ["Members need approval to join", "No encryption is ever used", "Anyone can join and take part"],
          a: 2,
          e: "Permissionless chains, like public blockchains, let anyone join without approval."
        }
      },
      scenario: {
        title: "Choosing the consortium's model",
        setting: "Priya Nair, IT lead for the fictional Northvale Hospitals Consortium, must choose how the shared referral chain will work. Partners are three hospitals and Oakfield Community Pharmacy.",
        steps: [
          {
            prompt: "Which model does Priya recommend to the partners?",
            choices: [
              { t: "A private chain run by Northvale alone.", s: 1, fb: "Workable and tightly controlled, but the other partners must trust one owner completely." },
              { t: "A permissioned consortium chain shared by all partners.", s: 2, fb: "Good choice. Control is shared, and only known, approved members can join." },
              { t: "A public, permissionless chain so anyone can verify it.", s: 0, fb: "Too open for patient referrals, and it must rely on consensus alone to resist Sybil and 51% attacks." }
            ]
          },
          {
            prompt: "Which security features should she switch on from day one?",
            choices: [
              { t: "None. The chain is permissioned, so it is already safe.", s: 0, fb: "Permission to join is only the start. Users still need checking and data still needs protecting." },
              { t: "Identity management, access control and data encryption.", s: 2, fb: "Exactly the three features the slides pair with permissioned models." },
              { t: "Data encryption only.", s: 1, fb: "Encryption helps, but without identity checks and access control the wrong people may still get the keys." }
            ]
          }
        ]
      },
      lab: "typeLab"
    },

    /* ---------------- Lesson 5 ---------------- */
    {
      title: "How we defend",
      minutes: 3,
      scenes: [
        {
          scene: "cards",
          opts: {
            title: "Defence toolkit",
            layout: "grid",
            reveal: "all",
            items: [
              { t: "Hashing", d: "Any change shows up", c: "teal" },
              { t: "Key pairs", d: "Private signs, public checks", c: "blue" },
              { t: "Multi-signature", d: "Several approvals needed", c: "violet" },
              { t: "Audit & monitor", d: "Regular checks, audit trail", c: "green" },
              { t: "Robust consensus", d: "Strong agreement rules", c: "teal" },
              { t: "Encrypted channels", d: "Data scrambled in transit", c: "blue" },
              { t: "Vulnerability checks", d: "Regular weak-spot reviews", c: "amber" },
              { t: "User education", d: "The answer to phishing", c: "green" }
            ],
            at: { 1: "focus:0", 2: "focus:1", 3: "focus:2", 4: "focus:4", 5: "focus:6", 6: "focus:7" }
          },
          say: [
            "Now the defences. Keep them separate in your mind from the threats we met in lesson three.",
            "Cryptographic hashing gives every record a fingerprint, so any change shows up when it is checked.",
            "Public and private keys work as a pair. The private key signs, and the public key lets anyone check the signature.",
            "Multi-signature transactions need several approvals, and regular auditing and monitoring keep a trail of who did what.",
            "Best practice adds robust consensus protocols, and encrypted channels so data is scrambled while it travels.",
            "Run regular vulnerability assessments, which are planned health checks looking for weak spots.",
            "And educate users. Training is the main answer to phishing, because phishing targets people, not code."
          ]
        },
        {
          scene: "vault",
          opts: {
            title: "Controlled record",
            keys: ["Doctor", "Pharmacist", "Nurse"],
            need: 2,
            at: { 1: "stolen", 2: "turn:0", 3: "turn:1", 4: "open" }
          },
          say: [
            "This cabinet is a multi-signature scheme. It holds a sensitive record and needs two of three keys.",
            "Watch a thief with one stolen key try to open it. One key alone does nothing, so the cabinet stays shut.",
            "Now the doctor turns her key.",
            "The pharmacist turns his.",
            "Two genuine approvals, and the cabinet opens. A single stolen key, perhaps taken by phishing, is not enough.",
            "The slides list two more advanced mechanisms. A zero-knowledge proof lets you prove something is true without revealing the data, like proving you are over eighteen without showing your birth date.",
            "Homomorphic encryption lets a computer work on data while it stays encrypted, so results can be calculated without exposing patient details."
          ]
        },
        {
          scene: "contract",
          opts: {
            title: "Claims payout",
            rule: "IF claim approved THEN pay once",
            at: { 1: "input", 2: "reentrancy", 3: "fix" }
          },
          say: [
            "Smart contracts need special care. This one pays approved insurance claims, once each.",
            "A claim token goes in, and the contract checks it.",
            "Watch a re-entrancy attack. The attacker asks again before the balance updates, so the payout repeats and the vault drains.",
            "The fix is simple: update the balance first, then pay. Now the second request is refused.",
            "To prevent such bugs, use verified libraries, rigorous testing and secure development environments, with a security audit before deployment.",
            "Then detect problems with real-time monitoring, and respond with an agreed incident response plan. Zero trust helps too: never trust any user or device automatically, always check.",
            "Artificial intelligence, or AI, can spot attacks in real time and respond automatically. But it can be fooled by adversarial attacks, inherit bias from its data, and raise false alarms."
          ]
        }
      ],
      keyPoint: "Defences include hashing, key pairs, multi-signature approvals, audits, encrypted channels, vulnerability checks and user training, plus advanced tools such as zero-knowledge proofs and homomorphic encryption. Smart contracts need verified libraries, testing and audits, inside a prevent, detect and respond plan.",
      plain: [
        "Hashing, key pairs, multi-signature and audits are the core defences.",
        "Training users is the main answer to phishing.",
        "Zero-knowledge proofs prove without revealing; homomorphic encryption computes on locked data.",
        "Prevent, detect, respond: test and audit, monitor, and have an incident plan."
      ],
      check: {
        q: "A GP practice keeps receiving phishing emails aimed at its staff. Which defence targets this most directly?",
        o: ["Educating users on security", "Multi-signature transactions", "Homomorphic encryption"],
        a: 0,
        e: "Phishing targets people, so training users to spot and report it is the most direct defence.",
        retry: {
          q: "Which order stops re-entrancy in a payout contract?",
          o: ["Pay first, then update the balance", "Update the balance first, then pay", "Pay twice to be safe"],
          a: 1,
          e: "Updating the balance before paying means a repeated request finds nothing left to claim."
        }
      },
      scenario: {
        title: "Deploy day for the claims contract",
        setting: "Daniel Mensah is a developer at Brightwater Health Cover, a fictional insurer. His smart contract will pay approved treatment claims automatically. It is due to go live tomorrow.",
        steps: [
          {
            prompt: "The contract works in the demo. What does Daniel do before going live?",
            choices: [
              { t: "Arrange rigorous testing and an independent security audit, using verified libraries.", s: 2, fb: "Right. The slides call for verified libraries, rigorous testing and an audit before deployment." },
              { t: "Deploy now and fix any bugs later.", s: 0, fb: "Risky. Once deployed, a flawed contract can be drained before anyone reacts." },
              { t: "Run a few more tests himself, then deploy.", s: 1, fb: "Better than nothing, but an independent audit catches flaws the author can easily miss." }
            ]
          },
          {
            prompt: "The auditor finds the contract pays out before it updates the claimant's balance. What is the fix?",
            choices: [
              { t: "Add an alert for unusually large payouts.", s: 1, fb: "Monitoring helps detect attacks, but it does not prevent this re-entrancy flaw." },
              { t: "Leave it, because attacks are unlikely.", s: 0, fb: "This is the re-entrancy pattern seen in real attacks. It must be fixed." },
              { t: "Update the balance first, then pay.", s: 2, fb: "Correct. A second request now finds the claim already paid and is refused." }
            ]
          }
        ]
      },
      lab: ["reentrancyLab", "multisigLab"]
    },

    /* ---------------- Lesson 6 ---------------- */
    {
      title: "Is the defence worth it?",
      minutes: 3,
      scenes: [
        {
          scene: "cards",
          opts: {
            title: "Judging a defence",
            layout: "row",
            items: [
              { t: "Effectiveness", d: "Does it stop the threat?", c: "teal" },
              { t: "Scalability", d: "Does it work as we grow?", c: "blue" },
              { t: "Robustness", d: "Does it hold under stress?", c: "violet" }
            ]
          },
          say: [
            "How do we judge whether a security mechanism is worth it? The slides give three measures.",
            "Effectiveness: does it actually stop the threat?",
            "Scalability: does it still work as the network and the number of users grow?",
            "Robustness: does it keep working under stress, faults or attack?",
            "A mechanism can score well on one and badly on another, which brings us to the trade-off."
          ]
        },
        {
          scene: "scale",
          opts: {
            left: "Security",
            right: "Performance",
            at: { 1: "tilt-left", 3: "tilt-right", 5: "balance" }
          },
          say: [
            "Picture a balance scale, with security on one side and performance on the other.",
            "Add every check, layer of encryption and approval, and the scale tips towards security. The system is safer, but slower.",
            "The pros, from the slides, are improved data integrity and reduced risk of fraud.",
            "Strip the checks out for speed, and the scale tips the other way. It is fast, but exposed.",
            "The cons are high complexity, and some security models can drift towards centralisation, with too few parties in control.",
            "The aim is balance, matched to the risk. A medication record needs more protection than a canteen menu.",
            "Looking ahead, the slides point to quantum-resistant algorithms, built to stay safe against future quantum computers.",
            "They also mention advanced cryptographic protocols, and adaptive security models that adjust as threats change."
          ]
        },
        {
          scene: "cards",
          opts: {
            title: "Case clinic",
            layout: "row",
            items: [
              { t: "DeFi breaches", d: "Smart contracts, key management", c: "amber" },
              { t: "The DAO attack", d: "Re-entrancy on Ethereum", c: "red" },
              { t: "Healthcare privacy", d: "Protecting patient data", c: "green" }
            ]
          },
          say: [
            "Let's finish with a case clinic.",
            "Case one: security breaches in decentralised finance, or DeFi, applications. The slides trace them to weak smart contracts and poor key management.",
            "Case two: the DAO attack on Ethereum, a well-known example of a smart contract being exploited through re-entrancy.",
            "Case three: privacy and security in healthcare blockchains, where advanced mechanisms protect patient data, alongside encryption and audit trails.",
            "Your exercise is to research how common such attacks are and what they have cost, using recent, reliable sources. Always check figures before you quote them."
          ]
        }
      ],
      keyPoint: "Judge a defence by its effectiveness, scalability and robustness, and balance security against performance. The DeFi breaches and the DAO attack show why smart contracts and key management need the most care.",
      plain: [
        "Three measures: effectiveness, scalability and robustness.",
        "More security usually means less speed, so match protection to risk.",
        "Pros: better data integrity and less fraud. Cons: complexity and possible centralisation.",
        "The DAO attack on Ethereum was a re-entrancy exploit of a smart contract."
      ],
      check: {
        q: "A trust adds so many checks that clinicians wait minutes to open a record. What has gone wrong?",
        o: ["The system has become too centralised", "There is not enough encryption", "The balance has tipped too far towards security over performance"],
        a: 2,
        e: "Security and performance must be balanced against the real risk, or the system becomes unusable.",
        retry: {
          q: "Which three measures do the slides use to evaluate a security mechanism?",
          o: ["Effectiveness, scalability and robustness", "Cost, colour and size", "Mining, staking and voting"],
          a: 0,
          e: "Effectiveness asks if it works, scalability if it grows, and robustness if it holds under stress."
        }
      },
      scenario: {
        title: "The case clinic briefing",
        setting: "Tom Okafor, the auditor from Clearline Assurance, is asked to brief the board of the fictional Northvale Hospitals Consortium. They plan to add an automatic payment feature for partner invoices.",
        steps: [
          {
            prompt: "Based on the DeFi case study, which areas should Tom examine first?",
            choices: [
              { t: "Only the smart contract code.", s: 1, fb: "A good start, but the DeFi case also points to key management." },
              { t: "The smart contracts and how the signing keys are managed.", s: 2, fb: "Right. The slides trace DeFi breaches to smart contracts and key management." },
              { t: "The colour scheme of the payment screens.", s: 0, fb: "Design matters for usability, but it is not where the DeFi breaches came from." }
            ]
          },
          {
            prompt: "The board wants a headline figure for how much such attacks have cost. What does Tom do?",
            choices: [
              { t: "Give a rough number that sounds about right.", s: 0, fb: "Never invent figures. A made-up number can mislead the board's decision." },
              { t: "Quote a figure he remembers from a conference talk.", s: 1, fb: "Better than guessing, but he should verify it and give the source and date." },
              { t: "Research recent, reliable sources and cite them with dates.", s: 2, fb: "Excellent. Checked, dated sources give the board figures it can trust." }
            ]
          }
        ]
      },
      lab: "tradeoffLab"
    }
  ],

  test: [
    {
      q: "A hospital board member says, \"Our records are on a blockchain, so we don't need a security plan.\" Which reply is most accurate?",
      o: ["Correct, blockchains cannot be attacked", "Security is not automatic; the people, programs and computers around the chain still need protecting", "Only private blockchains need a security plan", "Security plans are only for paper records"],
      a: 1,
      e: "The chain shows tampering, but integrity, confidentiality and availability still have to be designed in.",
      lesson: 0
    },
    {
      q: "An auditor finds that a smart contract can be called again before it updates its balance. Which security area does this belong to?",
      o: ["Infrastructure security", "Data security", "Process security"],
      a: 2,
      e: "Re-entrancy is a smart contract risk, which falls under process security.",
      lesson: 1
    },
    {
      q: "One node in a pharmacy network keeps sending false information to the others. What is this called?",
      o: ["A Byzantine fault", "Double spending", "A zero-day exploit", "Homomorphic encryption"],
      a: 0,
      e: "A Byzantine fault is a node that fails or lies, an infrastructure security risk.",
      lesson: 1
    },
    {
      q: "One mining pool on a public Proof of Work chain grows past half of all the mining power. Which attack does this make possible?",
      o: ["Phishing", "Sybil attack", "51% attack", "DDoS attack"],
      a: 2,
      e: "A 51% attack means controlling most of the mining power, the classic attack on Proof of Work. Proof of Stake faces a similar risk if one group holds most of the stake.",
      lesson: 2
    },
    {
      q: "A GP receives an email asking her to type her private signing key into a website. What is the threat?",
      o: ["A Sybil attack", "Phishing and social engineering", "Node centralisation"],
      a: 1,
      e: "Phishing tricks people into handing over secrets, so it targets people rather than code.",
      lesson: 2
    },
    {
      q: "How do permissioned blockchains differ from permissionless ones in terms of security?",
      o: ["Permissioned chains let anyone join without checks", "Permissioned chains use no encryption", "Permissioned chains approve members and add identity management, access control and encryption", "There is no difference"],
      a: 2,
      e: "Permissioned chains control who joins and what they can do, while permissionless chains are open to all.",
      lesson: 3
    },
    {
      q: "A research team wants to calculate results from patient data without ever decrypting it. Which mechanism fits?",
      o: ["Multi-signature scheme", "Homomorphic encryption", "Cryptographic hashing", "Zero-knowledge proof"],
      a: 1,
      e: "Homomorphic encryption lets computers work on data while it stays encrypted.",
      lesson: 4
    },
    {
      q: "A thief steals the nurse's key, but the record needs two of three approvals. What happens?",
      o: ["The record is released at once", "The whole chain is deleted", "The record stays locked, because one key is not enough"],
      a: 2,
      e: "Multi-signature approval means a single stolen key cannot release the record.",
      lesson: 4
    },
    {
      q: "A team adds so many checks that their health app becomes painfully slow. Which idea from the slides should guide them?",
      o: ["Balancing security against performance", "Removing all encryption", "Switching to a public chain"],
      a: 0,
      e: "Security trade-offs mean matching the level of protection to the real risk while keeping the system usable.",
      lesson: 5
    },
    {
      q: "The DAO attack on Ethereum is a well-known example of which problem?",
      o: ["A DDoS attack on hospital servers", "A smart contract exploited through re-entrancy", "A phishing email to clinicians", "A quantum computer breaking encryption"],
      a: 1,
      e: "The DAO attack exploited a smart contract through re-entrancy, which is why audits and testing before deployment matter.",
      lesson: 5
    }
  ],

  sources: [
    "Slide deck: Chapter 4, Blockchain Security Landscape and Classification",
    "Slide deck: Additional Topic, Advanced Security Mechanisms in Blockchain",
    "Instructor resources: Chapter 4, including the Cybersecurity in Decentralized Systems case study, the DAO attack, MCQs and the security settings lab"
  ]
};
