import type { ErrorCode } from './errors.js';

export type Locale = 'en' | 'vi';

export function getLocale(): Locale {
  const envLang = process.env.AGYW_LANG || process.env.LC_ALL || process.env.LANG || 'en';
  if (envLang.toLowerCase().startsWith('vi')) {
    return 'vi';
  }
  return 'en';
}

export const ERROR_MESSAGES_EN: Record<ErrorCode, string> = {
  ERR_PROFILE_NOT_FOUND: "Profile '{name}' does not exist. Run \`agyw profile list\` to view available profiles.",
  ERR_PROFILE_EXISTS: "Profile '{name}' already exists. Use \`agyw profile list\` to view existing profiles.",
  ERR_REMOVE_ACTIVE: "Cannot remove the active profile. Switch to another profile first: \`agyw switch <other>\`.",
  ERR_REMOVE_LAST: "Cannot remove the last profile. At least 1 profile is required.",
  ERR_AMBIGUOUS_PROFILE: "Prefix '{name}' matches multiple profiles: {matches}. Please specify the full name.",
  ERR_NO_PROFILES: "No profiles configured yet. Run \`agyw init\` to get started.",
  ERR_AGY_NOT_FOUND: "\`agy\` was not found in PATH. Please install \`agy\` and ensure it is available in your PATH.",
  ERR_ANTIGRAVITY_NOT_INIT: "Directory \`~/.gemini/antigravity-cli/\` does not exist. Run \`agy\` once to initialize it.",
  ERR_CONCURRENT_SWITCH: "Another switch operation is currently running. Please try again later. Lock will expire automatically after 30 seconds.",
  ERR_ANTIGRAVITY_RUNNING: "Antigravity/agy is currently running ({detail}). This process retains credentials in memory and writes them back to storage/keychain, which invalidates profile switches and cross-contaminates credentials. Please quit Antigravity / terminate all \`agy\` processes (or run with \`-k\` / \`--kill\`), then try switching again.",
  ERR_ENV_WRITE_FAILED: "Cannot write to \`~/.gemini/antigravity-cli/\`: {detail}. Check directory permissions.",
};

export const ERROR_MESSAGES_VI: Record<ErrorCode, string> = {
  ERR_PROFILE_NOT_FOUND: "Profile '{name}' không tồn tại. Chạy \`agyw profile list\` để xem danh sách.",
  ERR_PROFILE_EXISTS: "Profile '{name}' đã tồn tại. Dùng \`agyw profile list\` để xem.",
  ERR_REMOVE_ACTIVE: "Không thể xóa profile đang active. Switch sang profile khác trước: \`agyw switch <other>\`.",
  ERR_REMOVE_LAST: "Không thể xóa profile cuối cùng. Cần ít nhất 1 profile.",
  ERR_AMBIGUOUS_PROFILE: "Prefix '{name}' khớp nhiều profile: {matches}. Hãy nhập tên đầy đủ.",
  ERR_NO_PROFILES: "Chưa có profile nào. Chạy \`agyw init\` để bắt đầu.",
  ERR_AGY_NOT_FOUND: "\`agy\` không tìm thấy trong PATH. Cài đặt \`agy\` và đảm bảo nó có trong PATH.",
  ERR_ANTIGRAVITY_NOT_INIT: "Thư mục \`~/.gemini/antigravity-cli/\` chưa tồn tại. Chạy \`agy\` lần đầu để khởi tạo.",
  ERR_CONCURRENT_SWITCH: "Đang có switch operation khác đang chạy. Thử lại sau. Lock tự xóa sau 30 giây.",
  ERR_ANTIGRAVITY_RUNNING: "Antigravity/agy đang chạy ({detail}). Tiến trình này giữ token trong RAM và ghi đè ngược lại keychain, làm switch vô hiệu và lẫn token giữa các profile. Hãy thoát hẳn Antigravity (Cmd+Q) và đóng mọi tiến trình \`agy\` (hoặc dùng cờ \`-k\` / \`--kill\`), rồi switch lại.",
  ERR_ENV_WRITE_FAILED: "Không thể ghi vào \`~/.gemini/antigravity-cli/\`: {detail}. Kiểm tra quyền truy cập thư mục.",
};
