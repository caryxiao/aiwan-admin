// 公共hooks

/**
 * 返回标签样式
 */
export const usePublicHooks = () => {
  const tagStyle = () => {
    return {
      success: {
        text: "启用",
        color: "#67c23a"
      },
      danger: {
        text: "禁用",
        color: "#f56c6c"
      }
    };
  };

  return {
    tagStyle
  };
};
