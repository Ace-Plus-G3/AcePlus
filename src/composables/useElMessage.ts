import { ElMessage } from 'element-plus';
import { h } from 'vue';

export const useElMessage = () => {
  const success = (message: string) => {
    ElMessage({
      message: h(
        'p',
        {
          style: 'color: oklch(0.723 0.219 149.579)',
        },
        message,
      ),
      type: 'success',
    });
  };
  const error = (message: string, noIcon: boolean) => {
    ElMessage({
      message: h(
        'p',
        {
          style: 'color: oklch(0.637 0.237 25.331);',
        },
        message,
      ),
      type: 'error',
      customClass: noIcon ? 'no-icon-message' : '',
    });
  };
  return {
    success,
    error,
  };
};
