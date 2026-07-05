import type { Lesson } from './types'

/* ------------------------------------------------------------------ */
/* The 11 lessons of the AI mastery ladder                             */
/* ------------------------------------------------------------------ */

export const AI_LADDER_LESSONS: Lesson[] = [
  /* ---------------------------------------------------- 01 · Codex */
  {
    step: 1,
    icon: '💬',
    from: { en: 'Chatting with AI', vi: 'Trò chuyện với AI' },
    to: { en: 'Coding agents', vi: 'Agent lập trình' },
    title: { en: 'From chatting to building', vi: 'Từ trò chuyện đến tạo ra sản phẩm' },
    tagline: {
      en: 'Move from chatting to building real things.',
      vi: 'Chuyển từ trò chuyện sang tạo ra sản phẩm thật.',
    },
    hook: {
      en: 'You have asked chatbots a thousand questions — then copied the answers out by hand. The next step is an AI that does not just answer. It does.',
      vi: 'Bạn đã hỏi chatbot cả nghìn câu — rồi tự tay sao chép từng câu trả lời. Bước tiếp theo là một AI không chỉ trả lời, mà bắt tay vào làm.',
    },
    body: [
      {
        en: 'A coding agent like Codex or Claude Code does not hand you snippets to paste. You give it a goal — “build me a landing page”, “fix this bug” — and it plans, writes the files, runs the code, sees the errors, and fixes them in a loop.',
        vi: 'Agent lập trình như Codex hay Claude Code không đưa bạn từng đoạn code để dán. Bạn giao mục tiêu — “dựng cho tôi một landing page”, “sửa lỗi này” — và nó tự lập kế hoạch, viết file, chạy code, nhìn thấy lỗi và tự sửa trong một vòng lặp.',
      },
      {
        en: 'The shift to make: stop asking “what should I ask?” and start asking “what should I delegate?”. Describe the outcome you want, let the agent work, then review the result like you would a teammate’s.',
        vi: 'Điều cần thay đổi: đừng nghĩ “mình nên hỏi gì?” mà hãy nghĩ “mình nên giao việc gì?”. Mô tả kết quả bạn muốn, để agent làm, rồi kiểm tra thành quả như xem bài của một đồng nghiệp.',
      },
    ],
    example: {
      label: { en: 'A delegation, not a question', vi: 'Một lời giao việc, không phải câu hỏi' },
      code: 'Build a one-page portfolio site.\nDark theme, my name front and center,\nthree project cards. Deploy-ready.',
    },
    challenge: {
      kind: 'quiz',
      prompt: {
        en: 'You want a personal website this weekend. What is the agent-era move?',
        vi: 'Bạn muốn có website cá nhân trong cuối tuần này. Cách làm của thời đại agent là gì?',
      },
      options: [
        {
          text: {
            en: 'Ask a chatbot for HTML, paste each file by hand, ask again when it breaks.',
            vi: 'Hỏi chatbot xin HTML, tự dán từng file, hỏng lại hỏi tiếp.',
          },
          feedback: {
            en: 'That works — but you have become the compiler. You will spend the whole weekend copy-pasting.',
            vi: 'Cũng được — nhưng bạn đang tự biến mình thành “trình biên dịch”. Cả cuối tuần sẽ trôi qua trong copy-paste.',
          },
        },
        {
          text: {
            en: 'Describe the site to a coding agent and let it create, run and fix the files itself.',
            vi: 'Mô tả website cho một agent lập trình và để nó tự tạo, tự chạy, tự sửa các file.',
          },
          correct: true,
          feedback: {
            en: 'Exactly. You describe outcomes and review results — the agent does the labor.',
            vi: 'Chính xác. Bạn mô tả kết quả và kiểm tra thành quả — agent lo phần tay chân.',
          },
        },
        {
          text: {
            en: 'Watch a 3-hour tutorial first so you can do everything manually.',
            vi: 'Xem trước một tutorial 3 tiếng để có thể tự làm mọi thứ bằng tay.',
          },
          feedback: {
            en: 'Learning is great — but the ladder is about leverage. Build with the agent, and learn as you review its work.',
            vi: 'Học là tốt — nhưng chiếc thang này nói về đòn bẩy. Hãy xây cùng agent, và học ngay trong lúc xem lại việc nó làm.',
          },
        },
      ],
    },
    action: {
      en: 'Today: take one thing you would normally ask a chatbot, and hand it to a coding agent as a goal instead.',
      vi: 'Hôm nay: chọn một việc bạn thường hỏi chatbot, và giao nó cho một agent lập trình như một mục tiêu.',
    },
  },

  /* --------------------------------------------------- 02 · Memory */
  {
    step: 2,
    icon: '🧠',
    from: { en: 'Using Claude', vi: 'Dùng Claude' },
    to: { en: 'Memory', vi: 'Memory' },
    title: { en: 'An AI that remembers you', vi: 'Một AI ghi nhớ bạn' },
    tagline: {
      en: 'Claude remembers you across every chat.',
      vi: 'Claude ghi nhớ bạn qua mọi cuộc trò chuyện.',
    },
    hook: {
      en: 'Every new chat, you introduce yourself again. Your stack, your style, your project — like a first date, every single day.',
      vi: 'Mỗi lần mở chat mới, bạn lại tự giới thiệu từ đầu. Công nghệ bạn dùng, phong cách bạn thích, dự án bạn làm — như buổi hẹn đầu tiên, lặp lại mỗi ngày.',
    },
    body: [
      {
        en: 'Memory lets Claude carry stable facts about you across conversations: who you are, what you are building, how you like your answers. Tell it once — every future chat starts already warm.',
        vi: 'Memory cho phép Claude mang theo những thông tin ổn định về bạn qua các cuộc trò chuyện: bạn là ai, đang xây gì, thích câu trả lời kiểu nào. Nói một lần — mọi cuộc chat sau đều bắt đầu với sự thấu hiểu.',
      },
      {
        en: 'The real skill is curation. Memory should hold things that stay true — not today’s task, not secrets, not facts that expire by the hour.',
        vi: 'Kỹ năng thật sự nằm ở chọn lọc. Memory nên chứa những điều luôn đúng — không phải việc của hôm nay, không phải bí mật, không phải dữ kiện hết hạn sau một giờ.',
      },
    ],
    example: {
      label: { en: 'Worth remembering', vi: 'Đáng để ghi nhớ' },
      code: 'I build web apps in TypeScript.\nI prefer short answers, code first.\nMy product is a learning game, LAEN.',
    },
    challenge: {
      kind: 'multi',
      prompt: {
        en: 'Select everything that belongs in long-term memory:',
        vi: 'Chọn tất cả những gì nên nằm trong bộ nhớ dài hạn:',
      },
      options: [
        {
          text: { en: '“I prefer TypeScript over JavaScript”', vi: '“Tôi thích TypeScript hơn JavaScript”' },
          good: true,
          feedback: { en: 'A stable preference — perfect for memory.', vi: 'Một sở thích ổn định — hoàn hảo cho memory.' },
        },
        {
          text: { en: '“Keep answers short, code examples first”', vi: '“Trả lời ngắn gọn, ưu tiên ví dụ code”' },
          good: true,
          feedback: { en: 'How you like to be answered rarely changes.', vi: 'Cách bạn muốn được trả lời hiếm khi thay đổi.' },
        },
        {
          text: { en: '“I am building a 3D learning game”', vi: '“Tôi đang xây một game học tập 3D”' },
          good: true,
          feedback: { en: 'Your ongoing project — context every chat can use.', vi: 'Dự án dài hạn — ngữ cảnh mà mọi cuộc chat đều dùng được.' },
        },
        {
          text: { en: '“My bank password is Hunter2”', vi: '“Mật khẩu ngân hàng của tôi là Hunter2”' },
          good: false,
          feedback: { en: 'Never store secrets in an AI’s memory. Ever.', vi: 'Tuyệt đối không lưu bí mật vào bộ nhớ của AI.' },
        },
        {
          text: { en: '“Bitcoin is at $92,300 right now”', vi: '“Bitcoin đang ở giá 92.300 đô”' },
          good: false,
          feedback: { en: 'Volatile facts go stale in minutes.', vi: 'Dữ kiện biến động sẽ lỗi thời trong vài phút.' },
        },
        {
          text: { en: '“Fix the typo on line 40 today”', vi: '“Hôm nay sửa lỗi chính tả ở dòng 40”' },
          good: false,
          feedback: { en: 'That is a task for one chat — not a fact about you.', vi: 'Đó là việc của một cuộc chat — không phải thông tin về bạn.' },
        },
      ],
    },
    action: {
      en: 'Open your AI’s memory settings and teach it three stable facts about you and your work.',
      vi: 'Mở phần cài đặt memory của AI và dạy nó ba điều ổn định về bạn và công việc của bạn.',
    },
  },

  /* --------------------------------------------------- 03 · Cowork */
  {
    step: 3,
    icon: '🗂️',
    from: { en: 'Claude Chat', vi: 'Claude Chat' },
    to: { en: 'Cowork', vi: 'Cowork' },
    title: { en: 'From words to real files', vi: 'Từ lời nói đến file thật' },
    tagline: {
      en: 'Saves real files to your Mac and runs sub-agents.',
      vi: 'Lưu file thật vào máy của bạn và chạy các sub-agent.',
    },
    hook: {
      en: 'Chat gives you words in a window. Cowork gives you files on your machine — real folders, real documents, really done.',
      vi: 'Chat cho bạn chữ trong một khung cửa sổ. Cowork cho bạn file ngay trên máy — thư mục thật, tài liệu thật, xong việc thật.',
    },
    body: [
      {
        en: 'Cowork works inside your actual computer: it reads the messy folder, renames the files, drafts the documents, and saves everything to disk. It can even split big jobs across sub-agents working in parallel.',
        vi: 'Cowork làm việc ngay trong máy tính của bạn: đọc thư mục bừa bộn, đổi tên file, soạn tài liệu, và lưu tất cả vào ổ đĩa. Nó còn có thể chia việc lớn cho nhiều sub-agent chạy song song.',
      },
      {
        en: 'Use chat to think. Use Cowork when the deliverable is a file — or a hundred of them.',
        vi: 'Dùng chat để suy nghĩ. Dùng Cowork khi thành phẩm là một file — hoặc một trăm file.',
      },
    ],
    challenge: {
      kind: 'quiz',
      prompt: { en: 'Which job is Cowork built for?', vi: 'Việc nào sinh ra là dành cho Cowork?' },
      options: [
        {
          text: { en: 'Explain what a vector database is', vi: 'Giải thích vector database là gì' },
          feedback: {
            en: 'Chat handles explanations perfectly — no files involved.',
            vi: 'Chat giải thích quá tốt rồi — việc này không đụng đến file nào.',
          },
        },
        {
          text: {
            en: 'Sort 300 files in Downloads into dated project folders',
            vi: 'Sắp xếp 300 file trong Downloads vào các thư mục dự án theo ngày',
          },
          correct: true,
          feedback: {
            en: 'Right — that is real file work on your machine. Chat can only describe it; Cowork actually does it.',
            vi: 'Chuẩn — đó là việc thao tác file thật trên máy bạn. Chat chỉ mô tả được; Cowork thì làm thật.',
          },
        },
        {
          text: { en: 'Settle a debate about tabs versus spaces', vi: 'Phân xử tranh luận tab hay space' },
          feedback: {
            en: 'Opinions need no disk access. Chat is fine for that one.',
            vi: 'Tranh luận thì không cần quyền ghi ổ đĩa. Chat là đủ.',
          },
        },
      ],
    },
    action: {
      en: 'Pick your messiest folder and let Cowork reorganize it while you watch.',
      vi: 'Chọn thư mục bừa bộn nhất của bạn và để Cowork dọn dẹp nó trong lúc bạn quan sát.',
    },
  },

  /* ------------------------------------------------- 04 · Projects */
  {
    step: 4,
    icon: '📁',
    from: { en: 'Memory', vi: 'Memory' },
    to: { en: 'Projects', vi: 'Projects' },
    title: { en: 'A workspace that is always briefed', vi: 'Không gian làm việc luôn nắm rõ bối cảnh' },
    tagline: {
      en: 'Load your files and rules into every session.',
      vi: 'Nạp sẵn file và quy tắc của bạn vào mọi phiên làm việc.',
    },
    hook: {
      en: 'Memory knows who you are. A Project knows what you are working on — files, rules and goals, loaded into every session.',
      vi: 'Memory biết bạn là ai. Project biết bạn đang làm gì — file, quy tắc và mục tiêu, nạp sẵn vào mọi phiên.',
    },
    body: [
      {
        en: 'A Project is a workspace with context that is always there: brand guidelines, specs, code style, the plan. Every chat inside it starts already briefed — no more re-pasting the same three documents.',
        vi: 'Project là một không gian làm việc với ngữ cảnh luôn sẵn sàng: bộ nhận diện thương hiệu, đặc tả, quy ước code, kế hoạch. Mọi cuộc chat bên trong đều bắt đầu với đầy đủ thông tin — không còn phải dán lại ba tài liệu quen thuộc.',
      },
      {
        en: 'Give each initiative its own Project. Feed it the few documents that define the work, plus instructions for how to help.',
        vi: 'Mỗi dự án lớn nên có một Project riêng. Nạp vào đó vài tài liệu cốt lõi định hình công việc, kèm chỉ dẫn về cách AI nên hỗ trợ.',
      },
    ],
    challenge: {
      kind: 'multi',
      prompt: {
        en: 'You create a Project for a website redesign. What goes in it?',
        vi: 'Bạn tạo một Project cho việc thiết kế lại website. Nên đưa gì vào?',
      },
      options: [
        {
          text: { en: 'Brand & style guide (colors, tone of voice)', vi: 'Bộ nhận diện thương hiệu (màu sắc, giọng điệu)' },
          good: true,
          feedback: { en: 'Core context every design chat needs.', vi: 'Ngữ cảnh cốt lõi mọi cuộc chat thiết kế đều cần.' },
        },
        {
          text: { en: 'Current sitemap and page list', vi: 'Sitemap hiện tại và danh sách trang' },
          good: true,
          feedback: { en: 'Defines the territory you are redesigning.', vi: 'Xác định phạm vi bạn đang thiết kế lại.' },
        },
        {
          text: {
            en: 'Instruction: “Always propose mobile-first layouts”',
            vi: 'Chỉ dẫn: “Luôn đề xuất bố cục mobile-first”',
          },
          good: true,
          feedback: { en: 'Project instructions steer every session.', vi: 'Chỉ dẫn của Project định hướng mọi phiên làm việc.' },
        },
        {
          text: { en: 'Your entire email inbox', vi: 'Toàn bộ hộp thư email của bạn' },
          good: false,
          feedback: { en: 'Context is fuel, noise is smoke. Curate.', vi: 'Ngữ cảnh là nhiên liệu, nhiễu là khói. Hãy chọn lọc.' },
        },
        {
          text: { en: 'Three years of unrelated invoices', vi: 'Ba năm hoá đơn không liên quan' },
          good: false,
          feedback: { en: 'Irrelevant documents dilute every answer.', vi: 'Tài liệu không liên quan làm loãng mọi câu trả lời.' },
        },
      ],
    },
    action: {
      en: 'Create one Project for your main initiative and drop its three defining documents inside.',
      vi: 'Tạo một Project cho dự án chính của bạn và đưa vào ba tài liệu quan trọng nhất.',
    },
  },

  /* --------------------------------------------------- 05 · Skills */
  {
    step: 5,
    icon: '🧩',
    from: { en: 'Projects', vi: 'Projects' },
    to: { en: 'Skills', vi: 'Skills' },
    title: { en: '200 words → one command', vi: '200 chữ → một câu lệnh' },
    tagline: {
      en: 'Turn a 200-word prompt into one command.',
      vi: 'Biến một prompt 200 chữ thành một câu lệnh duy nhất.',
    },
    hook: {
      en: 'You paste the same 200-word prompt every Friday. That prompt wants to be a command.',
      vi: 'Thứ Sáu nào bạn cũng dán lại đúng một prompt 200 chữ. Prompt đó đang khao khát được trở thành một câu lệnh.',
    },
    body: [
      {
        en: 'A skill packages a repeatable prompt — instructions, examples, quality bar — into one command like /review-draft. Write it once, run it forever. Your whole team can run it too, and it behaves the same every time.',
        vi: 'Skill đóng gói một prompt lặp lại — chỉ dẫn, ví dụ, tiêu chuẩn chất lượng — thành một câu lệnh như /review-draft. Viết một lần, chạy mãi mãi. Cả nhóm của bạn cũng chạy được, và lần nào kết quả cũng nhất quán.',
      },
      {
        en: 'If you have typed the same prompt three times, that is a skill telling you it wants to exist.',
        vi: 'Nếu bạn đã gõ cùng một prompt ba lần, đó là một skill đang nhắc bạn rằng nó muốn được ra đời.',
      },
    ],
    example: {
      label: { en: '200 words become one command', vi: '200 chữ trở thành một câu lệnh' },
      code: '# before: paste style guide + checklist + tone rules…\n# after:\n/review-draft blog-post.md',
    },
    challenge: {
      kind: 'terminal',
      prompt: {
        en: 'Your weekly draft-review prompt is now a skill named “review-draft”. Run it on draft.md — type the command:',
        vi: 'Prompt kiểm tra bản nháp hằng tuần của bạn giờ là một skill tên “review-draft”. Hãy chạy nó với file draft.md — gõ câu lệnh:',
      },
      placeholder: '/…',
      pattern: '^\\/review-draft(\\s+\\S+)?$',
      hint: {
        en: 'Skills run as slash commands: /skill-name file',
        vi: 'Skill chạy bằng lệnh gạch chéo: /tên-skill tên-file',
      },
      success: {
        en: 'Skill executed — the 200-word ritual is now a single keystroke away.',
        vi: 'Skill đã chạy — nghi thức 200 chữ giờ chỉ còn cách bạn một lần gõ phím.',
      },
    },
    action: {
      en: 'Find the prompt you re-type most often and turn it into a skill this week.',
      vi: 'Tìm prompt bạn gõ lại nhiều nhất và biến nó thành một skill ngay trong tuần này.',
    },
  },

  /* ----------------------------------------------- 06 · Connectors */
  {
    step: 6,
    icon: '🔌',
    from: { en: 'Skills', vi: 'Skills' },
    to: { en: 'Connectors', vi: 'Connectors' },
    title: { en: 'Plug AI into where work lives', vi: 'Cắm AI vào nơi công việc diễn ra' },
    tagline: {
      en: 'Wire Gmail, Notion and Slack into Claude.',
      vi: 'Nối Gmail, Notion và Slack thẳng vào Claude.',
    },
    hook: {
      en: 'Your AI is brilliant but locked in a room. Connectors hand it the keys to where your work actually lives.',
      vi: 'AI của bạn rất giỏi nhưng đang bị nhốt trong phòng kín. Connector trao cho nó chìa khoá đến nơi công việc của bạn thật sự diễn ra.',
    },
    body: [
      {
        en: 'Connectors (built on MCP) plug Claude into Gmail, Notion, Slack, calendars and more. Instead of you copying data in and results out, the AI reads and acts inside those tools directly — with your permission.',
        vi: 'Connector (xây trên chuẩn MCP) cắm Claude vào Gmail, Notion, Slack, lịch và nhiều công cụ khác. Thay vì bạn chép dữ liệu vào rồi chép kết quả ra, AI đọc và hành động ngay bên trong các công cụ đó — với sự cho phép của bạn.',
      },
      {
        en: 'Start with the one tool you open most every morning. That is where a connector pays for itself on day one.',
        vi: 'Hãy bắt đầu với công cụ bạn mở nhiều nhất mỗi sáng. Đó là nơi connector chứng minh giá trị ngay từ ngày đầu.',
      },
    ],
    challenge: {
      kind: 'match',
      prompt: {
        en: 'Match each connector to the job it unlocks:',
        vi: 'Ghép mỗi connector với công việc nó mở khoá:',
      },
      pairs: [
        {
          left: { en: 'Gmail', vi: 'Gmail' },
          right: {
            en: 'Summarize every email I have not answered this week',
            vi: 'Tóm tắt mọi email tôi chưa trả lời tuần này',
          },
        },
        {
          left: { en: 'Notion', vi: 'Notion' },
          right: {
            en: 'Update the roadmap page after our planning call',
            vi: 'Cập nhật trang roadmap sau buổi họp kế hoạch',
          },
        },
        {
          left: { en: 'Slack', vi: 'Slack' },
          right: {
            en: 'Draft my standup update from yesterday’s threads',
            vi: 'Soạn bản cập nhật standup từ các thread hôm qua',
          },
        },
        {
          left: { en: 'Calendar', vi: 'Lịch' },
          right: {
            en: 'Find 45 free minutes for a deep-work block',
            vi: 'Tìm 45 phút trống cho một phiên làm việc sâu',
          },
        },
      ],
    },
    action: {
      en: 'Connect one tool you use daily, and ask the AI to do one real task inside it.',
      vi: 'Kết nối một công cụ bạn dùng hằng ngày, và nhờ AI làm một việc thật ngay bên trong nó.',
    },
  },

  /* ---------------------------------------------- 07 · Claude Code */
  {
    step: 7,
    icon: '🖥️',
    from: { en: 'Cowork', vi: 'Cowork' },
    to: { en: 'Claude Code', vi: 'Claude Code' },
    title: { en: 'An engineer in your terminal', vi: 'Một kỹ sư trong terminal của bạn' },
    tagline: {
      en: 'Runs in your terminal and builds real systems.',
      vi: 'Chạy trong terminal và xây dựng những hệ thống thật.',
    },
    hook: {
      en: 'The terminal is where software actually gets made. Claude Code lives there — with your git, your tests, your whole system.',
      vi: 'Terminal là nơi phần mềm thật sự được tạo ra. Claude Code sống ở đó — cùng git của bạn, test của bạn, cả hệ thống của bạn.',
    },
    body: [
      {
        en: 'Claude Code runs in your terminal and works like an engineer: it reads the codebase, edits files, runs the test suite, fixes failures, and commits. It builds real systems, not snippets.',
        vi: 'Claude Code chạy trong terminal và làm việc như một kỹ sư: đọc codebase, sửa file, chạy bộ test, khắc phục lỗi, và commit. Nó xây hệ thống thật, không phải những đoạn code rời rạc.',
      },
      {
        en: 'Your job shifts to direction and review: describe the change, watch the diff, hold the standards.',
        vi: 'Việc của bạn chuyển sang định hướng và kiểm duyệt: mô tả thay đổi, xem diff, giữ vững tiêu chuẩn.',
      },
    ],
    example: {
      label: { en: 'One command, real work', vi: 'Một câu lệnh, việc thật' },
      code: '$ claude "the signup form crashes on empty\n  email — find it, fix it, add a test"',
    },
    challenge: {
      kind: 'order',
      prompt: {
        en: 'Put the healthy Claude Code loop in working order:',
        vi: 'Sắp xếp vòng lặp làm việc chuẩn với Claude Code theo đúng thứ tự:',
      },
      items: [
        { en: 'Describe the change you want', vi: 'Mô tả thay đổi bạn muốn' },
        { en: 'Agent edits the files and runs the tests', vi: 'Agent sửa file và chạy test' },
        { en: 'You review the diff', vi: 'Bạn xem lại diff' },
        { en: 'Commit, push, repeat', vi: 'Commit, push, lặp lại' },
      ],
    },
    action: {
      en: 'Install Claude Code and give it one small, real task in an actual repository.',
      vi: 'Cài Claude Code và giao cho nó một việc nhỏ nhưng có thật trong một repository thật.',
    },
  },

  /* ------------------------------------------------ 08 · CLAUDE.md */
  {
    step: 8,
    icon: '📋',
    from: { en: 'Claude Code', vi: 'Claude Code' },
    to: { en: 'CLAUDE.md', vi: 'CLAUDE.md' },
    title: { en: 'Set your standards once', vi: 'Đặt tiêu chuẩn một lần duy nhất' },
    tagline: {
      en: 'Set your standards once, every session loads them.',
      vi: 'Đặt tiêu chuẩn một lần, mọi phiên đều tự nạp.',
    },
    hook: {
      en: 'Tired of repeating “use pnpm, not npm” in every session? Write it down once — in the file the agent reads first.',
      vi: 'Mệt vì phiên nào cũng phải nhắc “dùng pnpm, đừng dùng npm”? Hãy viết nó một lần — vào đúng file mà agent đọc đầu tiên.',
    },
    body: [
      {
        en: 'CLAUDE.md sits in your repository and loads into every session automatically. It holds your standards: tooling choices, test requirements, style rules, things never to touch.',
        vi: 'CLAUDE.md nằm trong repository và tự động nạp vào mọi phiên làm việc. Nó chứa tiêu chuẩn của bạn: lựa chọn công cụ, yêu cầu về test, quy ước phong cách, những thứ không bao giờ được đụng vào.',
      },
      {
        en: 'Write standards, not tasks: rules that stay true across sessions. “Fix the login bug” belongs in a prompt. “Every route needs a test” belongs in CLAUDE.md.',
        vi: 'Hãy viết tiêu chuẩn, đừng viết nhiệm vụ: những quy tắc luôn đúng qua mọi phiên. “Sửa lỗi đăng nhập” thuộc về prompt. “Mọi route đều cần test” thuộc về CLAUDE.md.',
      },
    ],
    example: {
      label: { en: 'Good CLAUDE.md lines', vi: 'Những dòng CLAUDE.md chuẩn' },
      code: '- Use pnpm, never npm\n- Every API route needs a test\n- Never commit directly to main',
    },
    challenge: {
      kind: 'multi',
      prompt: { en: 'Which lines belong in CLAUDE.md?', vi: 'Những dòng nào xứng đáng nằm trong CLAUDE.md?' },
      options: [
        {
          text: { en: '“Use pnpm, never npm”', vi: '“Dùng pnpm, không bao giờ dùng npm”' },
          good: true,
          feedback: { en: 'A tooling standard — true in every session.', vi: 'Một tiêu chuẩn công cụ — đúng trong mọi phiên.' },
        },
        {
          text: { en: '“All new API routes need tests”', vi: '“Mọi API route mới đều phải có test”' },
          good: true,
          feedback: { en: 'A quality bar the agent can enforce forever.', vi: 'Một chuẩn chất lượng mà agent có thể giữ mãi mãi.' },
        },
        {
          text: {
            en: '“UI text lives in i18n files, never hard-coded”',
            vi: '“Chữ trên UI nằm trong file i18n, không hard-code”',
          },
          good: true,
          feedback: { en: 'An architectural rule that outlives any one task.', vi: 'Một quy tắc kiến trúc sống lâu hơn mọi nhiệm vụ đơn lẻ.' },
        },
        {
          text: { en: '“Fix the login bug from yesterday”', vi: '“Sửa lỗi đăng nhập từ hôm qua”' },
          good: false,
          feedback: { en: 'A task, not a standard — it expires when done.', vi: 'Một nhiệm vụ, không phải tiêu chuẩn — xong là hết hạn.' },
        },
        {
          text: { en: '“API_KEY=sk-live-4f2…”', vi: '“API_KEY=sk-live-4f2…”' },
          good: false,
          feedback: { en: 'A secret! Never in a file that gets committed.', vi: 'Bí mật! Không bao giờ để trong file sẽ được commit.' },
        },
        {
          text: { en: '“Write good code”', vi: '“Hãy viết code cho tốt”' },
          good: false,
          feedback: { en: 'Too vague to act on. Standards must be checkable.', vi: 'Quá mơ hồ để thực thi. Tiêu chuẩn phải kiểm chứng được.' },
        },
      ],
    },
    action: {
      en: 'Add a CLAUDE.md with your five non-negotiable standards to your main repository.',
      vi: 'Thêm một file CLAUDE.md với năm tiêu chuẩn bất di bất dịch vào repository chính của bạn.',
    },
  },

  /* ----------------------------------------------- 09 · Sub-agents */
  {
    step: 9,
    icon: '🤖',
    from: { en: 'CLAUDE.md', vi: 'CLAUDE.md' },
    to: { en: 'Sub-agents', vi: 'Sub-agents' },
    title: { en: 'Forty pairs of hands', vi: 'Bốn mươi đôi tay' },
    tagline: {
      en: 'Spin up parallel workers that run cheap.',
      vi: 'Khởi động các worker song song với chi phí thấp.',
    },
    hook: {
      en: 'One agent, one context, one pair of hands. Some jobs want forty pairs.',
      vi: 'Một agent, một ngữ cảnh, một đôi tay. Có những công việc cần đến bốn mươi đôi.',
    },
    body: [
      {
        en: 'Sub-agents are parallel workers your main agent spawns: each takes its own slice of the job in its own clean context, runs cheap, and reports back. Big splittable work — audits, migrations, sweeps — collapses from hours to minutes.',
        vi: 'Sub-agent là những worker song song do agent chính triệu hồi: mỗi worker nhận một phần việc riêng trong ngữ cảnh sạch của riêng nó, chạy với chi phí thấp, rồi báo cáo lại. Việc lớn có thể chia nhỏ — kiểm tra, di trú, rà soát — rút từ hàng giờ xuống vài phút.',
      },
      {
        en: 'The test is simple: can the job be cut into independent pieces? If yes, fan it out.',
        vi: 'Phép thử rất đơn giản: công việc có chia được thành các phần độc lập không? Nếu có, hãy tung quân.',
      },
    ],
    challenge: {
      kind: 'quiz',
      prompt: { en: 'Which job should you fan out to sub-agents?', vi: 'Việc nào nên chia cho các sub-agent?' },
      options: [
        {
          text: {
            en: 'Check all 40 documentation pages for broken links and outdated screenshots',
            vi: 'Kiểm tra cả 40 trang tài liệu tìm link hỏng và ảnh chụp lỗi thời',
          },
          correct: true,
          feedback: {
            en: 'Perfect fan-out: 40 independent pieces, one cheap worker each, minutes instead of hours.',
            vi: 'Chia việc hoàn hảo: 40 phần độc lập, mỗi phần một worker giá rẻ, vài phút thay vì vài giờ.',
          },
        },
        {
          text: { en: 'Decide next quarter’s product strategy', vi: 'Quyết định chiến lược sản phẩm quý tới' },
          feedback: {
            en: 'Strategy needs one mind holding all the context. Do not split it.',
            vi: 'Chiến lược cần một bộ óc nắm trọn ngữ cảnh. Đừng xé lẻ nó.',
          },
        },
        {
          text: { en: 'Write a heartfelt farewell email to your team', vi: 'Viết một email chia tay đầy cảm xúc gửi cả nhóm' },
          feedback: {
            en: 'One voice, one writer. Parallelism does not help feelings.',
            vi: 'Một giọng văn, một người viết. Chạy song song không giúp gì cho cảm xúc.',
          },
        },
      ],
    },
    action: {
      en: 'Next big chore, ask your agent to split it across parallel sub-agents — and watch the clock.',
      vi: 'Việc lớn tiếp theo, hãy yêu cầu agent chia nó cho các sub-agent song song — rồi nhìn đồng hồ.',
    },
  },

  /* ----------------------------------------------- 10 · Agent Team */
  {
    step: 10,
    icon: '🧑‍🤝‍🧑',
    from: { en: 'Sub-agents', vi: 'Sub-agents' },
    to: { en: 'Agent Team', vi: 'Agent Team' },
    title: { en: 'Specialists in a pipeline', vi: 'Đội chuyên gia nối thành dây chuyền' },
    tagline: {
      en: 'Chain specialists that hand off in sequence.',
      vi: 'Xâu chuỗi các chuyên gia bàn giao theo trình tự.',
    },
    hook: {
      en: 'Parallel workers are a crowd. A team is a pipeline — specialists handing work down the line.',
      vi: 'Worker song song là một đám đông. Một đội là một dây chuyền — các chuyên gia chuyền việc xuôi theo mạch.',
    },
    body: [
      {
        en: 'An agent team chains roles in sequence: a researcher gathers sources, a writer drafts, an editor fact-checks, a reviewer signs off. Each specialist does one thing well and hands clean output to the next.',
        vi: 'Agent team xâu chuỗi các vai trò theo trình tự: người nghiên cứu thu thập nguồn, người viết soạn bản nháp, biên tập viên kiểm chứng, người duyệt ký thông qua. Mỗi chuyên gia làm giỏi một việc và bàn giao kết quả sạch cho người kế tiếp.',
      },
      {
        en: 'Design the handoffs: what exactly does each stage receive, and what must it deliver? Sharp handoffs make a team; fuzzy ones make a mess.',
        vi: 'Hãy thiết kế các điểm bàn giao: mỗi khâu nhận chính xác cái gì, và phải giao lại cái gì? Bàn giao sắc nét tạo nên một đội; bàn giao mơ hồ tạo nên một mớ hỗn độn.',
      },
    ],
    challenge: {
      kind: 'order',
      prompt: {
        en: 'Assemble the newsletter pipeline in working order:',
        vi: 'Lắp ráp dây chuyền làm bản tin theo đúng trình tự:',
      },
      items: [
        { en: 'Researcher — gather sources and facts', vi: 'Người nghiên cứu — thu thập nguồn và dữ kiện' },
        { en: 'Outliner — structure the story', vi: 'Người lên dàn ý — dựng khung câu chuyện' },
        { en: 'Writer — draft the issue', vi: 'Người viết — soạn bản nháp' },
        { en: 'Editor — fact-check and polish', vi: 'Biên tập — kiểm chứng và trau chuốt' },
      ],
    },
    action: {
      en: 'Sketch one of your workflows as three or four specialist roles with crisp handoffs.',
      vi: 'Phác thảo một quy trình của bạn thành ba, bốn vai trò chuyên gia với các điểm bàn giao rõ ràng.',
    },
  },

  /* ------------------------------------------------- 11 · Routines */
  {
    step: 11,
    icon: '⏰',
    from: { en: 'Agent Team', vi: 'Agent Team' },
    to: { en: 'Routines', vi: 'Routines' },
    title: { en: 'Work that happens while you sleep', vi: 'Công việc tự chạy khi bạn ngủ' },
    tagline: {
      en: 'Set it once and automate it all while you sleep.',
      vi: 'Thiết lập một lần, tự động hoá tất cả trong lúc bạn ngủ.',
    },
    hook: {
      en: 'You built the team. Now stop pressing the button. Schedule it — and let the work happen while you sleep.',
      vi: 'Bạn đã xây xong đội ngũ. Giờ thì đừng bấm nút nữa. Hãy đặt lịch — và để công việc tự diễn ra trong lúc bạn ngủ.',
    },
    body: [
      {
        en: 'A routine runs your agents on a schedule: every morning, every Friday, the first of the month. Good routines have four parts: a trigger (when), a task (what), an output (where results land), and an escalation (when to wake a human).',
        vi: 'Routine chạy các agent của bạn theo lịch: mỗi sáng, mỗi thứ Sáu, ngày đầu tháng. Routine tốt có bốn phần: kích hoạt (khi nào), nhiệm vụ (làm gì), đầu ra (kết quả đổ về đâu), và leo thang (khi nào cần đánh thức con người).',
      },
      {
        en: 'This is the top of the ladder: AI that works without being asked. Your job becomes designing the system — and reviewing its output over morning coffee.',
        vi: 'Đây là đỉnh của chiếc thang: AI làm việc mà không cần được nhờ. Việc của bạn trở thành thiết kế hệ thống — và duyệt kết quả của nó bên tách cà phê sáng.',
      },
    ],
    challenge: {
      kind: 'quiz',
      prompt: { en: 'Which routine spec will actually work?', vi: 'Bản mô tả routine nào sẽ thật sự chạy được?' },
      options: [
        {
          text: { en: '“Do my marketing every day”', vi: '“Làm marketing cho tôi mỗi ngày”' },
          feedback: {
            en: 'No trigger time, no defined output — the agent has nothing concrete to execute.',
            vi: 'Không giờ kích hoạt, không đầu ra cụ thể — agent chẳng có gì rõ ràng để thực thi.',
          },
        },
        {
          text: {
            en: '“Weekdays 7:00 — scan the support inbox, draft replies, post urgent ones to #support with a summary”',
            vi: '“Ngày thường 7:00 — quét hộp thư hỗ trợ, soạn thư trả lời, đăng ca khẩn cấp lên #support kèm tóm tắt”',
          },
          correct: true,
          feedback: {
            en: 'Trigger ✓ task ✓ output ✓ escalation ✓ — this one runs while you sleep.',
            vi: 'Kích hoạt ✓ nhiệm vụ ✓ đầu ra ✓ leo thang ✓ — routine này tự chạy khi bạn ngủ.',
          },
        },
        {
          text: { en: '“Whenever it seems right, improve things”', vi: '“Khi nào thấy hợp lý thì cải thiện mọi thứ”' },
          feedback: { en: 'Vibes are not a schedule.', vi: '“Cảm giác hợp lý” không phải là một lịch trình.' },
        },
      ],
    },
    action: {
      en: 'Pick one weekly chore and write its routine: trigger, task, output, escalation.',
      vi: 'Chọn một việc lặp lại hằng tuần và viết routine cho nó: kích hoạt, nhiệm vụ, đầu ra, leo thang.',
    },
  },
]
