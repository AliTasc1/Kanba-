import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { BLOODS, HOSPITALS, lc, shortName, unitLabel, fmtPhone } from '@shared';
import { buildNeed, deadlineFor, nav, stepError, useApp, type NeedForm, type When } from '../store';
import { CheckRow, Field, Grid, Label, LockNote, Note, Pill, Radio, Screen, SearchField, SmallBtn, StepBars, T, Tap, Tile } from '../ui';
import { statusStyle } from '../ui/need';

const TITLES = [
  ['İhtiyaç bilgileri', 'Hangi kan grubuna, kaç üniteye ihtiyaç var?'],
  ['Hasta bilgileri', 'Yalnızca gerekli olanı paylaş. İlanda ad ve soyadın baş harfi görünür.'],
  ['Hastane', 'Bağışçıların gideceği hastaneyi seç.'],
  ['İhtiyaç zamanı', 'Kan ne zamana kadar gerekli?'],
  ['İletişim', 'Gönüllülerin sana nasıl ulaşacağını seç.'],
  ['Özet ve onay', 'Yayınlamadan önce bilgileri kontrol et.'],
];
const WHEN: [When, string, string, 'ACİL' | 'ÖNCELİKLİ'][] = [
  ['Şimdi', 'Şimdi', '3 saat içinde gerekli', 'ACİL'],
  ['Bugün', 'Bugün', 'Gün sonuna kadar', 'ACİL'],
  ['Yarın', 'Yarın', '24 saat içinde', 'ÖNCELİKLİ'],
  ['Belirli', 'Belirli tarih / saat', 'Planlı ameliyat vb.', 'ÖNCELİKLİ'],
];

