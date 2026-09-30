import React, { useState } from 'react';
import { Modal, Platform, View } from 'react-native';
import { nav, useApp } from '../store';
import { isIOSChrome } from '../theme';
import { Btn, CheckLine, PopIn, Screen, T, Tap } from '../ui';

/**
 * Pre-permission explainer. "Konuma İzin Ver" shows the platform's system dialog
 * (drawn here for the demo; a real build would call expo-location's requestForegroundPermissionsAsync).
 */
export default function LocationPermission() {
  const { st, c, toast } = useApp();
  const [dialog, setDialog] = useState(false);
  const labels = isIOSChrome ? ['Bir Kez İzin Ver', 'Uygulamayı Kullanırken İzin Ver', 'İzin Verme'] : ['Uygulamayı kullanırken', 'Yalnızca bu sefer', 'İzin verme'];
  const choose = (i: number) => {
    setDialog(false);
    nav.reset('/home');
    toast(i < 2 ? 'Konum izni verildi. Mesafeler gösteriliyor.' : 'Konum kapalı · seçtiğin il/ilçe kullanılıyor.');
  };
  const skip = () => {
    nav.reset('/home');
    toast('Konum kapalı · ' + (st.reg.district || 'Başiskele') + ', ' + (st.reg.city || 'Kocaeli') + ' kullanılıyor.');
  };

  return (
    <Screen fill>
      <View style={{ flexGrow: 1, paddingTop: 20, paddingHorizontal: 24, paddingBottom: 44, gap: 22 }}>
        <View style={{ height: 250, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 210, height: 210, borderRadius: 105, backgroundColor: c.soft, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: c.soft2, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: c.red, alignItems: 'center', justifyContent: 'center', shadowColor: '#C4162A', shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 6 }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF' }} />
              </View>
            </View>
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <T s={26} w={700} ls={-0.02} accessibilityRole="header">Yakınındaki ihtiyaçları gösterelim mi?</T>
          <T s={15} lh={1.45} c={c.ink3}>Konumunla sana en yakın hastanelerdeki ihtiyaçları ve mesafeyi gösterebiliriz.</T>
        </View>
        <View style={{ gap: 10 }}>
          <CheckLine text="Yalnızca mesafe hesaplamak için kullanılır" color={c.ink2} />
          <CheckLine text="Kimseyle paylaşılmaz, ilanlarda görünmez" color={c.ink2} />
          <CheckLine text="İzin vermezsen seçtiğin il ve ilçe kullanılır" color={c.ink2} />
        </View>
        <View style={{ gap: 10, marginTop: 'auto' }}>
          <Btn label="Konuma İzin Ver" onPress={() => setDialog(true)} />
          <Btn label="İl / İlçe ile Devam Et" kind="secondary" onPress={skip} />
        </View>
      </View>

      <Modal visible={dialog} transparent animationType="fade" onRequestClose={() => setDialog(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
          <PopIn>
            {isIOSChrome ? (
              <View accessibilityRole="alert" style={{ width: 270, borderRadius: 14, backgroundColor: 'rgba(242,242,247,0.97)', overflow: 'hidden' }}>
                <View style={{ paddingTop: 18, paddingHorizontal: 16, paddingBottom: 14 }}>
                  <T s={17} w={600} lh={1.3} c="#000000" center style={sys}>“Kanbağ” uygulamasının konumunuzu kullanmasına izin verilsin mi?</T>
                  <T s={13} lh={1.35} c="#000000" center style={[sys, { marginTop: 6 }]}>Yakınındaki kan ihtiyaçlarını ve hastanelere olan mesafeyi göstermek için kullanılır.</T>
                </View>
                {labels.map((l, i) => (
                  <Tap key={l} onPress={() => choose(i)} scale={1} dim={0.6} style={{ height: 44, borderTopWidth: 0.5, borderTopColor: 'rgba(60,60,67,0.29)', alignItems: 'center', justifyContent: 'center' }}>
                    <T s={17} c="#0A7AFF" style={sys}>{l}</T>
                  </Tap>
                ))}
              </View>
            ) : (
              <View accessibilityRole="alert" style={{ width: 312, borderRadius: 28, backgroundColor: '#F3EDEE', padding: 24, gap: 16 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 3, borderColor: '#6B5E60', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#6B5E60' }} />
                  </View>
                </View>
                <T s={20} lh={1.3} c="#1D1B1C" center><T s={20} w={700} c="#1D1B1C">Kanbağ</T> uygulamasının bu cihazın konumuna erişmesine izin verilsin mi?</T>
                <View style={{ gap: 8 }}>
                  {labels.map((l, i) => (
                    <Tap key={l} onPress={() => choose(i)} style={{ height: 48, borderRadius: 24, backgroundColor: '#E6DADC', alignItems: 'center', justifyContent: 'center' }}>
                      <T s={15} w={600} c="#1D1B1C">{l}</T>
                    </Tap>
                  ))}
                </View>
              </View>
            )}
          </PopIn>
        </View>
      </Modal>
    </Screen>
  );
}

/** iOS system alerts use the system font, not Onest. */
const sys = Platform.select({ ios: { fontFamily: 'System' }, web: { fontFamily: '-apple-system, system-ui, sans-serif' }, default: {} });
