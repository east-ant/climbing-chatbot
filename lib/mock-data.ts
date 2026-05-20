// ============================================================
// ClimbMate AI - Mock 데이터
// DB나 RAG 서버가 연결되지 않았을 때 사용하는 폴백 데이터
// ============================================================

export interface Member {
  id: number;
  name: string;
  phone: string;
  membership_type: string;
  start_date: string;
  end_date: string;
  payment_status: "완료" | "미결제" | "환불";
}

export interface Gym {
  id: number;
  name: string;
  location: string;
  address: string;
  phone: string;
  open_time: string;
  close_time: string;
}

export interface Price {
  id: number;
  title: string;
  price: number;
  description: string;
}

export interface FaqDocument {
  id: number;
  category: string;
  title: string;
  content: string;
}

export interface Lesson {
  id: number;
  name: string;
  instructor: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  level: string;
  price: number;
}

export interface Plan {
  id: number;
  plan_name: string;
  price: number;
  duration_days: number;
  description: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  category: "공지" | "이벤트" | "시설" | "안전";
  created_at: string;
  expires_at: string | null;
}

export interface ChatLog {
  id: number;
  session_id: string;
  user_message: string;
  bot_response: string;
  created_at: string;
}

// ----- 회원 데이터 -----
export const mockMembers: Member[] = [
  {
    id: 1,
    name: "김지민",
    phone: "010-1234-5678",
    membership_type: "1개월",
    start_date: "2026-04-21",
    end_date: new Date().toISOString().split("T")[0],
    payment_status: "완료",
  },
  {
    id: 2,
    name: "이서연",
    phone: "010-2345-6789",
    membership_type: "3개월",
    start_date: "2026-03-22",
    end_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
    })(),
    payment_status: "완료",
  },
  {
    id: 3,
    name: "박도현",
    phone: "010-3456-7890",
    membership_type: "6개월",
    start_date: "2026-01-15",
    end_date: "2026-07-15",
    payment_status: "완료",
  },
  {
    id: 4,
    name: "최유진",
    phone: "010-4567-8901",
    membership_type: "1개월",
    start_date: "2026-04-19",
    end_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 2);
      return d.toISOString().split("T")[0];
    })(),
    payment_status: "완료",
  },
  {
    id: 5,
    name: "정하늘",
    phone: "010-5678-9012",
    membership_type: "일일권",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    payment_status: "완료",
  },
  {
    id: 6,
    name: "강민수",
    phone: "010-6789-0123",
    membership_type: "3개월",
    start_date: "2026-05-01",
    end_date: "2026-08-01",
    payment_status: "미결제",
  },
  {
    id: 7,
    name: "윤서아",
    phone: "010-7890-1234",
    membership_type: "1개월",
    start_date: "2026-05-10",
    end_date: "2026-06-10",
    payment_status: "완료",
  },
  {
    id: 8,
    name: "한준호",
    phone: "010-8901-2345",
    membership_type: "6개월",
    start_date: "2026-05-01",
    end_date: "2026-11-30",
    payment_status: "완료",
  },
];

// ----- 지점 정보 -----
export const mockGyms: Gym[] = [
  {
    id: 1,
    name: "ClimbMate 포항점",
    location: "포항",
    address: "경북 포항시 남구 상도동 123-4, 클라이밍빌딩 2F",
    phone: "054-123-4567",
    open_time: "06:00",
    close_time: "23:00",
  },
  {
    id: 2,
    name: "ClimbMate 경주점",
    location: "경주",
    address: "경북 경주시 동천동 56-7, 스포츠센터 3F",
    phone: "054-987-6543",
    open_time: "07:00",
    close_time: "22:00",
  },
];

// ----- 가격표 -----
export const mockPrices: Price[] = [
  {
    id: 1,
    title: "일일권",
    price: 15000,
    description: "당일 무제한 이용 · 암벽화 대여 포함",
  },
  {
    id: 2,
    title: "1개월",
    price: 80000,
    description: "30일 무제한 이용 · 락커 포함",
  },
  {
    id: 3,
    title: "3개월",
    price: 210000,
    description: "90일 무제한 이용 · 락커 + 개인 장비함 포함",
  },
  {
    id: 4,
    title: "6개월",
    price: 380000,
    description: "180일 무제한 이용 · 전체 혜택 포함",
  },
];

