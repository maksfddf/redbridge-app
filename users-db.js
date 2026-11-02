// ============================================================
// RedBridge — логинов здесь НЕТ осознанно.
// Все логины живут только в облаке: Supabase Auth (email
// <login>@redbridge.school) + таблица public.users (роль/класс).
// Локальных паролей НЕТ вообще — вход только через облако.
// Новые сотрудники: Dashboard → Authentication → Add user +
// insert в public.users (см. supabase-auth-setup.sql).
// ============================================================
const USERS_DB = [];
