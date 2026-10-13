// Chapter 2: Core Blockchain Technologies
// Sources: ch02 slide deck (incl. Figures 2.2-2.6, Key Points table, Exercises) and ch02 instructor resources.
window.CH = {
  id: "ch02",
  num: "2",
  title: "Core Blockchain Technologies",
  summary: "An in-depth look at the building blocks of blockchain: chain types, hashing, keys, consensus, smart contracts and decentralised apps.",
  outcomes: [
    "Choose between public, private and consortium blockchains for a healthcare setting.",
    "Explain how a hash function protects the integrity of a record.",
    "Describe how a private key signs an update and a public key checks it.",
    "Compare Proof of Work and Proof of Stake on energy, scalability and centralisation.",
    "Explain what a smart contract is and why buggy code is risky.",
    "Describe a decentralised app such as MediBlock and the wider DeFi ecosystem."
  ],

  starter: [
    {
      q: "A group of hospitals wants a shared blockchain that only approved members can join. Which type fits best?",
      o: ["A public blockchain anyone can join", "A consortium blockchain run by the member hospitals", "No blockchain, just email"],
      a: 1
    },
    {
      q: "What does a hash function produce from a piece of data?",
      o: ["A short, fixed-size fingerprint of the data", "An encrypted copy you can turn back into the original", "A list of everyone who read the data"],
      a: 0
    },
    {
      q: "Which consensus method is known for using a lot of energy?",
      o: ["Proof of Stake", "Smart contracts", "Proof of Work"],
      a: 2
    }
  ],

  lessons: [
    // ---------------------------------------------------------------- Lesson 1
    {
      title: "Public, private or shared?",
      minutes: 3,
      scenes: [
        {
          scene: "title",
          opts: { kicker: "Chapter 2", title: "Core Blockchain Tech", subtitle: "How blockchains really work" },
          say: [
            "Welcome to Chapter 2, Core Blockchain Technologies. I'm Maya, your tutor.",
            "In this chapter we open the bonnet and look at the parts that make a blockchain work.",
            "We will cover types of blockchain, hashing, digital keys, consensus, smart contracts and decentralised apps.",
            "Each idea comes with a healthcare example, and most come with a short hands-on lab.",
            "Let's start with a simple question. Who is allowed to join a blockchain?"
          ]
        },
        {
          scene: "cards",
          opts: {
            title: "Types of blockchain",
            layout: "row",
            items: [
              { t: "Public", d: "Anyone can join and read", c: "blue" },
              { t: "Private", d: "One organisation controls access", c: "violet" },
              { t: "Consortium", d: "A group of members shares control", c: "teal" }
            ],
            at: { 5: "focus:2" }
          },
          say: [
            "There are three main types of blockchain. They differ in who can join and who is in charge.",
            "First, a public blockchain. Anyone with an internet connection can join, read and take part, like Bitcoin.",
            "Second, a private blockchain. One organisation decides who may join, like a single hospital's own staff system.",
            "Third, a consortium blockchain. A group of trusted members shares control, like several hospitals in one region.",
            "The slides group it with federated and hybrid blockchains, which also sit between fully open and fully closed.",
            "For a regulated healthcare setting, a permissioned choice, private or consortium, is usually the best fit."
          ]
        },
        {
          scene: "network",
          opts: { n: 12, at: { 1: "mesh", 3: "ledger", 4: "vote" } },
          say: [
            "Why does permission matter so much in healthcare?",
            "Here is a network of computers, called nodes, each linked to its neighbours.",
            "Patient data is sensitive and protected by law, so a hospital must know exactly who holds a copy.",
            "Watch every approved node receive its own copy of the shared ledger.",
            "Now the members agree on each new entry together. Only known, approved organisations take part.",
            "Tools such as Hyperledger Fabric are built for this kind of permissioned network between organisations."
          ]
        }
      ],
      keyPoint: "Public blockchains are open to anyone; private and consortium blockchains control who joins. Regulated healthcare usually needs a permissioned, private or consortium, design.",
      plain: [
        "Public means anyone can join and read.",
        "Private means one organisation decides who joins.",
        "Consortium means a group shares control; the slides group it with federated and hybrid chains.",
        "Healthcare usually picks private or consortium to protect patient data."
      ],
      check: {
        q: "Five NHS-style trusts want to share referral records only with each other. Which blockchain type suits them?",
        o: ["Public", "Consortium", "None, blockchains cannot be shared"],
        a: 1,
        e: "A consortium blockchain lets a known group of organisations share control and keep outsiders out.",
        retry: {
          q: "Why is a fully public blockchain usually a poor fit for patient records?",
          o: ["It is too slow to store any data at all", "It cannot hold text", "Anyone can join and read it, which clashes with privacy rules"],
          a: 2,
          e: "Public blockchains are open to everyone. Patient data needs strict control over who can see it."
        }
      },
      scenario: {
        title: "Choosing a chain for Riverside",
        setting: "Priya is the digital lead at the fictional Riverside Health Trust. Three nearby trusts want to share discharge summaries on a blockchain. Her board asks which type to choose.",
        steps: [
          {
            prompt: "What should Priya recommend first?",
            choices: [
              { t: "A public blockchain, so anyone can check the records", s: 0, fb: "Open access would expose patient data to the whole world. That breaks privacy rules." },
              { t: "A consortium blockchain shared by the four trusts", s: 2, fb: "Good choice. The trusts share control and only approved members can join." },
              { t: "A private blockchain run only by Riverside", s: 1, fb: "This keeps data safe, but the other trusts would depend on Riverside alone. Shared control fits better here." }
            ]
          },
          {
            prompt: "A board member asks how new members will be added later. What is the best answer?",
            choices: [
              { t: "Anyone who downloads the software can join", s: 0, fb: "That is how a public chain works, not a permissioned one." },
              { t: "We will decide later, it does not matter", s: 1, fb: "It does matter. Clear joining rules are part of good governance." },
              { t: "The existing members agree a joining process and approve each new organisation", s: 2, fb: "Exactly. In a consortium, the members control who may join." }
            ]
          }
        ]
      },
      lab: "typeLab"
    },

    // ---------------------------------------------------------------- Lesson 2
    {
      title: "Hashing: a fingerprint for data",
      minutes: 3,
      scenes: [
        {
          scene: "hash",
          opts: { inputs: ["Patient 042: Dose 5mg", "Patient 042: Dose 8mg"], start: 1 },
          say: [
            "Meet the hash machine. A hash function turns any data into a short code called a hash.",
            "Watch a prescription line go in: Patient zero four two, dose five milligrams. Out comes its fingerprint.",
            "Now change just one character. The dose becomes eight milligrams.",
            "Look how the whole fingerprint changes, not just one letter. Any edit is easy to spot.",
            "The output is always the same size, whether you feed in one word or a whole record.",
            "And it only works one way. You cannot turn the fingerprint back into the original data."
          ]
        },
        {
          scene: "flow",
          opts: {
            nodes: [
              { id: "data", t: "Transaction data", c: "slate", x: 0, y: 1 },
              { id: "fn", t: "Hash function", c: "teal", x: 1.5, y: 1 },
              { id: "hash", t: "Unique hash", c: "amber", x: 3, y: 1 },
              { id: "head", t: "Block header", c: "blue", x: 4, y: 2 }
            ],
            edges: [["data", "fn"], ["fn", "hash"], ["hash", "head"]],
            packets: [{ beat: 4, path: ["data", "fn", "hash", "head"], t: "Record", c: "good" }]
          },
          say: [
            "So where does the hash go? First, we start with the transaction data, such as a record update.",
            "The data passes through the hash function.",
            "Out comes a unique hash, the fingerprint of that exact data.",
            "That hash is stored in the block header, the label on the front of each block.",
            "Watch the whole journey. Because each header holds the fingerprint, any later change no longer matches.",
            "This is how hashing makes any change to blockchain records easy to detect."
          ]
        },
        {
          scene: "compare",
          opts: {
            cols: [
              { t: "Strengths", items: ["One-way", "Fixed size", "Spots any change"], c: "green" },
              { t: "Weakness", items: ["Guessable inputs", "Brute force"], c: "red" }
            ],
            at: { 1: "col:0", 3: "col:1" }
          },
          say: [
            "Let's weigh hash functions up.",
            "On the strong side, they are one-way, fixed in size, and reveal any change. That protects integrity.",
            "They are used to build blocks and to create digital signatures.",
            "But there is a weakness. Brute force means an attacker tries every possible input until one matches.",
            "If the original data is short or predictable, like a simple patient number, guessing it can be possible.",
            "So hashing proves data has not changed, but it is not a privacy shield on its own."
          ]
        }
      ],
      keyPoint: "A hash function turns data into a fixed-size, one-way fingerprint. Change one character and the whole hash changes, which protects the integrity of every block.",
      plain: [
        "A hash is a short fingerprint of some data.",
        "Change the data even slightly and the hash changes completely.",
        "You cannot work backwards from the hash to the data.",
        "Short, guessable data can sometimes be found by brute force guessing."
      ],
      check: {
        q: "A nurse changes one digit in a stored dose. What happens to that record's hash?",
        o: ["Only one character of the hash changes", "The whole hash changes and no longer matches", "Nothing, hashes ignore numbers"],
        a: 1,
        e: "Even a tiny change gives a completely different hash, so the edit is easy to detect.",
        retry: {
          q: "Which is true of a hash function?",
          o: ["It is one-way and always gives the same size output", "You can decode it to read the original data", "Longer records always give longer hashes"],
          a: 0,
          e: "Hash functions are one-way and produce a fixed-size output whatever the input."
        }
      },
      scenario: {
        title: "The altered dose",
        setting: "Tom is a pharmacist at the fictional Brookside Community Pharmacy. Their shared prescription ledger stores a hash of every prescription. Today one prescription's hash does not match its text.",
        steps: [
          {
            prompt: "What does the mismatch most likely tell Tom?",
            choices: [
              { t: "The hash machine is broken and should be ignored", s: 0, fb: "Hash functions are reliable. A mismatch is a warning, not a glitch to ignore." },
              { t: "The prescription text was changed after it was recorded", s: 2, fb: "Right. A different hash means the data is no longer the same as when it was stored." },
              { t: "Probably a typing slip, so Tom should check it against the original", s: 1, fb: "Checking the original is sensible, but treat it as possible tampering too: the data is no longer what was recorded." }
            ]
          },
          {
            prompt: "A colleague suggests hashing patient numbers to keep them secret. What should Tom say?",
            choices: [
              { t: "Great idea, hashes can never be guessed", s: 0, fb: "Short, predictable inputs can be found by brute force guessing." },
              { t: "Hashing is fine, but patient numbers are guessable, so we need extra protection", s: 2, fb: "Well judged. Hashing protects integrity; privacy needs more safeguards." },
              { t: "Hash them, and just keep the list of hashes away from outsiders", s: 1, fb: "Limiting access helps, but anyone who gets the list could still guess the numbers by brute force." }
            ]
          }
        ]
      },
      lab: "hashLab"
    },

    // ---------------------------------------------------------------- Lesson 3
    {
      title: "Keys that sign and check",
      minutes: 3,
      scenes: [
        {
          scene: "keys",
          opts: { signer: "Doctor", verifier: "Verifier", doc: "Record update", at: { 1: "sign", 3: "send", 4: "verify" } },
          say: [
            "Public key cryptography gives each user a matched pair of keys, one private and one public.",
            "Watch the doctor sign a record update with her private, gold key. Only she holds this key.",
            "Think of it as a signature that nobody else can forge.",
            "The signed update now travels through the blockchain to a verifier.",
            "The verifier checks it with the doctor's public, blue key, which anyone may hold. Green tick, it is genuine.",
            "Once validity is confirmed, the update is added to the chain."
          ]
        },
        {
          scene: "keys",
          opts: { signer: "Doctor", verifier: "Verifier", doc: "Record update", at: { 1: "sign", 2: "tamper", 3: "send", 4: "reject" } },
          say: [
            "What if someone tries to change the update on the way?",
            "Again the doctor signs the update with her private key.",
            "Now watch an intruder alter the text after it was signed.",
            "The changed update travels on to the verifier.",
            "The public key check fails. Red cross. The update is rejected and never joins the chain.",
            "This gives us authenticity, proof of who sent it, and integrity, proof it was not changed."
          ]
        },
        {
          scene: "cards",
          opts: {
            title: "Guard the private key",
            layout: "row",
            items: [
              { t: "Lost key", d: "Access and data can be lost", c: "amber" },
              { t: "Stolen key", d: "Someone can sign as you", c: "red" },
              { t: "Kept safe", d: "Secure storage and clear rules", c: "green" }
            ]
          },
          say: [
            "The weak point is not the maths. It is how people look after their private keys.",
            "If a key is lost, the data or access it protects can be lost too.",
            "If a key is stolen, someone else can sign updates as if they were the doctor.",
            "So organisations need safe key storage and clear rules, just as they guard controlled-drug cupboard keys.",
            "Remember: private key mismanagement can lead to data loss."
          ]
        }
      ],
      keyPoint: "A private key signs; the matching public key verifies. This proves who made an update and that it was not changed, but a lost or stolen private key is a serious risk.",
      plain: [
        "Each user has a private key and a public key.",
        "The private key signs; the public key checks the signature.",
        "If the data is changed, the check fails and the update is rejected.",
        "Losing or leaking a private key can cause data loss or fake signatures."
      ],
      check: {
        q: "Which key does a doctor use to sign a record update?",
        o: ["The verifier's public key", "Her own public key", "Her own private key"],
        a: 2,
        e: "You sign with your own private key. Others check the signature with your public key.",
        retry: {
          q: "A signed update is altered after signing. What happens at verification?",
          o: ["The check fails and the update is rejected", "The check passes because the signature is still attached", "The public key repairs the change"],
          a: 0,
          e: "The signature only matches the exact data that was signed, so any change makes the check fail."
        }
      },
      scenario: {
        title: "The shared laptop",
        setting: "Dr Amara Okafor works at the fictional Hillview GP Surgery. She signs record updates on the surgery's blockchain. She notices her private key file is saved on a shared reception laptop.",
        steps: [
          {
            prompt: "What should Dr Okafor do first?",
            choices: [
              { t: "Report it, stop using that key and get a new key pair issued", s: 2, fb: "Right. A possibly exposed key must be replaced and the incident logged." },
              { t: "Delete the file from the laptop and carry on", s: 1, fb: "Better than nothing, but someone may already have copied it. The key should be replaced." },
              { t: "Leave it, the reception team are trustworthy", s: 0, fb: "Anyone with that file could sign updates in her name." }
            ]
          },
          {
            prompt: "The practice manager asks how to stop this happening again. Best answer?",
            choices: [
              { t: "Email private keys to staff so they always have a copy", s: 0, fb: "Emailing keys spreads them further and raises the risk of theft." },
              { t: "Share one key for the whole surgery to keep it simple", s: 1, fb: "Simple, but then nobody can tell who signed what." },
              { t: "Keep each person's private key in secure storage with clear handling rules", s: 2, fb: "Exactly. Good key management protects both authenticity and data." }
            ]
          }
        ]
      },
      lab: "signLab"
    },

    // ---------------------------------------------------------------- Lesson 4
    {
      title: "Agreeing on the truth: PoW and PoS",
      minutes: 3,
      scenes: [
        {
          scene: "powpos",
          opts: { at: { 1: "pow", 3: "energy" } },
          say: [
            "A consensus mechanism is how all the computers agree which new block is the true one.",
            "On the left is Proof of Work, or PoW. Miners race to solve a hard computer puzzle.",
            "The winner creates the next block and receives a reward. Bitcoin mining works this way.",
            "Watch the energy bar climb. All that racing uses a lot of electricity.",
            "Proof of Work is extremely secure and hard to tamper with, but it is energy hungry and slow."
          ]
        },
        {
          scene: "powpos",
          opts: { at: { 1: "pos", 4: "central" } },
          say: [
            "On the right is Proof of Stake, or PoS.",
            "Here validators lock up, or stake, their own tokens as a deposit. No puzzle race is needed.",
            "One validator is chosen to check transactions and create the block, then receives a reward.",
            "This uses far less energy and scales better. Ethereum 2.0 and many DeFi platforms use it.",
            "But watch what happens when a few big stakers hold most of the tokens. They start to dominate.",
            "That is the centralisation risk of Proof of Stake."
          ]
        },
        {
          scene: "compare",
          opts: {
            cols: [
              { t: "Proof of Work", items: ["Very secure", "High energy", "Slow", "Bitcoin"], c: "amber" },
              { t: "Proof of Stake", items: ["Energy efficient", "Scalable", "Central risk", "Ethereum 2.0"], c: "teal" }
            ],
            at: { 1: "col:0", 2: "col:1", 4: "all" }
          },
          say: [
            "Let's put them side by side.",
            "Proof of Work: very secure, but high energy use and slow processing. Think Bitcoin.",
            "Proof of Stake: energy efficient and scalable, but at risk of control by a few big holders.",
            "For organisations with sustainability goals, such as a health service aiming to cut its carbon footprint, energy matters.",
            "There is no single winner. Each organisation must weigh security, speed, energy and fairness for its own use."
          ]
        }
      ],
      keyPoint: "Proof of Work is very secure but uses lots of energy and is slow. Proof of Stake is energy efficient and scalable but risks control by a few large stakeholders.",
      plain: [
        "Consensus is how the network agrees on new blocks.",
        "Proof of Work: miners race to solve puzzles, using lots of energy.",
        "Proof of Stake: validators stake tokens and one is chosen, using little energy.",
        "Proof of Stake can drift towards a few powerful holders."
      ],
      check: {
        q: "Which is a key characteristic of Proof of Work blockchains?",
        o: ["Quick transaction times", "No consensus mechanism", "High energy consumption"],
        a: 2,
        e: "Proof of Work miners race to solve puzzles, which uses a great deal of energy.",
        retry: {
          q: "What is the main risk of Proof of Stake?",
          o: ["A few large stakeholders could dominate", "It uses more energy than Bitcoin", "It cannot create blocks"],
          a: 0,
          e: "If a few participants hold most of the stake, they can gain too much control."
        }
      },
      scenario: {
        title: "The green board meeting",
        setting: "Sam chairs the digital board at the fictional Lakeside Health Partnership, which has a net zero pledge. A supplier offers two blockchain platforms, one Proof of Work and one Proof of Stake.",
        steps: [
          {
            prompt: "Which concern should Sam raise first about the Proof of Work option?",
            choices: [
              { t: "Its high energy use clashes with the net zero pledge", s: 2, fb: "Right. Proof of Work's energy demand is its biggest sustainability problem." },
              { t: "It is not secure enough", s: 0, fb: "Proof of Work is actually very secure. Energy is the bigger issue." },
              { t: "It might be a little slow", s: 1, fb: "True, but for this board the energy use is the more pressing concern." }
            ]
          },
          {
            prompt: "Sam leans towards Proof of Stake. What should he check before deciding?",
            choices: [
              { t: "Nothing, Proof of Stake has no downsides", s: 0, fb: "Every model has trade-offs. Proof of Stake has a centralisation risk." },
              { t: "Whether a few validators hold most of the stake", s: 2, fb: "Well done. Spread-out stake keeps control fair and the network trustworthy." },
              { t: "Whether it is fast enough for their needs", s: 1, fb: "Worth checking, but the key risk of Proof of Stake is centralisation." }
            ]
          }
        ]
      },
      lab: "consensusLab"
    },

    // ---------------------------------------------------------------- Lesson 5
    {
      title: "Smart contracts: rules that run themselves",
      minutes: 3,
      scenes: [
        {
          scene: "contract",
          opts: { title: "Claims contract", rule: "IF treatment confirmed THEN pay claim", at: { 2: "input", 3: "run", 4: "pay" } },
          say: [
            "A smart contract is a small program stored on the blockchain that carries out an agreement by itself.",
            "Think of a vending machine. Put in the right coin and the snack drops out. No shopkeeper needed.",
            "Here a hospital sends in proof that a treatment took place.",
            "Watch the gears turn. The contract checks its rule: if treatment is confirmed, pay the claim.",
            "Out comes the payment to the hospital. No paperwork chase and no waiting for a clerk.",
            "This is an automated insurance claim, one of the clearest healthcare uses of smart contracts."
          ]
        },
        {
          scene: "contract",
          opts: { title: "Payout contract", rule: "IF claim valid THEN pay once", at: { 1: "input", 2: "reentrancy", 4: "fix" } },
          say: [
            "Smart contracts do exactly what the code says, even when the code is wrong.",
            "A request comes in for a payout.",
            "Watch closely. A coding mistake lets the payout repeat before the balance is updated. The vault drains.",
            "Because the contract runs by itself, nobody steps in to stop it. That is real financial loss.",
            "Here is the fix. The balance is updated first, so the second request is refused.",
            "So contracts must be carefully tested and checked before they go live."
          ]
        },
        {
          scene: "cards",
          opts: {
            title: "Smart contract uses",
            layout: "row",
            items: [
              { t: "Insurance claims", d: "Pay automatically when rules are met", c: "blue" },
              { t: "Supply chain", d: "Track medicines from maker to ward", c: "teal" },
              { t: "Medication adherence", d: "Reward doses taken on time", c: "green" }
            ]
          },
          say: [
            "Where else can smart contracts help in healthcare?",
            "Insurance claims, paid automatically once the agreed conditions are met.",
            "Supply chain management, recording each step as medicines move from the maker to the ward.",
            "And a medication adherence programme. Patients earn a reward for taking doses on time, and doctors can see progress.",
            "The benefit is automation and trust without a middleman. The risk is mistakes hidden in the code."
          ]
        }
      ],
      keyPoint: "Smart contracts are self-executing code that enforce an agreement automatically, such as paying an insurance claim. Because they run without human checks, a bug in the code can cause financial loss.",
      plain: [
        "A smart contract is code that carries out an agreement by itself.",
        "It works like a vending machine: right input, automatic result.",
        "Uses include insurance claims, supply chains and medication adherence rewards.",
        "Bugs in the code can lose real money, so testing matters."
      ],
      check: {
        q: "What best describes a smart contract?",
        o: ["A paper contract scanned onto a blockchain", "A lawyer who works online", "Self-executing code that enforces agreed rules"],
        a: 2,
        e: "A smart contract is code on the blockchain that carries out its rules automatically.",
        retry: {
          q: "Why is a bug in a smart contract especially dangerous?",
          o: ["It runs automatically, so mistakes can cause financial loss before anyone notices", "Bugs make the blockchain delete itself", "It is not dangerous, contracts can always be undone"],
          a: 0,
          e: "Smart contracts run without human checks, so a coding error can pay out wrongly or lose funds."
        }
      },
      scenario: {
        title: "The adherence reward",
        setting: "Leila manages a diabetes programme at the fictional Northgate Health Centre. She wants a smart contract that rewards patients for taking medication on time and lets doctors see progress.",
        steps: [
          {
            prompt: "Which rule makes the best starting point?",
            choices: [
              { t: "Pay every patient a reward each week, whatever happens", s: 0, fb: "With no condition, this is not linked to adherence at all." },
              { t: "IF a dose is recorded on time THEN add a reward point", s: 2, fb: "Clear and testable. The reward is tied directly to the behaviour you want." },
              { t: "IF the patient feels better THEN pay a reward", s: 1, fb: "Feeling better is hard to measure in code. The rule needs a clear, recordable condition." }
            ]
          },
          {
            prompt: "The developer wants to go live tomorrow without testing. What should Leila do?",
            choices: [
              { t: "Agree, code always does what you expect", s: 0, fb: "Code does what it says, not what you meant. Bugs can cause real losses." },
              { t: "Go live, but watch it closely for a week", s: 1, fb: "Monitoring helps, but money could be lost before anyone spots a bug." },
              { t: "Insist on testing with sample cases and an independent review first", s: 2, fb: "Exactly. Test cases and review catch mistakes before they cost money." }
            ]
          }
        ]
      },
      lab: "contractLab"
    },

    // ---------------------------------------------------------------- Lesson 6
    {
      title: "dApps, MediBlock and DeFi",
      minutes: 3,
      scenes: [
        {
          scene: "cards",
          opts: {
            title: "What is a dApp?",
            layout: "grid",
            items: [
              { t: "Decentralised", d: "Runs on a blockchain, not one server", c: "teal" },
              { t: "Open-source", d: "Its code is open to inspect", c: "blue" },
              { t: "Autonomous", d: "Runs by itself once deployed", c: "violet" },
              { t: "Smart contracts", d: "Contracts do the back-end work", c: "amber" }
            ]
          },
          say: [
            "A decentralised application, or dApp, is an app that runs on a blockchain instead of one company's server.",
            "It is decentralised, maintained by many participants rather than one owner.",
            "It is usually open-source, so anyone can inspect the code.",
            "It is autonomous, running by itself once it is set up.",
            "And smart contracts do its behind-the-scenes work. Examples include MedRec for health records, Uniswap for finance, and CryptoKitties for gaming."
          ]
        },
        {
          scene: "flow",
          opts: {
            reveal: "all",
            nodes: [
              { id: "pat", t: "Patient", c: "green", x: 0, y: 0 },
              { id: "doc", t: "Doctor", c: "green", x: 0, y: 1 },
              { id: "hosp", t: "Hospital", c: "green", x: 0, y: 2 },
              { id: "ins", t: "Insurance company", c: "green", x: 0, y: 3 },
              { id: "web", t: "Web interface", c: "blue", x: 2, y: 1 },
              { id: "sc", t: "Smart contracts", c: "amber", x: 3, y: 2 },
              { id: "bc", t: "Blockchain", c: "teal", x: 4, y: 1 }
            ],
            edges: [["pat", "web"], ["doc", "web"], ["hosp", "web"], ["ins", "web"], ["web", "sc"], ["sc", "bc"]],
            packets: [
              { beat: 2, path: ["doc", "web", "sc", "bc"], t: "Record update", c: "good" },
              { beat: 3, path: ["ins", "web", "sc", "bc"], t: "Claim", c: "good" }
            ]
          },
          say: [
            "Here is the architecture of MediBlock, a healthcare dApp.",
            "On the left are its users: patients, doctors, hospitals and insurance companies. They all use one web interface.",
            "Watch a doctor's record update travel through the web interface to the smart contracts, then onto the blockchain.",
            "An insurer's claim follows the same path. The smart contracts apply the rules for each request.",
            "This brings security and privacy, transparency through records that are, in practice, unchangeable, and interoperability, so data moves between systems with access control.",
            "Beyond healthcare, dApps cut out middlemen, resist censorship and are open to anyone online."
          ]
        },
        {
          scene: "cards",
          opts: {
            title: "DeFi ecosystem",
            layout: "hex",
            center: "DeFi",
            reveal: "all",
            items: [
              { t: "Asset management", c: "blue" },
              { t: "Yield farming", d: "Staking and liquidity", c: "green" },
              { t: "Insurance", c: "teal" },
              { t: "Stablecoins", c: "amber" },
              { t: "Oracles", d: "Bring outside data in", c: "violet" },
              { t: "Lending and borrowing", c: "blue" },
              { t: "Derivatives", c: "slate" },
              { t: "DEXs and AMMs", d: "Decentralised exchanges", c: "teal" }
            ],
            at: { 3: "focus:4" }
          },
          say: [
            "dApps also power Decentralised Finance, or DeFi, which offers financial services without a bank in the middle.",
            "The DeFi ecosystem includes asset management, lending and borrowing, insurance, stablecoins and derivatives.",
            "It also includes yield farming, staking and liquidity pools, plus decentralised exchanges and automated market makers.",
            "Oracles bring outside information, like prices, onto the blockchain, so they must be trustworthy.",
            "But dApps have downsides too. They can struggle to scale and are technically complex to build."
          ]
        }
      ],
      keyPoint: "A dApp is an open-source, autonomous app that runs on a blockchain with smart contracts as its back end, like MediBlock. dApps remove middlemen and add transparency, but face scalability limits and technical complexity.",
      plain: [
        "A dApp runs on a blockchain, not one company's server.",
        "MediBlock links patients, doctors, hospitals and insurers through smart contracts.",
        "DeFi is finance built from dApps, without banks in the middle.",
        "dApps can be hard to build and hard to scale."
      ],
      check: {
        q: "In the MediBlock architecture, what sits between the web interface and the blockchain?",
        o: ["A central database", "Smart contracts", "The insurance company"],
        a: 1,
        e: "Users reach MediBlock through a web interface; smart contracts then apply the rules and write to the blockchain.",
        retry: {
          q: "Which is a known disadvantage of dApps?",
          o: ["They always need a middleman", "They cannot store any health data", "Scalability issues and technical complexity"],
          a: 2,
          e: "dApps remove intermediaries, but they can be hard to scale and complex to develop."
        }
      },
      scenario: {
        title: "A dApp for research data",
        setting: "Dr Chen leads research at the fictional Eastfield University Hospital. Three institutions want a dApp to share research data securely. She must sketch the design.",
        steps: [
          {
            prompt: "Which design fits a dApp best?",
            choices: [
              { t: "A web interface with smart contracts on a shared blockchain controlling access", s: 2, fb: "Right. That mirrors the MediBlock pattern: interface, contracts, blockchain." },
              { t: "One central server owned by Eastfield that the others log into", s: 0, fb: "That is a normal centralised app, not a dApp." },
              { t: "A shared spreadsheet with a password", s: 1, fb: "Simple, but it gives no tamper-evidence or automatic access rules." }
            ]
          },
          {
            prompt: "A partner worries the dApp may be slow with lots of users. How should Dr Chen respond?",
            choices: [
              { t: "Say dApps never have speed problems", s: 0, fb: "Scalability is a known weakness of dApps." },
              { t: "Agree it is a real risk and plan load testing and careful design early", s: 2, fb: "Well judged. Being honest about scalability lets the team plan for it." },
              { t: "Drop the project straight away", s: 1, fb: "Too hasty. The risk can be planned for rather than avoided entirely." }
            ]
          }
        ]
      }
    }
  ],

  test: [
    {
      q: "A regional group of hospitals must keep patient data within approved members and meet data protection law. Which blockchain type is the best fit?",
      o: ["Public", "Consortium", "Any type, it makes no difference", "A public chain with no rules"],
      a: 1,
      e: "A consortium, permissioned blockchain lets known members share control while keeping outsiders out.",
      lesson: 0
    },
    {
      q: "An auditor recomputes the hash of a stored prescription and gets a different result. What does this show?",
      o: ["The prescription was changed after it was recorded", "The hash function is random", "The patient has been discharged", "The block is now encrypted"],
      a: 0,
      e: "The same data always gives the same hash. A different hash means the data changed.",
      lesson: 1
    },
    {
      q: "Why is hashing a short, predictable patient number not enough to keep it secret?",
      o: ["Hashes get longer with short inputs", "Hashes can be reversed with the public key", "An attacker can try every possible number until one matches", "Short inputs cannot be hashed"],
      a: 2,
      e: "Hash functions can be vulnerable to brute force when the inputs are easy to guess.",
      lesson: 1
    },
    {
      q: "A doctor signs a record update. How does the verifier confirm it really came from her?",
      o: ["By asking her password", "By checking the signature with her public key", "By using her private key", "By reading the hash aloud"],
      a: 1,
      e: "The private key signs; anyone can check the signature with the matching public key.",
      lesson: 2
    },
    {
      q: "A clinician's private key is copied by an intruder. What is the main danger?",
      o: ["The intruder can sign updates as if they were the clinician", "The blockchain stops working", "The public key becomes private", "Nothing, keys cannot be misused"],
      a: 0,
      e: "Private key mismanagement can lead to fake signatures and data loss.",
      lesson: 2
    },
    {
      q: "A health board with a net zero pledge is choosing a consensus mechanism. Which concern points them away from Proof of Work?",
      o: ["It is too easy to tamper with", "It has no rewards", "It cannot be used by Bitcoin", "Its high energy consumption"],
      a: 3,
      e: "Proof of Work is very secure but uses large amounts of energy.",
      lesson: 3
    },
    {
      q: "In a Proof of Stake network, three organisations hold nearly all the staked tokens. What risk is this?",
      o: ["Too much energy use", "Centralisation of control", "Mining puzzles become too hard", "Hashes stop working"],
      a: 1,
      e: "Proof of Stake risks centralisation when a few participants hold large stakes.",
      lesson: 3
    },
    {
      q: "An insurer wants claims paid automatically once treatment is confirmed. Which technology fits?",
      o: ["A hash function", "A public key", "A smart contract", "A mining puzzle"],
      a: 2,
      e: "Smart contracts are self-executing code that can pay a claim when agreed conditions are met.",
      lesson: 4
    },
    {
      q: "A bug in a live payout contract lets the same claim be paid twice. Why is this so serious?",
      o: ["The contract runs automatically, so money can be lost before anyone intervenes", "It only affects the web page", "Smart contracts can always be reversed by the bank", "It slows down mining"],
      a: 0,
      e: "Vulnerabilities in smart contract code can lead to financial loss.",
      lesson: 4
    },
    {
      q: "In the MediBlock dApp, how does an insurance company's claim reach the blockchain?",
      o: ["Directly by email to each node", "Through a central bank", "Through the web interface and then smart contracts", "It is posted by a doctor"],
      a: 2,
      e: "All users reach MediBlock through a web interface; smart contracts apply the rules and write to the blockchain.",
      lesson: 5
    }
  ],

  sources: [
    "Slide deck: Chapter 2, Core Blockchain Technologies (types of blockchain, cryptography, Figures 2.2 to 2.6, Key Points table, Exercises)",
    "Instructor resources: Chapter 2, Core Blockchain Technologies and Applications (PoW vs PoS case study, MCQs, Hyperledger lab, video tutorial topics)"
  ]
};
