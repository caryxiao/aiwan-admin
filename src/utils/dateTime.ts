import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

// 扩展 dayjs 插件
dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @param format 格式化模板，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export const formatDateTime = (
  date: string | Date | null | undefined,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  if (!date) return "-";

  try {
    return dayjs(date).format(format);
  } catch (error) {
    console.error("日期格式化失败:", error);
    return "-";
  }
};

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串 (YYYY-MM-DD)
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  return formatDateTime(date, "YYYY-MM-DD");
};

/**
 * 格式化时间
 * @param date 日期字符串或Date对象
 * @returns 格式化后的时间字符串 (HH:mm:ss)
 */
export const formatTime = (date: string | Date | null | undefined): string => {
  return formatDateTime(date, "HH:mm:ss");
};

/**
 * 获取相对时间
 * @param date 日期字符串或Date对象
 * @returns 相对时间字符串 (如: 2小时前)
 */
export const formatRelativeTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "-";

  try {
    return dayjs(date).fromNow();
  } catch (error) {
    console.error("相对时间格式化失败:", error);
    return "-";
  }
};

/**
 * 判断是否为今天
 * @param date 日期字符串或Date对象
 * @returns 是否为今天
 */
export const isToday = (date: string | Date | null | undefined): boolean => {
  if (!date) return false;

  try {
    return dayjs(date).isSame(dayjs(), "day");
  } catch (error) {
    console.error("日期比较失败:", error);
    return false;
  }
};

/**
 * 判断是否为昨天
 * @param date 日期字符串或Date对象
 * @returns 是否为昨天
 */
export const isYesterday = (
  date: string | Date | null | undefined
): boolean => {
  if (!date) return false;

  try {
    return dayjs(date).isSame(dayjs().subtract(1, "day"), "day");
  } catch (error) {
    console.error("日期比较失败:", error);
    return false;
  }
};

/**
 * 智能格式化日期时间
 * 今天显示时间，昨天显示"昨天 HH:mm"，其他显示完整日期时间
 * @param date 日期字符串或Date对象
 * @returns 智能格式化后的字符串
 */
export const formatSmartDateTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "-";

  try {
    const target = dayjs(date);
    const now = dayjs();

    if (target.isSame(now, "day")) {
      // 今天，只显示时间
      return target.format("HH:mm:ss");
    } else if (target.isSame(now.subtract(1, "day"), "day")) {
      // 昨天
      return `昨天 ${target.format("HH:mm")}`;
    } else if (target.isSame(now, "year")) {
      // 今年，不显示年份
      return target.format("MM-DD HH:mm");
    } else {
      // 其他年份，显示完整日期
      return target.format("YYYY-MM-DD HH:mm");
    }
  } catch (error) {
    console.error("智能日期格式化失败:", error);
    return "-";
  }
};

/**
 * 获取时间范围描述
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 时间范围描述
 */
export const formatDateRange = (
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined
): string => {
  if (!startDate && !endDate) return "-";
  if (!startDate) return `截止到 ${formatDate(endDate)}`;
  if (!endDate) return `从 ${formatDate(startDate)} 开始`;

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (start === end) {
    return start;
  }

  return `${start} 至 ${end}`;
};

/**
 * 计算时间差
 * @param startDate 开始时间
 * @param endDate 结束时间，默认为当前时间
 * @returns 时间差对象
 */
export const getTimeDiff = (
  startDate: string | Date,
  endDate: string | Date = new Date()
) => {
  try {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    const diffMs = end.diff(start);
    const duration = dayjs.duration(diffMs);

    return {
      milliseconds: diffMs,
      seconds: Math.floor(duration.asSeconds()),
      minutes: Math.floor(duration.asMinutes()),
      hours: Math.floor(duration.asHours()),
      days: Math.floor(duration.asDays()),
      humanized: duration.humanize()
    };
  } catch (error) {
    console.error("时间差计算失败:", error);
    return {
      milliseconds: 0,
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0,
      humanized: "-"
    };
  }
};

/**
 * 验证日期格式
 * @param date 日期字符串
 * @param format 期望的格式
 * @returns 是否为有效日期
 */
export const isValidDate = (date: string, format?: string): boolean => {
  try {
    const parsed = format ? dayjs(date, format, true) : dayjs(date);
    return parsed.isValid();
  } catch {
    return false;
  }
};

/**
 * 获取当前时间戳
 * @returns 当前时间戳（毫秒）
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * 获取当前日期时间字符串
 * @param format 格式化模板
 * @returns 当前日期时间字符串
 */
export const getCurrentDateTime = (
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  return dayjs().format(format);
};
