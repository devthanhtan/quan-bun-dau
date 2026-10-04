/* ==========================================================================
   🎨 KAWAII VECTOR ASSETS & CHIBI CHARACTERS - QUÁN BÚN ĐẬU MƠ ƯỚC
   ========================================================================== */

export const SVG_ICONS = {
  // ==========================================
  // 🍱 MÓN ĂN KAWAII CĂNG MỌNG & BÓNG BẨY
  // ==========================================

  // Bún lá cắt miếng dẻo mịn
  bun: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <defs>
        <filter id="bunGlow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#84501a" flood-opacity="0.2"/>
        </filter>
        <linearGradient id="bunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="70%" stop-color="#fcf9f2"/>
          <stop offset="100%" stop-color="#f0e7d5"/>
        </linearGradient>
      </defs>
      <rect x="7" y="9" width="40" height="36" rx="8" fill="url(#bunGrad)" stroke="#dfd4bf" stroke-width="2.2" filter="url(#bunGlow)"/>
      <!-- Sợi bún đan tinh tế mềm mại -->
      <path d="M14 13 C14 23 18 31 14 41 M21 11 C22 21 20 31 21 43 M28 11 C29 23 27 33 28 43 M35 11 C36 21 34 31 35 43 M41 13 C41 23 38 31 41 41" stroke="#e0d4bc" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M10 20 Q27 24 44 20 M10 32 Q27 36 44 32" stroke="#efe8d8" stroke-width="1.8" fill="none"/>
      <!-- Ánh sáng bóng bẩy -->
      <circle cx="12" cy="14" r="2" fill="#fff" opacity="0.9"/>
    </svg>
  `,

  // Đậu hũ rán vàng ươm phồng rộp bốc khói thơm phức
  dau: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <defs>
        <linearGradient id="tofuGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffd152"/>
          <stop offset="45%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
        <filter id="tofuShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="2.5" flood-color="#b45309" flood-opacity="0.35"/>
        </filter>
      </defs>
      <!-- Làn khói thơm bốc lên mềm mại -->
      <path d="M18 10 Q23 5 18 1 M27 11 Q32 6 27 2 M36 10 Q41 5 36 1" stroke="#f4a261" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.85">
        <animate attributeName="d" values="M18 10 Q23 5 18 1;M18 10 Q14 5 18 1;M18 10 Q23 5 18 1" dur="2.2s" repeatCount="indefinite"/>
      </path>
      <!-- Khối đậu vàng ươm phồng giòn 3D -->
      <rect x="8" y="14" width="38" height="34" rx="8" fill="url(#tofuGold)" stroke="#b45309" stroke-width="2" filter="url(#tofuShadow)"/>
      <rect x="11" y="17" width="32" height="28" rx="6" fill="#fde047" opacity="0.85"/>
      <!-- Vết rộp phồng giòn tan -->
      <path d="M14 20 Q20 16 26 21 Q21 26 15 25 Z" fill="#f59e0b" opacity="0.7"/>
      <path d="M28 27 Q37 25 35 33 Q29 35 28 27 Z" fill="#d97706" opacity="0.75"/>
      <circle cx="18" cy="33" r="2.5" fill="#d97706" opacity="0.85"/>
      <circle cx="26" cy="38" r="2" fill="#b45309" opacity="0.7"/>
      <!-- Ánh sáng bóng mỡ -->
      <ellipse cx="14" cy="18" rx="3" ry="1.5" fill="#fff" opacity="0.85"/>
    </svg>
  `,

  // Chả cốm Hà Nội dẻo thơm hạt ngọc xanh óng
  chacom: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <defs>
        <linearGradient id="chaComGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e9c46a"/>
          <stop offset="60%" stop-color="#cb904d"/>
          <stop offset="100%" stop-color="#99582a"/>
        </linearGradient>
      </defs>
      <ellipse cx="27" cy="27" rx="22" ry="18" fill="url(#chaComGold)" stroke="#6f3b14" stroke-width="2.2"/>
      <ellipse cx="26" cy="26" rx="19" ry="15" fill="#f4d06f" opacity="0.4"/>
      <!-- Hạt cốm làng Vòng dẻo ngọc xanh bóng bẩy -->
      <circle cx="17" cy="22" r="3.5" fill="#2d6a4f" stroke="#52b788" stroke-width="1"/>
      <circle cx="28" cy="18" r="4" fill="#40916c" stroke="#74c69d" stroke-width="1.2"/>
      <circle cx="37" cy="25" r="3.2" fill="#2d6a4f" stroke="#52b788" stroke-width="1"/>
      <circle cx="22" cy="32" r="3.8" fill="#52b788" stroke="#95d5b2" stroke-width="1"/>
      <circle cx="32" cy="33" r="3.2" fill="#40916c"/>
      <circle cx="26" cy="26" r="2.8" fill="#74c69d"/>
      <circle cx="16" cy="19" r="1.5" fill="#fff" opacity="0.8"/>
    </svg>
  `,

  // Thịt chân giò luộc mỏng giòn viền da sần sật
  thit: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <defs>
        <linearGradient id="meatRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff8585"/>
          <stop offset="60%" stop-color="#e63946"/>
          <stop offset="100%" stop-color="#b51724"/>
        </linearGradient>
      </defs>
      <!-- Viền da giòn thơm ngọt -->
      <path d="M8 27 C8 15 19 8 32 8 C43 8 49 17 48 29 C47 40 35 45 22 44 C12 43 8 37 8 27 Z" fill="#ffddd2" stroke="#b06d5c" stroke-width="2.2"/>
      <!-- Lớp thịt nạc đỏ hồng ngọt nước -->
      <path d="M14 27 C14 18 22 13 32 13 C40 13 43 20 42 28 C41 36 33 40 24 39 C17 38 14 33 14 27 Z" fill="url(#meatRed)"/>
      <path d="M19 23 Q27 18 36 22 M20 29 Q28 24 37 28" stroke="#ffe5e5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="16" cy="19" r="2" fill="#fff" opacity="0.8"/>
    </svg>
  `,

  // Nem rán vỏ ram giòn rụm màu hổ phách
  nem: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <defs>
        <linearGradient id="nemAmber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="60%" stop-color="#b45309"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
      </defs>
      <rect x="8" y="18" width="38" height="18" rx="9" transform="rotate(-18 27 27)" fill="url(#nemAmber)" stroke="#451a03" stroke-width="2.2"/>
      <!-- Vết phồng giòn vỏ ram -->
      <path d="M14 25 L19 36 M23 20 L29 33 M32 17 L38 29 M39 16 L43 25" stroke="#fde68a" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="21" cy="22" r="1.8" fill="#fff" opacity="0.8"/>
    </svg>
  `,

  // Dồi sụn nướng/chiên giòn sần sật thơm nức mũi
  doi: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <defs>
        <linearGradient id="doiBrown" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#78350f"/>
          <stop offset="70%" stop-color="#451a03"/>
          <stop offset="100%" stop-color="#1f0a02"/>
        </linearGradient>
      </defs>
      <ellipse cx="27" cy="27" rx="21" ry="15" fill="url(#doiBrown)" stroke="#1a0601" stroke-width="2.2"/>
      <ellipse cx="27" cy="27" rx="16" ry="10" fill="#5c2409" opacity="0.6"/>
      <!-- Sụn trắng giòn & rau thơm tiêu sọ -->
      <circle cx="20" cy="23" r="2.8" fill="#fffdfa"/>
      <circle cx="30" cy="24" r="3" fill="#fffdfa"/>
      <circle cx="24" cy="30" r="2.2" fill="#40916c"/>
      <circle cx="33" cy="29" r="1.8" fill="#1b120c"/>
      <circle cx="17" cy="29" r="1.5" fill="#1b120c"/>
      <circle cx="18" cy="18" r="1.8" fill="#fff" opacity="0.7"/>
    </svg>
  `,

  // Rau thơm & Dưa leo giòn mát
  rau: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <!-- Lát dưa leo mọng nước -->
      <circle cx="20" cy="32" r="15" fill="#95d5b2" stroke="#2d6a4f" stroke-width="2.2"/>
      <circle cx="20" cy="32" r="10" fill="#d8f3dc"/>
      <circle cx="18" cy="27" r="2" fill="#52b788"/>
      <circle cx="23" cy="33" r="2" fill="#52b788"/>
      <circle cx="19" cy="37" r="1.8" fill="#52b788"/>
      <!-- Lá kinh giới tươi mát -->
      <path d="M24 30 C31 14 47 14 49 23 C49 33 36 42 26 35 Z" fill="#2d6a4f" stroke="#1b4332" stroke-width="2.2"/>
      <path d="M29 29 L43 20 M33 26 L36 31 M38 23 L42 27" stroke="#74c69d" stroke-width="2" stroke-linecap="round"/>
      <circle cx="15" cy="24" r="1.8" fill="#fff" opacity="0.8"/>
    </svg>
  `,

  // Chén mắm tôm Thanh Hóa bọt trắng mịn như kem béo
  mamtom: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <defs>
        <linearGradient id="sauceDeep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#581d32"/>
          <stop offset="100%" stop-color="#340616"/>
        </linearGradient>
        <radialGradient id="foamCream" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="70%" stop-color="#fed7e2"/>
          <stop offset="100%" stop-color="#e8a8c2"/>
        </radialGradient>
      </defs>
      <!-- Bát men sứ Bát Tràng -->
      <circle cx="27" cy="27" r="23" fill="#fffdfa" stroke="#84501a" stroke-width="2.8"/>
      <circle cx="27" cy="27" r="19" fill="url(#sauceDeep)"/>
      <!-- Lớp bọt trắng sủi bông mịn đỉnh chóp -->
      <circle cx="27" cy="27" r="14" fill="url(#foamCream)"/>
      <circle cx="24" cy="24" r="9" fill="#ffffff" opacity="0.85"/>
      <!-- Lát quất xanh tươi rói -->
      <circle cx="20" cy="32" r="6" fill="#8cb369" stroke="#386641" stroke-width="1.8"/>
      <circle cx="20" cy="32" r="3.5" fill="#fefae0"/>
      <!-- Lát ớt chỉ thiên đỏ rực -->
      <polygon points="28,20 37,28 27,27" fill="#e63946" stroke="#9b2226" stroke-width="1.2"/>
      <!-- Điểm sáng lấp lánh -->
      <circle cx="20" cy="18" r="1.8" fill="#fff" opacity="0.9"/>
    </svg>
  `,

  // Chén nước mắm chua ngọt tỏi ớt vàng óng
  nuocmam: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <defs>
        <radialGradient id="fishGold" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="60%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#92400e"/>
        </radialGradient>
      </defs>
      <circle cx="27" cy="27" r="23" fill="#fffdfa" stroke="#84501a" stroke-width="2.8"/>
      <circle cx="27" cy="27" r="19" fill="url(#fishGold)"/>
      <!-- Tỏi băm nhuyễn nổi bồng bềnh -->
      <circle cx="21" cy="22" r="2.5" fill="#fff"/>
      <circle cx="31" cy="21" r="2.5" fill="#fff"/>
      <circle cx="34" cy="30" r="2.5" fill="#fff"/>
      <circle cx="23" cy="31" r="2.5" fill="#fff"/>
      <circle cx="27" cy="27" r="2.5" fill="#fff"/>
      <!-- Ớt băm đỏ tươi -->
      <circle cx="26" cy="20" r="2" fill="#e63946"/>
      <circle cx="18" cy="27" r="1.8" fill="#e63946"/>
      <circle cx="32" cy="26" r="2" fill="#e63946"/>
      <circle cx="28" cy="33" r="2" fill="#e63946"/>
      <circle cx="19" cy="17" r="1.8" fill="#fff" opacity="0.9"/>
    </svg>
  `,

  // Cốc trà tắc khổng lồ mát lạnh
  tratac: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <defs>
        <linearGradient id="teaCold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="60%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <path d="M15 11 L19 45 C19 48 35 48 35 45 L39 11 Z" fill="url(#teaCold)" stroke="#b45309" stroke-width="2.2"/>
      <!-- Đá viên trong veo -->
      <rect x="22" y="18" width="10" height="10" rx="3" fill="#ffffff" opacity="0.75"/>
      <rect x="24" y="31" width="9" height="9" rx="2.5" fill="#ffffff" opacity="0.6"/>
      <!-- Lát quất vàng thanh mát -->
      <circle cx="27" cy="23" r="6" fill="#aacc00" stroke="#4d7c0f" stroke-width="1.2"/>
      <!-- Ống hút xoắn xanh ngọc -->
      <line x1="26" y1="4" x2="30" y2="40" stroke="#059669" stroke-width="3" stroke-linecap="round"/>
      <circle cx="19" cy="18" r="1.8" fill="#fff" opacity="0.8"/>
    </svg>
  `,

  // Cốc nước sấu ngâm giòn chua ngọt
  nuocsau: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <defs>
        <linearGradient id="sauCold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fed7aa"/>
          <stop offset="60%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
      </defs>
      <path d="M15 11 L19 45 C19 48 35 48 35 45 L39 11 Z" fill="url(#sauCold)" stroke="#78350f" stroke-width="2.2"/>
      <!-- Quả sấu nâu ngâm giòn tan -->
      <circle cx="26" cy="32" r="7.5" fill="#854d0e" stroke="#451a03" stroke-width="1.5"/>
      <circle cx="28" cy="30" r="2.5" fill="#ca8a04"/>
      <rect x="23" y="17" width="9" height="9" rx="2.5" fill="#ffffff" opacity="0.6"/>
      <line x1="24" y1="4" x2="28" y2="39" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,

  // Chú chó Vện ngoan ngoãn giữ xe lè lưỡi cưng xỉu
  dog_ven: `
    <svg viewBox="0 0 54 54" width="100%" height="100%">
      <defs>
        <radialGradient id="dogGold" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="70%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#92400e"/>
        </radialGradient>
      </defs>
      <!-- Tai chó tai cụp tai vểnh -->
      <path d="M13 18 L6 30 L15 27 Z" fill="#92400e" stroke="#451a03" stroke-width="1.8"/>
      <path d="M41 18 L48 30 L39 27 Z" fill="#92400e" stroke="#451a03" stroke-width="1.8"/>
      <!-- Đầu chó mặt vện rằn ri siêu cưng -->
      <circle cx="27" cy="27" r="16" fill="url(#dogGold)" stroke="#451a03" stroke-width="2"/>
      <path d="M19 16 Q27 19 35 16 M18 21 Q27 24 36 21" stroke="#78350f" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <!-- Mõm tròn trắng kem -->
      <ellipse cx="27" cy="31" rx="8" ry="6.5" fill="#fffdfa" stroke="#451a03" stroke-width="1.5"/>
      <polygon points="25,28 29,28 27,31" fill="#18181b"/>
      <!-- Mắt tròn xoe long lanh lấp lánh -->
      <circle cx="20" cy="25" r="2.8" fill="#18181b"/>
      <circle cx="19" cy="24" r="1.1" fill="#fff"/>
      <circle cx="34" cy="25" r="2.8" fill="#18181b"/>
      <circle cx="33" cy="24" r="1.1" fill="#fff"/>
      <!-- Lưỡi hồng thè le vui vẻ -->
      <path d="M25 34 C25 39 29 39 29 34 Z" fill="#fb7185"/>
      <!-- Má hồng ửng dễ thương -->
      <ellipse cx="14" cy="30" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6"/>
      <ellipse cx="40" cy="30" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6"/>
    </svg>
  `,

  // ==========================================
  // 👥 NHÂN VẬT KHÁCH HÀNG CHIBI GEN Z
  // ==========================================

  // 1. Bé Sinh Viên nữ má hồng kẹp nơ cute
  chibi_student: `
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <!-- Nơ hồng tai thỏ -->
      <path d="M22 10 Q14 2 20 14 Z M42 10 Q50 2 44 14 Z" fill="#f43f5e" stroke="#9f1239" stroke-width="1.5"/>
      <circle cx="32" cy="13" r="3.5" fill="#fb7185"/>
      <!-- Tóc mái ngố đen nhánh -->
      <circle cx="32" cy="30" r="21" fill="#18181b"/>
      <path d="M13 32 Q32 18 51 32" fill="#18181b"/>
      <!-- Khuôn mặt tròn phúng phính -->
      <circle cx="32" cy="34" r="16" fill="#ffe4e6"/>
      <path d="M19 24 Q32 29 45 24" stroke="#18181b" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Mắt to tròn long lanh háo hức -->
      <circle cx="26" cy="34" r="3.2" fill="#18181b"/>
      <circle cx="25" cy="33" r="1.2" fill="#fff"/>
      <circle cx="38" cy="34" r="3.2" fill="#18181b"/>
      <circle cx="37" cy="33" r="1.2" fill="#fff"/>
      <!-- Má hồng ửng phúng phính -->
      <circle cx="20" cy="38" r="3" fill="#fb7185" opacity="0.75"/>
      <circle cx="44" cy="38" r="3" fill="#fb7185" opacity="0.75"/>
      <!-- Miệng cười nuốt nước miếng -->
      <path d="M29 39 Q32 43 35 39" stroke="#be123c" stroke-width="2" stroke-linecap="round" fill="none"/>
      <!-- Giọt nước miếng thèm ăn -->
      <circle cx="37" cy="42" r="1.5" fill="#38bdf8"/>
    </svg>
  `,

  // 2. Anh Dân Văn Phòng trưa vội đeo thẻ nhân viên
  chibi_office: `
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <!-- Tóc chải chuốt rẽ ngôi sành điệu -->
      <ellipse cx="32" cy="27" rx="20" ry="17" fill="#27272a"/>
      <path d="M15 28 Q32 16 49 24" fill="#3f3f46"/>
      <!-- Mặt bầu bĩnh -->
      <circle cx="32" cy="34" r="16" fill="#fef3c7"/>
      <!-- Kính mắt cận thời thượng -->
      <rect x="20" y="30" width="10" height="8" rx="2" fill="none" stroke="#0284c7" stroke-width="2"/>
      <rect x="34" y="30" width="10" height="8" rx="2" fill="none" stroke="#0284c7" stroke-width="2"/>
      <line x1="30" y1="34" x2="34" y2="34" stroke="#0284c7" stroke-width="2"/>
      <!-- Mắt háo hức chờ ăn -->
      <circle cx="25" cy="34" r="2.2" fill="#18181b"/>
      <circle cx="39" cy="34" r="2.2" fill="#18181b"/>
      <!-- Cà vạt đỏ công sở -->
      <polygon points="30,48 34,48 35,58 32,61 29,58" fill="#dc2626"/>
      <!-- Miệng cười mót ăn -->
      <path d="M28 42 Q32 46 36 42" stroke="#b45309" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>
  `,

  // 3. Food Reviewer TikToker triệu view cầm micro
  chibi_reviewer: `
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <!-- Tóc xoăn thời trang cá tính -->
      <circle cx="20" cy="22" r="8" fill="#d97706"/>
      <circle cx="32" cy="18" r="9" fill="#f59e0b"/>
      <circle cx="44" cy="22" r="8" fill="#d97706"/>
      <!-- Mặt tròn dễ thương -->
      <circle cx="32" cy="34" r="16" fill="#fff1f2"/>
      <!-- Kính râm sành điệu gác trên đầu -->
      <rect x="22" y="19" width="9" height="5" rx="1.5" fill="#18181b"/>
      <rect x="33" y="19" width="9" height="5" rx="1.5" fill="#18181b"/>
      <!-- Mắt ngôi sao lấp lánh (Reviewer) -->
      <polygon points="26,30 28,34 32,34 29,37 30,41 26,38 22,41 23,37 20,34 24,34" fill="#f59e0b"/>
      <polygon points="38,30 40,34 44,34 41,37 42,41 38,38 34,41 35,37 32,34 36,34" fill="#f59e0b"/>
      <!-- Micro livestream mini góc dưới -->
      <ellipse cx="45" cy="46" rx="4" ry="6" fill="#4b5563" stroke="#1f2937" stroke-width="1.2"/>
      <line x1="45" y1="52" x2="45" y2="60" stroke="#1f2937" stroke-width="2.5"/>
      <!-- Miệng reo wow ngon quá -->
      <circle cx="32" cy="41" r="3" fill="#e11d48"/>
    </svg>
  `,

  // 4. Bác Hàng Xóm Tổ Trưởng khó tính quạt nan
  chibi_neighbor: `
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <!-- Mũ tai bèo / Mũ cối bảo hộ -->
      <path d="M12 26 C12 14 52 14 52 26 Z" fill="#15803d" stroke="#14532d" stroke-width="2"/>
      <ellipse cx="32" cy="26" rx="24" ry="5" fill="#166534"/>
      <!-- Mặt phúc hậu -->
      <circle cx="32" cy="37" r="15" fill="#ffedd5"/>
      <!-- Ria mép hài hước -->
      <path d="M25 43 Q32 40 39 43" stroke="#3f3f46" stroke-width="3" stroke-linecap="round" fill="none"/>
      <!-- Kính lão trễ mũi -->
      <circle cx="25" cy="35" r="4.5" fill="none" stroke="#71717a" stroke-width="1.8"/>
      <circle cx="39" cy="35" r="4.5" fill="none" stroke="#71717a" stroke-width="1.8"/>
      <line x1="29.5" y1="35" x2="34.5" y2="35" stroke="#71717a" stroke-width="1.8"/>
      <circle cx="25" cy="35" r="1.8" fill="#18181b"/>
      <circle cx="39" cy="35" r="1.8" fill="#18181b"/>
    </svg>
  `,

  // 5. Đại Gia Đi Mẹc Sành Ăn dây chuyền vàng
  chibi_rich: `
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <!-- Tóc vuốt bóng lộn -->
      <ellipse cx="32" cy="24" rx="20" ry="16" fill="#18181b"/>
      <path d="M14 26 Q32 12 50 26" fill="#27272a"/>
      <!-- Mặt phương phi sang trọng -->
      <circle cx="32" cy="34" r="16" fill="#fef08a"/>
      <!-- Kính đen cool ngầu đại gia -->
      <polygon points="18,30 29,30 27,37 20,37" fill="#09090b" stroke="#f59e0b" stroke-width="1.2"/>
      <polygon points="35,30 46,30 44,37 37,37" fill="#09090b" stroke="#f59e0b" stroke-width="1.2"/>
      <line x1="29" y1="33" x2="35" y2="33" stroke="#f59e0b" stroke-width="1.8"/>
      <!-- Xích vàng to bản quanh cổ -->
      <path d="M22 47 Q32 55 42 47" stroke="#eab308" stroke-width="3" stroke-linecap="round" fill="none"/>
      <!-- Nụ cười tự tin sành điệu -->
      <path d="M28 41 Q32 44 36 41" stroke="#92400e" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>
  `
};

export function renderIcon(iconKey) {
  return SVG_ICONS[iconKey] || '🥢';
}