// ----- 강습 프로그램 -----
export const mockLessons: Lesson[] = [
  {
    id: 1,
    name: "초보자 기초 강습",
    instructor: "박서진",
    day_of_week: "월·수·금",
    start_time: "10:00",
    end_time: "11:00",
    level: "입문",
    price: 30000,
  },
  {
    id: 2,
    name: "초보자 기초 강습 (오후)",
    instructor: "박서진",
    day_of_week: "월·수·금",
    start_time: "14:00",
    end_time: "15:00",
    level: "입문",
    price: 30000,
  },
  {
    id: 3,
    name: "볼더링 입문 클래스",
    instructor: "김태호",
    day_of_week: "화·목",
    start_time: "19:00",
    end_time: "20:30",
    level: "초급",
    price: 40000,
  },
  {
    id: 4,
    name: "리드 클라이밍 입문",
    instructor: "김태호",
    day_of_week: "토",
    start_time: "10:00",
    end_time: "12:00",
    level: "중급",
    price: 50000,
  },
  {
    id: 5,
    name: "어린이 클라이밍 교실",
    instructor: "박서진",
    day_of_week: "토",
    start_time: "10:00",
    end_time: "11:00",
    level: "키즈",
    price: 25000,
  },
  {
    id: 6,
    name: "초보자 무료 클리닉",
    instructor: "이준혁",
    day_of_week: "화·목",
    start_time: "19:00",
    end_time: "20:00",
    level: "입문",
    price: 0,
  },
];

// ----- 멤버십 플랜 -----
export const mockPlans: Plan[] = [
  {
    id: 1,
    plan_name: "일일 체험",
    price: 15000,
    duration_days: 1,
    description: "당일 무제한 이용 · 클라이밍화 대여 포함 · 가볍게 체험해보기",
  },
  {
    id: 2,
    plan_name: "첫 방문 체험 패키지",
    price: 25000,
    duration_days: 1,
    description: "일일 이용권 + 30분 기초 강습 + 클라이밍화 대여 · 첫 방문 전용",
  },
  {
    id: 3,
    plan_name: "1개월 정기권",
    price: 80000,
    duration_days: 30,
    description: "30일 무제한 이용 · 락커 포함 · 무료 클리닉 참여",
  },
  {
    id: 4,
    plan_name: "3개월 정기권",
    price: 210000,
    duration_days: 90,
    description: "90일 무제한 · 락커 + 장비함 · 무료 클리닉 · 현재 20% 할인 중!",
  },
  {
    id: 5,
    plan_name: "6개월 정기권",
    price: 380000,
    duration_days: 180,
    description: "180일 무제한 · 전체 혜택 · 개인 레슨 1회 포함 · BEST VALUE",
  },
];

// ----- 공지사항 -----
export const mockNotices: Notice[] = [
  {
    id: 1,
    title: "🎉 첫 방문 체험 패키지 출시!",
    content:
      "클라이밍이 처음인 분을 위한 체험 패키지가 출시되었습니다. 일일 이용권 + 기초 강습 + 장비 대여 포함 25,000원! 사전 예약 시 추가 할인 혜택도 있습니다.",
    category: "이벤트",
    created_at: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 3);
      return d.toISOString().split("T")[0];
    })(),
    expires_at: null,
  },
  {
    id: 2,
    title: "🧗 여름맞이 3개월권 특별 할인 (20%)",
    content:
      "여름을 맞아 3개월 정기권을 20% 할인된 168,000원에 제공합니다! 6월 30일까지 기간 한정 이벤트입니다. 서둘러 등록하세요!",
    category: "이벤트",
    created_at: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().split("T")[0];
    })(),
    expires_at: "2026-06-30",
  },
  {
    id: 3,
    title: "🔧 정기 시설 점검 안내",
    content:
      "매월 첫째 월요일 오전 6~8시에 정기 시설 점검을 실시합니다. 점검 시간에도 일부 구역은 이용 가능합니다. 양해 부탁드립니다.",
    category: "시설",
    created_at: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      return d.toISOString().split("T")[0];
    })(),
    expires_at: null,
  },
  {
    id: 4,
    title: "⚠️ 볼더링 월 루트 세팅 안내",
    content:
      "이번 주 월요일에 A존(초급)과 B존(중급) 루트가 새로 세팅됩니다. 새로운 루트에 도전해 보세요! 세팅 당일 오전에는 해당 구역 이용이 제한됩니다.",
    category: "공지",
    created_at: new Date().toISOString().split("T")[0],
    expires_at: null,
  },
  {
    id: 5,
    title: "👨‍👩‍👧‍👦 이번 달 패밀리 데이 안내",
    content:
      "매월 마지막 토요일 오전 10시~12시에 가족 단위 클라이밍 체험 행사를 진행합니다. 가족 4인 기준 50,000원이며, 참여 가족은 월정액 등록 시 추가 10% 할인!",
    category: "이벤트",
    created_at: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 5);
      return d.toISOString().split("T")[0];
    })(),
    expires_at: null,
  },
];

