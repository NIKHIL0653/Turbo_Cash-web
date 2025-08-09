import { useUser } from "../contexts/UserContext";
import { getCurrencySymbol, formatCurrency } from "../lib/utils";

export function useCurrency() {
  const { userData } = useUser();
  const currencyCode = userData.user?.currency || "INR";
  const currencySymbol = getCurrencySymbol(currencyCode);

  const formatAmount = (amount: number | undefined | null) => {
    const safeAmount = amount ?? 0;
    return formatCurrency(safeAmount, currencyCode);
  };

  return {
    currencyCode,
    currencySymbol,
    formatAmount,
  };
}
