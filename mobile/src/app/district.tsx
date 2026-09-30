import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { DISTRICTS } from '@shared';
import { nav, useApp } from '../store';
import { PickList } from '../components/Registration';

export default function District() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { st, set, toast } = useApp();
  const [q, setQ] = useState('');
  const city = st.reg.city || 'Kocaeli';
  const list = DISTRICTS[city] || ['Merkez'];
  return (
    <PickList
      title="İlçe Seç"
      heading={city}
      sub={DISTRICTS[city] ? `${city} · ${list.length} ilçe` : 'Bu demoda ilçe listesi İstanbul, Ankara, İzmir, Kocaeli ve Sakarya için dolu.'}
      query={q}
      setQuery={setQ}
      placeholder="İlçe ara"
      items={list}
      selected={st.reg.district}
      onPick={(d) => {
        set((s) => ({ reg: { ...s.reg, city, district: d } }));
        if (from === 'settings') {
          router.dismissTo('/settings/location');
          toast('Bölgen güncellendi: ' + d + ', ' + city);
        } else nav.reset('/location-permission');
      }}
    />
  );
}
