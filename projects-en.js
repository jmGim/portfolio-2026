/* ==============================================
   PROJECT DATA — English translations (KO fallback when a field is missing)
   Merged over the Korean `projects` object in index.html (see localizeProject).
   - detailSections / troubleDetail are merged by index (code snippets stay as-is)
   - links: label list only (URLs stay)
=============================================== */
window.projectsEn = {
  qtledkey: {
    title: "Qt + Device Driver Mini Project — LED/KEY Control & IoT Monitoring",
    subtitle: "User-space /dev/ledkey integration + Qt GUI · TCP · Charts · SQLite · OpenCV",
    brief: "Connects the Raspberry Pi LED/KEY device file to the Qt event loop, extended with TCP, sensor charts, SQLite and OpenCV",
    period: "2026.07.03 ~ 2026.07.10 (Git commit range)",
    target: "Qt Application / Embedded Linux System Integration",
    hw: "Raspberry Pi LED/KEY setup, /dev/ledkey, USB webcam, Qt Widgets·Charts·SQL·WebEngine, OpenCV",
    summary: "Built a Qt device-access layer (LedKeyDev) on top of the Linux device file /dev/ledkey and wired KEY input and LED output to a dial, checkboxes and an LCD. The app was then extended with a TCP client, real-time sensor charts, SQLite history management, and OpenCV color classification and change detection. The kernel driver itself is out of scope for this project; the focus is user-space system integration that uses the driver interface.",
    role: [
      "LedKeyDev: opens /dev/ledkey, reads 1-byte KEY values, writes LED values, and connects read-ready events via QSocketNotifier",
      "Split Tab1~Tab7 into per-feature classes and wired them together with signals/slots in MainWidget",
      "TCP client and message router: LED/LAMP/GAS/SENSOR branching",
      "Real-time illuminance chart with QLineSeries·QDateTimeAxis, SQLite save / period query / delete",
      "OpenCV VideoCapture-based HSV color classification of the center ROI and frame-change detection, with results sent over TCP"
    ],
    roleNote: "Commit authorship is confirmed, but team size, individual scope, and reused code (keyboard.cpp carries a TI license notice) must be stated separately.",
    architecture: [
      "Physical KEY → /dev/ledkey → LedKeyDev → Tab1 checkboxes·LCD (device input path)",
      "Mouse checkbox → TCP LED command → server response → dial → LED write (server-routed path)",
      "SocketClient → Tab2 parser → Tab3 (LAMP/GAS) · Tab4 chart · Tab5 SQLite",
      "WebCamThread (OpenCV) → COLOR / INTRUDER / GAS messages → SocketClient"
    ],
    detailSections: [
      {
        heading: "🔌 3.1 /dev/ledkey Device File → Qt Event Loop",
        desc: "The device is opened with QFile and its fd is registered with a QSocketNotifier, which emits the KEY number as a signal when the fd is read-ready. LEDs are written as an 8-bit pattern in a single byte.",
        bullets: [
          "<strong>Scope</strong>: understanding the device-file contract and user-space integration (kernel source, poll and IRQ implementation need separate evidence)",
          "<strong>Caveat</strong>: Unbuffered does not mean non-blocking; readiness depends on the driver's .poll implementation",
          "<strong>Proposed improvements</strong>: abort on open failure, validate KEY 1~8 and LED 0~255, check write results"
        ]
      },
      {
        heading: "🎛️ 3.2 KEY Bitmask State and UI Binding",
        desc: "The KEY number is folded into the 8-bit state with an XOR bit toggle, updating the LCD and checkboxes. A mouse click builds a server LED command from the same state.",
        bullets: [
          "Physical KEYs only update the UI, while mouse clicks send commands to the server — the two paths are documented separately",
          "Documented that the XOR toggle represents an event, not a pressed/released state"
        ]
      },
      {
        heading: "📡 3.3 TCP Message Routing and Sensor Data Management",
        desc: "Incoming messages are split into @-delimited fields: LED goes to a device write, LAMP/GAS to the control panel, and SENSOR to the chart and SQLite. SensorManKJMM extends this to three series: illuminance, temperature and humidity.",
        bullets: [
          "Tab7 handles one illuminance channel, while temperature/humidity are handled separately in SensorManKJMM (stated explicitly)",
          "The receive time is used as the timestamp — no claim is made about synchronizing with the sensor's measurement time"
        ]
      },
      {
        heading: "📷 3.4 OpenCV Color Classification · Change Detection",
        desc: "The mean HSV Hue of a central 64×64 ROI classifies RED/GREEN/BLUE/NONE, and an INTRUDER message is sent when the ratio of changed pixels exceeds a threshold. This is a rule-based prototype, not learning-based recognition.",
        bullets: [
          "COLOR messages are sent only when the color changes, suppressing duplicates",
          "Review tasks: remove direct GUI access, use absdiff, reset counts per comparison, add S/V conditions"
        ]
      }
    ],
    verification: [
      "Source implementation and Git commit history (2026.07.03~07.10, 6 commits) verified",
      "Real-board behavior, clean-environment build, performance and accuracy are unverified — to be supplemented with test records",
      "Three improvement tasks derived from code review are written up as blog posts"
    ],
    troubleshooting: [
      "[TCP] One read is parsed as one command → proposal: accumulate a buffer and split frames by newline",
      "[DB] DROP TABLE at startup and a single date PK collision → proposal: IF NOT EXISTS, row ID · millisecond timestamps, prepared queries",
      "[Thread] Worker thread updates QLabel directly → proposal: frameReady signal + display on the main thread",
      "[Device] Notifier created after open failure and KEY range unchecked → proposal: abort initialization and add range checks"
    ],
    capabilitySummary: "Shows an understanding of the Linux device-file contract, experience <strong>integrating the Qt event loop, TCP, data and vision features into a single device-integrated app</strong>, and the ability to derive thread, communication and DB reliability tasks through code review. The proposed improvements have not yet been applied or tested.",
    links: [
      "GitHub",
      "Blog · Device File × Qt",
      "Blog · TCP Framing",
      "Blog · Thread Safety"
    ]
  },

  bmsota: {
    title: "BMS OTA Integration Platform",
    subtitle: "ASPICE-based SWRS definition and offline HIL pipeline",
    brief: "BMS-OTA EVSE Platform / HIL Verification",
    target: "Embedded SW Engineer (Automotive Electronics & Defense)",
    hw: "Raspberry Pi (HIL-PI), STM32F446 (BMS), STM32F429 (EVSE), ST-Link",
    summary: "In a Local Gateway environment that connects STM32-based BMS and EVSE controllers over CAN/WiFi, I defined ASPICE-based software requirements (SWRS) and built an offline automated HIL (Hardware-in-the-Loop) verification pipeline using Raspberry Pi + Docker + GitLab Runner.",
    role: [
      "Authored ASPICE-based SWRS (Software Requirements Specification): 12 BMS, 8 EVSE, 7 CAN and 9 OTA requirements",
      "Set up Docker Engine and the GitLab Runner HIL-PI infrastructure on Raspberry Pi 32-bit (armhf)",
      "Wrote Test Specifications based on boundary value, equivalence partition and decision table, and applied independent Oracle verification",
      "Implemented verification logic for the EVSE safe state (PE11 LOW) and BMS Fault/Permit communication reliability through CAN/UART protocol analysis"
    ],
    roleNote: "Built on a No-Cloud Local Server Gateway, assuming an offline, security-restricted environment.",
    architecture: ["Local Gateway Server", "Raspberry Pi HIL Runner", "STM32F446 BMS Controller", "STM32F429 EVSE Controller", "CAN Transceiver", "OTA Bootloader"],
    detailSections: [
      {
        heading: "📋 ASPICE-based Software Requirements (SWRS) and Test Specification",
        desc: "Rather than plain functional descriptions, I defined 36 SHALL requirements with measurable thresholds and boundary values, and designed an infrastructure that cross-checks the product's C function results back-to-back against an independent Oracle.",
        bullets: [
          "<strong>BMS Fault logic:</strong> strict conditions such as cell voltage (OV above 4200mV, clear below 4150mV), temperature (OT above 55°C) and Shunt/Hall difference above 500mA",
          "<strong>EVSE Charge Permit control:</strong> verified charge allow/block (Safe-Off) logic against connector and BMS state using a 64-combination Decision Table",
          "<strong>CAN 500kbps 11-bit network:</strong> multi-byte little-endian parsing and median-timestamp verification of ICD conformance for 0x100-0x105 / 0x200-0x202"
        ]
      },
      {
        heading: "🛠️ Docker + GitLab Runner HIL Pipeline on Raspberry Pi 32-bit (armhf)",
        desc: "While configuring GitLab Runner on a Raspberry Pi for HIL (Hardware-in-the-Loop) testing, I resolved architecture mismatches and Docker permission problems to build an automated integration test environment.",
        bullets: [
          "Analyzed the inconsistency between the host kernel (aarch64), package architecture (armhf) and Python pointer size (32-bit), and mapped to <code>linux/arm/v7</code>-compatible images",
          "Stabilized HIL hardware access with Docker <code>/var/run/docker.sock</code> permission control (usermod -aG docker) and <code>ST-Link</code> USB udev rules (MODE=0660)",
          "Prevented unintended OTA flashing by tying the Target Update HIL job to GitLab Manual Approval"
        ]
      },
      {
        heading: "🔄 CAN/WiFi OTA Bootloader and Reliability Verification",
        desc: "To perform OTA updates safely in a local gateway environment, I designed bootloader integrity checks, memory jump control, and downgrade/recovery protection logic.",
        bullets: [
          "Validate the Application Vector (0x08020000–0x08100000) before jumping; on error, wait in the Boot Command Loop (Fail-Safe)",
          "On a CRC16 error in a Binary Frame, return NACK without side effects; after whole-image CRC32 verification, write the final 8-byte Vector",
          "Map product SHA, Artifact Hash and Target Identity to preserve QA artifacts and generate a JUnit consolidated report"
        ]
      }
    ],
    troubleshooting: [
      "[Environment] Resolved the architecture mismatch between Raspberry Pi 32-bit Docker and GitLab Runner",
      "[Quality] Restored safe state based on the HIL Test Oracle to prevent False-PASS",
      "[Comms] Fail-Safe implementation for CAN Bus-off and OTA deadlock situations"
    ],
    troubleDetail: [
      {
        badge: "HIL Infrastructure",
        title: "Architecture Conflict and Permission Errors with Docker and GitLab Runner on Raspberry Pi 32-bit",
        symptom: "<code>exec format error</code> occurred, the <code>docker ps</code> command failed, and a permission-denied error appeared when connecting the ST-Link debugger.",
        cause: [
          "The kernel is aarch64 but userspace runs 32-bit (armhf), so running a 64-bit-only container image caused an ABI conflict",
          "The GitLab Runner account lacked access to the docker socket and plug-and-play access (plugdev) to the ST-Link (USB)"
        ],
        solution: [
          "Analyzed the ABI with <code>docker image inspect</code> and <code>getconf LONG_BIT</code>, and fixed it by explicitly specifying the <code>linux/arm/v7</code> variant of <code>python:3.11-slim-bookworm</code>",
          "Added udev rules (<code>60-beog-stlink.rules</code>) and group membership via <code>usermod -aG plugdev,docker gitlab-runner</code> to secure HIL automation access"
        ]
      },
      {
        badge: "Test Reliability",
        title: "Establishing an Independent HIL Test Oracle Procedure to Prevent False-PASS",
        symptom: "During HIL automated tests, I found False-PASS cases where only the SW assertion passed and the test was marked PASS even though actual hardware pin control or fault handling had failed.",
        cause: [
          "Loose oracle rules: only checking the <code>0x200 data[1]=0</code> frame, or printing the HardFault register (CFSR) without asserting that it is 0"
        ],
        solution: [
          "Refactored test code so the Expected result is computed by an independent SWRS/ICD-based oracle rather than from product logs",
          "When verifying a Relay Command, cross-checked not only the software variable but also the physical PE11 output (GPIO ODR) and the Contactor OFF state",
          "Added ELF/BIN hash verification and a Flash Readback step after target flashing as mandatory evidence (Evidence Schema)"
        ]
      }
    ],
    capabilitySummary: "Beyond simple feature implementation, I can write rigorous ASPICE-level <strong>requirements specifications (SWRS) and test specifications (TS)</strong>. In particular, by designing a <strong>HIL offline pipeline and a False-PASS defense scheme</strong> with Raspberry Pi and Docker myself, I can deliver the 'zero-defect' software quality assurance process required in the automotive and defense fields.",
    links: []
  },

  gimbal: {
    title: "STM32-based 3-Axis Gimbal Control System",
    subtitle: "Real-time attitude control and Fail-Safe design on an RTOS architecture",
    brief: "FreeRTOS 6-Task / Event-Driven IMU / Sensor Fusion / Fail-Safe",
    target: "Embedded SW Engineer (Automotive Electronics & Defense)",
    hw: "STM32F411, MPU6050 (6-axis IMU), HMC5883L (3-axis magnetometer), SG90 Servo ×3",
    summary: "A 3-axis gimbal that fuses 9-axis data from the MPU6050 and HMC5883L to estimate Roll/Pitch/Yaw and compensates by driving SG90 servos opposite to the external tilt. Responsibilities are separated across a Driver–Service–AP layering and six FreeRTOS tasks, and Event-Driven sensor acquisition plus Fail-Safe recovery keep control even on sensor or communication faults.",
    role: [
      "Firmware design based on a Layered Architecture (Driver → Service → AP separation)",
      "Implemented MPU6050 and HMC5883L I2C drivers and a complementary filter (Sensor Fusion)",
      "Designed FreeRTOS 6-Task scheduling and resource synchronization (Semaphore, Mutex)",
      "Implemented deferred interrupt handling on PA4 EXTI and manual I2C SCL 9-clock recovery",
      "Fine servo PWM control, software limits and jittering improvement"
    ],
    roleNote: "※ Vision camera (ESP32-CAM) object tracking and its communication integration were handled by other team members and are excluded from this write-up.",
    architecture: [
      "Sensor Driver — MPU6050 50Hz EXTI / HMC5883L ~66ms polling / I2C1 Mutex",
      "Service — complementary filter, magnetometer tilt compensation, relative Roll/Pitch/Yaw",
      "Application — FreeRTOS 6-Task scheduling, CLI diagnostics, Fail-Safe state management",
      "Actuation — SG90 ×3, float PWM interpolation, 10°~170° software limit"
    ],
    detailSections: [
      {
        heading: "🏗️ 2.0 Layered Architecture and 6-Task Separation of Responsibility",
        desc: "Hardware access, sensor data processing and system control are separated into Driver → Service → AP. Layers never modify global state directly; they pass the latest attitude and device state through defined interfaces.",
        bullets: [
          "<strong>Driver</strong> — encapsulates I2C/UART/PWM/EXTI and sensor register access",
          "<strong>Service</strong> — raw sensor correction, complementary filter, tilt compensation and relative angle calculation",
          "<strong>Application</strong> — responsible for task periods, CLI commands, control modes and Fail-Safe transitions",
          "<strong>Real-time path</strong> — the ISR does no computation and only releases a Semaphore, avoiding long ISRs and priority inversion"
        ]
      },
      {
        heading: "⚙️ 2.1 RTOS Synchronization for a Shared I2C Bus",
        desc: "With two sensors sharing one I2C bus (I2C1), access is serialized with a Mutex, and a mix of Event-Driven and Time-Driven acquisition reduces bus collisions and unnecessary CPU usage.",
        bullets: [
          "<strong>MPU6050 (Event-Driven)</strong> — no polling; when the sensor's internal 50Hz sampling completes, it raises an interrupt on EXTI pin PA4. The ISR only releases a Semaphore, and the OS scheduler wakes gyroSystemTask (deferred interrupt handling).",
          "<strong>HMC5883L (Time-Driven)</strong> — the module has no interrupt pin, so it is polled about every 66ms (15Hz).",
          "<strong>I2C1 Mutex</strong> — a shared Mutex is acquired and released around HAL calls to serialize bus access by the two sensor tasks."
        ]
      },
      {
        heading: "📐 2.2 Sensor Fusion with the Hardware FPU (Complementary Filter + Tilt Compensation)",
        desc: "A complementary filter lets the gyro's low-frequency drift and the accelerometer's high-frequency noise offset each other, and tilt compensation projects the tilted magnetometer vector onto the horizontal plane using a rotation matrix. The Cortex-M4F FPU and single-precision math of the STM32F411 reduce floating-point overhead on the attitude calculation path."
      },
      {
        heading: "🔩 2.3 Servo Jittering Improvement",
        desc: "The first implementation made the motor move in steps (jittering). Cause: angles were handled as uint8_t (integers), so stair-stepped values were passed to the CCR register.",
        bullets: [
          "<strong>Full switch to float</strong> — control variables changed to float so the timer pulse width is divided at sub-integer resolution.",
          "<strong>LPF interpolation</strong> — added low-pass-filter-style interpolation that moves by k_gain only when the error between target and current angle is 0.05° or more."
        ]
      }
    ],
    verification: [
      { label: "Sensor Acquisition", value: "MPU6050 50Hz EXTI · HMC5883L ~66ms polling" },
      { label: "Attitude Estimation", value: "Complementary α=0.96 · Tilt-compensated Yaw" },
      { label: "Servo Protection", value: "float PWM · k_gain 0.15 · 10°~170° limit" },
      { label: "Fail-Safe", value: "PA4 Pull-down · NVIC Priority 5 · SCL 9-clock" },
      { label: "CLI Control", value: "AboveNormal · text output at least 100ms" },
      { label: "High-speed Diagnostics", value: "Blocking text and Binary Monitor paths separated" }
    ],
    troubleshooting: [
      "[OS Stability] Resolved Interrupt Storm and deadlock caused by sensor initialization failure",
      "[Comms Bottleneck] UART TX bottleneck and Task Starvation during high-speed text output"
    ],
    troubleDetail: [
      {
        badge: "OS Stability",
        title: "Sensor Init Failure → Interrupt Storm + Deadlock",
        symptom: "When the sensor I2C lines were unstable, the whole system (LED, CLI) froze completely → the Idle Task was starved.",
        cause: [
          "The sensor power did not come up, leaving the EXTI pin (PA4) floating → it absorbed noise like a sponge and produced tens of thousands of interrupts per second (interrupt storm)",
          "The EXTI interrupt priority was set higher than FreeRTOS recommends → system timer corruption (Hard Fault)"
        ],
        solution: [
          "Set a hardware pull-down on the EXTI pin in CubeMX → noise suppression",
          "Lowered the NVIC EXTI priority to 5 → avoids FreeRTOS API conflicts",
          "Prevent a hang on I2C timeout: after setting an error flag, the <code>imu on</code> command manually resets the I2C bus (SCL 9-clock toggle) and re-initializes it (Fail-Safe logic)"
        ]
      },
      {
        badge: "Comms Bottleneck",
        title: "UART TX Bottleneck on High-speed Text Output → Task Starvation",
        symptom: "When printing IMU data as text to the terminal at 50Hz (20ms) (imu on 20), user control commands such as Ctrl+C could not be entered at all.",
        cause: [
          "UART printf is blocking → holds the CPU for a long time",
          "The CLI input task (defaultTask) was denied execution time by the scheduler — Task Starvation"
        ],
        solution: [
          "Raised the CLI input task priority to <strong>AboveNormal</strong>, the highest → secures emergency control (e.g. emergency stop)",
          "Inserted guard code that forces a minimum 100ms period for text-mode output",
          "Split the system into two modes: use binary packets (<code>mon on</code>) when high-speed data is needed"
        ]
      }
    ],
    capabilitySummary: "Beyond simple feature implementation, I analyzed timing issues and OS scheduling problems at the hardware level using an oscilloscope and a debugger. I can build into code the principle that matters most in defense and automotive controllers: <strong>'defensive design (Fail-Safe) so the system never halts under any circumstances.'</strong>",
    links: [
      "Tech Blog Details",
      "Resource Analysis",
      "GitHub"
    ]
  },

  rhythm: {
    title: "SDL2 Rhythm Game",
    subtitle: "A pitch-judging game using Fourier theory (frequency analysis)",
    brief: "FFT pitch-judging rhythm game (C + SDL2)",
    tags: ["C", "SDL2", "Fourier Transform", "AI-assisted Development"],
    summary: "A rhythm game built with C and the SDL2 library that applies an algorithm to Fourier-transform (FFT) the microphone input signal and judge the user's pitch in real time.",
    role: [
      "User audio input handling and real-time frequency analysis based on Fourier theory (Pitch Detection)",
      "Used AI tools such as Gemini for over 95% of the work to bridge and optimize the gap between the mathematical algorithm and C code",
      "SDL2-based rendering and game-loop (frame-rate) synchronization"
    ],
    architecture: [
      "C Language",
      "SDL2 Graphics/Audio",
      "FFT Algorithm Layer"
    ],
    troubleshooting: [
      "[개선] Refactored and tuned AI-generated mathematical code to fit real memory and the game loop",
      "[해결] Minimized pitch-judging latency by adjusting the microphone buffer size"
    ],
    links: ["GitHub"]
  },

  verilog: {
    title: "Basys3-based Smart Climate Control System",
    subtitle: "DHT11 Fail-Safe FSM and source-level verification of a 117-byte UART pipeline",
    brief: "7-State DHT11 FSM / 5 Timeout Paths / UART 8N1·117B",
    target: "Embedded SW Engineer (Automotive Electronics & Defense)",
    hw: "Xilinx Basys3 (Artix-7), DHT11, UART, 7-Seg FND (Motor/Rotary/RTC are in staged integration within the repository)",
    summary: "Implemented the DHT11 single-wire protocol as a 7-State FSM on a 100MHz Basys3, and defended against asynchronous sensor input with a 2-Stage Synchronizer, Open-Drain High-Z and five timeout recovery paths. Through Git commit comparison, I fixed the UART TX 16-bit framing and 16× baud error to 8N1 · 9600bps, and built a pipeline that snapshots six fields and serializes them as a 117-byte ASCII frame.",
    role: [
      "Personal scope: DHT11 protocol parsing, CDC synchronization, FSM timeouts, and UART TX/RX and FND integration",
      "Implemented a 100MHz→1µs tick generator, DHT11 20ms Start Low, 80µs ACK and 40-bit reception",
      "Generate data_valid as a 1-clock pulse only when the checksum passes, triggering UART transmission",
      "Atomically snapshot six data items → 117-byte ASCII → sequential UART 9600bps 8N1 transmission"
    ],
    roleNote: "In the repository, DHT11, UART, FND and Button Debounce are integrated in top.v, while Motor/Rotary/RTC are at module or preset stage. No timing report exists in the repository, so Slack figures are excluded from confirmed results.",
    architecture: [
      "DHT11 — Open-Drain High-Z / 2-Stage Synchronizer / 7-State FSM / Checksum Gate",
      "Data Sender — snapshots six input fields on data_valid, blocks changes during tx_busy",
      "UART TX/RX — 9600bps 8N1 TX + 16× oversampling RX",
      "117-byte Formatter — Time/Alarm/Target/Temperature/Humidity/Fan ASCII frame",
      "FND — 4-mode MUX, 1ms digit scan, 4-digit full refresh at 250Hz",
      "Integration Boundary — Motor/Rotary/RTC are currently unconnected to the top hierarchy or preset"
    ],
    detailSections: [
      {
        heading: "🔬 DHT11 Single-wire FSM and Data Integrity Gate",
        desc: "The 100MHz clock is divided into a 1µs tick, and handshake, 40-bit reception and checksum are separated across seven main states and two read substates. The input passes through two flip-flops before edge detection, and data_valid is raised for one clock only when the checksum matches.",
        bullets: [
          "<strong>Precise control:</strong> per the actual RTL: Start 20ms LOW → Release → wait for ACK LOW/HIGH edges",
          "<strong>Bit decision:</strong> shift in 1 if the HIGH pulse is longer than 45µs, otherwise 0",
          "<strong>Fail-Safe:</strong> in each ACK/bit wait state, return to S_IDLE after a 100µs or 150µs timeout",
          "<strong>Checksum:</strong> Humidity_H + Humidity_L + Temp_H + Temp_L == Checksum"
        ]
      },
      {
        heading: "📡 UART Commit Diff: From a 16-bit Error to 8N1 · 9600bps",
        desc: "The earlier commit loaded an 8-bit character into a 16-bit shift register and advanced the bit counter to 15, and the TX divider used the RX /16 oversampling. The current RTL transmits only eight data bits and uses a 100MHz/9600 divider.",
        bullets: [
          "<strong>Framing:</strong> Start + 16 Data + Stop → Start + 8 Data + Stop, bits per character 18→10 (44.4% reduction)",
          "<strong>Baud:</strong> 100MHz/9600/16 TX tick → 100MHz/9600 TX tick, corrected to the intended 9600bps",
          "<strong>Frame:</strong> 117 bytes × 10 bits / 9600bps = 121.875ms wire time",
          "<strong>Duty:</strong> about 4.06% line occupancy against the 3-second DHT11 period"
        ]
      },
      {
        heading: "🧾 6-Field Snapshot and 117-byte Serializer",
        desc: "When data_valid arrives and TX is idle, data_sender stores Current Time, Alarm Time, Target Temp, Current Temp, Humidity and Fan Speed into registers at once. Values within a frame never mix even if inputs change during transmission, and uart_tx iterates index 0~116 to output 117 characters."
      },
      {
        heading: "🔎 Repository Evidence and Remaining Verification Gaps",
        desc: "The source shows DHT11 defense logic and the UART structure improvements, but no Vivado timing summary, WNS/TNS or utilization report is included. Also, the temperature/humidity /10 path was replaced with comparison/subtraction, but / and % remain in the time split and FND bin2bcd, so this is not described as 'division fully removed'.",
        bullets: [
          "<strong>Confirmed:</strong> 2-Stage CDC, Open-Drain High-Z, 5 timeout branches, 117-byte frame",
          "<strong>Partially improved:</strong> removed /10·%10 from the temperature/humidity decimal path",
          "<strong>Remaining operations:</strong> UART time /100·%100, FND /10·/100·/1000 and %10",
          "<strong>Still needed:</strong> commit report_timing_summary and post-route WNS/TNS to verify the numeric improvement"
        ]
      }
    ],
    verification: [
      { label: "DHT11 FSM", value: "7 Main States · 2 Read Substates · 40-bit Shift" },
      { label: "Timeout", value: "5 recovery branches · 100µs/150µs → S_IDLE" },
      { label: "UART Framing", value: "16→8 data bits · 8N1 · 9600bps" },
      { label: "UART Frame", value: "117 bytes · 121.875ms · 4.06% of 3s" },
      { label: "Data Snapshot", value: "6 fields latched atomically before TX" },
      { label: "Evidence Gap", value: "No Timing/Utilization report · Slack unconfirmed" }
    ],
    troubleshooting: [
      "[분석] 1-bit shift error caused by asynchronous noise and timing violations",
      "[해결] UART deadlock caused by a division operator (Setup Time Violation)",
      "[해결] Sensor unresponsive due to an inout port impedance setting error"
    ],
    troubleDetail: [
      {
        badge: "Timing Violation",
        title: "Asynchronous Noise → 1-bit Shift Error (Garbage Humidity Above 100%)",
        symptom: "Humidity data arrived as garbage values (130, 178, etc.) exceeding the physical limit of 100%. Communication dropped intermittently.",
        cause: [
          "RC delay on the external jumper wire stretched the DHT11 LOW signal, so the 100MHz FPGA mis-sampled a '0' (28us) as a '1' (70us)",
          "The main FSM mixed separate counters for waiting and measuring → timing synchronization broke on state transitions"
        ],
        solution: [
          "<strong>Introduced a 2-Stage Synchronizer:</strong> passes the asynchronous signal (<code>dht11_data</code>) through two flip-flops to eliminate metastability and glitches at the source",
          "<strong>Reworked the FSM into a single-counter structure:</strong> applied a safe FSM design standard that increments unconditionally every 1us and resets <code>r_wait_cnt &lt;= 0</code> only on edge events"
        ]
      },
      {
        badge: "UART RTL",
        title: "16-bit Framing + 16× Baud Tick → Corrupted Characters",
        symptom: "When transmitting the 117-byte integrated data over UART, certain values were corrupted or the transmitter deadlocked completely.",
        cause: [
          "The previous TX advanced to <code>r_bit_cnt &gt;= 15</code>, sending 16 data bits per character",
          "The RX oversampling <code>/16</code> was applied to the TX baud divider, generating ticks 16× faster than intended",
          "The dynamic /10·%10 in the temperature/humidity decimal conversion path is a long combinational path candidate"
        ],
        solution: [
          "Corrected the TX FSM to <strong>8 data bits + 1 Start + 1 Stop</strong>",
          "Separated the TX divider as <code>100_000_000 / 9600</code> and kept 16× oversampling for RX only",
          "Replaced the 2-digit temperature/humidity conversion with a comparison (<code>&gt;=</code>) and subtraction-based BCD path",
          "Registered the remaining time/FND division paths as further optimization targets once a timing report is available"
        ]
      },
      {
        badge: "H/W Design",
        title: "Inout Port Impedance Setting Error → Sensor Unresponsive",
        symptom: "The MCU could not send the Start Signal. The sensor did not respond.",
        cause: [
          "When driving the <code>inout</code> pin, the logic value <code>1'b0</code> was applied instead of High-Z (<code>1'bz</code>) → bus contention (stuck at pull-up)"
        ],
        solution: [
          "Fixed with a standard <strong>Open-Drain structure</strong> of the form <code>assign dht11_data = dht_drive ? 1'b0 : 1'bz;</code> to regain control of the bus"
        ]
      }
    ],
    capabilitySummary: "Defended asynchronous sensor I/O with CDC, High-Z, timeouts and checksums, and traced UART framing and baud generator errors through Git commit diffs. In particular, by <strong>separating confirmed source evidence from the timing report that does not exist yet</strong>, I can explain the design with reproducible quantitative metrics instead of exaggerated Slack figures.",
    links: [
      "Tech Blog Details",
      "GitHub"
    ]
  },

  airdrum: {
    title: "IoT Air Drum",
    subtitle: "MPU6050 gesture mapping and AWS cloud integration",
    brief: "MPU6050 gesture-recognition AWS air drum",
    summary: "An IoT instrument you play by motion: it analyzes the movement of a stick fitted with accelerometer/gyro sensors and plays drum sounds through a cloud server (AWS).",
    role: [
      "Designed the overall system architecture and controlled the MPU6050 over I2C using Wire.h",
      "Detected drum-stick motion (acceleration threshold) and implemented the MQTT Publish protocol",
      "AWS server routing and beat-mapping tuning to minimize latency"
    ],
    architecture: [
      "ESP8266 Node",
      "AWS MQTT Broker",
      "Python Sound Engine"
    ],
    troubleshooting: [
      "[해결] Mitigated sound sync (beat) drift caused by network delay through buffer tuning",
      "[개선] Greatly improved gesture recognition rate through initial sensor calibration"
    ],
    links: ["GitHub"]
  },

  vending: {
    title: "Smart IoT Vending Machine",
    subtitle: "Real-time inventory dashboard across terminals, server and warehouse",
    brief: "IoT vending machine real-time inventory dashboard",
    summary: "An integrated system that collects sales and sensor data from multiple vending machine terminals on a central server, and when stock runs low, physically restocks using stepper motors in an STM32-based smart warehouse.",
    role: [
      "Operated two vending machine terminals (Arduino) at the same time and implemented sensor/motor control logic",
      "Built a C socket server on Raspberry Pi and designed the MariaDB-backed database",
      "PHP Dashboard visualization using queries (temperature/humidity, sales monitoring)",
      "Implemented automatic restocking (RESTOCK) logic through STM32 stepper motor control"
    ],
    architecture: [
      "Arduino Vending Machine 1 & 2",
      "RPi Socket Server + DB",
      "PHP Web Dashboard",
      "STM32 Stock Manager"
    ],
    troubleshooting: [
      "[개선] Defined a protocol to prevent communication collisions when AI and sensor events occur simultaneously",
      "[최적화] Transaction management to reduce database query load in multi-device communication"
    ],
    links: ["GitHub Org"]
  },

  store: {
    title: "Store Management System (Edge Cloud)",
    subtitle: "Edge-Cloud IoT gateway integration based on Node-RED",
    brief: "Edge-Cloud IoT gateway store management",
    summary: "A cloud-infrastructure integration project that connects an edge device collecting local store sensor data with a central cloud, enabling real-time store monitoring and remote control.",
    role: [
      "Built Arduino-based local sensor/actuator nodes such as SG90, DHT11 and HC06",
      "Configured the data pipeline through the IBM Gateway to the Edge Cloud and Main Cloud",
      "Designed data flows with Node-RED and implemented the dashboard UI"
    ],
    architecture: [
      "Arduino Sensor Node",
      "IBM Gateway",
      "Node-RED Edge",
      "Cloud Dashboard"
    ],
    troubleshooting: [
      "[해결] Considered buffering/retransmission to prevent sensor data loss when the edge-cloud network is disconnected",
      "[최적화] Designed around power and timer conflicts when driving the servo motor and buzzer at the same time"
    ],
    links: ["GitHub"]
  },

  parking: {
    title: "Data-driven Autonomous Parking System",
    subtitle: "Verifying motor control error using polynomial curve fitting",
    brief: "Data-driven motor control error correction for autonomous parking",
    summary: "A hands-on project that, without test tooling, recorded dozens of driving runs in a spreadsheet and analyzed them to mathematically correct the physical error of the parking motor control.",
    role: [
      "Customized an RC-car-based platform and developed an algorithm to find empty parking spaces",
      "Measured actual travel distance against motor drive time and derived a polynomial in a spreadsheet",
      "Applied the derived formula in the motor control code to correct tire slip and wheel-size error"
    ],
    architecture: [
      "MCU Controller",
      "Motor Driver",
      "Distance Sensor",
      "Data Analysis Model"
    ],
    troubleshooting: [
      "[강점] Overcame the lack of QA testing experience through the ability to derive formulas from data and self-verify",
      "[해결] Compensated for motor speed loss caused by battery voltage drop with a formula weight"
    ],
    links: ["Local project (private repository)"]
  },

  cctv: {
    title: "Smart CCTV Monitoring",
    subtitle: "Raspberry Pi cross-compilation and video streaming",
    brief: "Cross-compile-based video streaming system",
    summary: "A Linux-based project that performed cross-compilation for the target board on Raspberry Pi (scp, nfs) and tried to integrate dual motors for camera angle control with MPEG-2 video streaming.",
    role: [
      "Built and deployed a cross-compile toolchain for Raspberry Pi on an Ubuntu host",
      "Applied MPEG-2 streaming to compose a real-time video delivery pipeline",
      "Designed motor control logic to drive a 2-axis (Pan/Tilt) camera"
    ],
    architecture: [
      "Host (Ubuntu)",
      "Target (Raspberry Pi)",
      "MPEG-2 Streamer",
      "Pan/Tilt Motor"
    ],
    troubleshooting: [
      "[배움] Learned the importance of the hardware timer structure through a timer resource conflict (a failure) during simultaneous motor control",
      "[성과] Video streaming (MPEG) ran correctly, improving my understanding of network-based media delivery"
    ],
    links: ["Local project (private repository)"]
  },

  yolo: {
    title: "YOLOv8-based Unmanned Checkout System",
    subtitle: "24.9% Jetson Nano E2E FPS improvement with TensorRT FP16 optimization",
    brief: "Jetson Nano product tracking · cart MQTT events",
    summary: "Detected four product classes with YOLOv8n on a Jetson Nano at mAP50-95 90.8%, and published ADD/REMOVE/PAYMENT events over MQTT using a ByteTrack-based cart state machine. I then converted YOLOv8s to TensorRT FP16, achieving FPS 4.116→5.140 (24.9% improvement) and p95 latency 260→211ms (18.6% reduction).",
    role: [
      "Collected and labeled 300 real-environment images plus 2,000 images of camera angles, low quality and cart-occlusion scenes (4 classes)",
      "Confirm ADD on 15% boundary overlap held for 2 consecutive frames; REMOVE priority handling and re-entry lock suppress ±1 event oscillation",
      "Confirm payment once when the cart's bottom-left coordinate enters the payment zone; OpenCV shows a 1-second completion indicator",
      "YOLOv8s FP16 TensorRT conversion — same video, 30-frame warm-up, 300-frame measurement, CSV/JSON/tegrastats benchmark"
    ],
    architecture: [
      "Jetson Nano (YOLOv8 + TensorRT)",
      "ByteTrack cart state machine",
      "OpenCV payment-zone decision",
      "MQTT Broker (retail/jetson-01/#)"
    ],
    troubleshooting: [
      "[분석] Detection loss after cart occlusion → ADD confirmed by preserving track ID and motion direction; duplicates prevented by a re-entry lock after REMOVE",
      "[최적화] PyTorch FPS 4.116 → TensorRT FP16 FPS 5.140 (+24.9%), p95 260.244→211.846ms (−18.6%), backend reduced 33.4%",
      "[신뢰성] With no n.pt baseline, the n FP16 7.132 FPS is separated as 'next candidate performance' rather than an improvement rate — an honest QA attitude without exaggeration"
    ],
    links: ["GitHub"]
  },

  gps: {
    title: "AVR Hybrid UART GPS Receiver",
    subtitle: "Library-free custom NMEA parser and memory optimization",
    brief: "ATmega328P Baremetal GPS / NMEA parser / memory optimization",
    target: "Embedded SW Engineer (low-power / resource-constrained domain)",
    hw: "Arduino UNO (ATmega328P), GY-NEO6MV2 (u-blox 6 GPS module), MS621FE backup battery",
    summary: "A project that drops dependence on an external library (TinyGPS++) and builds custom firmware that parses raw NMEA data directly, maximizing the resources of the 2KB RAM / 32KB Flash ATmega328P. To overcome the physical limit of a single hardware UART, I designed a hybrid communication architecture that physically separates GPS reception (bit-banging, PB4) from PC transmission (HW UART, PD1).",
    role: [
      "Designed the hybrid UART architecture — physically separating GPS reception (bit-banging PB4) from PC transmission (HW UART PD1)",
      "Implemented a custom NMEA parser based on $GPGGA comma counting (working around the strtok empty-field bug)",
      "Implemented NMEA format (DDMM.MMMMM) → decimal degrees (DD) / DMS conversion and automatic Google Maps URL generation",
      "Saved 17.3 percentage points of RAM and 24.6 percentage points of Flash versus TinyGPS++ (measured on PlatformIO builds)",
      "Physical-layer troubleshooting of multipath, voltage conflicts and pin bus conflicts"
    ],
    architecture: [
      "GPS RX — PB4 bit-banged soft serial (9600bps, 104μs/bit, center sampling)",
      "NMEA Parser — lightweight $GPGGA comma-counting parser (extracts latitude/longitude/time/Fix)",
      "Coordinate Converter — DDMM.MMMMM → DD (atof/60) / DMS (dtostrf)",
      "PC TX — HW UART PD1, direct UDR0/UCSR0A register control (non-blocking high-speed transmit)"
    ],
    detailSections: [
      {
        heading: "🏗️ 2.1 Hybrid UART Architecture",
        desc: "If the PC (USB-CH340) and the GPS share the single HW UART (pins 0 and 1), an electrical bus conflict occurs. GPS reception is bit-banged on PB4 and PC transmission uses HW UART PD1, eliminating physical interference at the source.",
        bullets: [
          "<strong>GPS RX (PB4)</strong> — detect the start bit → wait half a period (52μs) → sample at the exact center to recover the 9600bps bit stream",
          "<strong>PC TX (PD1)</strong> — write directly to the UDR0 register and poll UCSR0A[UDRE0] for asynchronous non-blocking transmit",
          "<strong>GPS RX pin NC</strong> — disconnect (NC) the GPS module's RX pin to make it listen-only and block garbage back-flow"
        ]
      },
      {
        heading: "⚙️ 2.2 Custom NMEA Parser and Coordinate Conversion",
        desc: "Standard strtok() skips empty fields (,,) and corrupts indexing. I implemented a lightweight parser combining pointers and comma counting, and convert NMEA coordinates into Google Maps URLs.",
        bullets: [
          "<strong>Comma-counting parser</strong> — after identifying $GPGGA, precisely extract latitude (2), longitude (4), Fix (6) and time (1) fields by comma index",
          "<strong>Coordinate conversion</strong> — DDMM.MMMMM format: DD = integer part, MM.MMMMM / 60 → 37.5421778°",
          "<strong>URL generation</strong> — convert float→string with dtostrf() and append to https://maps.google.com/?q="
        ]
      }
    ],
    troubleshooting: [
      "[해결] HW UART pin 0 conflict → separating onto PB4 bit-banging fully eliminated CH340 voltage overdrive and bus conflicts",
      "[분석] Fix LED on but [NO FIX] persisted → verified the code was sound via raw NMEA bypass output, then identified multipath SNR degradation (-161dBm threshold) as the cause",
      "[해결] After moving to a 9th-floor rooftop (line-of-sight), Hot Start (MS621FE backup battery) worked and coordinates were received within 5m error",
      "[최적화] 17.3 percentage points less RAM and 24.6 less Flash than TinyGPS++ — measured proof of the resource efficiency of direct baremetal C control"
    ],
    capabilitySummary: "Designed <strong>baremetal firmware that controls registers directly</strong> without external libraries in an extreme 2KB RAM · 32KB Flash environment. I have internalized the <strong>embedded engineer's debugging methodology</strong> of eliminating layered hypotheses — software timing, voltage conflicts, multipath — step by step.",
    links: ["GitHub"]
  },

  awsslack: {
    title: "AWS Slack Notification System",
    subtitle: "EventBridge → SNS → Lambda real-time security event alerts + IaC automation",
    brief: "AWS CloudTrail events → real-time Slack alerts / Terraform IaC / GitLab CI/CD",
    target: "DevOps / Cloud Engineer (AWS infrastructure monitoring domain)",
    hw: "AWS (EventBridge, SNS, Lambda Node.js 22.x), Terraform 1.5+, GitLab CI",
    summary: "A lightweight monitoring system that detects major security and operational events from the AWS console and resources (IAM, EC2, Console Login, etc.) in real time and sends alerts to a Slack channel. I modularized the infrastructure with Terraform and automated deployment with GitLab CI/CD to secure reusability and operational efficiency. Sharing SNS and Lambda as a common structure cut costs by about 12%.",
    role: [
      "Designed EventBridge Rules — event pattern filtering for IAM, EC2 and Sign-in events (minimizing unnecessary alerts)",
      "Implemented the Lambda (Node.js 22.x) alert logic — event parsing, color rule branching, Slack Block Kit message composition",
      "Designed a 3-module (eventbridge/sns/lambda) Terraform IaC with dev/prod environment separation",
      "Built a 4-stage GitLab CI/CD pipeline (validate→plan→deploy→cleanup) with secret management",
      "Removed duplicate resources by sharing SNS → about 12% cost reduction"
    ],
    architecture: [
      "CloudTrail API call → EventBridge (event pattern filtering)",
      "EventBridge → SNS Topic (fan-out) → Lambda trigger",
      "Lambda (Node.js) — event parsing + color branching + Slack Webhook POST",
      "Terraform modules: eventbridge / sns / lambda (independent state per environment)"
    ],
    detailSections: [
      {
        heading: "🏗️ 3.1 EventBridge Event Detection and Filtering",
        desc: "Of the hundreds of events CloudTrail emits, only those meaningful for security and operations are selected and forwarded to SNS. Blocking unnecessary Lambda invocations up front minimizes cost and noise.",
        bullets: [
          "<strong>IAM</strong>: AttachUserPolicy, CreateUser, DeleteUser, CreateAccessKey, ChangePassword, Detach*Policy",
          "<strong>EC2</strong>: RunInstances, StartInstances, StopInstances, TerminateInstances, Security Group inbound/outbound rule changes",
          "<strong>Sign-in</strong>: ConsoleLogin (detects Root and IAM user console access)"
        ]
      },
      {
        heading: "⚙️ 3.2 Lambda Alert Logic — Color Priority Branching",
        desc: "The Lambda function (app.js) extracts the CloudTrail detail from the SNS event and decides the Slack message color and shape by event type. Root account activity is detected with top priority.",
        bullets: [
          "<strong>Root user</strong> → Black (#000000): top-priority detection of highest-privilege account activity",
          "<strong>IAM Delete/Detach/Revoke</strong> → Red (#ff000f): risky permission changes",
          "<strong>IAM Create/Attach</strong> → Green (#00ff0f): ordinary permission changes",
          "<strong>ConsoleLogin</strong> → Blue (#0000ff): sign-in events",
          "<strong>EC2 Stop/Terminate</strong> → Red: risky state change | <strong>Others</strong> → Magenta"
        ]
      }
    ],
    troubleshooting: [
      "[설계] Adopted a shared SNS subscription structure instead of per-event Lambdas → fewer Lambda functions and about 12% lower cost",
      "[보안] Webhook URL / AWS credentials are managed only via GitLab CI Variables (masked/protected) — code exposure blocked at the source",
      "[운영] resource_group prevents concurrent apply conflicts, and independent state per environment isolates dev/prod",
      "[자동화] A rules: changes condition runs only the jobs of changed environments → avoids unnecessary plan/apply"
    ],
    capabilitySummary: "From AWS security event monitoring to IaC modularization and CI/CD pipeline automation, I <strong>designed and implemented the entire DevOps cycle on my own</strong>. Using the serverless EventBridge → SNS → Lambda architecture, I can build a <strong>cost-efficient and operationally stable real-time alert system</strong>.",
    links: ["GitLab"]
  }
};
