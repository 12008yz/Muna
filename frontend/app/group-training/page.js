import RedirectToHomeSection from '@/components/navigation/RedirectToHomeSection';

export const metadata = {
  title: 'Тарифы — MANA',
  description: 'Секция тарифов на главной странице',
};

export default function GroupTrainingRoute() {
  return <RedirectToHomeSection hash="#section-tariffs" />;
}