// ----- 채팅 로그 (데모) -----
export const mockChatLogs: ChatLog[] = [
  {
    id: 1,
    session_id: "sess-001",
    user_message: "영업시간 알려주세요",
    bot_response: "포항점은 매일 06:00~23:00, 경주점은 07:00~22:00까지 운영합니다.",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    session_id: "sess-001",
    user_message: "초보자도 갈 수 있어요?",
    bot_response: "물론이죠! 첫 방문 시 30분 안전교육을 받으시면 바로 이용 가능합니다.",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    session_id: "sess-002",
    user_message: "주차 되나요?",
    bot_response: "포항점은 건물 지하 1층에 50대 주차 가능, 2시간 무료입니다.",
    created_at: new Date().toISOString(),
  },
];

// ----- FAQ 문서 (확장) -----
export const mockFaqDocuments: FaqDocument[] = [
  // 방문 전 문의
  {
    id: 1,
    category: "운영시간",
    title: "운영시간 안내",
    content:
      "ClimbMate 포항점은 매일 06:00~23:00, 경주점은 07:00~22:00까지 운영합니다. 공휴일도 정상 운영하며, 설날·추석 당일만 휴무입니다.",
  },
  {
    id: 2,
    category: "위치",
    title: "지점 위치 및 교통 안내",
    content:
      "포항점은 경북 포항시 남구 상도동 123-4 클라이밍빌딩 2층에 있습니다. 버스 200번, 500번 상도동 정류장 하차 후 도보 3분 거리입니다. 경주점은 경주시 동천동 56-7 스포츠센터 3층에 위치해 있습니다.",
  },
  {
    id: 3,
    category: "주차",
    title: "주차 안내",
    content:
      "포항점은 건물 지하 1층에 주차장이 있으며 50대 수용 가능합니다. 이용 고객은 2시간 무료 주차입니다. 경주점은 건물 앞 지상 주차장에 30대 무료 주차 가능합니다.",
  },
  {
    id: 4,
    category: "초보자",
    title: "초보자 이용 안내",
    content:
      "클라이밍이 처음이신 분도 환영합니다! 특별한 체력이나 경험이 필요하지 않습니다. 첫 방문 시 30분간 기본 안전교육을 받으시면 바로 초급 볼더링 월에서 클라이밍을 즐기실 수 있습니다. 첫 방문 체험 패키지(25,000원)도 준비되어 있습니다.",
  },
  {
    id: 5,
    category: "복장",
    title: "복장 및 준비물 안내",
    content:
      "편한 운동복(반바지 + 티셔츠)을 입고 오시면 됩니다. 양말은 필수이며, 반지·시계 등 액세서리는 안전상 착용할 수 없습니다. 손톱은 짧게 깎아 오시는 것을 권장합니다. 수건과 물은 센터 내에서 구비 가능합니다.",
  },
  {
    id: 6,
    category: "장비대여",
    title: "클라이밍화 및 장비 대여 안내",
    content:
      "클라이밍화는 무료로 대여해 드립니다. 일일권에 포함되어 있고, 월정액 회원도 무료입니다. 초크백과 하네스(리드 클라이밍용)도 무료 대여 가능합니다. 개인 장비 보관함은 3개월 이상 회원에게 무료 제공됩니다.",
  },
  // 요금 관련
  {
    id: 7,
    category: "가격",
    title: "이용 요금 안내",
    content:
      "일일권 15,000원, 1개월 80,000원, 3개월 210,000원, 6개월 380,000원입니다. 학생 할인(20%), 가족 할인(10%), 친구 추천 할인(15%)이 있습니다. 첫 방문 체험 패키지는 25,000원(일일권 + 기초 강습 + 장비 대여)입니다. 현재 3개월권 여름 할인 20% 이벤트 진행 중!",
  },
  {
    id: 8,
    category: "가격비교",
    title: "월정액 vs 일일권 비교",
    content:
      "주 2회 이상 방문 계획이시라면 월정액(80,000원)이 훨씬 저렴합니다. 일일권으로 주 3회 방문하면 월 약 180,000원이지만, 월정액은 80,000원에 개인 락커와 무료 클리닉 혜택까지 포함됩니다. 가끔 방문하는 분에게는 일일권을 추천합니다.",
  },
  {
    id: 9,
    category: "할인",
    title: "할인 및 이벤트 안내",
    content:
      "현재 진행 중인 할인: 학생 할인 20%(학생증 필요), 가족 할인 10%(2인 이상 동시 등록), 친구 추천 할인 15%, 얼리버드 할인 5%(오전 6~8시 방문 등록), 조기 갱신 할인 10%(만료 후 30일 이내). 여름맞이 3개월권 20% 특별 할인도 6월 30일까지 진행 중입니다!",
  },
  // 강습 관련
  {
    id: 10,
    category: "강습",
    title: "강습 프로그램 안내",
    content:
      "초보자 기초 강습(60분, 30,000원)은 매주 월·수·금 오전 10시, 오후 2시에 진행합니다. 볼더링 입문 클래스(90분, 40,000원)는 화·목 저녁 7시, 리드 클라이밍 입문(120분, 50,000원)은 토요일 오전 10시에 있습니다. 월정액 회원은 매주 화·목 저녁 7시 무료 초보자 클리닉에 참여 가능합니다!",
  },
  {
    id: 11,
    category: "강사",
    title: "강사 안내",
    content:
      "김태호 대표 강사(경력 12년, 클라이밍 지도자 1급, 볼더링·리드 담당), 박서진 강사(경력 8년, 초보자·어린이 전담), 이준혁 강사(경력 6년, V7 달성, 무료 클리닉 전담)가 있습니다. 전원 대한산악연맹 인증 자격을 보유하고 있습니다.",
  },
  // 안전/규칙
  {
    id: 12,
    category: "안전",
    title: "안전 수칙 안내",
    content:
      "첫 방문 시 30분 안전교육이 필수입니다. 주요 수칙: 클라이밍 전 10분 이상 스트레칭, 다른 클라이머 아래에 서지 않기, 3m 이상에서 뛰어내리지 않기, 액세서리 착용 금지, 음주 후 클라이밍 금지. 장비 이상 발견 시 즉시 스태프에게 알려주세요.",
  },
  {
    id: 13,
    category: "어린이",
    title: "어린이 이용 안내",
    content:
      "만 5세 이상부터 이용 가능합니다. 만 12세 이하 어린이는 보호자(만 18세 이상) 동반이 필수입니다. 포항점에는 어린이 전용 키즈 존(높이 2.5m)이 있으며, 토요일 오전 10시에 어린이 클라이밍 교실(25,000원)도 운영합니다.",
  },
  // 구역 안내
  {
    id: 14,
    category: "구역",
    title: "난이도별 구역 안내",
    content:
      "초급(V0~V2): A존 - 초록·파랑 홀드, 높이 3.5m. 중급(V2~V5): B존 - 노랑·주황 홀드, 높이 4m, 오버행 포함. 상급(V4 이상): C존 - 빨강 홀드, 높이 4.5m. 리드 월: 12m 높이, 빌레이 교육 수료 필수. 초보자는 A존부터 시작하시면 됩니다!",
  },
  // 회원권 관련
  {
    id: 15,
    category: "회원권",
    title: "회원권 만료 안내",
    content:
      "회원권 만료일은 마이페이지에서 확인하실 수 있습니다. 만료 7일 전 SMS 알림을 보내드립니다. 만료 후 30일 이내 갱신 시 10% 할인 혜택이 있습니다. 현재 회원님의 만료일을 확인하시려면 이름과 연락처를 알려주세요.",
  },
];

