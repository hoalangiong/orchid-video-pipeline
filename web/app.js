function orchidApp() {
  return {
    // State
    tab: "home",
    createMode: "template",

    // Data
    topics: [],
    topicsLoading: true,
    configs: [],
    filteredConfigs: [],
    configsLoading: true,
    configSearch: "",

    // Editor
    selectedConfig: null,
    editForm: {
      titleText: "",
      subText: "",
      tips: [],
      outroText: "",
      colors: {},
      scenes: {},
      slug: "",
      sourceSlug: "",
    },

    // Auto-generate
    autoLoading: null,
    autoNote: "",
    errorText: "",
    aiTopic: "",
    aiLine: "",
    lines: {},

    // Clip folders the user copied into public/ by hand, newest first. Only the
    // AI path uses them: the script has to have exactly as many tips as the
    // folder has tipN files, and the hand-written templates are fixed at 4.
    footage: [],

    // Tab nào bấm dựng, để nút "Chỉnh sửa lại" quay về đúng chỗ đó. Trước đây nút
    // này luôn nhảy về tab "create" (video lan), nên dựng từ tab MC Vy xong bấm sửa
    // là rơi vào trang soạn của lan mà chưa chọn template -> lỗi.
    renderFrom: "create",

    // --- Mục MC Vy: state riêng, không dùng chung editForm với video lan ---
    mc: {
      slug: "mcvy-1",
      sourceSlug: "",
      mcVy: true,
      // Khoá MC, khớp với MC_OPTIONS trong src/McVyVideo.tsx
      mcId: "vy",
      mcPose: "talking",
      mcSide: "left",
      mcHeight: 42,
      busy: false,
      error: "",
      lines: [
        { text: "", caption: "" },
        { text: "", caption: "" },
        { text: "", caption: "" },
        { text: "", caption: "" },
        { text: "", caption: "" },
        { text: "", caption: "" },
      ],
    },
    // --- Mục "1 video + MC Vy": nhập 1 clip của mình, AI viết lời, MC phủ lên ---
    sv: {
      slug: "clipcuatoi-1",
      videoPath: "",
      bgFrames: 0,
      bgSeconds: 0,
      overlayPath: "",
      overlay: "",
      overlayOpacity: 35,
      ovlBusy: false,
      topic: "",
      note: "",
      count: 4,
      scenes: [],
      mcVy: true,
      mcId: "vy",
      mcPose: "talking",
      mcSide: "left",
      mcHeight: 42,
      importing: false,
      aiBusy: false,
      busy: false,
      error: "",
    },

    footageSlug: "",
    footageSearch: "",

    // Three hook variants from the AI (SOP slide 8). Empty for hand-written
    // templates, which carry one fixed hook.
    hooks: [],

    // Pre-publish checklist (SOP slide 18). Ticks are per-video, reset on render.
    checks: {},
    checklist: [
      "Hook có ít nhất 1 trong 3: vấn đề cụ thể / đối tượng cụ thể / kết quả cụ thể",
      "0,5-1 giây đầu đã có hình bắt mắt (cảnh vườn rộng, không cận 1 cây)",
      "Có đủ cỡ cảnh rộng - trung - cận, thị giác đổi mỗi 1-2 giây",
      "Câu quan trọng có chữ chạy lên đúng lúc, không lệch tiếng",
      "Sound effect dùng có chủ đích, không rải khắp video",
      "Sản phẩm (nếu có) xuất hiện tự nhiên trong phần thân, không nhồi",
      "CTA cuối nói rõ ưu đãi + giới hạn, hoặc chỉ vào giỏ hàng",
      "Khung 9:16 sạch, không viền đen, không cháy sáng / ngược nắng",
      "Đã kiểm tra Content check trên TikTok Studio (bỏ qua mục nhạc)",
      "Giờ đăng chọn theo dữ liệu người theo dõi thật của kênh",
    ],

    // Render
    rendering: false,
    jobId: null,
    progress: 0,
    statusText: "",
    outputUrl: null,
    pollInterval: null,

    async init() {
      await Promise.all([this.loadTopics(), this.loadConfigs(), this.loadLines(), this.loadFootage()]);
    },

    async loadLines() {
      try {
        const res = await fetch("/api/auto/lines");
        const data = await res.json();
        this.lines = data.lines || {};
      } catch (e) {
        console.error("Failed to load lines:", e);
      }
    },

    async loadFootage() {
      try {
        const res = await fetch("/api/footage");
        const data = await res.json();
        this.footage = data.footage || [];
      } catch (e) {
        console.error("Failed to load footage:", e);
      }
    },

    // ~250 folders qualify, so show the newest 12 unless the user searches. The
    // folder just copied in is first, which is almost always the one wanted.
    filteredFootage() {
      const q = this.footageSearch.trim().toLowerCase();
      if (!q) return this.footage.slice(0, 12);
      return this.footage.filter(f => f.slug.toLowerCase().includes(q)).slice(0, 12);
    },

    async loadTopics() {
      try {
        const res = await fetch("/api/topics");
        const data = await res.json();
        this.topics = data.topics || [];
      } catch (e) {
        console.error("Failed to load topics:", e);
      } finally {
        this.topicsLoading = false;
      }
    },

    async loadConfigs() {
      try {
        const res = await fetch("/api/configs");
        const data = await res.json();
        this.configs = data.configs || [];
        this.filteredConfigs = this.configs.slice(0, 50);
      } catch (e) {
        console.error("Failed to load configs:", e);
      } finally {
        this.configsLoading = false;
      }
    },

    filterConfigs() {
      const q = this.configSearch.toLowerCase();
      if (!q) {
        this.filteredConfigs = this.configs.slice(0, 50);
        return;
      }
      this.filteredConfigs = this.configs.filter(c =>
        c.slug.toLowerCase().includes(q) ||
        c.titleText.toLowerCase().includes(q)
      ).slice(0, 50);
    },

    selectTopic(cat) {
      this.tab = "create";
      this.createMode = "auto";
      // Auto-generate will be triggered by clicking the topic card in auto mode
    },

    selectConfig(cfg) {
      this.selectedConfig = cfg;
      // Hand-written templates carry one fixed hook - drop any picker left over
      // from a previous AI run.
      this.hooks = [];
      this.checks = {};
      this.editForm = {
        titleText: cfg.titleText,
        subText: cfg.subText,
        tips: cfg.tips.map(t => ({ ...t })),
        outroText: cfg.outroText,
        colors: { ...cfg.colors },
        scenes: { ...cfg.scenes },
        // Not editable, but the render needs it - hideProduct lives in here, and
        // without it every knowledge video gets an aloe vera bottle pasted on.
        flags: { ...cfg.flags },
        slug: cfg.slug + "-" + Date.now().toString(36),
        sourceSlug: cfg.slug,
      };
    },

    // One of the four fixed buttons: hand-written script, instant, never fails.
    autoGenerate(cat) {
      return this.loadScript({ cat }, cat);
    },

    // Anything the user typed: Gemini writes it, ~10s, can come back unusable.
    aiGenerate() {
      const topic = this.aiTopic.trim();
      if (!topic) {
        this.errorText = "Gõ chủ đề trước đã, ví dụ: lan bị nhện đỏ";
        return;
      }
      return this.loadScript(
        { topic, line: this.aiLine, footage: this.footageSlug },
        "__ai"
      );
    },

    // Ask the server for a fresh script. It picks the words and borrows an
    // existing episode's footage; the user edits after.
    async loadScript(payload, busyKey) {
      if (this.autoLoading) return;
      this.autoLoading = busyKey;
      this.autoNote = "";
      this.errorText = "";

      try {
        const data = await this.apiPost("/api/auto", payload);

        this.selectedConfig = data.config;
        this.editForm = {
          titleText: data.config.titleText,
          subText: data.config.subText,
          tips: data.config.tips.map(t => ({ ...t })),
          outroText: data.config.outroText,
          colors: { ...data.config.colors },
          scenes: { ...data.config.scenes },
          flags: { ...data.config.flags },
          slug: data.config.slug,
          sourceSlug: data.sourceSlug,
        };
        this.autoNote = data.note;
        // The AI path returns three hooks; hand-written templates return none.
        this.hooks = data.hooks || [];
        this.checks = {};
      } catch (e) {
        this.errorText = e.message;
      } finally {
        this.autoLoading = null;
      }
    },

    // Swap the rendered hook for one of the other two variants. Which hook holds
    // the first 3 seconds isn't predictable, so the user picks.
    applyHook(i) {
      if (this.hooks[i]) this.editForm.titleText = this.hooks[i];
    },

    checkedCount() {
      return Object.values(this.checks).filter(Boolean).length;
    },

    // Every call goes through here so a crashed server (which answers with an
    // HTML error page, not JSON) reports something readable instead of
    // "Unexpected token '<'".
    async apiPost(url, body) {
      let res;
      try {
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch {
        throw new Error("Không kết nối được server. Kiểm tra cửa sổ server còn chạy không.");
      }

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server trả về lỗi ${res.status}. Xem log ở cửa sổ server.`);
      }

      if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
      return data;
    },

    async apiGet(url) {
      let res;
      try {
        res = await fetch(url);
      } catch {
        throw new Error("Mất kết nối server giữa lúc đang xử lý.");
      }
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(`Server trả về lỗi ${res.status}.`);
      }
    },

    // --- Mục MC Vy ---

    mcSceneLabel(i) {
      const names = ["Cảnh mở đầu (hook)", "Câu 1", "Câu 2", "Câu 3", "Câu 4", "Cảnh kết (CTA)"];
      return names[i] || `Cảnh ${i + 1}`;
    },

    // Giọng đọc + dựng video cho mục MC Vy. Cùng nhịp với startRender() nhưng gọi
    // /api/mcvy/* để hai luồng không đụng nhau.
    async mcRun() {
      if (this.mc.busy) return;
      const lines = this.mc.lines.map(s => s.text.trim());
      if (lines.some(t => !t)) {
        this.mc.error = "Còn cảnh chưa có lời thoại. Điền đủ 6 cảnh rồi bấm lại.";
        return;
      }
      if (!this.mc.slug.trim()) {
        this.mc.error = "Đặt tên video trước đã (không dấu, không cách).";
        return;
      }

      this.mc.busy = true;
      this.mc.error = "";
      this.renderFrom = "mcvy";
      this.tab = "processing";
      this.progress = 0;
      this.statusText = "Đang tạo giọng đọc MC Vy...";

      try {
        const slug = this.mc.slug.trim();

        const ttsData = await this.apiPost("/api/tts", {
          slug,
          lines: lines.map(text => ({ speaker: "VY", text })),
        });

        while (true) {
          await new Promise(r => setTimeout(r, 2000));
          const p = await this.apiGet(`/api/tts/${ttsData.jobId}`);
          if (p.status === "done") { this.progress = 30; break; }
          if (p.status === "error") throw new Error("Tạo giọng đọc thất bại: " + (p.error || "không rõ nguyên nhân"));
          this.progress = Math.round((p.progress || 0) * 0.3);
          this.statusText = `Đang tạo giọng đọc (${p.progress || 0}%)...`;
        }

        this.statusText = "Đang dựng video có MC Vy...";
        const captions = {};
        const keys = ["title", "tip1", "tip2", "tip3", "tip4", "outro"];
        this.mc.lines.forEach((s, i) => { captions[keys[i]] = s.caption.trim(); });

        const renderData = await this.apiPost("/api/mcvy/render", {
          slug,
          sourceSlug: this.mc.sourceSlug,
          config: {
            slug,
            captions,
            scenes: {},
            colors: { accent: "#ffd54a", sub: "#ffffff", bg: "#000000" },
            mcVy: this.mc.mcVy,
            mcId: this.mc.mcId,
            mcPose: this.mc.mcPose,
            mcSide: this.mc.mcSide,
            mcHeight: this.mc.mcHeight,
          },
        });

        this.jobId = renderData.jobId;

        while (true) {
          await new Promise(r => setTimeout(r, 2000));
          const p = await this.apiGet(`/api/mcvy/render/${this.jobId}`);
          if (p.status === "done") {
            this.progress = 100;
            this.statusText = "Hoàn thành!";
            this.outputUrl = `/api/mcvy/output/${this.jobId}`;
            this.tab = "preview";
            break;
          }
          if (p.status === "error") throw new Error("Dựng video thất bại: " + (p.error || "không rõ nguyên nhân"));
          this.progress = Math.round(30 + (p.progress || 0) * 0.7);
          this.statusText = p.status === "bundling"
            ? "Đang chuẩn bị (lần đầu hơi lâu, khoảng 1-2 phút)..."
            : `Đang dựng video (${p.progress || 0}%)...`;
        }
      } catch (e) {
        this.mc.error = e.message;
        this.statusText = "Lỗi: " + e.message;
        this.tab = "mcvy";
      } finally {
        this.mc.busy = false;
      }
    },

    // --- Mục "1 video + MC Vy" ---

    // Tên cảnh khớp tên file giọng đọc: cảnh đầu là title, cảnh cuối là outro,
    // giữa là tip1, tip2... (đúng quy ước của bộ tạo giọng đang chạy).
    svKeys(n) {
      const keys = ["title"];
      for (let i = 1; i <= n - 2; i++) keys.push(`tip${i}`);
      keys.push("outro");
      return keys;
    },

    svSceneLabel(i, total) {
      if (i === 0) return "Cảnh 1 — Hook mở đầu";
      if (i === total - 1) return `Cảnh ${i + 1} — CTA kết`;
      return `Cảnh ${i + 1}`;
    },

    async svImport() {
      if (this.sv.importing) return;
      this.sv.importing = true;
      this.sv.error = "";
      try {
        const data = await this.apiPost("/api/mcvy/import", {
          slug: this.sv.slug.trim(),
          videoPath: this.sv.videoPath,
        });
        this.sv.bgFrames = data.frames;
        this.sv.bgSeconds = data.seconds;
      } catch (e) {
        this.sv.bgFrames = 0;
        this.sv.bgSeconds = 0;
        this.sv.error = e.message;
      } finally {
        this.sv.importing = false;
      }
    },

    async svOverlay() {
      if (this.sv.ovlBusy) return;
      this.sv.ovlBusy = true;
      this.sv.error = "";
      try {
        const data = await this.apiPost("/api/mcvy/overlay", {
          slug: this.sv.slug.trim(),
          imagePath: this.sv.overlayPath,
        });
        this.sv.overlay = data.file;
      } catch (e) {
        this.sv.overlay = "";
        this.sv.error = e.message;
      } finally {
        this.sv.ovlBusy = false;
      }
    },

    async svWrite() {
      if (this.sv.aiBusy) return;
      if (!this.sv.topic.trim()) {
        this.sv.error = "Gõ chủ đề trước đã, ví dụ: giới thiệu chậu lan hoàng hậu đang ra hoa";
        return;
      }
      this.sv.aiBusy = true;
      this.sv.error = "";
      try {
        const data = await this.apiPost("/api/mcvy/script", {
          topic: this.sv.topic.trim(),
          count: this.sv.count,
          note: this.sv.note,
        });
        this.sv.scenes = data.scenes.map(s => ({ text: s.text, caption: s.caption || "" }));
      } catch (e) {
        this.sv.error = e.message;
      } finally {
        this.sv.aiBusy = false;
      }
    },

    async svRun() {
      if (this.sv.busy) return;
      if (!this.sv.bgFrames) {
        this.sv.error = "Chưa nạp clip nền. Dán đường dẫn rồi bấm \"Nạp clip\".";
        return;
      }
      const texts = this.sv.scenes.map(s => s.text.trim());
      if (!texts.length || texts.some(t => !t)) {
        this.sv.error = "Còn cảnh chưa có lời thoại.";
        return;
      }

      this.sv.busy = true;
      this.sv.error = "";
      this.renderFrom = "single";
      this.tab = "processing";
      this.progress = 0;
      this.statusText = "Đang tạo giọng đọc MC Vy...";

      try {
        const slug = this.sv.slug.trim();

        const ttsData = await this.apiPost("/api/tts", {
          slug,
          lines: texts.map(text => ({ speaker: "VY", text })),
        });

        while (true) {
          await new Promise(r => setTimeout(r, 2000));
          const p = await this.apiGet(`/api/tts/${ttsData.jobId}`);
          if (p.status === "done") { this.progress = 30; break; }
          if (p.status === "error") throw new Error("Tạo giọng đọc thất bại: " + (p.error || "không rõ nguyên nhân"));
          this.progress = Math.round((p.progress || 0) * 0.3);
          this.statusText = `Đang tạo giọng đọc (${p.progress || 0}%)...`;
        }

        this.statusText = "Đang dựng video có MC Vy...";
        const keys = this.svKeys(this.sv.scenes.length);
        const captions = {};
        this.sv.scenes.forEach((s, i) => { captions[keys[i]] = s.caption.trim(); });

        const renderData = await this.apiPost("/api/mcvy/render", {
          slug,
          config: {
            slug,
            captions,
            scenes: {},
            colors: { accent: "#ffd54a", sub: "#ffffff", bg: "#000000" },
            bgSingle: true,
            bgFrames: this.sv.bgFrames,
            overlay: this.sv.overlay,
            overlayOpacity: this.sv.overlayOpacity,
            mcVy: this.sv.mcVy,
            mcId: this.sv.mcId,
            mcPose: this.sv.mcPose,
            mcSide: this.sv.mcSide,
            mcHeight: this.sv.mcHeight,
          },
        });

        this.jobId = renderData.jobId;

        while (true) {
          await new Promise(r => setTimeout(r, 2000));
          const p = await this.apiGet(`/api/mcvy/render/${this.jobId}`);
          if (p.status === "done") {
            this.progress = 100;
            this.statusText = "Hoàn thành!";
            this.outputUrl = `/api/mcvy/output/${this.jobId}`;
            this.tab = "preview";
            break;
          }
          if (p.status === "error") throw new Error("Dựng video thất bại: " + (p.error || "không rõ nguyên nhân"));
          this.progress = Math.round(30 + (p.progress || 0) * 0.7);
          this.statusText = p.status === "bundling"
            ? "Đang chuẩn bị (lần đầu hơi lâu, khoảng 1-2 phút)..."
            : `Đang dựng video (${p.progress || 0}%)...`;
        }
      } catch (e) {
        this.sv.error = e.message;
        this.statusText = "Lỗi: " + e.message;
        this.tab = "single";
      } finally {
        this.sv.busy = false;
      }
    },

    async startRender() {
      if (this.rendering) return;

      this.rendering = true;
      this.renderFrom = "create";
      this.tab = "processing";
      // A re-render is a new file, so the checklist starts over.
      this.checks = {};
      this.progress = 0;
      this.statusText = "Đang tạo giọng đọc...";

      try {
        // Step 1: Generate TTS
        const ttsLines = [
          { speaker: "MN", text: this.editForm.titleText.replace(/\n/g, ". ") },
          ...this.editForm.tips.map(t => ({ speaker: "MN", text: `${t.title}. ${t.desc}` })),
          { speaker: "MN", text: this.editForm.outroText },
        ];

        const ttsData = await this.apiPost("/api/tts", {
          slug: this.editForm.slug,
          lines: ttsLines,
        });

        // Poll TTS
        let ttsDone = false;
        while (!ttsDone) {
          await new Promise(r => setTimeout(r, 2000));
          const pollData = await this.apiGet(`/api/tts/${ttsData.jobId}`);

          if (pollData.status === "done") {
            ttsDone = true;
            this.progress = 30;
          } else if (pollData.status === "error") {
            throw new Error("Tạo giọng đọc thất bại: " + (pollData.error || "không rõ nguyên nhân"));
          } else {
            this.progress = Math.round((pollData.progress || 0) * 0.3);
            this.statusText = `Đang tạo giọng đọc (${pollData.progress || 0}%)...`;
          }
        }

        // Step 2: Start render
        this.statusText = "Đang dựng video...";
        const config = {
          ...this.editForm,
          scenes: this.editForm.scenes,
          colors: this.editForm.colors,
        };

        const renderData = await this.apiPost("/api/render", {
          slug: this.editForm.slug,
          config,
          sourceSlug: this.editForm.sourceSlug,
        });

        this.jobId = renderData.jobId;

        // Poll render
        let renderDone = false;
        while (!renderDone) {
          await new Promise(r => setTimeout(r, 2000));
          const pollData = await this.apiGet(`/api/render/${this.jobId}`);

          if (pollData.status === "done") {
            renderDone = true;
            this.progress = 100;
            this.statusText = "Hoàn thành!";
            this.outputUrl = `/api/output/${this.jobId}`;
            this.rendering = false;
            this.tab = "preview";
          } else if (pollData.status === "error") {
            throw new Error("Dựng video thất bại: " + (pollData.error || "không rõ nguyên nhân"));
          } else {
            this.progress = Math.round(30 + (pollData.progress || 0) * 0.7);
            this.statusText = pollData.status === "bundling"
              ? "Đang chuẩn bị (lần đầu hơi lâu, khoảng 1-2 phút)..."
              : `Đang dựng video (${pollData.progress || 0}%)...`;
          }
        }

      } catch (e) {
        console.error("Render failed:", e);
        this.statusText = "Lỗi: " + e.message;
        this.rendering = false;
      }
    },

    reset() {
      this.tab = "home";
      this.selectedConfig = null;
      this.jobId = null;
      this.outputUrl = null;
      this.progress = 0;
      this.rendering = false;
      this.autoNote = "";
      this.errorText = "";
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
        this.pollInterval = null;
      }
    },

    // Format category names to Vietnamese
    formatCat(cat) {
      const map = {
        "mathoa": "🌺 Mật hoa",
        "chamsoc": "🌿 Chăm sóc lan",
        "thamkhao": "📚 Tham khảo",
        "vuongian": "🏡 Vườn giàn",
        "bo": "💰 Bổ sung",
      };
      return map[cat] || cat;
    },

    // Edit current video - go back to editor with same config
    editCurrentVideo() {
      // Quay về đúng tab đã dựng video này. Tab "create" (video lan) chỉ hiện được
      // khi đã chọn template, nên nếu chưa có thì về trang chủ thay vì ra trang trắng.
      const ve = this.renderFrom || "create";
      this.tab = ve === "create" && !this.selectedConfig ? "home" : ve;
      this.outputUrl = null;
      this.jobId = null;
      // Giữ nguyên nội dung đã soạn (selectedConfig/editForm/mc/sv) để sửa tiếp
    },
  };
}
