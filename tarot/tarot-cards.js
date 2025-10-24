// 타로 카드 데이터 (78장)
const TAROT_CARDS = [
    // 메이저 아르카나 (22장)
    { id: 0, name: '바보 (The Fool)', image: 'cards/00_the_fool_00002_.png', type: 'major' },
    { id: 1, name: '마법사 (The Magician)', image: 'cards/01_the_magician_00002_.png', type: 'major' },
    { id: 2, name: '여사제 (The High Priestess)', image: 'cards/02_the_high_priestess_00002_.png', type: 'major' },
    { id: 3, name: '여제 (The Empress)', image: 'cards/03_the_empress_00002_.png', type: 'major' },
    { id: 4, name: '황제 (The Emperor)', image: 'cards/04_the_emperor_00002_.png', type: 'major' },
    { id: 5, name: '교황 (The Hierophant)', image: 'cards/05_the_hierophant_00002_.png', type: 'major' },
    { id: 6, name: '연인 (The Lovers)', image: 'cards/06_the_lovers_00002_.png', type: 'major' },
    { id: 7, name: '전차 (The Chariot)', image: 'cards/07_the_chariot_00002_.png', type: 'major' },
    { id: 8, name: '힘 (Strength)', image: 'cards/08_strength_00002_.png', type: 'major' },
    { id: 9, name: '은둔자 (The Hermit)', image: 'cards/09_the_hermit_00002_.png', type: 'major' },
    { id: 10, name: '운명의 수레바퀴 (Wheel of Fortune)', image: 'cards/10_wheel_of_fortune_00002_.png', type: 'major' },
    { id: 11, name: '정의 (Justice)', image: 'cards/11_justice_00002_.png', type: 'major' },
    { id: 12, name: '매달린 사람 (The Hanged Man)', image: 'cards/12_the_hanged_man_00002_.png', type: 'major' },
    { id: 13, name: '죽음 (Death)', image: 'cards/13_death_00002_.png', type: 'major' },
    { id: 14, name: '절제 (Temperance)', image: 'cards/14_temperance_00002_.png', type: 'major' },
    { id: 15, name: '악마 (The Devil)', image: 'cards/15_the_devil_00002_.png', type: 'major' },
    { id: 16, name: '탑 (The Tower)', image: 'cards/16_the_tower_00002_.png', type: 'major' },
    { id: 17, name: '별 (The Star)', image: 'cards/17_the_star_00002_.png', type: 'major' },
    { id: 18, name: '달 (The Moon)', image: 'cards/18_the_moon_00002_.png', type: 'major' },
    { id: 19, name: '태양 (The Sun)', image: 'cards/19_the_sun_00002_.png', type: 'major' },
    { id: 20, name: '심판 (Judgement)', image: 'cards/20_judgement_00002_.png', type: 'major' },
    { id: 21, name: '세계 (The World)', image: 'cards/21_the_world_00002_.png', type: 'major' },

    // 완드 (14장)
    { id: 22, name: '완드 에이스', image: 'cards/wands_ace_of_wands_00002_.png', type: 'wands' },
    { id: 23, name: '완드 2', image: 'cards/wands_two_of_wands_00002_.png', type: 'wands' },
    { id: 24, name: '완드 3', image: 'cards/wands_three_of_wands_00002_.png', type: 'wands' },
    { id: 25, name: '완드 4', image: 'cards/wands_four_of_wands_00002_.png', type: 'wands' },
    { id: 26, name: '완드 5', image: 'cards/wands_five_of_wands_00002_.png', type: 'wands' },
    { id: 27, name: '완드 6', image: 'cards/wands_six_of_wands_00002_.png', type: 'wands' },
    { id: 28, name: '완드 7', image: 'cards/wands_seven_of_wands_00002_.png', type: 'wands' },
    { id: 29, name: '완드 8', image: 'cards/wands_eight_of_wands_00002_.png', type: 'wands' },
    { id: 30, name: '완드 9', image: 'cards/wands_nine_of_wands_00002_.png', type: 'wands' },
    { id: 31, name: '완드 10', image: 'cards/wands_ten_of_wands_00002_.png', type: 'wands' },
    { id: 32, name: '완드 페이지', image: 'cards/wands_page_of_wands_00002_.png', type: 'wands' },
    { id: 33, name: '완드 나이트', image: 'cards/wands_knight_of_wands_00002_.png', type: 'wands' },
    { id: 34, name: '완드 퀸', image: 'cards/wands_queen_of_wands_00002_.png', type: 'wands' },
    { id: 35, name: '완드 킹', image: 'cards/wands_king_of_wands_00002_.png', type: 'wands' },

    // 컵 (14장)
    { id: 36, name: '컵 에이스', image: 'cards/cups_ace_of_cups_00002_.png', type: 'cups' },
    { id: 37, name: '컵 2', image: 'cards/cups_two_of_cups_00002_.png', type: 'cups' },
    { id: 38, name: '컵 3', image: 'cards/cups_three_of_cups_00002_.png', type: 'cups' },
    { id: 39, name: '컵 4', image: 'cards/cups_four_of_cups_00002_.png', type: 'cups' },
    { id: 40, name: '컵 5', image: 'cards/cups_five_of_cups_00002_.png', type: 'cups' },
    { id: 41, name: '컵 6', image: 'cards/cups_six_of_cups_00002_.png', type: 'cups' },
    { id: 42, name: '컵 7', image: 'cards/cups_seven_of_cups_00002_.png', type: 'cups' },
    { id: 43, name: '컵 8', image: 'cards/cups_eight_of_cups_00002_.png', type: 'cups' },
    { id: 44, name: '컵 9', image: 'cards/cups_nine_of_cups_00002_.png', type: 'cups' },
    { id: 45, name: '컵 10', image: 'cards/cups_ten_of_cups_00002_.png', type: 'cups' },
    { id: 46, name: '컵 페이지', image: 'cards/cups_page_of_cups_00002_.png', type: 'cups' },
    { id: 47, name: '컵 나이트', image: 'cards/cups_knight_of_cups_00002_.png', type: 'cups' },
    { id: 48, name: '컵 퀸', image: 'cards/cups_queen_of_cups_00002_.png', type: 'cups' },
    { id: 49, name: '컵 킹', image: 'cards/cups_king_of_cups_00002_.png', type: 'cups' },

    // 소드 (14장)
    { id: 50, name: '소드 에이스', image: 'cards/swords_ace_of_swords_00002_.png', type: 'swords' },
    { id: 51, name: '소드 2', image: 'cards/swords_two_of_swords_00002_.png', type: 'swords' },
    { id: 52, name: '소드 3', image: 'cards/swords_three_of_swords_00002_.png', type: 'swords' },
    { id: 53, name: '소드 4', image: 'cards/swords_four_of_swords_00002_.png', type: 'swords' },
    { id: 54, name: '소드 5', image: 'cards/swords_five_of_swords_00002_.png', type: 'swords' },
    { id: 55, name: '소드 6', image: 'cards/swords_six_of_swords_00002_.png', type: 'swords' },
    { id: 56, name: '소드 7', image: 'cards/swords_seven_of_swords_00002_.png', type: 'swords' },
    { id: 57, name: '소드 8', image: 'cards/swords_eight_of_swords_00002_.png', type: 'swords' },
    { id: 58, name: '소드 9', image: 'cards/swords_nine_of_swords_00002_.png', type: 'swords' },
    { id: 59, name: '소드 10', image: 'cards/swords_ten_of_swords_00002_.png', type: 'swords' },
    { id: 60, name: '소드 페이지', image: 'cards/swords_page_of_swords_00002_.png', type: 'swords' },
    { id: 61, name: '소드 나이트', image: 'cards/swords_knight_of_swords_00002_.png', type: 'swords' },
    { id: 62, name: '소드 퀸', image: 'cards/swords_queen_of_swords_00002_.png', type: 'swords' },
    { id: 63, name: '소드 킹', image: 'cards/swords_king_of_swords_00002_.png', type: 'swords' },

    // 펜타클 (14장)
    { id: 64, name: '펜타클 에이스', image: 'cards/pentacles_ace_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 65, name: '펜타클 2', image: 'cards/pentacles_two_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 66, name: '펜타클 3', image: 'cards/pentacles_three_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 67, name: '펜타클 4', image: 'cards/pentacles_four_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 68, name: '펜타클 5', image: 'cards/pentacles_five_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 69, name: '펜타클 6', image: 'cards/pentacles_six_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 70, name: '펜타클 7', image: 'cards/pentacles_seven_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 71, name: '펜타클 8', image: 'cards/pentacles_eight_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 72, name: '펜타클 9', image: 'cards/pentacles_nine_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 73, name: '펜타클 10', image: 'cards/pentacles_ten_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 74, name: '펜타클 페이지', image: 'cards/pentacles_page_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 75, name: '펜타클 나이트', image: 'cards/pentacles_knight_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 76, name: '펜타클 퀸', image: 'cards/pentacles_queen_of_pentacles_00002_.png', type: 'pentacles' },
    { id: 77, name: '펜타클 킹', image: 'cards/pentacles_king_of_pentacles_00002_.png', type: 'pentacles' },
];

// 카드 덱 섞기
function shuffleDeck() {
    const deck = [...TAROT_CARDS];
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// 랜덤 카드 3장 뽑기
function drawCards(count = 3) {
    const shuffled = shuffleDeck();
    return shuffled.slice(0, count);
}
