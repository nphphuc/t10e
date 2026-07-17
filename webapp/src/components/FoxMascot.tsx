import { useReducedMotion } from 'framer-motion';

// <model-viewer> là custom element (load từ CDN trong index.html),
// khai báo type để TSX chấp nhận.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          autoplay?: boolean;
          'animation-name'?: string;
          'camera-orbit'?: string;
          'camera-target'?: string;
          'field-of-view'?: string;
          'interaction-prompt'?: string;
          'disable-zoom'?: boolean;
          'disable-pan'?: boolean;
          'disable-tap'?: boolean;
          'shadow-intensity'?: string;
          exposure?: string;
          loading?: string;
          reveal?: string;
        },
        HTMLElement
      >;
    }
  }
}

/** Các clip có trong fox.glb (merge từ 7 export Mesh2Motion) */
export type FoxClip = 'Sit' | 'Jump' | 'Howl' | 'Bark' | 'Run' | 'Walk' | 'Fall';

interface FoxMascotProps {
  /** Tên animation clip trong GLB (mặc định "Sit") */
  animation?: FoxClip;
  className?: string;
}

/**
 * Mascot cáo 3D (fox.glb ~520KB, 7 clip: Sit/Jump/Howl/Bark/Run/Walk/Fall).
 * - Nền trong suốt, không camera control — chỉ là "sinh vật sống" trang trí.
 * - Đổi prop `animation` là đổi clip đang chạy (model-viewer tự crossfade).
 * - reduced-motion: không autoplay (đứng yên ở frame đầu).
 */
export default function FoxMascot({ animation = 'Sit', className = '' }: FoxMascotProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <model-viewer
      src={`${import.meta.env.BASE_URL}mascot/fox.glb`}
      alt="Mascot cáo của khóa học"
      autoplay={!shouldReduceMotion}
      animation-name={animation}
      camera-orbit="-18deg 80deg 72%"
      camera-target="auto auto auto"
      field-of-view="20deg"
      interaction-prompt="none"
      disable-zoom
      disable-pan
      disable-tap
      shadow-intensity="0.6"
      exposure="1.1"
      loading="eager"
      reveal="auto"
      className={className}
      style={{ width: '100%', height: '100%', background: 'transparent', pointerEvents: 'none' }}
    />
  );
}