// ----- 챗봇 Mock 응답 (확장) -----
export function getMockChatResponse(message: string): {
  answer: string;
  sources: { title: string; content: string }[];
} {
  const msg = message.toLowerCase();

  // 인사
  if (
    msg.includes("안녕") ||
    msg.includes("하이") ||
    msg.includes("hello") ||
    msg === "hi"
  ) {
    return {
      answer:
        "안녕하세요! 🧗 ClimbMate AI입니다.\n\n처음 방문하시는 분이라면, 운영시간·위치·준비물 등 무엇이든 편하게 물어보세요!\n초보자도 안전하고 재미있게 시작할 수 있도록 도와드립니다. 😊",
      sources: [],
    };
  }

  // 운영시간
  if (
    msg.includes("운영시간") ||
    msg.includes("영업시간") ||
    msg.includes("몇시") ||
    msg.includes("오픈") ||
    msg.includes("마감")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "운영시간")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 위치/주소/교통
  if (
    msg.includes("위치") ||
    msg.includes("어디") ||
    msg.includes("주소") ||
    msg.includes("포항") ||
    msg.includes("경주") ||
    msg.includes("찾아가")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "위치")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 주차
  if (msg.includes("주차") || msg.includes("차")) {
    const doc = mockFaqDocuments.find((d) => d.category === "주차")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 초보자/입문/처음
  if (
    msg.includes("초보") ||
    msg.includes("입문") ||
    msg.includes("처음") ||
    msg.includes("시작") ||
    msg.includes("추천") ||
    msg.includes("코스") ||
    msg.includes("체험")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "초보자")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 복장/준비물/옷
  if (
    msg.includes("복장") ||
    msg.includes("준비물") ||
    msg.includes("뭐 입") ||
    msg.includes("옷") ||
    msg.includes("준비")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "복장")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 장비/클라이밍화/대여
  if (
    msg.includes("장비") ||
    msg.includes("클라이밍화") ||
    msg.includes("대여") ||
    msg.includes("렌탈") ||
    msg.includes("신발") ||
    msg.includes("초크")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "장비대여")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 월정액 vs 일일권 비교
  if (
    (msg.includes("월정액") && msg.includes("일일")) ||
    msg.includes("비교") ||
    msg.includes("뭐가 좋") ||
    msg.includes("어떤 게 나")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "가격비교")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 할인/이벤트/프로모션
  if (
    msg.includes("할인") ||
    msg.includes("이벤트") ||
    msg.includes("프로모션") ||
    msg.includes("세일") ||
    msg.includes("쿠폰")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "할인")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 가격/요금/얼마
  if (
    msg.includes("가격") ||
    msg.includes("요금") ||
    msg.includes("얼마") ||
    msg.includes("회원권") ||
    msg.includes("비용")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "가격")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 강습/레슨/수업
  if (
    msg.includes("강습") ||
    msg.includes("레슨") ||
    msg.includes("수업") ||
    msg.includes("클래스") ||
    msg.includes("배우")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "강습")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 강사
  if (msg.includes("강사") || msg.includes("선생님") || msg.includes("코치")) {
    const doc = mockFaqDocuments.find((d) => d.category === "강사")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 안전/규칙
  if (
    msg.includes("안전") ||
    msg.includes("규칙") ||
    msg.includes("금지") ||
    msg.includes("주의")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "안전")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 어린이/아이/키즈
  if (
    msg.includes("어린이") ||
    msg.includes("아이") ||
    msg.includes("키즈") ||
    msg.includes("아이들") ||
    msg.includes("나이")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "어린이")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 구역/존/난이도
  if (
    msg.includes("구역") ||
    msg.includes("존") ||
    msg.includes("난이도") ||
    msg.includes("레벨") ||
    msg.includes("색상") ||
    msg.includes("볼더링")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "구역")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 만료
  if (
    msg.includes("만료") ||
    msg.includes("기간") ||
    msg.includes("언제까지") ||
    msg.includes("갱신")
  ) {
    const doc = mockFaqDocuments.find((d) => d.category === "회원권")!;
    return {
      answer: doc.content,
      sources: [{ title: doc.title, content: doc.content }],
    };
  }

  // 혼자
  if (msg.includes("혼자") || msg.includes("같이")) {
    return {
      answer:
        "네! 볼더링은 혼자서도 할 수 있습니다. 🧗 로프 없이 낮은 벽을 오르는 스포츠라 파트너가 필요 없어요. 센터에서 자연스럽게 다른 클라이머들과 어울릴 수도 있답니다. 리드 클라이밍만 파트너가 필요합니다.",
      sources: [
        { title: "초보자 가이드", content: "볼더링은 혼자서도 즐길 수 있는 스포츠입니다." },
      ],
    };
  }

  // 기본 응답
  return {
    answer:
      "안녕하세요! ClimbMate AI입니다. 🧗\n\n클라이밍이 처음이신가요? 아래 주제에 대해 자유롭게 질문해 주세요!\n\n• 운영시간 / 위치 / 주차\n• 이용 요금 / 할인 이벤트\n• 초보자 가이드 / 준비물\n• 강습 프로그램 / 강사 소개\n• 안전 수칙 / 어린이 이용\n• 난이도별 구역 안내",
    sources: [],
  };
}
