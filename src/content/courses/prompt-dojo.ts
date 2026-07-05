import type { Course } from '../types'

/**
 * Prompt Craft Dojo — eight forms to master the art of asking.
 * A sakura garden that deepens from dawn blossom to ink-wash night.
 */
export const PROMPT_DOJO: Course = {
  id: 'prompt-dojo',
  icon: '🥋',
  name: { en: 'Prompt Craft Dojo', vi: 'Võ đường Prompt' },
  tagline: {
    en: 'Eight forms to master the art of asking.',
    vi: 'Tám bài quyền để tinh thông nghệ thuật đặt câu hỏi.',
  },
  blurb: {
    en: 'Specificity, context, examples, structure, output contracts, thinking room, iteration — and the instinct to diagnose any weak prompt on sight.',
    vi: 'Sự cụ thể, ngữ cảnh, ví dụ, cấu trúc, khuôn đầu ra, không gian suy nghĩ, vòng lặp cải thiện — và trực giác bắt bệnh mọi prompt yếu chỉ bằng một cái nhìn.',
  },
  minutes: 25,
  levels: [
    { name: { en: 'Foundation', vi: 'Nền tảng' }, color: '#e0559a', steps: [1, 2], zone: 0 },
    { name: { en: 'Form', vi: 'Chiêu thức' }, color: '#3a9e6e', steps: [3, 4], zone: 1 },
    { name: { en: 'Flow', vi: 'Dòng chảy' }, color: '#e0703c', steps: [5, 6], zone: 2 },
    { name: { en: 'Mastery', vi: 'Tinh thông' }, color: '#8f7ff0', steps: [7, 8], zone: 3 },
  ],
  zones: [
    // dawn sakura
    { skyTop: '#ee9dbd', skyBottom: '#fdeee2', grass: '#9ccf8f', rock: '#a08ba0', accent: '#e0559a', sun: '#fff0e6', starAlpha: 0, flavor: 'sakura' },
    // bamboo noon
    { skyTop: '#6fc7b2', skyBottom: '#f3f0d8', grass: '#7bc46e', rock: '#7f957f', accent: '#3a9e6e', sun: '#fff8e8', starAlpha: 0, flavor: 'bamboo' },
    // koi sunset
    { skyTop: '#ef9b52', skyBottom: '#fbdcc0', grass: '#d9b264', rock: '#9a7a80', accent: '#e0703c', sun: '#ffe0b8', starAlpha: 0.3, flavor: 'lantern' },
    // ink-wash night
    { skyTop: '#2e3355', skyBottom: '#8a6f95', grass: '#6e6a9e', rock: '#565277', accent: '#8f7ff0', sun: '#e8d8ff', starAlpha: 1, flavor: 'lantern' },
  ],
  layout: { spiralDeg: -58, radius: 27, rise: 5.5, islandRadius: 7.5, startRadius: 9.5 },
  lessons: [
    /* ------------------------------------------- 01 · Specificity */
    {
      step: 1,
      icon: '🎯',
      from: { en: 'Vague wishes', vi: 'Ước muốn mơ hồ' },
      to: { en: 'Sharp asks', vi: 'Yêu cầu sắc bén' },
      title: { en: 'Cut through the fog', vi: 'Chém tan màn sương' },
      tagline: {
        en: 'Say exactly what “done” looks like.',
        vi: 'Nói chính xác “xong” trông như thế nào.',
      },
      hook: {
        en: 'Ask a vague question, get a vague answer. The model is not reading your mind — it is reading your words.',
        vi: 'Hỏi mơ hồ thì nhận câu trả lời mơ hồ. Mô hình không đọc được suy nghĩ của bạn — nó chỉ đọc được câu chữ của bạn.',
      },
      body: [
        {
          en: 'The single biggest upgrade to any prompt is specificity: what exactly you want, for whom, how long, in what format. Every constraint you leave out, the model fills with a guess.',
          vi: 'Nâng cấp lớn nhất cho mọi prompt chính là sự cụ thể: bạn muốn chính xác cái gì, cho ai, dài bao nhiêu, theo định dạng nào. Mỗi ràng buộc bạn bỏ trống, mô hình sẽ tự điền bằng một phỏng đoán.',
        },
        {
          en: 'Before you send, ask yourself: could two different people read this and deliver two totally different things? If yes, sharpen it.',
          vi: 'Trước khi gửi, hãy tự hỏi: liệu hai người khác nhau đọc prompt này có thể nộp hai kết quả hoàn toàn khác nhau không? Nếu có, hãy mài nó sắc hơn.',
        },
      ],
      example: {
        label: { en: 'Vague → sharp', vi: 'Mơ hồ → sắc bén' },
        code: '✗ "Write about our product"\n✓ "Write 3 Instagram captions for our\n   handmade ceramic mugs. Playful tone,\n   under 20 words, end with a question."',
      },
      challenge: {
        kind: 'quiz',
        prompt: {
          en: 'You need a birthday message for a colleague. Which prompt earns the best result?',
          vi: 'Bạn cần một lời chúc sinh nhật cho đồng nghiệp. Prompt nào sẽ cho kết quả tốt nhất?',
        },
        options: [
          {
            text: { en: '“Write a birthday message.”', vi: '“Viết một lời chúc sinh nhật.”' },
            feedback: {
              en: 'The model must guess the person, tone and length — you will get a greeting-card cliché.',
              vi: 'Mô hình phải đoán người nhận, giọng điệu lẫn độ dài — bạn sẽ nhận về một câu chúc sáo rỗng in sẵn.',
            },
          },
          {
            text: {
              en: '“Write a warm 3-sentence birthday message for a colleague who loves hiking and just shipped a big project. Light humor, no emojis.”',
              vi: '“Viết lời chúc sinh nhật ấm áp 3 câu cho một đồng nghiệp mê leo núi và vừa hoàn thành một dự án lớn. Hài hước nhẹ nhàng, không emoji.”',
            },
            correct: true,
            feedback: {
              en: 'Recipient, tone, length, constraints — the model can hit a target it can actually see.',
              vi: 'Người nhận, giọng điệu, độ dài, ràng buộc — mô hình bắn trúng được mục tiêu mà nó nhìn thấy.',
            },
          },
          {
            text: { en: '“Write the best birthday message ever written.”', vi: '“Viết lời chúc sinh nhật hay nhất mọi thời đại.”' },
            feedback: {
              en: 'Superlatives are not specifications. “Best” tells the model nothing about this birthday.',
              vi: 'Từ ngữ hoa mỹ không phải là đặc tả. “Hay nhất” chẳng nói gì về sinh nhật cụ thể này cả.',
            },
          },
        ],
      },
      action: {
        en: 'Take the last prompt you sent and rewrite it with an explicit audience, length and format.',
        vi: 'Lấy prompt gần nhất bạn đã gửi và viết lại với đối tượng, độ dài và định dạng rõ ràng.',
      },
    },

    /* ---------------------------------------------- 02 · Context */
    {
      step: 2,
      icon: '🗺️',
      from: { en: 'Cold starts', vi: 'Khởi đầu lạnh' },
      to: { en: 'A briefed model', vi: 'Mô hình nắm rõ bối cảnh' },
      title: { en: 'Load the scene', vi: 'Dựng bối cảnh' },
      tagline: {
        en: 'The model only knows what you bring into the room.',
        vi: 'Mô hình chỉ biết những gì bạn mang vào phòng.',
      },
      hook: {
        en: 'You would never brief a new teammate with one sentence. Yet that is how most people brief their AI.',
        vi: 'Bạn sẽ không bao giờ bàn giao việc cho đồng nghiệp mới chỉ bằng một câu. Vậy mà đó lại là cách đa số mọi người giao việc cho AI.',
      },
      body: [
        {
          en: 'Context is everything the model needs to act like it works with you: who the audience is, what happened before, what you are trying to achieve, what has already been tried.',
          vi: 'Ngữ cảnh là tất cả những gì mô hình cần để làm việc như một người trong cuộc: khán giả là ai, chuyện gì đã xảy ra, bạn đang nhắm tới điều gì, những gì đã được thử.',
        },
        {
          en: 'Relevant context sharpens; irrelevant context blurs. Bring the three facts that change the answer — not your whole hard drive.',
          vi: 'Ngữ cảnh liên quan làm câu trả lời sắc nét; ngữ cảnh thừa làm nó nhoè đi. Hãy mang theo ba dữ kiện làm thay đổi câu trả lời — chứ không phải cả ổ cứng của bạn.',
        },
      ],
      example: {
        label: { en: 'A briefed prompt', vi: 'Một prompt đủ bối cảnh' },
        code: 'Context: B2B email to a customer whose\nrenewal failed twice. She is frustrated\nbut polite. Goal: keep her.\nTask: draft the apology + fix steps.',
      },
      challenge: {
        kind: 'multi',
        prompt: {
          en: 'You ask for help pricing your freelance design work. Which context actually changes the answer?',
          vi: 'Bạn nhờ AI tư vấn định giá dịch vụ thiết kế freelance. Ngữ cảnh nào thật sự làm thay đổi câu trả lời?',
        },
        options: [
          {
            text: { en: 'Your experience level and portfolio strength', vi: 'Số năm kinh nghiệm và độ mạnh của portfolio' },
            good: true,
            feedback: { en: 'Rates scale with proof.', vi: 'Giá tăng theo bằng chứng năng lực.' },
          },
          {
            text: { en: 'Your city and target market', vi: 'Thành phố và thị trường bạn nhắm tới' },
            good: true,
            feedback: { en: 'Hanoi rates ≠ New York rates.', vi: 'Giá ở Hà Nội ≠ giá ở New York.' },
          },
          {
            text: { en: 'The clients you want: startups or agencies', vi: 'Tệp khách bạn muốn: startup hay agency' },
            good: true,
            feedback: { en: 'Different buyers, different budgets, different pitch.', vi: 'Khách khác nhau, ngân sách khác nhau, cách chào giá khác nhau.' },
          },
          {
            text: { en: 'Your favorite color', vi: 'Màu sắc yêu thích của bạn' },
            good: false,
            feedback: { en: 'Fun, but it prices nothing.', vi: 'Thú vị đấy, nhưng nó không định giá được gì.' },
          },
          {
            text: { en: 'That you once visited Paris', vi: 'Chuyện bạn từng đi Paris' },
            good: false,
            feedback: { en: 'Charming — and irrelevant. Noise dilutes the brief.', vi: 'Lãng mạn — và không liên quan. Nhiễu làm loãng bản brief.' },
          },
        ],
      },
      action: {
        en: 'Next prompt: add one line of audience, one of goal, one of constraints — and watch the answer change.',
        vi: 'Prompt tiếp theo: thêm một dòng về đối tượng, một dòng mục tiêu, một dòng ràng buộc — rồi xem câu trả lời thay đổi.',
      },
    },

    /* --------------------------------------------- 03 · Few-shot */
    {
      step: 3,
      icon: '🎼',
      from: { en: 'Describing style', vi: 'Mô tả phong cách' },
      to: { en: 'Showing style', vi: 'Trình diễn phong cách' },
      title: { en: 'Teach by example', vi: 'Dạy bằng ví dụ' },
      tagline: {
        en: 'Two good examples beat two paragraphs of description.',
        vi: 'Hai ví dụ tốt đáng giá hơn hai đoạn văn mô tả.',
      },
      hook: {
        en: 'You can spend fifty words describing your style — or show two examples and let the model mirror them.',
        vi: 'Bạn có thể tốn năm mươi chữ mô tả phong cách của mình — hoặc đưa ra hai ví dụ và để mô hình soi gương làm theo.',
      },
      body: [
        {
          en: 'Models are pattern-completion machines. Show input → output pairs in the shape you want, and the next output follows the groove: same tone, same format, same level of detail.',
          vi: 'Mô hình là cỗ máy hoàn thiện mẫu hình. Đưa các cặp đầu vào → đầu ra đúng khuôn bạn muốn, và kết quả tiếp theo sẽ chảy đúng rãnh: cùng giọng điệu, cùng định dạng, cùng độ chi tiết.',
        },
        {
          en: 'Pick examples that show the pattern — including one tricky case. If every example is easy, the model only learns the easy groove.',
          vi: 'Hãy chọn ví dụ thể hiện được mẫu hình — kèm ít nhất một ca khó. Nếu ví dụ nào cũng dễ, mô hình chỉ học được cái rãnh dễ.',
        },
      ],
      example: {
        label: { en: 'Few-shot in action', vi: 'Few-shot thực chiến' },
        code: 'Rewrite product names in our style:\n"blue mug v2"    → "Mist Blue Mug II"\n"big red plate"  → "Ember Red Platter"\n"green bowl"     → ?',
      },
      challenge: {
        kind: 'quiz',
        prompt: {
          en: 'You want 200 expense rows standardized. Which prompt gets consistent output on all of them?',
          vi: 'Bạn muốn chuẩn hoá 200 dòng chi tiêu. Prompt nào cho kết quả nhất quán trên tất cả các dòng?',
        },
        options: [
          {
            text: { en: '“Clean these up and make them consistent.”', vi: '“Dọn sạch mấy dòng này và làm cho nhất quán.”' },
            feedback: {
              en: 'Consistent with what? The model will invent a style and drift halfway through.',
              vi: 'Nhất quán theo chuẩn nào? Mô hình sẽ tự bịa ra một phong cách rồi trôi dạt giữa chừng.',
            },
          },
          {
            text: {
              en: '“Rewrite like these: ‘ubr 12/3 airprt’ → ‘Uber — airport, Dec 3’; ‘AMZN kbd’ → ‘Amazon — keyboard’. Now do the rest.”',
              vi: '“Viết lại theo mẫu: ‘ubr 12/3 sanbay’ → ‘Uber — sân bay, 3/12’; ‘AMZN banphim’ → ‘Amazon — bàn phím’. Giờ làm nốt phần còn lại.”',
            },
            correct: true,
            feedback: {
              en: 'Two examples define the pattern; the model just continues the groove.',
              vi: 'Hai ví dụ đã định hình mẫu; mô hình chỉ việc chảy tiếp đúng rãnh.',
            },
          },
          {
            text: { en: '“Use proper title case and be professional.”', vi: '“Viết hoa cho chuẩn và trông chuyên nghiệp vào.”' },
            feedback: {
              en: 'Adjectives describe style loosely; examples define it precisely.',
              vi: 'Tính từ chỉ mô tả phong cách một cách lỏng lẻo; ví dụ mới định nghĩa nó chính xác.',
            },
          },
        ],
      },
      action: {
        en: 'Find one repetitive rewriting task and give the model two input → output examples before the real data.',
        vi: 'Tìm một việc viết-lại lặp đi lặp lại và đưa mô hình hai ví dụ đầu vào → đầu ra trước khi giao dữ liệu thật.',
      },
    },

    /* -------------------------------------------- 04 · Structure */
    {
      step: 4,
      icon: '🏗️',
      from: { en: 'A wall of text', vi: 'Bức tường chữ' },
      to: { en: 'A sectioned brief', vi: 'Bản brief có bố cục' },
      title: { en: 'Give the prompt a skeleton', vi: 'Cho prompt một bộ xương' },
      tagline: {
        en: 'Separate role, context, task and format — the model reads structure.',
        vi: 'Tách vai trò, ngữ cảnh, nhiệm vụ và định dạng — mô hình đọc được cấu trúc.',
      },
      hook: {
        en: 'A wall of text buries your instructions. Structure digs them out.',
        vi: 'Bức tường chữ chôn vùi chỉ dẫn của bạn. Cấu trúc sẽ khai quật chúng lên.',
      },
      body: [
        {
          en: 'Long prompts work better with labeled sections: role, context, task, constraints, format, examples. Delimiters — headings or XML-style tags — tell the model exactly which words are instructions and which are data.',
          vi: 'Prompt dài hoạt động tốt hơn khi có các phần được dán nhãn: vai trò, ngữ cảnh, nhiệm vụ, ràng buộc, định dạng, ví dụ. Các dấu phân cách — tiêu đề hoặc thẻ kiểu XML — cho mô hình biết chính xác chữ nào là chỉ dẫn, chữ nào là dữ liệu.',
        },
        {
          en: 'Structure also helps you: a sectioned prompt exposes what is missing before you hit send.',
          vi: 'Cấu trúc còn giúp chính bạn: một prompt có bố cục sẽ phơi bày phần còn thiếu trước cả khi bạn bấm gửi.',
        },
      ],
      example: {
        label: { en: 'A skeleton that scales', vi: 'Bộ xương dùng được mãi' },
        code: '<role>Senior copy editor</role>\n<task>Tighten this draft by 30%</task>\n<constraints>Keep all quotes intact</constraints>\n<draft>…the messy text…</draft>',
      },
      challenge: {
        kind: 'order',
        prompt: {
          en: 'Assemble the brief in its strongest order:',
          vi: 'Lắp ráp bản brief theo trình tự mạnh nhất:',
        },
        items: [
          { en: 'Role — who the model should be', vi: 'Vai trò — mô hình nên là ai' },
          { en: 'Context — what it needs to know', vi: 'Ngữ cảnh — nó cần biết những gì' },
          { en: 'Task + constraints — what to do', vi: 'Nhiệm vụ + ràng buộc — cần làm gì' },
          { en: 'Format — what the output must look like', vi: 'Định dạng — đầu ra phải trông thế nào' },
        ],
      },
      action: {
        en: 'Take your longest recurring prompt and rewrite it with four labeled sections.',
        vi: 'Lấy prompt dài nhất mà bạn hay dùng và viết lại với bốn phần được dán nhãn.',
      },
    },

    /* -------------------------------------- 05 · Output contract */
    {
      step: 5,
      icon: '📦',
      from: { en: 'Prose soup', vi: 'Súp văn xuôi' },
      to: { en: 'Structured output', vi: 'Đầu ra có khuôn' },
      title: { en: 'Demand a shape', vi: 'Đặt hàng theo khuôn' },
      tagline: {
        en: 'If software will read it, specify the format like an API.',
        vi: 'Nếu phần mềm sẽ đọc kết quả, hãy đặc tả định dạng như một API.',
      },
      hook: {
        en: 'The model answered beautifully — in flowing prose you now have to untangle by hand. You forgot to order the shape.',
        vi: 'Mô hình trả lời rất hay — bằng một áng văn mượt mà mà giờ bạn phải ngồi gỡ từng dòng. Bạn đã quên đặt hàng cái khuôn.',
      },
      body: [
        {
          en: 'Whenever output feeds a next step — a spreadsheet, code, another prompt — specify the exact shape: JSON with named fields, a markdown table, exactly five bullets. And say what to do with missing data: null, not creative fiction.',
          vi: 'Bất cứ khi nào đầu ra được đưa vào bước tiếp theo — bảng tính, code, một prompt khác — hãy đặc tả khuôn chính xác: JSON với các trường đặt tên, bảng markdown, đúng năm gạch đầu dòng. Và dặn rõ cách xử lý dữ liệu thiếu: null, chứ không phải sáng tác.',
        },
        {
          en: 'A format contract turns AI from a conversation into a component.',
          vi: 'Một hợp đồng định dạng biến AI từ một cuộc trò chuyện thành một linh kiện lắp ghép được.',
        },
      ],
      example: {
        label: { en: 'The contract', vi: 'Bản hợp đồng' },
        code: 'Return JSON only:\n{ "name": string, "price": number,\n  "in_stock": boolean | null }\nNo commentary. Unknown → null.',
      },
      challenge: {
        kind: 'terminal',
        prompt: {
          en: 'The model keeps replying in prose. Demand machine-readable output — type a one-line instruction that names a format (JSON, CSV, table…):',
          vi: 'Mô hình cứ trả lời bằng văn xuôi. Hãy yêu cầu đầu ra máy-đọc-được — gõ một dòng chỉ dẫn có nêu tên định dạng (JSON, CSV, bảng…):',
        },
        placeholder: 'reply as …',
        pattern: '(json|csv|table|bảng|markdown|yaml)',
        hint: {
          en: 'Name a machine-readable format: e.g. “reply as JSON with fields name, price”.',
          vi: 'Nêu tên một định dạng máy đọc được: ví dụ “trả lời bằng JSON với các trường name, price”.',
        },
        success: {
          en: 'Contract signed — every future reply now lands in the same shape.',
          vi: 'Hợp đồng đã ký — mọi câu trả lời từ giờ sẽ rơi đúng một khuôn.',
        },
      },
      action: {
        en: 'Next time output feeds another tool, write the schema into the prompt — fields, types, and the rule for unknowns.',
        vi: 'Lần tới khi đầu ra được đưa vào công cụ khác, hãy viết hẳn schema vào prompt — các trường, kiểu dữ liệu, và quy tắc cho giá trị chưa biết.',
      },
    },

    /* ----------------------------------------- 06 · Thinking room */
    {
      step: 6,
      icon: '🧮',
      from: { en: 'Instant answers', vi: 'Trả lời tức thì' },
      to: { en: 'Reasoned answers', vi: 'Trả lời có suy luận' },
      title: { en: 'Let it think', vi: 'Chừa chỗ để nghĩ' },
      tagline: {
        en: 'For hard problems, ask for the reasoning before the answer.',
        vi: 'Với bài toán khó, hãy yêu cầu suy luận trước khi chốt đáp án.',
      },
      hook: {
        en: 'Forced to answer instantly, people blurt. Models too.',
        vi: 'Bị ép trả lời ngay lập tức, con người sẽ buột miệng. Mô hình cũng vậy.',
      },
      body: [
        {
          en: 'For math, logic, tricky trade-offs and debugging, ask the model to reason first: “think through the steps before answering”, or “list your assumptions, then decide”. The answer at the end of a visible chain is usually better than the blurt.',
          vi: 'Với toán, logic, các đánh đổi hóc búa và việc gỡ lỗi, hãy yêu cầu mô hình suy luận trước: “hãy nghĩ từng bước trước khi trả lời”, hoặc “liệt kê các giả định, rồi mới quyết định”. Đáp án nằm cuối một chuỗi suy luận nhìn thấy được thường tốt hơn câu buột miệng.',
        },
        {
          en: 'Bonus: visible reasoning is checkable reasoning — you can see exactly where it went wrong.',
          vi: 'Điểm cộng: suy luận nhìn thấy được là suy luận kiểm tra được — bạn thấy chính xác nó trượt ở bước nào.',
        },
      ],
      example: {
        label: { en: 'Make it show its work', vi: 'Bắt nó trình bày bài giải' },
        code: 'Before answering: list each assumption,\ncompute each step, sanity-check the\nunits. Then give the final number.',
      },
      challenge: {
        kind: 'quiz',
        prompt: {
          en: 'Which task benefits most from “think step by step first”?',
          vi: 'Nhiệm vụ nào hưởng lợi nhiều nhất từ “hãy suy nghĩ từng bước trước”?',
        },
        options: [
          {
            text: {
              en: 'Debug why this discount calculation overcharges 12% in edge cases',
              vi: 'Tìm xem vì sao phép tính giảm giá này thu dư 12% ở các ca biên',
            },
            correct: true,
            feedback: {
              en: 'Multi-step logic with a hidden flaw — exactly where visible reasoning shines.',
              vi: 'Logic nhiều bước với một lỗi ẩn — đúng nơi suy luận nhìn thấy được toả sáng.',
            },
          },
          {
            text: { en: 'Suggest a name for a black kitten', vi: 'Gợi ý tên cho một chú mèo con màu đen' },
            feedback: {
              en: 'Creative one-shots need no derivation. (“Shadow.” You are welcome.)',
              vi: 'Việc sáng tạo một phát ăn ngay không cần chứng minh. (“Bóng Đêm.” Không có gì.)',
            },
          },
          {
            text: { en: 'Translate “good morning” into French', vi: 'Dịch “chào buổi sáng” sang tiếng Pháp' },
            feedback: {
              en: 'One step, zero reasoning needed — extra thinking just costs time.',
              vi: 'Một bước, không cần suy luận — bắt nghĩ thêm chỉ tốn thời gian.',
            },
          },
        ],
      },
      action: {
        en: 'Take one gnarly problem today and add: “List your assumptions and reason step by step before the final answer.”',
        vi: 'Chọn một bài toán xương xẩu hôm nay và thêm câu: “Liệt kê giả định và suy luận từng bước trước khi đưa đáp án cuối.”',
      },
    },

    /* --------------------------------------------- 07 · Iterate */
    {
      step: 7,
      icon: '🔁',
      from: { en: 'First drafts', vi: 'Bản nháp đầu' },
      to: { en: 'Refined output', vi: 'Thành phẩm tinh luyện' },
      title: { en: 'The second-draft secret', vi: 'Bí mật của bản nháp thứ hai' },
      tagline: {
        en: 'The first answer is raw material, not the result.',
        vi: 'Câu trả lời đầu tiên là nguyên liệu thô, không phải thành phẩm.',
      },
      hook: {
        en: 'Nobody ships a teammate’s first draft. Why are you shipping the model’s?',
        vi: 'Chẳng ai đem bản nháp đầu tiên của đồng nghiệp đi nộp. Vậy sao bạn lại nộp bản nháp đầu tiên của mô hình?',
      },
      body: [
        {
          en: 'The pros treat output as clay: ask for a critique of its own draft, demand three variations, tighten one dimension at a time — “same, but half the length”, “same, but for executives”.',
          vi: 'Cao thủ xem đầu ra như đất sét: yêu cầu mô hình tự phê bình bản nháp, đòi ba phiên bản khác nhau, siết từng chiều một — “giữ nguyên, nhưng ngắn một nửa”, “giữ nguyên, nhưng dành cho ban lãnh đạo”.',
        },
        {
          en: 'Iteration compounds: two focused follow-ups routinely turn a 6/10 answer into a 9/10.',
          vi: 'Vòng lặp có lãi kép: hai câu chỉnh đúng hướng thường biến câu trả lời 6/10 thành 9/10.',
        },
      ],
      challenge: {
        kind: 'multi',
        prompt: {
          en: 'The model wrote a decent product description. Which follow-ups actually improve it?',
          vi: 'Mô hình vừa viết một đoạn mô tả sản phẩm tạm ổn. Câu tiếp theo nào thật sự cải thiện nó?',
        },
        options: [
          {
            text: { en: '“Critique this draft: what is weak, generic or unclear?”', vi: '“Phê bình bản nháp này: chỗ nào yếu, chung chung hoặc khó hiểu?”' },
            good: true,
            feedback: { en: 'Self-critique surfaces flaws you would miss.', vi: 'Tự phê bình phơi ra những lỗi bạn sẽ bỏ sót.' },
          },
          {
            text: { en: '“Give 3 variations: playful, premium, minimal.”', vi: '“Cho 3 phiên bản: tinh nghịch, cao cấp, tối giản.”' },
            good: true,
            feedback: { en: 'Variations reveal the space of possibilities.', vi: 'Các phiên bản mở ra không gian lựa chọn.' },
          },
          {
            text: { en: '“Same message, half the words.”', vi: '“Giữ nguyên thông điệp, giảm nửa số chữ.”' },
            good: true,
            feedback: { en: 'Constraint-tightening is the fastest polish.', vi: 'Siết ràng buộc là cách đánh bóng nhanh nhất.' },
          },
          {
            text: { en: '“Make it better.”', vi: '“Làm cho nó hay hơn đi.”' },
            good: false,
            feedback: { en: 'Better how? Directionless iteration just reshuffles.', vi: 'Hay hơn theo hướng nào? Lặp không định hướng chỉ là xáo bài.' },
          },
          {
            text: { en: 'Regenerate ten times and hope', vi: 'Bấm tạo lại mười lần và cầu may' },
            good: false,
            feedback: { en: 'Slot-machine prompting. Direction beats luck.', vi: 'Prompt kiểu máy đánh bạc. Định hướng luôn thắng may rủi.' },
          },
        ],
      },
      action: {
        en: 'Today, forbid yourself from using any first draft — send at least one focused follow-up before you copy.',
        vi: 'Hôm nay, cấm bản thân dùng bất kỳ bản nháp đầu nào — gửi ít nhất một câu chỉnh đúng hướng trước khi sao chép.',
      },
    },

    /* --------------------------------------------- 08 · Capstone */
    {
      step: 8,
      icon: '🩺',
      from: { en: 'Seven forms', vi: 'Bảy bài quyền' },
      to: { en: 'One instinct', vi: 'Một trực giác' },
      title: { en: 'Diagnose the prompt', vi: 'Bắt bệnh cho prompt' },
      tagline: {
        en: 'Read a weak prompt and name the missing ingredient on sight.',
        vi: 'Nhìn một prompt yếu và gọi tên ngay thứ nó đang thiếu.',
      },
      hook: {
        en: 'Mastery is diagnosis: glance at a prompt, see what is missing, fix exactly that.',
        vi: 'Tinh thông chính là bắt bệnh: liếc qua một prompt, thấy ngay nó thiếu gì, và sửa đúng chỗ đó.',
      },
      body: [
        {
          en: 'Every weak prompt is missing something specific: a target, context, an example, structure, a format, thinking room, or an iteration pass. Name the gap, and the fix writes itself.',
          vi: 'Mỗi prompt yếu đều thiếu một thứ cụ thể: mục tiêu, ngữ cảnh, ví dụ, cấu trúc, định dạng, không gian suy nghĩ, hay một vòng cải thiện. Gọi được tên lỗ hổng, cách sửa sẽ tự hiện ra.',
        },
        {
          en: 'This is the whole dojo compressed into one instinct. Match each weak prompt to what it lacks.',
          vi: 'Đây là cả võ đường nén lại thành một trực giác. Hãy ghép mỗi prompt yếu với thứ nó đang thiếu.',
        },
      ],
      challenge: {
        kind: 'match',
        prompt: {
          en: 'Match each weak prompt to its missing ingredient:',
          vi: 'Ghép mỗi prompt yếu với nguyên liệu còn thiếu của nó:',
        },
        pairs: [
          {
            left: { en: '“Write something about productivity”', vi: '“Viết gì đó về năng suất”' },
            right: { en: 'Specificity — no audience, length or angle', vi: 'Sự cụ thể — thiếu đối tượng, độ dài, góc nhìn' },
          },
          {
            left: {
              en: '“Reply to this angry customer” (no history attached)',
              vi: '“Trả lời khách hàng đang giận này” (không đính kèm lịch sử)',
            },
            right: { en: 'Context — the model cannot see the story', vi: 'Ngữ cảnh — mô hình không thấy được câu chuyện' },
          },
          {
            left: { en: '“Format these 300 rows nicely”', vi: '“Trình bày 300 dòng này cho đẹp”' },
            right: { en: 'Examples — show two rows done right', vi: 'Ví dụ — hãy cho xem hai dòng làm chuẩn' },
          },
          {
            left: { en: '“Analyze this data” (output feeds a script)', vi: '“Phân tích dữ liệu này” (kết quả đưa vào script)' },
            right: { en: 'Output contract — no schema requested', vi: 'Khuôn đầu ra — chưa yêu cầu schema nào' },
          },
        ],
      },
      action: {
        en: 'Collect your three most-used prompts and run this diagnosis on each — then fix the single biggest gap.',
        vi: 'Gom ba prompt bạn dùng nhiều nhất và bắt bệnh từng cái — rồi sửa đúng lỗ hổng lớn nhất.',
      },
    },
  ],
}
