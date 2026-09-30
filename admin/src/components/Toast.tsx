export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div role="status" style={{ position: 'absolute', left: '50%', bottom: 28, transform: 'translateX(-50%)', background: '#18181B', color: '#FFFFFF', borderRadius: 12, padding: '12px 18px', fontSize: 14, boxShadow: '0 10px 30px rgba(0,0,0,.25)', animation: 'kbFade .2s', zIndex: 20 }}>
      {msg}
    </div>
  );
}
