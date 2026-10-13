window.CH = {
  id: "ch01",
  num: "1",
  title: "Introduction to Blockchain Concepts",
  summary: "What a blockchain is, how its parts work together, what it can and cannot do, how it stays secure, and how it can help healthcare.",
  outcomes: [
    "Explain in plain words what a blockchain is and name the three key elements of a block",
    "Describe how blocks, hashes, the nonce, the previous hash and the genesis block work together",
    "Explain how nodes, mining and consensus, including Proof of Work, keep one shared ledger",
    "Weigh the main benefits and limitations of blockchain, including privacy and speed",
    "Compare Proof of Work and Proof of Stake, and explain how hashing and Merkle trees reveal tampering",
    "Describe how blockchain can support patient data sharing, and why records should stay off-chain"
  ],
  starter: [
    {
      q: "A blockchain is best described as...",
      o: [
        "A shared record book copied across many computers",
        "A single central database owned by one hospital",
        "A type of encrypted email system"
      ],
      a: 0
    },
    {
      q: "What happens if someone secretly changes an old entry in a blockchain?",
      o: [
        "Nothing, nobody can tell",
        "The change is spread silently to every copy",
        "The links between blocks break, so the change is noticed"
      ],
      a: 2
    },
    {
      q: "Which of these is a known limitation of public blockchains?",
      o: [
        "They cannot store any data at all",
        "They handle far fewer transactions per second than card payment networks",
        "They only work inside one building"
      ],
      a: 1
    }
  ],
  lessons: [
    /* ---------------- Lesson 1 ---------------- */
    {
      title: "What is a blockchain?",
      minutes: 3,
      scenes: [
        {
          scene: "title",
          opts: { kicker: "Chapter 1", title: "Blockchain Concepts", subtitle: "An introduction" },
          say: [
            "Welcome to Chapter 1, Introduction to Blockchain Concepts. I'm Maya, your tutor.",
            "Behind me, a ring of linked blocks is slowly turning. That ring is the idea we will explore.",
            "A blockchain is a shared record book that many people keep together, instead of one organisation keeping it alone.",
            "It was first built for the digital money called Bitcoin.",
            "Since then it has spread into finance, supply chains and, for us, healthcare."
          ]
        },
        {
          scene: "chain",
          opts: { n: 4, labels: ["Block 1", "Block 2", "Block 3", "Block 4"], at: { 4: "focus:1" } },
          say: [
            "Here is the first block. Think of it as one page in a ward's shared record book.",
            "A second block appears, joined to the first by a chain. Each page is linked to the page before it.",
            "Each block holds a list of transactions. A transaction is simply one piece of recorded activity, such as a record update.",
            "Each block also carries a hash. A hash is a short digital fingerprint that, in practice, is unique to the block's contents.",
            "Now watch block two light up. Inside, it stores the fingerprint of the block before it, the previous hash.",
            "So every block has three key elements: a list of transactions, its own hash, and the previous block's hash."
          ]
        },
        {
          scene: "network",
          opts: { n: 12, at: { 0: "hub", 2: "mesh", 4: "ledger" } },
          say: [
            "Here you see a familiar set up. One central server sits in the middle, like a single records office.",
            "If that one office is closed, damaged or breached, everyone loses access to the records.",
            "Now the star dissolves into a mesh. Every computer, called a node, talks directly to the others.",
            "This is what decentralised means. No single organisation is in charge of the record.",
            "Watch each node receive its own copy of the chain. This is what distributed means.",
            "So a blockchain is a decentralised, distributed ledger, a shared record book that everyone can check."
          ]
        }
      ],
      keyPoint: "A blockchain is a decentralised, distributed ledger. Transactions are grouped into blocks, and each block is linked to the one before it by a hash.",
      plain: [
        "A blockchain is a shared record book kept by many computers at once.",
        "Records are grouped into blocks, like pages in a book.",
        "Each block holds transactions, its own hash, and the previous block's hash.",
        "No single organisation controls it, and everyone holds a copy."
      ],
      check: {
        q: "Which three elements does every block contain?",
        o: [
          "A patient name, a password and a date of birth",
          "A list of transactions, its own hash, and the previous block's hash",
          "A server address, a backup copy and an administrator"
        ],
        a: 1,
        e: "Each block holds a list of transactions, a hash that acts as its fingerprint, and the hash of the block before it, which links the chain together.",
        retry: {
          q: "What does 'decentralised' mean for a blockchain?",
          o: [
            "No single organisation is in charge of the record",
            "The records are deleted after a set time",
            "Only one hospital is allowed to read the records"
          ],
          a: 0,
          e: "Decentralised means control is shared across many participants, rather than sitting with one central office or server."
        }
      },
      scenario: {
        title: "Explaining blockchain to the ward team",
        setting: "Tom is a new ward manager at Riverside Health Trust. The Trust is exploring a blockchain pilot, and his nurses ask him what a blockchain actually is.",
        steps: [
          {
            prompt: "A nurse asks: 'Isn't it just another hospital database?' What should Tom say?",
            choices: [
              { t: "Yes, it is exactly the same as our current records system.", s: 0, fb: "Not quite. A normal database is usually run by one organisation. A blockchain is shared and copied across many participants." },
              { t: "It's a shared record book, copied across many computers, where no single organisation is in charge.", s: 2, fb: "Well put. That captures decentralised and distributed in everyday words." },
              { t: "It's a database, but stored in the cloud.", s: 1, fb: "Partly. Cloud storage can still be controlled by one provider. The key idea is that the record is shared and checked by many." }
            ]
          },
          {
            prompt: "Another nurse asks how the blocks stay in order. What is the best answer?",
            choices: [
              { t: "Each block has a page number written by an administrator.", s: 0, fb: "No. Order is kept by cryptography, not by someone writing numbers by hand." },
              { t: "They are added one after another, in time order.", s: 1, fb: "Partly. Blocks are added in time order, but what locks that order is that each block stores the hash of the block before it." },
              { t: "Each block stores the hash, or fingerprint, of the block before it, which links them in a chain.", s: 2, fb: "Exactly. The previous hash is what turns separate blocks into a chain." }
            ]
          }
        ]
      }
    },

    /* ---------------- Lesson 2 ---------------- */
    {
      title: "How the parts work together",
      minutes: 4,
      scenes: [
        {
          scene: "chain",
          opts: { n: 4, genesis: true, header: true, labels: ["Genesis", "Block 2", "Block 3", "Block 4"], at: { 1: "header", 5: "tamper:1" } },
          say: [
            "The very first block in any chain has a special name: the genesis block. It has no block before it.",
            "Now a block opens up. Its header holds the previous hash, its own hash, a nonce and a Merkle root.",
            "The previous hash points back to the earlier block. The hash is this block's own fingerprint.",
            "The nonce is a number used once. Computers keep changing it until the block's hash meets a set rule.",
            "The Merkle root is one fingerprint that summarises every transaction in the block. We return to it in lesson four.",
            "Now watch block two turn red. Someone has changed it, and every later link breaks.",
            "To hide the change, a cheat would have to redo the work for that block and every block after it."
          ]
        },
        {
          scene: "hash",
          opts: { inputs: ["Patient 042: Dose 5mg", "Patient 042: Dose 8mg"], start: 1 },
          say: [
            "Let's look closer at the hash machine that makes these fingerprints.",
            "In goes a simple record: patient zero four two, dose five milligrams. Out comes a long fingerprint.",
            "Now we change just one character. The dose becomes eight milligrams.",
            "Look at the new fingerprint. The whole thing has changed, not just one small part.",
            "That is why hashes are so useful. Even a tiny edit to a record is easy to spot."
          ]
        },
        {
          scene: "network",
          opts: { n: 12, at: { 1: "packets", 3: "ledger", 4: "vote" } },
          say: [
            "Back to our network of nodes. Each node is a computer taking part in the blockchain.",
            "Watch new transactions travel between nodes, like record updates passed between wards.",
            "Some nodes, called miners, gather these transactions into a new block. This validation step is called mining.",
            "Every node keeps its own copy of the ledger, so they must all agree on which block comes next.",
            "Watch the nodes flash green. This agreement is called consensus.",
            "In Proof of Work, or PoW, miners race to find a nonce that solves a puzzle. The winner adds the block."
          ]
        }
      ],
      keyPoint: "Blocks are chained by hashes, starting from the genesis block. Nodes check new blocks through mining and agree on them through consensus, such as Proof of Work.",
      plain: [
        "The genesis block is the first block in the chain.",
        "A hash is a fingerprint; change the data and the fingerprint changes completely.",
        "The nonce is a number miners change until the block meets a set rule.",
        "Consensus is how all the nodes agree on the same version of the ledger."
      ],
      check: {
        q: "What is the nonce in a block?",
        o: [
          "The name of the hospital that created the block",
          "A number miners keep changing until the block's hash meets a set rule",
          "A backup copy of the previous block"
        ],
        a: 1,
        e: "Nonce means number used once. In Proof of Work, miners try many nonces until the block's hash meets the network's rule.",
        retry: {
          q: "What is the genesis block?",
          o: [
            "The newest block added to the chain",
            "A block that stores patients' genetic data",
            "The very first block, which has no block before it"
          ],
          a: 2,
          e: "Every chain starts with a genesis block. It is the only block without a previous hash pointing to an earlier block."
        }
      },
      scenario: {
        title: "The demo that broke",
        setting: "Priya is a junior developer at Northbrook Clinical Systems. She is showing a test blockchain of medication updates to a pharmacy team.",
        steps: [
          {
            prompt: "A pharmacist quietly edits an old dose in block two. The demo now shows the chain as broken. Why?",
            choices: [
              { t: "The edit changed block two's hash, so block three's previous hash no longer matches.", s: 2, fb: "Correct. One changed fingerprint breaks every link that follows it." },
              { t: "The software crashed because it was overloaded.", s: 0, fb: "No. The break is the blockchain doing its job: revealing a change." },
              { t: "Block two was deleted by the network.", s: 1, fb: "Not quite. The block is still there, but its new hash no longer matches the link stored in the next block." }
            ]
          },
          {
            prompt: "The pharmacist asks how the network agrees which version of the ledger is the true one. What should Priya say?",
            choices: [
              { t: "The newest computer to join decides.", s: 0, fb: "No. Agreement comes from the consensus rules shared by all nodes." },
              { t: "The nodes follow a consensus mechanism, such as Proof of Work, and check each new block before accepting it.", s: 2, fb: "Exactly. Consensus is how many independent nodes agree on one shared record." },
              { t: "Whichever copy has the most patients in it wins.", s: 1, fb: "Not really. It is the agreed rules, not the size of the data, that decide which chain is accepted." }
            ]
          }
        ]
      },
      lab: "chainLab"
    },

    /* ---------------- Lesson 3 ---------------- */
    {
      title: "Strengths and limits",
      minutes: 3,
      scenes: [
        {
          scene: "cards",
          opts: {
            title: "Characteristics",
            layout: "grid",
            items: [
              { t: "Immutable", d: "Committed data is, in practice, fixed", c: "green" },
              { t: "Shared view", d: "All participants can see the data", c: "amber" },
              { t: "Limited speed", d: "Few transactions per second", c: "red" },
              { t: "Deployment scope", d: "Public, private or consortium", c: "blue" },
              { t: "Many variants", d: "Lots of configurations and designs", c: "violet" },
              { t: "A connector", d: "Links systems, not a front desk", c: "teal" }
            ]
          },
          say: [
            "Every technology has strengths and limits. Let's lay out the main characteristics of blockchain.",
            "First, immutability. Once data is in a committed transaction, it becomes, in practice, permanent.",
            "Second, privacy is a real limit. Information on a blockchain is available to all participants, like a notice board everyone can read.",
            "Third, speed. Public blockchains handle far fewer transactions than everyday payment systems.",
            "Fourth, scope. A blockchain can be public, private, or a consortium shared by a group of organisations.",
            "Fifth, there are many configurations and variants, including different ways of arranging the data itself.",
            "Sixth, a blockchain acts as a connector between organisations' systems, rather than one provider's service you call, as with cloud services."
          ]
        },
        {
          scene: "scale",
          opts: { left: "Public: 3–20 per sec", right: "VISA: ~1,700 per sec", at: { 2: "tilt-right" } },
          say: [
            "On the left of this balance sits a mainstream public blockchain. On the right sits a payment service, VISA.",
            "Mainstream public blockchains handle on average three to twenty transactions per second.",
            "Watch the scale tip. VISA handles on average about one thousand seven hundred transactions per second.",
            "Imagine a busy hospital pharmacy issuing many prescriptions every second. Throughput matters.",
            "This is why designers think carefully about what really needs to go on the chain."
          ]
        },
        {
          scene: "compare",
          opts: {
            cols: [
              { t: "Public", items: ["Anyone can join", "Fully open", "Bitcoin, Ethereum"], c: "amber" },
              { t: "Private", items: ["One organisation", "Invited nodes only"], c: "blue" },
              { t: "Consortium", items: ["Group of partners", "Shared control"], c: "teal" }
            ],
            at: { 1: "col:0", 2: "col:1", 3: "col:2", 4: "all" }
          },
          say: [
            "Let's look at the three deployment models side by side.",
            "A public blockchain, like Bitcoin or Ethereum, lets anyone join and read the ledger.",
            "A private blockchain is run by one organisation, and only invited nodes can take part.",
            "A consortium, or community, blockchain is shared by a group of partners, such as several hospitals.",
            "For patient data, private or consortium chains, with permissions, give far more control over who sees what."
          ]
        }
      ],
      keyPoint: "Blockchain gives practical immutability, but data is visible to all participants and public chains are slow, about three to twenty transactions per second against roughly 1,700 for VISA.",
      plain: [
        "Once committed, data on a blockchain is, in practice, permanent.",
        "Everyone on the chain can see the data, so privacy needs extra care.",
        "Public blockchains are slow: 3–20 transactions per second versus about 1,700 for VISA.",
        "Blockchains can be public, private or consortium, with many variants."
      ],
      check: {
        q: "Why is privacy a limitation of blockchain?",
        o: [
          "Because information on a blockchain is available to all participants",
          "Because blockchains delete data after a week",
          "Because only one person can ever read the chain"
        ],
        a: 0,
        e: "Every participant holds a copy of the ledger, so information on it can be seen by all participants. Sensitive health data needs extra protection.",
        retry: {
          q: "Roughly how many transactions per second do mainstream public blockchains handle on average?",
          o: [
            "About 1,700",
            "Over a million",
            "About 3 to 20"
          ],
          a: 2,
          e: "Mainstream public blockchains manage on average 3 to 20 transactions per second, while payment services like VISA handle about 1,700."
        }
      },
      scenario: {
        title: "A blockchain for the pharmacy?",
        setting: "Daniel is the IT lead at Hillview Hospital. A supplier suggests putting every prescription straight onto a public blockchain.",
        steps: [
          {
            prompt: "The pharmacy issues many prescriptions every second at peak times. What should Daniel consider first?",
            choices: [
              { t: "Speed is never an issue with blockchain.", s: 0, fb: "Not true. Public blockchains handle on average only three to twenty transactions per second." },
              { t: "Whether a public chain's throughput can keep up, and what really needs to go on-chain.", s: 2, fb: "Good thinking. Low throughput is a known limit, so designers keep on-chain activity small." },
              { t: "Buy faster computers for the pharmacy.", s: 1, fb: "Faster local computers help a little, but the limit comes from how the whole network reaches agreement." }
            ]
          },
          {
            prompt: "The supplier says all prescription details would be visible on the public chain. What is the best response?",
            choices: [
              { t: "That's fine, transparency is always good.", s: 0, fb: "Not for health data. Information on a blockchain is available to all participants." },
              { t: "Encrypt the data, but keep it on the public chain.", s: 1, fb: "Partly. Encryption helps, but a permissioned chain with records kept off-chain gives much more control." },
              { t: "Patient data must not be visible to everyone; use a permissioned private or consortium chain.", s: 2, fb: "Exactly. Permissioned chains let only authorised parties see specific data." }
            ]
          }
        ]
      }
    },

    /* ---------------- Lesson 4 ---------------- */
    {
      title: "Keeping the chain secure",
      minutes: 4,
      scenes: [
        {
          scene: "powpos",
          opts: { at: { 1: "pow", 2: "energy", 3: "pos", 5: "central" } },
          say: [
            "Consensus is the first line of defence. Here are two ways of reaching it, side by side.",
            "On the left, Proof of Work. Miners race to solve a puzzle using computing power. This makes the chain highly tamper resistant.",
            "Watch the energy bar climb. Proof of Work resists Sybil attacks, where one attacker poses as many computers, but it uses a lot of energy.",
            "On the right, Proof of Stake, or PoS. Validators are chosen based on the tokens they have staked, or put up as a deposit.",
            "This is far more energy efficient, and validators have a financial reason to act honestly, or they risk their stake.",
            "But watch a few large stakers start to dominate. Proof of Stake carries a risk of centralisation."
          ]
        },
        {
          scene: "merkle",
          opts: { leaves: 4, labels: ["Allergy note", "Blood pressure", "Blood test", "Discharge note"], at: { 1: "build", 3: "root", 4: "tamper:2" } },
          say: [
            "Now data integrity. At the bottom are four record entries, each with its own hash.",
            "Watch the hashes pair up and combine, level by level. This is a Merkle tree, a binary tree of hashes.",
            "It lets a computer check one entry quickly, without re-checking every entry in the block.",
            "At the top sits a single fingerprint, the Merkle root. It is stored in the block header.",
            "Now someone alters the blood test result. Watch the path up to the root turn red.",
            "Any change to any entry changes the root, so comparing roots reveals tampering quickly."
          ]
        },
        {
          scene: "network",
          opts: { n: 14, at: { 1: "ledger", 3: "attack", 5: "heal" } },
          say: [
            "Finally, tamper resistance across the whole network.",
            "Watch every node hold its own copy of the ledger. Once confirmed, data is treated as permanent. This is immutability.",
            "To rewrite history, changing one copy is not enough. The rest of the network would reject it.",
            "Watch red attacker nodes grow. Only by controlling a majority of the network could they push through a rewritten history.",
            "In a large, well spread network, that is highly impractical. This is the strength of decentralisation.",
            "The honest nodes hold firm, and the shared record stays trustworthy."
          ]
        }
      ],
      keyPoint: "Security comes from consensus, hashing, Merkle trees, immutability and decentralisation. Proof of Work is tamper resistant but energy hungry; Proof of Stake is efficient but risks centralisation.",
      plain: [
        "Proof of Work: strong tamper resistance, but uses a lot of energy.",
        "Proof of Stake: energy efficient, but a few large holders could dominate.",
        "A Merkle tree combines record hashes into one root; any change shows up.",
        "Tampering needs control of most of the network, which is highly impractical."
      ],
      check: {
        q: "What happens to a Merkle root when one record entry is changed?",
        o: [
          "The root changes, so the tampering can be detected",
          "Nothing, because only the leaf changes",
          "The record is automatically restored"
        ],
        a: 0,
        e: "Each level is built from the hashes below it. Change one entry and every hash on its path, including the root, changes.",
        retry: {
          q: "Which is a key risk of Proof of Stake?",
          o: [
            "It uses huge amounts of energy",
            "It cannot add new blocks",
            "A few large stakers could dominate, leading to centralisation"
          ],
          a: 2,
          e: "Validators are chosen by their stake, so those holding the most tokens may gain too much influence."
        }
      },
      scenario: {
        title: "Choosing a consensus mechanism",
        setting: "Grace is the IT lead for Meadowbank Health Network, a fictional group of clinics. The board wants a blockchain that is secure but kind to the environment.",
        steps: [
          {
            prompt: "A board member asks for the most energy-efficient option. What should Grace recommend exploring?",
            choices: [
              { t: "Proof of Stake, which is energy efficient, while watching for centralisation.", s: 2, fb: "Good balance. Proof of Stake saves energy, but Grace should check that no few members hold most of the stake." },
              { t: "Proof of Work, because it uses the most computing power.", s: 1, fb: "Partly. Proof of Work is highly tamper resistant, but it is energy intensive, the opposite of what the board asked for." },
              { t: "No consensus at all, so nothing uses energy.", s: 0, fb: "Without consensus, the nodes cannot agree on one shared record. That removes a core part of security." }
            ]
          },
          {
            prompt: "Another member worries that a hacker could rewrite a patient's past record. What is the best reassurance?",
            choices: [
              { t: "Records cannot be read by anyone, so they are safe.", s: 0, fb: "That's not what protects them. Blockchain data is visible to participants; integrity comes from hashing and decentralisation." },
              { t: "Changing a record would change its hash and the Merkle root, and the attacker would need to control most of the network.", s: 2, fb: "Exactly. Hashing reveals tampering, and decentralisation makes rewriting history highly impractical." },
              { t: "Each record has a hash, so a change would be noticed.", s: 1, fb: "True, hashing reveals changes. Add that decentralisation makes rewriting history across most of the network highly impractical." }
            ]
          }
        ]
      },
      lab: "merkleLab"
    },

    /* ---------------- Lesson 5 ---------------- */
    {
      title: "Blockchain in healthcare",
      minutes: 4,
      scenes: [
        {
          scene: "flow",
          opts: {
            reveal: "all",
            nodes: [
              { id: "pt", t: "Patient", c: "teal", x: 0, y: 1 },
              { id: "gp", t: "GP surgery", c: "blue", x: 1, y: 0 },
              { id: "bc", t: "Blockchain: hashes", c: "violet", x: 2, y: 1 },
              { id: "store", t: "Encrypted records", c: "slate", x: 2, y: 3 },
              { id: "hosp", t: "Hospital", c: "blue", x: 4, y: 0 }
            ],
            edges: [
              ["gp", "store", "store record"],
              ["gp", "bc", "add hash"],
              ["pt", "bc", "consent"],
              ["store", "hosp", "share"],
              ["bc", "hosp", "check"]
            ],
            packets: [
              { beat: 2, path: ["gp", "store"], t: "Record", c: "good" },
              { beat: 3, path: ["gp", "bc"], t: "Hash", c: "good" },
              { beat: 4, path: ["store", "hosp"], t: "Record", c: "good" },
              { beat: 5, path: ["bc", "hosp"], t: "Check", c: "good" }
            ]
          },
          say: [
            "Healthcare depends on secure data and safe sharing of patient records. Let's follow one patient.",
            "Mrs Okafor sees her GP, or family doctor, and is then referred to a hospital.",
            "Watch her updated record travel from the GP surgery into an encrypted store, kept off the chain.",
            "Only the record's hash, its fingerprint, goes onto the blockchain. A hash cannot be turned back into the record.",
            "When the hospital needs the record, it is shared from the secure store.",
            "The hospital checks its hash against the blockchain. If they match, the record has not been changed."
          ]
        },
        {
          scene: "contract",
          opts: { title: "Consent contract", rule: "IF patient consents THEN share record", at: { 1: "input", 2: "run", 3: "pay" } },
          say: [
            "This glass machine is a smart contract, a small program on the blockchain that runs itself when its rule is met.",
            "Watch Mrs Okafor's consent go in, like a token into a vending machine.",
            "The gears turn as the contract checks that the hospital doctor has permission.",
            "The rule is met, so access to the record is released. Every access can be logged for accountability.",
            "In the chapter's case study, patients control access to their own records this way, through smart contracts.",
            "MedRec is a real-world example of using blockchain to manage access to medical records."
          ]
        },
        {
          scene: "cards",
          opts: {
            title: "Before adopting",
            layout: "row",
            items: [
              { t: "Technical", d: "Systems, speed and integration", c: "blue" },
              { t: "Legal", d: "Privacy and data protection law", c: "violet" },
              { t: "Economic", d: "Costs against expected benefits", c: "amber" },
              { t: "Sustainability", d: "Energy use of the consensus method", c: "green" }
            ]
          },
          say: [
            "Before a healthcare organisation adopts blockchain, the chapter's feasibility study asks it to weigh several factors.",
            "First, technical factors, such as speed, and how the blockchain will connect with existing record systems.",
            "Second, legal factors. Patient data must stay private and meet data protection laws.",
            "Third, economic factors, setting the costs of the system against the benefits it should bring.",
            "The chapter also flags sustainability. Proof of Work can be energy intensive, while Proof of Stake offers a more energy-efficient path."
          ]
        }
      ],
      keyPoint: "Blockchain can support secure patient data sharing and patient control through smart contracts. Keep records off-chain, put only hashes on-chain, and check technical, legal, economic and sustainability factors first.",
      plain: [
        "Keep patient records off-chain in encrypted storage; put only their hashes on-chain.",
        "Smart contracts can let patients grant or refuse access to their records.",
        "MedRec is a real-world example of blockchain for medical records.",
        "Check technical, legal and economic feasibility, and energy use, before adopting."
      ],
      check: {
        q: "What should usually go on the blockchain in a patient records system?",
        o: [
          "The full patient record, unencrypted",
          "Only a hash of each record, with the record itself stored securely off-chain",
          "Nothing at all"
        ],
        a: 1,
        e: "Putting only hashes on-chain lets anyone check a record has not changed, without exposing the record itself to every participant.",
        retry: {
          q: "In the chapter's case study, how do patients control access to their data?",
          o: [
            "By phoning the hospital each time",
            "By keeping paper copies at home",
            "Through smart contracts that automate access permissions"
          ],
          a: 2,
          e: "Smart contracts automate access permissions, so a patient's consent decides who can see their records."
        }
      },
      scenario: {
        title: "What goes on the chain?",
        setting: "Sam is the records manager at Riverside Health Trust. The Trust is joining a consortium blockchain with local GP surgeries so records can follow patients like Mrs Okafor.",
        steps: [
          {
            prompt: "A colleague suggests putting full patient records on the shared chain for convenience. What should Sam do?",
            choices: [
              { t: "Agree. Everyone in the consortium is trusted anyway.", s: 0, fb: "Risky. Data on a blockchain is visible to all participants and, in practice, cannot be removed." },
              { t: "Keep records in encrypted storage off-chain and place only their hashes on-chain.", s: 2, fb: "Exactly. The chain proves a record is unchanged, without exposing the record itself." },
              { t: "Put the records on the chain, but only the most recent year.", s: 1, fb: "Less data is better, but any record on-chain is still visible to participants and hard to remove." }
            ]
          },
          {
            prompt: "Mrs Okafor asks who decides whether the hospital can see her GP record. What is the best design?",
            choices: [
              { t: "A smart contract that checks Mrs Okafor's consent, with a member of staff able to step in if something goes wrong.", s: 2, fb: "Great. Patient control through smart contracts, plus human oversight for errors or disputes." },
              { t: "The hospital decides on its own.", s: 0, fb: "That takes control away from the patient, which the case study aims to avoid." },
              { t: "A smart contract that always releases records to any doctor.", s: 1, fb: "It automates sharing, but ignores consent. The rule should check the patient's permission first." }
            ]
          }
        ]
      }
    }
  ],
  test: [
    {
      q: "A ward manager wants a one-line description of blockchain for staff. Which is most accurate?",
      o: [
        "A central database run by the IT department",
        "A decentralised, distributed ledger where blocks of transactions are linked by hashes",
        "An email system that encrypts messages",
        "A backup drive kept in the records office"
      ],
      a: 1,
      e: "A blockchain is a decentralised, distributed ledger. Transactions are grouped into blocks, and blocks are linked by hashes.",
      lesson: 0
    },
    {
      q: "A GP surgery and a hospital each keep a full copy of the same blockchain. Which word describes this?",
      o: [
        "Distributed",
        "Centralised",
        "Deleted"
      ],
      a: 0,
      e: "Distributed means every participating node keeps its own copy of the ledger.",
      lesson: 0
    },
    {
      q: "In a test chain, someone edits a medication dose in block two. What does the system show?",
      o: [
        "Nothing changes",
        "Only block two's colour changes, the rest stays valid",
        "Block two's hash changes, so the link from block three breaks, and so do the links after it"
      ],
      a: 2,
      e: "Each block stores the previous block's hash. Changing one block changes its hash and breaks every later link.",
      lesson: 1
    },
    {
      q: "In Proof of Work, what are miners actually doing?",
      o: [
        "Voting by show of hands",
        "Trying many nonces until the block's hash meets the network's rule",
        "Deleting old blocks to save space",
        "Encrypting patient names"
      ],
      a: 1,
      e: "Miners keep changing the nonce until the block's hash satisfies the rule. The winner adds the block and other nodes check it.",
      lesson: 1
    },
    {
      q: "An IT lead plans to run a busy prescription service on a mainstream public blockchain. What limit should worry them most?",
      o: [
        "Public blockchains handle on average only 3 to 20 transactions per second",
        "Public blockchains cannot store numbers",
        "Public blockchains only work at night"
      ],
      a: 0,
      e: "Mainstream public blockchains manage about 3 to 20 transactions per second, compared with about 1,700 for VISA.",
      lesson: 2
    },
    {
      q: "Several hospitals want to share a blockchain run jointly, with only invited members. Which deployment model fits?",
      o: [
        "Public",
        "Private to one organisation",
        "Consortium",
        "Genesis"
      ],
      a: 2,
      e: "A consortium, or community, blockchain is shared and controlled by a group of partner organisations.",
      lesson: 2
    },
    {
      q: "A health network wants strong security but must cut energy use. Which statement is correct?",
      o: [
        "Proof of Stake is more energy efficient, but carries a risk of centralisation",
        "Proof of Work uses the least energy of any method",
        "Proof of Stake needs miners to race to solve puzzles"
      ],
      a: 0,
      e: "Proof of Stake chooses validators by their staked tokens, saving energy, but a few large stakers could dominate.",
      lesson: 3
    },
    {
      q: "An auditor wants to check quickly that none of the entries in a block has been altered. What helps most?",
      o: [
        "Reading every entry aloud",
        "Comparing the block's Merkle root, which changes if any entry changes",
        "Asking the administrator"
      ],
      a: 1,
      e: "A Merkle tree combines the hashes of all entries into one root. Any change to an entry changes the root.",
      lesson: 3
    },
    {
      q: "A records manager is designing a patient records blockchain. Which design best protects privacy?",
      o: [
        "Put full records on a public chain",
        "Put full records on-chain, unencrypted, for speed",
        "Keep records encrypted off-chain, put only their hashes on a permissioned chain, and use smart contracts for consent",
        "Avoid any access logging"
      ],
      a: 2,
      e: "Hashes on-chain prove records are unchanged, while records stay off-chain. Permissioned chains and consent contracts control who sees what.",
      lesson: 4
    },
    {
      q: "Before adopting blockchain, which factors does the chapter's feasibility study say a healthcare institution must consider?",
      o: [
        "Only the colour scheme of the user interface",
        "Technical, legal and economic factors",
        "Only the number of staff"
      ],
      a: 1,
      e: "The feasibility study highlights technical, legal and economic factors, with sustainability also important when choosing consensus.",
      lesson: 4
    }
  ],
  sources: [
    "Slide deck: Chapter 1, Introduction to Blockchain Concepts (slides 1 to 9, including Figures 1.1, 1.2 and 1.5, and the Blockchain Security Concepts table)",
    "Instructor resources: Chapter 1 instructor resources (video tutorial outline and lab outline)",
    "Instructor resources: Chapter 1 selected solutions (medical records system design and ethical implications; cost estimates not used)"
  ]
};
