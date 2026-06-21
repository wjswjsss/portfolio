/* ============================================================
   Portfolio content — EDIT THIS FILE to update your data.
   No build step needed; just refresh the page.
   ============================================================ */

/* --- Publications --- */
const PUBLICATIONS = [
  {
    title: "SD-WLSNet: Diffusion-Augmented Small-Sample Water Leakage Segmentation",
    authorsHtml: "X. Hu, <span class=\"me\">J. Wang</span>, Z. Shi, X. Zhang, L. Tan, J. Chen, M. Zhou",
    venue: "GeoRisk, 2026"
  },
  {
    title: "Turbo-TTS: Enhancing Diffusion Model TTS with an Improved ODE Solver",
    authorsHtml: "X. Zhang&dagger;, <span class=\"me\">J. Wang&dagger;</span>, X. Qu, H. Tian, J. Wang*",
    venue: "ICONIP 2025 <mark class=\"honor\">Spotlight</mark>"
  },
  {
    title: "Enhancing Generalization in Video Deepfake Detection",
    authorsHtml: "J. Li, N. Zhang, X. Qu, <span class=\"me\">J. Wang</span>, Y. Zhong*, J. Wan",
    venue: "ICIC 2025 <mark class=\"honor\">Oral</mark>"
  },
  {
    title: "YOLO-SRMX: A Lightweight Model for Real-Time Object Detection on UAVs",
    authorsHtml: "S. Weng, H. Wang, <span class=\"me\">J. Wang</span>, C. Xu*, E. Zhang",
    venue: "Remote Sensing, 2025"
  }
];

/* --- Experience --- */
/* Rendered as a git-style branch/merge graph.
   `lane` is the column (0 = main line, 1 = branched line); array order is top -> bottom.
   EXPERIENCE_EDGES lists parent -> child links. All roles are completed. */
const EXPERIENCE = [
  {
    id: "A",
    lane: 0,
    role: "Research Intern",
    org: "Ping An Technology, Shenzhen",
    year: "2024-2025"
  },
  {
    id: "B",
    lane: 0,
    role: "Research Assistant",
    org: "Northeastern University, China",
    year: "2025",
    projects: [
      { label: "SD-WLSNet", target: "SD-WLSNet: Diffusion-Augmented Small-Sample Water Leakage Segmentation in Metro Tunnel Linings" }
    ]
  },
  {
    id: "C",
    lane: 1,
    role: "Research Assistant",
    org: "Tsinghua University",
    year: "2025"
  },
  {
    id: "D",
    lane: 0,
    role: "Intern",
    org: "XSpark AI",
    year: "2026",
    projects: [
      { label: "XDemo", target: "XDemo" },
      { label: "Synthetic Robotic Data Collection Application", target: "Synthetic Robotic Data Collection Application (Unity)" }
    ]
  }
];

const EXPERIENCE_EDGES = [
  ["A", "B"],
  ["A", "C"],
  ["C", "D"],
  ["B", "D"]
];

/* --- Projects ---
   `tags` should be chosen from a small consistent vocabulary,
   e.g. "Computer Vision", "Robotics", "Full-Stack", "Machine Learning".
   `media` can be a .gif, .png, or .jpg in the assets/ folder. */
