import { Suspense } from "react";
import { OrdersAdmin } from "@/components/admin/OrdersAdmin";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="h-[60vh]" />}>
      <OrdersAdmin />
    </Suspense>
  );
}
