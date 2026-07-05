import type { Course } from '../types'

/**
 * The Safety Lighthouse — six beacons for sailing the AI seas without
 * wrecking. A misty harbor that darkens toward a red-beaconed night.
 */
export const SAFETY_LIGHTHOUSE: Course = {
  id: 'safety-lighthouse',
  icon: '🧭',
  name: { en: 'The Safety Lighthouse', vi: 'Hải đăng An toàn' },
  tagline: {
    en: 'Six beacons for sailing the AI seas without wrecking.',
    vi: 'Sáu ngọn đèn để ra khơi cùng AI mà không đắm tàu.',
  },
  blurb: {
    en: 'Hallucinations, verification, secrets, over-trust and bias — the sharp edges of AI, and the reflexes that keep you (and your data) safe.',
    vi: 'Ảo giác, kiểm chứng, bảo mật, tin tưởng mù quáng và thiên kiến — những cạnh sắc của AI, và các phản xạ giữ an toàn cho bạn (lẫn dữ liệu của bạn).',
  },
  minutes: 20,
  levels: [
    { name: { en: 'Open Water', vi: 'Ra khơi' }, color: '#2f7fb0', steps: [1, 2], zone: 0 },
    { name: { en: 'Storm Front', vi: 'Giông tố' }, color: '#3f8f9b', steps: [3, 4], zone: 1 },
    { name: { en: 'The Beacon', vi: 'Ngọn hải đăng' }, color: '#e85555', steps: [5, 6], zone: 2 },
  ],
  zones: [
    // misty morning harbor
    { skyTop: '#7fb5d4', skyBottom: '#eae8da', grass: '#8fb98a', rock: '#7d8596', accent: '#2f7fb0', sun: '#fef2dd', starAlpha: 0, flavor: 'reeds' },
    // storm watch
    { skyTop: '#5e7387', skyBottom: '#c9c4b4', grass: '#7a9a84', rock: '#5f6878', accent: '#3f8f9b', sun: '#e8dcc4', starAlpha: 0.15, flavor: 'reeds' },
    // beacon night
    { skyTop: '#27304f', skyBottom: '#9a6a72', grass: '#5f6a8e', rock: '#454d68', accent: '#e85555', sun: '#ffc9b0', starAlpha: 1, flavor: 'shards' },
  ],
  layout: { spiralDeg: 66, radius: 28, rise: 6, islandRadius: 7.5, startRadius: 9.5 },
  lessons: [
    /* ---------------------------------------- 01 · Hallucinations */
    {
      step: 1,
      icon: '🌫️',
      from: { en: 'Trusting fluency', vi: 'Tin vào sự trôi chảy' },
      to: { en: 'Spotting mirages', vi: 'Nhận ra ảo ảnh' },
      title: { en: 'Confidence is not truth', vi: 'Tự tin không phải là sự thật' },
      tagline: {
        en: 'Models sometimes invent facts — fluently.',
        vi: 'Mô hình đôi khi bịa ra dữ kiện — một cách trôi chảy.',
      },
      hook: {
        en: 'The most dangerous AI answer is not the wrong one. It is the wrong one that sounds perfectly right.',
        vi: 'Câu trả lời AI nguy hiểm nhất không phải câu trả lời sai. Mà là câu trả lời sai nghe hoàn toàn đúng.',
      },
      body: [
        {
          en: 'Language models predict plausible text. Usually plausible is true; sometimes it is a mirage: invented citations, precise-sounding statistics, function names that never existed. Fluency is not evidence.',
          vi: 'Mô hình ngôn ngữ dự đoán văn bản nghe hợp lý. Thường thì hợp lý là đúng; nhưng đôi khi đó là ảo ảnh: trích dẫn bịa, thống kê nghe chính xác đến đáng ngờ, tên hàm chưa từng tồn tại. Sự trôi chảy không phải là bằng chứng.',
        },
        {
          en: 'Risk scales with specificity and stakes: names, numbers, dates, laws, APIs — anything you will quote, ship or decide on deserves a check.',
          vi: 'Rủi ro tăng theo độ cụ thể và mức độ hệ trọng: tên riêng, con số, ngày tháng, điều luật, API — bất cứ thứ gì bạn định trích dẫn, phát hành hay ra quyết định đều xứng đáng được kiểm tra.',
        },
      ],
      challenge: {
        kind: 'multi',
        prompt: {
          en: 'Which of these AI outputs must you verify before using?',
          vi: 'Những kết quả AI nào dưới đây bắt buộc phải kiểm chứng trước khi dùng?',
        },
        options: [
          {
            text: { en: 'A court case it cites by name and year', vi: 'Một vụ án nó trích dẫn kèm tên và năm' },
            good: true,
            feedback: { en: 'Invented citations are the classic hallucination.', vi: 'Trích dẫn bịa là ca ảo giác kinh điển nhất.' },
          },
          {
            text: { en: 'A market statistic with a precise decimal', vi: 'Một số liệu thị trường có phần thập phân chính xác' },
            good: true,
            feedback: { en: 'Precision is easy to fake. Check the source.', vi: 'Độ chính xác rất dễ giả. Hãy kiểm tra nguồn.' },
          },
          {
            text: { en: 'A library function it says exists', vi: 'Một hàm thư viện mà nó khẳng định là có' },
            good: true,
            feedback: { en: 'Models regularly invent plausible APIs. Run it or read the docs.', vi: 'Mô hình thường xuyên bịa ra API nghe rất hợp lý. Hãy chạy thử hoặc đọc tài liệu.' },
          },
          {
            text: { en: 'An analogy explaining how DNS works', vi: 'Một phép so sánh giải thích DNS hoạt động ra sao' },
            good: false,
            feedback: { en: 'Explanations you can evaluate yourself are low-risk.', vi: 'Lời giải thích mà bạn tự đánh giá được là rủi ro thấp.' },
          },
          {
            text: { en: 'Its opinion that your opening paragraph is weak', vi: 'Nhận xét của nó rằng đoạn mở bài của bạn còn yếu' },
            good: false,
            feedback: { en: 'Subjective feedback cannot be “false” — judge it, do not fact-check it.', vi: 'Góp ý chủ quan không thể “sai sự thật” — hãy cân nhắc nó, không cần kiểm chứng.' },
          },
        ],
      },
      action: {
        en: 'Adopt the rule: any name, number or citation you plan to reuse gets verified first.',
        vi: 'Đặt luật cho bản thân: mọi cái tên, con số hay trích dẫn bạn định dùng lại đều phải được kiểm chứng trước.',
      },
    },

    /* ------------------------------------------ 02 · Verification */
    {
      step: 2,
      icon: '🔍',
      from: { en: 'Hoping it’s right', vi: 'Hy vọng nó đúng' },
      to: { en: 'Knowing it’s right', vi: 'Biết chắc nó đúng' },
      title: { en: 'Check the load-bearing parts', vi: 'Kiểm tra những điểm chịu lực' },
      tagline: {
        en: 'Verify the facts the decision stands on.',
        vi: 'Kiểm chứng những dữ kiện mà quyết định đang đứng lên trên.',
      },
      hook: {
        en: 'You do not need to verify everything. You need to verify the parts that hold weight.',
        vi: 'Bạn không cần kiểm chứng tất cả. Bạn cần kiểm chứng những phần đang chịu lực.',
      },
      body: [
        {
          en: 'Efficient verification: identify the claims your decision actually rests on, then check just those — against a primary source, by running the code, by recomputing the number.',
          vi: 'Kiểm chứng hiệu quả: xác định những luận điểm mà quyết định của bạn thật sự dựa vào, rồi chỉ kiểm tra đúng chúng — đối chiếu nguồn gốc, chạy thử code, tính lại con số.',
        },
        {
          en: 'Make the model help: “list your claims and rate your confidence in each” turns a smooth answer into a checkable one.',
          vi: 'Hãy bắt mô hình phụ một tay: “liệt kê các luận điểm và tự chấm độ tin cậy từng cái” sẽ biến một câu trả lời mượt mà thành một câu trả lời kiểm tra được.',
        },
      ],
      example: {
        label: { en: 'The load test', vi: 'Bài kiểm tra chịu lực' },
        code: '"List every factual claim in your answer\n and mark each: certain / likely / unsure."',
      },
      challenge: {
        kind: 'order',
        prompt: { en: 'Put the verification loop in order:', vi: 'Sắp xếp vòng kiểm chứng theo đúng thứ tự:' },
        items: [
          { en: 'Get the draft answer', vi: 'Nhận câu trả lời nháp' },
          { en: 'Identify the load-bearing claims', vi: 'Xác định các luận điểm chịu lực' },
          { en: 'Check them against sources — or run the code', vi: 'Đối chiếu với nguồn — hoặc chạy thử code' },
          { en: 'Fix what failed, then use it with confidence', vi: 'Sửa chỗ sai, rồi dùng với sự tự tin' },
        ],
      },
      action: {
        en: 'For your next important AI answer, ask it to list its claims with confidence levels — then check the “unsure” ones.',
        vi: 'Với câu trả lời AI quan trọng tiếp theo, hãy yêu cầu nó liệt kê luận điểm kèm độ tin cậy — rồi kiểm tra những mục “không chắc”.',
      },
    },

    /* ---------------------------------------------- 03 · Secrets */
    {
      step: 3,
      icon: '🔑',
      from: { en: 'Paste everything', vi: 'Dán tất tần tật' },
      to: { en: 'Redact first', vi: 'Che trước khi gửi' },
      title: { en: 'Secrets stay ashore', vi: 'Bí mật ở lại bờ' },
      tagline: {
        en: 'Never hand credentials or private data to a chat window.',
        vi: 'Đừng bao giờ trao thông tin đăng nhập hay dữ liệu riêng tư cho một khung chat.',
      },
      hook: {
        en: 'The fastest way to leak a secret is to paste it somewhere convenient.',
        vi: 'Cách nhanh nhất để lộ một bí mật là dán nó vào một nơi tiện tay.',
      },
      body: [
        {
          en: 'API keys, passwords, customer PII, unreleased financials: they do not belong in prompts. Paste the shape of the problem, not the secret itself — replace sensitive values with placeholders before sending.',
          vi: 'API key, mật khẩu, dữ liệu cá nhân của khách hàng, số liệu tài chính chưa công bố: chúng không thuộc về prompt. Hãy dán hình dạng của vấn đề, chứ không phải bản thân bí mật — thay các giá trị nhạy cảm bằng placeholder trước khi gửi.',
        },
        {
          en: 'Debugging works fine on redacted data: the model needs the structure of your config, not your actual key.',
          vi: 'Gỡ lỗi trên dữ liệu đã che vẫn hiệu quả: mô hình cần cấu trúc của file config, chứ không cần chiếc chìa khoá thật của bạn.',
        },
      ],
      example: {
        label: { en: 'Redaction in practice', vi: 'Che dữ liệu trong thực tế' },
        code: '✗ DATABASE_URL=postgres://admin:Hunter2@…\n✓ DATABASE_URL=postgres://[USER]:[REDACTED]@…',
      },
      challenge: {
        kind: 'terminal',
        prompt: {
          en: 'This line is about to go into a prompt: API_KEY=sk-live-9f3k2m — type the redacted version:',
          vi: 'Dòng này sắp được dán vào prompt: API_KEY=sk-live-9f3k2m — hãy gõ phiên bản đã che:',
        },
        placeholder: 'API_KEY=…',
        pattern: '(redacted|xxx|\\*\\*\\*|đã ẩn|đã che|hidden|placeholder)',
        hint: {
          en: 'Replace the secret value with a placeholder, e.g. API_KEY=[REDACTED]',
          vi: 'Thay giá trị bí mật bằng placeholder, ví dụ API_KEY=[REDACTED]',
        },
        success: {
          en: 'The shape survives, the secret stays home.',
          vi: 'Hình dạng vấn đề được giữ nguyên, còn bí mật ở lại nhà.',
        },
      },
      action: {
        en: 'Before your next paste into any AI, scan for keys, tokens and names — and swap them for placeholders.',
        vi: 'Trước lần dán tiếp theo vào bất kỳ AI nào, hãy rà key, token và tên riêng — rồi thay chúng bằng placeholder.',
      },
    },

    /* ------------------------------------- 04 · Hands on the wheel */
    {
      step: 4,
      icon: '🚢',
      from: { en: 'Blind trust', vi: 'Tin tưởng mù quáng' },
      to: { en: 'Owned output', vi: 'Làm chủ thành phẩm' },
      title: { en: 'Autopilot still needs a pilot', vi: 'Chế độ tự lái vẫn cần phi công' },
      tagline: {
        en: 'You ship it, you own it — review what the agent did.',
        vi: 'Bạn phát hành nó, bạn chịu trách nhiệm về nó — hãy xem lại việc agent đã làm.',
      },
      hook: {
        en: 'The agent wrote 400 lines while you got coffee. Whose bug is it when production goes down? Yours.',
        vi: 'Agent viết 400 dòng code trong lúc bạn đi pha cà phê. Khi hệ thống sập, lỗi đó là của ai? Của bạn.',
      },
      body: [
        {
          en: 'Delegation is not abdication. Review diffs before merging, read the email before it sends, skim the analysis before the meeting. The faster the agent, the more valuable your judgment — it is the only part that cannot be generated.',
          vi: 'Giao việc không có nghĩa là buông tay. Xem diff trước khi merge, đọc email trước khi gửi, lướt qua bản phân tích trước cuộc họp. Agent càng nhanh, phán đoán của bạn càng đáng giá — đó là phần duy nhất không thể sinh tự động.',
        },
        {
          en: 'Right-size the review to the risk: a typo fix needs a glance; a payment flow needs a real read.',
          vi: 'Cân chỉnh mức độ kiểm tra theo rủi ro: sửa lỗi chính tả chỉ cần liếc qua; luồng thanh toán cần đọc thật sự.',
        },
      ],
      challenge: {
        kind: 'quiz',
        prompt: {
          en: 'The agent refactored your payment module and all tests pass. What now?',
          vi: 'Agent vừa tái cấu trúc module thanh toán và mọi bài test đều xanh. Bạn làm gì tiếp?',
        },
        options: [
          {
            text: { en: 'Merge it — the tests are green.', vi: 'Merge luôn — test xanh hết rồi mà.' },
            feedback: {
              en: 'Tests catch what tests cover. Payment code deserves human eyes on the diff.',
              vi: 'Test chỉ bắt được những gì test bao phủ. Code thanh toán xứng đáng có mắt người soi diff.',
            },
          },
          {
            text: {
              en: 'Read the diff, question anything you do not understand, then merge.',
              vi: 'Đọc diff, chất vấn mọi chỗ chưa hiểu, rồi mới merge.',
            },
            correct: true,
            feedback: {
              en: 'Green tests + understood changes = shippable. You own what you merge.',
              vi: 'Test xanh + thay đổi đã hiểu rõ = đủ điều kiện phát hành. Bạn làm chủ những gì bạn merge.',
            },
          },
          {
            text: {
              en: 'Ask the same agent whether its own code is safe, then merge.',
              vi: 'Hỏi chính agent đó xem code của nó có an toàn không, rồi merge.',
            },
            feedback: {
              en: 'Self-review by the author is not review. Get independent eyes — yours.',
              vi: 'Tác giả tự duyệt bài của mình thì không phải là kiểm duyệt. Cần một đôi mắt độc lập — chính là mắt bạn.',
            },
          },
        ],
      },
      action: {
        en: 'Set a personal rule: no AI output ships to customers or production without your eyes on it first.',
        vi: 'Đặt luật cá nhân: không một sản phẩm AI nào đến tay khách hàng hay lên production mà chưa qua mắt bạn.',
      },
    },

    /* -------------------------------------------- 05 · The mirror */
    {
      step: 5,
      icon: '🪞',
      from: { en: 'Echo chamber', vi: 'Phòng vọng âm' },
      to: { en: 'Honest counsel', vi: 'Lời khuyên trung thực' },
      title: { en: 'The mirror problem', vi: 'Vấn đề chiếc gương' },
      tagline: {
        en: 'Ask a leading question, get a loyal answer.',
        vi: 'Hỏi một câu dẫn dắt, nhận một câu trả lời chiều lòng.',
      },
      hook: {
        en: 'Ask “why is my plan great?” and the model will find greatness. It is a mirror with excellent manners.',
        vi: 'Hỏi “vì sao kế hoạch của tôi tuyệt vời?” và mô hình sẽ tìm ra sự tuyệt vời. Nó là một chiếc gương cực kỳ lịch thiệp.',
      },
      body: [
        {
          en: 'Models tend to agree with your framing and amplify your assumptions. If you want truth instead of comfort, engineer for dissent: ask for the strongest case against, the risks, the missing perspective.',
          vi: 'Mô hình có xu hướng đồng tình với cách bạn đặt vấn đề và khuếch đại giả định của bạn. Nếu bạn muốn sự thật thay vì sự dễ chịu, hãy chủ động thiết kế cho sự phản biện: yêu cầu lập luận phản đối mạnh nhất, các rủi ro, góc nhìn còn thiếu.',
        },
        {
          en: 'One habit fixes most of it: for every important conclusion, request the counterargument before deciding.',
          vi: 'Một thói quen chữa được gần hết: với mọi kết luận quan trọng, hãy đòi nghe lập luận ngược lại trước khi quyết định.',
        },
      ],
      challenge: {
        kind: 'match',
        prompt: { en: 'Match each trap to its safeguard:', vi: 'Ghép mỗi cái bẫy với biện pháp hoá giải:' },
        pairs: [
          {
            left: { en: 'You asked: “Why is my startup idea brilliant?”', vi: 'Bạn hỏi: “Vì sao ý tưởng startup của tôi xuất sắc?”' },
            right: { en: 'Ask instead for the 3 strongest reasons it fails', vi: 'Hãy hỏi ngược: 3 lý do mạnh nhất khiến nó thất bại' },
          },
          {
            left: { en: 'The answer flatters your draft', vi: 'Câu trả lời toàn khen bản nháp của bạn' },
            right: { en: 'Request a harsh review from a skeptical expert persona', vi: 'Yêu cầu một chuyên gia khó tính vào vai phản biện gay gắt' },
          },
          {
            left: { en: 'One perspective dominates the analysis', vi: 'Một góc nhìn thống trị cả bản phân tích' },
            right: { en: 'Ask: whose viewpoint is missing here?', vi: 'Hỏi: góc nhìn của ai đang bị bỏ sót?' },
          },
          {
            left: { en: 'You are about to decide on one AI answer', vi: 'Bạn sắp quyết định dựa trên một câu trả lời AI duy nhất' },
            right: { en: 'Get the counterargument first, then decide', vi: 'Nghe lập luận phản bác trước đã, rồi hãy quyết' },
          },
        ],
      },
      action: {
        en: 'Before your next big decision, ask the model to argue against your favorite option — steelman, not strawman.',
        vi: 'Trước quyết định lớn tiếp theo, hãy yêu cầu mô hình phản biện phương án bạn thích nhất — phản biện thép, không phải bù nhìn rơm.',
      },
    },

    /* --------------------------------------------- 06 · Capstone */
    {
      step: 6,
      icon: '⚓',
      from: { en: 'Five beacons', vi: 'Năm ngọn đèn' },
      to: { en: 'One reflex', vi: 'Một phản xạ' },
      title: { en: 'The lighthouse routine', vi: 'Nghi thức hải đăng' },
      tagline: {
        en: 'Verify, redact, review — every time, without thinking.',
        vi: 'Kiểm chứng, che bí mật, kiểm duyệt — lần nào cũng vậy, không cần nghĩ.',
      },
      hook: {
        en: 'Safety that depends on remembering will fail. Safety that became a reflex will not.',
        vi: 'Sự an toàn phụ thuộc vào trí nhớ rồi sẽ thất bại. Sự an toàn đã thành phản xạ thì không.',
      },
      body: [
        {
          en: 'The whole course compresses to one pre-flight ritual: check the load-bearing facts, strip the secrets, keep human judgment on anything that ships, and invite dissent on anything that decides.',
          vi: 'Cả khoá học nén lại thành một nghi thức tiền khởi hành: kiểm tra các dữ kiện chịu lực, gỡ sạch bí mật, giữ phán đoán con người trên mọi thứ được phát hành, và mời gọi phản biện cho mọi thứ dẫn đến quyết định.',
        },
        {
          en: 'Teams that scale AI safely are not slower — they have just made the checklist automatic. Choose the workflow you would trust with your name on it.',
          vi: 'Những đội ngũ dùng AI an toàn ở quy mô lớn không hề chậm hơn — họ chỉ biến checklist thành tự động. Hãy chọn quy trình mà bạn dám ký tên mình lên đó.',
        },
      ],
      challenge: {
        kind: 'quiz',
        prompt: {
          en: 'Which AI workflow would you trust for sending your company’s monthly investor update?',
          vi: 'Bạn sẽ tin tưởng quy trình AI nào để gửi bản cập nhật nhà đầu tư hằng tháng của công ty?',
        },
        options: [
          {
            text: {
              en: 'Agent drafts it from the metrics dashboard and auto-sends at 9:00.',
              vi: 'Agent tự soạn từ dashboard số liệu và tự động gửi lúc 9:00.',
            },
            feedback: {
              en: 'Auto-sending unreviewed numbers to investors — one hallucinated figure from disaster.',
              vi: 'Tự động gửi những con số chưa ai duyệt cho nhà đầu tư — chỉ cách thảm hoạ đúng một số liệu ảo giác.',
            },
          },
          {
            text: {
              en: 'Agent drafts from the dashboard, flags every number with its source; you verify the flags, redact the sensitive deal, then you hit send.',
              vi: 'Agent soạn từ dashboard, đánh dấu từng con số kèm nguồn; bạn kiểm chứng các mục được đánh dấu, che thương vụ nhạy cảm, rồi chính bạn bấm gửi.',
            },
            correct: true,
            feedback: {
              en: 'Verified numbers, stripped secrets, a human on the button. This is the lighthouse working.',
              vi: 'Số liệu được kiểm chứng, bí mật được gỡ bỏ, con người giữ nút gửi. Đây chính là ngọn hải đăng đang vận hành.',
            },
          },
          {
            text: {
              en: 'Write it fully by hand — AI cannot be trusted with anything.',
              vi: 'Tự viết tay toàn bộ — không thể tin AI bất cứ việc gì.',
            },
            feedback: {
              en: 'Overcorrection. The danger was never using AI; it was using it without the ritual.',
              vi: 'Sửa sai quá đà. Nguy hiểm chưa bao giờ nằm ở việc dùng AI; nó nằm ở việc dùng mà thiếu nghi thức.',
            },
          },
        ],
      },
      action: {
        en: 'Write your own 3-line pre-flight checklist and pin it where you prompt.',
        vi: 'Viết checklist tiền khởi hành 3 dòng của riêng bạn và ghim nó ngay nơi bạn gõ prompt.',
      },
    },
  ],
}
