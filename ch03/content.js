window.CH = {
  id: "ch03",
  num: "3",
  title: "ICT, Blockchain, IoT, Cloud, and AI in Healthcare",
  summary: "How information technology, blockchain, connected devices, the cloud and artificial intelligence come together to change the way healthcare is organised and delivered.",
  outcomes: [
    "Describe the four levels of healthcare: primary, secondary, tertiary and quaternary.",
    "Explain the problems of 1990s paper-based healthcare and why electronic health records matter.",
    "Read the trend chart from 2000 to 2024 and say which technologies grew and when.",
    "Explain how blockchain keeps shared patient data secure and trustworthy.",
    "Show how IoT, the cloud, AI and blockchain each play a part in a telemedicine service.",
    "Compare Smart Healthcare 4.0 with Smart Healthcare 5.0."
  ],
  starter: [
    {
      q: "You feel unwell and book an appointment with your family doctor. Which level of care is this?",
      o: ["Tertiary care", "Primary care", "Quaternary care"],
      a: 1
    },
    {
      q: "What does an electronic health record, or EHR, replace?",
      o: ["Paper patient notes kept in folders", "Hospital buildings", "Doctors' training"],
      a: 0
    },
    {
      q: "A smartwatch that sends your heart rate to your care team is an example of what?",
      o: ["A blockchain", "A paper record", "An Internet of Things device"],
      a: 2
    }
  ],
  lessons: [
    /* ---------------- Lesson 1 ---------------- */
    {
      title: "The four floors of healthcare",
      minutes: 3,
      scenes: [
        {
          scene: "title",
          opts: {
            kicker: "Chapter 3",
            title: "ICT, Blockchain, IoT, Cloud & AI",
            subtitle: "Technologies converging in modern healthcare"
          },
          say: [
            "Welcome to Chapter 3, ICT, Blockchain, IoT, Cloud, and AI in Healthcare. I'm Maya, your tutor.",
            "ICT stands for information and communication technology. It simply means the computers and networks that move information around.",
            "In this chapter we see how several technologies join forces to support patients and staff.",
            "Before the technology, though, we need a map of healthcare itself. So let's start with how care is organised."
          ]
        },
        {
          scene: "stack",
          opts: {
            title: "Levels of care",
            layers: [
              { t: "Primary care", d: "First contact: GPs", c: "green" },
              { t: "Secondary care", d: "Specific diagnosis and treatment", c: "teal" },
              { t: "Tertiary care", d: "Highly specialised hospitals", c: "blue" },
              { t: "Quaternary care", d: "Advanced and experimental treatment", c: "violet" }
            ],
            at: { 5: "focus:0" }
          },
          say: [
            "Think of healthcare as a building with four floors. Each floor offers more specialised care than the one below.",
            "Here comes the ground floor, primary care. This is your first contact, such as your GP, which means general practitioner.",
            "Next, secondary care. These are specific diagnostic and treatment services, like a hospital clinic your GP refers you to.",
            "Above it sits tertiary care. This is highly specialised care, often given in specialist hospitals.",
            "On the top floor is quaternary care. It extends tertiary care with advanced and experimental treatments.",
            "Notice the ground floor glowing. Primary care is the first point of contact, and the doorway to every other floor."
          ]
        },
        {
          scene: "flow",
          opts: {
            nodes: [
              { id: "gp", t: "GP surgery", c: "green", x: 0, y: 2 },
              { id: "hosp", t: "Hospital clinic", c: "teal", x: 1, y: 1 },
              { id: "spec", t: "Specialist centre", c: "blue", x: 3, y: 1 },
              { id: "adv", t: "Advanced treatment", c: "violet", x: 4, y: 0 }
            ],
            edges: [["gp", "hosp", "Referral"], ["hosp", "spec", "Referral"], ["spec", "adv", "If needed"]],
            packets: [
              { beat: 2, path: ["gp", "hosp", "spec"], t: "Patient record", c: "good" },
              { beat: 4, path: ["gp", "hosp", "spec", "adv"], t: "Patient record", c: "good" }
            ],
            reveal: "all"
          },
          say: [
            "Patients move up the floors through referrals. Here are the four levels laid out as a journey.",
            "A patient starts at the GP surgery, then may be referred to a hospital clinic, then a specialist centre.",
            "Watch the glowing packet. That is the patient's record travelling with them from one place to the next.",
            "Every handover is a moment when information can be lost, delayed or copied wrongly.",
            "A few patients go all the way to advanced treatment, and their record must follow them there too.",
            "That is why the technologies in this chapter matter. They help information move safely between every level of care."
          ]
        }
      ],
      keyPoint: "Healthcare is organised in four levels: primary, secondary, tertiary and quaternary. Patients move between them by referral, so their information must move safely too.",
      plain: [
        "Primary care is first contact, such as your GP.",
        "Secondary care gives specific tests and treatments, often in hospital.",
        "Tertiary care is highly specialised; quaternary care adds advanced and experimental treatment.",
        "Each referral hands over information, which technology must keep safe and accurate."
      ],
      check: {
        q: "A patient is referred to a specialist hospital for highly specialised heart surgery. Which level of care is this?",
        o: ["Primary care", "Tertiary care", "Secondary care"],
        a: 1,
        e: "Highly specialised care, often in specialised hospitals, is tertiary care.",
        retry: {
          q: "A patient joins a hospital programme offering an experimental treatment. Which level of care is this?",
          o: ["Quaternary care", "Primary care", "Secondary care"],
          a: 0,
          e: "Quaternary care extends tertiary care with advanced and experimental treatments."
        }
      },
      scenario: {
        title: "The right floor for Mrs Patel",
        setting: "Ruth Adeyemi is a district nurse with Meadowvale Community Nursing. She visits Mrs Patel at home to dress a leg wound. Today the wound looks worse and Mrs Patel has a fever.",
        steps: [
          {
            prompt: "What should Ruth do first?",
            choices: [
              { t: "Book Mrs Patel straight into an experimental treatment programme.", s: 0, fb: "Experimental treatment is quaternary care. It is far too big a step for a first problem with a wound." },
              { t: "Contact Mrs Patel's GP practice and share her wound notes and temperature.", s: 2, fb: "Good. Primary care is the first point of contact, and the GP can decide on any referral." },
              { t: "Ask Mrs Patel to phone her GP surgery herself later today.", s: 1, fb: "The GP is the right place, but a worsening wound with fever is urgent. Ruth should pass on her notes and observations herself, now." }
            ]
          },
          {
            prompt: "The GP refers Mrs Patel to the hospital wound clinic. How should her information travel?",
            choices: [
              { t: "Mrs Patel carries a handwritten note from the nurse.", s: 1, fb: "It might work, but paper notes get lost and the clinic cannot see her full history." },
              { t: "The clinic can start from scratch with a new history.", s: 0, fb: "Starting from scratch wastes time and risks missing important details such as allergies." },
              { t: "Through her electronic record, shared securely with the hospital team.", s: 2, fb: "Yes. Secondary care works best when the record moves with the patient safely and quickly." }
            ]
          }
        ]
      },
      lab: "careLevelLab"
    },

    /* ---------------- Lesson 2 ---------------- */
    {
      title: "From paper folders to digital records",
      minutes: 3,
      scenes: [
        {
          scene: "cards",
          opts: {
            title: "Healthcare in the 1990s",
            items: [
              { t: "Paper records", d: "Notes kept in folders", c: "amber" },
              { t: "No interoperability", d: "Systems could not share data", c: "red" },
              { t: "Manual processes", d: "Done by hand, step by step", c: "amber" },
              { t: "Limited analytics", d: "Little use of data for insight", c: "slate" },
              { t: "Slow and inefficient", d: "Time-consuming for staff", c: "red" }
            ],
            layout: "grid"
          },
          say: [
            "Let's travel back to healthcare in the 1990s. Five big challenges are about to appear.",
            "First, paper-based records. Patient notes lived in folders that could be lost, misfiled or stuck in another building.",
            "Second, a lack of interoperability. That means different systems could not talk to each other or share data.",
            "Third, manual processes. Booking, filing and ordering were done by hand, one step at a time.",
            "Fourth, limited data analytics. It was hard to look across many records to spot patterns.",
            "And fifth, the result of all this. Care was time-consuming and inefficient for patients and staff alike."
          ]
        },
        {
          scene: "chart",
          opts: {
            title: "Tech impact 2000-2024",
            years: [2000, 2010, 2020, 2024],
            series: [
              { name: "EHR adoption", values: [25, 50, 95, 100], c: "teal" },
              { name: "IoT", values: [10, 20, 30, 40], c: "blue" },
              { name: "AI", values: [10, 20, 30, 50], c: "violet" },
              { name: "Blockchain", values: [0, 0, 0, 20], c: "amber" }
            ],
            note: "Relative adoption index from Figure 3.4, no units",
            at: { 1: "series:0", 3: "series:1", 4: "series:2", 5: "series:3" }
          },
          say: [
            "This chart is based on Figure 3.4 in the chapter. It shows how four technologies grew from the year two thousand to twenty twenty-four.",
            "The teal line is the adoption of electronic health records. It climbs from twenty-five to fifty, then ninety-five, then one hundred.",
            "These numbers are a relative adoption index taken from the figure. They have no units, so do not read them as percentages.",
            "Here comes the Internet of Things, or IoT, in blue. It rises steadily from ten to forty.",
            "Artificial intelligence, or AI, in violet, follows a similar path, then jumps to fifty by twenty twenty-four.",
            "Finally blockchain, in amber. It sits at zero until twenty twenty, and only appears by twenty twenty-four, at twenty.",
            "So electronic records rose fastest and came first. The newer technologies are building on top of that digital foundation."
          ]
        },
        {
          scene: "cards",
          opts: {
            title: "Role of ICT",
            items: [
              { t: "Data management", d: "Store, find and share information", c: "blue" },
              { t: "EHRs", d: "One digital record per patient", c: "teal" },
              { t: "Global access", d: "Records available where needed", c: "green" }
            ],
            layout: "row",
            center: "ICT"
          },
          say: [
            "So what does information and communication technology actually do for healthcare?",
            "First, it manages data. It stores, finds and shares information much faster than paper ever could.",
            "Second, it makes electronic health records possible. An electronic health record, or EHR, is a digital version of a patient's notes.",
            "Third, EHRs allow patient data to be reached wherever it is needed, even across the world, by people with permission.",
            "Every tile here answers a 1990s problem. Faster records, data that can be shared, and less work by hand."
          ]
        }
      ],
      keyPoint: "In the 1990s healthcare relied on paper, manual work and systems that could not share data. ICT and electronic health records changed this, and EHR adoption grew fastest of the technologies in Figure 3.4.",
      plain: [
        "1990s care used paper records and manual processes, so it was slow.",
        "Systems could not share data, and there was little data analysis.",
        "Figure 3.4 shows EHRs rising fastest; blockchain only appears by 2024.",
        "EHRs are the digital foundation that IoT, AI and blockchain build on."
      ],
      check: {
        q: "In Figure 3.4, which technology rises fastest and reaches the top of the index first?",
        o: ["Blockchain", "Internet of Things", "Electronic health record adoption"],
        a: 2,
        e: "EHR adoption climbs from 25 to 100 on the chart's index, faster than any other line.",
        retry: {
          q: "What does Figure 3.4 show about blockchain?",
          o: ["It only appears by 2024", "It was the first technology adopted", "It grew faster than EHRs"],
          a: 0,
          e: "Blockchain stays at zero until 2020 and only appears by 2024, at 20 on the chart's unitless index."
        }
      },
      scenario: {
        title: "The lost referral letter",
        setting: "Sam Okoro is the practice manager at Willowbrook Surgery. A patient complains that a hospital never received her referral. The surgery still faxes and posts many letters, and staff retype details by hand.",
        steps: [
          {
            prompt: "What is the root problem Sam should report to the partners?",
            choices: [
              { t: "Staff are not working hard enough.", s: 0, fb: "Blaming staff misses the point. The process itself is manual and fragile." },
              { t: "Paper and manual processes, with systems that cannot share data.", s: 2, fb: "Exactly. These are the classic 1990s challenges: paper records, manual work and no interoperability." },
              { t: "The fax machine is old and should be replaced.", s: 1, fb: "A new fax machine might help a little, but the information would still be on paper and retyped by hand." }
            ]
          },
          {
            prompt: "Which change would help most?",
            choices: [
              { t: "Send referrals electronically from the patient's EHR to the hospital system.", s: 2, fb: "Yes. Electronic records shared between systems remove retyping and lost letters." },
              { t: "Print two copies of every letter just in case.", s: 0, fb: "More paper means more to file and lose. It does not fix the sharing problem." },
              { t: "Scan letters into a folder on the surgery computer.", s: 1, fb: "Scanning is a start, but the hospital still cannot see the information unless the systems can share it." }
            ]
          }
        ]
      }
    },

    /* ---------------- Lesson 3 ---------------- */
    {
      title: "Applications and blockchain security",
      minutes: 3,
      scenes: [
        {
          scene: "cards",
          opts: {
            title: "Figure 3.5",
            items: [
              { t: "Home care", d: "Care delivered in the patient's home", c: "green" },
              { t: "Imaging technology", d: "Scans and X-rays", c: "blue" },
              { t: "Predictive analytics", d: "Spotting risks early from data", c: "violet" },
              { t: "Global EHR", d: "Records reachable worldwide", c: "teal" },
              { t: "Pharmaceuticals", d: "Medicines and their supply", c: "amber" },
              { t: "Wearables", d: "Devices worn on the body", c: "teal" }
            ],
            layout: "hex",
            center: "Emerging tech"
          },
          say: [
            "Emerging technologies power many healthcare applications. Here are six from Figure 3.5, arranged like a honeycomb.",
            "Home care. Patients can be supported and monitored in their own homes.",
            "Imaging technology. Scans and X-rays can be shared and analysed digitally.",
            "Predictive analytics. This means using past data to spot who may become ill, so care can start earlier.",
            "A global electronic health record. A patient's record can be reached wherever they are treated.",
            "Pharmaceuticals. Medicines can be tracked from the factory to the pharmacy shelf.",
            "And wearables, such as smartwatches, which measure the body all day long."
          ]
        },
        {
          scene: "network",
          opts: {
            n: 10,
            at: { 0: "hub", 2: "mesh", 3: "ledger", 4: "vote", 5: "packets" }
          },
          say: [
            "Now, how do we keep shared health data secure? Here is the old way: one central server, like a single records room.",
            "If that one room is broken into or goes down, every record is at risk at once.",
            "Watch the network change. Now the computers connect to each other directly. This is decentralised data control.",
            "Each computer, or node, now holds its own copy of the ledger, the shared record book.",
            "See them flash green. Entries are added only when nodes agree, so old records become, in practice, immutable: very hard to change unnoticed.",
            "Now packets of patient data travel between a GP, a hospital and a pharmacy. Each share leaves a trusted trail."
          ]
        },
        {
          scene: "cards",
          opts: {
            title: "Blockchain benefits",
            items: [
              { t: "Medicine supply chain", d: "Track medicines step by step", c: "amber" },
              { t: "Fight counterfeits", d: "Spot fake medicines", c: "red" },
              { t: "Interoperability", d: "Organisations share data safely", c: "teal" },
              { t: "Patient data sharing", d: "Up-to-date records, with consent", c: "green" }
            ],
            layout: "grid"
          },
          say: [
            "The chapter's answers point to several benefits of blockchain in healthcare.",
            "In the medicine supply chain, every handover is recorded, so a medicine's journey can be checked.",
            "That helps combat counterfeit medicines, because a fake has no trusted history on the ledger.",
            "It improves interoperability, so different healthcare organisations can share records they can all trust.",
            "And it supports patient data sharing, giving access to up-to-date records while helping to prevent data leaks."
          ]
        }
      ],
      keyPoint: "Emerging technologies power applications from home care to wearables. Blockchain secures shared health data with immutable records and decentralised control, and helps track medicines and fight counterfeits.",
      plain: [
        "Figure 3.5 shows six applications: home care, imaging, predictive analytics, global EHR, pharmaceuticals and wearables.",
        "Blockchain replaces one central store with many shared copies.",
        "Once the network agrees on records, they are very hard to change secretly.",
        "Benefits include tracking medicines, fighting counterfeits and sharing records between organisations."
      ],
      check: {
        q: "Why does blockchain make patient records hard to change secretly?",
        o: ["Many nodes hold copies and must agree on new entries", "The records are printed on paper", "Only one central server stores them"],
        a: 0,
        e: "Decentralised copies plus agreement between nodes make the records, in practice, immutable.",
        retry: {
          q: "How can blockchain help with counterfeit medicines?",
          o: ["By making medicines cheaper", "By recording each step of a medicine's journey so fakes have no trusted history", "By replacing pharmacists"],
          a: 1,
          e: "Recording the supply chain on a shared ledger lets anyone check where a medicine has come from."
        }
      },
      scenario: {
        title: "Sharing records across three organisations",
        setting: "Daniel Mensah is chief information officer, or CIO, at Riverside Health Trust. The trust wants to share patient records safely with local GP surgeries and community pharmacies. Each organisation uses a different system.",
        steps: [
          {
            prompt: "What is Daniel's main concern with one big shared central database?",
            choices: [
              { t: "It would be too easy for patients to see their own records.", s: 0, fb: "Patients seeing their records is generally a good thing. That is not the risk here." },
              { t: "It might cost more to run than three separate systems.", s: 1, fb: "Cost matters, but the bigger issue is a single point of failure and a single target for attack." },
              { t: "It is a single point of failure, and one breach exposes everyone.", s: 2, fb: "Right. Decentralised control removes the single weak point." }
            ]
          },
          {
            prompt: "Daniel proposes a blockchain ledger. What should it mainly do?",
            choices: [
              { t: "Keep a tamper-evident shared record of who shared and accessed data.", s: 2, fb: "Yes. Shared records that are very hard to alter build trust and support interoperability between organisations." },
              { t: "Replace every existing clinical system overnight.", s: 0, fb: "Blockchain works alongside existing systems. Replacing everything at once is risky and unnecessary." },
              { t: "Store every full patient record on the ledger itself.", s: 1, fb: "Partly. The ledger should build trust, but full records on a shared chain raise privacy and speed problems. Keep records off-chain and put their hashes on it." }
            ]
          }
        ]
      }
    },

    /* ---------------- Lesson 4 ---------------- */
    {
      title: "Wearables, AI and telemedicine",
      minutes: 3,
      scenes: [
        {
          scene: "cards",
          opts: {
            title: "IoT in monitoring",
            items: [
              { t: "Smartwatch", d: "Heart rate and rhythm", c: "teal" },
              { t: "Glucose sensor", d: "Blood sugar for diabetes", c: "blue" },
              { t: "Blood pressure cuff", d: "Readings sent from home", c: "violet" },
              { t: "Early warning", d: "Spot problems before a crisis", c: "green" }
            ],
            layout: "ring",
            center: "Patient"
          },
          say: [
            "The Internet of Things, or IoT, means everyday devices connected to the internet so they can send data.",
            "A smartwatch can track heart rate and rhythm around the clock.",
            "A glucose sensor can measure blood sugar for someone with diabetes.",
            "A blood pressure cuff at home can send readings straight to the care team.",
            "Together they give real-time monitoring. That supports early intervention in chronic, or long-term, conditions, before a small problem becomes a crisis."
          ]
        },
        {
          scene: "scale",
          opts: {
            left: "AI speed",
            right: "Clinician judgement",
            at: { 1: "tilt-left", 3: "tilt-right", 5: "balance" }
          },
          say: [
            "All that data needs reading. This is where artificial intelligence, or AI, comes in, supporting personalised medicine.",
            "Watch the scale tip towards AI. It can scan huge amounts of data quickly, supporting diagnostics, which means working out what is wrong.",
            "It also offers predictive analytics, spotting patterns that suggest who may become unwell next.",
            "But now the scale tips the other way. A clinician brings judgement, context and care that a machine cannot.",
            "Personalised medicine means treatment fitted to the individual patient, using their own data.",
            "Now it balances. That is human-machine collaboration: AI suggests, and the clinician decides with the patient."
          ]
        },
        {
          scene: "flow",
          opts: {
            nodes: [
              { id: "wear", t: "Wearable (IoT)", c: "teal", x: 0, y: 1 },
              { id: "cloud", t: "Cloud", c: "blue", x: 1, y: 1 },
              { id: "ai", t: "AI analysis", c: "violet", x: 2, y: 1 },
              { id: "bc", t: "Blockchain", c: "amber", x: 3, y: 1 },
              { id: "team", t: "Care team", c: "green", x: 4, y: 0 },
              { id: "unk", t: "Unknown app", c: "red", x: 4, y: 3 }
            ],
            edges: [
              ["wear", "cloud", "Readings"],
              ["cloud", "ai", "Data"],
              ["ai", "bc", "Insight"],
              ["bc", "team", "Access granted"],
              ["unk", "bc", "Access request"]
            ],
            packets: [
              { beat: 1, path: ["wear", "cloud"], t: "Heart data", c: "good" },
              { beat: 2, path: ["cloud", "ai"], t: "Heart data", c: "good" },
              { beat: 3, path: ["ai", "bc"], t: "Risk alert", c: "good" },
              { beat: 4, path: ["bc", "team"], t: "Risk alert", c: "good" },
              { beat: 5, path: ["unk", "bc"], t: "Denied", c: "bad" }
            ],
            reveal: "all"
          },
          say: [
            "Here is the telemedicine case study from the chapter. Telemedicine means care delivered at a distance, using technology.",
            "Watch the first packet. The wearable, an IoT device, collects real-time heart data from the patient at home.",
            "The data travels to the cloud. That means remote computers in a data centre, which store the data and process it.",
            "AI analyses the readings and spots a worrying pattern. It sends a risk alert.",
            "Blockchain secures the data and controls access. Only authorised staff, here the care team, are let through.",
            "See the red packet. An unknown app asks for the data, and blockchain refuses it.",
            "So IoT collects, AI analyses, and blockchain secures and controls access. Together they build trust and protect patient privacy."
          ]
        }
      ],
      keyPoint: "IoT wearables give real-time monitoring and early intervention. AI supports diagnosis and prediction alongside clinicians. In telemedicine, IoT collects, the cloud stores, AI analyses and blockchain secures and controls access.",
      plain: [
        "IoT devices such as wearables send health readings in real time.",
        "Real-time data allows early action in long-term conditions.",
        "AI helps with diagnosis and prediction, but clinicians make the final decision.",
        "In telemedicine: IoT collects, AI analyses, blockchain secures and controls who sees the data."
      ],
      check: {
        q: "In the telemedicine case study, what is blockchain's main job?",
        o: ["Measuring the patient's heart rate", "Securing the data and making sure only authorised people can access it", "Diagnosing the illness"],
        a: 1,
        e: "IoT collects, AI analyses, and blockchain secures the data and controls access.",
        retry: {
          q: "Which technology collects the real-time health readings?",
          o: ["Blockchain", "AI", "IoT devices such as wearables"],
          a: 2,
          e: "IoT devices such as wearables collect the data; AI then analyses it."
        }
      },
      scenario: {
        title: "Tom's smartwatch alert",
        setting: "Tom Hughes lives with a long-term heart condition. He uses a smartwatch linked to the Harbourside Telehealth service. One evening his watch shows an alert about an unusual heart rhythm.",
        steps: [
          {
            prompt: "What should happen next?",
            choices: [
              { t: "The AI should change Tom's medication automatically.", s: 0, fb: "AI supports decisions; it should not change treatment on its own. A clinician must be involved." },
              { t: "Tom should rest and recheck the reading before anything else happens.", s: 1, fb: "Rechecking is sensible, as devices can give false alarms, but the alert should still reach his care team so a clinician can review it." },
              { t: "The alert reaches Tom's care team, who review it and contact him.", s: 2, fb: "Good. Human-machine collaboration: AI flags, a clinician decides." }
            ]
          },
          {
            prompt: "Tom worries about who can see his heart data. What reassures him most?",
            choices: [
              { t: "Access is controlled and logged, so only his authorised care team can see it.", s: 2, fb: "Yes. Blockchain-based access control keeps a trustworthy record of who views his data." },
              { t: "The data is stored in the cloud, so it must be safe.", s: 1, fb: "The cloud stores data, but storage alone does not decide who is allowed to see it." },
              { t: "Anyone with the app can see it, which keeps things open.", s: 0, fb: "Open access would put his privacy at risk. Only authorised people should see health data." }
            ]
          }
        ]
      },
      lab: "telemedLab"
    },

    /* ---------------- Lesson 5 ---------------- */
    {
      title: "Joining it all up: towards Healthcare 5.0",
      minutes: 3,
      scenes: [
        {
          scene: "stack",
          opts: {
            title: "Architectural view",
            layers: [
              { t: "Blockchain layer", d: "Hyperledger Fabric: trusted records", c: "amber" },
              { t: "SDN control plane", d: "Software steers network traffic", c: "violet" },
              { t: "Edge-cloud interface", d: "Near the patient, plus the cloud", c: "blue" },
              { t: "6G network layer", d: "Next-generation mobile network", c: "teal" }
            ],
            at: { 6: "focus:0" }
          },
          say: [
            "How do all these technologies fit together? The chapter shows an architectural view, built like floors of a building.",
            "At the foundation is the blockchain layer, built on Hyperledger Fabric. This is a permissioned blockchain, where only approved organisations take part.",
            "Above it, the SDN control plane. SDN means software-defined networking: software acts like a traffic controller, directing data around the network.",
            "Next, the edge-cloud interface. The edge means computers close to the patient, like on a ward. The cloud is the big data centre.",
            "On top sits the 6G network layer. 6G is the next generation of mobile networks after 5G, still being developed.",
            "Back in the SDN layer, network jobs such as firewalls can run as software, called virtual network functions.",
            "Watch the foundation glow. Whatever travels through the upper layers, the blockchain keeps a trusted record underneath."
          ]
        },
        {
          scene: "compare",
          opts: {
            cols: [
              { t: "Smart Healthcare 4.0", items: ["IoT", "AI", "Cloud", "Automation"], c: "blue" },
              { t: "Smart Healthcare 5.0", items: ["Personalised medicine", "Human-AI collaboration", "Patient engagement", "Ethical AI"], c: "green" }
            ],
            at: { 1: "col:0", 3: "col:1", 5: "all" }
          },
          say: [
            "Finally, let's see how smart healthcare is evolving, from version 4.0 to version 5.0.",
            "Here is Smart Healthcare 4.0. Its theme is technology and automation, using IoT, AI, the cloud and automated processes.",
            "It made care faster and more efficient, but the focus was mainly on the machines.",
            "Now Smart Healthcare 5.0 rises. Its theme is human-machine collaboration.",
            "It brings personalised medicine, humans and AI working together, patients taking an active part, and ethical AI that is fair and trustworthy.",
            "Side by side, the message is clear. Version 5.0 keeps the technology, but puts people back at the centre for more personalised and empathetic care."
          ]
        }
      ],
      keyPoint: "An interconnected architecture links a 6G network, edge and cloud computing, software-defined networking and a Hyperledger Fabric blockchain. Smart Healthcare 4.0 focused on technology and automation; 5.0 adds human-machine collaboration, personalisation and ethical AI.",
      plain: [
        "From top to bottom: 6G network, edge-cloud interface, SDN control plane, blockchain layer.",
        "Hyperledger Fabric is a permissioned blockchain for approved organisations.",
        "Smart Healthcare 4.0 is about technology and automation.",
        "Smart Healthcare 5.0 is about people and machines working together, ethically."
      ],
      check: {
        q: "What is the main difference between Smart Healthcare 4.0 and 5.0?",
        o: ["5.0 removes AI from healthcare", "4.0 focuses on technology and automation; 5.0 on human-machine collaboration", "4.0 uses blockchain and 5.0 uses paper records"],
        a: 1,
        e: "4.0 is technology and automation. 5.0 adds human-machine collaboration, personalised medicine, patient engagement and ethical AI.",
        retry: {
          q: "In the architectural view, which layer keeps a trusted record using Hyperledger Fabric?",
          o: ["The 6G network layer", "The edge-cloud interface", "The blockchain layer"],
          a: 2,
          e: "The blockchain layer, built on Hyperledger Fabric, sits at the foundation of the architecture."
        }
      },
      scenario: {
        title: "Planning the next five years",
        setting: "Daniel Mensah, CIO at Riverside Health Trust, is writing the trust's digital plan. The board has already rolled out IoT monitoring and automated booking. Now they ask what comes next.",
        steps: [
          {
            prompt: "Which direction fits Smart Healthcare 5.0?",
            choices: [
              { t: "Automate as many clinical decisions as possible and reduce staff contact.", s: 0, fb: "That pushes harder on automation, which is the 4.0 mindset. 5.0 puts people at the centre." },
              { t: "Add more sensors everywhere, without changing how staff use the data.", s: 1, fb: "More data can help, but 5.0 is about how humans and AI work together with patients." },
              { t: "Use AI to support clinicians, involve patients in their own data, and check AI is fair.", s: 2, fb: "Exactly. Human-AI collaboration, patient engagement and ethical AI are the heart of 5.0." }
            ]
          },
          {
            prompt: "A board member asks why the plan includes a blockchain layer. What does Daniel say?",
            choices: [
              { t: "It gives a trusted, shared record of data and access across the connected services.", s: 2, fb: "Yes. In the architecture, the blockchain layer underpins trust for everything above it." },
              { t: "It replaces the need for a fast network.", s: 0, fb: "Blockchain does not replace networking. The architecture has separate network and edge-cloud layers." },
              { t: "It records who accessed data, which helps with audits.", s: 1, fb: "True, and that is part of it. More broadly, it gives a trusted, tamper-resistant record that underpins every layer above." }
            ]
          }
        ]
      }
    }
  ],

  test: [
    {
      q: "A woman books an appointment with her GP about a persistent cough. Which level of care is she using?",
      o: ["Primary care", "Secondary care", "Tertiary care", "Quaternary care"],
      a: 0,
      e: "First-contact services such as GPs are primary care.",
      lesson: 0
    },
    {
      q: "A patient is offered an advanced, experimental treatment that extends specialist hospital care. Which level is this?",
      o: ["Secondary care", "Primary care", "Quaternary care", "Tertiary care"],
      a: 2,
      e: "Quaternary care is an extension of tertiary care providing advanced and experimental treatments.",
      lesson: 0
    },
    {
      q: "A 1990s clinic cannot send test results to the hospital because their computer systems cannot exchange data. Which challenge is this?",
      o: ["Limited data analytics", "Lack of interoperability", "Paper-based records"],
      a: 1,
      e: "Interoperability means systems can share and use each other's data. Its absence was a key 1990s challenge.",
      lesson: 1
    },
    {
      q: "Looking at Figure 3.4, which statement is correct?",
      o: ["Blockchain was widely adopted by 2000", "IoT rises faster than EHR adoption", "EHR adoption rises fastest, and blockchain only appears by 2024", "AI falls between 2020 and 2024"],
      a: 2,
      e: "On the chart's unitless index, EHRs climb from 25 to 100, while blockchain is zero until it appears at 20 in 2024.",
      lesson: 1
    },
    {
      q: "A pharmacy chain wants to prove each medicine is genuine and trace its journey from the factory. Which technology helps most?",
      o: ["Blockchain, recording each step of the supply chain", "A paper delivery note", "A wearable sensor"],
      a: 0,
      e: "Blockchain helps monitor the pharmaceutical supply chain and combat counterfeit medicines.",
      lesson: 2
    },
    {
      q: "Why is decentralised data control safer than one central records server?",
      o: ["It stores less data", "There is no single point of failure, and records are very hard to change secretly", "It removes the need for passwords"],
      a: 1,
      e: "Many shared copies that must agree make records, in practice, immutable and remove the single weak point.",
      lesson: 2
    },
    {
      q: "A patient with diabetes wears a glucose sensor that sends readings to her nurse. What is the main benefit?",
      o: ["Higher healthcare costs", "Manual record-keeping", "Real-time monitoring that allows early intervention", "Increased privacy risks"],
      a: 2,
      e: "IoT wearables provide real-time monitoring and support early intervention in chronic conditions.",
      lesson: 3
    },
    {
      q: "In a telemedicine service, which pairing of job and technology is correct?",
      o: ["Blockchain collects heart readings", "IoT controls who may access records", "AI secures data storage", "AI analyses the readings to offer insights"],
      a: 3,
      e: "IoT collects, AI analyses, and blockchain secures the data and controls access.",
      lesson: 3
    },
    {
      q: "In the architectural view, which layer uses software to direct network traffic, like a traffic controller?",
      o: ["SDN control plane", "Blockchain layer", "6G network layer"],
      a: 0,
      e: "SDN means software-defined networking; the control plane steers traffic using software.",
      lesson: 4
    },
    {
      q: "A hospital adds patient engagement tools and checks its AI for fairness, with clinicians making final decisions. Which model does this reflect?",
      o: ["1990s healthcare", "Smart Healthcare 4.0", "Smart Healthcare 5.0"],
      a: 2,
      e: "Smart Healthcare 5.0 centres on human-machine collaboration, patient engagement and ethical AI.",
      lesson: 4
    }
  ],

  sources: [
    "Slide deck: Chapter 3, ICT, Blockchain, IoT, Cloud, and AI in Healthcare (Figures 3.1, 3.2, 3.4, 3.5; architectural view; Smart Healthcare 4.0 to 5.0; key points)",
    "Instructor resources: Chapter 3, ICT in Global Healthcare Today (telemedicine case study, discussion questions, MCQ examples)",
    "Instructor solutions: Chapter 3 selected answers (blockchain functions and benefits)"
  ]
};
