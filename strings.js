const TRANSLATION_KEYS = [
    'title_main',
    'subtitle_main',
    'mode_normal',
    'mode_competition',
    'label_status',
    'label_moves',
    'label_timer',
    'label_scramble',
    'scramble_placeholder',
    'scramble_in_progress',
    'speed_label',
    'speed_fast',
    'speed_slow',
    'speed_unit_suffix',
    'language_label',
    'language_option_ko',
    'language_option_zh',
    'language_option_en',
    'language_option_ja',
    'language_option_ar',
    'language_option_hi',
    'instruction_title',
    'instruction_face_controls',
    'instruction_left_keys',
    'instruction_right_keys',
    'instruction_view',
    'instruction_undo',
    'instruction_mobile',
    'btn_scramble',
    'btn_reset',
    'btn_undo',
    'btn_solution',
    'solution_header',
    'solution_apply',
    'solution_close',
    'solution_placeholder',
    'solution_processing',
    'solution_applied_message',
    'solution_already_solved',
    'leaderboard_title',
    'leaderboard_clear',
    'leaderboard_empty',
    'meta_moves_prefix',
    'meta_penalty',
    'meta_scramble_prefix',
    'dnf_label',
    'status_complete',
    'status_in_progress',
    'status_preparing',
    'status_hold',
    'status_inspecting',
    'status_solving',
    'status_failed',
    'competition_hint',
    'overlay_prepare_title',
    'overlay_prepare_message',
    'overlay_ready_title',
    'overlay_ready_message',
    'overlay_shuffle_failed_title',
    'overlay_shuffle_failed_message',
    'overlay_retry_title',
    'overlay_retry_message',
    'overlay_hold_title',
    'overlay_hold_message',
    'overlay_inspection_title',
    'overlay_inspection_message',
    'overlay_inspection_penalty_message',
    'overlay_fail_title',
    'overlay_fail_timeout_message',
    'overlay_fail_general_message',
    'overlay_result_title',
    'overlay_result_message_prefix',
    'overlay_result_penalty_suffix',
    'overlay_solution_disabled_title',
    'overlay_solution_disabled_message',
    'timer_penalty_suffix',
    'inspection_timer_suffix',
    'menu_open',
    'menu_close'
];

const SUPPORTED_TRANSLATION_LANGS = ['ko', 'zh', 'en', 'ja', 'ar', 'hi'];

const STRINGS = {};
SUPPORTED_TRANSLATION_LANGS.forEach(lang => {
    STRINGS[lang] = {};
    TRANSLATION_KEYS.forEach(key => {
        STRINGS[lang][key] = '';
    });
});

if (typeof window !== 'undefined') {
    window.STRINGS = STRINGS;
    window.TRANSLATION_KEYS = TRANSLATION_KEYS;
    window.SUPPORTED_TRANSLATION_LANGS = SUPPORTED_TRANSLATION_LANGS;
}
