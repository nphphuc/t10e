import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Đổi key này (vd: theo route) để boundary tự reset khi chuyển màn. */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

/**
 * Bắt lỗi render runtime của một trang (thay vì để React unmount toàn bộ cây
 * và để lại màn hình đen im lặng như trước — không rõ nguyên nhân, phải reload
 * mù mờ). Hiện thông báo lỗi cụ thể + nút thử lại/về bản đồ để chẩn đoán được
 * ngay lỗi gì đang xảy ra.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prevProps: Props) {
    // Route đổi (key mới) → tự reset để lần chuyển màn kế tiếp không bị dính lỗi cũ
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Lỗi khi render trang:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0d0e] p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-400">Có lỗi khi hiển thị trang này</h2>
          <p className="text-gray-400 max-w-xl">
            {this.state.error.message || 'Lỗi không xác định.'}
          </p>
          <pre className="text-xs text-gray-600 max-w-2xl overflow-auto text-left bg-black/40 p-3 rounded-lg">
            {this.state.error.stack}
          </pre>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ error: null })}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition-all"
            >
              Thử lại
            </button>
            <button
              onClick={() => {
                this.setState({ error: null });
                window.location.href = '/t10e/';
              }}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-all"
            >
              Về bản đồ
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
