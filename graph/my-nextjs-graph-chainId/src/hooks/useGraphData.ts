"use client";

import { useState, useEffect } from "react";
import { getERC20Transfers } from "../lib/graphql-client";
import { Transfer } from "../types";

export const useGraphData = (userAddress?: string, chainId?: number) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransfers = async () => {
      if (!userAddress) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getERC20Transfers(userAddress, chainId, 10);
        setTransfers((data as any).transfers || []);
      } catch (err) {
        setError("Failed to fetch transaction history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [userAddress, chainId]);

  return { transfers, loading, error };
};
