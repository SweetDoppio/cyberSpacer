// frontend/src/data/modules.ts

export type Module = {
    id: number;
    title: string;
    category: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    progress: number; // 0–100
    description: string;
    sections: string[]; // simple step-based content
};

export const modules: Module[] = [
    {
        id: 1,
        title: "Introduction to Encryption",
        category: "Cryptography",
        level: "Beginner",
        progress: 75,
        description:
            "Learn the basics of encryption, why it matters, and how it protects data in transit and at rest.",
        sections: [
            "What is encryption? Symmetric vs asymmetric encryption.",
            "Common algorithms: AES, RSA, and where they’re used.",
            "Real-world examples: HTTPS, password storage, and messaging apps.",
            "Best practices: key management, strong ciphers, and avoiding home-grown crypto.",
        ],
    },
    {
        id: 2,
        title: "Phishing & Social Engineering",
        category: "Awareness",
        level: "Beginner",
        progress: 100,
        description:
            "Spot and defend against phishing emails, fake login pages, and social engineering attacks.",
        sections: [
            "What is social engineering and why it works.",
            "Common phishing indicators: sender, links, attachments, urgency.",
            "Examples: phishing email breakdown and fake login pages.",
            "How to report and respond safely to suspected phishing.",
        ],
    },
    {
        id: 3,
        title: "SQL Injection Attacks",
        category: "Web Security",
        level: "Intermediate",
        progress: 30,
        description:
            "Understand SQL injection, how attackers exploit it, and how to defend your applications.",
        sections: [
            "How SQL queries work and where user input fits in.",
            "Classic SQL injection examples and payloads.",
            "Defenses: parameterised queries, ORM safety, and input validation.",
            "Hands-on: walk through a vulnerable login query and fix it.",
        ],
    },
    {
        id: 4,
        title: "Network Security Basics",
        category: "Networking",
        level: "Beginner",
        progress: 0,
        description:
            "Foundations of network security, including firewalls, segmentation, and secure protocols.",
        sections: [
            "OSI vs TCP/IP overview for security people.",
            "Firewalls, security groups, and basic network policies.",
            "Secure protocols: HTTPS, SSH, VPN basics.",
            "Common misconfigurations and how to avoid them.",
        ],
    },
    {
        id: 5,
        title: "Reverse Engineering 101",
        category: "Malware",
        level: "Advanced",
        progress: 10,
        description:
            "Get an introduction to reverse engineering binaries and basic malware analysis workflows.",
        sections: [
            "What reverse engineering is and when it’s used.",
            "Static vs dynamic analysis, tools overview.",
            "Basic disassembly concepts and function flow.",
            "Safety tips when working with malware samples.",
        ],
    },
];
