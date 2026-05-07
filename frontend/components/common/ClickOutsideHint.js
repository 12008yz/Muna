'use client';

/** Отступ сверху внутри блоков с `paddingTop: var(--sat)` — итого от края экрана: safe area + 10px. */
export const HINT_TOP = '10px';

const hintStyle = {
  width: '240px',
  minHeight: '40px',
  fontFamily: "'TT Firs Neue', system-ui, sans-serif",
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '105%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: 'rgba(16, 16, 16, 0.25)',
};

const defaultWrapperStyle = {
  position: 'absolute',
  width: '240px',
  left: 'calc(50% - 240px / 2)',
  top: HINT_TOP,
};

export default function ClickOutsideHint({ wrapperStyle }) {
  return (
    <div style={{ ...defaultWrapperStyle, ...wrapperStyle }}>
      <div style={hintStyle}>
        <span>Нажмите в открытое пустое место,</span>
        <span>чтобы выйти из этого режима</span>
      </div>
    </div>
  );
}

export function ClickOutsideHintContent() {
  return (
    <div style={hintStyle}>
      <span>Нажмите в открытое пустое место,</span>
      <span>чтобы выйти из этого режима</span>
    </div>
  );
}
