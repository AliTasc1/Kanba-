export function LaterView({ text }: { text: string }) {
  return (
    <div style={{ border: '1.5px dashed #D4D4D8', borderRadius: 18, padding: 40, background: 'repeating-linear-gradient(135deg,#F4F4F5 0 12px,#EDEDEF 12px 24px)', display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 640 }}>
      <div style={{ font: "600 12px 'JetBrains Mono',monospace", color: '#52525B' }}>SONRAKİ TUR</div>
      <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}
