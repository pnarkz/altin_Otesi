import { ProducerSummary } from "@/types";

export function calculateProducerSummary(values: {
  salePrice: number;
  unitsSold: number;
  materialCost: number;
  packagingCost: number;
  shippingCost: number;
  laborHours: number;
}): ProducerSummary {
  const totalRevenue = values.salePrice * values.unitsSold;
  const totalCost = values.materialCost + values.packagingCost + values.shippingCost;
  const netProfit = totalRevenue - totalCost;
  const hourlyIncome = values.laborHours > 0 ? netProfit / values.laborHours : 0;
  const restockSuggestion = Math.max(0, netProfit * 0.25);
  const goalSuggestion = Math.max(0, Math.round(netProfit / 6));

  return {
    totalRevenue,
    totalCost,
    netProfit,
    hourlyIncome,
    restockSuggestion,
    goalSuggestion
  };
}