export default function Create() {
  const { st, set, c, toast, publish } = useApp();
  const step = st.step, form = st.form;
  const scroll = useRef<ScrollView>(null);
  const err = stepError(step, form);
  const setForm = (p: Partial<NeedForm>) => set((s) => ({ form: { ...s.form, ...p } }));
  const goStep = (n: number) => { set({ step: n, stepErr: false }); scroll.current?.scrollTo({ y: 0, animated: false }); };
  const next = () => {
    if (err) { set({ stepErr: true }); return toast(err); }
    if (step === 6) return publish();
    goStep(step + 1);
  };

  const radioCard = (on: boolean, onPress: () => void, children: React.ReactNode, key: string, align: 'center' | 'flex-start' = 'center') => (
    <Tap key={key} onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} scale={0.99} style={{ flexDirection: 'row', alignItems: align, gap: 14, padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: on ? c.ink : c.line, backgroundColor: c.card }}>
      <View style={{ marginTop: align === 'flex-start' ? 1 : 0 }}><Radio on={on} /></View>
      {children}
    </Tap>
  );
  const small = (l: string, on: boolean, onPress: () => void) => (
    <Tap key={l} onPress={onPress} scale={1} style={{ flex: 1, height: 44, borderRadius: 12, borderWidth: 1, borderColor: on ? c.sel : c.line, backgroundColor: on ? c.sel : c.card, alignItems: 'center', justifyContent: 'center' }}>
      <T s={14} w={600} c={on ? c.selfg : c.ink}>{l}</T>
    </Tap>
  );

  const hq = lc(form.hq.trim());
  const hospList = HOSPITALS.filter((h) => !hq || lc(h.n + ' ' + h.d).includes(hq)).slice(0, 5);
  const hsel = HOSPITALS.find((h) => h.n === form.hospital);
  const pn = buildNeed(form);

  let body: React.ReactNode = null;
  if (step === 1)
    body = (
      <View style={{ gap: 24 }}>
        <View style={{ gap: 10 }}>
          <T s={14} w={600}>Kan grubu</T>
          <Grid cols={4}>
            {BLOODS.map((b) => (
              <Tile key={b} on={form.blood === b} onPress={() => setForm({ blood: b })} h={64} r={16}>{(fg) => <T s={20} w={700} c={fg}>{b}</T>}</Tile>
            ))}
          </Grid>
        </View>
        <View style={{ gap: 10 }}>
          <T s={14} w={600}>İhtiyaç miktarı</T>
          <Grid cols={5} gap={8}>
            {[1, 2, 3, 4, 5].map((u) => (
              <Tile key={u} on={form.units === u} onPress={() => setForm({ units: u })} h={60} r={14}>
                {(fg) => (
                  <>
                    <T s={18} w={700} c={fg}>{u === 5 ? '5+' : String(u)}</T>
                    <T s={11} c={fg}>ünite</T>
                  </>
                )}
              </Tile>
            ))}
          </Grid>
        </View>
        <T s={13} lh={1.45} c={c.ink3}>Ünite sayısından emin değilsen hastanenin kan merkezine danışabilirsin.</T>
      </View>
    );
  if (step === 2)
    body = (
      <View style={{ gap: 22 }}>
        <View style={{ gap: 8 }}>
          <Label>Hasta adı veya baş harfleri</Label>
          <Field value={form.name} onChangeText={(v) => setForm({ name: v })} placeholder="Örn. Elif Kaya veya E. K." autoCapitalize="words" />
          <T s={13} c={c.ink3}>İlanda şöyle görünür: <T s={13} w={600}>{form.name.trim() ? shortName(form.name) + ' için' : '—'}</T></T>
        </View>
        <View style={{ gap: 10 }}>
          <T s={14} w={600}>Hastanın durumu</T>
          <Grid cols={2}>
            {['Ameliyat', 'Acil tedavi', 'Yoğun bakım', 'Diğer'].map((l) => (
              <Tile key={l} on={form.cond === l} red={false} onPress={() => setForm({ cond: l })} h={56} r={14}>{(fg) => <T s={15} w={600} c={fg}>{l}</T>}</Tile>
            ))}
          </Grid>
        </View>
        <Note bg={c.asoft} fg={c.atx} icon={<T s={13} w={700} c={c.atx}>!</T>}>Tanı, hastalık adı veya TC kimlik numarası paylaşma. Bu bilgiyi yalnızca gerekli durumlarda, hastanede paylaş.</Note>
      </View>
    );
  if (step === 3)
    body = (
      <View style={{ gap: 20 }}>
        <View style={{ gap: 8 }}>
          <T s={14} w={600}>Hastane</T>
          {form.hospital ? (
            <View style={{ backgroundColor: c.card, borderWidth: 1.5, borderColor: c.ink, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <T s={15} w={600}>{form.hospital}</T>
                <T s={13} c={c.ink3}>{hsel ? hsel.d + ' / Kocaeli' : ''}</T>
              </View>
              <SmallBtn label="Değiştir" onPress={() => setForm({ hospital: '', district: '' })} />
            </View>
          ) : (
            <>
              <SearchField h={52} value={form.hq} onChangeText={(v) => setForm({ hq: v })} placeholder="Hastane adı ara" />
              <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 16, overflow: 'hidden' }}>
                {hospList.map((h) => (
                  <Tap key={h.n} onPress={() => setForm({ hospital: h.n, district: h.d, hq: '' })} scale={1} style={{ paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: c.line, gap: 2 }}>
                    <T s={15} w={500}>{h.n}</T>
                    <T s={13} c={c.ink3}>{h.d} / Kocaeli</T>
                  </Tap>
                ))}
              </View>
            </>
          )}
        </View>
        <Grid cols={2}>
          <View style={{ gap: 8 }}>
            <T s={14} w={600}>İl</T>
            <View style={{ height: 52, borderRadius: 14, backgroundColor: c.fill, justifyContent: 'center', paddingHorizontal: 14 }}><T s={15}>{form.city}</T></View>
          </View>
          <View style={{ gap: 8 }}>
            <T s={14} w={600}>İlçe</T>
            <View style={{ height: 52, borderRadius: 14, backgroundColor: c.fill, justifyContent: 'center', paddingHorizontal: 14 }}>
              <T s={15} c={form.district ? c.ink : c.ink4} lines={1}>{form.district || 'Hastane seçilince dolar'}</T>
            </View>
          </View>
        </Grid>
        <T s={12} c={c.ink3} style={{ marginTop: -10 }}>İl, ilçe ve adres seçilen hastaneye göre otomatik doldurulur.</T>
        <View style={{ gap: 8 }}>
          <Label optional>Servis / bölüm</Label>
          <Field h={52} value={form.dept} onChangeText={(v) => setForm({ dept: v })} placeholder="Örn. Hematoloji" />
        </View>
      </View>
    );
  if (step === 4)
    body = (
      <View style={{ gap: 10 }}>
        {WHEN.map(([k, t, sub, tag]) =>
          radioCard(form.when === k, () => setForm({ when: k }), (
            <>
              <View style={{ flex: 1, gap: 2 }}>
                <T s={16} w={600}>{t}</T>
                <T s={13} c={c.ink3}>{sub}</T>
              </View>
              <Pill label={tag} bg={tag === 'ACİL' ? c.soft : c.asoft} fg={tag === 'ACİL' ? c.redtx : c.atx} ls={0.05} />
            </>
          ), k),
        )}
        {form.when === 'Belirli' ? (
          <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 16, padding: 14, gap: 12 }}>
            <T s={13} w={600} c={c.ink3}>Tarih</T>
            <View style={{ flexDirection: 'row', gap: 8 }}>{['1 Eki Per', '2 Eki Cum', '3 Eki Cmt'].map((l) => small(l, form.date === l, () => setForm({ date: l })))}</View>
            <T s={13} w={600} c={c.ink3}>Saat</T>
            <View style={{ flexDirection: 'row', gap: 8 }}>{['08:00', '12:00', '16:00', '20:00'].map((l) => small(l, form.time === l, () => setForm({ time: l })))}</View>
          </View>
        ) : null}
      </View>
    );
  if (step === 5)
    body = (
      <View style={{ gap: 20 }}>
        <View style={{ gap: 8 }}>
          <Label>İletişim kurulacak kişi</Label>
          <Field value={form.cName} onChangeText={(v) => setForm({ cName: v })} placeholder="Ad Soyad" autoCapitalize="words" />
        </View>
        <View style={{ gap: 8 }}>
          <Label>Telefon</Label>
          <Field prefix="+90" value={form.cPhone} keyboardType="phone-pad" onChangeText={(v) => setForm({ cPhone: fmtPhone(v.replace(/\D/g, '').slice(0, 10)) })} placeholder="5xx xxx xx xx" />
        </View>
        <View style={{ gap: 10 }}>
          <T s={14} w={600}>İletişim tercihi</T>
          {([['app', 'Uygulama içi iletişim', 'Önerilen · numaran paylaşılmaz'], ['phone', 'Telefon', 'Numaran yalnızca bağış planını onaylayan gönüllülere gösterilir']] as const).map(([k, t, sub]) =>
            radioCard(form.pref === k, () => setForm({ pref: k }), (
              <View style={{ gap: 2, flex: 1 }}>
                <T s={16} w={600}>{t}</T>
                <T s={13} lh={1.4} c={c.ink3}>{sub}</T>
              </View>
            ), k, 'flex-start'),
          )}
        </View>
        <LockNote text="Telefon numaran ilanda hiçbir zaman herkese açık gösterilmez." />
      </View>
    );
  if (step === 6)
    body = (
      <View style={{ gap: 16 }}>
        <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 20, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' }}>
            <T s={20} w={800} c={c.redtx}>{form.blood || '—'}</T>
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            <T s={16} w={600}>{`${form.blood} · ${unitLabel(form.units)}`}</T>
            <T s={13} c={c.ink3} lines={1}>{form.hospital}</T>
            <T s={12} c={c.ink3}>Yayın sonrası: <T s={12} w={700} c={c.redtx}>{statusStyle(pn.final || 'aktif', c).l.replace('● ', '')}</T></T>
          </View>
        </View>
        <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 2 }}>
          {([
            ['İhtiyaç', `${form.blood} · ${unitLabel(form.units)}`, 1],
            ['Hasta', `${shortName(form.name)} için · ${form.cond}`, 2],
            ['Hastane', `${form.hospital}${form.dept ? ' · ' + form.dept : ''}`, 3],
            ['Zaman', deadlineFor(form), 4],
            ['İletişim', `${form.cName} · ${form.pref === 'app' ? 'Uygulama içi' : 'Telefon (gizli)'}`, 5],
          ] as const).map(([t, v, i], k, a) => (
            <View key={t} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 13, borderBottomWidth: k === a.length - 1 ? 0 : 1, borderBottomColor: c.fill }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <T s={13} c={c.ink3}>{t}</T>
                <T s={15} w={500} style={{ marginTop: 2 }}>{v}</T>
              </View>
              <Tap onPress={() => goStep(i)} scale={1} dim={0.6} style={{ height: 36, justifyContent: 'center' }}>
                <T s={14} w={600} c={c.link}>Düzenle</T>
              </Tap>
            </View>
          ))}
        </View>
        <CheckRow on={form.ok} onPress={() => setForm({ ok: !form.ok })} label="Bilgilerin doğru olduğunu ve bu ihtiyacın gerçek bir kan ihtiyacını temsil ettiğini onaylıyorum." />
        <T s={12} lh={1.45} c={c.ink3}>İlanın yayına alınmadan önce doğrulanır. Kan satışı veya ücret talebi içeren ilanlar kaldırılır.</T>
      </View>
    );

  return (
    <Screen
      scrollRef={scroll}
      above={
        <View style={{ backgroundColor: c.bg, paddingTop: 4, paddingHorizontal: 16, paddingBottom: 12, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 44 }}>
            <Tap onPress={nav.back} accessibilityLabel="Kapat" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.fill, alignItems: 'center', justifyContent: 'center' }}>
              <T s={22}>×</T>
            </Tap>
            <T s={16} w={600}>Acil Kan İhtiyacı</T>
            <T s={13} w={600} c={c.ink3} right style={{ width: 44 }}>{step}/6</T>
          </View>
          <StepBars n={6} cur={step} />
        </View>
      }
      bar={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {step > 1 ? (
            <Tap onPress={() => goStep(step - 1)} style={{ height: 56, paddingHorizontal: 22, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, justifyContent: 'center' }}>
              <T s={17} w={600}>Geri</T>
            </Tap>
          ) : null}
          <Tap onPress={next} style={{ flex: 1, height: 56, borderRadius: 16, backgroundColor: err ? c.line : c.red, alignItems: 'center', justifyContent: 'center' }}>
            <T s={17} w={600} c={err ? c.ink4 : '#FFFFFF'}>{step === 6 ? 'İhtiyacı Yayınla' : 'Devam'}</T>
          </Tap>
        </View>
      }
    >
      <View style={{ paddingTop: 8, paddingHorizontal: 20, paddingBottom: 150, gap: 24 }}>
        <View style={{ gap: 6 }}>
          <T s={26} w={700} ls={-0.02} accessibilityRole="header">{TITLES[step - 1][0]}</T>
          <T s={15} c={c.ink3}>{TITLES[step - 1][1]}</T>
          {st.stepErr && err ? (
            <View accessibilityRole="alert" style={{ marginTop: 6, backgroundColor: c.soft, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12 }}>
              <T s={14} w={500} c={c.redtx}>Eksik bilgi: {err}</T>
            </View>
          ) : null}
        </View>
        {body}
      </View>
    </Screen>
  );
}

