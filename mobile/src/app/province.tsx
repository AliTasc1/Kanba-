import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PROVINCES } from '@shared';
import { nav, useApp } from '../store';
import { PickList } from '../components/Registration';

/** İl seçimi — used by registration and by Konum ayarları (`?from=settings`). */
export default function Province() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { st, set } = useApp();
  const [q, setQ] = useState('');
  return (
    <PickList
      title="İl Seç"
      query={q}
      setQuery={setQ}
      placeholder="81 il içinde ara"
      items={PROVINCES}
      selected={st.reg.city}
      emptyText="Bu isimde bir il bulunamadı."
      onPick={(p) => {
        set((s) => ({ reg: { ...s.reg, city: p, district: '' } }));
        nav.go('/district' + (from ? '?from=' + from : ''));
      }}
    />
  );
}
