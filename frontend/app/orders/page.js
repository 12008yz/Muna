import RedirectToHomeSection from '@/components/navigation/RedirectToHomeSection';

export const metadata = {
  title: 'Заявки — МНОЖИТЕЛ',
  description: 'Внутренняя панель входящих заявок',
};

export default function OrdersRoute() {
  return <RedirectToHomeSection hash="#section-orders" />;
}