const PROJECTS = [
  {
    title: "XDemo",
    description:
      "A voice-driven, task-level-safe (collision-free), desk-operating dual-arm hierarchical system (high-level planner &amp; executor), currently running at the company reception as a live showcase. Developed at <a href='https://example.com' target='_blank' rel='noopener'>XSpark AI</a> (the company behind <a href='https://example.com' target='_blank' rel='noopener'>RoboTwin 2.0</a>), under the supervision of <a href='https://example.com' target='_blank' rel='noopener'>Tianxing Chen</a> (CTO)." +
      "<ul class='project-points'>" +
      "<li><mark>Sole full-stack</mark> developer — designed and implemented XDemo (Variant 1) end to end.</li>" +
      "<li>Left clean skill-list interfaces in the prototype so my successor can integrate VLAs and evolve it into an embodied-agent benchmarking platform (Variant 2).</li>" +
      "</ul>",

    media: [
      {
        label: "Overview",
        src: "assets/projects/xdemo/overall.png",
        caption:
          "In the Overview figure, * marks a component still under active development. I concluded my internship in June 2026, and this part is being carried forward by my successor."
      },
      {
        label: "Role",
        src: "assets/projects/xdemo/role.png"
      }
    ],
    gallery: [
      "assets/projects/xdemo/demo-001.gif",
      "assets/projects/xdemo/demo-002.gif",
      "assets/projects/xdemo/demo-003.gif",
      "assets/projects/xdemo/demo-004.gif",
      "assets/projects/xdemo/demo-005.gif",
      "assets/projects/xdemo/demo-006.gif"
    ],
    links: [
      {
        label: "Demo",
        url: "#",
        type: "demo"
      }
    ],
    tags: ["Robotics", "Computer Vision", "ML Engineering", "Full-stack", "Industry"]
  },
  {
    title: "Synthetic Robotic Data Collection Application (Unity)",
    description:
      "A Unity-based application for generating synthetic robotic data using two consumer iOS phones on the same LAN. <mark>Sole full-stack</mark> developer. Built in collaboration with <a href='https://10-oasis-01.github.io/' target='_blank' rel='noopener'>Yibin Liu</a> and advised by <a href='https://scholar.google.com/scholar?q=Mingyu+Ding' target='_blank' rel='noopener'>Assistant Professor Mingyu Ding</a>." +
      "<ul class='project-points'>" +
      "<li><strong>Hardware:</strong> Two camera+IMU-enabled mobile devices connected within one local network.</li>" +
      "<li><strong>Device A (scene phone):</strong> scans planes, places a Franka Panda 6-DoF arm and interactive assets, and controls episode start/stop/drop.</li>" +
      "<li><strong>Device B (controller phone):</strong> streams IMU pose deltas at a fixed frame rate as [x, y, z, pitch, yaw, roll], drives IK solving, sets robot joint targets, and controls gripper open/close.</li>" +
      "</ul>",
    media: [
      {
        label: "Role",
        src: "assets/projects/dataSyn/role.png"
      },
      {
        type: "video",
        label: "Demo Recording",
        src: "assets/projects/dataSyn/demo.mp4",
        caption:
          "The swaying phone screen in the background is my controller device. I recorded this demo independently while holding one phone in each hand. The ketchup bottle was knocked over by the robotic arm at the very beginning due to my operating error. As you can see, the scene includes a collision box, which makes asset-robot interaction possible in this virtual environment."
      }
    ],
    tags: ["Robotics", "Software Development", "VR", "Full-stack", "Industry"]
  },
  {
    title: "SD-WLSNet: Diffusion-Augmented Small-Sample Water Leakage Segmentation in Metro Tunnel Linings",
    description:
      "Co-developed with <a href='#' target='_blank' rel='noopener'>Dr. Xiaoxi Hu</a>, advised by <a href='#' target='_blank' rel='noopener'>Academician and Professor Jiayao Chen</a>." +
      "<ul class='project-points'>" +
      "<li>Diffusion-augmented small-sample segmentation: first to apply Stable Diffusion-based inpainting to tunnel inspection data synthesis, enabling effective training with as few as <span class='metric'>10</span> labeled images.</li>" +
      "<li>WLSNet integrates a Global Perception Module (GPM) for long-range context and Multi-Scale Attention Augmentation (MSAA) for boundary refinement, reducing false positives on thin, irregular leakage patterns.</li>" +
      "<li>Best-in-class <span class='metric'>mIoU</span> for small-sample tunnel leakage: outperformed mainstream baselines in this domain, e.g., SegFormer-B0 by <span class='metric'>+4.65 pp mIoU</span>, and achieved a <span class='metric'>+3.94 pp mIoU</span> gain over the unaugmented WLSNet baseline with only <span class='metric'>10</span> training images (<span class='metric'>4x</span> augmentation ratio).</li>" +
      "</ul>",
    media: [
      {
        label: "Architecture",
        src: "assets/projects/wlsnet/architecture.png"
      },
      {
        label: "Framework",
        src: "assets/projects/wlsnet/framework.png"
      },
      {
        label: "Modules",
        src: "assets/projects/wlsnet/modules.png"
      }
    ],
    links: [
      {
        label: "Paper",
        url: "#",
        type: "paper"
      }
    ],
    tags: ["Computer Vision", "Research"]
  }
];
