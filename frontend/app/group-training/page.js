import RedirectToHomeSection from '@/components/navigation/RedirectToHomeSection';

export const metadata = {
  title: 'Групповая подготовка — МНОЖИТЕЛ',
  description: 'Тариф групповой подготовки к государственным экзаменам',
};

export default function GroupTrainingRoute() {
  return <RedirectToHomeSection hash="#section-tariffs" />;
}
