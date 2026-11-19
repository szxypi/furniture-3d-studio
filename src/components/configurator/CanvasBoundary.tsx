'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ConfiguratorShell.module.css';

interface CanvasBoundaryProps {
  children: ReactNode;
}

interface CanvasBoundaryState {
  error: Error | null;
  attempt: number;
}

/** 捕获 3D 场景的渲染错误（例如浏览器不支持 WebGL），并提供重试。 */
export class CanvasBoundary extends Component<CanvasBoundaryProps, CanvasBoundaryState> {
  state: CanvasBoundaryState = { error: null, attempt: 0 };

  static getDerivedStateFromError(error: Error): Partial<CanvasBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('3D 场景渲染失败', error, info.componentStack);
  }

  private retry = (): void => {
    this.setState((prev) => ({ error: null, attempt: prev.attempt + 1 }));
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className={styles.fallback} role="alert">
          <p className={styles.fallbackTitle}>3D 场景无法显示</p>
          <p className={styles.fallbackText}>请确认浏览器已开启 WebGL，然后重试。</p>
          <button type="button" className={styles.secondaryButton} onClick={this.retry}>
            重试
          </button>
        </div>
      );
    }
    return <div key={this.state.attempt} className={styles.boundaryFill}>{this.props.children}</div>;
  }
}
