import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { DesignKitStore, Preset } from '../store/DesignKitStore';
import { ICON_CHEVRON, ICON_TRASH } from '../icons';

interface PresetManagerProps {
  panelId: string;
  presets: Preset[];
  activePresetId: string | null;
  onAdd: () => void;
}

export function PresetManager({ panelId, presets, activePresetId, onAdd }: PresetManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const hasPresets = presets.length > 0;
  const activePreset = presets.find((p) => p.id === activePresetId);

  const open = useCallback(() => {
    if (!hasPresets) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setIsOpen(true);
  }, [hasPresets]);

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]);

  // Close on any mousedown outside trigger + dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      close();
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

  const handleSelect = (presetId: string | null) => {
    if (presetId) {
      DesignKitStore.loadPreset(panelId, presetId);
    } else {
      DesignKitStore.clearActivePreset(panelId);
    }
    close();
  };

  const handleDelete = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation();
    DesignKitStore.deletePreset(panelId, presetId);
  };

  return (
    <div className="design-kit-preset-manager">
      <button
        ref={triggerRef}
        className="design-kit-preset-trigger"
        onClick={toggle}
        data-open={String(isOpen)}
        data-has-preset={String(!!activePreset)}
        data-disabled={String(!hasPresets)}
      >
        <span className="design-kit-preset-label">
          {activePreset ? activePreset.name : 'Version 1'}
        </span>
        <motion.svg
          className="design-kit-select-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isOpen ? 180 : 0, opacity: hasPresets ? 0.6 : 0.25 }}
          transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
        >
          <path d={ICON_CHEVRON} />
        </motion.svg>
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              className="design-kit-root design-kit-preset-dropdown"
              style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width }}
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97, pointerEvents: 'none' as any }}
              transition={{ type: 'spring', visualDuration: 0.15, bounce: 0 }}
            >
              <div
                className="design-kit-preset-item"
                data-active={String(!activePresetId)}
                onClick={() => handleSelect(null)}
              >
                <span className="design-kit-preset-name">Version 1</span>
              </div>

              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="design-kit-preset-item"
                  data-active={String(preset.id === activePresetId)}
                  onClick={() => handleSelect(preset.id)}
                >
                  <span className="design-kit-preset-name">{preset.name}</span>
                  <button
                    className="design-kit-preset-delete"
                    onClick={(e) => handleDelete(e, preset.id)}
                    title="Delete preset"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {ICON_TRASH.map((d, i) => (
                        <path key={i} d={d} />
                      ))}
                    </svg>
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
