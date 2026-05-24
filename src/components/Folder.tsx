import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ICON_PANEL, ICON_CHEVRON } from '../icons';

interface FolderProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  isRoot?: boolean;
  inline?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  toolbar?: ReactNode;
}

export function Folder({ title, children, defaultOpen = true, isRoot = false, inline = false, onOpenChange, toolbar }: FolderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  useEffect(() => {
    if (!isRoot) return;
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isRoot]);

  // Track content height for explicit panel sizing (no height: 'auto')
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (isOpen) {
        const h = el.offsetHeight;
        setContentHeight(prev => prev === h ? prev : h);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  const handleToggle = () => {
    if (inline && isRoot) return;
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
    onOpenChange?.(next);
  };

  const folderContent = (
    <div ref={isRoot ? contentRef : undefined} className={`design-kit-folder ${isRoot ? 'design-kit-folder-root' : ''}`}>
      <div className={`design-kit-folder-header ${isRoot ? 'design-kit-panel-header' : ''}`} onClick={handleToggle}>
        <div className="design-kit-folder-header-top">
          {isRoot ? (
            isOpen && (
              <div className="design-kit-folder-title-row">
                <span className="design-kit-folder-title design-kit-folder-title-root">
                  {title}
                </span>
              </div>
            )
          ) : (
            <div className="design-kit-folder-title-row">
              <span className="design-kit-folder-title">
                {title}
              </span>
            </div>
          )}
          {isRoot && !inline && (
            <svg
              className="design-kit-panel-icon"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path opacity="0.5" d={ICON_PANEL.path} fill="currentColor"/>
              {ICON_PANEL.circles.map((c, i) => (
                <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="currentColor" stroke="currentColor" strokeWidth="1.25"/>
              ))}
            </svg>
          )}
          {!isRoot && (
            <motion.svg
              className="design-kit-folder-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ type: 'spring', visualDuration: 0.35, bounce: 0.15 }}
            >
              <path d={ICON_CHEVRON} />
            </motion.svg>
          )}
        </div>

        {isRoot && toolbar && isOpen && (
          <div className="design-kit-panel-toolbar" onClick={(e) => e.stopPropagation()}>
            {toolbar}
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="design-kit-folder-content"
            initial={isRoot ? undefined : { height: 0, opacity: 0 }}
            animate={isRoot ? undefined : { height: 'auto', opacity: 1 }}
            exit={isRoot ? undefined : { height: 0, opacity: 0 }}
            transition={isRoot ? undefined : { type: 'spring', visualDuration: 0.35, bounce: 0.1 }}
            style={isRoot ? undefined : { clipPath: 'inset(0 -20px)' }}
          >
            <div className="design-kit-folder-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isRoot) {
    if (inline) {
      return (
        <div className="design-kit-panel-inner design-kit-panel-inline">
          {folderContent}
        </div>
      );
    }

    const panelStyle = isOpen
      ? { width: 280, height: contentHeight !== undefined ? Math.min(contentHeight + 10, windowHeight - 32) : 'auto' as const, borderRadius: 14, boxShadow: 'var(--dial-shadow)', cursor: undefined as string | undefined, overflowY: 'auto' as const }
      : { width: 42, height: 42, borderRadius: '50%', boxSizing: 'border-box' as const, boxShadow: 'var(--dial-shadow-collapsed)', overflow: 'hidden' as const, cursor: 'pointer' as const };

    return (
      <motion.div
        className="design-kit-panel-inner"
        style={panelStyle}
        onClick={!isOpen ? handleToggle : undefined}
        data-collapsed={isCollapsed}
        whileTap={!isOpen ? { scale: 0.9 } : undefined}
        transition={{ type: 'spring', visualDuration: 0.15, bounce: 0.3 }}
      >
        {folderContent}
      </motion.div>
    );
  }

  return folderContent;
}
