import OrdersPanelPage from '@/components/orders/OrdersPanelPage';

export const metadata = {
  title: 'Заявки — МНОЖИТЕЛ',
  description: 'Внутренняя панель входящих заявок',
};

export default function OrdersRoute() {
  return <OrdersPanelPage />;
}
